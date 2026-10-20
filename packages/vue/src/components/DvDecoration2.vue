<script setup lang="ts">
import { createScanline } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  color?: string;
  period?: number;
  barWidth?: number;
}

const props = defineProps<Props>();

const { canvas } = useCanvasEffect((el) =>
  createScanline(el, { color: props.color, period: props.period, barWidth: props.barWidth }),
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
