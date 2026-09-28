import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SubscribeBeat } from "../../SubscribeBeat";
import {
  ACCENT,
  BLOCK,
  CardBackFace,
  CardImg,
  Callout,
  Confetti,
  cue,
  FlyCard,
  Friend,
  GOLD,
  HAND,
  INK,
  PaperArrow,
  ProductImg,
  pop,
  ramp,
  RansomTitle,
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
  SEE_SECS,
} from "../kit";
import timingJson from "./timing.json";
import voiceJson from "./voice.json";
import looksJson from "./looks.json";
import expressionJson from "./expression.json";

// Episode 002: "The New Jace Precon Has a One-Card Infinite Combo".
// White stage, Wil D. Card bottom-right, every beat cued to a word of the real narration.

const T = timingJson as Timing;
const C = (id: string, phrase: string, nth = 0) => cue(T, id, phrase, nth);
const sec = (id: string) => T.sections.find((s) => s.id === id)!;
/**
 * When a scene's elements leave: just after the next section has started, so the old scene is still up
 * while the new one arrives (a quick crossfade instead of a blank beat between scenes).
 */
const END = (id: string) => {
  const i = T.sections.findIndex((s) => s.id === id);
  const next = T.sections[i + 1];
  return Math.max(sec(id).end + 0.35, next ? next.start + 0.3 : 0);
};
export const EP002_SECONDS = Math.ceil(T.narrationEnd + 18);

const card = (name: string) => `ep002/cards/${name}.png`;

/** A row of face-down cards flipping in one after another (a reveal from the library). */
const BackRow: React.FC<{
  x: number;
  y: number;
  n: number;
  w: number;
  gap: number;
  at: number;
  out?: number;
}> = ({ x, y, n, w, gap, at, out }) => {
  const { t, fps } = useT();
  out = holdOut(at + (n - 1) * 0.18, out, SEE_SECS);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const p = pop(t, fps, at + i * 0.18, out, 11);
        if (p <= 0.001) return null;
        return (
          <div
            {...audit("card", "back", at, p)}
            key={i}
            style={{
              position: "absolute",
              left: x + i * gap - w / 2,
              top: y,
              transform: `rotate(${(i - 1) * 5}deg) scale(${p})`,
              filter: "drop-shadow(6px 8px 0 rgba(0,0,0,0.16))",
            }}
          >
            <CardBackFace w={w} />
          </div>
        );
      })}
    </>
  );
};
const DACK = card("dack-fayden-helping-hand");
const VENSER = card("venser-fervent-forger");
const JACE = card("jace-multiverse-architect");
const BRAINSTORM = card("brainstorm");
const ANGEL = card("darksteel-angel");
const ARCHON = card("archon-of-cruelty");
const SPHINX = card("the-ur-sphinx");
const SOL_RING = card("sol-ring");
const SIGNET = card("arcane-signet");
const LANTERN = card("chromatic-lantern");
const TOWER = card("command-tower");
const ISLAND = card("island");
const MOUNTAIN = card("mountain");
const EMISSARY = card("serras-emissary");
const SWORDS = card("swords-to-plowshares");
const PATH = card("path-to-exile");
const DESPARK = card("despark");
const FATEHOLD = card("fatehold-charm");
const MIRROR = card("cursed-mirror");
/** Official product shot of the Multiverse Reforged deck box (Wizards of the Coast, used with permission). */
const DECK_BOX = "ep002/product/deck.png";

// ---------------------------------------------------------------- layout

/** A scene's content bounds [x0, y0, x1, y1] in 1920x1080, measured from a render with Wil's corner masked. */
type Box = [number, number, number, number];
/**
 * The free stage: everything left of Wil's corner. Sized so that at the deepest camera zoom
 * (drift 1.03 x punch 1.06) every scene still stays 24 px inside the frame (title-safe) and clear of Wil.
 */
