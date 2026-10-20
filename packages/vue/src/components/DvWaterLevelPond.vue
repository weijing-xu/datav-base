<script setup lang="ts">
import { createWaveFill } from "@dv/core";
import { computed, watch } from "vue";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  /** Fill percentage 0-100; animates on change. */
  value: number;
  /** Diameter in px. Default 120. */
  size?: number;
  colors?: [string, string];
  amplitude?: number;
  speed?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 120,
});

const { canvas, handle } = useCanvasEffect((el) =>
  createWaveFill(el, {
    value: props.value,
    colors: props.colors,
    amplitude: props.amplitude,
    speed: props.speed,
  }),
);

watch(
  () => props.value,
  (v) => handle.value?.setValue(v),
);

const label = computed(() => `${Math.round(props.value)}%`);
</script>

<template>
  <span class="dv-water-pond" :style="{ width: `${size}px`, height: `${size}px` }">
    <canvas ref="canvas" />
    <span class="dv-water-pond-label"><slot>{{ label }}</slot></span>
  </span>
</template>
