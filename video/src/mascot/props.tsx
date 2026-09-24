import React from "react";
import { ACCENT, GOLD, INK, PAPER, starPath } from "./Rig";

// Original props for mascot animations (all simple shapes; no real card faces, logos or symbols).

const RED = "#b23a2f";
const RED_DARK = "#6e1f1a";

type XY = { x: number; y: number };
const tf = (x: number, y: number, rot = 0, s = 1) => `translate(${x} ${y}) rotate(${rot}) scale(${s})`;

/** Mini card: the mascot's own red back, or a generic face (white frame, gold art box, text lines). */
export const MiniCard: React.FC<XY & { rot?: number; s?: number; face?: boolean; o?: number }> = ({ x, y, rot = 0, s = 1, face = false, o = 1 }) => (
  <g transform={tf(x, y, rot, s)} opacity={o}>
    {face ? (
      <g>
        <rect x={-13} y={-18} width={26} height={36} rx={3} fill={PAPER} stroke={INK} strokeWidth={2} />
        <rect x={-10} y={-14} width={20} height={14} rx={1.5} fill={GOLD} stroke={INK} strokeWidth={1.2} />
        <path d={starPath(0, -7, 5, 2)} fill={ACCENT} />
        <path d="M-9 4 H9 M-9 8 H9 M-9 12 H4" stroke={INK} strokeWidth={1.2} />
      </g>
    ) : (
      <g>
        <rect x={-13} y={-18} width={26} height={36} rx={3} fill={RED_DARK} stroke={INK} strokeWidth={2} />
        <rect x={-10} y={-15} width={20} height={30} rx={2} fill={RED} />
        <rect x={-7.5} y={-12.5} width={15} height={25} rx={1.5} fill="none" stroke="#f6e3cf" strokeWidth={1} />
      </g>
    )}
  </g>
);

