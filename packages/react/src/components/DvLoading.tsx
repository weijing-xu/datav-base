import { createLoadingRing } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvLoadingProps {
  /** Box size in px. Default 64. */
  size?: number;
  /** Center text. Default "LOADING". */
  text?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

/** Spinning arc ring with a center label. */
export function DvLoading({ size = 64, text = "LOADING", color, className, style }: DvLoadingProps) {
  const { canvasRef } = useCanvasEffect((el) => createLoadingRing(el, { color }), [color]);
  return (
    <span
      className={["dv-loading", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, ...style }}
    >
      <canvas ref={canvasRef} />
      <span className="dv-loading-text">{text}</span>
    </span>
  );
}
