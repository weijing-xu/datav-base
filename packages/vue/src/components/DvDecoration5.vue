<script setup lang="ts">
import { createOrbitDots } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  color?: string;
  count?: number;
  speed?: number;
}

const props = defineProps<Props>();

const { canvas } = useCanvasEffect((el) =>
  createOrbitDots(el, { color: props.color, count: props.count, speed: props.speed }),
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
