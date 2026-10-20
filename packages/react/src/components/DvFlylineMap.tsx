import {
  createFlylines,
  createGeoMap,
  createGeoProjector,
  type FlyLine,
  type FlyPoint,
  type GeoJSONCollection,
  type GeoJSONFeature,
} from "@dv/core";
import type { CSSProperties, ReactNode } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvFlylineMapProps {
  /** Endpoint list; x/y normalized to [0,1] over the container. */
  points: FlyPoint[];
  /** Pairs of point indices. */
  lines: FlyLine[];
  color?: string;
  accent?: string;
  speed?: number;
  ripple?: boolean;
  labels?: boolean;
  /** GeoJSON rendered on a second canvas under the flylines. */
  geoJson?: GeoJSONCollection;
  /** GeoJSON feature names drawn with a soft pulse. */
  geoHighlight?: string[];
  /**
   * Point coordinate space. "normalized" (default) = x/y in [0,1] stretched over
   * the box; "geo" = raw GeoJSON coordinates (e.g. lng/lat), projected to align
   * with the `geoJson` base map — requires geoJson.
   */
  coord?: "normalized" | "geo";
  /** Click hit-test on geoJson features (e.g. drill-down by adcode). */
  onGeoPick?: (feature: GeoJSONFeature) => void;
  className?: string;
  style?: CSSProperties;
  /** Background layer rendered under the lines (map image, grid…). */
  children?: ReactNode;
}

/** Flyline/migration layer. Coordinates are normalized, so any background fits. */
export function DvFlylineMap({
  points,
  lines,
  color,
  accent,
  speed,
  ripple,
  labels,
  geoJson,
  geoHighlight,
  coord = "normalized",
  onGeoPick,
  className,
  style,
  children,
}: DvFlylineMapProps) {
  const { canvasRef: geoRef } = useCanvasEffect(
    (el) => createGeoMap(el, { geoJson: geoJson!, highlight: geoHighlight, onPick: onGeoPick }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- serialized deps trigger rebuild
    [JSON.stringify(geoJson), JSON.stringify(geoHighlight), onGeoPick],
  );
  const { canvasRef } = useCanvasEffect(
    (el) =>
      createFlylines(el, {
        points,
        lines,
        color,
        accent,
        speed,
        ripple,
        labels,
        project: coord === "geo" && geoJson ? createGeoProjector(geoJson) : undefined,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- serialized deps trigger rebuild
    [JSON.stringify(points), JSON.stringify(lines), JSON.stringify(geoJson), coord, color, accent, speed, ripple, labels],
  );

  return (
    <div className={["dv-flyline-map", className].filter(Boolean).join(" ")} style={style}>
      {children && <div className="dv-flyline-map-bg">{children}</div>}
      {geoJson && <canvas ref={geoRef} />}
      <canvas ref={canvasRef} style={geoJson ? { pointerEvents: "none" } : undefined} />
    </div>
  );
}
