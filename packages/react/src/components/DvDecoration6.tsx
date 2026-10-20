import { createPulseRings } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvDecoration6Props {
  color?: string;
  rings?: number;
  period?: number;
  className?: string;
  style?: CSSProperties;
}

/** Canvas decoration: concentric sonar-like expanding rings. Fills its parent. */
export function DvDecoration6({ color, rings, period, className, style }: DvDecoration6Props) {
  const { canvasRef } = useCanvasEffect((el) => createPulseRings(el, { color, rings, period }), [color, rings, period]);
  return <canvas ref={canvasRef} className={["dv-decoration", className].filter(Boolean).join(" ")} style={style} />;
}
