import React from "react";

// Puppet rig for the Wild Card Commander mascot: an ORIGINAL plain card back in pixel sunglasses.
// Every animation in ./animations.tsx drives these props; static poses live in ../Mascot.tsx.

export const INK = "#1d1b19";
export const PAPER = "#fbf8f1";
export const ACCENT = "#c8372d";
export const GOLD = "#e0b64f";

export type Back = "classic" | "navy" | "red" | "kraft" | "charcoal";
// The channel's chosen card back. Change this one value to restyle every asset.
export const MASCOT_BACK: Back = "red";

export type Eyes = "none" | "open" | "wide" | "closed" | "happy" | "x" | "star";
export type Brows = "none" | "raised" | "up" | "angry" | "sad";
export type Mouth = "smile" | "grin" | "open" | "o" | "flat" | "wavy" | "frown" | "teeth" | "chew";

export type RigProps = {
  id?: string;
  back?: Back;
  scale?: number;
  /** body offset in viewBox units (positive y = down) */
  x?: number;
  y?: number;
  /** body lean in degrees, pivoting at the feet */
  rotate?: number;
  /** squash & stretch: <1 squashes, >1 stretches (volume-preserving) */
  squash?: number;
  /** spin around the card's centre in degrees (90 = tapped) */
  spin?: number;
  /** uniform scale around the feet */
  grow?: number;
  /** mirror horizontally (face the other way) */
  flip?: boolean;
  /** fade the whole body */
  opacity?: number;
  shadesY?: number;
  shadesX?: number;
  shadesRotate?: number;
  shadesOn?: boolean;
  eyes?: Eyes;
  pupilX?: number;
  pupilY?: number;
  brows?: Brows;
  mouth?: Mouth;
  blush?: number;
  /** arm angles in degrees: 0 = hanging straight down, 90 = straight out sideways, 180 = straight up, >180 swings inward */
  leftArm?: number;
  rightArm?: number;
  leftArmLength?: number;
  rightArmLength?: number;
  /** leg splay in degrees (positive = wider) */
  legs?: number;
  /** extra drawings in the mascot's own coordinate space (effects that move with the body) */
  children?: React.ReactNode;
  /** effects that stay put while the body moves */
  fixed?: React.ReactNode;
  /** effects drawn behind the body (glows, backdrops), not moving with it */
  behind?: React.ReactNode;
};

const BACKS: Record<Exclude<Back, "classic">, { frame: string; field: string; line: string }> = {
  navy: { frame: "#1e2a4a", field: "#2b3d68", line: "#f3e6c8" },
  red: { frame: "#6e1f1a", field: "#b23a2f", line: "#f6e3cf" },
  kraft: { frame: "#8a6a45", field: "#c9a57a", line: "#fbf1de" },
  charcoal: { frame: "#1c1c1f", field: "#34353a", line: "#d9d6cf" },
};

export const starPath = (cx: number, cy: number, R: number, r: number, points = 5) =>
  Array.from({ length: points * 2 }, (_, i) => {
    const a = (Math.PI / points) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    return `${i === 0 ? "M" : "L"}${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`;
  }).join(" ") + " Z";

