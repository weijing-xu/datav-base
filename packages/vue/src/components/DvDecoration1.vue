<script setup lang="ts">
import { createPulseField } from "@dv/core";
import { onBeforeUnmount, onMounted, ref } from "vue";

interface Props {
  /** Dot colors, cycled per dot. */
  colors?: string[];
  points?: number;
  speed?: number;
}

const props = withDefaults(defineProps<Props>(), {
  points: 40,
  speed: 1,
});

const canvas = ref<HTMLCanvasElement>();
let effect: ReturnType<typeof createPulseField> | undefined;

onMounted(() => {
  if (!canvas.value) return;
  effect = createPulseField(canvas.value, {
    colors: props.colors,
    points: props.points,
    speed: props.speed,
  });
});

onBeforeUnmount(() => effect?.destroy());
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
