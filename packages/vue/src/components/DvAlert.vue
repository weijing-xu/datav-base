<script setup lang="ts">
interface Props {
  /** Alert level: danger (red, default) or warn (amber). */
  level?: "danger" | "warn";
}

withDefaults(defineProps<Props>(), { level: "danger" });
</script>

<template>
  <div class="dv-alert" :class="{ 'dv-alert-warn': level === 'warn' }" role="alert">
    <i class="dv-alert-dot" />
    <slot />
  </div>
</template>
