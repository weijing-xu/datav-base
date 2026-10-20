import { createScrollLoop } from "@dv/core";
import { useEffect, useRef, type CSSProperties } from "react";

export interface DvScrollBoardProps {
  /** Optional header cells. */
  header?: string[];
  /** Body rows; each row is a list of cells rendered as flex columns. */
  rows: (string | number)[][];
  /** Row height in px. Default 36. */
  rowHeight?: number;
  /** Scroll speed in px/s. Default 30. */
  speed?: number;
  /** Pause on hover. Default true. */
  hoverPause?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Seamlessly looping table. Rows are rendered twice internally to create the wrap. */
export function DvScrollBoard({
  header,
  rows,
  rowHeight = 36,
  speed = 30,
  hoverPause = true,
  className,
  style,
}: DvScrollBoardProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const loop = createScrollLoop(track, { speed, hoverPause });
    return () => loop.destroy();
  }, [speed, hoverPause]);

  const looped = [...rows, ...rows];

  return (
    <div className={["dv-scroll-board", className].filter(Boolean).join(" ")} style={style}>
      {header && header.length > 0 && (
        <div className="dv-scroll-board-header" style={{ height: rowHeight, lineHeight: `${rowHeight}px` }}>
          {header.map((cell, i) => (
            <div key={i} className="dv-scroll-board-cell">
              {cell}
            </div>
          ))}
        </div>
      )}
      <div className="dv-scroll-board-body">
        <div ref={trackRef}>
          {looped.map((row, i) => (
            <div key={i} className="dv-scroll-board-row" style={{ height: rowHeight }}>
              {row.map((cell, j) => (
                <div key={j} className="dv-scroll-board-cell">
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
