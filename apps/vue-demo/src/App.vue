<script setup lang="ts">
import { DvBorderBox, DvDecoration1, DvDigitalFlop, DvFullScreenContainer, DvScrollBoard } from "@dv/vue";
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

const rows = Array.from({ length: 10 }, (_, i) => [
  `节点-${String(i + 1).padStart(2, "0")}`,
  `${(Math.random() * 100).toFixed(1)}%`,
  Math.random() > 0.3 ? "正常" : "告警",
  new Date(Date.now() - i * 60000).toLocaleTimeString(),
]);
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

      <section style="width: 720px; height: 360px; margin: 60px auto 0">
        <DvBorderBox variant="box1">
          <DvScrollBoard
            :header="['节点', '负载', '状态', '更新时间']"
            :rows="rows"
            :row-height="40"
            :speed="24"
          />
        </DvBorderBox>
      </section>
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
