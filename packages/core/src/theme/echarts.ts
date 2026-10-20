import { dvTokens } from "./tokens";

const c = dvTokens.colors;

/**
 * Dark data-screen theme for ECharts.
 * Usage: `echarts.registerTheme("dv-dark", dvDarkTheme)` then
 * `echarts.init(el, "dv-dark")`.
 * Kept as a plain object so @dv/core stays dependency-free.
 */
export const dvDarkTheme = {
  color: [c.primary, c.secondary, c.accent, c.warn, "#7a5cff", "#ff7ab8", c.danger],
  backgroundColor: "transparent",
  textStyle: { color: c.text, fontFamily: dvTokens.font.title },
  title: { textStyle: { color: c.text } },
  legend: { textStyle: { color: c.textDim } },
  grid: { borderColor: c.border },
  categoryAxis: {
    axisLine: { lineStyle: { color: c.border } },
    axisLabel: { color: c.textDim },
    splitLine: { lineStyle: { color: "rgba(0,246,255,0.08)" } },
  },
  valueAxis: {
    axisLine: { lineStyle: { color: c.border } },
    axisLabel: { color: c.textDim },
    splitLine: { lineStyle: { color: "rgba(0,246,255,0.08)" } },
  },
  tooltip: {
    backgroundColor: "rgba(9,32,63,0.9)",
    borderColor: c.border,
    textStyle: { color: c.text },
  },
} as const;
