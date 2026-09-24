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
import { WildCardMascot } from "./Mascot";

// A short, transparent "subscribe" overlay featuring the Wild Card Commander mascot. It plays over the video while the narration continues,
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, marginBottom: 128 }}>
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
        <WildCardMascot pose="cool" pressAngle={interpolate(press, [0, 1], [-60, 2])} id="sb" />
      </div>
    </AbsoluteFill>
  );
};