const CardBack: React.FC<{ id: string; back: Back }> = ({ id, back }) => {
  if (back !== "classic") {
    const b = BACKS[back];
    return (
      <g>
        <rect x={8} y={10} width={180} height={252} rx={14} fill="#000" opacity={0.18} />
        <rect x={0} y={0} width={180} height={252} rx={14} fill={b.frame} stroke={INK} strokeWidth={5} />
        <rect x={12} y={12} width={156} height={228} rx={9} fill={b.field} />
        <rect x={22} y={22} width={136} height={208} rx={6} fill="none" stroke={b.line} strokeWidth={2.5} strokeOpacity={0.8} />
      </g>
    );
  }
  return (
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
      <circle cx={90} cy={194} r={27} fill={GOLD} stroke={INK} strokeWidth={4} />
      <path d={starPath(90, 195, 15, 6.5)} fill={ACCENT} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
};

export const PixelShades: React.FC<{ x: number; y: number; rotate?: number; px?: number }> = ({ x, y, rotate = 0, px = 7 }) => {
  // 16x4 pixel pattern: 1 = black, 2 = white highlight, 0 = empty
  const rows = ["1111111111111111", "0112211001122110", "0111111001111110", "0011110000111100"];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate} ${8 * px} ${2 * px})`}>
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

export const armTip = (sx: number, sy: number, deg: number, len: number, side: -1 | 1): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [sx + side * len * Math.sin(a), sy + len * Math.cos(a)];
};

const Arm: React.FC<{ from: [number, number]; to: [number, number] }> = ({ from, to }) => (
  <g>
    <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <circle cx={to[0]} cy={to[1]} r={7} fill={PAPER} stroke={INK} strokeWidth={4} />
  </g>
);

const EYE_L: [number, number] = [64, 66];
const EYE_R: [number, number] = [116, 66];

const EyesView: React.FC<{ eyes: Eyes; px: number; py: number; face: string }> = ({ eyes, px, py, face }) => {
  if (eyes === "none") return null;
  return (
    <g>
      {[EYE_L, EYE_R].map(([cx, cy], i) =>
        eyes === "closed" ? (
          <path key={i} d={`M${cx - 9} ${cy} Q${cx} ${cy + 6} ${cx + 9} ${cy}`} stroke={face} strokeWidth={4} fill="none" strokeLinecap="round" />
        ) : eyes === "x" ? (
          <path key={i} d={`M${cx - 8} ${cy - 8} L${cx + 8} ${cy + 8} M${cx + 8} ${cy - 8} L${cx - 8} ${cy + 8}`} stroke={face} strokeWidth={4.5} strokeLinecap="round" />
        ) : eyes === "star" ? (
          <path key={i} d={starPath(cx, cy, 13, 5.5)} fill={GOLD} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        ) : eyes === "happy" ? (
          <path key={i} d={`M${cx - 9} ${cy + 3} Q${cx} ${cy - 8} ${cx + 9} ${cy + 3}`} stroke={face} strokeWidth={4} fill="none" strokeLinecap="round" />
        ) : (
          <g key={i}>
            <circle cx={cx} cy={cy} r={eyes === "wide" ? 12 : 8} fill={PAPER} stroke={INK} strokeWidth={3} />
            <circle cx={cx + 2 + px} cy={cy + 1 + py} r={eyes === "wide" ? 3 : 3.5} fill={INK} />
          </g>
        ),
      )}
    </g>
  );
};

// Brows sit above the sunglasses, so the mascot can emote with its shades on.
const BrowsView: React.FC<{ brows: Brows; y: number; face: string }> = ({ brows, y, face }) => {
  if (brows === "none") return null;
  const L = (d: string) => <path d={d} stroke={face} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
  switch (brows) {
    case "raised":
      return <g>{L(`M48 ${y + 2} L74 ${y + 2}`)}{L(`M104 ${y - 4} Q116 ${y - 12} 130 ${y - 6}`)}</g>;
    case "up":
      return <g>{L(`M48 ${y - 4} Q61 ${y - 12} 74 ${y - 6}`)}{L(`M106 ${y - 6} Q119 ${y - 12} 132 ${y - 4}`)}</g>;
    case "angry":
      return <g>{L(`M50 ${y - 6} L74 ${y + 2}`)}{L(`M106 ${y + 2} L130 ${y - 6}`)}</g>;
    case "sad":
      return <g>{L(`M50 ${y + 2} L74 ${y - 6}`)}{L(`M106 ${y - 6} L130 ${y + 2}`)}</g>;
  }
};

const MouthView: React.FC<{ mouth: Mouth; face: string }> = ({ mouth, face }) => {
  const dark = "#2a0f0c";
  switch (mouth) {
    case "smile":
      return <path d="M66 118 Q91 140 116 116" stroke={face} strokeWidth={5} fill="none" strokeLinecap="round" />;
    case "grin":
      return <path d="M64 114 Q91 148 118 114 Z" fill={dark} stroke={face} strokeWidth={4.5} strokeLinejoin="round" />;
    case "open":
      return (
        <g>
          <path d="M62 112 Q91 160 120 112 Z" fill={dark} stroke={face} strokeWidth={4.5} strokeLinejoin="round" />
          <path d="M78 136 Q91 146 104 136" stroke="#e5796c" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case "o":
      return <ellipse cx={91} cy={126} rx={9} ry={11} fill={dark} stroke={face} strokeWidth={4} />;
    case "flat":
      return <path d="M74 126 L108 126" stroke={face} strokeWidth={5} strokeLinecap="round" />;
    case "wavy":
      return <path d="M68 124 Q80 132 92 124 Q104 116 114 124" stroke={face} strokeWidth={5} fill="none" strokeLinecap="round" />;
    case "frown":
      return <path d="M68 132 Q91 112 114 132" stroke={face} strokeWidth={5} fill="none" strokeLinecap="round" />;
    case "teeth":
      return (
        <g>
          <rect x={64} y={114} width={54} height={18} rx={5} fill={PAPER} stroke={INK} strokeWidth={3.5} />
          <path d="M64 123 L118 123 M77 114 L77 132 M91 114 L91 132 M105 114 L105 132" stroke={INK} strokeWidth={2} />
        </g>
      );
    case "chew":
      return <ellipse cx={91} cy={124} rx={7} ry={4} fill={dark} stroke={face} strokeWidth={3.5} />;
  }
};

export const MascotRig: React.FC<RigProps> = ({
  id = "m",
  back = MASCOT_BACK,
  scale = 1,
  x = 0,
  y = 0,
  rotate = 0,
  squash = 1,
  spin = 0,
  grow = 1,
  flip = false,
  opacity = 1,
  shadesY = 56,
  shadesX = 0,
  shadesRotate = 0,
  shadesOn = true,
  eyes = "none",
  pupilX = 0,
  pupilY = 0,
  brows = "none",
  mouth = "smile",
  blush = 0,
  leftArm = 45,
  rightArm = 45,
  leftArmLength = 50,
  rightArmLength = 50,
  legs = 0,
  children,
  fixed,
  behind,
}) => {
  const face = back === "kraft" ? INK : PAPER;
  const sx = 1 / Math.sqrt(squash);
  const lTip = armTip(0, 150, leftArm, leftArmLength, -1);
  const rTip = armTip(180, 150, rightArm, rightArmLength, 1);
  return (
    <svg width={300 * scale} height={360 * scale} viewBox="-60 -40 300 360" style={{ overflow: "visible" }}>
      {behind}
      <g
        opacity={opacity}
        transform={`translate(${x} ${y}) rotate(${rotate} 90 300) translate(90 300) scale(${sx * grow * (flip ? -1 : 1)} ${squash * grow}) translate(-90 -300) rotate(${spin} 90 126)`}
      >
        <line x1={60} y1={250} x2={50 - legs} y2={300} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={120} y1={250} x2={132 + legs} y2={300} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <CardBack id={id} back={back} />
        {blush > 0 && (
          <g opacity={blush}>
            <ellipse cx={46} cy={104} rx={11} ry={6} fill="#f39a9a" />
            <ellipse cx={136} cy={104} rx={11} ry={6} fill="#f39a9a" />
          </g>
        )}
        <EyesView eyes={eyes} px={pupilX} py={pupilY} face={face} />
        <BrowsView brows={brows} y={shadesOn ? Math.min(44, shadesY - 10) : 44} face={face} />
        {shadesOn && <PixelShades x={34 + shadesX} y={shadesY} rotate={shadesRotate} />}
        <MouthView mouth={mouth} face={face} />
        <Arm from={[0, 150]} to={lTip} />
        <Arm from={[180, 150]} to={rTip} />
        {children}
      </g>
      {fixed}
    </svg>
  );
};

// ---------- small effects, drawn in the mascot's coordinate space ----------

export const MotionLines: React.FC<{ x: number; y: number; opacity?: number; color?: string }> = ({ x, y, opacity = 1, color = ACCENT }) => (
  <g stroke={color} strokeWidth={4} strokeLinecap="round" opacity={opacity}>
    <line x1={x - 50} y1={y - 8} x2={x - 50} y2={y + 8} />
    <line x1={x} y1={y - 14} x2={x} y2={y + 6} />
    <line x1={x + 50} y1={y - 8} x2={x + 50} y2={y + 8} />
  </g>
);

export const Sparkle: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = "#fff" }) =>
  s <= 0 ? null : (
    <path d={starPath(x, y, 16 * s, 3.5 * s, 4)} fill={color} stroke={INK} strokeWidth={1.5} />
  );

export const Bubble: React.FC<{ x: number; y: number; s: number; text: string; color?: string; size?: number }> = ({
  x,
  y,
  s,
  text,
  color = ACCENT,
  size = 64,
}) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <text
        x={0}
        y={0}
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize={size}
        fill={color}
        stroke={INK}
        strokeWidth={3}
        paintOrder="stroke"
      >
        {text}
      </text>
    </g>
  );

export const Drop: React.FC<{ x: number; y: number; opacity?: number; color?: string }> = ({ x, y, opacity = 1, color = "#8fd3f4" }) => (
  <path d={`M${x} ${y - 14} Q${x + 9} ${y} ${x} ${y + 6} Q${x - 9} ${y} ${x} ${y - 14} Z`} fill={color} stroke={INK} strokeWidth={2.5} opacity={opacity} />
);

export const Heart: React.FC<{ x: number; y: number; s: number; opacity?: number }> = ({ x, y, s, opacity = 1 }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 6 C -14 -6, -8 -18, 0 -9 C 8 -18, 14 -6, 0 6 Z"
    fill="#ef5b6b"
    stroke={INK}
    strokeWidth={2}
    opacity={opacity}
  />
);

export const Stamp: React.FC<{ x: number; y: number; s: number; kind: "tick" | "cross" }> = ({ x, y, s, kind }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-10)`}>
      <circle cx={0} cy={0} r={30} fill={PAPER} stroke={kind === "tick" ? "#1f7a3a" : ACCENT} strokeWidth={5} />
      {kind === "tick" ? (
        <path d="M-14 0 L-4 11 L15 -12" stroke="#1f7a3a" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M-12 -12 L12 12 M12 -12 L-12 12" stroke={ACCENT} strokeWidth={7} strokeLinecap="round" />
      )}
    </g>
  );
