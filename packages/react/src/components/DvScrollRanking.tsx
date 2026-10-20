import { createScrollLoop } from "@dv/core";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";

export interface RankingItem {
  name: string;
  value: number;
}

export interface DvScrollRankingProps {
  rows: RankingItem[];
  /** Row height in px. Default 34. */
  rowHeight?: number;
  /** Scroll speed px/s. Default 24. */
  speed?: number;
  unit?: string;
  /** Max bar value; defaults to the largest row value. */
  max?: number;
  className?: string;
  style?: CSSProperties;
}

/** Looping leaderboard with progress bars — reuses core's scroll loop. */
export function DvScrollRanking({
  rows,
  rowHeight = 34,
  speed = 24,
  unit = "",
  max,
  className,
  style,
}: DvScrollRankingProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const peak = max ?? Math.max(...rows.map((r) => r.value), 1);
  const looped = useMemo(() => [...rows, ...rows], [rows]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const loop = createScrollLoop(track, { speed });
    return () => loop.destroy();
  }, [speed]);

  return (
    <div className={["dv-scroll-ranking", className].filter(Boolean).join(" ")} style={style}>
      <div ref={trackRef}>
        {looped.map((row, i) => (
          <div key={i} className="dv-scroll-ranking-item" style={{ height: rowHeight }}>
            <span className={`dv-scroll-ranking-rank${(i % rows.length) < 3 ? " dv-scroll-ranking-rank-top" : ""}`}>
              {(i % rows.length) + 1}
            </span>
            <span className="dv-scroll-ranking-name">{row.name}</span>
            <span className="dv-scroll-ranking-bar">
              <i style={{ width: `${(row.value / peak) * 100}%` }} />
            </span>
            <span className="dv-scroll-ranking-value">
              {row.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
