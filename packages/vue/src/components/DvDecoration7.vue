<script setup lang="ts">
import { createStripeFlow } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  color?: string;
  spacing?: number;
  speed?: number;
  angle?: number;
}

const props = defineProps<Props>();

const { canvas } = useCanvasEffect((el) =>
  createStripeFlow(el, {
    color: props.color,
    spacing: props.spacing,
    speed: props.speed,
    angle: props.angle,
  }),
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
