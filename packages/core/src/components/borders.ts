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

export type BorderBoxVariant =
  | "box1" | "box2" | "box3" | "box4" | "box5" | "box6"
  | "box7" | "box8" | "box9" | "box10" | "box11" | "box12" | "box13";

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

/** box4: top/bottom double lines + small square corner nodes, open sides. */
function box4(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const g = 6;
  const s = 4; // corner square half-size
  return [
    { points: pts([s * 2, 1], [w - s * 2, 1]), stroke: primary, strokeWidth: 2 },
    { points: pts([s * 2, g], [w - s * 2, g]), stroke: primary, strokeWidth: 1, opacity: 0.4 },
    { points: pts([s * 2, h - 1], [w - s * 2, h - 1]), stroke: primary, strokeWidth: 2 },
    { points: pts([s * 2, h - g], [w - s * 2, h - g]), stroke: primary, strokeWidth: 1, opacity: 0.4 },
    // corner squares
    { points: pts([0, 0], [s * 2, 0], [s * 2, s * 2], [0, s * 2]), stroke: accent, strokeWidth: 1.5 },
    { points: pts([w - s * 2, 0], [w, 0], [w, s * 2], [w - s * 2, s * 2]), stroke: accent, strokeWidth: 1.5 },
    { points: pts([w - s * 2, h - s * 2], [w, h - s * 2], [w, h], [w - s * 2, h]), stroke: accent, strokeWidth: 1.5 },
    { points: pts([0, h - s * 2], [s * 2, h - s * 2], [s * 2, h], [0, h]), stroke: accent, strokeWidth: 1.5 },
  ];
}

/** box5: left/right heavy side rails with notches + thin full frame. */
function box5(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const rail = 6;
  const notch = Math.min(40, h * 0.15);
  const cy = h / 2;
  return [
    {
      points: pts([0, 0], [w, 0], [w, h], [0, h], [0, 0]),
      stroke: primary,
      strokeWidth: 1,
      opacity: 0.3,
    },
    // left rail with center notch
    { points: pts([0, 0], [rail, 0], [rail, cy - notch / 2]), stroke: primary, strokeWidth: 2.5 },
    { points: pts([rail, cy + notch / 2], [rail, h], [0, h]), stroke: primary, strokeWidth: 2.5 },
    { points: pts([rail, cy - notch / 2], [rail * 2.5, cy], [rail, cy + notch / 2]), stroke: accent, strokeWidth: 2.5 },
    // right rail with center notch
    { points: pts([w, 0], [w - rail, 0], [w - rail, cy - notch / 2]), stroke: primary, strokeWidth: 2.5 },
    { points: pts([w - rail, cy + notch / 2], [w - rail, h], [w, h]), stroke: primary, strokeWidth: 2.5 },
    { points: pts([w - rail, cy - notch / 2], [w - rail * 2.5, cy], [w - rail, cy + notch / 2]), stroke: accent, strokeWidth: 2.5 },
  ];
}

/** box6: chamfered octagon + inner accent ticks at each chamfered corner. */
function box6(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const c = Math.min(28, w * 0.06, h * 0.2); // chamfer size
  const g = 6; // inner tick inset
  const t = 12; // tick length
  const octagon = pts(
    [c, 0], [w - c, 0], [w, c], [w, h - c], [w - c, h], [c, h], [0, h - c], [0, c], [c, 0],
  );
  return [
    { points: octagon, fill: primary, opacity: 0.06 },
    { points: octagon, stroke: primary, strokeWidth: 1.5, opacity: 0.9 },
    // inner ticks echoing the chamfered corners
    { points: pts([g, c + t], [g, g + c], [g + c, g], [c + t, g]), stroke: accent, strokeWidth: 1.5 },
    { points: pts([w - c - t, g], [w - g - c, g], [w - g, g + c], [w - g, c + t]), stroke: accent, strokeWidth: 1.5 },
    { points: pts([w - g, h - c - t], [w - g, h - g - c], [w - g - c, h - g], [w - c - t, h - g]), stroke: accent, strokeWidth: 1.5 },
    { points: pts([c + t, h - g], [g + c, h - g], [g, h - g - c], [g, h - c - t]), stroke: accent, strokeWidth: 1.5 },
  ];
}

/** box7: double-stroke full frame (thick outer + thin inner) + small corner dots. */
function box7(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const o = 6;
  const d = 3;
  return [
    {
      points: pts([0, 0], [w, 0], [w, h], [0, h], [0, 0]),
      stroke: primary,
      strokeWidth: 3,
      opacity: 0.7,
    },
    {
      points: pts([o, o], [w - o, o], [w - o, h - o], [o, h - o], [o, o]),
      stroke: primary,
      strokeWidth: 1,
      opacity: 0.5,
    },
    { points: pts([o + d, o], [o - d, o], [o - d, o - d], [o + d, o - d], [o + d, o]), fill: accent },
    { points: pts([w - o - d, o], [w - o + d, o], [w - o + d, o - d], [w - o - d, o - d], [w - o - d, o]), fill: accent },
    { points: pts([w - o - d, h - o], [w - o + d, h - o], [w - o + d, h - o + d], [w - o - d, h - o + d], [w - o - d, h - o]), fill: accent },
    { points: pts([o + d, h - o], [o - d, h - o], [o - d, h - o + d], [o + d, h - o + d], [o + d, h - o]), fill: accent },
  ];
}

