import type { EffectHandle } from "@dv/core";
import { useEffect, useRef, type RefObject } from "react";

/**
 * Mounts a @dv/core canvas effect onto a canvas element and disposes it
 * when deps change or the component unmounts. Every canvas-based Dv*
 * component is a thin wrapper over this.
 */
export function useCanvasEffect<T extends EffectHandle>(
  create: (el: HTMLCanvasElement) => T,
  deps: readonly unknown[],
): { canvasRef: RefObject<HTMLCanvasElement | null>; handleRef: RefObject<T | null> } {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<T | null>(null);
  const createRef = useRef(create);
  createRef.current = create;

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handle = createRef.current(el);
    handleRef.current = handle;
    return () => {
      handleRef.current = null;
      handle.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are the caller's re-create signal
  }, deps);

  return { canvasRef, handleRef };
}
