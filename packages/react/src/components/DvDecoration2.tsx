import { createScanline } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvDecoration2Props {
  color?: string;
  period?: number;
  barWidth?: number;
  className?: string;
  style?: CSSProperties;
}

/** Horizontal light bar sweeping left/right — classic title underline decoration. */
export function DvDecoration2({ color, period, barWidth, className, style }: DvDecoration2Props) {
  const { canvasRef } = useCanvasEffect(
    (el) => createScanline(el, { color, period, barWidth }),
    [color, period, barWidth],
  );
  return (
    <canvas
      ref={canvasRef}
      className={["dv-decoration", className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}
