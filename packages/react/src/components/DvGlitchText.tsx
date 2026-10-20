import type { CSSProperties } from "react";

export interface DvGlitchTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

/** RGB-split glitch text — pure CSS animation, driven by the data-text attribute. */
export function DvGlitchText({ text, className, style }: DvGlitchTextProps) {
  return (
    <span className={["dv-glitch", className].filter(Boolean).join(" ")} style={style} data-text={text}>
      {text}
    </span>
  );
}
