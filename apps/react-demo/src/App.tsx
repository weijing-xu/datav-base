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
import { geoBounds } from "@dv/core";
import { useEffect, useMemo, useState } from "react";

const card: React.CSSProperties = {
  background: "rgba(9,32,63,0.6)",
  border: "1px solid rgba(0,246,255,0.45)",
  padding: "24px 40px",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const panelTitle: React.CSSProperties = {
  fontSize: 18,
  color: "#5b87a8",
  margin: "8px 0 4px",
  padding: "0 12px",
};

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

  return (
    <DvFullScreenContainer>
      <div style={{ position: "relative", width: "100%", height: "100%", color: "#d5f1ff" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }}>
          <DvPlexus points={70} speed={14} />
        </div>
        <header
          style={{
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            <DvDecoration1 points={60} speed={1.4} />
          </div>
          <div style={{ position: "relative", textAlign: "center" }}>
            <h1 style={{ margin: 0, fontSize: 40, letterSpacing: 12 }}>数据大屏基座 · React</h1>
            <div style={{ height: 12, width: 480, margin: "6px auto 0" }}>
              <DvDecoration2 period={4} />
            </div>
            <DvTypewriter
              text="React19 + Vue3 双端同引擎 · effects in @dv/core"
              speed={18}
              loop
              style={{ fontSize: 14, color: "#5b87a8" }}
            />
          </div>
        </header>

        <main
          style={{
            display: "grid",
            gridTemplateColumns: "520px 760px 520px",
            gap: 24,
            padding: "0 40px",
            marginTop: 30,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", gap: 24 }}>
              <DvTiltCard style={{ flex: 1 }}>
                <div style={{ ...card, padding: "16px 20px", height: "100%" }}>
                  <span style={{ color: "#5b87a8", fontSize: 16 }}>累计访问量</span>
                  <DvDigitalFlop value={pv} style={{ fontSize: 40 }} />
                  <DvTrendValue value={pv} delta={4.6} style={{ fontSize: 14 }} />
                </div>
              </DvTiltCard>
              <DvTiltCard style={{ flex: 1 }}>
                <div style={{ ...card, padding: "16px 20px", height: "100%" }}>
                  <span style={{ color: "#5b87a8", fontSize: 16 }}>在线人数</span>
                  <DvDigitalFlop value={uv} style={{ fontSize: 40, color: "#48ffe0" }} />
                  <DvTrendValue value={uv} delta={-1.8} style={{ fontSize: 14 }} />
                </div>
              </DvTiltCard>
            </div>
            <div style={{ ...card, padding: "12px 20px" }}>
              <span style={{ color: "#5b87a8", fontSize: 16 }}>系统时间 · 倒计时</span>
              <DvFlipClock to={deadline} />
            </div>
            <DvAlert level="warn">
              <DvGlitchText text="3 个节点负载超过阈值，请关注华东区扩容" />
            </DvAlert>
            <DvBorderBox variant="box4" style={{ height: 320 }}>
              <h3 style={panelTitle}>节点监控</h3>
              <DvScrollBoard
                header={["节点", "负载", "状态", "更新时间"]}
                rows={boardRows}
                rowHeight={34}
                speed={20}
              />
            </DvBorderBox>
            <DvBorderBox variant="box2" style={{ height: 190 }}>
              <h3 style={panelTitle}>锥形分布</h3>
              <DvConicalChart rows={capsuleRows} unit="%" style={{ height: "calc(100% - 46px)" }} />
            </DvBorderBox>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <DvBorderBox variant="box3" style={{ height: 420 }}>
              <h3 style={panelTitle}>数据迁徙{drill ? ` · ${drill.name}` : " · 点击省份下钻"}</h3>
              {drill && (
                <button
                  onClick={() => setDrill(undefined)}
                  style={{
                    position: "absolute",
                    top: 44,
                    right: 14,
                    zIndex: 3,
                    background: "rgba(0,246,255,0.12)",
                    border: "1px solid rgba(0,246,255,0.5)",
                    color: "#00f6ff",
                    fontSize: 12,
                    padding: "3px 10px",
                    cursor: "pointer",
                  }}
                >
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
            <div style={{ display: "flex", gap: 24, height: 200 }}>
              <DvBorderBox variant="box2" style={{ flex: 1 }}>
                <h3 style={panelTitle}>实时水位</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: "calc(100% - 50px)" }}>
                  <DvWaterLevelPond value={water} size={90} />
                  <DvPercentRing value={water} size={90} />
                  <DvGauge value={water} size={100} />
                  <DvLoading text="同步中" size={60} />
                </div>
              </DvBorderBox>
              <DvBorderBox variant="box6" style={{ flex: 1 }}>
                <h3 style={panelTitle}>区域排名</h3>
                <DvScrollRanking rows={rankingRows} rowHeight={30} speed={18} unit=" 单" />
              </DvBorderBox>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <DvBorderBox variant="box5" style={{ height: 340 }}>
              <h3 style={panelTitle}>周吞吐趋势</h3>
              <DvChart option={barOption} />
            </DvBorderBox>
            <DvBorderBox variant="box1" style={{ height: 190 }}>
              <h3 style={panelTitle}>通道负载</h3>
              <DvCapsuleChart rows={capsuleRows} unit="%" />
            </DvBorderBox>
            <div style={{ display: "flex", gap: 16, height: 150 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <DvDecoration3 period={5} />
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <DvDecoration5 />
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <DvDecoration6 />
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <DvDecoration7 />
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <DvDecoration8 />
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <DvDecoration9 />
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <DvDecoration10 />
              </div>
            </div>
          </div>
        </main>

        <section style={{ display: "flex", gap: 16, margin: "24px 40px 0", height: 110 }}>
          {(["box7", "box8", "box9", "box10", "box11", "box12", "box13"] as const).map((v) => (
            <DvBorderBox key={v} variant={v} style={{ flex: 1 }}>
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5b87a8",
                  fontSize: 14,
                }}
              >
                {v}
              </div>
            </DvBorderBox>
          ))}
        </section>

        <footer style={{ marginTop: 24, padding: "0 40px" }}>
          <DvMarqueeText items={feed} speed={70} />
        </footer>
      </div>
    </DvFullScreenContainer>
  );
}

