import { interpolate, spring } from "remotion";

// Shared timing helpers for mascot animations.
export const I = (f: number, input: number[], output: number[], easing?: (t: number) => number) =>
  interpolate(f, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
export const S = (f: number, fps: number, delay = 0, config: Record<string, number> = { damping: 12 }) =>
  spring({ frame: f - delay, fps, config });
/** 0 → 1 → 0 sine bump over [start, start + len] */
export const hump = (f: number, start: number, len: number) =>
  f >= start && f <= start + len ? Math.sin((Math.PI * (f - start)) / len) : 0;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
