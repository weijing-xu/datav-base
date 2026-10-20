/** A running effect instance: every engine returns this shape so React/Vue wrappers can clean up uniformly. */
export interface EffectHandle {
  start: () => void;
  stop: () => void;
  resize: () => void;
  destroy: () => void;
}
