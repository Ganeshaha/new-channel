import React from "react";
import { AbsoluteFill, Audio, Img, staticFile } from "remotion";
import {
  ACCENT,
  BLOCK,
  CardBackFace,
  CardImg,
  Confetti,
  cue,
  Friend,
  GOLD,
  HAND,
  INK,
  PaperArrow,
  ProductImg,
  pop,
  ramp,
  Reticle,
  Sticker,
  Timing,
  useT,
  Wil,
  WilEvent,
  Voice,
  Expression,
  audit,
  AuditProbe,
  holdOut,
  readSecs,
  ShortCaptions,
} from "../kit";
import timingJson from "./timing.json";
import voiceJson from "./voice.json";
import expressionJson from "./expression.json";

/**
 * Episode 002 Short (1080x1920): the hook, the combo in 30 seconds, then a cliffhanger ("there's a
 * catch") that hands off to the full video through the Short's related-video link.
 * Narration is cut from the long video's own audio (scripts/short_cut.py + scripts/short_ep002.json).
 *
 * Vertical safe area (research/shorts/REPORT.md): YouTube's UI covers the top ~250 px, the right
 * rail (x >= 880: like/comment/share) and the bottom ~420 px (handle, title, the carousel with the
 * related-video link, progress). Everything readable sits inside x 60-880, y 250-1500.
 * Wil stands bottom-left so he can point down at the related-video link; the stage is "OPPONENT"
 * on top, "YOU" below. Burned-in captions run in a band right of Wil (x 310-870, y ~1390-1490).
 */
const T = timingJson as Timing;
const C = (id: string, phrase: string, nth = 0) => cue(T, id, phrase, nth);
const sec = (id: string) => T.sections.find((s) => s.id === id)!;
const card = (name: string) => `ep002/cards/${name}.png`;
const DACK = card("dack-fayden-helping-hand");
const VENSER = card("venser-fervent-forger");
const SPHINX = card("the-ur-sphinx");
const EMISSARY = card("serras-emissary");
const SOL_RING = card("sol-ring");
const SIGNET = card("arcane-signet");
const LANTERN = card("chromatic-lantern");
const ISLAND = card("island");
const MOUNTAIN = card("mountain");
const TOWER = card("command-tower");
const DECK_BOX = "ep002/product/deck.png";

export const SHORT_END = T.narrationEnd + 3.4; // the call to the full video holds ~3 s after the last word
export const EP002_SHORT_FRAMES = Math.ceil(SHORT_END * 30);

/** A two-line block headline (the Shorts hook text), centred on x. */
const Headline: React.FC<{ lines: string[]; x: number; y: number; at: number; out?: number; size?: number; hi?: number }> = ({
  lines, x, y, at, out, size = 74, hi = -1,
}) => {
  const { t, fps } = useT();
  out = holdOut(at, out, readSecs(lines.join(" ")));
  const p = pop(t, fps, at, out, 12);
  if (p <= 0.001) return null;
  return (
    <div
      {...audit("title", lines.join(" "), at, p)}
      style={{
        position: "absolute",
        left: x - 400,
        top: y,
        width: 800,
        textAlign: "center",
        transform: `scale(${p})`,
        opacity: Math.min(1, p * 1.5),
        fontFamily: BLOCK,
        fontSize: size,
        lineHeight: 1.08,
        color: INK,
        textShadow: "4px 5px 0 rgba(0,0,0,0.12)",
      }}
    >
      {lines.map((l, i) => (
        <div key={i}>
          <span style={i === hi ? { background: "#ffe16b", padding: "0 14px", borderRadius: 10 } : undefined}>{l}</span>
        </div>
      ))}
    </div>
  );
};

