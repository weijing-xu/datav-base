/**
 * Ready-made ECharts option builders styled for data screens.
 * Feed the result into DvChart — it applies on top of the dv-dark theme.
 */

export interface RadarSeriesItem {
  name: string;
  values: number[];
  color?: string;
}

export interface DvRadarOptions {
  /** Indicator dimensions, e.g. ["吞吐量","延迟","正确率"]. */
  indicators: string[];
  /** Per-indicator max; defaults to 100 each. */
  max?: number | number[];
  series: RadarSeriesItem[];
}

export function dvRadarOption({ indicators, max = 100, series }: DvRadarOptions): Record<string, unknown> {
  const indicator = indicators.map((name, i) => ({
    name,
    max: Array.isArray(max) ? (max[i] ?? 100) : max,
  }));
  return {
    tooltip: { trigger: "item" },
    radar: {
      indicator,
      radius: "68%",
      center: ["50%", "54%"],
      splitNumber: 4,
      axisName: { color: "#7fb8dd", fontSize: 12 },
      splitLine: { lineStyle: { color: "rgba(0,246,255,0.2)" } },
      splitArea: { areaStyle: { color: ["rgba(0,246,255,0.02)", "rgba(0,246,255,0.05)"] } },
      axisLine: { lineStyle: { color: "rgba(0,246,255,0.3)" } },
    },
    series: [
      {
        type: "radar",
        symbolSize: 4,
        data: series.map((s) => ({
          name: s.name,
          value: s.values,
          itemStyle: s.color ? { color: s.color } : undefined,
          areaStyle: { opacity: 0.18 },
          lineStyle: { width: 1.5 },
        })),
      },
    ],
  };
}

export interface FunnelItem {
  name: string;
  value: number;
}

export interface DvFunnelOptions {
  data: FunnelItem[];
  /** Sort descending (default) or keep order. */
  sort?: "descending" | "ascending" | "none";
}

export function dvFunnelOption({ data, sort = "descending" }: DvFunnelOptions): Record<string, unknown> {
  return {
    tooltip: { trigger: "item", formatter: "{b}: {c}" },
    series: [
      {
        type: "funnel",
        sort,
        left: "12%",
        right: "12%",
        top: "8%",
        bottom: "6%",
        minSize: "12%",
        maxSize: "92%",
        gap: 4,
        label: { color: "#cfe8ff", fontSize: 12, formatter: "{b} {c}" },
        labelLine: { lineStyle: { color: "rgba(0,246,255,0.4)" } },
        itemStyle: {
          borderColor: "rgba(0,246,255,0.35)",
          borderWidth: 1,
          opacity: 0.85,
        },
        emphasis: { label: { fontSize: 13 } },
        data,
      },
    ],
  };
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface DvSankeyOptions {
  /** Node names; derived from links when omitted. */
  nodes?: string[];
  links: SankeyLink[];
}

export function dvSankeyOption({ nodes, links }: DvSankeyOptions): Record<string, unknown> {
  const names =
    nodes ?? [...new Set(links.flatMap((l) => [l.source, l.target]))];
  return {
    tooltip: { trigger: "item", formatter: "{b}: {c}" },
    series: [
      {
        type: "sankey",
        left: "8%",
        right: "12%",
        top: "8%",
        bottom: "8%",
        nodeWidth: 14,
        nodeGap: 12,
        label: { color: "#cfe8ff", fontSize: 12 },
        lineStyle: { color: "gradient", opacity: 0.35, curveness: 0.5 },
        emphasis: { focus: "adjacency" },
        data: names.map((name) => ({ name })),
        links,
      },
    ],
  };
}
