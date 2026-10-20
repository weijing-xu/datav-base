import { createFlowChevron } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvDecoration9Props {
  color?: string;
  count?: number;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

/** Flowing chevron arrows (>>>>) sweeping across the box. */
export function DvDecoration9({ color, count, direction, speed, className, style }: DvDecoration9Props) {
  const { canvasRef } = useCanvasEffect(
    (el) => createFlowChevron(el, { color, count, direction, speed }),
    [color, count, direction, speed],
  );
  return <canvas ref={canvasRef} className={["dv-decoration", className].filter(Boolean).join(" ")} style={style} />;
}
