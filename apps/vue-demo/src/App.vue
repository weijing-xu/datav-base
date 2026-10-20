<script setup lang="ts">
import { DvDecoration1, DvDigitalFlop, DvFullScreenContainer } from "@dv/vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

const pv = ref(1280435);
const uv = ref(86321);
let timer: number | undefined;

onMounted(() => {
  timer = window.setInterval(() => {
    pv.value += Math.round(Math.random() * 5000);
    uv.value += Math.round(Math.random() * 300);
  }, 2000);
});

onBeforeUnmount(() => window.clearInterval(timer));
</script>

<template>
  <DvFullScreenContainer>
    <div style="position: relative; width: 100%; height: 100%; color: #d5f1ff">
      <header
        style="height: 100px; display: flex; align-items: center; justify-content: center; position: relative"
      >
        <div style="position: absolute; inset: 0">
          <DvDecoration1 :points="60" :speed="1.4" />
        </div>
        <h1 style="position: relative; margin: 0; font-size: 40px; letter-spacing: 12px">
          数据大屏基座 · Vue
        </h1>
      </header>

      <main style="display: flex; gap: 40px; justify-content: center; margin-top: 60px">
        <div class="card">
          <span class="label">累计访问量</span>
          <DvDigitalFlop :value="pv" style="font-size: 56px" />
        </div>
        <div class="card">
          <span class="label">在线人数</span>
          <DvDigitalFlop :value="uv" style="font-size: 56px; color: #48ffe0" />
        </div>
      </main>
    </div>
  </DvFullScreenContainer>
</template>

<style scoped>
.card {
  background: rgba(9, 32, 63, 0.6);
  border: 1px solid rgba(0, 246, 255, 0.45);
  padding: 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.label {
  color: #5b87a8;
  font-size: 18px;
}
</style>
