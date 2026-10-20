<script setup lang="ts">
import { createCornerScan } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  color?: string;
  size?: number;
  speed?: number;
}

const props = defineProps<Props>();
const { canvas } = useCanvasEffect((el) =>
  createCornerScan(el, { color: props.color, size: props.size, speed: props.speed }),
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
