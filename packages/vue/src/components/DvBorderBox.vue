<script setup lang="ts">
import { borderBoxPolys, onResize, type BorderBoxVariant } from "@dv/core";
import { onBeforeUnmount, onMounted, ref } from "vue";

interface Props {
  /** Border style variant. Default "box1". */
  variant?: BorderBoxVariant;
  /** [primary, accent] line colors. */
  colors?: [string, string];
}

const props = withDefaults(defineProps<Props>(), {
  variant: "box1",
  colors: () => ["#00f6ff", "#48ffe0"],
});

const box = ref<HTMLDivElement>();
const size = ref({ w: 0, h: 0 });
const polys = ref<ReturnType<typeof borderBoxPolys>>([]);
let offResize: (() => void) | undefined;

function rebuild() {
  polys.value =
    size.value.w > 0 && size.value.h > 0
      ? borderBoxPolys(props.variant, size.value.w, size.value.h, {
          primary: props.colors[0],
          accent: props.colors[1],
        })
      : [];
}

onMounted(() => {
  if (!box.value) return;
  offResize = onResize(box.value, () => {
    const rect = box.value!.getBoundingClientRect();
    size.value = { w: rect.width, h: rect.height };
    rebuild();
  });
});

onBeforeUnmount(() => offResize?.());
</script>

<template>
  <div ref="box" class="dv-border-box">
    <svg :viewBox="`0 0 ${size.w} ${size.h}`" preserveAspectRatio="none" aria-hidden="true">
      <polygon
        v-for="(p, i) in polys"
        :key="i"
        :points="p.points"
        :fill="p.fill ?? 'none'"
        :stroke="p.stroke"
        :stroke-width="p.strokeWidth"
        :stroke-dasharray="p.dash"
        :opacity="p.opacity"
      />
    </svg>
    <div class="dv-border-box-content">
      <slot />
    </div>
  </div>
</template>
