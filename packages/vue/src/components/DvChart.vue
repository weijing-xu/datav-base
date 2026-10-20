<script setup lang="ts">
import { createChartHost, dvDarkTheme, type ChartHost } from "@dv/core";
import * as echarts from "echarts";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Props {
  /** ECharts option object; re-applied on change. */
  option: Record<string, unknown>;
  /** Registered theme name. Default "dv-dark". */
  theme?: string;
  renderer?: "canvas" | "svg";
  /** Pass to setOption's notMerge. Default true (replace, not merge). */
  notMerge?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  theme: "dv-dark",
  notMerge: true,
});

const emit = defineEmits<{
  ready: [chart: echarts.ECharts];
}>();

const el = ref<HTMLDivElement>();
let host: ChartHost | undefined;

onMounted(() => {
  if (!el.value) return;
  host = createChartHost(el.value, echarts, {
    theme: props.theme,
    themeObject: dvDarkTheme,
    renderer: props.renderer,
  });
  host.setOption(props.option, { notMerge: props.notMerge });
  emit("ready", host.chart as echarts.ECharts);
});

watch(
  () => props.option,
  (option) => host?.setOption(option, { notMerge: props.notMerge }),
  { deep: true },
);

onBeforeUnmount(() => {
  host?.destroy();
  host = undefined;
});
</script>

<template>
  <div ref="el" style="width: 100%; height: 100%" />
</template>