export const D20: React.FC<XY & { rot?: number; s?: number; num: string; color?: string }> = ({ x, y, rot = 0, s = 1, num, color = "#4a6aa0" }) => {
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${(24 * Math.cos(a)).toFixed(1)},${(24 * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return (
    <g transform={tf(x, y, rot, s)}>
      <polygon points={hex} fill={color} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <polygon points="0,-14 13,8 -13,8" fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={2} />
      <text x={0} y={6} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize={num.length > 1 ? 13 : 15} fill="#fff">
        {num}
      </text>
    </g>
  );
};

export const Coin: React.FC<XY & { sx: number; s?: number }> = ({ x, y, sx, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * Math.max(0.08, Math.abs(sx))} ${s})`}>
    <circle r={18} fill={GOLD} stroke={INK} strokeWidth={3} />
    <circle r={12} fill="none" stroke="#fff4d6" strokeWidth={2} />
    {sx > 0 && <path d={starPath(0, 1, 8, 3.4)} fill={ACCENT} />}
  </g>
);

export const Gem: React.FC<XY & { color: string; s?: number; rot?: number }> = ({ x, y, color, s = 1, rot = 0 }) => (
  <g transform={tf(x, y, rot, s)}>
    <polygon points="0,-16 12,0 0,16 -12,0" fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    <polygon points="0,-10 5,-2 -5,-2" fill="#fff" opacity={0.55} />
  </g>
);

export const Shield: React.FC<XY & { s: number; text: string }> = ({ x, y, s, text }) =>
  s <= 0 ? null : (
    <g transform={tf(x, y, 0, s)}>
      <circle r={50} fill="#bfe3f7" fillOpacity={0.85} stroke={INK} strokeWidth={4} />
      <circle r={40} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="6 6" />
      <text x={0} y={9} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize={26} fill={INK}>
        {text}
      </text>
    </g>
  );

export const Broom: React.FC<XY & { rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={tf(x, y, rot)}>
    <line x1={0} y1={-110} x2={0} y2={0} stroke="#8a5a2b" strokeWidth={7} strokeLinecap="round" />
    <path d="M-10 0 L10 0 L24 40 L-24 40 Z" fill="#e2b85c" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-14 12 L14 12" stroke="#a9772e" strokeWidth={4} />
  </g>
);

export const Poof: React.FC<XY & { s: number; o?: number }> = ({ x, y, s, o = 1 }) =>
  s <= 0 ? null : (
    <g transform={tf(x, y, 0, s)} opacity={o}>
      {[
        [-16, 4, 16],
        [0, -8, 20],
        [18, 4, 15],
        [4, 10, 16],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#ece6da" stroke={INK} strokeWidth={2.5} />
      ))}
    </g>
  );

export const InfinitySym: React.FC<XY & { s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={tf(x, y, rot, s)}>
    <path d="M0 0 C -12 -22, -46 -22, -46 0 C -46 22, -12 22, 0 0 C 12 -22, 46 -22, 46 0 C 46 22, 12 22, 0 0 Z" fill="none" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
    <path d="M0 0 C -12 -22, -46 -22, -46 0 C -46 22, -12 22, 0 0 C 12 -22, 46 -22, 46 0 C 46 22, 12 22, 0 0 Z" fill="none" stroke={GOLD} strokeWidth={6} strokeLinejoin="round" />
  </g>
);

export const Tombstone: React.FC<XY & { s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={tf(x, y, 0, s)} opacity={o}>
    <path d="M-40 0 L-40 -70 Q-40 -110 0 -110 Q40 -110 40 -70 L40 0 Z" fill="#9aa0a6" stroke={INK} strokeWidth={4} />
    <text x={0} y={-58} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize={24} fill="#3b3f44">
      RIP
    </text>
    <path d="M-22 -34 H22 M-22 -24 H14" stroke="#3b3f44" strokeWidth={3} />
    <ellipse cx={0} cy={2} rx={58} ry={10} fill="#6b4a2e" stroke={INK} strokeWidth={3} />
  </g>
);

export const Shaker: React.FC<XY & { rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={tf(x, y, rot)}>
    <rect x={-14} y={-18} width={28} height={40} rx={6} fill="#fff" stroke={INK} strokeWidth={3} />
    <rect x={-14} y={-28} width={28} height={12} rx={4} fill="#b7bcc2" stroke={INK} strokeWidth={3} />
    <circle cx={-6} cy={-22} r={1.6} fill={INK} />
    <circle cx={0} cy={-22} r={1.6} fill={INK} />
    <circle cx={6} cy={-22} r={1.6} fill={INK} />
    <text x={0} y={8} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize={10} fill={INK}>
      SALT
    </text>
  </g>
);

export const Table: React.FC<XY & { rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={tf(x, y, rot)}>
    <rect x={-130} y={-12} width={260} height={24} rx={6} fill="#a86d3c" stroke={INK} strokeWidth={4} />
    <rect x={-116} y={12} width={14} height={54} fill="#8a5a2b" stroke={INK} strokeWidth={3} />
    <rect x={102} y={12} width={14} height={54} fill="#8a5a2b" stroke={INK} strokeWidth={3} />
  </g>
);

export const LifeCounter: React.FC<XY & { n: number; shake?: number }> = ({ x, y, n, shake = 0 }) => (
  <g transform={`translate(${x + shake} ${y})`}>
    <rect x={-46} y={-34} width={92} height={68} rx={12} fill={PAPER} stroke={INK} strokeWidth={4} />
    <text x={0} y={16} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize={42} fill={n <= 10 ? ACCENT : INK}>
      {n}
    </text>
  </g>
);

export const ThumbsUp: React.FC<XY & { s: number }> = ({ x, y, s }) =>
  s <= 0 ? null : (
    <g transform={tf(x, y, 0, s)}>
      <circle r={44} fill="#3d7cc9" stroke={INK} strokeWidth={4} />
      <path
        d="M-20 -2 L-8 -2 L2 -26 Q12 -30 12 -18 L8 -6 L22 -6 Q30 -6 28 2 L24 20 Q22 26 14 26 L-8 26 L-8 -2"
        fill="#fff"
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <rect x={-22} y={-4} width={12} height={32} rx={2} fill="#fff" stroke={INK} strokeWidth={3} />
    </g>
  );

export const BellIcon: React.FC<XY & { rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={tf(x, y, rot, s)}>
    <path d="M0 -26 C-18 -26 -22 -8 -22 6 L-30 20 L30 20 L22 6 C22 -8 18 -26 0 -26 Z" fill={GOLD} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={0} cy={28} r={7} fill={INK} />
    <circle cx={0} cy={-30} r={5} fill={GOLD} stroke={INK} strokeWidth={3} />
  </g>
);

export const ChatBubble: React.FC<XY & { s: number; dots: number; lines: number }> = ({ x, y, s, dots, lines }) =>
  s <= 0 ? null : (
    <g transform={tf(x, y, 0, s)}>
      <path d="M-70 -40 H70 Q84 -40 84 -26 V20 Q84 34 70 34 H-30 L-52 54 L-46 34 H-70 Q-84 34 -84 20 V-26 Q-84 -40 -70 -40 Z" fill={PAPER} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {lines === 0
        ? [0, 1, 2].map((i) => <circle key={i} cx={-24 + i * 24} cy={-4} r={8} fill={INK} opacity={dots === i ? 1 : 0.3} />)
        : [0, 1, 2].slice(0, lines).map((i) => <rect key={i} x={-60} y={-26 + i * 18} width={i === 2 ? 70 : 120} height={9} rx={4} fill={INK} opacity={0.75} />)}
    </g>
  );

export const VideoThumb: React.FC<XY & { s: number }> = ({ x, y, s }) =>
  s <= 0 ? null : (
    <g transform={tf(x, y, -4, s)}>
      <rect x={-64} y={-38} width={128} height={76} rx={8} fill="#2b3d68" stroke={INK} strokeWidth={4} />
      <rect x={-64} y={24} width={90} height={6} fill={ACCENT} />
      <circle cx={0} cy={-4} r={20} fill={ACCENT} stroke={INK} strokeWidth={3} />
      <path d="M-6 -14 L12 -4 L-6 6 Z" fill="#fff" />
    </g>
  );

export const Spinner: React.FC<XY & { rot: number }> = ({ x, y, rot }) => (
  <g transform={tf(x, y, rot)}>
    {Array.from({ length: 8 }, (_, i) => {
      const a = (Math.PI / 4) * i;
      return <circle key={i} cx={30 * Math.cos(a)} cy={30 * Math.sin(a)} r={7} fill={INK} opacity={0.15 + (i / 8) * 0.85} />;
    })}
  </g>
);

export const Brain: React.FC<XY & { s: number; hue?: string; glow?: number }> = ({ x, y, s, hue = "#f2a3b3", glow = 0 }) =>
  s <= 0 ? null : (
    <g transform={tf(x, y, 0, s)}>
      {glow > 0 &&
        Array.from({ length: 12 }, (_, i) => {
          const a = (Math.PI / 6) * i;
          return <line key={i} x1={48 * Math.cos(a)} y1={40 * Math.sin(a)} x2={(48 + 30 * glow) * Math.cos(a)} y2={(40 + 30 * glow) * Math.sin(a)} stroke={GOLD} strokeWidth={5} strokeLinecap="round" />;
        })}
      <path
        d="M-44 8 C-58 -6 -46 -34 -24 -32 C-20 -48 4 -50 10 -38 C24 -50 50 -38 44 -18 C60 -8 54 22 32 22 C26 36 -2 38 -8 26 C-26 38 -52 28 -44 8 Z"
        fill={hue}
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M-24 -14 Q-14 -4 -26 6 M4 -30 Q-4 -16 8 -4 Q18 6 6 18 M24 -18 Q34 -6 26 8" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
    </g>
  );

export const Cup: React.FC<XY & { rot?: number; steam?: number }> = ({ x, y, rot = 0, steam = 0 }) => (
  <g transform={tf(x, y, rot)}>
    {[0, 1].map((i) => (
      <path
        key={i}
        d={`M${-6 + i * 12} ${-22 - (steam % 20)} q6 -8 0 -16 q-6 -8 0 -16`}
        stroke="#bbb"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
    ))}
    <path d="M-16 -16 H16 L12 14 Q12 18 8 18 H-8 Q-12 18 -12 14 Z" fill="#fff" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <path d="M16 -8 Q28 -8 26 2 Q24 10 13 8" fill="none" stroke={INK} strokeWidth={3} />
    <rect x={-13} y={-14} width={26} height={6} fill="#b5763a" opacity={0.8} />
  </g>
);

export const PopcornBox: React.FC<XY> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    {[-14, -4, 6, 16, -9, 11, 1].map((cx, i) => (
      <circle key={i} cx={cx} cy={-22 - (i % 3) * 6} r={8} fill="#fff6d8" stroke={INK} strokeWidth={2} />
    ))}
    <path d="M-24 -20 H24 L18 26 H-18 Z" fill="#fff" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-12 -20 L-9 26 M0 -20 V26 M12 -20 L9 26" stroke={ACCENT} strokeWidth={6} />
  </g>
);

export const Kernel: React.FC<XY & { o?: number }> = ({ x, y, o = 1 }) => <circle cx={x} cy={y} r={6} fill="#fff6d8" stroke={INK} strokeWidth={2} opacity={o} />;

export const Printer: React.FC<XY & { shake?: number }> = ({ x, y, shake = 0 }) => (
  <g transform={`translate(${x + shake} ${y})`}>
    <rect x={-50} y={-40} width={100} height={70} rx={10} fill="#9aa0a6" stroke={INK} strokeWidth={4} />
    <rect x={-36} y={-56} width={72} height={20} rx={4} fill="#fff" stroke={INK} strokeWidth={3} />
    <rect x={-40} y={2} width={80} height={10} rx={3} fill={INK} />
    <circle cx={34} cy={-24} r={5} fill="#5fd068" stroke={INK} strokeWidth={2} />
  </g>
);

export const Keyboard: React.FC<XY> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-80} y={-16} width={160} height={32} rx={6} fill="#3a3a3f" stroke={INK} strokeWidth={3} />
    {Array.from({ length: 16 }, (_, i) => (
      <rect key={i} x={-72 + (i % 8) * 18} y={-10 + Math.floor(i / 8) * 12} width={14} height={9} rx={2} fill="#6c6c74" />
    ))}
  </g>
);

export const Arrow: React.FC<XY & { rot?: number; s?: number; color?: string }> = ({ x, y, rot = 0, s = 1, color = GOLD }) => (
  <g transform={tf(x, y, rot, s)}>
    <path d="M-10 -34 H10 V4 H24 L0 34 L-24 4 H-10 Z" fill={color} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  </g>
);
