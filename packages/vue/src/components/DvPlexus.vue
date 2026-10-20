<script setup lang="ts">
import { createPlexus } from "@dv/core";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  color?: string;
  points?: number;
  linkDist?: number;
  speed?: number;
}

const props = defineProps<Props>();

const { canvas } = useCanvasEffect((el) =>
  createPlexus(el, {
    color: props.color,
    points: props.points,
    linkDist: props.linkDist,
    speed: props.speed,
  }),
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
