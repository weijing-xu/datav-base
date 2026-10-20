import { createPulseField } from "@dv/core";
import { useEffect, useRef, type CSSProperties } from "react";

export interface DvDecoration1Props {
  /** Dot colors, cycled per dot. */
  colors?: string[];
  points?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

/** Canvas decoration: a field of pulsing dots. Fills its parent — give the parent a size. */
export function DvDecoration1({ colors, points, speed, className, style }: DvDecoration1Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const effect = createPulseField(canvas, { colors, points, speed });
    return () => effect.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recreate the effect only when params change
  }, [points, speed, colors?.join(",")]);

  return (
    <canvas
      ref={canvasRef}
      className={["dv-decoration", className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}
