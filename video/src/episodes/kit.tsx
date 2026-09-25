import React from "react";
import {
  Img,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LIBRARY } from "../mascot/library";
import {
  ACCENT,
  Back,
  GOLD,
  INK,
  MascotRig,
  PAPER,
  RigProps,
} from "../mascot/Rig";

// Reusable building blocks for Wild Card Commander episodes (white-stage style).
// Everything is timed in SECONDS from the start of the video, driven by a timing.json.

export type Word = { w: string; s: number; e: number };
export type Section = {
  id: string;
  title: string;
  start: number;
  end: number;
  words: Word[];
};
export type Timing = {
  source: string;
  fps: number;
  narrationEnd: number;
  sections: Section[];
};

export const HAND = '"Segoe Print", "Comic Sans MS", cursive';
export const BLOCK = '"Arial Black", Arial, sans-serif';
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

/** Seconds at which `phrase` is spoken inside a section (first token of the nth match). */
export const cue = (
  timing: Timing,
  section: string,
  phrase: string,
  nth = 0,
): number => {
  const sec = timing.sections.find((s) => s.id === section);
  if (!sec) throw new Error(`no section ${section}`);
  const target = phrase.split(/\s+/).map(norm).filter(Boolean);
  const toks = sec.words.map((w) => norm(w.w));
  let seen = 0;
  for (let i = 0; i + target.length <= toks.length; i++) {
    if (target.every((t, j) => toks[i + j] === t)) {
      if (seen === nth) return sec.words[i].s;
      seen++;
    }
  }
  throw new Error(`cue "${phrase}" not found in ${section}`);
};

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { t: frame / fps, fps, frame };
};

/** 0→1 spring starting at `at` seconds, and 1→0 fade over 0.25s ending at `out` (if given). */
export const pop = (
  t: number,
  fps: number,
  at: number,
  out?: number,
  damping = 12,
) => {
  if (t < at) return 0;
  const inn = spring({ frame: (t - at) * fps, fps, config: { damping } });
  const fade =
    out === undefined ? 1 : Math.max(0, Math.min(1, (out - t) / 0.25));
  return inn * fade;
};
export const within = (t: number, a: number, b: number) => t >= a && t <= b;

// ---------------------------------------------------------------- readability + audit

/**
 * Seconds a piece of on-screen text must be fully visible to register, at a subtitle-style reading
 * rate: 15 characters/second (BBC ≈15 cps; Netflix allows 17–20) plus 0.5 s to notice it, never under
 * 1.5 s, capped at 5 s (long callouts are read aloud by the narration anyway).
 */
export const readSecs = (text: string) =>
  Math.min(5, Math.max(1.5, text.replace(/\[\[|\]\]/g, "").length / 15 + 0.5));
/** Minimum time a non-text visual (card, character, arrow) stays fully visible. */
export const SEE_SECS = 1.2;
/** Time the pop-in spring takes before an element counts as fully visible. */
const SETTLE = 0.5;
/**
 * Push `out` later if it would cut an element off before it can be read. Every kit component applies this,
 * so no element can flash by; anything it pushes into another element's space shows up in the layout audit.
 */
export const holdOut = (at: number, out: number | undefined, secs: number) =>
  out === undefined ? undefined : Math.max(out, at + SETTLE + secs);

/**
 * data-* tags read by the layout audit (AuditProbe + scripts/qa_layout.py): what the element is,
 * its label, when it appears, how far it has popped in, and whether it is meant to sit on top of
 * something (a stamp). Spread onto the element's root.
 */
export const audit = (kind: string, label: string, at: number, p: number, stamp = false) => ({
  "data-audit": kind,
  "data-label": label.slice(0, 80),
  "data-at": at.toFixed(2),
  "data-p": p.toFixed(2),
  ...(stamp ? { "data-stamp": "1" } : {}),
});

/**
 * Layout audit probe. Render it inside a composition that also renders a `<div {...audit("root", "stage", 0, 1)} style={{position:"absolute",inset:0}}/>` stage marker (the origin), with the `audit` prop on, and every `every`th
 * frame it logs each tagged element's on-screen box, own rotation and pop progress as one line:
 *   AUDIT <frame> [[kind, label, at, p, left, top, width, height, layoutW, layoutH, rotDeg, stamp], ...]
 * scripts/qa_layout.py turns those lines into overlap, clipping and minimum-time reports.
 */
