import { createCornerScan } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvDecoration10Props {
  color?: string;
  size?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

/** Four pulsing corner brackets (HUD reticle decoration). */
export function DvDecoration10({ color, size, speed, className, style }: DvDecoration10Props) {
  const { canvasRef } = useCanvasEffect(
    (el) => createCornerScan(el, { color, size, speed }),
    [color, size, speed],
  );
  return <canvas ref={canvasRef} className={["dv-decoration", className].filter(Boolean).join(" ")} style={style} />;
}
