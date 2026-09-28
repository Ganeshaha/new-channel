import React from "react";
import { AbsoluteFill } from "remotion";
import { ACCENT, audit, BLOCK, GOLD, holdOut, INK, pop, ramp, readSecs, SEE_SECS, useT } from "../kit";

// Episode 003's own props: the cabbage (the deck's Food tokens, drawn in code), piles of them,
// a cabbage counter, price tags, mana pips and a few table props (dice, chips, a wall, ice counters).

export const smooth = (x: number) => x * x * (3 - 2 * x);
/** Stable pseudo-random 0-1 per index (no Math.random: every frame must render the same). */
export const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** (time, value) keyframes, linear in between. */
export type Keys = [number, number][];
export const keyVal = (keys: Keys, t: number) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t0, v0] = keys[i - 1];
    const [t1, v1] = keys[i];
    if (t <= t1) return v0 + (v1 - v0) * ((t - t0) / Math.max(1e-6, t1 - t0));
  }
  return keys[keys.length - 1][1];
};
/** When the running count first reaches n (for staggering each cabbage's pop-in). */
const reachAt = (keys: Keys, n: number) => {
  if (keys[0][1] >= n) return keys[0][0] + (n - 1) * 0.03;
  for (let i = 1; i < keys.length; i++) {
    const [t0, v0] = keys[i - 1];
    const [t1, v1] = keys[i];
    if (v1 >= n && v1 > v0) return t0 + ((n - v0) / (v1 - v0)) * (t1 - t0);
  }
  return Infinity;
};

/** A cartoon cabbage: outer leaves, a pale heart and a couple of veins, in the channel's ink outline. */
export const CabbageSvg: React.FC<{ size: number; dark?: boolean }> = ({ size, dark = false }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ display: "block", overflow: "visible" }}>
    <path
      d="M-44 6 C-50 -20 -30 -44 -4 -44 C24 -46 48 -24 44 6 C42 30 22 44 0 44 C-24 44 -42 30 -44 6 Z"
      fill={dark ? "#5b9a3a" : "#78b84e"}
      stroke={INK}
      strokeWidth={4}
    />
    <path d="M-40 4 C-38 -14 -26 -26 -12 -30 C-24 -12 -26 8 -18 30 C-30 24 -38 16 -40 4 Z" fill="#9fd06d" stroke={INK} strokeWidth={3} />
    <path d="M40 4 C38 -14 26 -26 12 -30 C24 -12 26 8 18 30 C30 24 38 16 40 4 Z" fill="#9fd06d" stroke={INK} strokeWidth={3} />
    <ellipse cx={0} cy={-2} rx={17} ry={24} fill="#c6e79a" stroke={INK} strokeWidth={3} />
    <path d="M0 -20 L0 18 M0 -4 L-9 -14 M0 6 L9 -4" stroke="#6aa345" strokeWidth={3} fill="none" strokeLinecap="round" />
  </svg>
);

/** One cabbage on its own, centred on (x, y). */
export const Cabbage: React.FC<{ x: number; y: number; size: number; at: number; out?: number; rot?: number; tapAt?: number }> = ({
  x,
  y,
  size,
  at,
  out,
  rot = 0,
  tapAt,
}) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 9);
  if (p <= 0.001) return null;
  const tap = tapAt === undefined ? 0 : 90 * smooth(ramp(t, tapAt, tapAt + 0.3));
  return (
    <div
      {...audit("fig", "cabbage", at, p)}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        transform: `rotate(${rot + tap}deg) scale(${p})`,
        filter: "drop-shadow(6px 8px 0 rgba(0,0,0,0.16))",
      }}
    >
      <CabbageSvg size={size} dark={tap > 45} />
    </div>
  );
};

/**
 * A heap of cabbages growing from the bottom-centre (x, y). `keys` sets how many are showing over time
 * (they drop in one by one). Options: tap the first `tapN` at `tapAt` (turned sideways), stamp a
 * badge ("7/7") on each from `badgeAt`, or send them all flying at `scatterAt`.
 */