/** box8: heavy top-left / bottom-right corner slabs + thin frame. */
function box8(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const a = Math.min(30, w * 0.1, h * 0.2);
  return [
    { points: pts([0, 0], [w, 0], [w, h], [0, h], [0, 0]), stroke: primary, strokeWidth: 1, opacity: 0.4 },
    { points: pts([0, a], [0, 0], [a, 0]), stroke: accent, strokeWidth: 5 },
    { points: pts([w - a, h], [w, h], [w, h - a]), stroke: accent, strokeWidth: 5 },
    { points: pts([w, a], [w, 0], [w - a, 0]), stroke: primary, strokeWidth: 2, opacity: 0.8 },
    { points: pts([a, h], [0, h], [0, h - a]), stroke: primary, strokeWidth: 2, opacity: 0.8 },
  ];
}

/** box9: beveled long edges — top/bottom trapezoid slabs + open sides. */
function box9(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const b = Math.min(36, w * 0.08);
  return [
    { points: pts([b, 0], [w - b, 0], [w - b - 6, 5], [b + 6, 5], [b, 0]), fill: primary, opacity: 0.25, stroke: primary, strokeWidth: 1 },
    { points: pts([b, h], [w - b, h], [w - b - 6, h - 5], [b + 6, h - 5], [b, h]), fill: primary, opacity: 0.25, stroke: primary, strokeWidth: 1 },
    { points: pts([0, 0], [b - 4, 0]), stroke: accent, strokeWidth: 2 },
    { points: pts([w - b + 4, 0], [w, 0]), stroke: accent, strokeWidth: 2 },
    { points: pts([0, h], [b - 4, h]), stroke: accent, strokeWidth: 2 },
    { points: pts([w - b + 4, h], [w, h]), stroke: accent, strokeWidth: 2 },
  ];
}

/** box10: thin frame + L corner brackets + two tag squares centered on the top edge. */
function box10(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const a = Math.min(22, w * 0.06, h * 0.15);
  const s = 4;
  const cx = w / 2;
  return [
    { points: pts([0, 0], [w, 0], [w, h], [0, h], [0, 0]), stroke: primary, strokeWidth: 1, opacity: 0.35 },
    { points: pts([0, a], [0, 0], [a, 0]), stroke: primary, strokeWidth: 2 },
    { points: pts([w - a, 0], [w, 0], [w, a]), stroke: primary, strokeWidth: 2 },
    { points: pts([w, h - a], [w, h], [w - a, h]), stroke: primary, strokeWidth: 2 },
    { points: pts([a, h], [0, h], [0, h - a]), stroke: primary, strokeWidth: 2 },
    { points: pts([cx - s - 8, -s], [cx - 8, -s], [cx - 8, s], [cx - s - 8, s], [cx - s - 8, -s]), fill: accent },
    { points: pts([cx + 8, -s], [cx + s + 8, -s], [cx + s + 8, s], [cx + 8, s], [cx + 8, -s]), fill: accent },
  ];
}

/** box11: single thin frame + wide title slot cut into the top edge. */
function box11(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const slot = Math.min(140, w * 0.4);
  const d = 8;
  const cx = w / 2;
  return [
    { points: pts([0, 0], [cx - slot / 2, 0]), stroke: primary, strokeWidth: 1.5 },
    { points: pts([cx + slot / 2, 0], [w, 0], [w, h], [0, h], [0, 0]), stroke: primary, strokeWidth: 1.5 },
    { points: pts([cx - slot / 2, 0], [cx - slot / 2 + d, d], [cx + slot / 2 - d, d], [cx + slot / 2, 0]), stroke: accent, strokeWidth: 1.5 },
  ];
}

/** box12: thin frame + triangle corner accents + center-top tab. */
function box12(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const a = 8;
  const tab = 26;
  const cx = w / 2;
  return [
    { points: pts([0, 0], [w, 0], [w, h], [0, h], [0, 0]), stroke: primary, strokeWidth: 1, opacity: 0.4 },
    { points: pts([0, 0], [a, 0], [0, a], [0, 0]), fill: accent },
    { points: pts([w, 0], [w - a, 0], [w, a], [w, 0]), fill: accent },
    { points: pts([w, h], [w - a, h], [w, h - a], [w, h]), fill: accent },
    { points: pts([0, h], [a, h], [0, h - a], [0, h]), fill: accent },
    { points: pts([cx - tab / 2, 0], [cx + tab / 2, 0], [cx + tab / 2 - 5, 6], [cx - tab / 2 + 5, 6], [cx - tab / 2, 0]), fill: primary, opacity: 0.6 },
  ];
}

/** box13: dashed frame + solid inner frame + side-center notches. */
function box13(w: number, h: number, { primary, accent }: BorderBoxColors): BorderPolygon[] {
  const o = 5;
  const n = Math.min(30, h * 0.12);
  const cy = h / 2;
  return [
    { points: pts([0, 0], [w, 0], [w, h], [0, h], [0, 0]), stroke: primary, strokeWidth: 1, dash: "8 5" },
    { points: pts([o, o], [w - o, o], [w - o, h - o], [o, h - o], [o, o]), stroke: primary, strokeWidth: 1, opacity: 0.45 },
    { points: pts([0, cy - n / 2], [5, cy], [0, cy + n / 2]), stroke: accent, strokeWidth: 2 },
    { points: pts([w, cy - n / 2], [w - 5, cy], [w, cy + n / 2]), stroke: accent, strokeWidth: 2 },
  ];
}

const builders: Record<BorderBoxVariant, (w: number, h: number, colors: BorderBoxColors) => BorderPolygon[]> = {
  box1,
  box2,
  box3,
  box4,
  box5,
  box6,
  box7,
  box8,
  box9,
  box10,
  box11,
  box12,
  box13,
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
