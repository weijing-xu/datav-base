<script setup lang="ts">
import { formatNumber } from "@dv/core";
import { computed } from "vue";

interface Props {
  value: number;
  /** Signed delta; >0 up (red), <0 down (green), 0 flat. */
  delta: number;
  /** Delta unit suffix. Default "%". */
  unit?: string;
  decimals?: number;
}

const props = withDefaults(defineProps<Props>(), {
  unit: "%",
  decimals: 0,
});

const dir = computed(() => (props.delta > 0 ? "up" : props.delta < 0 ? "down" : "flat"));
const arrow = computed(() => (props.delta > 0 ? "▲" : props.delta < 0 ? "▼" : "—"));
const text = computed(() => formatNumber(props.value, props.decimals));
const absDelta = computed(() => Math.abs(props.delta));
</script>

<template>
  <span :class="['dv-trend', `dv-trend-${dir}`]">
    <span>{{ text }}</span>
    <span class="dv-trend-arrow">{{ arrow }} {{ absDelta }}{{ unit }}</span>
  </span>
</template>
