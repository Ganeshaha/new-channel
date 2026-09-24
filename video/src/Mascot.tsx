import React from "react";
import { AbsoluteFill } from "remotion";
import { ACCENT, Back, GOLD, INK, MascotRig, MotionLines, PAPER, RigProps, Sparkle } from "./mascot/Rig";

// Static poses and brand stills for the Wild Card Commander mascot. All drawing lives in ./mascot/Rig.tsx;
// animations live in ./mascot/animations.tsx.

export { MASCOT_BACK } from "./mascot/Rig";
export type Pose = "cool" | "checking" | "verdict" | "shrug" | "point";

const POSES: Record<Pose, RigProps> = {
  cool: { rotate: -5, leftArm: 48, rightArm: 48 },
  checking: { shadesY: 84, eyes: "open", brows: "raised", mouth: "flat", rightArm: 214 },
  verdict: { shadesY: -8, rotate: 4, rightArm: 134, rightArmLength: 59, children: <MotionLines x={90} y={-26} /> },
  shrug: { rotate: -2, leftArm: 136, rightArm: 135, leftArmLength: 58, rightArmLength: 58, mouth: "wavy", brows: "raised" },
  point: { rotate: 3, rightArm: 96, rightArmLength: 70, mouth: "grin" },
};

/** pressAngle: swings the left arm out to press a button on the left (degrees; 0 = straight left). */
export const WildCardMascot: React.FC<{ pose?: Pose; scale?: number; pressAngle?: number; id?: string; back?: Back }> = ({
  pose = "cool",
  scale = 1,
  pressAngle,
  id = "m",
  back,
}) => {
  const p = POSES[pose];
  return (
    <MascotRig
      {...p}
      id={id}
      scale={scale}
      back={back}
      {...(pressAngle !== undefined ? { leftArm: 90 + pressAngle, leftArmLength: 80 } : {})}
    />
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

export const BackOptions: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center", gap: 30 }}>
    <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 54, color: INK }}>Card back options</div>
    <div style={{ display: "flex", gap: 60, alignItems: "flex-end" }}>
      {(["classic", "navy", "red", "kraft", "charcoal"] as Back[]).map((b) => (
        <div key={b} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <WildCardMascot pose="cool" back={b} id={`opt-${b}`} />
          <div style={{ fontFamily: HAND, fontSize: 34, color: INK }}>{b}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

/**
 * 800x800 YouTube profile picture. YouTube crops to a circle and shows it as small as ~36px,
 * so: one character, big, high contrast, a dark ring so it separates from both light and dark themes.
 */
export const ProfilePicture: React.FC = () => (
  <AbsoluteFill style={{ background: GOLD }}>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #f8dc84 0%, #e8c25c 45%, #cf9f34 100%)" }} />
    <svg width={800} height={800} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 14 }, (_, i) => {
        const a0 = (i / 14) * Math.PI * 2;
        const a1 = a0 + Math.PI / 14;
        const R = 600;
        return (
          <path key={i} d={`M400 340 L${400 + R * Math.cos(a0)} ${340 + R * Math.sin(a0)} L${400 + R * Math.cos(a1)} ${340 + R * Math.sin(a1)} Z`} fill="#fff" opacity={0.1} />
        );
      })}
      <circle cx={400} cy={400} r={382} fill="none" stroke="#6e1f1a" strokeWidth={18} />
    </svg>
    <div style={{ position: "absolute", left: 55, top: -2 }}>
      <MascotRig id="pfp" scale={2.3} rotate={-6} leftArm={52} rightArm={52} mouth="grin">
        <Sparkle x={136} y={58} s={1} />
      </MascotRig>
    </div>
  </AbsoluteFill>
);

/** 2560x1440 channel banner. Everything important sits in the 1546x423 centre safe area. */
export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: "#3d1411" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #7a2a22 0%, #551b16 55%, #2e0f0c 100%)" }} />
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
