<script setup lang="ts">
import { createDialRing } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  color?: string;
  ticks?: number;
  speed?: number;
  counter?: boolean;
}

const props = withDefaults(defineProps<Props>(), { counter: true });
const { canvas } = useCanvasEffect((el) =>
  createDialRing(el, { color: props.color, ticks: props.ticks, speed: props.speed, counter: props.counter }),
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
