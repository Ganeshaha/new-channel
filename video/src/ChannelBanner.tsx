import React from "react";
import { AbsoluteFill } from "remotion";
import { ACCENT, Back, GOLD, INK, MascotRig, PAPER, Sparkle } from "./mascot/Rig";
import { D20, Gem, InfinitySym, LifeCounter } from "./mascot/props";

/**
 * YouTube channel banner, 2560x1440, in the episode style (white paper, original drawings, solid outlined type).
 * YouTube crops it per device:
 *   - TV: the full 2560x1440
 *   - desktop: a 2560x423 strip through the middle (y 508-931)
 *   - phone / safe area: the centre 1546x423 (x 507-2053, y 508-931)
 * Everything that must be read (name, Wil, tagline, promise) sits in the safe area; the friends and props
 * outside it are decoration that desktop and TV viewers get as a bonus.
 * `guides` draws the crop boxes for checking.
 */
const BLOCK = '"Arial Black", Arial, sans-serif';
const HAND = '"Segoe Print", "Comic Sans MS", cursive';
const SAFE = { x: 507, y: 508, w: 1546, h: 423 };

/** One of Wil's card-back friends (no shades), reacting. */
const Pal: React.FC<{ x: number; y: number; back: Back; scale: number; rot?: number; mouth: "o" | "grin" | "open"; brows: "up" | "raised"; arms: [number, number]; flip?: boolean }> = ({
  x, y, back, scale, rot = 0, mouth, brows, arms, flip = false,
}) => (
  <div style={{ position: "absolute", left: x - 150 * scale, top: y - 180 * scale }}>
    <MascotRig id={`pal-${back}-${x}`} back={back} scale={scale} rotate={rot} flip={flip} shadesOn={false} eyes="wide" mouth={mouth} brows={brows} leftArm={arms[0]} rightArm={arms[1]} />
  </div>
);

/** Speech bubble with a tail pointing down-left or down-right. */
const Bubble: React.FC<{ x: number; y: number; text: string; tail: "left" | "right"; rot?: number }> = ({ x, y, text, tail, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)` }}>
    <div style={{ position: "relative", fontFamily: BLOCK, fontSize: 30, color: INK, background: "#fff", border: `5px solid ${INK}`, borderRadius: 22, padding: "10px 22px", whiteSpace: "nowrap", boxShadow: "6px 7px 0 rgba(0,0,0,0.16)" }}>
      {text}
      <div style={{ position: "absolute", bottom: -24, [tail]: 36, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: `26px solid ${INK}` }} />
      <div style={{ position: "absolute", bottom: -15, [tail]: 42, width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "18px solid #fff" }} />
    </div>
  </div>
);

const Chip: React.FC<{ text: string; bg: string; color: string; rot: number }> = ({ text, bg, color, rot }) => (
  <div
    style={{
      fontFamily: BLOCK,
      fontSize: 30,
      color,
      background: bg,
      border: `5px solid ${INK}`,
      borderRadius: 12,
      padding: "6px 22px",
      boxShadow: "6px 7px 0 rgba(0,0,0,0.18)",
      transform: `rotate(${rot}deg)`,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

const outline = (px: number) => ({
  WebkitTextStroke: `${px}px ${INK}`,
  paintOrder: "stroke fill" as const,
});

export const ChannelBanner: React.FC<{ guides?: boolean }> = ({ guides = false }) => (
  <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
    <AbsoluteFill
      style={{ background: "radial-gradient(ellipse at 50% 50%, #ffffff 0%, #fbf8f1 45%, #efe8d8 100%)" }}
    />

    {/* decoration at both ends of the desktop strip (outside the phone-safe area): Wil's friends reacting */}
    <Pal x={200} y={725} back="navy" scale={1.0} rot={-6} mouth="o" brows="up" arms={[150, 30]} />
    <Pal x={400} y={770} back="kraft" scale={0.8} rot={5} mouth="open" brows="raised" arms={[40, 160]} />
    <Bubble x={290} y={545} text="IT DOES WHAT?!" tail="left" rot={-4} />
    <Pal x={2330} y={740} back="charcoal" scale={1.0} rot={6} mouth="grin" brows="up" arms={[160, 140]} flip />
    <Bubble x={2250} y={565} text="INFINITE?!" tail="right" rot={4} />

    {/* props: a d20, mana gems, a life counter and the infinity loop (the upper and lower ones only show on TV) */}
    <svg width={2560} height={1440} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <D20 x={2125} y={790} s={2.2} rot={14} num="20" color={ACCENT} />
      <Gem x={70} y={860} s={2.2} rot={-12} color="#4a6aa0" />
      <Gem x={480} y={600} s={1.8} rot={16} color="#1f7a3a" />
      <Gem x={2470} y={580} s={2.0} rot={10} color={GOLD} />
      <InfinitySym x={600} y={300} s={3.0} rot={-8} />
      <LifeCounter x={2010} y={290} n={40} />
      <Gem x={1960} y={1160} s={1.8} rot={20} color="#1f7a3a" />
      <D20 x={330} y={1150} s={2.8} rot={-20} num="1" color="#4a6aa0" />
      <Gem x={2250} y={1170} s={2.6} rot={-8} color={ACCENT} />
      <Sparkle x={1280} y={200} s={2.4} color={GOLD} />
      <Sparkle x={1480} y={1240} s={2.0} color={GOLD} />
      <Sparkle x={860} y={1180} s={1.6} color="#4a6aa0" />
    </svg>

    {/* safe area: Wil + name + promise */}
    <div
      style={{
        position: "absolute",
        left: SAFE.x,
        top: SAFE.y,
        width: SAFE.w,
        height: SAFE.h,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
      }}
    >
      <div style={{ width: 290, height: 360, position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", left: -34, top: -18 }}>
          <MascotRig id="banner2" scale={1.05} rotate={-5} rightArm={140} leftArm={40} mouth="grin" brows="up" />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
        <div style={{ fontFamily: BLOCK, fontSize: 100, lineHeight: 0.95, color: "#fff", ...outline(11), textShadow: "8px 9px 0 rgba(0,0,0,0.2)", transform: "rotate(-2deg)" }}>
          WILD CARD
        </div>
        <div style={{ fontFamily: BLOCK, fontSize: 100, lineHeight: 0.95, color: ACCENT, ...outline(11), textShadow: "8px 9px 0 rgba(0,0,0,0.2)", transform: "rotate(-2deg)" }}>
          COMMANDER
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 10, marginLeft: 6 }}>
          <Chip text="RULES" bg="#fff" color={INK} rot={-3} />
          <Chip text="COMBOS" bg="#ffe16b" color={INK} rot={2} />
          <Chip text="HOT TAKES" bg={ACCENT} color="#fff" rot={-2} />
        </div>
        <div style={{ fontFamily: HAND, fontSize: 34, color: INK, marginTop: 2, marginLeft: 8 }}>
          Broken new cards, explained by a card back in sunglasses.
        </div>
      </div>
    </div>

    {guides && (
      <>
        <div style={{ position: "absolute", left: 0, top: 508, width: 2560, height: 423, border: "6px dashed #2b6cb0" }} />
        <div style={{ position: "absolute", left: SAFE.x, top: SAFE.y, width: SAFE.w, height: SAFE.h, border: "6px solid #c8372d" }} />
      </>
    )}
  </AbsoluteFill>
);
