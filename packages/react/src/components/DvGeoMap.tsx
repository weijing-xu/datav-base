import { createGeoMap, type GeoJSONCollection, type GeoJSONFeature } from "@dv/core";
import type { CSSProperties } from "react";
import { useCanvasEffect } from "../hooks/useCanvasEffect";

export interface DvGeoMapProps {
  geoJson: GeoJSONCollection;
  /** Feature names drawn with a soft pulse. */
  highlight?: string[];
  fill?: string;
  stroke?: string;
  showLabels?: boolean;
  /** Click hit-test on features (e.g. drill-down by adcode). */
  onPick?: (feature: GeoJSONFeature) => void;
  className?: string;
  style?: CSSProperties;
}

/** Standalone GeoJSON map layer (also usable as DvFlylineMap's `geoJson` prop). */
export function DvGeoMap({ geoJson, highlight, fill, stroke, showLabels, onPick, className, style }: DvGeoMapProps) {
  const { canvasRef } = useCanvasEffect(
    (el) => createGeoMap(el, { geoJson, highlight, fill, stroke, showLabels, onPick }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- serialized deps trigger rebuild
    [JSON.stringify(geoJson), JSON.stringify(highlight), fill, stroke, showLabels, onPick],
  );
  return <canvas ref={canvasRef} className={["dv-decoration", className].filter(Boolean).join(" ")} style={style} />;
}
