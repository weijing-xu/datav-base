<script setup lang="ts">
import { createAutoFit } from "@dv/core";
import { onBeforeUnmount, onMounted, ref } from "vue";

interface Props {
  /** Design draft width. Default 1920. */
  designWidth?: number;
  /** Design draft height. Default 1080. */
  designHeight?: number;
  /** "width" (default, autofit.js style) or "contain". */
  mode?: "width" | "contain";
}

const props = withDefaults(defineProps<Props>(), {
  designWidth: 1920,
  designHeight: 1080,
  mode: "width",
});

const inner = ref<HTMLDivElement>();
let fit: ReturnType<typeof createAutoFit> | undefined;

onMounted(() => {
  if (!inner.value) return;
  fit = createAutoFit(inner.value, {
    width: props.designWidth,
    height: props.designHeight,
    mode: props.mode,
  });
});

onBeforeUnmount(() => fit?.destroy());
</script>

<template>
  <div class="dv-full-screen-container">
    <div ref="inner">
      <slot />
    </div>
  </div>
</template>
