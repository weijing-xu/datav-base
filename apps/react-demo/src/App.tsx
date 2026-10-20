import { DvBorderBox, DvDecoration1, DvDigitalFlop, DvFullScreenContainer, DvScrollBoard } from "@dv/react";
import { useEffect, useMemo, useState } from "react";

const card: React.CSSProperties = {
  background: "rgba(9,32,63,0.6)",
  border: "1px solid rgba(0,246,255,0.45)",
  padding: "24px 40px",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

export function App() {
  const [pv, setPv] = useState(1280435);
  const [uv, setUv] = useState(86321);

  useEffect(() => {
    const id = setInterval(() => {
      setPv((v) => v + Math.round(Math.random() * 5000));
      setUv((v) => v + Math.round(Math.random() * 300));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const rows = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => [
        `节点-${String(i + 1).padStart(2, "0")}`,
        `${(Math.random() * 100).toFixed(1)}%`,
        Math.random() > 0.3 ? "正常" : "告警",
        new Date(Date.now() - i * 60000).toLocaleTimeString(),
      ]),
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
          <h1 style={{ position: "relative", margin: 0, fontSize: 40, letterSpacing: 12 }}>
            数据大屏基座 · React
          </h1>
        </header>

        <main style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 60 }}>
          <div style={card}>
            <span style={{ color: "#5b87a8", fontSize: 18 }}>累计访问量</span>
            <DvDigitalFlop value={pv} style={{ fontSize: 56 }} />
          </div>
          <div style={card}>
            <span style={{ color: "#5b87a8", fontSize: 18 }}>在线人数</span>
            <DvDigitalFlop value={uv} separator="," style={{ fontSize: 56, color: "#48ffe0" }} />
          </div>
        </main>

        <section style={{ width: 720, height: 360, margin: "60px auto 0" }}>
          <DvBorderBox variant="box1">
            <DvScrollBoard
              header={["节点", "负载", "状态", "更新时间"]}
              rows={rows}
              rowHeight={40}
              speed={24}
            />
          </DvBorderBox>
        </section>
      </div>
    </DvFullScreenContainer>
  );
}
