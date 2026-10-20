import { createDialRing } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvDecoration8Props {
  color?: string;
  ticks?: number;
  speed?: number;
  counter?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Rotating dial ring — ticked outer circle + dashed inner ring spinning opposite ways. */
export function DvDecoration8({ color, ticks, speed, counter, className, style }: DvDecoration8Props) {
  const { canvasRef } = useCanvasEffect(
    (el) => createDialRing(el, { color, ticks, speed, counter }),
    [color, ticks, speed, counter],
  );
  return <canvas ref={canvasRef} className={["dv-decoration", className].filter(Boolean).join(" ")} style={style} />;
}
