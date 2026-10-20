<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

interface Props {
  /** Countdown target (ms timestamp or Date). Omit for a live clock. */
  to?: number | Date;
}

const props = defineProps<Props>();

const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const pad2 = (n: number) => String(n).padStart(2, "0");

const parts = computed<string[]>(() => {
  if (props.to === undefined) {
    const d = new Date(now.value);
    return [pad2(d.getHours()), pad2(d.getMinutes()), pad2(d.getSeconds())];
  }
  const target = typeof props.to === "number" ? props.to : props.to.getTime();
  const left = Math.max(0, Math.floor((target - now.value) / 1000));
  return [pad2(Math.floor(left / 3600)), pad2(Math.floor((left % 3600) / 60)), pad2(left % 60)];
});
</script>

<template>
  <span class="dv-flip-clock">
    <template v-for="(part, i) in parts" :key="i">
      <span v-for="(d, j) in part.split('')" :key="`${j}-${d}`" class="dv-flip-digit">
        <span>{{ d }}</span>
      </span>
      <span v-if="i < parts.length - 1" class="dv-flip-sep">:</span>
    </template>
  </span>
</template>
