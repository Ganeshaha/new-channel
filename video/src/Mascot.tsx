import React from "react";
import { AbsoluteFill } from "remotion";

// Wild Card Commander mascot: an ORIGINAL card-back character with pixel sunglasses.
// Deliberately not Wizards' card back: no oval, no logo, no five mana circles. Own swirl + gold "wild" star seal.

export const INK = "#1d1b19";
export const PAPER = "#fbf8f1";
export const ACCENT = "#c8372d";
export const GOLD = "#e0b64f";

export type Pose = "cool" | "checking" | "verdict" | "shrug" | "point";

const PixelShades: React.FC<{ x: number; y: number; px?: number }> = ({ x, y, px = 7 }) => {
  // 16x4 pixel pattern: 1 = black, 2 = white highlight, 0 = empty
  const rows = ["1111111111111111", "0112211001122110", "0111111001111110", "0011110000111100"];
  return (
    <g transform={`translate(${x} ${y})`}>
      {rows.flatMap((row, r) =>
        row.split("").map((c, i) =>
          c === "0" ? null : (
            <rect key={`${r}-${i}`} x={i * px} y={r * px} width={px + 0.5} height={px + 0.5} fill={c === "1" ? "#111" : "#fff"} />
          ),
        ),
      )}
    </g>
  );
};

const starPath = (cx: number, cy: number, R: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    return `${i === 0 ? "M" : "L"}${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`;
  }).join(" ") + " Z";

const CardBack: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <defs>
      <radialGradient id={`field-${id}`} cx="45%" cy="38%" r="78%">
        <stop offset="0%" stopColor="#4a6aa0" />
        <stop offset="55%" stopColor="#2b3d68" />
        <stop offset="100%" stopColor="#18203d" />
      </radialGradient>
    </defs>
    <rect x={8} y={10} width={180} height={252} rx={14} fill="#000" opacity={0.18} />
    <rect x={0} y={0} width={180} height={252} rx={14} fill="#5a3b24" stroke={INK} strokeWidth={5} />
    <rect x={14} y={14} width={152} height={224} rx={8} fill={`url(#field-${id})`} stroke="#2c1d12" strokeWidth={3} />
    <path d="M36 214 C 24 150, 84 130, 92 160 S 156 176, 146 96 S 64 34, 52 70" stroke="#e9d9b4" strokeOpacity={0.3} strokeWidth={6} fill="none" strokeLinecap="round" />
    {/* the "wild" seal: a gold badge with a star, no logos */}
    <circle cx={90} cy={194} r={27} fill={GOLD} stroke={INK} strokeWidth={4} />
    <circle cx={90} cy={194} r={21} fill="none" stroke="#fff4d6" strokeWidth={2} strokeDasharray="3 4" />
    <path d={starPath(90, 195, 15, 6.5)} fill={ACCENT} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
  </g>
);

const Arm: React.FC<{ from: [number, number]; to: [number, number]; hand?: boolean }> = ({ from, to, hand = true }) => (
  <g>
    <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={INK} strokeWidth={6} strokeLinecap="round" />
    {hand && <circle cx={to[0]} cy={to[1]} r={7} fill={PAPER} stroke={INK} strokeWidth={4} />}
  </g>
);

