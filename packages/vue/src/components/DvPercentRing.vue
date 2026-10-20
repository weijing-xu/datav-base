<script setup lang="ts">
import { createRingProgress } from "@dv/core";
import { computed, watch } from "vue";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  /** Percent 0-100; animates on change. */
  value: number;
  /** Diameter in px. Default 120. */
  size?: number;
  thickness?: number;
  colors?: [string, string];
}

const props = withDefaults(defineProps<Props>(), {
  size: 120,
});

const { canvas, handle } = useCanvasEffect((el) =>
  createRingProgress(el, { value: props.value, thickness: props.thickness, colors: props.colors }),
);

watch(
  () => props.value,
  (v) => handle.value?.setValue(v),
);

const label = computed(() => `${Math.round(props.value)}%`);
</script>

<template>
  <span class="dv-percent-ring" :style="{ width: `${size}px`, height: `${size}px` }">
    <canvas ref="canvas" />
    <span class="dv-percent-ring-label"><slot>{{ label }}</slot></span>
  </span>
</template>
