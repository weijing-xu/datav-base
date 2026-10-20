/** Design tokens shared by both framework kits — edit once, both look identical. */
export const dvTokens = {
  colors: {
    primary: "#00f6ff",
    secondary: "#2f81f7",
    accent: "#48ffe0",
    warn: "#f7b500",
    danger: "#ff4d4f",
    bg: "#020c1b",
    panel: "rgba(9, 32, 63, 0.6)",
    border: "rgba(0, 246, 255, 0.45)",
    text: "#d5f1ff",
    textDim: "#5b87a8",
  },
  font: {
    number: "'DS-Digital', 'DIN Alternate', monospace",
    title: "'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
} as const;

export type DvTokens = typeof dvTokens;

/** Writes the tokens as CSS variables onto an element (default :root scope is the caller's choice). */
export function applyTokens(el: HTMLElement, tokens: DvTokens = dvTokens): void {
  for (const [key, value] of Object.entries(tokens.colors)) {
    el.style.setProperty(`--dv-${key}`, value);
  }
  el.style.setProperty("--dv-font-number", tokens.font.number);
  el.style.setProperty("--dv-font-title", tokens.font.title);
}
