import { createWaveFill, type WaveFillHandle } from "@dv/core";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvWaterLevelPondProps {
  /** Fill percentage 0-100; animates on change. */
  value: number;
  /** Diameter in px. Default 120. */
  size?: number;
  colors?: [string, string];
  amplitude?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
  /** Center label; defaults to "NN%". */
  children?: ReactNode;
}

/** Circular water-level indicator ("water ball" in DataV terms). */
export function DvWaterLevelPond({
  value,
  size = 120,
  colors,
  amplitude,
  speed,
  className,
  style,
  children,
}: DvWaterLevelPondProps) {
  const { canvasRef, handleRef } = useCanvasEffect<WaveFillHandle>(
    (el) => createWaveFill(el, { value, colors, amplitude, speed }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- colors serialized for equality
    [colors?.join(","), amplitude, speed],
  );

  useEffect(() => {
    handleRef.current?.setValue(value);
  }, [value, handleRef]);

  return (
    <span
      className={["dv-water-pond", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, ...style }}
    >
      <canvas ref={canvasRef} />
      <span className="dv-water-pond-label">{children ?? `${Math.round(value)}%`}</span>
    </span>
  );
}