export const CabbagePile: React.FC<{
  x: number;
  y: number;
  keys: Keys;
  cols: number;
  size: number;
  out?: number;
  tapAt?: number;
  tapN?: number;
  badge?: string;
  badgeAt?: number;
  scatterAt?: number;
}> = ({ x, y, keys, cols, size, out, tapAt, tapN = 0, badge, badgeAt, scatterAt }) => {
  const { t, fps } = useT();
  const at = keys[0][0];
  out = holdOut(at, out, SEE_SECS);
  const shown = Math.floor(keyVal(keys, t) + 1e-6);
  const vis = pop(t, fps, at, out, 12);
  if (vis <= 0.001 || shown <= 0) return null;
  const dx = size * 0.78;
  const dy = size * 0.62;
  const rows = Math.ceil(shown / cols);
  const W = (cols + 0.5) * dx + size * 0.3;
  const H = (rows - 1) * dy + size * 1.08;
  const gone = scatterAt === undefined ? 0 : ramp(t, scatterAt, scatterAt + 0.3);
  const items = [];
  for (let i = 0; i < shown; i++) {
    const r = Math.floor(i / cols);
    const k = i % cols;
    // fill each row from the middle outwards, so a half-filled row stays centred
    const c = (cols - 1) / 2 + (k % 2 ? -(k + 1) / 2 : k / 2);
    const px = W / 2 + (c - (cols - 1) / 2 + (r % 2 ? 0.25 : -0.25)) * dx + (hash(i) - 0.5) * size * 0.12 - size / 2;
    const py = H - size - r * dy - hash(i + 99) * size * 0.06;
    const ti = reachAt(keys, i + 1);
    const p = Math.min(1, pop(t, fps, ti, undefined, 10));
    const tapStart = tapAt === undefined ? Infinity : tapAt + (i % 12) * 0.04;
    const tap = i < tapN ? 90 * smooth(ramp(t, tapStart, tapStart + 0.28)) : 0;
    let sx = 0,
      sy = 0,
      srot = 0,
      op = 1;
    if (scatterAt !== undefined && t > scatterAt) {
      const d = t - scatterAt;
      sx = (hash(i + 7) - 0.5) * 1700 * d;
      sy = -520 * d * (0.4 + hash(i + 3)) + 2300 * d * d;
      srot = (hash(i + 11) - 0.5) * 1400 * d;
      op = 1 - ramp(d, 0.5, 0.9);
    }
    const b = badge && badgeAt !== undefined ? pop(t, fps, badgeAt + (i % 10) * 0.05, undefined, 10) : 0;
    items.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: px + sx,
          top: py + sy - (1 - p) * 90,
          width: size,
          height: size,
          opacity: op * Math.min(1, p * 2),
          transform: `rotate(${(hash(i + 5) - 0.5) * 24 + tap + srot}deg)`,
        }}
      >
        <CabbageSvg size={size} dark={tap > 45} />
        {b > 0.01 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${-tap}deg) scale(${b})`,
              fontFamily: BLOCK,
              fontSize: size * 0.34,
              color: GOLD,
              WebkitTextStroke: `${Math.max(3, size * 0.05)}px ${INK}`,
              paintOrder: "stroke fill",
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </div>
        )}
      </div>,
    );
  }
  return (
    <div
      {...audit("fig", "cabbages", at, vis * (1 - gone))}
      style={{
        position: "absolute",
        left: x - W / 2,
        top: y - H,
        width: W,
        height: H,
        opacity: vis,
        filter: "drop-shadow(6px 8px 0 rgba(0,0,0,0.14))",
      }}
    >
      {items}
    </div>
  );
};

/** A white tag with a cabbage and a rolling count: "(cabbage) x 41". */
export const Counter: React.FC<{ x: number; y: number; keys: Keys; out?: number; size?: number; rot?: number }> = ({
  x,
  y,
  keys,
  out,
  size = 64,
  rot = -3,
}) => {
  const { t, fps } = useT();
  const at = keys[0][0];
  out = holdOut(at, out, readSecs("x 00"));
  const p = pop(t, fps, at, out, 9);
  if (p <= 0.001) return null;
  const n = Math.round(keyVal(keys, t));
  return (
    <div
      {...audit("sticker", `x ${n}`, at, p)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${p})`,
        display: "flex",
        alignItems: "center",
        gap: size * 0.25,
        background: "#fff",
        border: `5px solid ${INK}`,
        borderRadius: 14,
        padding: `${size * 0.12}px ${size * 0.4}px ${size * 0.12}px ${size * 0.25}px`,
        boxShadow: "8px 9px 0 rgba(0,0,0,0.18)",
        fontFamily: BLOCK,
        fontSize: size,
        color: INK,
        whiteSpace: "nowrap",
      }}
    >
      <CabbageSvg size={size * 1.15} />
      <span>× {n}</span>
    </div>
  );
};

