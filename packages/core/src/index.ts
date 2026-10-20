export type { EffectHandle } from "./types";

export { createAutoFit } from "./layout/autofit";
export type { AutoFitInstance, AutoFitOptions } from "./layout/autofit";
export { onResize } from "./layout/resize";

export { createNumberTicker, formatNumber } from "./effects/numberTicker";
export type { NumberTicker, NumberTickerOptions } from "./effects/numberTicker";
export { createPulseField } from "./effects/pulseField";
export type { PulseFieldOptions } from "./effects/pulseField";
export { createScrollLoop } from "./effects/scrollLoop";
export type { ScrollLoopOptions } from "./effects/scrollLoop";

export { borderBoxPolys } from "./components/borders";
export type { BorderBoxColors, BorderBoxVariant, BorderPolygon } from "./components/borders";

export { applyTokens, dvTokens } from "./theme/tokens";
export type { DvTokens } from "./theme/tokens";
export { dvDarkTheme } from "./theme/echarts";
