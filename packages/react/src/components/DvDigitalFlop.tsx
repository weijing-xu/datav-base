import { createNumberTicker, type NumberTicker } from "@dv/core";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export interface DvDigitalFlopProps {
  /** Target value; re-animates when it changes. */
  value: number;
  duration?: number;
  decimals?: number;
  separator?: string;
  className?: string;
  style?: CSSProperties;
}

/** Count-up number display powered by @dv/core's ticker. */
export function DvDigitalFlop({
  value,
  duration = 2000,
  decimals = 0,
  separator = ",",
  className,
  style,
}: DvDigitalFlopProps) {
  const [display, setDisplay] = useState(() => value.toFixed(decimals));
  const tickerRef = useRef<NumberTicker | null>(null);

  useEffect(() => {
    const ticker = createNumberTicker({
      to: value,
      duration,
      decimals,
      separator,
      onUpdate: (formatted) => setDisplay(formatted),
    });
    tickerRef.current = ticker;
    return () => {
      ticker.destroy();
      tickerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ticker recreated only when formatting params change
  }, [duration, decimals, separator]);

  useEffect(() => {
    tickerRef.current?.setValue(value);
  }, [value]);

  return (
    <span className={["dv-digital-flop", className].filter(Boolean).join(" ")} style={style}>
      {display}
    </span>
  );
}
