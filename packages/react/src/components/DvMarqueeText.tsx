import { createMarquee } from "@dv/core";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export interface DvMarqueeTextProps {
  /** Items scrolled left-to-right. Strings get the default diamond bullet style. */
  items: (string | ReactNode)[];
  /** Pixels per second. Default 60. */
  speed?: number;
  /** Pause while hovered. Default true. */
  hoverPause?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Horizontal seamless marquee — content is rendered twice, core engine wraps at half width. */
export function DvMarqueeText({ items, speed, hoverPause, className, style }: DvMarqueeTextProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const marquee = createMarquee(track, { speed, hoverPause });
    return () => marquee.destroy();
  }, [speed, hoverPause]);

  const looped = [...items, ...items];
  return (
    <div className={["dv-marquee", className].filter(Boolean).join(" ")} style={style}>
      <div className="dv-marquee-track" ref={trackRef}>
        {looped.map((item, i) => (
          <span key={i} className="dv-marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
