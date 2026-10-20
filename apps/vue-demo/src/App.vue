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

const decos = [
  { name: "雷达扫描", node: DvDecoration3 },
  { name: "轨道光点", node: DvDecoration5 },
  { name: "脉冲环", node: DvDecoration6 },
  { name: "流动斜纹", node: DvDecoration7 },
  { name: "刻度盘", node: DvDecoration8 },
  { name: "箭头流", node: DvDecoration9 },
  { name: "取景框", node: DvDecoration10 },
];

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
    <div class="screen">
      <div class="screen-bg">
        <DvPlexus :points="70" :speed="14" />
      </div>

      <header class="screen-header">
        <div class="screen-side">
          <DvDecoration3 :period="5" />
        </div>
        <div style="text-align: center">
          <h1 class="screen-title">数据大屏基座</h1>
          <div style="height: 10px; width: 420px; margin: 8px auto 4px">
            <DvDecoration2 :period="4" />
          </div>
          <DvTypewriter
            text="React 19 + Vue 3 双端同引擎 · effects in @dv/core"
            :speed="18"
            loop
            style="font-size: 13px; color: #54799b; letter-spacing: 2px"
          />
        </div>
        <div class="screen-side" style="text-align: right">
          <DvFlipClock :to="deadline" />
        </div>
      </header>

      <main class="screen-main">
        <div class="col">
          <div class="stat-row">
            <DvTiltCard style="flex: 1">
              <div class="stat-card">
                <span class="stat-label">累计访问量</span>
                <DvDigitalFlop :value="pv" style="font-size: 36px" />
                <DvTrendValue :value="pv" :delta="4.6" style="font-size: 13px" />
              </div>
            </DvTiltCard>
            <DvTiltCard style="flex: 1">
              <div class="stat-card">
                <span class="stat-label">在线人数</span>
                <DvDigitalFlop :value="uv" style="font-size: 36px; color: #48ffe0" />
                <DvTrendValue :value="uv" :delta="-1.8" style="font-size: 13px" />
              </div>
            </DvTiltCard>
          </div>
          <div class="alert-wrap">
            <DvAlert level="warn">
              <DvGlitchText text="3 个节点负载超过阈值，请关注华东区扩容" />
            </DvAlert>
          </div>
          <section class="panel" style="height: 360px">
            <h3 class="panel-title">节点监控</h3>
            <div class="panel-body">
              <DvScrollBoard
                :header="['节点', '负载', '状态', '更新时间']"
                :rows="boardRows"
                :row-height="34"
                :speed="20"
              />
            </div>
          </section>
          <section class="panel" style="height: 210px">
            <h3 class="panel-title">锥形分布</h3>
            <div class="panel-body">
              <DvConicalChart :rows="capsuleRows" unit="%" />
            </div>
          </section>
        </div>

        <div class="col">
          <DvBorderBox variant="box3" style="height: 460px">
            <h3 class="panel-title">数据迁徙{{ drill ? ` · ${drill.name}` : " · 点击省份下钻" }}</h3>
            <button v-if="drill" class="drill-back" @click="drill = undefined">← 返回全国</button>
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
          <div class="row" style="height: 200px">
            <section class="panel" style="flex: 1">
              <h3 class="panel-title">实时水位</h3>
              <div
                class="panel-body"
                style="display: flex; align-items: center; justify-content: space-around"
              >
                <DvWaterLevelPond :value="water" :size="90" />
                <DvPercentRing :value="water" :size="90" />
                <DvGauge :value="water" :size="100" />
                <DvLoading text="同步中" :size="60" />
              </div>
            </section>
            <section class="panel" style="flex: 1">
              <h3 class="panel-title">区域排名</h3>
              <div class="panel-body">
                <DvScrollRanking :rows="rankingRows" :row-height="30" :speed="18" unit=" 单" />
              </div>
            </section>
          </div>
          <section class="panel" style="height: 290px">
            <h3 class="panel-title">全球链路</h3>
            <div class="panel-body">
              <DvGlobe :markers="globeMarkers" :lines="globeLines" />
            </div>
          </section>
        </div>

        <div class="col">
          <section class="panel" style="height: 380px">
            <h3 class="panel-title">周吞吐趋势</h3>
            <div class="panel-body">
              <DvChart :option="barOption" />
            </div>
          </section>
          <section class="panel" style="height: 200px">
            <h3 class="panel-title">通道负载</h3>
            <div class="panel-body">
              <DvCapsuleChart :rows="capsuleRows" unit="%" />
            </div>
          </section>
          <div class="deco-strip" style="padding: 0">
            <div v-for="d in decos" :key="d.name" class="deco-cell">
              <component :is="d.node" />
              <span class="deco-name">{{ d.name }}</span>
            </div>
          </div>
        </div>
      </main>

      <section class="chart-strip">
        <section class="panel">
          <h3 class="panel-title">链路质量</h3>
          <div class="panel-body"><DvChart :option="radarOption" /></div>
        </section>
        <section class="panel">
          <h3 class="panel-title">接入漏斗</h3>
          <div class="panel-body"><DvChart :option="funnelOption" /></div>
        </section>
        <section class="panel">
          <h3 class="panel-title">数据流向</h3>
          <div class="panel-body"><DvChart :option="sankeyOption" /></div>
        </section>
      </section>

      <section class="variant-strip">
        <DvBorderBox v-for="v in borderVariants" :key="v" :variant="v" class="variant-cell">
          <div class="variant-label">{{ v }}</div>
        </DvBorderBox>
      </section>

      <footer class="screen-footer">
        <DvMarqueeText :items="feed" :speed="70" />
      </footer>
    </div>
  </DvFullScreenContainer>
</template>

