import { createPlexus } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvPlexusProps {
  color?: string;
  points?: number;
  linkDist?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

/** Plexus particle-network background. Fills its parent — give the parent a size. */
export function DvPlexus({ color, points, linkDist, speed, className, style }: DvPlexusProps) {
  const { canvasRef } = useCanvasEffect(
    (el) => createPlexus(el, { color, points, linkDist, speed }),
    [color, points, linkDist, speed],
  );
  return <canvas ref={canvasRef} className={["dv-decoration", className].filter(Boolean).join(" ")} style={style} />;
}
