<script setup lang="ts">
import { createGlobe, type GlobeHandle, type GlobeLine, type GlobeMarker } from "@dv/core";
import * as THREE from "three";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Props {
  /** Marker points in lat/lng. */
  markers?: GlobeMarker[];
  /** Flylines as [fromIndex, toIndex] pairs into `markers`. */
  lines?: GlobeLine[];
  /** Surface dot count. Default 1400. */
  density?: number;
  /** Surface dot color. Default "#0a6dff". */
  color?: string;
  /** Marker dot color. Default "#ffd54a". */
  markerColor?: string;
  /** Arc color. */
  lineColor?: string;
  /** Auto-rotation rad/s. Default 0.15. */
  speed?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  ready: [globe: GlobeHandle];
}>();

const el = ref<HTMLDivElement>();
let globe: GlobeHandle | undefined;

const options = () => ({
  density: props.density,
  color: props.color,
  markerColor: props.markerColor,
  lineColor: props.lineColor,
  speed: props.speed,
  markers: props.markers,
  lines: props.lines,
});

onMounted(() => {
  if (!el.value) return;
  globe = createGlobe(el.value, THREE, options());
  emit("ready", globe);
});

watch(
  () => [props.markers, props.lines],
  () => globe?.setData({ markers: props.markers, lines: props.lines }),
  { deep: true },
);

watch(
  () => [props.density, props.color, props.markerColor, props.lineColor, props.speed],
  () => {
    if (!el.value) return;
    globe?.destroy();
    globe = createGlobe(el.value, THREE, options());
    emit("ready", globe);
  },
);

onBeforeUnmount(() => {
  globe?.destroy();
  globe = undefined;
});
</script>

<template>
  <div ref="el" style="width: 100%; height: 100%" />
</template>
