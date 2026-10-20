<script setup lang="ts">
import { computed } from "vue";

interface CapsuleItem {
  name: string;
  value: number;
}

interface Props {
  rows: CapsuleItem[];
  /** Max bar value; defaults to the largest row value. */
  max?: number;
  unit?: string;
}

const props = withDefaults(defineProps<Props>(), {
  unit: "",
});

const peak = computed(() => props.max ?? Math.max(...props.rows.map((r) => r.value), 1));
</script>

<template>
  <div class="dv-capsule">
    <div v-for="(row, i) in rows" :key="i" class="dv-capsule-row">
      <span class="dv-capsule-name">{{ row.name }}</span>
      <span class="dv-capsule-bar">
        <i :style="{ width: `${(row.value / peak) * 100}%` }" />
      </span>
      <span class="dv-capsule-value">{{ row.value }}{{ unit }}</span>
    </div>
  </div>
</template>
