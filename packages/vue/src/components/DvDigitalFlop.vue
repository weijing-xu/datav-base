<script setup lang="ts">
import { createNumberTicker, type NumberTicker } from "@dv/core";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Props {
  /** Target value; re-animates when it changes. */
  value: number;
  duration?: number;
  decimals?: number;
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  decimals: 0,
  separator: ",",
});

const display = ref(props.value.toFixed(props.decimals));
let ticker: NumberTicker | undefined;

onMounted(() => {
  ticker = createNumberTicker({
    to: props.value,
    duration: props.duration,
    decimals: props.decimals,
    separator: props.separator,
    onUpdate: (formatted) => {
      display.value = formatted;
    },
  });
});

watch(
  () => props.value,
  (v) => ticker?.setValue(v),
);

onBeforeUnmount(() => ticker?.destroy());
</script>

<template>
  <span class="dv-digital-flop">{{ display }}</span>
</template>
