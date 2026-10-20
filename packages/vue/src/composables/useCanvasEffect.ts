import type { EffectHandle } from "@dv/core";
import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

/**
 * Mounts a @dv/core canvas effect onto a canvas element and disposes it on
 * unmount. Every canvas-based Dv* component is a thin wrapper over this.
 */
export function useCanvasEffect<T extends EffectHandle>(
  create: (el: HTMLCanvasElement) => T,
): { canvas: Ref<HTMLCanvasElement | undefined>; handle: Ref<T | undefined> } {
  const canvas = ref<HTMLCanvasElement>();
  const handle = ref<T>();

  onMounted(() => {
    if (!canvas.value) return;
    handle.value = create(canvas.value);
  });

  onBeforeUnmount(() => {
    handle.value?.destroy();
    handle.value = undefined;
  });

  return { canvas, handle };
}