export const AuditProbe: React.FC<{ every?: number }> = ({ every = 3 }) => {
  const frame = useCurrentFrame();
  React.useLayoutEffect(() => {
    if (frame % every !== 0) return;
    const rows: (string | number)[][] = [];
    // Remotion renders the stage off-page; the stage marker's top-left corner is the origin.
    const origin = document.querySelector<HTMLElement>('[data-audit="root"]')?.getBoundingClientRect();
    const ox = origin?.left ?? 0;
    const oy = origin?.top ?? 0;
    document.querySelectorAll<HTMLElement>("[data-audit]").forEach((el) => {
      if (el.dataset.audit === "root") return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const m = getComputedStyle(el).transform;
      let rot = 0;
      const mm = m && m !== "none" ? m.match(/matrix\(([^)]+)\)/) : null;
      if (mm) {
        const [a, b] = mm[1].split(",").map(Number);
        rot = (Math.atan2(b, a) * 180) / Math.PI;
      }
      const lw = (el as HTMLElement).offsetWidth ?? 0;
      const lh = (el as HTMLElement).offsetHeight ?? 0;
      rows.push([
        el.dataset.audit ?? "",
        el.dataset.label ?? "",
        Number(el.dataset.at ?? 0),
        Number(el.dataset.p ?? 1),
        Math.round(r.left - ox),
        Math.round(r.top - oy),
        Math.round(r.width),
        Math.round(r.height),
        lw || 0,
        lh || 0,
        Math.round(rot * 10) / 10,
        el.dataset.stamp ? 1 : 0,
      ]);
    });
    // eslint-disable-next-line no-console
    console.log("AUDIT " + frame + " " + JSON.stringify(rows));
  }, [frame, every]);
  return null;
};
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const ramp = (t: number, a: number, b: number) =>
  clamp((t - a) / (b - a));

// ---------------------------------------------------------------- cards

const CARD_W = 745;
const CARD_H = 1040;

export const CardBackFace: React.FC<{ w: number }> = ({ w }) => (
  <div
    style={{
      width: w,
      height: (w * CARD_H) / CARD_W,
      borderRadius: w * 0.05,
      background: "#6e1f1a",
      padding: w * 0.045,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: w * 0.03,
        background: "#b23a2f",
        border: `${Math.max(2, w * 0.008)}px solid #f6e3cf`,
        boxSizing: "border-box",
      }}
    />
  </div>
);

export const CardImg: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  at: number;
  out?: number;
  rot?: number;
  from?: "left" | "right" | "top" | "bottom" | "pop";
  flipAt?: number;
  lift?: number;
  /** slide to (toX, toY) starting at moveAt seconds */
  toX?: number;
  toY?: number;
  moveAt?: number;
}> = ({
  src,
  x,
  y,
  w,
  at,
  out,
  rot = 0,
  from = "pop",
  flipAt,
  lift = 0,
  toX,
  toY,
  moveAt,
}) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 13);
  if (p <= 0.001) return null;
  const off = (1 - p) * 1400;
  const dx = from === "left" ? -off : from === "right" ? off : 0;
  const dy = from === "top" ? -off : from === "bottom" ? off : 0;
  const sc = from === "pop" ? 0.4 + 0.6 * p : 1;
  const flip =
    flipAt === undefined
      ? 1
      : Math.cos(Math.PI * (1 - ramp(t, flipAt, flipAt + 0.45)));
  const showFront = flipAt === undefined || t >= flipAt + 0.225;
  const h = (w * CARD_H) / CARD_W;
  const m =
    moveAt === undefined
      ? 0
      : 1 - Math.pow(1 - ramp(t, moveAt, moveAt + 0.6), 3);
  const cx = x + ((toX ?? x) - x) * m;
  const cy = y + ((toY ?? y) - y) * m;
  return (
    <div
      {...audit("card", src.split("/").pop() ?? src, at, p * Math.abs(flip))}
      style={{
        position: "absolute",
        left: cx - w / 2 + dx,
        top: cy - h / 2 + dy - lift,
        width: w,
        height: h,
        transform: `rotate(${rot}deg) scale(${sc * Math.abs(flip)}, ${sc})`,
        opacity: out !== undefined ? p : 1,
        filter: "drop-shadow(10px 14px 0 rgba(0,0,0,0.18))",
      }}
    >
      {showFront ? (
        <Img
          src={staticFile(src)}
          style={{ width: w, height: h, borderRadius: w * 0.045 }}
        />
      ) : (
        <CardBackFace w={w} />
      )}
    </div>
  );
};

