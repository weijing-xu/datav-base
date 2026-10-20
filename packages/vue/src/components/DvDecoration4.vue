<script setup lang="ts">
import { createHexGrid } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  colors?: string[];
  cell?: number;
  speed?: number;
}

const props = defineProps<Props>();

const { canvas } = useCanvasEffect((el) =>
  createHexGrid(el, { colors: props.colors, cell: props.cell, speed: props.speed }),
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
