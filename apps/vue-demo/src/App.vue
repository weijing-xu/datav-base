<script setup lang="ts">
import {
  DvAlert,
  DvBorderBox,
  DvChart,
  DvDecoration1,
  DvDecoration2,
  DvDigitalFlop,
  DvFlylineMap,
  DvFullScreenContainer,
  DvLoading,
  DvScrollBoard,
  DvScrollRanking,
  DvWaterLevelPond,
} from "@dv/vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

const pv = ref(1280435);
const uv = ref(86321);
const water = ref(62);
let timer: number | undefined;

onMounted(() => {
  timer = window.setInterval(() => {
    pv.value += Math.round(Math.random() * 5000);
    uv.value += Math.round(Math.random() * 300);
    water.value = 45 + Math.random() * 40;
  }, 2000);
});

onBeforeUnmount(() => window.clearInterval(timer));

const CITY_POINTS = [
  { x: 0.78, y: 0.3, name: "北京" },
  { x: 0.72, y: 0.55, name: "武汉" },
  { x: 0.82, y: 0.65, name: "上海" },
  { x: 0.45, y: 0.45, name: "兰州" },
  { x: 0.6, y: 0.75, name: "广州" },
  { x: 0.35, y: 0.62, name: "成都" },
];

const FLY_LINES = [
  { from: 3, to: 0 },
  { from: 3, to: 1 },
  { from: 3, to: 2 },
  { from: 3, to: 4 },
  { from: 3, to: 5 },
  { from: 0, to: 2 },
  { from: 5, to: 4 },
];

const boardRows = Array.from({ length: 10 }, (_, i) => [
  `节点-${String(i + 1).padStart(2, "0")}`,
  `${(Math.random() * 100).toFixed(1)}%`,
  Math.random() > 0.3 ? "正常" : "告警",
  new Date(Date.now() - i * 60000).toLocaleTimeString(),
]);

const rankingRows = Array.from({ length: 8 }, (_, i) => ({
  name: `区域-${String(i + 1).padStart(2, "0")}`,
  value: Math.round(500 + Math.random() * 9500),
}));

const barOption = {
  grid: { left: 60, right: 20, top: 30, bottom: 30 },
  xAxis: { type: "category", data: ["一", "二", "三", "四", "五", "六", "日"] },
  yAxis: { type: "value" },
  series: [
    {
      type: "bar",
      data: [8200, 9320, 9010, 13400, 12900, 15300, 13200],
      barWidth: "45%",
      itemStyle: {
        color: {
          type: "linear",
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: "#00f6ff" },
            { offset: 1, color: "rgba(47,129,247,0.3)" },
          ],
        },
      },
    },
    {
      type: "line",
      smooth: true,
      data: [7500, 9800, 8600, 14200, 12100, 14800, 13900],
      lineStyle: { color: "#48ffe0" },
      itemStyle: { color: "#48ffe0" },
    },
  ],
};
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
        <div style="position: relative; text-align: center">
          <h1 style="margin: 0; font-size: 40px; letter-spacing: 12px">数据大屏基座 · Vue</h1>
          <div style="height: 12px; width: 480px; margin: 6px auto 0">
            <DvDecoration2 :period="4" />
          </div>
        </div>
      </header>

      <main
        style="
          display: grid;
          grid-template-columns: 520px 760px 520px;
          gap: 24px;
          padding: 0 40px;
          margin-top: 30px;
        "
      >
        <div style="display: flex; flex-direction: column; gap: 24px">
          <div style="display: flex; gap: 24px">
            <div class="card" style="flex: 1">
              <span class="label">累计访问量</span>
              <DvDigitalFlop :value="pv" style="font-size: 40px" />
            </div>
            <div class="card" style="flex: 1">
              <span class="label">在线人数</span>
              <DvDigitalFlop :value="uv" style="font-size: 40px; color: #48ffe0" />
            </div>
          </div>
          <DvAlert level="warn">3 个节点负载超过阈值，请关注华东区扩容</DvAlert>
          <DvBorderBox variant="box1" style="height: 340px">
            <h3 class="panel-title">节点监控</h3>
            <DvScrollBoard
              :header="['节点', '负载', '状态', '更新时间']"
              :rows="boardRows"
              :row-height="34"
              :speed="20"
            />
          </DvBorderBox>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px">
          <DvBorderBox variant="box3" style="height: 420px">
            <h3 class="panel-title">数据迁徙</h3>
            <DvFlylineMap :points="CITY_POINTS" :lines="FLY_LINES" labels :speed="0.3" />
          </DvBorderBox>
          <div style="display: flex; gap: 24px; height: 200px">
            <DvBorderBox variant="box2" style="flex: 1">
              <h3 class="panel-title">实时水位</h3>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-around;
                  height: calc(100% - 50px);
                "
              >
                <DvWaterLevelPond :value="water" :size="120" />
                <DvLoading text="同步中" :size="80" />
              </div>
            </DvBorderBox>
            <DvBorderBox variant="box1" style="flex: 1">
              <h3 class="panel-title">区域排名</h3>
              <DvScrollRanking :rows="rankingRows" :row-height="30" :speed="18" unit=" 单" />
            </DvBorderBox>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px">
          <DvBorderBox variant="box1" style="height: 400px">
            <h3 class="panel-title">周吞吐趋势</h3>
            <DvChart :option="barOption" />
          </DvBorderBox>
          <div style="position: relative; height: 200px">
            <div style="position: absolute; inset: 0">
              <DvDecoration3 :period="5" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </DvFullScreenContainer>
</template>

<style scoped>
.card {
  background: rgba(9, 32, 63, 0.6);
  border: 1px solid rgba(0, 246, 255, 0.45);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.label {
  color: #5b87a8;
  font-size: 16px;
}
.panel-title {
  font-size: 18px;
  color: #5b87a8;
  margin: 8px 0 4px;
  padding: 0 12px;
}
</style>