/**
 * Card art in a taped paper frame, centred on (x, y), with a slow push-in so it never sits still.
 * Use it to give long explanations something new to look at.
 */
export const ArtPanel: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  at: number;
  out?: number;
  rot?: number;
  caption?: string;
}> = ({ src, x, y, w, at, out, rot = -3, caption }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 11);
  if (p <= 0.001) return null;
  const h = w * 0.73; // Scryfall art crops are ~626x457
  const zoom = 1 + 0.08 * ramp(t, at, at + 8);
  return (
    <div
      {...audit("card", "art:" + (src.split("/").pop() ?? src), at, p)}
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        transform: `rotate(${rot}deg) scale(${p})`,
        background: "#fffdf7",
        padding: 12,
        border: `4px solid ${INK}`,
        borderRadius: 6,
        boxShadow: "10px 12px 0 rgba(0,0,0,0.16)",
      }}
    >
      <div style={{ width: "100%", height: h, overflow: "hidden", borderRadius: 3 }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      </div>
      {caption && (
        <div
          style={{
            fontFamily: HAND,
            fontSize: Math.max(26, w * 0.06),
            color: INK,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          {caption}
        </div>
      )}
      {/* two strips of tape */}
      <div style={{ position: "absolute", left: -18, top: -14, width: 90, height: 30, background: "rgba(255,225,107,0.8)", transform: "rotate(-24deg)" }} />
      <div style={{ position: "absolute", right: -18, top: -14, width: 90, height: 30, background: "rgba(255,225,107,0.8)", transform: "rotate(22deg)" }} />
    </div>
  );
};

/** Official product shot (deck box etc.) with a transparent background, centred on (x, y). */
export const ProductImg: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  at: number;
  out?: number;
  rot?: number;
}> = ({ src, x, y, w, at, out, rot = 0 }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 10);
  if (p <= 0.001) return null;
  return (
    <Img
      {...audit("card", "product:" + (src.split("/").pop() ?? src), at, p)}
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y,
        width: w,
        transform: `translateY(-50%) rotate(${rot}deg) scale(${p})`,
        filter: "drop-shadow(12px 16px 0 rgba(0,0,0,0.18))",
      }}
    />
  );
};

// ---------------------------------------------------------------- text

