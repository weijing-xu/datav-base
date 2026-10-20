<script setup lang="ts">
import { createScrollLoop } from "@dv/core";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

interface RankingItem {
  name: string;
  value: number;
}

interface Props {
  rows: RankingItem[];
  /** Row height in px. Default 34. */
  rowHeight?: number;
  /** Scroll speed px/s. Default 24. */
  speed?: number;
  unit?: string;
  /** Max bar value; defaults to the largest row value. */
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  rowHeight: 34,
  speed: 24,
  unit: "",
});

const track = ref<HTMLDivElement>();
const peak = computed(() => props.max ?? Math.max(...props.rows.map((r) => r.value), 1));
const looped = computed(() => [...props.rows, ...props.rows]);
let loop: ReturnType<typeof createScrollLoop> | undefined;

onMounted(() => {
  if (!track.value) return;
  loop = createScrollLoop(track.value, { speed: props.speed });
});

onBeforeUnmount(() => loop?.destroy());
</script>

<template>
  <div class="dv-scroll-ranking">
    <div ref="track">
      <div
        v-for="(row, i) in looped"
        :key="i"
        class="dv-scroll-ranking-item"
        :style="{ height: `${rowHeight}px` }"
      >
        <span
          class="dv-scroll-ranking-rank"
          :class="{ 'dv-scroll-ranking-rank-top': (i % rows.length) < 3 }"
        >
          {{ (i % rows.length) + 1 }}
        </span>
        <span class="dv-scroll-ranking-name">{{ row.name }}</span>
        <span class="dv-scroll-ranking-bar">
          <i :style="{ width: `${(row.value / peak) * 100}%` }" />
        </span>
        <span class="dv-scroll-ranking-value">{{ row.value }}{{ unit }}</span>
      </div>
    </div>
  </div>
</template>