/** A red price tag with a string hole. */
export const PriceTag: React.FC<{ text: string; x: number; y: number; at: number; out?: number; size?: number; rot?: number; stamp?: boolean }> = ({
  text,
  x,
  y,
  at,
  out,
  size = 110,
  rot = -8,
  stamp = false,
}) => {
  const { t, fps } = useT();
  out = holdOut(at, out, readSecs(text));
  const p = pop(t, fps, at, out, 8);
  if (p <= 0.001) return null;
  return (
    <div
      {...audit("sticker", text, at, p, stamp)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${p})`,
        background: ACCENT,
        color: "#fff",
        fontFamily: BLOCK,
        fontSize: size,
        lineHeight: 1,
        padding: `${size * 0.16}px ${size * 0.34}px ${size * 0.16}px ${size * 0.62}px`,
        border: `5px solid ${INK}`,
        borderRadius: size * 0.16,
        boxShadow: "9px 10px 0 rgba(0,0,0,0.2)",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: size * 0.2,
          top: "50%",
          width: size * 0.2,
          height: size * 0.2,
          marginTop: -size * 0.1,
          borderRadius: "50%",
          background: "#fff",
          border: `4px solid ${INK}`,
        }}
      />
      {text}
    </div>
  );
};

/** A mana pip: a coin with a symbol ("G", "1", "?"). */
export const Pip: React.FC<{ x: number; y: number; at: number; out?: number; sym: string; size?: number; color?: string; dx?: number; dy?: number; moveAt?: number }> = ({
  x,
  y,
  at,
  out,
  sym,
  size = 100,
  color = "#b9d9a0",
  dx = 0,
  dy = 0,
  moveAt,
}) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 9);
  if (p <= 0.001) return null;
  const m = moveAt === undefined ? 0 : 1 - Math.pow(1 - ramp(t, moveAt, moveAt + 0.6), 3);
  return (
    <div
      {...audit("fig", "pip " + sym, at, p)}
      style={{
        position: "absolute",
        left: x + dx * m - size / 2,
        top: y + dy * m - size / 2 - Math.sin(Math.PI * m) * 80,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        border: `5px solid ${INK}`,
        boxShadow: "6px 7px 0 rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: BLOCK,
        fontSize: size * 0.46,
        color: INK,
        transform: `scale(${p})`,
        boxSizing: "border-box",
      }}
    >
      {sym}
    </div>
  );
};

/** A six-sided die (stand-in token) with `n` pips. */
export const Die: React.FC<{ x: number; y: number; at: number; out?: number; n: number; size?: number; rot?: number }> = ({ x, y, at, out, n, size = 90, rot = 0 }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 9);
  if (p <= 0.001) return null;
  const spots: Record<number, [number, number][]> = {
    1: [[0.5, 0.5]],
    2: [[0.27, 0.27], [0.73, 0.73]],
    3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
    4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]],
    5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
    6: [[0.28, 0.22], [0.72, 0.22], [0.28, 0.5], [0.72, 0.5], [0.28, 0.78], [0.72, 0.78]],
  };
  return (
    <div
      {...audit("fig", "die", at, p)}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        background: "#fffdf7",
        border: `5px solid ${INK}`,
        borderRadius: size * 0.18,
        boxShadow: "6px 7px 0 rgba(0,0,0,0.18)",
        transform: `rotate(${rot + (1 - p) * 180}deg) scale(${p})`,
        boxSizing: "border-box",
      }}
    >
      {spots[n].map(([u, v], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${u * 100}%`,
            top: `${v * 100}%`,
            width: size * 0.16,
            height: size * 0.16,
            margin: -size * 0.08,
            borderRadius: "50%",
            background: INK,
          }}
        />
      ))}
    </div>
  );
};