const STAGE: Box = [84, 70, 1380, 1010];
/** Scales a scene up into the free stage and centres it, so no scene hugs the top-left. */
const Fit: React.FC<{
  box: Box;
  max?: number;
  /** Section whose length the slow camera drift spans. */
  sec?: string;
  /** Times (s) of quick camera punch-ins on key lines. */
  punches?: number[];
  children: React.ReactNode;
}> = ({ box, max = 1.35, sec: id, punches = [], children }) => {
  const { t } = useT();
  const [x0, y0, x1, y1] = box;
  const [sx0, sy0, sx1, sy1] = STAGE;
  const s = Math.min(max, (sx1 - sx0) / (x1 - x0), (sy1 - sy0) / (y1 - y0));
  const tx = sx0 + (sx1 - sx0 - s * (x1 - x0)) / 2 - s * x0;
  const ty = sy0 + (sy1 - sy0 - s * (y1 - y0)) / 2 - s * y0;
  // camera: a slow push-in across the section, plus short punch-ins (ease in, hold, ease out)
  const drift = id ? 1 + 0.03 * ramp(t, sec(id).start, sec(id).end) : 1;
  const punch = punches.reduce((acc, p) => {
    const inn = 1 - Math.pow(1 - ramp(t, p, p + 0.22), 3);
    const back = ramp(t, p + 1.5, p + 1.9);
    return acc * (1 + 0.06 * inn * (1 - back));
  }, 1);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${drift * punch})`,
        transformOrigin: `${(sx0 + sx1) / 2}px ${(sy0 + sy1) / 2}px`,
      }}
    >
      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scenes

const ColdOpen: React.FC = () => {
  const id = "cold-open";
  const { t } = useT();
  const hello = C("intro-and-promise", "hello everyone");
  // the pieces leave one after another as Wil walks on, instead of all at once before he arrives
  const exit = (i: number) => hello - 0.05 + i * 0.06;
  // the deck box opens the video centred and large (slow push-in), then glides left as the title and card arrive
  const move = C(id, "win the game") - 0.9;
  const k = ((x: number) => x * x * (3 - 2 * x))(ramp(t, move, move + 0.7));
  const push = 1 + 0.04 * ramp(t, 0, move);
  const boxW = (450 + (350 - 450) * k) * push;
  const boxX = 960 + (430 - 960) * k;
  const boxY = 520 + (530 - 520) * k;
  const boxBottom = boxY + boxW * 0.77; // deck.png is ~1.54 tall per unit of width
  return (
    <>
      {/* at={-0.4}: already popped in on the first frame, so the video never opens on an empty stage */}
      <ProductImg src={DECK_BOX} x={boxX} y={boxY} w={boxW} at={-0.4} out={exit(5)} rot={-4} />
      <Sticker
        text="NOT EVEN OUT YET"
        x={boxX}
        y={boxBottom + 84}
        at={C(id, "isn't even out")}
        out={C(id, "win the game") + 0.1}
        size={58}
        bg="#fff"
        color={ACCENT}
        rot={-6}
      />
      <RansomTitle
        text="ONE-CARD WIN"
        x={960}
        y={170}
        at={C(id, "win the game")}
        out={C(id, "messed up") - 0.05}
        size={96}
      />
      <CardImg
        src={DACK}
        x={1070}
        y={575}
        w={420}
        at={C(id, "one card")}
        out={exit(2)}
        rot={6}
        from="right"
      />
      <Sticker
        text="∞"
        x={430}
        y={500}
        at={C(id, "out of the box")}
        out={exit(3)}
        size={260}
        color={GOLD}
        rot={12}
        wobble
        stamp
      />
      {/* the cold open's last word: clears about a second into Wil's entrance (once read) so he doesn't walk on under it */}
      <RansomTitle
        text="WIZARDS MESSED UP"
        x={960}
        y={170}
        at={C(id, "messed up")}
        out={C("intro-and-promise", "hello everyone") + 1.0}
        size={84}
        stagger={0.02}
      />
      <Confetti x={1080} y={420} at={C(id, "one card") + 0.2} />
    </>
  );
};

const Intro: React.FC = () => {
  const id = "intro-and-promise";
  const out = END(id);
  const today = C(id, "today");
  const items: [string, string][] = [
    ["how it works", "1  How it works"],
    ["even legal", "2  Why it's even legal"],
    ["one card in this", "3  ???  (the card that stops it)"],
  ];
  return (
    <>
      <RansomTitle
        text="WIL D. CARD"
        x={370}
        y={560}
        at={C(id, "this is wil") + 0.25}
        out={today + 0.1}
        size={60}
      />
      <CardImg
        src={DACK}
        x={270}
        y={560}
        w={420}
        at={today + 0.15}
        out={out}
        rot={-7}
        from="left"
      />
      <CardImg
        src={VENSER}
        x={580}
        y={590}
        w={420}
        at={today + 0.4}
        out={out}
        rot={6}
        from="bottom"
      />
      <Callout
        label="FOUND BY"
        text="[[u/Huaojozu]] on r/magicTCG"
        x={110}
        y={60}
        w={660}
        at={C(id, "a redditor called")}
        out={out}
        size={40}
        rot={-2}
      />
      <Sticker
        text="r/magicTCG IS GOING NUTS"
        x={450}
        y={975}
        at={C(id, "going nuts")}
        out={out}
        size={44}
        bg="#fff"
        color={ACCENT}
        rot={-4}
        wobble
      />
      {items.map(([cueWord, label], i) => (
        <Sticker
          key={i}
          text={label}
          x={1250}
          y={300 + i * 130}
          at={C(id, cueWord)}
          out={out}
          size={46}
          bg={i === 2 ? "#2b3d68" : "#fff"}
          color={i === 2 ? "#fff" : INK}
          rot={i % 2 ? 2 : -2}
        />
      ))}

      <Callout
        label="THE THREAD"
        text="“There is an [[infinite game-ending combo]] in the new Reality Fracture precon…”"
        x={860}
        y={110}
        w={560}
        at={C(id, "posted it")}
        out={C(id, "how it works") - 0.1}
        size={32}
        rot={1}
      />
    </>
  );
};

const FRIENDS: [number, "navy" | "kraft" | "charcoal"][] = [
  [900, "navy"],
  [1100, "kraft"],
  [1300, "charcoal"],
];

const TwoCards: React.FC = () => {
  const id = "the-two-cards";
  const out = END(id);
  const dackOut = C(id, "next up") - 0.1;
  const hand = C(id, "then you hand");
  return (
    <>
      <ProductImg
        src={DECK_BOX}
        x={350}
        y={470}
        w={460}
        at={sec(id).start}
        out={C(id, "first up") - 0.1}
        rot={-4}
      />
      <Sticker
        text="4-COLOR JACE PRECON"
        x={1045}
        y={330}
        at={C(id, "four-color")}
        out={C(id, "first up") - 0.1}
        size={52}
        bg="#fff"
        color={INK}
        rot={-3}
      />
      <Sticker
        text="OUT OCT 2"
        x={925}
        y={470}
        at={C(id, "october")}
        out={C(id, "first up") - 0.1}
        size={60}
        color={ACCENT}
        rot={4}
      />
      <Sticker
        text="2 NEW CARDS = TROUBLE"
        x={1045}
        y={610}
        at={C(id, "two of the new")}
        out={C(id, "first up") - 0.1}
        size={44}
        bg="#ffe16b"
        color={INK}
        rot={-2}
      />

      <CardImg
        src={DACK}
        x={350}
        y={475}
        w={540}
        at={C(id, "first up")}
        out={dackOut}
        rot={-3}
        from="left"
      />
      <Sticker
        text="6 MANA… CREATURE?"
        x={950}
        y={95}
        at={C(id, "six-mana")}
        out={C(id, "you reveal")}
        size={40}
        bg="#fff"
        color={INK}
        rot={-5}
      />
      <Callout
        label="DACK FAYDEN, HELPING HAND"
        text="Reveal cards from the top of your library until you reveal [[X creature cards]], where X is [[the number of opponents]] you have."
        x={650}
        y={140}
        w={640}
        at={C(id, "you reveal")}
        out={C(id, "they come in") - 0.1}
      />
      <Sticker
        text="4 PLAYERS = 3 CREATURES"
        x={1060}
        y={470}
        at={C(id, "four-player")}
        out={C(id, "they come in") - 0.1}
        size={44}
        color={GOLD}
        rot={3}
      />
      <Callout
        text="Put those creature cards [[onto the battlefield]], then shuffle. They're [[goaded]] for the rest of the game."
        x={650}
        y={140}
        w={640}
        at={C(id, "they come in")}
        out={dackOut}
      />
      {FRIENDS.map(([x, back], i) => (
        <React.Fragment key={back}>
          <Friend
            x={x}
            y={640}
            back={back}
            at={hand - 0.4}
            out={dackOut}
            mouth={i === 1 ? "o" : "smile"}
          />
          <FlyCard
            x1={330}
            y1={470}
            x2={x}
            y2={520}
            at={hand + i * 0.25}
            out={dackOut}
          />
        </React.Fragment>
      ))}
      <Sticker
        text="MERRY CHRISTMAS!"
        x={1060}
        y={470}
        at={C(id, "merry christmas")}
        out={dackOut}
        size={50}
        color={GOLD}
        rot={-6}
        wobble
      />
      <Confetti x={1060} y={420} at={C(id, "merry christmas")} />

      <CardImg
        src={VENSER}
        x={350}
        y={475}
        w={540}
        at={C(id, "next up")}
        out={out}
        rot={3}
        from="right"
      />
      <Callout
        label="VENSER, FERVENT FORGER"
        text="Create [[two tokens that are copies]] of target permanent an opponent controls. They gain [[haste]]. At the beginning of the next end step, [[sacrifice them]]."
        x={650}
        y={250}
        w={640}
        at={C(id, "one of his modes")}
        out={out}
      />

      <BackRow
        x={880}
        y={440}
        n={3}
        w={110}
        gap={150}
        at={C(id, "one creature for each")}
        out={C(id, "four-player") - 0.1}
      />
      <Callout
        label="GOADED"
        text="Must [[attack each combat]], and [[not you]]."
        x={650}
        y={345}
        w={560}
        at={C(id, "they're goaded")}
        out={C(id, "then you hand") - 0.1}
        size={32}
        rot={1}
      />
      <Sticker
        text="HASTE ⚡"
        x={820}
        y={640}
        at={C(id, "they've got haste")}
        out={out}
        size={50}
        bg="#ffe16b"
        color={INK}
        rot={-4}
      />
      <Sticker
        text="GONE AT END STEP"
        x={1100}
        y={770}
        at={C(id, "you sacrifice them")}
        out={out}
        size={44}
        bg="#fff"
        color={ACCENT}
        rot={3}
      />
    </>
  );
};

const Combo: React.FC = () => {
  const id = "the-combo";
  // phase 1, the loop diagram, clears when the end state starts ("their creatures");
  // phase 2, the end-state board of copies, clears for the closing "it's two cards" beat
  // each group leaves just after the next one starts arriving: a swap, not a blank beat
  const out = C(id, "their creatures") + 0.1;
  const boardOut = C(id, "it's two cards") + 0.1;
  const end = END(id);
  const { t } = useT();
  const handed = C(id, "gets handed");
  const tokens = C(id, "two token vensers");
  const legend = C(id, "legend rule");
  const keepGoing = C(id, "keeps going");
  const loops =
    t < keepGoing ? 0 : Math.floor(Math.pow(2, (t - keepGoing) * 1.6));
  return (
    <>
      <Sticker
        text="YOU"
        x={330}
        y={120}
        at={sec(id).start}
        out={out}
        size={54}
        bg="#fff"
        color={INK}
        rot={-3}
      />
      <Sticker
        text="OPPONENT"
        x={1080}
        y={120}
        at={sec(id).start}
        out={out}
        size={54}
        bg="#fff"
        color={INK}
        rot={3}
      />
      <Friend
        x={1270}
        y={330}
        back="navy"
        at={sec(id).start}
        out={out}
        scale={0.5}
        mouth={t > C(id, "himself") ? "o" : "smile"}
      />
      <CardImg
        src={VENSER}
        x={330}
        y={420}
        w={310}
        at={C(id, "flip venser")}
        out={out}
        flipAt={C(id, "flip venser") + 0.1}
        toX={1000}
        toY={420}
        moveAt={handed}
      />
      <Sticker
        text="YOUR TRIGGER"
        x={330}
        y={745}
        at={C(id, "your trigger")}
        out={out}
        size={44}
        bg="#ffe16b"
        color={INK}
        rot={-4}
      />
      <Sticker
        text="DACK: DONE"
        x={660}
        y={260}
        at={C(id, "dack finishes")}
        out={C(id, "two token vensers")}
        size={40}
        color="#1f7a3a"
        rot={-3}
      />
      <Reticle
        x={1000}
        y={420}
        at={C(id, "they control him")}
        out={C(id, "two token vensers")}
      />
      <PaperArrow
        x1={800}
        y1={372}
        x2={905}
        y2={330}
        at={C(id, "point his ability")}
        out={C(id, "two token vensers")}
      />
      <Sticker
        text="HIMSELF?!"
        x={1000}
        y={760}
        at={C(id, "himself")}
        out={C(id, "two token vensers")}
        size={80}
        color={ACCENT}
        rot={5}
        wobble
      />

      <CardImg
        src={VENSER}
        x={215}
        y={465}
        w={220}
        at={tokens}
        out={legend + 0.45}
        rot={-8}
      />
      <CardImg
        src={VENSER}
        x={445}
        y={465}
        w={220}
        at={tokens + 0.15}
        out={out}
        rot={6}
      />
      <Sticker
        text="TOKEN"
        x={215}
        y={610}
        at={tokens}
        out={legend + 0.45}
        size={38}
        bg="#fff"
        color={INK}
        stamp
      />
      <Sticker
        text="TOKEN"
        x={445}
        y={610}
        at={tokens + 0.15}
        out={out}
        size={38}
        bg="#fff"
        color={INK}
        stamp
      />
      <Sticker
        text="LEGEND RULE"
        x={440}
        y={252}
        at={legend}
        out={C(id, "two new venser triggers")}
        size={46}
        color={ACCENT}
        rot={-6}
      />
      <Sticker
        text="⚡ ⚡"
        x={265}
        y={242}
        at={C(id, "two new venser triggers")}
        out={out}
        size={64}
        color={GOLD}
        rot={0}
      />
      <PaperArrow
        x1={470}
        y1={380}
        x2={900}
        y2={400}
        at={C(id, "one targets")}
        out={keepGoing}
        color={GOLD}
        bend={-120}
      />
      <PaperArrow
        x1={470}
        y1={560}
        x2={1080}
        y2={640}
        at={C(id, "our second trigger")}
        out={keepGoing}
        color="#4a6aa0"
        bend={120}
      />

      <Sticker
        text="∞"
        x={707}
        y={600}
        at={keepGoing}
        out={out}
        size={130}
        color={GOLD}
        rot={(t * 40) % 360}
      />
      {t >= keepGoing && (
        <Sticker
          text={loops > 9999 ? "LOOPS: ∞" : `LOOPS: ${loops}`}
          x={700}
          y={860}
          at={keepGoing}
          out={out}
          size={48}
          bg="#fff"
          color={INK}
          rot={-2}
        />
      )}
      {/* phase 2: the end state. Two hasty copies of anything they control, every loop */}
      <Sticker
        text="YOUR BOARD NOW"
        x={700}
        y={140}
        at={C(id, "their creatures")}
        out={boardOut}
        size={62}
        bg="#ffe16b"
        color={INK}
        rot={-2}
      />
      {(
        [
          [320, "their creatures", "CREATURES", [SPHINX, EMISSARY, SPHINX]],
          [700, "their artifacts", "ARTIFACTS", [SOL_RING, SIGNET, LANTERN]],
          [1080, "their lands", "LANDS", [ISLAND, MOUNTAIN, TOWER]],
        ] as [number, string, string, string[]][]
      ).map(([x, cueWord, label, srcs]) => (
        <React.Fragment key={label}>
          {srcs.map((src, k) => (
            <CardImg
              key={k}
              src={src}
              x={x - 70 + k * 70}
              y={390 + Math.abs(k - 1) * 12}
              w={220}
              at={C(id, cueWord) + k * 0.12}
              out={boardOut}
              rot={(k - 1) * 9}
              from="pop"
            />
          ))}
          <Sticker
            text={label}
            x={x}
            y={625}
            at={C(id, cueWord) + 0.2}
            out={boardOut}
            size={40}
            bg="#fff"
            color={INK}
            rot={-2}
          />
          <Sticker
            text="×∞"
            x={x + 120}
            y={300}
            at={C(id, "loop it as many times") + (x - 320) / 1500}
            out={C(id, "then swing") - 0.1}
            size={64}
            color={GOLD}
            rot={8}
            stamp
          />
        </React.Fragment>
      ))}
      <Sticker
        text="∞ MANA"
        x={1080}
        y={440}
        at={C(id, "unlimited mana")}
        out={C(id, "then swing") - 0.1}
        size={58}
        color={GOLD}
        rot={-8}
        stamp
      />
      <Sticker
        text="SACRIFICED AT THE NEXT END STEP"
        x={700}
        y={735}
        at={C(id, "they all get sacrificed")}
        out={boardOut}
        size={38}
        bg="#fff"
        color={ACCENT}
        rot={-1}
      />
      <Sticker
        text="SO: DO IT BEFORE COMBAT"
        x={700}
        y={845}
        at={C(id, "before combat")}
        out={boardOut}
        size={42}
        bg="#ffe16b"
        color={INK}
        rot={2}
      />
      <Sticker
        text="SWING!"
        x={700}
        y={400}
        at={C(id, "then swing")}
        out={boardOut}
        size={128}
        color={ACCENT}
        rot={-8}
        wobble
        stamp
      />
      <Confetti x={700} y={360} at={C(id, "then swing")} />

      {/* "before anyone types it: it's two cards, but you only cast one" */}
      <Sticker
        text={'"IT\'S TWO CARDS!"'}
        x={700}
        y={150}
        at={C(id, "it's two cards")}
        out={end}
        size={70}
        bg="#fff"
        color={INK}
        rot={-3}
      />
      <CardImg
        src={DACK}
        x={410}
        y={510}
        w={340}
        at={C(id, "you only cast one")}
        out={end}
        rot={-5}
        from="left"
      />
      <Sticker
        text="YOU CAST THIS"
        x={410}
        y={848}
        at={C(id, "you only cast one") + 0.2}
        out={end}
        size={44}
        bg="#ffe16b"
        color={INK}
        rot={-3}
      />
      <PaperArrow
        x1={610}
        y1={510}
        x2={815}
        y2={510}
        at={C(id, "dack goes and finds")}
        out={end}
        bend={-70}
      />
      <CardImg
        src={VENSER}
        x={1000}
        y={510}
        w={340}
        at={C(id, "dack goes and finds") + 0.3}
        out={end}
        rot={5}
        from="pop"
      />
      <Sticker
        text="DACK FINDS THIS"
        x={1000}
        y={848}
        at={C(id, "dack goes and finds") + 0.4}
        out={end}
        size={44}
        bg="#fff"
        color={ACCENT}
        rot={3}
      />

      <Sticker
        text="DACK'S ABILITY: RESOLVING…"
        x={700}
        y={880}
        at={C(id, "dack's ability is resolving")}
        out={C(id, "dack finishes") - 0.1}
        size={40}
        bg="#fff"
        color={INK}
        rot={-2}
      />
      <Sticker
        text="UNDER YOUR CONTROL"
        x={372}
        y={520}
        at={C(id, "under your control")}
        out={handed}
        size={38}
        bg="#fff"
        color={INK}
        rot={2}
        stamp
      />
      <TriggerCard
        x={640}
        y={495}
        at={C(id, "trigger on the stack")}
        out={tokens}
        target={t < C(id, "point his ability") ? "picking…" : "Venser. Himself."}
      />
      <Sticker
        text="RIP"
        x={215}
        y={465}
        at={C(id, "the graveyard")}
        out={C(id, "two new venser triggers")}
        size={80}
        bg="#fff"
        color={INK}
        rot={-10}
        stamp
      />
      <Sticker
        text="BOTH ENTERED ✓✓"
        x={390}
        y={852}
        at={C(id, "both entered")}
        out={keepGoing}
        size={40}
        bg="#fff"
        color="#1f7a3a"
        rot={-3}
      />
      <CardImg
        src={SPHINX}
        x={1060}
        y={740}
        w={140}
        at={C(id, "the other two creatures")}
        out={out}
        rot={-5}
        from="pop"
      />
      <CardImg
        src={EMISSARY}
        x={1225}
        y={740}
        w={140}
        at={C(id, "the other two creatures") + 0.2}
        out={out}
        rot={5}
        from="pop"
      />
      <Sticker
        text="ON THEIR BOARDS"
        x={1140}
        y={890}
        at={C(id, "on your opponents' boards")}
        out={C(id, "our second trigger") - 0.1}
        size={38}
        bg="#fff"
        color={INK}
        rot={2}
      />
      <Sticker
        text="+2 HASTY 10/10s"
        x={1140}
        y={895}
        at={C(id, "copy one of those")}
        out={keepGoing}
        size={40}
        bg="#ffe16b"
        color={INK}
        rot={-3}
      />

      <Sticker
        text="THEIR SIDE NOW"
        x={1060}
        y={240}
        at={C(id, "opponent's side")}
        out={tokens}
        size={38}
        bg="#fff"
        color={ACCENT}
        rot={3}
        stamp
      />
      <Sticker
        text="AGAIN ↻"
        x={1000}
        y={245}
        at={C(id, "original venser again")}
        out={keepGoing}
        size={48}
        bg="#ffe16b"
        color={INK}
        rot={-3}
        stamp
      />

      <Sticker
        text="KEEPS IT GOING"
        x={632}
        y={205}
        at={C(id, "keeps the loop going")}
        out={C(id, "their creatures") - 0.1}
        size={37}
        bg="#fff"
        color={INK}
        rot={-3}
      />
      <Sticker
        text="ANY PERMANENT"
        x={900}
        y={775}
        at={C(id, "anything an opponent controls")}
        out={C(id, "the other two creatures") - 0.1}
        size={37}
        bg="#fff"
        color="#4a6aa0"
        rot={2}
      />
    </>
  );
};

const Subscribe: React.FC = () => {
  const id = "subscribe-segment";
  const start = sec(id).start;
  const recapOut = C(id, "quick quiz") + 0.1;
  const answer = C("the-gap", "it's when it goes") - 0.1;
  // recap stays in the upper left so the subscribe overlay (bottom right) has clear space
  return (
    <>
      <CardImg src={DACK} x={330} y={400} w={280} at={start} out={recapOut} rot={-5} from="pop" />
      <CardImg src={VENSER} x={640} y={420} w={280} at={start + 0.1} out={recapOut} rot={4} from="pop" />
      <Sticker text="=" x={910} y={400} at={start + 0.25} out={recapOut} size={120} color={GOLD} rot={-6} />
      <Sticker text="∞" x={1110} y={390} at={start + 0.35} out={recapOut} size={300} color={GOLD} rot={-6} wobble />
      <Sticker
        text="QUICK QUIZ"
        x={880}
        y={200}
        at={C(id, "quick quiz")}
        out={answer}
        size={90}
        bg="#ffe16b"
        color={INK}
        rot={-4}
      />
      <RansomTitle
        text="WHEN DOES THE TRIGGER PICK ITS TARGET?"
        x={880}
        y={440}
        at={C(id, "when does venser's")}
        out={answer}
        size={54}
        stagger={0.025}
      />
      <Sticker
        text="PAUSE IF YOU WANT ⏸"
        x={880}
        y={610}
        at={C(id, "pause if you want")}
        out={C(id, "three")}
        size={44}
        bg="#fff"
        color={INK}
        rot={2}
      />
      {(["three", "two", "one"] as const).map((w, i) => (
        <Sticker
          key={w}
          text={String(3 - i)}
          x={680 + i * 200}
          y={805}
          at={C(id, w)}
          out={answer}
          size={140}
          color={i === 2 ? ACCENT : GOLD}
          rot={i % 2 ? 6 : -6}
        />
      ))}

      <Sticker
        text="…OR GET GOADED"
        x={880}
        y={760}
        at={C(id, "dack goads your commander")}
        out={recapOut}
        size={60}
        color={ACCENT}
        rot={-5}
        wobble
      />
    </>
  );
};

const Gap: React.FC = () => {
  const id = "the-gap";
  const out = END(id);
  const { t, fps } = useT();
  const bar = pop(t, fps, C(id, "triggers the moment") - 0.2, out);
  const marks: [number, string, string][] = [
    [300, "triggers the moment", "Venser TRIGGERS\n(you control him)"],
    [760, "after dack's whole", "Dack FINISHES\n(they control him now)"],
    [1220, "you choose targets", "Trigger goes on stack\n→ CHOOSE TARGET"],
  ];
  const gap = pop(t, fps, C(id, "tiny gap"), out, 9);
  return (
    <>
      <Sticker
        text="ANSWER: WHEN IT GOES ON THE STACK"
        x={760}
        y={140}
        at={C(id, "it's when it goes")}
        out={out}
        size={44}
        bg="#ffe16b"
        color={INK}
        rot={-2}
      />
      {bar > 0.01 && (
        <svg
          style={{ position: "absolute", left: 0, top: 0 }}
          width={1920}
          height={1080}
        >
          <line
            x1={220}
            y1={450}
            x2={220 + 1080 * bar}
            y2={450}
            stroke={INK}
            strokeWidth={10}
            strokeLinecap="round"
          />
          {gap > 0.01 && (
            <rect
              x={300}
              y={400}
              width={920 * gap}
              height={100}
              rx={20}
              fill="#ffe16b"
              opacity={0.75}
            />
          )}
        </svg>
      )}
      {marks.map(([x, w, label], i) => {
        const p = pop(t, fps, C(id, w), out, 10);
        return p > 0.01 ? (
          <div
            {...audit("label", label.replace("\n", " "), C(id, w), p)}
            key={i}
            style={{
              position: "absolute",
              left: x - 170,
              top: 490,
              width: 340,
              transform: `scale(${p})`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                background: [ACCENT, "#4a6aa0", "#1f7a3a"][i],
                border: `4px solid ${INK}`,
                margin: "-66px auto 16px",
              }}
            />
            <div
              style={{
                fontFamily: BLOCK,
                fontSize: 30,
                color: INK,
                whiteSpace: "pre-line",
                lineHeight: 1.25,
              }}
            >
              {label}
            </div>
          </div>
        ) : null;
      })}
      <Sticker
        text="THE GAP"
        x={1125}
        y={345}
        at={C(id, "tiny gap")}
        out={out}
        size={72}
        color={ACCENT}
        rot={-4}
        wobble
      />
      <Sticker
        text="CR 603.3"
        x={330}
        y={870}
        at={C(id, "rule 603.3") + 0.3}
        out={out}
        size={44}
        bg="#fff"
        color={INK}
        rot={-4}
      />
      <Sticker
        text="CR 603.3d"
        x={740}
        y={885}
        at={C(id, "603.3d")}
        out={out}
        size={44}
        bg="#fff"
        color={INK}
        rot={3}
      />
      <Sticker
        text="CR 603.3a"
        x={1150}
        y={870}
        at={C(id, "603.3a")}
        out={out}
        size={44}
        bg="#fff"
        color={INK}
        rot={-3}
      />

      <Sticker
        text="THE #1 QUESTION IN THE THREAD"
        x={760}
        y={290}
        at={C(id, "reddit thread")}
        out={C(id, "doesn't go on the stack") - 0.1}
        size={40}
        bg="#fff"
        color={ACCENT}
        rot={2}
      />
      <Sticker
        text="NOT ON THE STACK YET…"
        x={760}
        y={290}
        at={C(id, "doesn't go on the stack")}
        out={C(id, "rule 603.3") - 0.1}
        size={44}
        bg="#fff"
        color={INK}
        rot={-2}
      />
      <Callout
        label="PRIORITY"
        text="The next moment [[anyone could act]]."
        x={380}
        y={620}
        w={700}
        at={C(id, "get priority")}
        out={C(id, "rule 603.3") - 0.1}
        size={34}
        rot={-1}
      />

      <Sticker
        text="YOURS"
        x={300}
        y={345}
        at={C(id, "the trigger's yours")}
        out={out}
        size={44}
        bg="#fff"
        color="#1f7a3a"
        rot={-4}
      />
      <Sticker
        text="THEIRS"
        x={760}
        y={345}
        at={C(id, "already switched sides")}
        out={out}
        size={44}
        bg="#fff"
        color={ACCENT}
        rot={4}
      />
    </>
  );
};

const Odds: React.FC = () => {
  const id = "the-odds";
  const out = END(id);
  const { t, fps } = useT();
  const gridIn = C(id, "18 creatures");
  const gridOut = C(id, "help it along") - 0.1;
  const dackOff = C(id, "dack's one of them");
  const firstThree = C(id, "first three");
  return (
    <>
      <Sticker
        text="HOW OFTEN?"
        x={740}
        y={420}
        at={sec(id).start + 0.2}
        out={gridIn + 0.1}
        size={110}
        bg="#ffe16b"
        color={INK}
        rot={-4}
      />
      <Sticker
        text="18 CREATURES"
        x={740}
        y={130}
        at={gridIn}
        out={dackOff + 1}
        size={60}
        bg="#fff"
        color={INK}
        rot={-2}
      />
      <Sticker
        text="17 LEFT"
        x={740}
        y={130}
        at={C(id, "that leaves 17")}
        out={gridOut}
        size={60}
        bg="#fff"
        color={INK}
        rot={2}
      />
      {Array.from({ length: 18 }, (_, i) => {
        const p = pop(t, fps, gridIn + i * 0.05, gridOut, 12);
        if (p < 0.01) return null;
        const col = i % 9;
        const row = Math.floor(i / 9);
        const gone = i === 0 && t > dackOff;
        const lifted = i >= 1 && i <= 3 && t > firstThree;
        const x = 180 + col * 125;
        const y = 300 + row * 190 - (lifted ? 40 : 0);
        return (
          <div
            {...audit("fig", "grid", gridIn, p)}
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `scale(${p}) translateY(${gone ? -600 * ramp(t, dackOff, dackOff + 0.5) : 0}px)`,
              opacity: gone ? 1 - ramp(t, dackOff, dackOff + 0.5) : 1,
            }}
          >
            <CardBackFace w={100} />
            {lifted && (
              <div
                style={{
                  position: "absolute",
                  inset: -8,
                  border: `6px solid ${GOLD}`,
                  borderRadius: 12,
                }}
              />
            )}
          </div>
        );
      })}
      <Sticker
        text="3 / 17"
        x={740}
        y={800}
        at={C(id, "three in seventeen")}
        out={gridOut}
        size={120}
        color={GOLD}
        rot={-4}
      />
      <Sticker
        text="≈ 18%"
        x={1110}
        y={800}
        at={C(id, "18 percent")}
        out={gridOut}
        size={90}
        color={ACCENT}
        rot={6}
        wobble
      />

      <CardImg
        src={BRAINSTORM}
        x={330}
        y={470}
        w={420}
        at={C(id, "help it along")}
        out={C(id, "with jace too") - 0.1}
        rot={-5}
        from="left"
      />
      <div>
        {t > C(id, "brainstorm") && t < C(id, "with jace too") && (
          <div style={{ position: "absolute", left: 820, top: 380 }}>
            {[0, 1, 2, 3, 4].map((k) => (
              <div
                key={k}
                style={{ position: "absolute", left: k * 4, top: -k * 6 }}
              >
                <CardBackFace w={150} />
              </div>
            ))}
          </div>
        )}
      </div>
      <CardImg
        src={VENSER}
        x={1200}
        y={420}
        w={150}
        at={C(id, "brainstorm")}
        out={C(id, "with jace too") - 0.1}
        toX={900}
        toY={470}
        moveAt={C(id, "back on top")}
        rot={4}
      />
      <Sticker
        text="ON TOP"
        x={760}
        y={790}
        at={C(id, "back on top") + 0.5}
        out={C(id, "with jace too") - 0.1}
        size={52}
        color={GOLD}
        rot={-4}
      />
      <Sticker
        text="EVERY TIME"
        x={1040}
        y={700}
        at={C(id, "every time")}
        out={C(id, "with jace too") - 0.1}
        size={60}
        color={ACCENT}
        rot={5}
      />

      <CardImg
        src={JACE}
        x={330}
        y={470}
        w={400}
        at={C(id, "with jace too")}
        out={out}
        rot={-3}
        from="left"
      />
      <Callout
        label="JACE, MULTIVERSE ARCHITECT  (−3)"
        text="[[Exile another]] target planeswalker or creature you control. Reveal cards … until you reveal [[a creature or planeswalker]] card. Put that card [[onto the battlefield]]."
        x={590}
        y={150}
        w={680}
        at={C(id, "minus three")}
        out={C(id, "that could be dack") - 0.1}
      />
      <CardImg
        src={DACK}
        x={740}
        y={520}
        w={220}
        at={C(id, "that could be dack")}
        out={out}
        rot={4}
      />
      <CardImg
        src={VENSER}
        x={1080}
        y={520}
        w={220}
        at={C(id, "that could be dack") + 0.8}
        out={out}
        rot={-4}
      />
      <PaperArrow
        x1={450}
        y1={470}
        x2={620}
        y2={500}
        at={C(id, "that could be dack")}
        out={out}
      />
      <PaperArrow
        x1={850}
        y1={500}
        x2={960}
        y2={500}
        at={C(id, "that could be dack") + 0.8}
        out={out}
      />
      {[0, 1, 2, 3].map((k) => (
        <Sticker
          key={k}
          text="IF?"
          x={620 + k * 160}
          y={230 + (k % 2) * 60}
          at={C(id, "lots of ifs") + k * 0.12}
          out={out}
          size={60}
          color={[ACCENT, GOLD, "#4a6aa0", ACCENT][k]}
          rot={k % 2 ? 8 : -8}
        />
      ))}
      <Sticker
        text="ALL IN THE BOX"
        x={720}
        y={820}
        at={C(id, "all in the box")}
        out={out}
        size={64}
        bg="#ffe16b"
        color={INK}
        rot={-3}
      />

      <CardImg
        src={VENSER}
        x={482}
        y={335}
        w={110}
        at={C(id, "venser's one of them")}
        out={C(id, "help it along") - 0.1}
        rot={-3}
        from="pop"
      />
      <Sticker
        text="ASSUMING NONE DRAWN YET"
        x={740}
        y={730}
        at={C(id, "assuming you haven't")}
        out={C(id, "three in seventeen") - 0.1}
        size={36}
        bg="#fff"
        color={INK}
        rot={-2}
      />
      <div style={{ position: "absolute", left: 640, top: 530 }}>
        <BackRow x={60} y={0} n={1} w={120} gap={0} at={C(id, "exiles one of your other")} out={C(id, "that could be dack") - 0.1} />
      </div>
      <Sticker
        text="EXILED"
        x={700}
        y={620}
        at={C(id, "exiles one of your other") + 0.3}
        out={C(id, "that could be dack") - 0.1}
        size={50}
        color={ACCENT}
        rot={-12}
        stamp
      />
      <Sticker
        text="NEXT CREATURE OR PLANESWALKER → PLAY"
        x={720}
        y={828}
        at={C(id, "off the top into play")}
        out={C(id, "that could be dack") - 0.1}
        size={34}
        bg="#ffe16b"
        color={INK}
        rot={2}
      />
    </>
  );
};

const Catch: React.FC = () => {
  const id = "the-catch";
  const out = END(id);
  const { t } = useT();
  const dream = C(id, "dream version");
  const life =
    t < C(id, "lose three life")
      ? 40
      : Math.max(0, 40 - Math.floor((t - C(id, "lose three life")) * 6) * 3);
  const lib =
    t < C(id, "draw a card")
      ? 60
      : Math.max(3, 60 - Math.floor((t - C(id, "draw a card")) * 6));
  return (
    <>
      <Sticker
        text="THE CATCH"
        x={860}
        y={130}
        at={C(id, "there's a catch")}
        out={C(id, "darksteel angel") - 0.1}
        size={80}
        color={ACCENT}
        rot={-4}
      />
      <CardImg
        src={ANGEL}
        x={330}
        y={470}
        w={460}
        at={C(id, "favorite part")}
        out={dream - 0.1}
        flipAt={C(id, "darksteel angel")}
        rot={-4}
      />
      <Callout
        label="DARKSTEEL ANGEL"
        text="You can't lose the game and [[your opponents can't win the game]]."
        x={620}
        y={200}
        w={620}
        at={C(id, "darksteel angel says")}
        out={dream - 0.1}
        size={38}
      />
      <Friend
        x={900}
        y={640}
        back="charcoal"
        at={C(id, "the angel goes")}
        out={dream - 0.1}
        scale={0.6}
        name="has the Angel"
      />
      <PaperArrow
        x1={1000}
        y1={330}
        x2={1500}
        y2={640}
        at={C(id, "people who can't win")}
        out={dream - 0.1}
        bend={-120}
      />
      <Sticker
        text="YOU CAN'T WIN"
        x={1250}
        y={548}
        at={C(id, "people who can't win")}
        out={dream - 0.1}
        size={52}
        bg="#fff"
        color={ACCENT}
        rot={6}
      />
      <Sticker
        text="LOVE THAT FOR YOU"
        x={560}
        y={895}
        at={C(id, "love that")}
        out={dream - 0.1}
        size={56}
        color={GOLD}
        rot={-3}
        wobble
      />
      <Sticker
        text="INDESTRUCTIBLE"
        x={330}
        y={690}
        at={C(id, "indestructible")}
        out={dream - 0.1}
        size={44}
        bg="#fff"
        color={INK}
        rot={-5}
        stamp
      />
      <Sticker
        text="HOLD THAT THOUGHT…"
        x={1180}
        y={130}
        at={C(id, "hold that thought")}
        out={dream - 0.1}
        size={40}
        bg="#ffe16b"
        color={INK}
        rot={4}
      />

      <CardImg
        src={ARCHON}
        x={330}
        y={470}
        w={460}
        at={dream}
        out={out}
        rot={3}
        from="right"
      />
      <Callout
        label="ARCHON OF CRUELTY"
        text="…target opponent… [[loses 3 life]]. [[You draw a card]] and gain 3 life."
        x={620}
        y={180}
        w={620}
        at={C(id, "archon of cruelty")}
        out={out}
      />
      {t > C(id, "lose three life") && t < out && (
        <div
          {...audit("label", "each opponent: " + life, C(id, "lose three life"), 1)}
          style={{
            position: "absolute",
            left: 640,
            top: 530,
            width: 230,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: HAND, fontSize: 30, color: INK }}>
            each opponent
          </div>
          <div
            style={{
              fontFamily: BLOCK,
              fontSize: 120,
              color: life <= 10 ? ACCENT : INK,
            }}
          >
            {life}
          </div>
        </div>
      )}
      {t > C(id, "draw a card") && t < out && (
        <div
          {...audit("label", "your library", C(id, "draw a card"), 1)}
          style={{
            position: "absolute",
            left: 960,
            top: 520,
            width: 260,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: HAND, fontSize: 30, color: INK }}>
            your library
          </div>
          <div
            style={{
              position: "relative",
              height: 150,
              margin: "10px auto",
              width: 120,
            }}
          >
            {Array.from({ length: Math.ceil(lib / 10) }, (_, k) => (
              <div
                key={k}
                style={{ position: "absolute", left: 0, top: 110 - k * 14 }}
              >
                <CardBackFace w={120} />
              </div>
            ))}
          </div>
          <div
            style={{
              fontFamily: BLOCK,
              fontSize: 60,
              color: lib < 15 ? ACCENT : INK,
              marginTop: 40,
            }}
          >
            {lib}
          </div>
        </div>
      )}
      <Sticker
        text="~40 COPIES"
        x={880}
        y={450}
        at={C(id, "around 40")}
        out={out}
        size={60}
        color={GOLD}
        rot={-5}
      />
      <Sticker
        text="COUNT YOUR LIBRARY!"
        x={590}
        y={872}
        at={C(id, "count your library")}
        out={out}
        size={50}
        color={ACCENT}
        rot={3}
        wobble
      />

      {(["navy", "kraft", "charcoal"] as const).map((b, i) => (
        <React.Fragment key={b}>
          <Friend
            x={640 + i * 220}
            y={700}
            back={b}
            at={C(id, "every creature dack finds") + i * 0.12}
            out={C(id, "darksteel angel says") - 0.1}
            scale={0.45}
          />
          <FlyCard
            x1={330}
            y1={470}
            x2={640 + i * 220}
            y2={600}
            at={C(id, "different opponent") + 0.3 + i * 0.2}
            out={C(id, "darksteel angel says") - 0.1}
          />
        </React.Fragment>
      ))}
      <CardImg
        src={VENSER}
        x={620}
        y={600}
        w={130}
        at={C(id, "flips venser and the angel")}
        out={C(id, "the angel goes") - 0.1}
        rot={-6}
        from="pop"
      />
      <CardImg
        src={ANGEL}
        x={780}
        y={600}
        w={130}
        at={C(id, "flips venser and the angel") + 0.25}
        out={C(id, "the angel goes") - 0.1}
        rot={6}
        from="pop"
      />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <CardImg
          key={k}
          src={VENSER}
          x={400 + k * 56}
          y={720 + (k % 2) * 18}
          w={80}
          at={C(id, "board full of") + k * 0.08}
          out={C(id, "love that") - 0.05}
          rot={(k - 2.5) * 5}
          from="pop"
        />
      ))}
      <Sticker
        text="NO ATTACK NEEDED"
        x={880}
        y={420}
        at={C(id, "don't even need to attack")}
        out={C(id, "lose three life") - 0.1}
        size={46}
        bg="#fff"
        color={INK}
        rot={-3}
      />
      <Sticker
        text="YOU: CAN'T LOSE ✓"
        x={885}
        y={532}
        at={C(id, "you can't lose the game")}
        out={C(id, "flips venser and the angel") - 0.1}
        size={40}
        bg="#fff"
        color="#1f7a3a"
        rot={-3}
      />
      <Sticker
        text="OPPONENTS: CAN'T WIN ✗"
        x={940}
        y={648}
        at={C(id, "opponents can't win the game")}
        out={C(id, "flips venser and the angel") - 0.1}
        size={40}
        bg="#fff"
        color={ACCENT}
        rot={3}
      />
    </>
  );
};

/** Paper card standing in for a triggered ability on the stack. */
const TriggerCard: React.FC<{
  x: number;
  y: number;
  at: number;
  out?: number;
  fizzleAt?: number;
  target?: string;
}> = ({ x, y, at, out, fizzleAt, target = "the original Venser" }) => {
  const { t, fps } = useT();
  out = holdOut(at, out, readSecs("VENSER TRIGGER target: " + target));
  const p = pop(t, fps, at, out, 10);
  if (p <= 0.001) return null;
  const f = fizzleAt === undefined ? 0 : ramp(t, fizzleAt, fizzleAt + 0.5);
  return (
    <div
      {...audit("note", "VENSER TRIGGER target: " + target, at, p)}
      style={{
        position: "absolute",
        left: x - 170,
        top: y - 120,
        width: 340,
        height: 240,
        transform: `rotate(${-3 - 8 * f}deg) scale(${p * (1 - 0.12 * f)})`,
        background: "#fffdf7",
        border: `5px solid ${INK}`,
        borderRadius: 16,
        boxShadow: "8px 10px 0 rgba(0,0,0,0.16)",
        opacity: 1 - 0.45 * f,
        padding: "18px 22px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontFamily: BLOCK, fontSize: 30, color: ACCENT }}>⚡ VENSER TRIGGER</div>
      <div style={{ fontFamily: HAND, fontSize: 34, color: INK, marginTop: 18 }}>
        target: {target}
      </div>
      <div style={{ fontFamily: HAND, fontSize: 26, color: "#6b6258", marginTop: 10 }}>
        (on the stack)
      </div>
    </div>
  );
};

const HowToStop: React.FC = () => {
  const id = "how-to-stop-it";
  const out = END(id);
  const answers = C(id, "swords to plowshares");
  const gone = C(id, "if he leaves");
  const cards: [string, string, number][] = [
    [SWORDS, "swords to plowshares", -6],
    [PATH, "path to exile", 3],
    [DESPARK, "despark", -3],
    [FATEHOLD, "fatehold charm", 6],
  ];
  return (
    <>
      <Sticker
        text="HOW TO STOP IT"
        x={700}
        y={150}
        at={sec(id).start + 0.1}
        out={answers + 0.1}
        size={84}
        bg="#ffe16b"
        color={INK}
        rot={-3}
      />
      <CardImg
        src={VENSER}
        x={880}
        y={500}
        w={340}
        at={C(id, "original venser")}
        out={gone + 0.35}
        rot={4}
        from="right"
      />
      <Sticker
        text="THEIR SIDE"
        x={880}
        y={820}
        at={C(id, "sitting on an opponent's")}
        out={gone + 0.35}
        size={40}
        bg="#fff"
        color={INK}
        rot={3}
      />
      <TriggerCard
        x={380}
        y={500}
        at={C(id, "every loop needs")}
        out={answers + 0.1}
        fizzleAt={C(id, "does nothing")}
      />
      <PaperArrow
        x1={560}
        y1={470}
        x2={740}
        y2={470}
        at={C(id, "trigger's pointing")}
        out={gone}
        bend={-90}
      />
      <Reticle x={880} y={500} at={C(id, "trigger's pointing")} out={gone} />
      <Sticker
        text="GONE!"
        x={880}
        y={500}
        at={gone}
        out={answers + 0.1}
        size={90}
        color={ACCENT}
        rot={-8}
      />
      <Sticker
        text="FIZZLES"
        x={380}
        y={500}
        at={C(id, "does nothing")}
        out={answers + 0.1}
        size={96}
        color={ACCENT}
        rot={-12}
        stamp
      />
      <Sticker
        text="CR 608.2b"
        x={380}
        y={760}
        at={C(id, "rule 608.2b")}
        out={answers + 0.1}
        size={46}
        bg="#fff"
        color={INK}
        rot={2}
      />
      {cards.map(([src, cueWord, rot], i) => (
        <CardImg
          key={src}
          src={src}
          x={290 + i * 310}
          y={475}
          w={290}
          at={C(id, cueWord)}
          out={out}
          rot={rot}
          from="bottom"
        />
      ))}
      <Sticker
        text="ALL IN THE SAME PRECON"
        x={700}
        y={140}
        at={C(id, "all in this same precon")}
        out={C(id, "hold one up") - 0.4}
        size={62}
        bg="#fff"
        color={INK}
        rot={-2}
      />
      <Sticker
        text="WORKS ON THE ANGEL TOO ✓"
        x={700}
        y={772}
        at={C(id, "that angel too")}
        out={C(id, "hold one up") - 0.1}
        size={46}
        bg="#fff"
        color="#1f7a3a"
        rot={-2}
      />
      <Sticker
        text="HOLD ONE UP"
        x={700}
        y={140}
        at={C(id, "hold one up")}
        out={out}
        size={56}
        bg="#ffe16b"
        color={INK}
        rot={3}
      />
    </>
  );
};

const VenserProblem: React.FC = () => {
  const id = "the-venser-problem";
  const out = END(id);
  return (
    <>
      <Sticker
        text="YOUR VENSER"
        x={330}
        y={170}
        at={C(id, "one more thing")}
        out={out}
        size={40}
        bg="#fff"
        color={INK}
        rot={-3}
      />
      <CardImg
        src={VENSER}
        x={330}
        y={480}
        w={360}
        at={C(id, "one more thing")}
        out={out}
        rot={-4}
        from="left"
      />
      <Sticker
        text="THEIR COPY"
        x={1050}
        y={170}
        at={C(id, "copies him")}
        out={out}
        size={40}
        bg="#fff"
        color={INK}
        rot={3}
      />
      <CardImg
        src={VENSER}
        x={1050}
        y={480}
        w={360}
        at={C(id, "copies him")}
        out={out}
        rot={4}
        from="right"
        flipAt={C(id, "copies him") + 0.2}
      />
      <PaperArrow
        x1={930}
        y1={420}
        x2={460}
        y2={420}
        at={C(id, "target your venser")}
        out={C(id, "cursed mirror") - 0.1}
        bend={-110}
      />
      <CardImg
        src={MIRROR}
        x={690}
        y={520}
        w={260}
        at={C(id, "cursed mirror")}
        out={out}
        rot={-3}
        from="pop"
      />
      <Sticker
        text="IN THIS PRECON"
        x={712}
        y={830}
        at={C(id, "cursed mirror") + 0.3}
        out={out}
        size={36}
        bg="#ffe16b"
        color={INK}
        rot={-2}
      />
      <Sticker
        text="∞"
        x={1050}
        y={820}
        at={C(id, "going infinite")}
        out={out}
        size={160}
        color={GOLD}
        rot={10}
        wobble
        stamp
      />
      <Sticker
        text="LIABILITY"
        x={300}
        y={800}
        at={C(id, "liability")}
        out={out}
        size={54}
        color={ACCENT}
        rot={-6}
      />

      <Sticker
        text="IT CAN HAPPEN TO YOU"
        x={910}
        y={330}
        at={C(id, "happen to you")}
        out={C(id, "copies him") - 0.1}
        size={42}
        bg="#fff"
        color={ACCENT}
        rot={-3}
      />
    </>
  );
};

const Problem: React.FC = () => {
  const id = "is-this-a-problem-comment-prompt";
  const out = END(id);
  const { t, fps } = useT();
  const cutting = C(id, "cutting venser");
  const table = pop(t, fps, C(id, "worry about"), cutting + 0.1);
  const worry = C(id, "worry about");
  const said = C(id, "has wizards said");
  return (
    <>
      <Sticker
        text="WIZARDS MESSED UP"
        x={960}
        y={170}
        at={sec(id).start + 0.1}
        out={worry + 0.1}
        size={84}
        bg="#fff"
        color={ACCENT}
        rot={-4}
      />
      <ProductImg
        src={DECK_BOX}
        x={380}
        y={575}
        w={340}
        at={C(id, "most precons land")}
        out={said - 0.1}
        rot={-5}
      />
      <Callout
        label="BRACKET 2 (WHERE MOST PRECONS LAND)"
        text="No [[two-card infinite]] combos."
        x={600}
        y={420}
        w={760}
        at={C(id, "bracket 2")}
        out={said - 0.1}
        size={44}
        rot={-1}
      />
      <Sticker
        text="THIS ONE SHIPS WITH ONE"
        x={1045}
        y={780}
        at={C(id, "ships with one")}
        out={said - 0.1}
        size={46}
        bg="#ffe16b"
        color={INK}
        rot={4}
      />
      <Sticker
        text="HAS WIZARDS SAID ANYTHING?"
        x={800}
        y={360}
        at={said}
        out={worry + 0.1}
        size={56}
        bg="#fff"
        color={INK}
        rot={-2}
      />
      <Sticker
        text="NOT YET"
        x={800}
        y={560}
        at={C(id, "not yet")}
        out={worry + 0.1}
        size={120}
        color={ACCENT}
        rot={-7}
      />
      <Callout
        label="PINNED COMMENT"
        text="If Wizards says anything, [[it goes here]]."
        x={440}
        y={700}
        w={720}
        at={C(id, "pin it in the comments")}
        out={worry + 0.1}
        size={38}
        rot={1}
      />
      {table > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 620,
            width: 900,
            height: 60,
            background: "#a86d3c",
            border: `5px solid ${INK}`,
            borderRadius: 14,
            transform: `scaleX(${table})`,
          }}
        />
      )}
      <Friend
        x={420}
        y={500}
        back="navy"
        at={C(id, "worry about")}
        out={cutting + 0.1}
        mouth={t > C(id, "love it") ? "open" : "smile"}
      />
      <Friend
        x={750}
        y={500}
        back="kraft"
        at={C(id, "worry about") + 0.15}
        out={cutting + 0.1}
        mouth={t > C(id, "some won't") ? "frown" : "smile"}
        brows={t > C(id, "some won't") ? "angry" : "none"}
      />
      <Friend
        x={1080}
        y={500}
        back="charcoal"
        at={C(id, "worry about") + 0.3}
        out={cutting + 0.1}
      />
      <Sticker
        text="NOT REALLY"
        x={750}
        y={130}
        at={C(id, "not really")}
        out={C(id, "tell the table")}
        size={56}
        bg="#fff"
        color={INK}
        rot={-2}
      />
      <Sticker
        text="LOTS OF LUCK"
        x={1160}
        y={250}
        at={C(id, "lot of luck")}
        out={C(id, "tell the table")}
        size={44}
        color={GOLD}
        rot={5}
      />
      <Callout
        text={`"Hey, this deck can go [[infinite by accident]], you cool with that?"`}
        x={420}
        y={120}
        w={700}
        at={C(id, "hey this deck")}
        out={cutting + 0.1}
        size={36}
        rot={-1}
      />
      <Sticker
        text="HAHA"
        x={420}
        y={330}
        at={C(id, "love it")}
        out={cutting + 0.1}
        size={44}
        color={GOLD}
        rot={-8}
      />
      <Sticker
        text="NOPE"
        x={750}
        y={330}
        at={C(id, "some won't")}
        out={cutting + 0.1}
        size={44}
        color={ACCENT}
        rot={6}
      />
      <Sticker
        text="JUST ASK"
        x={1400}
        y={330}
        at={C(id, "just ask")}
        out={cutting + 0.1}
        size={72}
        bg="#ffe16b"
        color={INK}
        rot={-8}
      />

      <CardImg
        src={VENSER}
        x={360}
        y={470}
        w={330}
        at={cutting}
        out={out}
        rot={-4}
        from="left"
      />
      <Sticker
        text="✂ CUT?"
        x={360}
        y={800}
        at={cutting + 0.3}
        out={out}
        size={50}
        color={ACCENT}
        rot={-6}
      />
      <CardImg
        src={DACK}
        x={720}
        y={470}
        w={330}
        at={C(id, "cutting dack")}
        out={out}
        rot={4}
        from="bottom"
      />
      <Sticker
        text="POLITICS!"
        x={720}
        y={158}
        at={C(id, "political")}
        out={out}
        size={60}
        color={GOLD}
        rot={-4}
        wobble
      />
      <Sticker
        text="KEEP ✓"
        x={720}
        y={800}
        at={C(id, "i'd keep him")}
        out={out}
        size={62}
        bg="#fff"
        color="#1f7a3a"
        rot={5}
      />
      <Callout
        text="[[Would you let this fly?]] Or is Venser out before game one? Tell me in the comments."
        x={950}
        y={400}
        w={540}
        at={C(id, "would you let")}
        out={out}
        size={36}
        rot={2}
      />

      {[420, 750, 1080].map((x, i) => (
        <Sticker
          key={x}
          text="?"
          x={x}
          y={330}
          at={C(id, "you cool with that") + i * 0.12}
          out={C(id, "love it") - 0.05}
          size={70}
          color={GOLD}
          rot={i % 2 ? 8 : -8}
        />
      ))}
      <Sticker
        text="FREE CREATURES FOR ALL"
        x={1290}
        y={330}
        at={C(id, "random big creature")}
        out={C(id, "i'd keep him") - 0.1}
        size={40}
        bg="#ffe16b"
        color={INK}
        rot={3}
      />

      <Sticker
        text="GOOD POINT"
        x={1150}
        y={230}
        at={C(id, "made a good point")}
        out={C(id, "random big creature") - 0.1}
        size={44}
        bg="#fff"
        color={INK}
        rot={-3}
      />
    </>
  );
};

/** Recurring end-of-video summary card: one row per takeaway, popping in with the recap. */
const VerdictCard: React.FC<{
  x: number;
  y: number;
  at: number;
  out: number;
  rows: [string, string, number][];
}> = ({ x, y, at, out, rows }) => {
  const { t, fps } = useT();
  const p = pop(t, fps, at, out, 11);
  if (p <= 0.001) return null;
  return (
    <div
      {...audit("note", "WILD CARD VERDICT", at, p)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 1000,
        transform: `rotate(-1.5deg) scale(${p})`,
        transformOrigin: "left top",
        background: "#fffdf7",
        border: `6px solid ${INK}`,
        borderRadius: 18,
        boxShadow: "12px 14px 0 rgba(0,0,0,0.16)",
        padding: "22px 34px 26px",
      }}
    >
      <div style={{ fontFamily: BLOCK, fontSize: 44, color: ACCENT, letterSpacing: 2 }}>
        WILD CARD VERDICT
      </div>
      {rows.map(([k, v, when]) => {
        const r = pop(t, fps, when, out, 10);
        return (
          <div
            key={k}
            style={{
              display: "flex",
              gap: 18,
              alignItems: "baseline",
              marginTop: 16,
              padding: "2px 8px",
              marginLeft: -8,
              borderRadius: 6,
              background: `rgba(255, 225, 107, ${0.85 * (1 - ramp(t, when + 0.3, when + 1.6))})`,
              opacity: r,
              transform: `translateX(${(1 - r) * -30}px)`,
            }}
          >
            <div style={{ fontFamily: BLOCK, fontSize: 28, color: INK, width: 250, flexShrink: 0 }}>{k}</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 32, color: INK }}>{v}</div>
          </div>
        );
      })}
    </div>
  );
};

const Close: React.FC = () => {
  const id = "close";
  const out = END(id);
  const start = sec(id).start;
  return (
    <>
      <Sticker
        text="THAT'S THE COMBO"
        x={740}
        y={110}
        at={start}
        out={C(id, "thanks for watching") - 0.1}
        size={70}
        color={INK}
        rot={-3}
        bg="#ffe16b"
      />
      <VerdictCard
        x={180}
        y={200}
        at={start + 0.3}
        out={out}
        rows={[
          ["HOW", "Dack hands Venser over", C(id, "dack hands venser")],
          ["WHY IT WORKS", "Target picked after he switches sides", C(id, "the trigger waits")],
          ["CARDS", "2 in the box (you cast 1)", C(id, "all from one box")],
          ["ODDS", "~18% when Dack resolves", C(id, "all from one box") + 0.5],
          ["STOP IT", "Exile or bounce the original Venser", C(id, "all from one box") + 1],
          ["BRACKET 2?", "Shouldn't be. Wizards messed up.", C(id, "all from one box") + 1.5],
        ]}
      />
      <Sticker
        text="THREAD LINKED BELOW ↓"
        x={500}
        y={975}
        at={C(id, "linked below")}
        out={out}
        size={48}
        bg="#fff"
        color={ACCENT}
        rot={2}
      />

      <Sticker
        text="SUBSCRIBE ↓"
        x={1170}
        y={975}
        at={C(id, "subscribe")}
        out={out}
        size={48}
        bg="#ffe16b"
        color={INK}
        rot={-3}
      />
      <Sticker
        text="THANKS FOR WATCHING!"
        x={740}
        y={98}
        at={C(id, "thanks for watching")}
        out={out}
        size={62}
        bg="#fff"
        color={ACCENT}
        rot={-3}
      />
    </>
  );
};

/** End card (no other videos yet): subscribe only. The button presses itself and the bell rings. */
const EndScreen: React.FC = () => {
  const { t, fps } = useT();
  const at = T.narrationEnd + 0.2;
  const p = pop(t, fps, at);
  if (p < 0.01) return null;
  const btn = pop(t, fps, at + 0.5);
  const pressAt = at + 2.6; // the SUBSCRIBE label stays up long enough to read before it flips
  const pressed = t >= pressAt;
  const squish = pressed ? 1 - 0.1 * (1 - ramp(t, pressAt, pressAt + 0.2)) : 1;
  const ring = pressed ? Math.sin((t - pressAt) * 22) * 16 * (1 - ramp(t, pressAt, pressAt + 1.2)) : 0;
  const tag = pop(t, fps, at + 0.9);
  return (
    <>
      <RansomTitle text="SUBSCRIBE!" x={700} y={320} at={at} size={112} />
      <div
        {...audit("sticker", pressed ? "SUBSCRIBED ✓" : "SUBSCRIBE", at + 0.5, btn)}
        style={{
          position: "absolute",
          left: 700,
          top: 560,
          transform: `translate(-50%, -50%) scale(${btn * squish})`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          fontFamily: BLOCK,
          fontSize: 60,
          color: pressed ? INK : "#fff",
          background: pressed ? "#e6e1d6" : ACCENT,
          border: `6px solid ${INK}`,
          borderRadius: 20,
          padding: "18px 44px",
          boxShadow: "10px 11px 0 rgba(0,0,0,0.2)",
          whiteSpace: "nowrap",
        }}
      >
        {pressed ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
        <span style={{ display: "inline-block", transform: `rotate(${ring}deg)`, fontSize: 56 }}>🔔</span>
      </div>
      <div
        {...audit("label", "More Commander rules, combos and hot takes.", at + 0.9, tag)}
        style={{
          position: "absolute",
          left: 700,
          top: 720,
          transform: `translate(-50%, -50%) scale(${tag})`,
          fontFamily: HAND,
          fontSize: 42,
          color: INK,
          whiteSpace: "nowrap",
        }}
      >
        More Commander rules, combos and hot takes.
      </div>
    </>
  );
};

// ---------------------------------------------------------------- Wil's performance

const WIL_EVENTS: WilEvent[] = [
  { at: C("intro-and-promise", "hello everyone"), anim: "enter" },
  // the entrance is 40 frames: the shades drop once he has landed, not halfway through it
  { at: Math.max(C("intro-and-promise", "wild card commander"), C("intro-and-promise", "hello everyone") + 1.35), anim: "deal-with-it" },
  { at: C("intro-and-promise", "going nuts"), anim: "shocked" },
  { at: C("the-two-cards", "you reveal"), anim: "draw" },
  { at: C("the-two-cards", "merry christmas"), anim: "laugh" },
  { at: C("the-combo", "they control him"), anim: "peek" },
  { at: C("the-combo", "unlimited mana"), anim: "mind-blown" },
  { at: C("the-combo", "they all get sacrificed"), anim: "nervous-sweat" },
  { at: C("the-combo", "you only cast one"), anim: "point" },
  { at: C("subscribe-segment", "quick quiz"), anim: "thinking" },
  { at: C("the-combo", "himself"), anim: "shocked" },
  { at: C("the-combo", "legend rule"), anim: "facepalm" },
  { at: C("the-combo", "keeps going"), anim: "infinite-combo" },
  { at: C("the-combo", "then swing"), anim: "celebrate" },
  { at: C("the-gap", "it's when it goes"), anim: "peek" },
  { at: C("the-gap", "whole reason"), anim: "big-brain" },
  { at: C("the-odds", "three in seventeen"), anim: "coin-flip" },
  { at: C("the-odds", "help it along"), anim: "draw" },
  { at: C("the-odds", "lots of ifs"), anim: "shrug" },
  { at: C("the-catch", "there's a catch"), anim: "peek" },
  { at: C("the-catch", "not allowed"), anim: "facepalm" },
  { at: C("the-catch", "count your library"), anim: "nervous-sweat", hold: 1 },
  { at: C("how-to-stop-it", "does nothing"), anim: "deal-with-it" },
  { at: C("how-to-stop-it", "swords to plowshares"), anim: "point" },
  { at: C("the-venser-problem", "one more thing"), anim: "sip-tea" },
  { at: C("is-this-a-problem-comment-prompt", "mess up"), anim: "facepalm" },
  {
    at: C("is-this-a-problem-comment-prompt", "worry about"),
    anim: "thinking",
  },
  { at: C("is-this-a-problem-comment-prompt", "just ask"), anim: "yes" },
  {
    at: C("is-this-a-problem-comment-prompt", "would you let"),
    anim: "comment",
  },
  { at: C("close", "linked below"), anim: "link-below" },
  // reactions start at least 2.5 s apart (qa_layout: WIL REACTIONS TOO CLOSE), so the wave waits for the bell
  { at: Math.max(C("close", "thanks for watching"), C("close", "subscribe") + 2.5), anim: "wave" },
  { at: C("close", "subscribe"), anim: "bell" },
  { at: T.narrationEnd + 2.6, anim: "bell" },
];

/**
 * Wil D. Card as host: off-stage during the cold open, bounces in centre-stage on "Hello everyone",
 * slides down to his corner on "Today…", and steps out while the subscribe overlay (which has its own Wil) plays.
 */
const WilHost: React.FC<{ subStart: number }> = ({ subStart }) => {
  const { t } = useT();
  const hello = C("intro-and-promise", "hello everyone");
  const move = C("intro-and-promise", "today");
  // drawn from the first frame of his entrance only (from hello - 0.05 he flashed on screen for
  // two frames in his resting pose, vanished, then popped up: the "glitch at 9 seconds")
  if (t < hello) return null;
  // the subscribe overlay brings its own Wil: fade ours out as it slides in, and back once it leaves
  const away = ramp(t, subStart - 0.25, subStart) * (1 - ramp(t, subStart + 4.4, subStart + 4.7));
  if (away > 0.999) return null;
  const k = 1 - Math.pow(1 - ramp(t, move, move + 0.7), 3);
  const x = 960 + (1640 - 960) * k;
  const y = 700 + (820 - 700) * k;
  const scale = 2 + (1.25 - 2) * k;
  return (
    <div style={{ opacity: 1 - away }}>
      <Wil timing={T} events={WIL_EVENTS} x={x} y={y} scale={scale} voice={voiceJson as Voice} looks={looksJson as number[]} expression={expressionJson as unknown as Expression} />
    </div>
  );
};

// ---------------------------------------------------------------- composition

export const Ep002: React.FC<{ audit?: boolean }> = ({ audit: auditOn = false }) => {
  const fps = 30;
  const sub = T.sections.find((s) => s.id === "subscribe-segment")!;
  return (
    <AbsoluteFill style={{ background: "#ffffff", overflow: "hidden" }}>
      {/* full-stage marker: the audit measures every element relative to this box */}
      <div {...audit("root", "stage", 0, 1)} style={{ position: "absolute", inset: 0 }} />
      {/* Wil's narration (cloned voice; timing.json comes from this exact file) */}
      <Audio src={staticFile("ep002/narration.wav")} />
      <ColdOpen />
      <Intro />
      <Fit box={[100, 110, 1336, 746]} sec="the-two-cards" punches={[C("the-two-cards", "merry christmas"), C("the-two-cards", "one of his modes")]}>
        <TwoCards />
      </Fit>
      <Fit box={[118, 70, 1306, 906]} sec="the-combo" punches={[C("the-combo", "himself"), C("the-combo", "legend rule"), C("the-combo", "unlimited mana"), C("the-combo", "endless copies"), C("the-combo", "then swing"), C("the-combo", "it's two cards")]}>
        <Combo />
      </Fit>
      <Subscribe />
      <Fit box={[110, 76, 1330, 915]} sec="the-gap" punches={[C("the-gap", "not when it triggers"), C("the-gap", "tiny gap")]}>
        <Gap />
      </Fit>
      <Fit box={[144, 110, 1274, 834]} sec="the-odds" punches={[C("the-odds", "about 18 percent"), C("the-odds", "every time")]}>
        <Odds />
      </Fit>
      {/* not scaled: its arrow has to land on Wil */}
      <Fit box={[160, 102, 1384, 882]} max={1} sec="the-catch" punches={[C("the-catch", "count your library")]}>
        <Catch />
      </Fit>
      <Fit box={[160, 60, 1230, 915]} sec="how-to-stop-it" punches={[C("how-to-stop-it", "does nothing"), C("how-to-stop-it", "all in this same precon")]}>
        <HowToStop />
      </Fit>
      <Fit box={[100, 110, 1240, 930]} max={1.15} sec="the-venser-problem" punches={[C("the-venser-problem", "target your venser"), C("the-venser-problem", "going infinite")]}>
        <VenserProblem />
      </Fit>
      <Fit box={[190, 76, 1456, 856]} sec="is-this-a-problem-comment-prompt" punches={[C("is-this-a-problem-comment-prompt", "ships with one"), C("is-this-a-problem-comment-prompt", "not yet")]}>
        <Problem />
      </Fit>
      <Fit box={[170, 60, 1300, 1010]} sec="close">
        <Close />
      </Fit>
      <EndScreen />
      <Sequence from={Math.round(sub.start * fps)} durationInFrames={135}>
        <SubscribeBeat
          line="New channel. Subscribing helps!"
          accent={ACCENT}
          background={null}
        />
      </Sequence>
      <WilHost subStart={sub.start} />
      {auditOn && <AuditProbe every={3} />}
    </AbsoluteFill>
  );
};