/** The trigger on the stack (as in the long video), sized for the vertical stage. */
const TriggerNote: React.FC<{ x: number; y: number; at: number; out?: number; target: string }> = ({ x, y, at, out, target }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, readSecs("VENSER TRIGGER target: " + target));
  const p = pop(t, fps, at, out, 10);
  if (p <= 0.001) return null;
  return (
    <div
      {...audit("note", "VENSER TRIGGER target: " + target, at, p)}
      style={{
        position: "absolute",
        left: x - 160,
        top: y - 95,
        width: 320,
        height: 190,
        transform: `rotate(-3deg) scale(${p})`,
        background: "#fffdf7",
        border: `5px solid ${INK}`,
        borderRadius: 16,
        boxShadow: "8px 10px 0 rgba(0,0,0,0.16)",
        padding: "16px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontFamily: BLOCK, fontSize: 30, color: ACCENT }}>⚡ VENSER TRIGGER</div>
      <div style={{ fontFamily: HAND, fontSize: 36, color: INK, marginTop: 14 }}>target: {target}</div>
    </div>
  );
};

// ---------------------------------------------------------------- beats

const Hook: React.FC = () => {
  const { t } = useT();
  const id = "hook";
  const oneCard = C(id, "one card");
  const exitAt = C("venser", "when venser") - 0.05;
  // the box opens big and centred, then makes room for Dack on "one card"
  const k = ((x: number) => x * x * (3 - 2 * x))(ramp(t, oneCard - 0.35, oneCard + 0.35));
  const boxW = (460 + (300 - 460) * k) * (1 + 0.03 * ramp(t, 0, oneCard));
  const boxX = 480 + (280 - 480) * k;
  const boxY = 840 + (820 - 840) * k;
  return (
    <>
      {/* frame 0: the claim is already on screen, in words and in the product, fully settled (at -1.2 s) */}
      <Headline lines={["THIS PRECON WINS", "WITH ONE CARD"]} x={480} y={330} at={-1.2} out={C(id, "wizards") - 0.1} hi={1} size={64} />
      <ProductImg src={DECK_BOX} x={boxX} y={boxY} w={boxW} at={-1.2} out={exitAt} rot={-4} />
      <CardImg src={DACK} x={660} y={840} w={420} at={oneCard} out={exitAt} rot={5} from="right" />
      <Confetti x={660} y={720} at={oneCard + 0.15} />
      <Sticker text="∞" x={280} y={800} at={C(id, "out of the box")} out={exitAt} size={200} color={GOLD} rot={12} wobble stamp />
    </>
  );
};

const VenserCard: React.FC = () => {
  const id = "venser";
  const end = sec("stage").start - 0.05;
  return (
    <>
      <CardImg src={VENSER} x={480} y={800} w={460} at={sec(id).start - 0.1} out={end} rot={-2} from="pop" />
    </>
  );
};

/** OPPONENT on top, YOU below: Dack hands Venser over, the trigger waits, then targets him. */
const Stage: React.FC = () => {
  const { t } = useT();
  const id = "stage";
  const start = sec(id).start;
  const hand = C(id, "venser over");
  const tokens = C(id, "two token vensers");
  const again = C(id, "original venser again");
  const going = C(id, "keeps the loop going");
  const out = C("board", "loop it") - 0.05;
  const loops = t < going ? 0 : Math.floor(Math.pow(2, (t - going) * 1.8));
  return (
    <>
      <Sticker text="OPPONENT" x={290} y={380} at={start} out={out} size={42} bg="#fff" color={INK} rot={-3} />
      <Friend x={790} y={520} back="navy" at={start} out={out} scale={0.6} mouth={t > C(id, "himself") ? "o" : "smile"} />
      {/* "YOU" sits over Wil (he is you), clear of the caption band */}
      <Sticker text="YOU" x={190} y={1150} at={start} out={out} size={40} bg="#fff" color={INK} rot={3} />
      <CardImg src={DACK} x={430} y={1210} w={240} at={start} out={hand + 1.2} rot={-4} />
      {/* Venser starts on your side and slides up to theirs as Dack hands him over */}
      <CardImg src={VENSER} x={720} y={1150} w={330} at={start + 0.1} out={out} toX={470} toY={676} moveAt={hand + 0.1} />
      <PaperArrow x1={560} y1={1120} x2={640} y2={1060} at={hand - 0.1} out={hand + 1.0} />
      <TriggerNote x={650} y={1190} at={C(id, "venser", 1)} out={tokens} target="Himself." />
      <PaperArrow x1={600} y1={1090} x2={520} y2={940} at={C(id, "venser", 1)} out={tokens - 0.05} bend={-60} />
      <Reticle x={470} y={676} at={C(id, "venser", 1)} out={tokens - 0.05} />
      <CardImg src={VENSER} x={545} y={1195} w={230} at={tokens + 0.45} out={out} rot={-6} />
      <CardImg src={VENSER} x={770} y={1195} w={230} at={tokens + 0.8} out={out} rot={5} />
      <Sticker text="TOKEN" x={540} y={1320} at={tokens + 0.45} out={out} size={40} bg="#fff" color={INK} stamp />
      <Sticker text="TOKEN" x={770} y={1320} at={tokens + 0.8} out={out} size={40} bg="#fff" color={INK} stamp />
      <PaperArrow x1={560} y1={1060} x2={470} y2={940} at={again} out={out} color={GOLD} bend={-80} />
      <Sticker text="AGAIN ↻" x={470} y={560} at={again} out={out} size={46} bg="#ffe16b" color={INK} rot={-3} stamp />
      {t >= going && <Sticker text={loops > 9999 ? "LOOPS: ∞" : `LOOPS: ${loops}`} x={650} y={330} at={going} out={out} size={44} bg="#fff" color={INK} rot={-2} />}
    </>
  );
};

const Board: React.FC = () => {
  const id = "board";
  const start = C(id, "loop it");
  const out = C("catch", "there's a catch") + 0.1;
  const rows: [number, string, string[]][] = [
    [575, "CREATURES", [SPHINX, EMISSARY, SPHINX]],
    [835, "ARTIFACTS", [SOL_RING, SIGNET, LANTERN]],
    [1095, "LANDS", [ISLAND, MOUNTAIN, TOWER]],
  ];
  return (
    <>
      <Sticker text="YOUR BOARD NOW" x={480} y={380} at={start} out={out} size={56} bg="#ffe16b" color={INK} rot={-2} />
      {rows.map(([y, label, srcs], r) => (
        <React.Fragment key={label}>
          {srcs.map((src, k) => (
            <CardImg key={k} src={src} x={290 + k * 60} y={y} w={165} at={start + 0.3 + r * 0.35 + k * 0.08} out={out} rot={(k - 1) * 8} from="pop" />
          ))}
          <Sticker text={label} x={715} y={y - 45} at={start + 0.45 + r * 0.35} out={out} size={40} bg="#fff" color={INK} rot={-2} />
          <Sticker text="×∞" x={715} y={y + 50} at={C(id, "endless copies") + r * 0.12} out={out} size={52} color={GOLD} rot={6} />
        </React.Fragment>
      ))}
    </>
  );
};
/** The cliffhanger and the hand-off to the full video (the related-video link sits under the bottom-left). */
const Catch: React.FC = () => {
  const { t } = useT();
  const at = C("catch", "there's a catch");
  const cta = T.narrationEnd + 0.1;
  const f = ramp(t, cta + 0.2, cta + 0.8);
  return (
    <>
      {/* the card that ruins it, face-down: the full video turns it over */}
      {t >= at + 0.2 && t < cta + 0.15 && (
        <div
          {...audit("card", "mystery card", at + 0.2, 1)}
          style={{ position: "absolute", left: 480 - 160, top: 540, width: 320, transform: `rotate(${4 - 2 * f}deg)` }}
        >
          <CardBackFace w={320} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BLOCK, fontSize: 160, color: "#fff", textShadow: "6px 8px 0 rgba(0,0,0,0.3)" }}>?</div>
        </div>
      )}
      {/* YouTube's Shorts-to-long-form guide: flash the long video's thumbnail as you point at the link */}
      {t >= cta + 0.1 && (
        <div
          {...audit("fig", "long video thumbnail", cta + 0.1, 1)}
          style={{
            position: "absolute",
            left: 470 - 330,
            top: 575,
            width: 660,
            height: 372,
            transform: `scale(${0.6 + 0.4 * Math.min(1, (t - cta - 0.1) / 0.25)}) rotate(-2deg)`,
            borderRadius: 18,
            overflow: "hidden",
            border: `6px solid ${INK}`,
            boxShadow: "10px 12px 0 rgba(0,0,0,0.18)",
          }}
        >
          <Img src={staticFile("ep002short/long-thumb.jpg")} style={{ width: "100%", height: "100%", display: "block" }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 110, height: 78, margin: "-39px 0 0 -55px", background: "#e02b1f", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderTop: "20px solid transparent", borderBottom: "20px solid transparent", borderLeft: "34px solid #fff", marginLeft: 8 }} />
          </div>
        </div>
      )}
      <Headline lines={["THE CATCH +", "HOW TO STOP IT"]} x={480} y={1040} at={cta} out={SHORT_END + 1} size={60} hi={0} />
      <Sticker text="FULL VIDEO ↓" x={580} y={1300} at={cta + 0.4} out={SHORT_END + 1} size={62} bg="#ffe16b" color={INK} rot={-3} wobble />
    </>
  );
};

