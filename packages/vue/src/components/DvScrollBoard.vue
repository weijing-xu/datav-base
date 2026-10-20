<script setup lang="ts">
import { createScrollLoop } from "@dv/core";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

interface Props {
  /** Optional header cells. */
  header?: string[];
  /** Body rows; each row is a list of cells rendered as flex columns. */
  rows: (string | number)[][];
  /** Row height in px. Default 36. */
  rowHeight?: number;
  /** Scroll speed in px/s. Default 30. */
  speed?: number;
  /** Pause on hover. Default true. */
  hoverPause?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  rowHeight: 36,
  speed: 30,
  hoverPause: true,
});

const track = ref<HTMLDivElement>();
const looped = computed(() => [...props.rows, ...props.rows]);
let loop: ReturnType<typeof createScrollLoop> | undefined;

onMounted(() => {
  if (!track.value) return;
  loop = createScrollLoop(track.value, { speed: props.speed, hoverPause: props.hoverPause });
});

onBeforeUnmount(() => loop?.destroy());
</script>

<template>
  <div class="dv-scroll-board">
    <div
      v-if="header && header.length"
      class="dv-scroll-board-header"
      :style="{ height: `${rowHeight}px`, lineHeight: `${rowHeight}px` }"
    >
      <div v-for="(cell, i) in header" :key="i" class="dv-scroll-board-cell">{{ cell }}</div>
    </div>
    <div class="dv-scroll-board-body">
      <div ref="track">
        <div
          v-for="(row, i) in looped"
          :key="i"
          class="dv-scroll-board-row"
          :style="{ height: `${rowHeight}px` }"
        >
          <div v-for="(cell, j) in row" :key="j" class="dv-scroll-board-cell">{{ cell }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