/** Paper strip quoting card or rules text. Wrap words in [[double brackets]] to highlight them. */
export const Callout: React.FC<{
  text: string;
  x: number;
  y: number;
  w?: number;
  at: number;
  out?: number;
  rot?: number;
  size?: number;
  label?: string;
}> = ({ text, x, y, w = 620, at, out, rot = -2, size = 34, label }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, readSecs((label ?? "") + " " + text));
  const p = pop(t, fps, at, out, 11);
  if (p <= 0.001) return null;
  const parts = text.split(/(\[\[.*?\]\])/g);
  return (
    <div
      {...audit("callout", (label ? label + ": " : "") + text.replace(/\[\[|\]\]/g, ""), at, p)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * p})`,
        transformOrigin: "left center",
        opacity: p,
      }}
    >
      {label && (
        <div
          style={{
            fontFamily: BLOCK,
            fontSize: 24,
            letterSpacing: 2,
            color: ACCENT,
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          background: "#fffdf7",
          border: `4px solid ${INK}`,
          borderRadius: 12,
          padding: "16px 22px",
          boxShadow: "8px 9px 0 rgba(0,0,0,0.16)",
          fontFamily: "Georgia, serif",
          fontSize: size,
          lineHeight: 1.3,
          color: INK,
        }}
      >
        {parts.map((pt, i) =>
          pt.startsWith("[[") ? (
            <span
              key={i}
              style={{
                background: "linear-gradient(transparent 55%, #ffe16b 55%)",
                fontWeight: 700,
              }}
            >
              {pt.slice(2, -2)}
            </span>
          ) : (
            <span key={i}>{pt}</span>
          ),
        )}
      </div>
    </div>
  );
};

export const Sticker: React.FC<{
  text: string;
  x: number;
  y: number;
  at: number;
  out?: number;
  rot?: number;
  size?: number;
  color?: string;
  bg?: string;
  wobble?: boolean;
  /** Meant to sit on top of a card or drawing (a stamp such as "FIZZLES" or "RIP"). */
  stamp?: boolean;
}> = ({
  text,
  x,
  y,
  at,
  out,
  rot = -6,
  size = 72,
  color = ACCENT,
  bg,
  wobble = false,
  stamp = false,
}) => {
  const { t, fps } = useT();
  out = holdOut(at, out, readSecs(text));
  const p = pop(t, fps, at, out, 8);
  if (p <= 0.001) return null;
  const wob = wobble ? Math.sin(t * 9) * 3 : 0;
  return (
    <div
      {...audit("sticker", text, at, p, stamp)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot + wob}deg) scale(${p})`,
        fontFamily: BLOCK,
        fontSize: size,
        color,
        WebkitTextStroke: bg ? undefined : `${Math.max(4, size / 9)}px ${INK}`,
        paintOrder: "stroke fill",
        background: bg,
        padding: bg ? "6px 22px" : undefined,
        borderRadius: bg ? 10 : undefined,
        border: bg ? `4px solid ${INK}` : undefined,
        boxShadow: bg ? "6px 7px 0 rgba(0,0,0,0.18)" : undefined,
        whiteSpace: "nowrap",
        textShadow: bg ? undefined : "5px 6px 0 rgba(0,0,0,0.15)",
      }}
    >
      {text}
    </div>
  );
};

