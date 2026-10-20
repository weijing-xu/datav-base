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
} from "@dv/react";
import { dvFunnelOption, dvRadarOption, dvSankeyOption, geoBounds } from "@dv/core";
import { useEffect, useMemo, useState } from "react";


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

// Globe markers (lat/lng) — hub cities; lines are index pairs into this list.
const GLOBE_CITIES: { lat: number; lng: number }[] = [
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
const globeMarkers = GLOBE_CITIES;
const globeLines: [number, number][] = [
  [0, 2],
  [0, 4],
  [1, 5],
  [2, 3],
  [3, 6],
  [5, 7],
  [0, 8],
];

/** Demo GeoJSON — abstract regions in 0-100 coordinates. */
const REGIONS: import("@dv/core").GeoJSONCollection = {
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

export function App() {
  const [pv, setPv] = useState(1280435);
  const [uv, setUv] = useState(86321);
  const [water, setWater] = useState(62);
  const [china, setChina] = useState<import("@dv/core").GeoJSONCollection>();
  const [drill, setDrill] = useState<{ name: string; data: import("@dv/core").GeoJSONCollection }>();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}china.json`)
      .then((r) => r.json())
      .then((j: import("@dv/core").GeoJSONCollection) => setChina(j))
      .catch(() => {});
  }, []);

  /** Province click → fetch province GeoJSON from the DataV boundary CDN and drill in. */
  const drillIn = (f: import("@dv/core").GeoJSONFeature) => {
    const adcode = f.properties?.adcode;
    if (typeof adcode !== "number") return;
    fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`)
      .then((r) => r.json())
      .then((j: import("@dv/core").GeoJSONCollection) => setDrill({ name: f.properties?.name ?? "", data: j }))
      .catch(() => {});
  };

  const activeGeo = drill?.data ?? china;
  const { mapPoints, mapLines } = useMemo(() => {
    if (!activeGeo) return { mapPoints: NORM_POINTS, mapLines: FLY_LINES };
    const b = geoBounds(activeGeo);
    const pts = CITY_POINTS.filter((p) => p.x >= b.minX && p.x <= b.maxX && p.y >= b.minY && p.y <= b.maxY);
    const lines = FLY_LINES.map((l) => ({
      from: pts.indexOf(CITY_POINTS[l.from]!),
      to: pts.indexOf(CITY_POINTS[l.to]!),
    })).filter((l) => l.from >= 0 && l.to >= 0);
    return { mapPoints: pts, mapLines: lines };
  }, [activeGeo]);

  useEffect(() => {
    const id = setInterval(() => {
      setPv((v) => v + Math.round(Math.random() * 5000));
      setUv((v) => v + Math.round(Math.random() * 300));
      setWater(45 + Math.random() * 40);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const boardRows = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => [
        `节点-${String(i + 1).padStart(2, "0")}`,
        `${(Math.random() * 100).toFixed(1)}%`,
        Math.random() > 0.3 ? "正常" : "告警",
        new Date(Date.now() - i * 60000).toLocaleTimeString(),
      ]),
    [],
  );

  const rankingRows = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        name: `区域-${String(i + 1).padStart(2, "0")}`,
        value: Math.round(500 + Math.random() * 9500),
      })),
    [],
  );

  const capsuleRows = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        name: `通道-${String(i + 1).padStart(2, "0")}`,
        value: Math.round(20 + Math.random() * 80),
      })),
    [],
  );

  const deadline = useMemo(() => Date.now() + 8 * 3600 * 1000 + 42 * 60 * 1000, []);

  const feed = useMemo(
    () => [
      "华东区节点-03 负载恢复正常",
      "广州链路延迟降至 12ms",
      "新增接入 3 个边缘节点",
      "数据同步任务完成 98%",
      "兰州 → 上海 飞线流量上升 34%",
    ],
    [],
  );

  const barOption = useMemo(
    () => ({
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
    }),
    [],
  );

  const radarOption = useMemo(
    () =>
      dvRadarOption({
        indicators: ["吞吐", "时延", "可用率", "覆盖", "安全"],
        max: 100,
        series: [
          { name: "华东链路", values: [82, 68, 96, 74, 88] },
          { name: "华南链路", values: [70, 81, 92, 65, 79], color: "#48ffe0" },
        ],
      }),
    [],
  );

  const funnelOption = useMemo(
    () =>
      dvFunnelOption({
        data: [
          { name: "请求接入", value: 12000 },
          { name: "鉴权通过", value: 9800 },
          { name: "数据返回", value: 7600 },
          { name: "成功落库", value: 5200 },
          { name: "下游分发", value: 3100 },
        ],
      }),
    [],
  );

  const sankeyOption = useMemo(
    () =>
      dvSankeyOption({
        links: [
          { source: "边缘节点", target: "华东中心", value: 42 },
          { source: "边缘节点", target: "华南中心", value: 28 },
          { source: "华东中心", target: "实时仓", value: 30 },
          { source: "华东中心", target: "离线仓", value: 12 },
          { source: "华南中心", target: "实时仓", value: 20 },
          { source: "华南中心", target: "离线仓", value: 8 },
          { source: "实时仓", target: "大屏服务", value: 50 },
        ],
      }),
    [],
  );

  return (
    <DvFullScreenContainer designHeight={1500}>
      <div className="screen">
        <div className="screen-bg">
          <DvPlexus points={70} speed={14} />
        </div>

        <header className="screen-header">
          <div className="screen-side">
            <DvDecoration3 period={5} />
          </div>
          <div style={{ textAlign: "center" }}>
            <h1 className="screen-title">数据大屏基座</h1>
            <div style={{ height: 10, width: 420, margin: "8px auto 4px" }}>
              <DvDecoration2 period={4} />
            </div>
            <DvTypewriter
              text="React 19 + Vue 3 双端同引擎 · effects in @dv/core"
              speed={18}
              loop
              style={{ fontSize: 13, color: "#54799b", letterSpacing: 2 }}
            />
          </div>
          <div className="screen-side" style={{ textAlign: "right" }}>
            <DvFlipClock to={deadline} />
          </div>
        </header>

        <main className="screen-main">
          <div className="col">
            <div className="stat-row">
              <DvTiltCard style={{ flex: 1 }}>
                <div className="stat-card">
                  <span className="stat-label">累计访问量</span>
                  <DvDigitalFlop value={pv} style={{ fontSize: 36 }} />
                  <DvTrendValue value={pv} delta={4.6} style={{ fontSize: 13 }} />
                </div>
              </DvTiltCard>
              <DvTiltCard style={{ flex: 1 }}>
                <div className="stat-card">
                  <span className="stat-label">在线人数</span>
                  <DvDigitalFlop value={uv} style={{ fontSize: 36, color: "#48ffe0" }} />
                  <DvTrendValue value={uv} delta={-1.8} style={{ fontSize: 13 }} />
                </div>
              </DvTiltCard>
            </div>
            <div className="alert-wrap">
              <DvAlert level="warn">
                <DvGlitchText text="3 个节点负载超过阈值，请关注华东区扩容" />
              </DvAlert>
            </div>
            <section className="panel" style={{ height: 360 }}>
              <h3 className="panel-title">节点监控</h3>
              <div className="panel-body">
                <DvScrollBoard
                  header={["节点", "负载", "状态", "更新时间"]}
                  rows={boardRows}
                  rowHeight={34}
                  speed={20}
                />
              </div>
            </section>
            <section className="panel" style={{ height: 210 }}>
              <h3 className="panel-title">锥形分布</h3>
              <div className="panel-body">
                <DvConicalChart rows={capsuleRows} unit="%" />
              </div>
            </section>
          </div>

          <div className="col">
            <DvBorderBox variant="box3" style={{ height: 460 }}>
              <h3 className="panel-title">
                数据迁徙{drill ? ` · ${drill.name}` : " · 点击省份下钻"}
              </h3>
              {drill && (
                <button className="drill-back" onClick={() => setDrill(undefined)}>
                  ← 返回全国
                </button>
              )}
              <DvFlylineMap
                points={mapPoints}
                lines={mapLines}
                labels
                speed={0.3}
                geoJson={activeGeo ?? REGIONS}
                geoHighlight={china ? ["广东省", "上海市", "北京市"] : ["华东", "华南"]}
                coord={activeGeo ? "geo" : "normalized"}
                onGeoPick={drillIn}
              />
            </DvBorderBox>
            <div className="row" style={{ height: 200 }}>
              <section className="panel" style={{ flex: 1 }}>
                <h3 className="panel-title">实时水位</h3>
                <div
                  className="panel-body"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}
                >
                  <DvWaterLevelPond value={water} size={90} />
                  <DvPercentRing value={water} size={90} />
                  <DvGauge value={water} size={100} />
                  <DvLoading text="同步中" size={60} />
                </div>
              </section>
              <section className="panel" style={{ flex: 1 }}>
                <h3 className="panel-title">区域排名</h3>
                <div className="panel-body">
                  <DvScrollRanking rows={rankingRows} rowHeight={30} speed={18} unit=" 单" />
                </div>
              </section>
            </div>
            <section className="panel" style={{ height: 290 }}>
              <h3 className="panel-title">全球链路</h3>
              <div className="panel-body">
                <DvGlobe markers={globeMarkers} lines={globeLines} />
              </div>
            </section>
          </div>

          <div className="col">
            <section className="panel" style={{ height: 380 }}>
              <h3 className="panel-title">周吞吐趋势</h3>
              <div className="panel-body">
                <DvChart option={barOption} />
              </div>
            </section>
            <section className="panel" style={{ height: 200 }}>
              <h3 className="panel-title">通道负载</h3>
              <div className="panel-body">
                <DvCapsuleChart rows={capsuleRows} unit="%" />
              </div>
            </section>
            <div className="deco-strip" style={{ padding: 0 }}>
              {[
                { name: "雷达扫描", node: <DvDecoration3 period={5} /> },
                { name: "轨道光点", node: <DvDecoration5 /> },
                { name: "脉冲环", node: <DvDecoration6 /> },
                { name: "流动斜纹", node: <DvDecoration7 /> },
                { name: "刻度盘", node: <DvDecoration8 /> },
                { name: "箭头流", node: <DvDecoration9 /> },
                { name: "取景框", node: <DvDecoration10 /> },
              ].map((d) => (
                <div key={d.name} className="deco-cell">
                  {d.node}
                  <span className="deco-name">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <section className="chart-strip">
          <section className="panel">
            <h3 className="panel-title">链路质量</h3>
            <div className="panel-body">
              <DvChart option={radarOption} />
            </div>
          </section>
          <section className="panel">
            <h3 className="panel-title">接入漏斗</h3>
            <div className="panel-body">
              <DvChart option={funnelOption} />
            </div>
          </section>
          <section className="panel">
            <h3 className="panel-title">数据流向</h3>
            <div className="panel-body">
              <DvChart option={sankeyOption} />
            </div>
          </section>
        </section>

        <section className="variant-strip">
          {(["box7", "box8", "box9", "box10", "box11", "box12", "box13"] as const).map((v) => (
            <DvBorderBox key={v} variant={v} className="variant-cell">
              <div className="variant-label">{v}</div>
            </DvBorderBox>
          ))}
        </section>

        <footer className="screen-footer">
          <DvMarqueeText items={feed} speed={70} />
        </footer>
      </div>
    </DvFullScreenContainer>
  );
}
