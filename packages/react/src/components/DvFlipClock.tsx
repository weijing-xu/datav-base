import { useEffect, useState, type CSSProperties } from "react";

export interface DvFlipClockProps {
  /** Countdown target (ms timestamp or Date). Omit for a live clock. */
  to?: number | Date;
  /** Pad each unit to 2 digits. Default true. */
  pad?: boolean;
  className?: string;
  style?: CSSProperties;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function units(to?: number | Date): string[] {
  if (to === undefined) {
    const d = new Date();
    return [pad2(d.getHours()), pad2(d.getMinutes()), pad2(d.getSeconds())];
  }
  const target = typeof to === "number" ? to : to.getTime();
  const left = Math.max(0, Math.floor((target - Date.now()) / 1000));
  return [pad2(Math.floor(left / 3600)), pad2(Math.floor((left % 3600) / 60)), pad2(left % 60)];
}

/** HH:MM:SS live clock, or a countdown when `to` is given. Digits flip via CSS on change. */
export function DvFlipClock({ to, className, style }: DvFlipClockProps) {
  const [, setTick] = useState(0);
  const parts = units(to);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={["dv-flip-clock", className].filter(Boolean).join(" ")} style={style}>
      {parts.map((part, i) => (
        <span key={i} style={{ display: "contents" }}>
          {part.split("").map((d, j) => (
            <span key={`${j}-${d}`} className="dv-flip-digit">
              <span>{d}</span>
            </span>
          ))}
          {i < parts.length - 1 && <span className="dv-flip-sep">:</span>}
        </span>
      ))}
    </span>
  );
}
