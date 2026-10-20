<script setup lang="ts">
import { createFlowChevron } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  color?: string;
  count?: number;
  direction?: "left" | "right";
  speed?: number;
}

const props = defineProps<Props>();
const { canvas } = useCanvasEffect((el) =>
  createFlowChevron(el, {
    color: props.color,
    count: props.count,
    direction: props.direction,
    speed: props.speed,
  }),
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
