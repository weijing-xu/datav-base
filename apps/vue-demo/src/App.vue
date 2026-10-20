<script setup lang="ts">
import {
  DvAlert,
  DvBorderBox,
  DvCapsuleChart,
  DvChart,
  DvConicalChart,
  DvDecoration1,
  DvDecoration10,
  DvDecoration2,
  DvDecoration3,
  DvDecoration5,
  DvDecoration6,
  DvDecoration7,
  DvDecoration8,
  DvDecoration9,
  DvDigitalFlop,
  DvFlipClock,
  DvFlylineMap,
  DvFullScreenContainer,
  DvGauge,
  DvGlitchText,
  DvGlobe,
  DvLoading,
  DvMarqueeText,
  DvPercentRing,
  DvPlexus,
  DvScrollBoard,
  DvScrollRanking,
  DvTiltCard,
  DvTrendValue,
  DvTypewriter,
  DvWaterLevelPond,
} from "@dv/vue";
import {
  dvFunnelOption,
  dvRadarOption,
  dvSankeyOption,
  geoBounds,
  type GeoJSONCollection,
  type GeoJSONFeature,
} from "@dv/core";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const pv = ref(1280435);
const uv = ref(86321);
const water = ref(62);
const china = ref<GeoJSONCollection>();
const drill = ref<{ name: string; data: GeoJSONCollection }>();
let timer: number | undefined;

onMounted(() => {
  fetch(`${import.meta.env.BASE_URL}china.json`)
    .then((r) => r.json())
    .then((j: GeoJSONCollection) => (china.value = j))
    .catch(() => {});
});

