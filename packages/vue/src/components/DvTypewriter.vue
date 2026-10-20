<script setup lang="ts">
import { createTypewriter, type TypewriterHandle } from "@dv/core";
import { onBeforeUnmount, ref, watch } from "vue";

interface Props {
  text: string;
  /** Characters per second. Default 20. */
  speed?: number;
  /** Restart typing after finishing. Default false. */
  loop?: boolean;
  /** Show a blinking block cursor. Default true. */
  cursor?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cursor: true,
});

const shown = ref("");
let handle: TypewriterHandle | undefined;

handle = createTypewriter({
  text: props.text,
  speed: props.speed,
  loop: props.loop,
  onUpdate: (current) => {
    shown.value = current;
  },
});

watch(
  () => props.text,
  (t) => handle?.setText(t),
);

onBeforeUnmount(() => handle?.destroy());
</script>

<template>
  <span class="dv-typewriter">
    <span>{{ shown }}</span>
    <i v-if="cursor" class="dv-typewriter-cursor" />
  </span>
</template>
