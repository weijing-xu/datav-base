import {
  DvAlert,
  DvBorderBox,
  DvCapsuleChart,
  DvChart,
  DvDecoration1,
  DvDecoration2,
  DvDecoration3,
  DvDecoration5,
  DvDecoration6,
  DvDecoration7,
  DvDigitalFlop,
  DvFlipClock,
  DvFlylineMap,
  DvFullScreenContainer,
  DvLoading,
  DvMarqueeText,
  DvPercentRing,
  DvScrollBoard,
  DvScrollRanking,
  DvTypewriter,
  DvWaterLevelPond,
} from "@dv/react";
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

export function App() {
  const [pv, setPv] = useState(1280435);
  const [uv, setUv] = useState(86321);
  const [water, setWater] = useState(62);

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
              <div style={{ ...card, flex: 1, padding: "16px 20px" }}>
                <span style={{ color: "#5b87a8", fontSize: 16 }}>累计访问量</span>
                <DvDigitalFlop value={pv} style={{ fontSize: 40 }} />
              </div>
              <div style={{ ...card, flex: 1, padding: "16px 20px" }}>
                <span style={{ color: "#5b87a8", fontSize: 16 }}>在线人数</span>
                <DvDigitalFlop value={uv} style={{ fontSize: 40, color: "#48ffe0" }} />
              </div>
            </div>
            <div style={{ ...card, padding: "12px 20px" }}>
              <span style={{ color: "#5b87a8", fontSize: 16 }}>系统时间 · 倒计时</span>
              <DvFlipClock to={deadline} />
            </div>
            <DvAlert level="warn">3 个节点负载超过阈值，请关注华东区扩容</DvAlert>
            <DvBorderBox variant="box4" style={{ height: 320 }}>
              <h3 style={panelTitle}>节点监控</h3>
              <DvScrollBoard
                header={["节点", "负载", "状态", "更新时间"]}
                rows={boardRows}
                rowHeight={34}
                speed={20}
              />
            </DvBorderBox>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <DvBorderBox variant="box3" style={{ height: 420 }}>
              <h3 style={panelTitle}>数据迁徙</h3>
              <DvFlylineMap points={CITY_POINTS} lines={FLY_LINES} labels speed={0.3} />
            </DvBorderBox>
            <div style={{ display: "flex", gap: 24, height: 200 }}>
              <DvBorderBox variant="box2" style={{ flex: 1 }}>
                <h3 style={panelTitle}>实时水位</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: "calc(100% - 50px)" }}>
                  <DvWaterLevelPond value={water} size={110} />
                  <DvPercentRing value={water} size={110} />
                  <DvLoading text="同步中" size={70} />
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
            </div>
          </div>
        </main>

        <footer style={{ marginTop: 24, padding: "0 40px" }}>
          <DvMarqueeText items={feed} speed={70} />
        </footer>
      </div>
    </DvFullScreenContainer>
  );
}
