import type { CSSProperties, ReactNode } from "react";

export interface DvAlertProps {
  /** Alert level: danger (red, default) or warn (amber). */
  level?: "danger" | "warn";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Flashing alert banner strip. */
export function DvAlert({ level = "danger", className, style, children }: DvAlertProps) {
  return (
    <div
      className={["dv-alert", level === "warn" ? "dv-alert-warn" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
      role="alert"
    >
      <i className="dv-alert-dot" />
      {children}
    </div>
  );
}
