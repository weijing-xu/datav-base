import { createChartHost, dvDarkTheme, type ChartHost } from "@dv/core";
import * as echarts from "echarts";
import { useEffect, useRef, type CSSProperties } from "react";

export interface DvChartProps {
  /** ECharts option object; re-applied on change. */
  option: Record<string, unknown>;
  /** Registered theme name. Default "dv-dark". */
  theme?: string;
  renderer?: "canvas" | "svg";
  /** Pass to setOption's notMerge. Default true (replace, not merge). */
  notMerge?: boolean;
  className?: string;
  style?: CSSProperties;
  onReady?: (chart: echarts.ECharts) => void;
}

/** ECharts host with the dv-dark theme registered and resize handled. echarts is a peer dep. */
export function DvChart({
  option,
  theme = "dv-dark",
  renderer,
  notMerge = true,
  className,
  style,
  onReady,
}: DvChartProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<ChartHost | null>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const host = createChartHost(el, echarts, { theme, themeObject: dvDarkTheme, renderer });
    hostRef.current = host;
    onReadyRef.current?.(host.chart as echarts.ECharts);
    return () => {
      hostRef.current = null;
      host.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- host recreated only on theme/renderer change
  }, [theme, renderer]);

  useEffect(() => {
    hostRef.current?.setOption(option, { notMerge });
  }, [option, notMerge]);

  return (
    <div
      ref={elRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
}
