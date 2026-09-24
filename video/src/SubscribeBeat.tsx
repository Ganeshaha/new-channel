import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

// A short, transparent "subscribe" overlay. It plays over the video while the narration continues,
// so it never stops the story. Placement rules live in /RETENTION.md: once, right after the first payoff.

export const subscribeBeatSchema = z.object({
  line: z.string(),
  accent: z.string(),
  background: z.string().nullable(),
});

type Props = z.infer<typeof subscribeBeatSchema>;

const PAPER = "#fbf8f1";
const INK = "#1d1b19";
const HAND = '"Segoe Print", "Comic Neue", "Comic Sans MS", cursive';

// Placeholder mascot: an original paper-cut card with a face and stick arms. Swap for the channel mascot.
const CardMascot: React.FC<{ press: number; blink: boolean }> = ({ press, blink }) => {
  // Negative angles lower the arm; 0 points it straight at the button.
  const armAngle = interpolate(press, [0, 1], [-50, 8]);
  return (
    <svg width={210} height={260} viewBox="0 0 210 260" style={{ overflow: "visible" }}>
      <g transform="rotate(-6 105 130)">
        <rect x={40} y={20} width={130} height={180} rx={12} fill="#000" opacity={0.18} transform="translate(6 8)" />
        <rect x={40} y={20} width={130} height={180} rx={12} fill={PAPER} stroke={INK} strokeWidth={5} />
        <rect x={55} y={36} width={100} height={70} rx={6} fill="#cfe3ef" stroke={INK} strokeWidth={3} />
        <circle cx={82} cy={70} r={blink ? 1 : 7} fill={INK} />
        <circle cx={128} cy={70} r={blink ? 1 : 7} fill={INK} />
        <path d="M88 88 Q105 100 122 88" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
        <rect x={55} y={116} width={100} height={8} rx={4} fill={INK} opacity={0.25} />
        <rect x={55} y={134} width={80} height={8} rx={4} fill={INK} opacity={0.25} />
        <rect x={55} y={152} width={90} height={8} rx={4} fill={INK} opacity={0.25} />
        {/* resting right arm */}
        <line x1={170} y1={130} x2={198} y2={165} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        {/* pressing left arm: pivots at the card's left edge and swings up to the button */}
        <g transform={`rotate(${armAngle} 40 125)`}>
          <line x1={40} y1={125} x2={-38} y2={125} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <circle cx={-40} cy={125} r={7} fill={PAPER} stroke={INK} strokeWidth={4} />
        </g>
        <line x1={85} y1={200} x2={78} y2={245} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <line x1={125} y1={200} x2={132} y2={245} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      </g>
    </svg>
  );
};

const Bell: React.FC<{ wiggle: number }> = ({ wiggle }) => (
  <svg width={70} height={70} viewBox="0 0 70 70" style={{ transform: `rotate(${wiggle}deg)`, transformOrigin: "35px 8px" }}>
    <path d="M35 8 C20 8 16 22 16 34 L10 48 L60 48 L54 34 C54 22 50 8 35 8 Z" fill="#f2c14e" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={35} cy={56} r={6} fill={INK} />
  </svg>
);

export const SubscribeBeat: React.FC<Props> = ({ line, accent, background }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const exit = interpolate(frame, [durationInFrames - 14, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const slide = interpolate(enter, [0, 1], [520, 0]) + exit * 560;

  const pressAt = Math.round(fps * 1.4);
  const press = spring({ frame: frame - pressAt, fps, config: { damping: 9, stiffness: 180 } });
  const pressed = frame >= pressAt + 4;
  const squash = pressed ? interpolate(frame, [pressAt + 4, pressAt + 10], [0.9, 1], { extrapolateRight: "clamp" }) : 1;
  const wiggle = pressed ? Math.sin((frame - pressAt) / 2.2) * 18 * Math.max(0, 1 - (frame - pressAt) / (fps * 1.2)) : 0;
  const lineIn = interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: background ?? "transparent" }}>
      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: 60,
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          transform: `translateX(${slide}px)`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, marginBottom: 70 }}>
          <div
            style={{
              fontFamily: HAND,
              fontSize: 34,
              color: INK,
              background: PAPER,
              padding: "10px 18px",
              border: `3px solid ${INK}`,
              borderRadius: 10,
              transform: "rotate(-2deg)",
              boxShadow: "5px 6px 0 rgba(0,0,0,0.18)",
              opacity: lineIn,
              maxWidth: 560,
              textAlign: "right",
            }}
          >
            {line}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Bell wiggle={wiggle} />
            <div
              style={{
                fontFamily: "Arial Black, Arial, sans-serif",
                fontSize: 40,
                letterSpacing: 1,
                color: pressed ? INK : "#fff",
                background: pressed ? "#d9d4c7" : accent,
                border: `4px solid ${INK}`,
                borderRadius: 12,
                padding: "12px 26px",
                transform: `scale(${squash}) rotate(1.5deg)`,
                boxShadow: pressed ? "2px 2px 0 rgba(0,0,0,0.25)" : "6px 7px 0 rgba(0,0,0,0.25)",
              }}
            >
              {pressed ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
            </div>
          </div>
        </div>
        <CardMascot press={press} blink={frame % 70 > 64} />
      </div>
    </AbsoluteFill>
  );
};