/** A poker chip (another stand-in token). */
export const Chip: React.FC<{ x: number; y: number; at: number; out?: number; color: string; size?: number }> = ({ x, y, at, out, color, size = 90 }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 9);
  if (p <= 0.001) return null;
  return (
    <div
      {...audit("fig", "chip", at, p)}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        border: `5px solid ${INK}`,
        boxShadow: "6px 7px 0 rgba(0,0,0,0.18)",
        transform: `scale(${p})`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "62%", height: "62%", borderRadius: "50%", border: `5px dashed #fff`, boxSizing: "border-box" }} />
    </div>
  );
};

/** A plain brick wall for someone to go and stare at. */
export const Wall: React.FC<{ x: number; y: number; w: number; h: number; at: number; out?: number }> = ({ x, y, w, h, at, out }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 12);
  if (p <= 0.001) return null;
  return (
    <div
      {...audit("fig", "wall", at, p)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: p,
        border: `5px solid ${INK}`,
        borderRadius: 6,
        background:
          "repeating-linear-gradient(0deg, #b9533f 0 34px, #e8dccb 34px 40px), #b9533f",
        boxShadow: "8px 9px 0 rgba(0,0,0,0.16)",
      }}
    />
  );
};

/** Dark Depths' ice counters: a block of hexes that melt one by one between meltA and meltB. */
export const IceCounters: React.FC<{ x: number; y: number; at: number; out?: number; n?: number; meltA: number; meltB: number; size?: number }> = ({
  x,
  y,
  at,
  out,
  n = 10,
  meltA,
  meltB,
  size = 72,
}) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 11);
  if (p <= 0.001) return null;
  const cols = 5;
  const W = cols * size * 1.05;
  const H = Math.ceil(n / cols) * size * 1.0;
  return (
    <div {...audit("fig", "ice counters", at, p)} style={{ position: "absolute", left: x - W / 2, top: y - H / 2, width: W, height: H, transform: `scale(${p})` }}>
      {Array.from({ length: n }, (_, i) => {
        const m = ramp(t, meltA + ((meltB - meltA) * (n - 1 - i)) / n, meltA + ((meltB - meltA) * (n - i)) / n);
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="-50 -50 100 100"
            style={{
              position: "absolute",
              left: (i % cols) * size * 1.05,
              top: Math.floor(i / cols) * size,
              transform: `scale(${1 - 0.8 * m}, ${1 - m})`,
              transformOrigin: "50% 90%",
              opacity: 1 - m,
            }}
          >
            <polygon points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22" fill="#bfe3f5" stroke={INK} strokeWidth={5} />
            <path d="M-16 -18 L10 -26" stroke="#fff" strokeWidth={6} strokeLinecap="round" />
          </svg>
        );
      })}
    </div>
  );
};

