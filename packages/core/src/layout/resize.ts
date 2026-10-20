/**
 * Observes an element's box size. Falls back to window resize when
 * ResizeObserver is unavailable. Returns an unsubscribe function.
 */
export function onResize(el: Element, cb: () => void): () => void {
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => cb());
    ro.observe(el);
    return () => ro.disconnect();
  }
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
