import { onResize } from "../layout/resize";
import type { EffectHandle } from "../types";

export interface GeoJSONFeature {
  type: "Feature";
  properties?: { name?: string; [k: string]: unknown };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoJSONCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface GeoMapOptions {
  geoJson: GeoJSONCollection;
  fill?: string;
  stroke?: string;
  /** Feature names rendered with a soft pulse. */
  highlight?: string[];
  highlightColor?: string;
  labelColor?: string;
  showLabels?: boolean;
}

type Ring = [number, number][];

function ringsOf(f: GeoJSONFeature): Ring[] {
  if (f.geometry.type === "Polygon") {
    return (f.geometry.coordinates as number[][][]).map((r) => r as Ring);
  }
  return (f.geometry.coordinates as number[][][][]).flat().map((r) => r as Ring);
}

export interface GeoBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function geoBounds(geoJson: GeoJSONCollection): GeoBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const f of geoJson.features) {
    for (const ring of ringsOf(f)) {
      for (const [x, y] of ring) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

export type GeoProjector = (x: number, y: number, w: number, h: number) => [number, number];

/**
 * Equirectangular projector fit to (w,h) with padding — shared by createGeoMap
 * and createFlylines so overlays land on the same pixels.
 */
export function createGeoProjector(geoJson: GeoJSONCollection, pad = 12): GeoProjector {
  const { minX, minY, maxX, maxY } = geoBounds(geoJson);
  const spanX = Math.max(1e-6, maxX - minX);
  const spanY = Math.max(1e-6, maxY - minY);
  return (x, y, w, h) => {
    const s = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanY);
    const ox = pad + (w - pad * 2 - spanX * s) / 2;
    const oy = pad + (h - pad * 2 - spanY * s) / 2;
    return [ox + (x - minX) * s, oy + (maxY - y) * s];
  };
}

/** Renders a GeoJSON FeatureCollection, equirectangular-projected to fit the canvas. */
export function createGeoMap(canvas: HTMLCanvasElement, options: GeoMapOptions): EffectHandle {
  const {
    geoJson,
    fill = "rgba(0,246,255,0.05)",
    stroke = "rgba(0,246,255,0.5)",
    highlight = [],
    highlightColor = "rgba(0,246,255,0.28)",
    labelColor = "#8fb3cf",
    showLabels = true,
  } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[dv] createGeoMap: 2d context unavailable");

  let rafId = 0;
  let running = false;
  let w = 0;
  let h = 0;
  const projector = createGeoProjector(geoJson);
  const project = (x: number, y: number): [number, number] => projector(x, y, w, h);

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);

    for (const f of geoJson.features) {
      const name = f.properties?.name ?? "";
      const hot = highlight.includes(name);
      for (const ring of ringsOf(f)) {
        ctx.beginPath();
        ring.forEach(([x, y], i) => {
          const [px, py] = project(x, y);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fillStyle = hot ? highlightColor : fill;
        ctx.globalAlpha = hot ? 0.5 + pulse * 0.5 : 1;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = hot ? highlightColor : stroke;
        ctx.lineWidth = hot ? 1.6 : 1;
        ctx.stroke();
      }
      if (showLabels && name) {
        // label at centroid of first ring
        const ring = ringsOf(f)[0];
        if (!ring) continue;
        let sx = 0;
        let sy = 0;
        for (const [x, y] of ring) {
          sx += x;
          sy += y;
        }
        const [lx, ly] = project(sx / ring.length, sy / ring.length);
        ctx.fillStyle = labelColor;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name, lx, ly);
      }
    }
  };

  const frame = (now: number) => {
    draw(now / 1000);
    if (running) rafId = requestAnimationFrame(frame);
  };

  const offResize = onResize(canvas, () => {
    resize();
    draw(0);
  });
  resize();
  running = highlight.length > 0;
  if (running) rafId = requestAnimationFrame(frame);
  else draw(0);

  return {
    start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
    resize,
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      offResize();
      ctx.clearRect(0, 0, w, h);
    },
  };
}