/** A row of turn chips "T1 ... T5"; the current one (by time) is filled. */
export const TurnTrack: React.FC<{ x: number; y: number; at: number; out?: number; marks: [number, number][] }> = ({ x, y, at, out, marks }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, readSecs("T1 T2 T3 T4 T5"));
  const p = pop(t, fps, at, out, 10);
  if (p <= 0.001) return null;
  let cur = 0;
  for (const [when, turn] of marks) if (t >= when) cur = turn;
  return (
    <div
      {...audit("label", "T1 T2 T3 T4 T5", at, p)}
      style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`, display: "flex", gap: 18 }}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n === cur;
        return (
          <div
            key={n}
            style={{
              fontFamily: BLOCK,
              fontSize: 44,
              padding: "6px 20px",
              borderRadius: 12,
              border: `5px solid ${INK}`,
              background: on ? GOLD : "#fffdf7",
              color: INK,
              transform: `scale(${on ? 1.12 : 1})`,
              boxShadow: "5px 6px 0 rgba(0,0,0,0.16)",
            }}
          >
            T{n}
          </div>
        );
      })}
    </div>
  );
};

/** Wraps its children and turns them sideways (tapped) between tapAt and untapAt, around (x, y). */
export const Tapped: React.FC<{ x: number; y: number; tapAt?: number; untapAt?: number; children: React.ReactNode }> = ({ x, y, tapAt, untapAt, children }) => {
  const { t } = useT();
  const on = tapAt === undefined ? 1 : smooth(ramp(t, tapAt, tapAt + 0.3));
  const off = untapAt === undefined ? 0 : smooth(ramp(t, untapAt, untapAt + 0.3));
  return (
    <AbsoluteFill style={{ transform: `rotate(${90 * on * (1 - off)}deg)`, transformOrigin: `${x}px ${y}px` }}>{children}</AbsoluteFill>
  );
};

/** Camera flashes: the whole frame blinks white at each time. */
export const Flash: React.FC<{ times: number[] }> = ({ times }) => {
  const { t } = useT();
  const a = Math.max(0, ...times.map((w) => (t >= w && t < w + 0.35 ? 1 - (t - w) / 0.35 : 0)));
  if (a <= 0) return null;
  return <AbsoluteFill style={{ background: "#fff", opacity: 0.55 * a }} />;
};

/** A spiky starburst behind a big stamp ("I STILL WON"), turning slowly. */
export const Burst: React.FC<{ x: number; y: number; r: number; at: number; out?: number; color?: string }> = ({ x, y, r, at, out, color = GOLD }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 8);
  if (p <= 0.001) return null;
  const n = 14;
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = (Math.PI * i) / n;
    const rr = i % 2 ? r * 0.62 : r;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(" ");
  return (
    <svg
      {...audit("fig", "burst", at, p)}
      width={r * 2}
      height={r * 2}
      viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`}
      style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible", transform: `rotate(${(1 - p) * -40}deg) scale(${p})` }}
    >
      <polygon points={pts} fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    </svg>
  );
};

const CardBack: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 1.396, borderRadius: w * 0.05, background: "#6e1f1a", padding: w * 0.045, boxSizing: "border-box" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: w * 0.03, background: "#b23a2f", border: `${Math.max(2, w * 0.008)}px solid #f6e3cf`, boxSizing: "border-box" }} />
  </div>
);

/** A fanned hand of face-down cards; the last `drop` of them fly off at dropAt (a mulligan). */
export const BackFan: React.FC<{ x: number; y: number; n: number; w: number; at: number; out?: number; drop?: number; dropAt?: number }> = ({ x, y, n, w, at, out, drop = 0, dropAt }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 11);
  if (p <= 0.001) return null;
  const h = w * 1.396;
  const span = (n - 1) * w * 0.55 + w;
  return (
    <div {...audit("card", "hand of card backs", at, p)} style={{ position: "absolute", left: x - span / 2, top: y - h / 2, width: span, height: h }}>
      {Array.from({ length: n }, (_, i) => {
        const k = i - (n - drop);
        const gone = k >= 0 && dropAt !== undefined ? ramp(t, dropAt + k * 0.15, dropAt + k * 0.15 + 0.5) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * w * 0.55,
              top: -gone * 700,
              transform: `rotate(${(i - (n - 1) / 2) * 7 + gone * 200}deg) scale(${p})`,
              transformOrigin: "50% 120%",
              opacity: 1 - gone,
              filter: "drop-shadow(6px 8px 0 rgba(0,0,0,0.16))",
            }}
          >
            <CardBack w={w} />
          </div>
        );
      })}
    </div>
  );
};