/** pressAngle: when set, the left arm swings out to the left (degrees; 0 = straight left) for button presses. */
export const WildCardMascot: React.FC<{ pose?: Pose; scale?: number; pressAngle?: number; id?: string }> = ({
  pose = "cool",
  scale = 1,
  pressAngle,
  id = "m",
}) => {
  const shadesY = pose === "checking" ? 84 : pose === "verdict" ? -8 : 56;
  const tilt = { cool: -5, checking: 0, verdict: 4, shrug: -2, point: 3 }[pose];
  return (
    <svg width={300 * scale} height={360 * scale} viewBox="-60 -40 300 360" style={{ overflow: "visible" }}>
      <g transform={`rotate(${tilt} 90 126)`}>
        <line x1={60} y1={250} x2={50} y2={300} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={120} y1={250} x2={132} y2={300} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <CardBack id={id} />
        {pose === "checking" && (
          <g>
            <circle cx={64} cy={66} r={8} fill={PAPER} stroke={INK} strokeWidth={3} />
            <circle cx={116} cy={66} r={8} fill={PAPER} stroke={INK} strokeWidth={3} />
            <circle cx={66} cy={67} r={3.5} fill={INK} />
            <circle cx={118} cy={67} r={3.5} fill={INK} />
            <path d="M104 48 Q116 40 128 46" stroke={PAPER} strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        )}
        <PixelShades x={34} y={shadesY} />
        {pose === "verdict" && (
          <g stroke={ACCENT} strokeWidth={4} strokeLinecap="round">
            <line x1={40} y1={-34} x2={40} y2={-18} />
            <line x1={90} y1={-40} x2={90} y2={-20} />
            <line x1={140} y1={-34} x2={140} y2={-18} />
          </g>
        )}
        {pose === "checking" ? (
          <path d="M74 128 L106 128" stroke={PAPER} strokeWidth={5} strokeLinecap="round" />
        ) : pose === "shrug" ? (
          <path d="M68 124 Q80 132 92 124 Q104 116 114 124" stroke={PAPER} strokeWidth={5} fill="none" strokeLinecap="round" />
        ) : (
          <path d="M66 118 Q91 140 116 116" stroke={PAPER} strokeWidth={5} fill="none" strokeLinecap="round" />
        )}
        {/* left arm */}
        {pressAngle !== undefined ? (
          <g transform={`rotate(${pressAngle} 0 150)`}>
            <Arm from={[0, 150]} to={[-80, 150]} />
          </g>
        ) : pose === "shrug" ? (
          <Arm from={[0, 150]} to={[-40, 108]} />
        ) : (
          <Arm from={[0, 150]} to={[-34, 180]} />
        )}
        {/* right arm */}
        {pose === "checking" ? (
          <Arm from={[180, 145]} to={[152, 104]} />
        ) : pose === "verdict" ? (
          <Arm from={[180, 145]} to={[222, 104]} />
        ) : pose === "shrug" ? (
          <Arm from={[180, 150]} to={[222, 108]} />
        ) : pose === "point" ? (
          <Arm from={[180, 145]} to={[250, 138]} />
        ) : (
          <Arm from={[180, 150]} to={[216, 180]} />
        )}
      </g>
    </svg>
  );
};

const HAND = '"Segoe Print", "Comic Sans MS", cursive';

export const MascotSheet: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center", gap: 30 }}>
    <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 58, color: INK }}>
      WILD CARD COMMANDER <span style={{ color: ACCENT }}>· mascot</span>
    </div>
    <div style={{ display: "flex", gap: 34, alignItems: "flex-end" }}>
      {(["cool", "checking", "verdict", "shrug", "point"] as Pose[]).map((p) => (
        <div key={p} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <WildCardMascot pose={p} id={p} />
          <div style={{ fontFamily: HAND, fontSize: 30, color: INK }}>
            {{ cool: "default", checking: "hold on… (shades down)", verdict: "verdict (shades drop)", shrug: "wild card?", point: "look at this" }[p]}
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

/** 800x800 profile picture. YouTube crops to a circle, so keep the mascot inside the middle ~80%. */
export const Avatar: React.FC = () => (
  <AbsoluteFill style={{ background: GOLD, alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: "#f4cf6b" }} />
    <div style={{ transform: "translate(18px, 70px)" }}>
      <WildCardMascot pose="cool" scale={1.9} id="avatar" />
    </div>
  </AbsoluteFill>
);

/** 2560x1440 channel banner. Everything important sits in the 1546x423 centre safe area. */
export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: "#2b3d68" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #4a6aa0 0%, #2b3d68 55%, #18203d 100%)" }} />
    <div style={{ position: "absolute", left: 507, top: 508, width: 1546, height: 423, display: "flex", alignItems: "center", gap: 40 }}>
      <WildCardMascot pose="point" scale={1.1} id="banner" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 118, lineHeight: 1, color: PAPER, textShadow: "6px 7px 0 rgba(0,0,0,0.35)" }}>
          WILD CARD
          <br />
          <span style={{ color: GOLD }}>COMMANDER</span>
        </div>
        <div style={{ fontFamily: HAND, fontSize: 44, color: PAPER }}>Casual Commander, for people who want the rematch.</div>
      </div>
    </div>
  </AbsoluteFill>
);
