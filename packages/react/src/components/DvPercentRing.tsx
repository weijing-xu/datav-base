import { createRingProgress } from "@dv/core";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvPercentRingProps {
  /** Percent 0-100. */
  value: number;
  /** Box size in px. Default 120. */
  size?: number;
  thickness?: number;
  colors?: [string, string];
  /** Center label; defaults to `<value>%`. */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Gradient percent ring with a glow head; center label is slotted. */
export function DvPercentRing({ value, size = 120, thickness, colors, children, className, style }: DvPercentRingProps) {
  const { canvasRef, handleRef } = useCanvasEffect(
    (el) => createRingProgress(el, { value, thickness, colors }),
    [thickness, colors?.join(",")],
  );

  useEffect(() => {
    handleRef.current?.setValue(value);
  }, [value, handleRef]);

  return (
    <span
      className={["dv-percent-ring", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, ...style }}
    >
      <canvas ref={canvasRef} />
      <span className="dv-percent-ring-label">{children ?? `${Math.round(value)}%`}</span>
    </span>
  );
}
