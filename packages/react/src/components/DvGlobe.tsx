import { createGlobe, type GlobeHandle, type GlobeLine, type GlobeMarker } from "@dv/core";
import * as THREE from "three";
import { useEffect, useRef, type CSSProperties } from "react";

export interface DvGlobeProps {
  /** Marker points in lat/lng. */
  markers?: GlobeMarker[];
  /** Flylines as [fromIndex, toIndex] pairs into `markers`. */
  lines?: GlobeLine[];
  /** Surface dot count. Default 1400. */
  density?: number;
  /** Surface dot color. Default "#0a6dff". */
  color?: string;
  /** Marker dot color. Default "#ffd54a". */
  markerColor?: string;
  /** Arc color. */
  lineColor?: string;
  /** Auto-rotation rad/s. Default 0.15. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
  onReady?: (globe: GlobeHandle) => void;
}

/** WebGL globe: dotted sphere + markers + flyline arcs. `three` is an optional peer dep. */
export function DvGlobe({
  markers,
  lines,
  density,
  color,
  markerColor,
  lineColor,
  speed,
  className,
  style,
  onReady,
}: DvGlobeProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<GlobeHandle | null>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const globe = createGlobe(el, THREE, { density, color, markerColor, lineColor, speed });
    handleRef.current = globe;
    onReadyRef.current?.(globe);
    return () => {
      handleRef.current = null;
      globe.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- globe recreated only on visual config change
  }, [density, color, markerColor, lineColor, speed]);

  useEffect(() => {
    handleRef.current?.setData({ markers, lines });
  }, [markers, lines]);

  return <div ref={elRef} className={className} style={{ width: "100%", height: "100%", ...style }} />;
}
