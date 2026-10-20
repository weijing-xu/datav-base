<script setup lang="ts">
import { createGeoMap, type GeoJSONCollection } from "@dv/core";
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

const { canvas, handle } = useCanvasEffect((el) =>
  createGeoMap(el, {
    geoJson: props.geoJson,
    highlight: props.highlight,
    fill: props.fill,
    stroke: props.stroke,
    showLabels: props.showLabels,
  }),
);

watch(
  () => [props.geoJson, props.highlight],
  () => {
    handle.value?.destroy();
    if (canvas.value) {
      handle.value = createGeoMap(canvas.value, {
        geoJson: props.geoJson,
        highlight: props.highlight,
        fill: props.fill,
        stroke: props.stroke,
        showLabels: props.showLabels,
      });
    }
  },
  { deep: true },
);
</script>

<template>
  <canvas ref="canvas" class="dv-decoration" />
</template>
