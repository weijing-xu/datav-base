import { createConicalChart, type ConicalItem } from "@dv/core";
import { useEffect, type CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvConicalChartProps {
  rows: ConicalItem[];
  colors?: [string, string];
  unit?: string;
  max?: number;
  className?: string;
  style?: CSSProperties;
}

export type { ConicalItem };

/** Horizontal cone bars — DataV-style conical column chart. Fills its parent. */
export function DvConicalChart({ rows, colors, unit, max, className, style }: DvConicalChartProps) {
  const { canvasRef, handleRef } = useCanvasEffect(
    (el) => createConicalChart(el, { rows, colors, unit, max }),
    [colors?.join(","), unit, max],
  );

  useEffect(() => {
    handleRef.current?.setData(rows);
  }, [rows, handleRef]);

  return <canvas ref={canvasRef} className={["dv-decoration", className].filter(Boolean).join(" ")} style={style} />;
}