// ---------------------------------------------------------------- Wil

const WIL_EVENTS: WilEvent[] = [
  { at: C("hook", "wizards"), anim: "facepalm" },
  { at: C("stage", "himself"), anim: "shocked" },
  { at: C("board", "endless copies"), anim: "mind-blown" },
  { at: C("catch", "there's a catch"), anim: "peek" },
  // points down at the related-video link as the call to the full video lands
  { at: T.narrationEnd + 0.3, anim: "point-down" },
];

export const Ep002Short: React.FC<{ audit?: boolean }> = ({ audit: auditOn = false }) => (
  <AbsoluteFill style={{ background: "#ffffff", overflow: "hidden" }}>
    <div {...audit("root", "stage", 0, 1)} style={{ position: "absolute", inset: 0 }} />
    <Audio src={staticFile("ep002short/narration.wav")} />
    <Hook />
    <VenserCard />
    <Stage />
    <Board />
    <Catch />
    {/* faint scrims so YouTube's white handle/title/buttons stay legible over the white page */}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 440, background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.13))", pointerEvents: "none" }} />
    <div style={{ position: "absolute", top: 820, bottom: 0, right: 0, width: 220, background: "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.08))", pointerEvents: "none" }} />
    {/* burned-in captions (Shorts only): the caption band right of Wil, above YouTube's title area.
        With captions carrying the words, stickers never restate the narration; they only add what
        the voice doesn't say (who owns what, counts, labels, the call to the full video). */}
    <ShortCaptions timing={T} x={590} y={1441} maxWidth={580} />
    <Wil timing={T} events={WIL_EVENTS} x={190} y={1390} scale={1.0} voice={voiceJson as Voice} expression={expressionJson as unknown as Expression} />
    {auditOn && <AuditProbe every={3} />}
  </AbsoluteFill>
);
