import { createStripeFlow } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvDecoration7Props {
  color?: string;
  spacing?: number;
  speed?: number;
  angle?: number;
  className?: string;
  style?: CSSProperties;
}

/** Canvas decoration: diagonal stripes flowing across the panel. Fills its parent. */
export function DvDecoration7({ color, spacing, speed, angle, className, style }: DvDecoration7Props) {
  const { canvasRef } = useCanvasEffect(
    (el) => createStripeFlow(el, { color, spacing, speed, angle }),
    [color, spacing, speed, angle],
  );
  return <canvas ref={canvasRef} className={["dv-decoration", className].filter(Boolean).join(" ")} style={style} />;
}
