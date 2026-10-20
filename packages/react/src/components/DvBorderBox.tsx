import { borderBoxPolys, onResize, type BorderBoxVariant } from "@dv/core";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export interface DvBorderBoxProps {
  /** Border style variant. Default "box1". */
  variant?: BorderBoxVariant;
  /** [primary, accent] line colors. */
  colors?: [string, string];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Tech-style framed panel; SVG geometry comes from @dv/core, re-measured on resize. */
export function DvBorderBox({
  variant = "box1",
  colors = ["#00f6ff", "#48ffe0"],
  className,
  style,
  children,
}: DvBorderBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return onResize(el, () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    });
  }, []);

  const polys = size.w > 0 && size.h > 0
    ? borderBoxPolys(variant, size.w, size.h, { primary: colors[0], accent: colors[1] })
    : [];

  return (
    <div ref={ref} className={["dv-border-box", className].filter(Boolean).join(" ")} style={style}>
      <svg viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none" aria-hidden>
        {polys.map((p, i) => (
          <polygon
            key={i}
            points={p.points}
            fill={p.fill ?? "none"}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            strokeDasharray={p.dash}
            opacity={p.opacity}
          />
        ))}
      </svg>
      <div className="dv-border-box-content">{children}</div>
    </div>
  );
}
