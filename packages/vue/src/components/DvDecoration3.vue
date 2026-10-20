<script setup lang="ts">
import { createRadarSweep } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  color?: string;
  period?: number;
  rings?: number;
}

const props = defineProps<Props>();

const { canvas } = useCanvasEffect((el) =>
  createRadarSweep(el, { color: props.color, period: props.period, rings: props.rings }),
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