/** Province click → fetch province GeoJSON from the DataV boundary CDN and drill in. */
const drillIn = (f: GeoJSONFeature) => {
  const adcode = f.properties?.adcode;
  if (typeof adcode !== "number") return;
  fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`)
    .then((r) => r.json())
    .then((j: GeoJSONCollection) => (drill.value = { name: f.properties?.name ?? "", data: j }))
    .catch(() => {});
};

const activeGeo = computed(() => drill.value?.data ?? china.value);
const mapData = computed(() => {
  const geo = activeGeo.value;
  if (!geo) return { points: NORM_POINTS, lines: FLY_LINES };
  const b = geoBounds(geo);
  const points = CITY_POINTS.filter((p) => p.x >= b.minX && p.x <= b.maxX && p.y >= b.minY && p.y <= b.maxY);
  const lines = FLY_LINES.map((l) => ({
    from: points.indexOf(CITY_POINTS[l.from]!),
    to: points.indexOf(CITY_POINTS[l.to]!),
  })).filter((l) => l.from >= 0 && l.to >= 0);
  return { points, lines };
});

onMounted(() => {
  timer = window.setInterval(() => {
    pv.value += Math.round(Math.random() * 5000);
    uv.value += Math.round(Math.random() * 300);
    water.value = 45 + Math.random() * 40;
  }, 2000);
});

onBeforeUnmount(() => window.clearInterval(timer));

// Normalized fallback used while china.json is still loading.
const NORM_POINTS = [
  { x: 0.78, y: 0.3, name: "北京" },
  { x: 0.72, y: 0.55, name: "武汉" },
  { x: 0.82, y: 0.65, name: "上海" },
  { x: 0.45, y: 0.45, name: "兰州" },
  { x: 0.6, y: 0.75, name: "广州" },
  { x: 0.35, y: 0.62, name: "成都" },
];

// Real lng/lat over the China GeoJSON base map.
const CITY_POINTS = [
  { x: 116.41, y: 39.9, name: "北京" },
  { x: 114.3, y: 30.6, name: "武汉" },
  { x: 121.47, y: 31.23, name: "上海" },
  { x: 103.82, y: 36.06, name: "兰州" },
  { x: 113.26, y: 23.13, name: "广州" },
  { x: 104.07, y: 30.57, name: "成都" },
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

/** Demo GeoJSON — abstract regions in 0-100 coordinates. */
const REGIONS: GeoJSONCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "西北" }, geometry: { type: "Polygon", coordinates: [[[20, 60], [48, 60], [48, 80], [20, 80]]] } },
    { type: "Feature", properties: { name: "西南" }, geometry: { type: "Polygon", coordinates: [[[28, 32], [48, 32], [48, 60], [28, 60]]] } },
    { type: "Feature", properties: { name: "华中" }, geometry: { type: "Polygon", coordinates: [[[48, 42], [70, 42], [70, 66], [48, 66]]] } },
    { type: "Feature", properties: { name: "华东" }, geometry: { type: "Polygon", coordinates: [[[70, 28], [92, 28], [92, 55], [70, 55]]] } },
    { type: "Feature", properties: { name: "华南" }, geometry: { type: "Polygon", coordinates: [[[55, 10], [84, 10], [84, 30], [55, 30]]] } },
    { type: "Feature", properties: { name: "华北" }, geometry: { type: "Polygon", coordinates: [[[60, 62], [90, 62], [90, 88], [60, 88]]] } },
  ],
};

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

const borderVariants = ["box7", "box8", "box9", "box10", "box11", "box12", "box13"] as const;

const globeMarkers = [
  { lat: 39.9, lng: 116.41 }, // 北京
  { lat: 31.23, lng: 121.47 }, // 上海
  { lat: 40.7, lng: -74.0 }, // 纽约
  { lat: 51.5, lng: -0.1 }, // 伦敦
  { lat: 35.7, lng: 139.7 }, // 东京
  { lat: 1.35, lng: 103.8 }, // 新加坡
  { lat: 50.1, lng: 8.7 }, // 法兰克福
  { lat: -33.9, lng: 151.2 }, // 悉尼
  { lat: 25.2, lng: 55.3 }, // 迪拜
];
const globeLines: [number, number][] = [
  [0, 2],
  [0, 4],
  [1, 5],
  [2, 3],
  [3, 6],
  [5, 7],
  [0, 8],
];

const capsuleRows = Array.from({ length: 5 }, (_, i) => ({
  name: `通道-${String(i + 1).padStart(2, "0")}`,
  value: Math.round(20 + Math.random() * 80),
}));

const deadline = Date.now() + 8 * 3600 * 1000 + 42 * 60 * 1000;

const feed = [
  "华东区节点-03 负载恢复正常",
  "广州链路延迟降至 12ms",
  "新增接入 3 个边缘节点",
  "数据同步任务完成 98%",
  "兰州 → 上海 飞线流量上升 34%",
];

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

const radarOption = dvRadarOption({
  indicators: ["吞吐", "时延", "可用率", "覆盖", "安全"],
  max: 100,
  series: [
    { name: "华东链路", values: [82, 68, 96, 74, 88] },
    { name: "华南链路", values: [70, 81, 92, 65, 79], color: "#48ffe0" },
  ],
});

const funnelOption = dvFunnelOption({
  data: [
    { name: "请求接入", value: 12000 },
    { name: "鉴权通过", value: 9800 },
    { name: "数据返回", value: 7600 },
    { name: "成功落库", value: 5200 },
    { name: "下游分发", value: 3100 },
  ],
});

const sankeyOption = dvSankeyOption({
  links: [
    { source: "边缘节点", target: "华东中心", value: 42 },
    { source: "边缘节点", target: "华南中心", value: 28 },
    { source: "华东中心", target: "实时仓", value: 30 },
    { source: "华东中心", target: "离线仓", value: 12 },
    { source: "华南中心", target: "实时仓", value: 20 },
    { source: "华南中心", target: "离线仓", value: 8 },
    { source: "实时仓", target: "大屏服务", value: 50 },
  ],
});
</script>

<template>
  <DvFullScreenContainer :design-height="1500">
    <div style="position: relative; width: 100%; height: 100%; color: #d5f1ff">
      <div style="position: absolute; inset: 0; opacity: 0.35; pointer-events: none">
        <DvPlexus :points="70" :speed="14" />
      </div>
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
          <DvTypewriter
            text="React19 + Vue3 双端同引擎 · effects in @dv/core"
            :speed="18"
            loop
            style="font-size: 14px; color: #5b87a8"
          />
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
            <DvTiltCard style="flex: 1">
              <div class="card" style="height: 100%">
                <span class="label">累计访问量</span>
                <DvDigitalFlop :value="pv" style="font-size: 40px" />
                <DvTrendValue :value="pv" :delta="4.6" style="font-size: 14px" />
              </div>
            </DvTiltCard>
            <DvTiltCard style="flex: 1">
              <div class="card" style="height: 100%">
                <span class="label">在线人数</span>
                <DvDigitalFlop :value="uv" style="font-size: 40px; color: #48ffe0" />
                <DvTrendValue :value="uv" :delta="-1.8" style="font-size: 14px" />
              </div>
            </DvTiltCard>
          </div>
          <div class="card" style="padding: 12px 20px">
            <span class="label">系统时间 · 倒计时</span>
            <DvFlipClock :to="deadline" />
          </div>
          <DvAlert level="warn">
            <DvGlitchText text="3 个节点负载超过阈值，请关注华东区扩容" />
          </DvAlert>
          <DvBorderBox variant="box4" style="height: 320px">
            <h3 class="panel-title">节点监控</h3>
            <DvScrollBoard
              :header="['节点', '负载', '状态', '更新时间']"
              :rows="boardRows"
              :row-height="34"
              :speed="20"
            />
          </DvBorderBox>
          <DvBorderBox variant="box2" style="height: 190px">
            <h3 class="panel-title">锥形分布</h3>
            <DvConicalChart :rows="capsuleRows" unit="%" style="height: calc(100% - 46px)" />
          </DvBorderBox>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px">
          <DvBorderBox variant="box3" style="height: 420px">
            <h3 class="panel-title">数据迁徙{{ drill ? ` · ${drill.name}` : " · 点击省份下钻" }}</h3>
            <button
              v-if="drill"
              class="drill-back"
              @click="drill = undefined"
            >
              ← 返回全国
            </button>
            <DvFlylineMap
              :points="mapData.points"
              :lines="mapData.lines"
              labels
              :speed="0.3"
              :geo-json="activeGeo ?? REGIONS"
              :geo-highlight="china ? ['广东省', '上海市', '北京市'] : ['华东', '华南']"
              :coord="activeGeo ? 'geo' : 'normalized'"
              @geo-pick="drillIn"
            />
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
                <DvWaterLevelPond :value="water" :size="90" />
                <DvPercentRing :value="water" :size="90" />
                <DvGauge :value="water" :size="100" />
                <DvLoading text="同步中" :size="60" />
              </div>
            </DvBorderBox>
            <DvBorderBox variant="box6" style="flex: 1">
              <h3 class="panel-title">区域排名</h3>
              <DvScrollRanking :rows="rankingRows" :row-height="30" :speed="18" unit=" 单" />
            </DvBorderBox>
          </div>
          <DvBorderBox variant="box4" style="height: 300px">
            <h3 class="panel-title">全球链路</h3>
            <DvGlobe :markers="globeMarkers" :lines="globeLines" />
          </DvBorderBox>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px">
          <DvBorderBox variant="box5" style="height: 340px">
            <h3 class="panel-title">周吞吐趋势</h3>
            <DvChart :option="barOption" />
          </DvBorderBox>
          <DvBorderBox variant="box1" style="height: 190px">
            <h3 class="panel-title">通道负载</h3>
            <DvCapsuleChart :rows="capsuleRows" unit="%" />
          </DvBorderBox>
          <div style="display: flex; gap: 16px; height: 150px">
            <div style="position: relative; flex: 1">
              <DvDecoration3 :period="5" />
            </div>
            <div style="position: relative; flex: 1">
              <DvDecoration5 />
            </div>
            <div style="position: relative; flex: 1">
              <DvDecoration6 />
            </div>
            <div style="position: relative; flex: 1">
              <DvDecoration7 />
            </div>
            <div style="position: relative; flex: 1">
              <DvDecoration8 />
            </div>
            <div style="position: relative; flex: 1">
              <DvDecoration9 />
            </div>
            <div style="position: relative; flex: 1">
              <DvDecoration10 />
            </div>
          </div>
        </div>
      </main>

      <section style="display: flex; gap: 24px; margin: 24px 40px 0; height: 240px">
        <DvBorderBox variant="box8" style="flex: 1">
          <h3 class="panel-title">链路质量</h3>
          <DvChart :option="radarOption" />
        </DvBorderBox>
        <DvBorderBox variant="box9" style="flex: 1">
          <h3 class="panel-title">接入漏斗</h3>
          <DvChart :option="funnelOption" />
        </DvBorderBox>
        <DvBorderBox variant="box12" style="flex: 1">
          <h3 class="panel-title">数据流向</h3>
          <DvChart :option="sankeyOption" />
        </DvBorderBox>
      </section>

      <section style="display: flex; gap: 16px; margin: 24px 40px 0; height: 110px">
        <DvBorderBox v-for="v in borderVariants" :key="v" :variant="v" style="flex: 1">
          <div class="border-label">{{ v }}</div>
        </DvBorderBox>
      </section>

      <footer style="margin-top: 24px; padding: 0 40px">
        <DvMarqueeText :items="feed" :speed="70" />
      </footer>
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
.border-label {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5b87a8;
  font-size: 14px;
}
.drill-back {
  position: absolute;
  top: 44px;
  right: 14px;
  z-index: 3;
  background: rgba(0, 246, 255, 0.12);
  border: 1px solid rgba(0, 246, 255, 0.5);
  color: #00f6ff;
  font-size: 12px;
  padding: 3px 10px;
  cursor: pointer;
}
</style>
