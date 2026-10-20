import { createAutoFit } from "@dv/core";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export interface DvFullScreenContainerProps {
  /** Design draft width. Default 1920. */
  designWidth?: number;
  /** Design draft height. Default 1080. */
  designHeight?: number;
  /** "width" (default, autofit.js style) or "contain". */
  mode?: "width" | "contain";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Scales a fixed-size design draft to fill its parent. Equivalent of DataV's full-screen-container. */
export function DvFullScreenContainer({
  designWidth = 1920,
  designHeight = 1080,
  mode = "width",
  className,
  style,
  children,
}: DvFullScreenContainerProps) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const fit = createAutoFit(el, { width: designWidth, height: designHeight, mode });
    return () => fit.destroy();
  }, [designWidth, designHeight, mode]);

  return (
    <div className="dv-full-screen-container">
      <div ref={innerRef} className={className} style={style}>
        {children}
      </div>
    </div>
  );
}
