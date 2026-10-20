import { createHexGrid } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvDecoration4Props {
  colors?: string[];
  cell?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

/** Pulsing honeycomb background decoration. */
export function DvDecoration4({ colors, cell, speed, className, style }: DvDecoration4Props) {
  const { canvasRef } = useCanvasEffect(
    (el) => createHexGrid(el, { colors, cell, speed }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- serialized for equality
    [colors?.join(","), cell, speed],
  );
  return (
    <canvas
      ref={canvasRef}
      className={["dv-decoration", className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}
