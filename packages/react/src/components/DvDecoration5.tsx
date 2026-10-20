import { createOrbitDots } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvDecoration5Props {
  color?: string;
  count?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

/** Canvas decoration: glowing dots orbiting an elliptical ring. Fills its parent. */
export function DvDecoration5({ color, count, speed, className, style }: DvDecoration5Props) {
  const { canvasRef } = useCanvasEffect((el) => createOrbitDots(el, { color, count, speed }), [color, count, speed]);
  return <canvas ref={canvasRef} className={["dv-decoration", className].filter(Boolean).join(" ")} style={style} />;
}
