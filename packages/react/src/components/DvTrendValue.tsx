import { formatNumber } from "@dv/core";
import type { CSSProperties } from "react";

export interface DvTrendValueProps {
  value: number;
  /** Signed delta; >0 up (red), <0 down (green), 0 flat. */
  delta: number;
  /** Delta unit suffix. Default "%". */
  unit?: string;
  decimals?: number;
  className?: string;
  style?: CSSProperties;
}

/** Metric value with a blinking up/down trend arrow, colored by direction. */
export function DvTrendValue({ value, delta, unit = "%", decimals = 0, className, style }: DvTrendValueProps) {
  const dir = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "—";
  return (
    <span className={["dv-trend", `dv-trend-${dir}`, className].filter(Boolean).join(" ")} style={style}>
      <span>{formatNumber(value, decimals)}</span>
      <span className="dv-trend-arrow">
        {arrow} {Math.abs(delta)}
        {unit}
      </span>
    </span>
  );
}
