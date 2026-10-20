<script setup lang="ts">
import { createConicalChart, type ConicalItem } from "@dv/core";
import { watch } from "vue";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  rows: ConicalItem[];
  colors?: [string, string];
  unit?: string;
  max?: number;
}

const props = defineProps<Props>();

const { canvas, handle } = useCanvasEffect((el) =>
  createConicalChart(el, { rows: props.rows, colors: props.colors, unit: props.unit, max: props.max }),
);

watch(
  () => props.rows,
  (rows) => handle.value?.setData(rows),
  { deep: true },
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