const TILE_COLORS = [
  "#fffdf7",
  "#ffe16b",
  "#b23a2f",
  "#2b3d68",
  "#fffdf7",
  "#9fd3c7",
];
/** Ransom-note title: each letter on its own paper tile, popping in one after another. */
export const RansomTitle: React.FC<{
  text: string;
  x: number;
  y: number;
  at: number;
  out?: number;
  size?: number;
  stagger?: number;
}> = ({ text, x, y, at, out, size = 96, stagger = 0.045 }) => {
  const { t, fps } = useT();
  const lastLetter = at + text.replace(/ /g, "").length * stagger;
  out = holdOut(lastLetter, out, readSecs(text));
  if (t < at || (out !== undefined && t > out + 0.3)) return null;
  const fade = out === undefined ? 1 : clamp((out + 0.25 - t) / 0.25);
  const shown = Math.min(fade, pop(t, fps, lastLetter, undefined, 9));
  return (
    <div
      {...audit("title", text, at, shown)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, width: "max-content", maxWidth: 1600,
        opacity: fade,
      }}
    >
      {text.split(" ").map((word, wi, words) => {
        const offset = words.slice(0, wi).join(" ").length + (wi > 0 ? 1 : 0);
        return (
          <div
            key={wi}
            style={{
              display: "flex",
              gap: 6,
              marginRight: size * 0.3,
              whiteSpace: "nowrap",
            }}
          >
            {word.split("").map((ch, ci) => {
              const i = offset + ci;
              const p = pop(t, fps, at + i * stagger, undefined, 9);
              const bg = TILE_COLORS[(i * 7) % TILE_COLORS.length];
              const dark = bg === "#b23a2f" || bg === "#2b3d68";
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: i % 3 === 0 ? BLOCK : "Georgia, serif",
                    fontWeight: 900,
                    fontSize: size,
                    lineHeight: 1,
                    padding: "6px 10px",
                    background: bg,
                    color: dark ? "#fff" : INK,
                    border: `3px solid ${INK}`,
                    borderRadius: 6,
                    transform: `rotate(${((i * 37) % 13) - 6}deg) scale(${p})`,
                    boxShadow: "4px 5px 0 rgba(0,0,0,0.18)",
                  }}
                >
                  {ch}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** Burned-in captions: the current sentence, current word highlighted. */
export const Captions: React.FC<{ timing: Timing; y?: number }> = ({
  timing,
  y = 968,
}) => {
  const { t } = useT();
  const sec = timing.sections.find(
    (s) => t >= s.start - 0.1 && t <= s.end + 0.3,
  );
  if (!sec) return null;
  // group words into short caption lines (split at sentence ends, max ~9 words)
  const lines: Word[][] = [];
  let cur: Word[] = [];
  for (const w of sec.words) {
    cur.push(w);
    if (/[.?!…]$/.test(w.w) || cur.length >= 9) {
      lines.push(cur);
      cur = [];
    }
  }
  if (cur.length) lines.push(cur);
  const line = lines.find(
    (l) => t >= l[0].s - 0.05 && t <= l[l.length - 1].e + 0.25,
  );
  if (!line) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 380,
        top: y,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.92)",
          border: `3px solid ${INK}`,
          borderRadius: 14,
          padding: "8px 22px",
          fontFamily: BLOCK,
          fontSize: 40,
          color: INK,
          maxWidth: 1300,
          textAlign: "center",
        }}
      >
        {line.map((w, i) => {
          const on = t >= w.s && t <= w.e + 0.05;
          return (
            <span key={i} style={{ color: on ? ACCENT : INK, marginRight: 12 }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- characters

export type WilEvent = { at: number; anim: string; hold?: number };

// ---------------------------------------------------------------- Wil (pose blending)

/** Seconds Wil takes to ease from one pose into the next (animation to animation, or back to idle). */
export const WIL_BLEND = 0.28;
const RIG_NUMERIC = {
  x: 0, y: 0, rotate: 0, squash: 1, spin: 0, grow: 1, opacity: 1,
  shadesY: 56, shadesX: 0, shadesRotate: 0, pupilX: 0, pupilY: 0, blush: 0,
  leftArm: 45, rightArm: 45, leftArmLength: 50, rightArmLength: 50, legs: 0,
} as const;
type NumKey = keyof typeof RIG_NUMERIC;
/** Animations that must start from their own first frame (e.g. entering from off-stage). */
const NO_BLEND_IN = new Set(["enter"]);

type WilState =
  | { kind: "anim"; ev: WilEvent; start: number }
  | { kind: "idle"; start: number };

const easeInOut = (x: number) => x * x * (3 - 2 * x);

/** Which pose Wil is in at time tt: a library animation (with its optional hold) or idle. */
function wilState(tt: number, events: WilEvent[], fps: number): WilState {
  let ev: WilEvent | undefined;
  for (const e of events) if (tt >= e.at && (!ev || e.at >= ev.at)) ev = e;
  if (!ev) return { kind: "idle", start: 0 };
  const a = LIBRARY.find((l) => l.id === ev!.anim);
  const len = ((a?.duration ?? 0) + Math.round((ev.hold ?? 0) * fps)) / fps;
  if (a && tt < ev.at + len) return { kind: "anim", ev, start: ev.at };
  return { kind: "idle", start: ev.at + len };
}

/** The rig props for a state, evaluated at time t (an animation past its end holds its last frame). */
function wilPose(st: WilState, t: number, fps: number, talking: boolean): RigProps {
  if (st.kind === "anim") {
    const a = LIBRARY.find((l) => l.id === st.ev.anim)!;
    const local = Math.max(0, Math.min(Math.round((t - st.ev.at) * fps), a.duration - 1));
    return a.fn(local, fps);
  }
  const bob = Math.sin(t * 2.2);
  const idle: RigProps = {
    y: bob * 3,
    squash: 1 + bob * 0.012,
    leftArm: 45 + bob * 4,
    rightArm: 45 - bob * 4,
    rotate: Math.sin(t * 0.7) * 2,
  };
  if (talking) {
    idle.mouth = (["open", "chew", "grin", "o"] as const)[Math.floor(t * 9) % 4];
    idle.brows = Math.sin(t * 1.3) > 0.6 ? "up" : "none";
  }
  return idle;
}

/** Ease from pose a to pose b: numbers interpolate, faces switch halfway, props cross-fade. */
function mixPose(a: RigProps, b: RigProps, k: number): RigProps {
  const out: RigProps = { ...(k < 0.5 ? a : b) };
  for (const key of Object.keys(RIG_NUMERIC) as NumKey[]) {
    const va = (a[key] as number | undefined) ?? RIG_NUMERIC[key];
    const vb = (b[key] as number | undefined) ?? RIG_NUMERIC[key];
    (out as Record<string, unknown>)[key] = va + (vb - va) * k;
  }
  const fade = (na: React.ReactNode, nb: React.ReactNode) =>
    na || nb ? (
      <g>
        {na && <g opacity={1 - k}>{na}</g>}
        {nb && <g opacity={k}>{nb}</g>}
      </g>
    ) : undefined;
  out.fixed = fade(a.fixed, b.fixed);
  out.children = fade(a.children, b.children);
  out.behind = fade(a.behind, b.behind);
  return out;
}

/**
 * Wil D. Card: idles, talks in sync with the words, and plays library animations on cue.
 * Every change of pose (into an animation, from one animation into the next, or back to idle)
 * eases over WIL_BLEND seconds instead of snapping.
 */
export const Wil: React.FC<{
  timing: Timing;
  events: WilEvent[];
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
}> = ({ timing, events, x = 1640, y = 820, scale = 1.25, flip = false }) => {
  const { t, fps } = useT();
  const talking = timing.sections.some((s) =>
    s.words.some((w) => t >= w.s && t <= w.e),
  );
  const cur = wilState(t, events, fps);
  let props = wilPose(cur, t, fps, talking);
  const since = t - cur.start;
  const blendIn = !(cur.kind === "anim" && NO_BLEND_IN.has(cur.ev.anim));
  if (cur.start > 0 && since < WIL_BLEND && blendIn) {
    const prev = wilState(cur.start - 1 / fps, events, fps);
    props = mixPose(wilPose(prev, t, fps, talking), props, easeInOut(since / WIL_BLEND));
  }
  // for the audit: which animation is playing and how far in (scripts/qa_layout.py flags cut-offs)
  const lib = cur.kind === "anim" ? LIBRARY.find((l) => l.id === cur.ev.anim) : undefined;
  const wilLabel =
    cur.kind === "anim" && lib
      ? `anim:${cur.ev.anim}:${cur.ev.at.toFixed(2)}:${Math.min(1, since / (lib.duration / fps)).toFixed(2)}`
      : "idle";
  return (
    <div
      {...audit("wil", wilLabel, 0, 1)}
      style={{
        position: "absolute",
        left: x - 150 * scale,
        top: y - 180 * scale,
      }}
    >
      <MascotRig id="wil" scale={scale} flip={flip} {...props} />
    </div>
  );
};

/** An opponent at the table: an original card-back character (no sunglasses), in another colour. */
export const Friend: React.FC<{
  x: number;
  y: number;
  back: Back;
  at: number;
  out?: number;
  scale?: number;
  mouth?: RigProps["mouth"];
  brows?: RigProps["brows"];
  name?: string;
}> = ({
  x,
  y,
  back,
  at,
  out,
  scale = 0.55,
  mouth = "smile",
  brows = "none",
  name,
}) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 11);
  if (p <= 0.001) return null;
  return (
    <div
      {...audit("char", "friend-" + back + (name ? ": " + name : ""), at, p)}
      style={{
        position: "absolute",
        left: x - 150 * scale,
        top: y - 180 * scale,
        transform: `scale(${p})`,
        opacity: p,
      }}
    >
      <MascotRig
        id={`f-${back}-${x}`}
        back={back}
        scale={scale}
        shadesOn={false}
        eyes="open"
        mouth={mouth}
        brows={brows}
        y={Math.sin(t * 2 + x) * 3}
      />
      {name && (
        <div
          {...audit("label", name, at, p)}
          style={{
            textAlign: "center",
            fontFamily: HAND,
            fontSize: 30,
            color: INK,
            marginTop: -8,
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- shapes

export const PaperArrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: number;
  out?: number;
  color?: string;
  bend?: number;
}> = ({ x1, y1, x2, y2, at, out, color = ACCENT, bend = -80 }) => {
  const { t } = useT();
  out = holdOut(at, out, SEE_SECS);
  if (t < at || (out !== undefined && t > out)) return null;
  const draw = ramp(t, at, at + 0.35);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + bend;
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.3;
  const ang = Math.atan2(y2 - my, x2 - mx);
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={1920}
      height={1080}
    >
      <path
        d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
      {draw > 0.95 && (
        <polygon
          points={`${x2},${y2} ${x2 - 30 * Math.cos(ang - 0.45)},${y2 - 30 * Math.sin(ang - 0.45)} ${x2 - 30 * Math.cos(ang + 0.45)},${y2 - 30 * Math.sin(ang + 0.45)}`}
          fill={color}
        />
      )}
    </svg>
  );
};

export const Confetti: React.FC<{
  x: number;
  y: number;
  at: number;
  n?: number;
}> = ({ x, y, at, n = 26 }) => {
  const { t } = useT();
  const dt = t - at;
  if (dt < 0 || dt > 2.2) return null;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={1920}
      height={1080}
    >
      {Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (i - n / 2) * 0.13;
        const v = 520 + ((i * 97) % 5) * 90;
        const px = x + Math.cos(a) * v * dt;
        const py = y + Math.sin(a) * v * dt + 700 * dt * dt;
        return (
          <rect
            key={i}
            x={px}
            y={py}
            width={18}
            height={11}
            fill={[ACCENT, GOLD, "#4a6aa0", "#1f7a3a", "#9fd3c7"][i % 5]}
            stroke={INK}
            strokeWidth={1.5}
            transform={`rotate(${i * 40 + dt * 500} ${px} ${py})`}
            opacity={clamp(2.2 - dt)}
          />
        );
      })}
    </svg>
  );
};

export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  out?: number;
  children: React.ReactNode;
  rot?: number;
}> = ({ x, y, w, h, at, out, children, rot = 0 }) => {
  const { t, fps } = useT();
  const p = pop(t, fps, at, out, 13);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * p})`,
        opacity: p,
      }}
    >
      {children}
    </div>
  );
};

/** A card back flying from one point to another (for "hand one to each opponent", shuffling, etc.). */
export const FlyCard: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: number;
  dur?: number;
  w?: number;
  out?: number;
}> = ({ x1, y1, x2, y2, at, dur = 0.6, w = 70, out }) => {
  const { t } = useT();
  if (t < at || (out !== undefined && t > out)) return null;
  const k = 1 - Math.pow(1 - ramp(t, at, at + dur), 3);
  const x = x1 + (x2 - x1) * k;
  const y = y1 + (y2 - y1) * k - Math.sin(Math.PI * k) * 120;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - (w * 1.4) / 2,
        transform: `rotate(${(1 - k) * 360}deg)`,
      }}
    >
      <CardBackFace w={w} />
    </div>
  );
};

export const Reticle: React.FC<{
  x: number;
  y: number;
  at: number;
  out?: number;
  r?: number;
}> = ({ x, y, at, out, r = 110 }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, SEE_SECS);
  const p = pop(t, fps, at, out, 10);
  if (p <= 0.001) return null;
  const rr = r * (1.8 - 0.8 * p) + Math.sin(t * 8) * 4;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={1920}
      height={1080}
    >
      <g
        opacity={p}
        stroke={ACCENT}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      >
        <circle cx={x} cy={y} r={rr} />
        <line x1={x - rr - 30} y1={y} x2={x - rr + 25} y2={y} />
        <line x1={x + rr - 25} y1={y} x2={x + rr + 30} y2={y} />
        <line x1={x} y1={y - rr - 30} x2={x} y2={y - rr + 25} />
        <line x1={x} y1={y + rr - 25} x2={x} y2={y + rr + 30} />
      </g>
    </svg>
  );
};

export { ACCENT, GOLD, INK, PAPER };
