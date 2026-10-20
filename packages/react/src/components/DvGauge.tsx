import { createGauge } from "@dv/core";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvGaugeProps {
  value: number;
  min?: number;
  max?: number;
  /** Box size in px. Default 160. */
  size?: number;
  /** Center label; defaults to the raw value. */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Dashboard gauge: arc + ticks + glowing needle, animated via `setValue`. */
export function DvGauge({ value, min, max, size = 160, children, className, style }: DvGaugeProps) {
  const { canvasRef, handleRef } = useCanvasEffect(
    (el) => createGauge(el, { value, min, max }),
    [min, max],
  );

  useEffect(() => {
    handleRef.current?.setValue(value);
  }, [value, handleRef]);

  return (
    <span
      className={["dv-gauge", "dv-percent-ring", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, ...style }}
    >
      <canvas ref={canvasRef} />
      <span className="dv-percent-ring-label">{children ?? Math.round(value)}</span>
    </span>
  );
}
