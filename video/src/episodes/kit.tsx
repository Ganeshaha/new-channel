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
  Sparkle,
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
 *   AUDIT <frame> [[kind, label, at, p, left, top, width, height, layoutW, layoutH, rotDeg, stamp, minFontPx], ...]
 * scripts/qa_layout.py turns those lines into overlap, clipping and minimum-time reports.
 */
export const AuditProbe: React.FC<{ every?: number }> = ({ every = 3 }) => {
  const frame = useCurrentFrame();
  React.useLayoutEffect(() => {
    if (frame % every !== 0) {
      // Wil's face/pose probe goes out on every frame, so the audit can see frame-to-frame jitter
      // (a wobble with a 2-3 frame period is invisible when sampling every 3rd frame)
      const f = document.querySelector<HTMLElement>('[data-audit="face"]');
      if (f) console.log("AUDITF " + frame + " " + JSON.stringify(f.dataset.label ?? "")); // eslint-disable-line no-console
      return;
    }
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
      // smallest rendered text inside it (font size x whatever scale is applied), for the text-size check
      let fontPx = 0;
      const rc = Math.abs(Math.cos((rot * Math.PI) / 180));
      const rs = Math.abs(Math.sin((rot * Math.PI) / 180));
      [el, ...Array.from(el.querySelectorAll<HTMLElement>("*"))].forEach((d) => {
        const ow = d.offsetWidth, oh = d.offsetHeight;
        if (!ow || !oh) return; // SVG text and hidden nodes
        if (!Array.from(d.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim())) return;
        const dr = d.getBoundingClientRect();
        const sc = (dr.width / (ow * rc + oh * rs) + dr.height / (ow * rs + oh * rc)) / 2;
        const px = parseFloat(getComputedStyle(d).fontSize) * sc;
        if (px > 0 && (fontPx === 0 || px < fontPx)) fontPx = px;
      });
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
        Math.round(fontPx),
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
/** Share of a card's tilt it keeps once it has landed. */
const CARD_REST_TILT = 0.3;

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
  // enters at its full tilt and settles nearly straight: the white-background channels never tilt
  // resting cards (research/layout-study), but the swing keeps the entrance lively
  const tilt = rot * (CARD_REST_TILT + (1 - CARD_REST_TILT) * (1 - Math.min(1, p)));
  return (
    <div
      {...audit("card", src.split("/").pop() ?? src, at, p * Math.abs(flip))}
      style={{
        position: "absolute",
        left: cx - w / 2 + dx,
        top: cy - h / 2 + dy - lift,
        width: w,
        height: h,
        transform: `rotate(${tilt}deg) scale(${sc * Math.abs(flip)}, ${sc})`,
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
            // the header is read too: close to the body size (it was 24 px, too small on a phone)
            fontSize: Math.max(30, Math.round(size * 0.94)),
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
  leftArm: 45, rightArm: 45, leftArmLength: 50, rightArmLength: 50, legs: 0, mouthOpen: 0, browAmt: 1,
} as const;
type NumKey = keyof typeof RIG_NUMERIC;
/** Animations that must start from their own first frame (e.g. entering from off-stage). */
const NO_BLEND_IN = new Set(["enter"]);

/** Per-frame loudness of the narration (scripts/voice_envelope.py): drives lip-sync and talking gestures. */
export type Voice = { fps: number; level: number[]; peaks: number[] };
const voiceLevel = (v: Voice | undefined, t: number) => {
  if (!v) return 0;
  const f = t * v.fps;
  const i = Math.floor(f);
  const a = v.level[i] ?? 0;
  const b = v.level[i + 1] ?? a;
  return a + (b - a) * (f - i);
};
/**
 * Wil's expression plan (scripts/wil_director.py): the accents he nods on, when his brows go up and
 * when he gestures. Planned per phrase with minimum gaps, so he never twitches on every syllable.
 */
export type Accent = { t: number; kind: "up" | "tilt" | "down"; amp: number; dir: number };
export type Gesture = { t: number; arm: "L" | "R"; amp: number };
export type Expression = { accents: Accent[]; brows: number[]; gestures: Gesture[]; browShape: [number, number, number] };
/** Index of the last time in a sorted list that is <= t (or -1). */
const lastAt = (xs: number[], t: number) => {
  let lo = 0, hi = xs.length - 1, idx = -1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (xs[m] <= t) { idx = m; lo = m + 1; } else hi = m - 1;
  }
  return idx;
};
/**
 * A head accent (research/wil-motion): a small anticipation the other way, a quick stroke on the
 * word, then a slower settle. "up" rises, "down" dips, "tilt" leans; the size follows prominence.
 * The stroke peaks at the accent time, which the plan already puts a few frames before the syllable.
 */
const accentPose = (acc: Accent[] | undefined, t: number) => {
  if (!acc?.length) return { dy: 0, rot: 0, sq: 0 };
  const n = lastAt(acc.map((a) => a.t - 0.2), t);
  if (n < 0) return { dy: 0, rot: 0, sq: 0 };
  const a = acc[n];
  const d = t - a.t; // stroke peak at d = 0
  const e = (x: number) => x * x * (3 - 2 * x);
  // -0.2..-0.1 anticipate, -0.1..0 stroke, 0..0.45 settle
  const shape =
    d < -0.1 ? -0.35 * e((d + 0.2) / 0.1) :
    d < 0 ? -0.35 + 1.35 * e((d + 0.1) / 0.1) :
    d < 0.45 ? 1 - e(d / 0.45) : 0;
  const k = shape * a.amp;
  if (a.kind === "up") return { dy: -3 * k, rot: 0, sq: 0.012 * k };
  if (a.kind === "down") return { dy: 3 * k, rot: 0, sq: -0.012 * k };
  return { dy: -1 * k, rot: 2.2 * k * a.dir, sq: 0 };
};
/** 0 -> 1 -> 0 over (rise, hold, fall) seconds after the most recent time in xs; smooth at both ends. */
const envAfter = (xs: number[] | undefined, t: number, rise: number, hold: number, fall: number) => {
  if (!xs?.length) return { v: 0, n: -1 };
  const n = lastAt(xs, t);
  if (n < 0) return { v: 0, n };
  const d = t - xs[n];
  const e = (x: number) => x * x * (3 - 2 * x);
  const v = d < rise ? e(d / rise) : d < rise + hold ? 1 : d < rise + hold + fall ? 1 - e((d - rise - hold) / fall) : 0;
  return { v, n };
};
/** How much he's in the middle of talking, 0-1, smoothed over about a second (no snapping between words). */
const talkActivity = (v: Voice | undefined, t: number) => {
  if (!v) return 0;
  // Every frame in a +-0.6 s window, raised-cosine weighted, evaluated at fractional t so it glides.
  // (v20 sampled every 3rd frame: as the sample grid shifted each frame the value flickered, and the
  // lean it drives wobbled +-0.25 deg on a 3-frame cycle, the "jittering at 33 seconds".)
  const f0 = t * v.fps;
  const half = Math.round(0.6 * v.fps);
  let on = 0, n = 0;
  for (let i = Math.floor(f0) - half; i <= Math.ceil(f0) + half; i++) {
    const d = (i - f0) / half;
    if (Math.abs(d) > 1) continue;
    const w = 0.5 + 0.5 * Math.cos(Math.PI * d);
    n += w;
    if ((v.level[i] ?? 0) > 0.12) on += w;
  }
  const x = n ? on / n : 0;
  return x * x * (3 - 2 * x);
};

/**
 * How far Wil is turned toward the newest thing on stage: 0 -> 1 -> 0 over about 1.1 s after each
 * look time (looks.json, from scripts/wil_looks.py). Every other look he also points at it.
 */
const lookWeight = (looks: number[] | undefined, t: number) => {
  if (!looks?.length) return { w: 0, point: false };
  let lo = 0, hi = looks.length - 1, idx = -1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (looks[m] <= t) { idx = m; lo = m + 1; } else hi = m - 1;
  }
  if (idx < 0) return { w: 0, point: false };
  const d = t - looks[idx];
  const w = d < 0.22 ? easeInOut(d / 0.22) : d < 0.8 ? 1 : d < 1.15 ? 1 - easeInOut((d - 0.8) / 0.35) : 0;
  return { w, point: idx % 2 === 0 };
};
type Look = { w: number; point: boolean; dir: number };

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

/**
 * "Still" idle (research/pacing: top channels' mascots move 2-7 % of the time; v22 Wil swayed in
 * 40-78 % of moments). Instead of continuous breathing and sway he holds a pose and eases into a
 * slightly different one every 4-8 s (0.6 s ease), so he's alive without constant motion.
 */
const SHIFT_TIMES: number[] = (() => {
  const out = [0];
  for (let k = 1; out[out.length - 1] < 4000; k++) {
    const h = Math.sin(k * 91.7 + 3.1) * 43758.5453;
    out.push(out[out.length - 1] + 4 + 4 * (h - Math.floor(h)));
  }
  return out;
})();
const shiftTarget = (k: number) => {
  const h = (i: number) => {
    const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  return { rot: (h(k * 3) - 0.5) * 2.4, y: (h(k * 3 + 1) - 0.5) * 3 };
};
const stillIdle = (t: number) => {
  const k = Math.max(0, lastAt(SHIFT_TIMES, t));
  const a = shiftTarget(k - 1);
  const b = shiftTarget(k);
  const e = easeInOut(Math.min(1, (t - SHIFT_TIMES[k]) / 0.6));
  return { rot: a.rot + (b.rot - a.rot) * e, y: a.y + (b.y - a.y) * e };
};

/** The rig props for a state, evaluated at time t (an animation past its end holds its last frame). */
function wilPose(
  st: WilState, t: number, fps: number, talking: boolean, voice?: Voice, look?: Look, plan?: Expression,
  calm = 1, calmAt?: (tt: number) => number, still = false,
): RigProps {
  if (st.kind === "anim") {
    const a = LIBRARY.find((l) => l.id === st.ev.anim)!;
    const local = Math.max(0, Math.min(Math.round((t - st.ev.at) * fps), a.duration - 1));
    return a.fn(local, fps);
  }
  // Talking body language follows the expression plan (wil_director.py): a small eased nod on the
  // accent of a phrase (not every syllable), an arm gesture every few seconds, and a brow raise only
  // on questions and big moments, which eases up, holds and eases down.
  // `calm` (0-1) fades the small accents out around a library reaction, so his face doesn't change
  // twice in a row (research/wil-motion: suppress head, brow and gesture accents during reactions)
  const acc0 = accentPose(plan?.accents, t);
  const acc = { dy: acc0.dy * calm, rot: acc0.rot * calm, sq: acc0.sq * calm };
  // gesture: prep, stroke on the accent, short hold, slower retract; the arm comes from the plan
  const gest = envAfter(plan?.gestures?.map((g) => g.t - 0.2), t, 0.25, 0.2, 0.5);
  const ge = gest.n >= 0 ? plan!.gestures[gest.n] : undefined;
  const gestureRight = ge?.arm === "R";
  const gAmp = gest.v * (ge?.amp ?? 1) * calm;
  const [bIn, bHold, bOut] = plan?.browShape ?? [0.18, 0.8, 0.4];
  const bEv = envAfter(plan?.brows, t, bIn, bHold, bOut);
  // a planned raise that would start while a reaction is already calming him is skipped outright
  // (a half-faded ghost of a brow raise is worse than none)
  const browOk = !calmAt || bEv.n < 0 || calmAt(plan!.brows[bEv.n]) >= 0.7;
  const brow = browOk ? bEv.v * calm : 0;
  // leans toward the stage while he's mid-flow; smoothed so it doesn't jump between words
  const flow = talkActivity(voice, t);
  // breathing and sway on incommensurate periods, so the idle never visibly loops
  const breath = still ? 0 : Math.sin((t * 2 * Math.PI) / 3.4);
  const sway = still ? 0 : Math.sin((t * 2 * Math.PI) / 6.53) * 0.6 + Math.sin((t * 2 * Math.PI) / 15.53) * 0.4;
  const hold = still ? stillIdle(t) : { rot: 0, y: 0 };
  const idle: RigProps = {
    y: breath * 2 + hold.y + acc.dy,
    squash: 1 + breath * 0.01 + acc.sq,
    leftArm: 45 + breath * 3 + (!gestureRight ? gAmp * 26 : 0),
    rightArm: 45 - breath * 3 + (gestureRight ? gAmp * 26 : 0),
    rotate: sway * 1.5 + hold.rot - flow * 2 + acc.rot,
  };
  if (brow > 0.01) {
    idle.brows = "up";
    idle.browAmt = brow;
  }
  // a glance at whatever just arrived: shades and head turn toward it, and every other time a point
  if (look && look.w > 0 && look.dir !== 0) {
    const { w, dir } = look;
    idle.shadesX = 7 * dir * w;
    idle.shadesY = 56 - 3 * w;
    idle.pupilX = 5 * dir * w;
    idle.rotate = (idle.rotate ?? 0) * (1 - w) + 3 * dir * w;
    if (look.point) {
      const arm = dir < 0 ? "leftArm" : "rightArm";
      const len = dir < 0 ? "leftArmLength" : "rightArmLength";
      idle[arm] = (idle[arm] ?? 45) * (1 - w) + 100 * w;
      idle[len] = 50 + 18 * w;
    }
  }
  // every ~9 s the shades catch the light
  const g = (t % 9) / 0.45;
  if (g < 1) idle.fixed = <Sparkle x={112} y={52} s={Math.sin(Math.PI * g) * 0.9} color="#ffffff" />;
  return idle;
}

/** How long a reaction's brows take to soften away once it ends (s). */
const BROW_LINGER = 1.2;
/** Brows that go down and come back within this many seconds stay up instead (no flicker). */
const BROW_BRIDGE = 1.2;
const browOf = (p: RigProps) => (p.brows && p.brows !== "none" ? p.browAmt ?? 1 : 0);

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
  // brows fade out and in rather than switching shape at the halfway point
  const ba = a.brows && a.brows !== "none" ? (a.browAmt ?? 1) : 0;
  const bb = b.brows && b.brows !== "none" ? (b.browAmt ?? 1) : 0;
  if (!ba && bb) { out.brows = b.brows; out.browAmt = bb * k; }
  else if (ba && !bb) { out.brows = a.brows; out.browAmt = ba * (1 - k); }
  else if (ba && bb && a.brows !== b.brows) {
    out.brows = k < 0.5 ? a.brows : b.brows;
    out.browAmt = (k < 0.5 ? ba : bb) * Math.abs(1 - 2 * k);
  }
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
  /** narration loudness per frame; without it the mouth falls back to a fixed talking cycle */
  voice?: Voice;
  /** times something new lands on stage; he glances (and every other time points) at it */
  looks?: number[];
  /** when he nods, raises his brows and gestures (scripts/wil_director.py) */
  expression?: Expression;
  /** hold still between purposeful moves (no breathing/sway loop): research/pacing */
  still?: boolean;
}> = ({ timing, events, x = 1640, y = 820, scale = 1.25, flip = false, voice, looks, expression, still = false }) => {
  const { t, fps } = useT();
  const inWord = timing.sections.some((s) =>
    s.words.some((w) => t >= w.s - 0.05 && t <= w.e + 0.05),
  );
  const level = voiceLevel(voice, t);
  const talking = voice ? inWord || level > 0.12 : inWord;
  // the stage is toward the middle of the frame; in rig coordinates a flipped Wil turns the other way
  const toStage = x > 1060 ? -1 : x < 860 ? 1 : 0;

  /** 0-1: quiets the small accents from 2 s before a reaction (fully by 1 s before) and for 0.6 s after one ends. */
  const calmAt = (tt: number) => {
    let nextAt = Infinity;
    for (const e of events) if (e.at > tt && e.at < nextAt) nextAt = e.at;
    const st = wilState(tt, events, fps);
    return (
      Math.max(0, Math.min(1, (nextAt - tt - 1.0) / 1.0)) *
      (st.kind === "idle" && st.start > 0 ? Math.max(0, Math.min(1, (tt - st.start) / 0.6)) : st.kind === "anim" ? 0 : 1)
    );
  };

  /** His whole pose at any time tt (no lip-sync): lets the brow bridge below look back and ahead. */
  const body = (tt: number, talk: boolean) => {
    const cur = wilState(tt, events, fps);
    const look: Look = { ...lookWeight(looks, tt), dir: toStage * (flip ? -1 : 1) };
    const calm = calmAt(tt);
    let p = wilPose(cur, tt, fps, talk, voice, look, expression, calm, calmAt, still);
    const since = tt - cur.start;
    // After a reaction, its brows linger and soften over BROW_LINGER s instead of vanishing with the
    // 0.28 s blend ("hold the last shape and soften it", Illusion of Life).
    const linger = (st: WilState, pose: RigProps, at: number) => {
      const s2 = at - st.start;
      if (st.kind !== "idle" || st.start <= 0 || s2 >= BROW_LINGER) return pose;
      const prev = wilState(st.start - 1 / fps, events, fps);
      if (prev.kind !== "anim") return pose;
      const last = wilPose(prev, st.start - 1 / fps, fps, false);
      if (!last.brows || last.brows === "none") return pose;
      const amt = (last.browAmt ?? 1) * (1 - easeInOut(s2 / BROW_LINGER));
      return amt > browOf(pose) ? { ...pose, brows: last.brows, browAmt: amt } : pose;
    };
    p = linger(cur, p, tt);
    const blendIn = !(cur.kind === "anim" && NO_BLEND_IN.has(cur.ev.anim));
    if (cur.start > 0 && since < WIL_BLEND && blendIn) {
      const prev = wilState(cur.start - 1 / fps, events, fps);
      const from = linger(prev, wilPose(prev, tt, fps, talk, voice, look, expression, calm, calmAt, still), tt);
      p = mixPose(from, p, easeInOut(since / WIL_BLEND));
    }
    return { cur, props: p, since };
  };

  const main = body(t, talking);
  const { cur, since } = main;
  let props = main.props;
  // Brow bridge: if his brows are down now but were up within the last moment and will be up again
  // within BROW_BRIDGE s (two reactions, or a reaction and a planned raise), keep them up through the
  // gap instead of flicking them off and on. Offline rendering lets us look ahead.
  if (browOf(props) <= 0.05) {
    let back: RigProps | undefined, ahead: RigProps | undefined, db = 0, da = 0;
    for (let d = 0.1; d <= BROW_BRIDGE + 1e-6 && !(back && ahead); d += 0.1) {
      if (!back) { const p = body(t - d, false).props; if (browOf(p) > 0.05) { back = p; db = d; } }
      if (!ahead) { const p = body(t + d, false).props; if (browOf(p) > 0.05) { ahead = p; da = d; } }
    }
    if (back && ahead && db + da <= BROW_BRIDGE) {
      const src = db <= da ? back : ahead;
      // ramp from the level just before the gap to the level just after it: no dip, no pop
      const w = db / (db + da);
      props = { ...props, brows: src.brows, browAmt: Math.min(1, browOf(back) + (browOf(ahead) - browOf(back)) * w) };
    }
  }
  // Lip-sync sits on top of every pose: while a word is being spoken he keeps talking, whatever
  // animation his body, arms, brows and props are playing. Between words the pose's own mouth shows.
  // With the voice envelope the mouth opens exactly as far as the voice is loud, frame by frame.
  if (talking) {
    props = voice
      ? { ...props, mouth: "talk", mouthOpen: level }
      : { ...props, mouth: (["open", "chew", "grin", "o"] as const)[Math.floor(t * 9) % 4] };
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
      {/* what his face is actually showing, for the audit's WIL FACE FLICKER check (1 px, invisible) */}
      <div
        {...audit(
          "face",
          `brows=${props.brows && props.brows !== "none" && (props.browAmt ?? 1) > 0.05 ? props.brows : "none"};eyes=${props.shadesOn === false ? props.eyes ?? "open" : "shades"};rot=${(props.rotate ?? 0).toFixed(2)};y=${(props.y ?? 0).toFixed(2)};x=${(props.x ?? 0).toFixed(2)}`,
          0,
          1,
        )}
        style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0 }}
      />
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
        eyes={((t + (x % 7) * 0.53) % 3.7) < 0.13 ? "closed" : "open"}
        pupilX={x < 960 ? 3 : -3}
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

// ---------------------------------------------------------------- captions (Shorts)

/** A caption chunk: 1-3 words shown while they're spoken. */
export type CaptionChunk = { text: string; s: number; e: number };

/**
 * Split the narration into burned-in caption chunks for Shorts (owner, 27 Sep 2026: burned-in
 * captions on Shorts from now on; long-form keeps the uploaded SRT only). research/shorts/REPORT.md:
 * Shorts are often watched muted and the Shorts player has captions off by default, so 1-3 words
 * at a time, synced to the voice, big and bold.
 * A chunk ends at 3 words, at `maxChars`, at punctuation, or at a pause of `pause` seconds; it stays
 * up until the next chunk starts (or 0.3 s after its last word when a longer pause follows).
 */
export const captionChunks = (timing: Timing, maxWords = 3, maxChars = 14, pause = 0.25): CaptionChunk[] => {
  const words = timing.sections.flatMap((sec) => sec.words);
  const raw: { ws: typeof words }[] = [];
  let cur: typeof words = [];
  words.forEach((w, i) => {
    const txt = cur.map((c) => c.w).concat(w.w).join(" ");
    if (cur.length && (cur.length >= maxWords || txt.length > maxChars || w.s - cur[cur.length - 1].e >= pause)) {
      raw.push({ ws: cur });
      cur = [];
    }
    cur.push(w);
    const next = words[i + 1];
    if (/[.,?!\u2026]["\u201d\u2019)]*$/.test(w.w) || !next) {
      raw.push({ ws: cur });
      cur = [];
    }
  });
  if (cur.length) raw.push({ ws: cur });
  // a lone word joins the chunk before it ("WIZARDS MESSED | UP." -> "WIZARDS MESSED UP.") unless that
  // chunk ended a sentence (so emphatic one-word beats like "HIMSELF." stay on their own)
  for (let i = raw.length - 1; i > 0; i--) {
    const prev = raw[i - 1].ws, one = raw[i].ws;
    const joined = prev.concat(one).map((w) => w.w).join(" ");
    const prevEnds = /[.?!\u2026]["\u201d\u2019)]*$/.test(prev[prev.length - 1].w);
    if (one.length === 1 && !prevEnds && joined.length <= 18 && one[0].s - prev[prev.length - 1].e < 0.4) {
      raw[i - 1] = { ws: prev.concat(one) };
      raw.splice(i, 1);
    }
  }
  const clean = (t: string) =>
    t.toUpperCase().replace(/["\u201c\u201d]/g, "").replace(/[.,]+$/g, "").replace(/\u2026$/, "…");
  return raw.map((r, i) => {
    const s0 = r.ws[0].s - 0.05;
    const last = r.ws[r.ws.length - 1].e;
    const next = raw[i + 1]?.ws[0].s;
    const e = next !== undefined && next - last < 0.6 ? next - 0.05 : last + 0.3;
    return { text: clean(r.ws.map((w) => w.w).join(" ")), s: s0, e };
  });
};

/**
 * Burned-in captions: ink block letters with a white outline, one chunk at a time, centred on (x, y),
 * shrinking (never below `minSize`) to fit `maxWidth`. A 3-frame settle on each new chunk, no bounce.
 */
export const ShortCaptions: React.FC<{ timing: Timing; x: number; y: number; maxWidth: number; size?: number; minSize?: number }> = ({
  timing, x, y, maxWidth, size = 72, minSize = 56,
}) => {
  const { t } = useT();
  const chunks = React.useMemo(() => captionChunks(timing), [timing]);
  const c = chunks.find((k) => t >= k.s && t < k.e);
  if (!c) return null;
  // Arial Black capitals average ~0.82 em. One line if it fits at >= minSize; otherwise two lines
  // split at the most balanced word break (we split it ourselves: no surprise wrapping).
  const EM = 0.82;
  const words = c.text.split(" ");
  let lines = [c.text];
  if (maxWidth / (c.text.length * EM) < minSize && words.length > 1) {
    let best = 1, bestLen = Infinity;
    for (let b = 1; b < words.length; b++) {
      const l = Math.max(words.slice(0, b).join(" ").length, words.slice(b).join(" ").length);
      if (l < bestLen) { bestLen = l; best = b; }
    }
    lines = [words.slice(0, best).join(" "), words.slice(best).join(" ")];
  }
  const longest = Math.max(...lines.map((l) => l.length));
  // two lines stay at minSize so the pair fits the same band as one big line
  const fs = lines.length > 1 ? minSize : Math.max(minSize, Math.min(size, maxWidth / (longest * EM)));
  const k = Math.min(1, (t - c.s) / 0.1);
  return (
    <div
      {...audit("caption", c.text, c.s, 1)}
      style={{
        position: "absolute",
        left: x - maxWidth / 2,
        top: y - (fs * lines.length) / 2,
        width: maxWidth,
        textAlign: "center",
        fontFamily: BLOCK,
        fontSize: fs,
        lineHeight: 1,
        whiteSpace: "nowrap",
        color: INK,
        WebkitTextStroke: `${Math.round(fs * 0.16)}px #ffffff`,
        paintOrder: "stroke fill",
        textShadow: "0 4px 10px rgba(0,0,0,0.18)",
        transform: `scale(${0.94 + 0.06 * k})`,
        opacity: 0.4 + 0.6 * k,
      }}
    >
      {lines.map((l, n) => (
        <div key={n}>{l}</div>
      ))}
    </div>
  );
};

