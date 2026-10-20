<script setup lang="ts">
import { createGauge } from "@dv/core";
import { computed, watch } from "vue";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  value: number;
  min?: number;
  max?: number;
  /** Box size in px. Default 160. */
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 160,
});

const { canvas, handle } = useCanvasEffect((el) =>
  createGauge(el, { value: props.value, min: props.min, max: props.max }),
);

watch(
  () => props.value,
  (v) => handle.value?.setValue(v),
);

const label = computed(() => Math.round(props.value));
</script>

<template>
  <span class="dv-gauge dv-percent-ring" :style="{ width: `${size}px`, height: `${size}px` }">
    <canvas ref="canvas" />
    <span class="dv-percent-ring-label"><slot>{{ label }}</slot></span>
  </span>
</template>
