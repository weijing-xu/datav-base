<script setup lang="ts">
import {
  createFlylines,
  createGeoMap,
  createGeoProjector,
  type FlyLine,
  type FlyPoint,
  type GeoJSONCollection,
  type GeoJSONFeature,
} from "@dv/core";
import { watch } from "vue";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  /** Endpoint list; x/y normalized to [0,1] over the container, or geo coords when coord="geo". */
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
}

const props = withDefaults(defineProps<Props>(), {
  ripple: true,
  labels: false,
  coord: "normalized",
});
const emit = defineEmits<{ geoPick: [feature: GeoJSONFeature] }>();

const projector = () =>
  props.coord === "geo" && props.geoJson ? createGeoProjector(props.geoJson) : undefined;

const flyOptions = () => ({
  points: props.points,
  lines: props.lines,
  color: props.color,
  accent: props.accent,
  speed: props.speed,
  ripple: props.ripple,
  labels: props.labels,
  project: projector(),
});

const { canvas, handle } = useCanvasEffect((el) => createFlylines(el, flyOptions()));
const { canvas: geoCanvas, handle: geoHandle } = useCanvasEffect((el) =>
  createGeoMap(el, {
    geoJson: props.geoJson!,
    highlight: props.geoHighlight,
    onPick: (f) => emit("geoPick", f),
  }),
);

// Rebuild when data changes
watch(
  () => [props.points, props.lines, props.coord, props.geoJson],
  () => {
    handle.value?.destroy();
    if (canvas.value) {
      handle.value = createFlylines(canvas.value, flyOptions());
    }
  },
  { deep: true },
);

// The geo canvas mounts via v-if once geoJson arrives — watch the ref, not just the prop.
watch(
  () => [geoCanvas.value, props.geoJson, props.geoHighlight],
  () => {
    geoHandle.value?.destroy();
    geoHandle.value = undefined;
    if (geoCanvas.value && props.geoJson) {
      geoHandle.value = createGeoMap(geoCanvas.value, {
        geoJson: props.geoJson,
        highlight: props.geoHighlight,
        onPick: (f) => emit("geoPick", f),
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
    <canvas ref="canvas" :style="geoJson ? { pointerEvents: 'none' } : undefined" />
  </div>
</template>
