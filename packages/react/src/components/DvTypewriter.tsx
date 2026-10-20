import { createTypewriter } from "@dv/core";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export interface DvTypewriterProps {
  text: string;
  /** Characters per second. Default 20. */
  speed?: number;
  /** Restart typing after finishing. Default false. */
  loop?: boolean;
  /** Show a blinking block cursor. Default true. */
  cursor?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Character-by-character typing text driven by core's typewriter engine. */
export function DvTypewriter({ text, speed, loop, cursor = true, className, style }: DvTypewriterProps) {
  const [shown, setShown] = useState("");
  const handleRef = useRef<ReturnType<typeof createTypewriter> | null>(null);

  useEffect(() => {
    handleRef.current = createTypewriter({
      text,
      speed,
      loop,
      onUpdate: setShown,
    });
    return () => handleRef.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- text changes restart via setText below
  }, [speed, loop]);

  useEffect(() => {
    handleRef.current?.setText(text);
  }, [text]);

  return (
    <span className={["dv-typewriter", className].filter(Boolean).join(" ")} style={style}>
      <span>{shown}</span>
      {cursor && <i className="dv-typewriter-cursor" />}
    </span>
  );
}
