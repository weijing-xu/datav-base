import { createRadarSweep } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvDecoration3Props {
  color?: string;
  period?: number;
  rings?: number;
  className?: string;
  style?: CSSProperties;
}

/** Radar sweep decoration: rings + rotating wedge. */
export function DvDecoration3({ color, period, rings, className, style }: DvDecoration3Props) {
  const { canvasRef } = useCanvasEffect(
    (el) => createRadarSweep(el, { color, period, rings }),
    [color, period, rings],
  );
  return (
    <canvas
      ref={canvasRef}
      className={["dv-decoration", className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}
