/**
 * Geometry descriptors for tech-style border boxes.
 * Framework shells measure the container, call `borderBoxPolys(variant, w, h, colors)`,
 * and render the returned polygons inside a full-bleed <svg viewBox="0 0 w h">.
 * Keeping the math here means React and Vue borders are pixel-identical.
 */

export interface BorderPolygon {
  /** SVG `points` attribute, e.g. "0,0 20,0 20,4 0,4". */
  points: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
  dash?: string;
}

export type BorderBoxVariant = "box1" | "box2" | "box3";

export interface BorderBoxColors {
  /** Primary line color. */
  primary: string;
  /** Accent color. */
  accent: string;
}

type Pt = [number, number];
const pts = (...list: Pt[]) => list.map(([x, y]) => `${x},${y}`).join(" ");

/** box1: thin full frame + thick L-shaped corner brackets + a diamond on the top edge. */
function box1(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const arm = Math.min(24, w * 0.08, h * 0.15); // corner bracket arm length
  const dw = 6; // diamond half-width
  const cx = w / 2;
  return [
    // thin full frame
    {
      points: pts([0, 0], [w, 0], [w, h], [0, h]),
      stroke: primary,
      strokeWidth: 1,
      opacity: 0.35,
    },
    // 4 corner brackets
    { points: pts([0, arm], [0, 0], [arm, 0]), stroke: primary, strokeWidth: 3 },
    { points: pts([w - arm, 0], [w, 0], [w, arm]), stroke: primary, strokeWidth: 3 },
    { points: pts([w, h - arm], [w, h], [w - arm, h]), stroke: primary, strokeWidth: 3 },
    { points: pts([arm, h], [0, h], [0, h - arm]), stroke: primary, strokeWidth: 3 },
    // top-center diamond
    { points: pts([cx - dw, 0], [cx, -dw], [cx + dw, 0], [cx, dw]), stroke: accent, strokeWidth: 1.5, fill: accent, opacity: 0.9 },
  ];
}

/** box2: dashed outer frame + solid thin inner frame offset by 4px. */
function box2(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const o = 4;
  return [
    {
      points: pts([1, 1], [w - 1, 1], [w - 1, h - 1], [1, h - 1], [1, 1]),
      stroke: primary,
      strokeWidth: 1,
      dash: "6 4",
    },
    {
      points: pts([o, o], [w - o, o], [w - o, h - o], [o, h - o], [o, o]),
      stroke: accent,
      strokeWidth: 1,
      opacity: 0.6,
    },
  ];
}

/** box3: layered frame — wide low-opacity stroke + inner line + corner ticks. */
function box3(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const t = 6;
  return [
    // outer glow band
    {
      points: pts([t, 0], [w - t, 0], [w, t], [w, h - t], [w - t, h], [t, h], [0, h - t], [0, t]),
      stroke: primary,
      strokeWidth: 1,
      fill: primary,
      opacity: 0.08,
    },
    // octagonal frame line
    {
      points: pts([t, 0], [w - t, 0], [w, t], [w, h - t], [w - t, h], [t, h], [0, h - t], [0, t], [t, 0]),
      stroke: primary,
      strokeWidth: 1.5,
      opacity: 0.8,
    },
    // corner accent ticks
    { points: pts([0, t * 2], [t * 2, 0]), stroke: accent, strokeWidth: 3 },
    { points: pts([w - t * 2, 0], [w, t * 2]), stroke: accent, strokeWidth: 3 },
    { points: pts([w, h - t * 2], [w - t * 2, h]), stroke: accent, strokeWidth: 3 },
    { points: pts([t * 2, h], [0, h - t * 2]), stroke: accent, strokeWidth: 3 },
  ];
}

const builders: Record<BorderBoxVariant, (w: number, h: number, colors: BorderBoxColors) => BorderPolygon[]> = {
  box1,
  box2,
  box3,
};

/**
 * Returns the polygons for a border variant at a concrete size.
 * Call again when the container resizes.
 */
export function borderBoxPolys(
  variant: BorderBoxVariant,
  width: number,
  height: number,
  colors: BorderBoxColors,
): BorderPolygon[] {
  return builders[variant](Math.max(width, 1), Math.max(height, 1), colors);
}
