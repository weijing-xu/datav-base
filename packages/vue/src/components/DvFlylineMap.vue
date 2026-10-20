<script setup lang="ts">
import { createFlylines, createGeoMap, type FlyLine, type FlyPoint, type GeoJSONCollection } from "@dv/core";
import { watch } from "vue";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
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
}

const props = withDefaults(defineProps<Props>(), {
  ripple: true,
  labels: false,
});

const { canvas, handle } = useCanvasEffect((el) =>
  createFlylines(el, {
    points: props.points,
    lines: props.lines,
    color: props.color,
    accent: props.accent,
    speed: props.speed,
    ripple: props.ripple,
    labels: props.labels,
  }),
);

const { canvas: geoCanvas, handle: geoHandle } = useCanvasEffect((el) =>
  createGeoMap(el, { geoJson: props.geoJson!, highlight: props.geoHighlight }),
);

// Rebuild when data changes
watch(
  () => [props.points, props.lines],
  () => {
    handle.value?.destroy();
    if (canvas.value) {
      handle.value = createFlylines(canvas.value, {
        points: props.points,
        lines: props.lines,
        color: props.color,
        accent: props.accent,
        speed: props.speed,
        ripple: props.ripple,
        labels: props.labels,
      });
    }
  },
  { deep: true },
);

watch(
  () => [props.geoJson, props.geoHighlight],
  () => {
    geoHandle.value?.destroy();
    if (geoCanvas.value && props.geoJson) {
      geoHandle.value = createGeoMap(geoCanvas.value, {
        geoJson: props.geoJson,
        highlight: props.geoHighlight,
      });
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="dv-flyline-map">
    <div v-if="$slots.default" class="dv-flyline-map-bg">
      <slot />
    </div>
    <canvas v-if="geoJson" ref="geoCanvas" />
    <canvas ref="canvas" />
  </div>
</template>
