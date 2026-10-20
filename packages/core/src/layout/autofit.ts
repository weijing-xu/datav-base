import { onResize } from "./resize";

export interface AutoFitOptions {
  /** Design draft width, px. */
  width?: number;
  /** Design draft height, px. */
  height?: number;
  /**
   * "width": scale by parent width only, vertically centered (autofit.js style, allows tall overflow).
   * "contain": uniform scale so the whole design draft fits (letterboxing).
   */
  mode?: "width" | "contain";
}

export interface AutoFitInstance {
  /** Recompute scale now (e.g. after toggling side panels). */
  update: () => void;
  destroy: () => void;
}

/**
 * Scales `el` (positioned absolute at left:50%/top:50%) so the design draft
 * fills its parent. The framework layer only has to mount it and call destroy().
 */
export function createAutoFit(el: HTMLElement, options: AutoFitOptions = {}): AutoFitInstance {
  const { width = 1920, height = 1080, mode = "width" } = options;
  const parent = el.parentElement;
  if (!parent) {
    throw new Error("[dv] createAutoFit: element must be attached to a parent container");
  }

  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.position = "absolute";
  el.style.left = "50%";
  el.style.top = "50%";

  const update = () => {
    const rect = parent.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const scale =
      mode === "contain"
        ? Math.min(rect.width / width, rect.height / height)
        : rect.width / width;
    el.style.transform = `scale(${scale}) translate(-50%, -50%)`;
    el.style.transformOrigin = "0 0";
  };

  const offParent = onResize(parent, update);
  const offWindow = onWindowResize(update);
  update();

  return {
    update,
    destroy() {
      offParent();
      offWindow();
      el.style.transform = "";
    },
  };
}

function onWindowResize(cb: () => void): () => void {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
