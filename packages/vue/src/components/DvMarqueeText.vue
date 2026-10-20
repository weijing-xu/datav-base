<script setup lang="ts">
import { createMarquee } from "@dv/core";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

interface Props {
  items: string[];
  /** Pixels per second. Default 60. */
  speed?: number;
  /** Pause while hovered. Default true. */
  hoverPause?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  speed: 60,
  hoverPause: true,
});

const track = ref<HTMLElement>();
const looped = computed(() => [...props.items, ...props.items]);
let marquee: ReturnType<typeof createMarquee> | undefined;

onMounted(() => {
  if (track.value) {
    marquee = createMarquee(track.value, { speed: props.speed, hoverPause: props.hoverPause });
  }
});

onBeforeUnmount(() => marquee?.destroy());
</script>

<template>
  <div class="dv-marquee">
    <div ref="track" class="dv-marquee-track">
      <span v-for="(item, i) in looped" :key="i" class="dv-marquee-item">{{ item }}</span>
    </div>
  </div>
</template>
