<script setup lang="ts">
import { createPulseRings } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  color?: string;
  rings?: number;
  period?: number;
}

const props = defineProps<Props>();

const { canvas } = useCanvasEffect((el) =>
  createPulseRings(el, { color: props.color, rings: props.rings, period: props.period }),
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
