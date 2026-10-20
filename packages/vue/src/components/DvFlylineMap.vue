<script setup lang="ts">
import { createFlylines, type FlyLine, type FlyPoint } from "@dv/core";
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
</script>

<template>
  <div class="dv-flyline-map">
    <div v-if="$slots.default" class="dv-flyline-map-bg">
      <slot />
    </div>
    <canvas ref="canvas" />
  </div>
</template>
