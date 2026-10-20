import { createTilt } from "@dv/core";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export interface DvTiltCardProps {
  /** Max tilt in degrees. Default 10. */
  max?: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Pointer-follow 3D tilt wrapper — put any panel/card inside. */
export function DvTiltCard({ max, scale, className, style, children }: DvTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tilt = createTilt(el, { max, scale });
    return () => tilt.destroy();
  }, [max, scale]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
