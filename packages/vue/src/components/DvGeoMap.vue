<script setup lang="ts">
import { createGeoMap, type GeoJSONCollection, type GeoJSONFeature } from "@dv/core";
import { watch } from "vue";
import { useCanvasEffect } from "../composables/useCanvasEffect";

interface Props {
  geoJson: GeoJSONCollection;
  /** Feature names drawn with a soft pulse. */
  highlight?: string[];
  fill?: string;
  stroke?: string;
  showLabels?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ pick: [feature: GeoJSONFeature] }>();

const options = () => ({
  geoJson: props.geoJson,
  highlight: props.highlight,
  fill: props.fill,
  stroke: props.stroke,
  showLabels: props.showLabels,
  onPick: (f: GeoJSONFeature) => emit("pick", f),
});

const { canvas, handle } = useCanvasEffect((el) => createGeoMap(el, options()));

watch(
  () => [props.geoJson, props.highlight],
  () => {
    handle.value?.destroy();
    if (canvas.value) {
      handle.value = createGeoMap(canvas.value, options());
    }
  },
  { deep: true },
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
