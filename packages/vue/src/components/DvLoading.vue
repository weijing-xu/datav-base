<script setup lang="ts">
import { createLoadingRing } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  /** Box size in px. Default 64. */
  size?: number;
  /** Center text. Default "LOADING". */
  text?: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 64,
  text: "LOADING",
});

const { canvas } = useCanvasEffect((el) => createLoadingRing(el, { color: props.color }));
</script>

<template>
  <span class="dv-loading" :style="{ width: `${size}px`, height: `${size}px` }">
    <canvas ref="canvas" />
    <span class="dv-loading-text">{{ text }}</span>
  </span>
</template>
