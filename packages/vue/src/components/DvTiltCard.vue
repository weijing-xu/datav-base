<script setup lang="ts">
import { createTilt } from "@dv/core";
import { onBeforeUnmount, onMounted, ref } from "vue";

interface Props {
  /** Max tilt in degrees. Default 10. */
  max?: number;
  scale?: number;
}

const props = defineProps<Props>();

const el = ref<HTMLElement>();
let tilt: ReturnType<typeof createTilt> | undefined;

onMounted(() => {
  if (el.value) {
    tilt = createTilt(el.value, { max: props.max, scale: props.scale });
  }
});

onBeforeUnmount(() => tilt?.destroy());
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
