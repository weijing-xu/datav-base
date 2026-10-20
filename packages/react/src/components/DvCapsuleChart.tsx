import type { CSSProperties } from "react";

export interface CapsuleItem {
  name: string;
  value: number;
}

export interface DvCapsuleChartProps {
  rows: CapsuleItem[];
  /** Max bar value; defaults to the largest row value. */
  max?: number;
  unit?: string;
  className?: string;
  style?: CSSProperties;
}

/** Capsule progress bars — each row's pill bar animates to its share of the peak value. */
export function DvCapsuleChart({ rows, max, unit = "", className, style }: DvCapsuleChartProps) {
  const peak = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className={["dv-capsule", className].filter(Boolean).join(" ")} style={style}>
      {rows.map((row, i) => (
        <div key={i} className="dv-capsule-row">
          <span className="dv-capsule-name">{row.name}</span>
          <span className="dv-capsule-bar">
            <i style={{ width: `${(row.value / peak) * 100}%` }} />
          </span>
          <span className="dv-capsule-value">
            {row.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
