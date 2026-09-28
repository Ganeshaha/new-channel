import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SubscribeBeat } from "../../SubscribeBeat";
import {
  ACCENT,
  ArtPanel,
  audit,
  AuditProbe,
  BLOCK,
  Callout,
  CardBackFace,
  CardImg,
  Confetti,
  cue,
  FlyCard,
  Friend,
  GOLD,
  HAND,
  INK,
  PaperArrow,
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
} from "../kit";
import { BackFan, Burst, Cabbage, CabbagePile, Chip, Counter, Die, Flash, IceCounters, Pip, PriceTag, smooth, Tapped, TurnTrack, Wall } from "./parts";
import timingJson from "./timing.json";
import voiceJson from "./voice.json";
import looksJson from "./looks.json";
import expressionJson from "./expression.json";

// Episode 003: "The Cabbage Converter", a deck tech of The Cabbage Merchant.
// White stage, Wil D. Card bottom-right, every beat cued to a spoken phrase (timing.json).
// timing.json, voice.json and expression.json come from the real narration (scripts/ep003_narration.py timing,
// scripts/wil_director.py); looks.json from the layout audit (scripts/wil_looks.py).

const T = timingJson as Timing;
const C = (id: string, phrase: string, nth = 0) => cue(T, id, phrase, nth);
const sec = (id: string) => T.sections.find((s) => s.id === id)!;
/** When a scene's last elements leave: just after the next section starts (a handoff, never a blank stage). */
const END = (id: string) => {
  const i = T.sections.findIndex((s) => s.id === id);
  const next = T.sections[i + 1];
  return Math.max(sec(id).end + 0.35, next ? next.start + 0.3 : 0);
};
export const EP003_SECONDS = Math.ceil(T.narrationEnd + 18);

const card = (n: string) => `ep003/cards/${n}.png`;
const art = (n: string) => `ep003/art/${n}.jpg`;
const MERCHANT = card("the-cabbage-merchant");
const ELVES = card("llanowar-elves");
const FOREST = card("forest");
const BELL = card("temple-bell");
const MINE = card("howling-mine");
const HARMONIZE = card("harmonize");
const FOUNDRY = card("retrofitter-foundry");
const ARCH = card("arch-of-orazca");
const PACKMASTER = card("wrens-run-packmaster");
const DEPTHS = card("dark-depths");
const DINOS = card("displaced-dinosaurs");
const SOL = card("sol-ring");
const CART = card("hot-dog-cart");
const HALSIN = card("halsin-emerald-archdruid");
const IDOL = card("idol-of-oblivion");
const SWEETS = card("night-of-the-sweets-revenge");
const KARN = card("karn-living-legacy");
const MANUFACTOR = card("academy-manufactor");
const CLOCK = card("clock-of-omens");
const SARINTH = card("sarinth-steelseeker");
const HARVEST = card("second-harvest");
const JAHEIRA = card("jaheira-friend-of-the-forest");
const PEREGRIN = card("peregrin-took");
const GRASS = card("elephant-grass");
const UNWINDING = card("unwinding-clock");
const FOMORI = card("fomori-vault");
const FAIR = card("inventors-fair");
const VOYAGE = card("collective-voyage");
const HORN = card("horn-of-greed");
const SEASON = card("doubling-season");
const LIVES = card("parallel-lives");
const VIGOR = card("primal-vigor");
const T_FOOD = card("token-food-1");
const T_BEAR = card("token-bear");
const T_WOLF = card("token-wolf");
const T_CONSTRUCT = card("token-construct");
const T_TREASURE = card("token-treasure");
const T_CLUE = card("token-clue");
const T_ELDRAZI = card("token-eldrazi");
const T_MARIT = card("token-marit-lage");

// ---------------------------------------------------------------- layout

type Box = [number, number, number, number];
/** The free stage left of Wil's corner, sized so the deepest camera zoom stays title-safe (as Ep002). */
const STAGE: Box = [84, 70, 1380, 1010];
/** Slow push-in across a section plus quick punch-ins on key lines. Scenes are laid out in stage coordinates. */
const Cam: React.FC<{ sec: string; punches?: number[]; shakes?: number[]; children: React.ReactNode }> = ({ sec: id, punches = [], shakes = [], children }) => {
  const { t } = useT();
  const [sx0, sy0, sx1, sy1] = STAGE;
  // no slow drift: the top channels' frames sit still between beats (research/pacing)
  const drift = 1;
  const punch = punches.reduce((acc, p) => {
    const inn = 1 - Math.pow(1 - ramp(t, p, p + 0.22), 3);
    const back = ramp(t, p + 1.5, p + 1.9);
    return acc * (1 + 0.06 * inn * (1 - back));
  }, 1);
  return (
    <AbsoluteFill style={{ transform: `${shake(t, shakes)} scale(${drift * punch})`, transformOrigin: `${(sx0 + sx1) / 2}px ${(sy0 + sy1) / 2}px` }}>
      {children}
    </AbsoluteFill>
  );
};

/** An impact: a short decaying shake of the whole stage (Wil sits outside it, so he never jitters). */
const shake = (t: number, times: number[]) => {
  let dx = 0,
    dy = 0;
  for (const s of times) {
    const d = t - s;
    if (d < 0 || d > 0.4) continue;
    const a = 11 * (1 - d / 0.4);
    dx += a * Math.sin(d * 55);
    dy += a * 0.6 * Math.cos(d * 47);
  }
  return `translate(${dx}px, ${dy}px)`;
};

/** A thrown card back that disappears when it lands (FlyCard without an out stays put forever). */
const Toss: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; dur?: number; w?: number }> = ({ dur = 0.6, ...p }) => (
  <FlyCard {...p} dur={dur} out={p.at + dur + 0.05} />
);

/** Chapter sticker for the four promised parts ("2/4  BY TURN FIVE"). */
const Chapter: React.FC<{ n: number; text: string; at: number; out: number; x?: number; y?: number }> = ({ n, text, at, out, x = 560, y = 120 }) => (
  <Sticker text={`${n}/4  ${text}`} x={x} y={y} at={at} out={out} size={46} bg="#ffe16b" color={INK} rot={-3} />
);

// ---------------------------------------------------------------- 1. cold open

const ColdOpen: React.FC = () => {
  const id = "cold-open";
  const { t } = useT();
  const hello = C("intro", "hello everyone");
  const exit = (i: number) => hello - 0.05 + i * 0.06;
  // the Merchant opens the video centred and big, then glides left as the cabbages arrive
  const move = C(id, "you watch") - 0.3;
  const k = smooth(ramp(t, move, move + 0.7));
  const push = 1 + 0.04 * ramp(t, 0, move);
  const w = (600 + (470 - 600) * k) * push;
  return (
    <>
      <CardImg src={MERCHANT} x={960 + (400 - 960) * k} y={545 + (570 - 545) * k} w={w} at={-0.4} out={exit(0)} rot={-4} />
      <CabbagePile x={1080} y={960} cols={6} size={110} keys={[[C(id, "you watch"), 0], [C(id, "crash and burn"), 14]]} scatterAt={C(id, "crash and burn") + 0.45} out={C(id, "and you scream") + 0.5} />
      <RansomTitle text="MY CABBAGES!" x={960} y={115} at={C(id, "and you scream")} out={C(id, "every game")} size={84} stagger={0.03} />
      <Sticker text="5TH TIME THIS WEEK" x={1080} y={330} at={C(id, "fifth time")} out={C(id, "another plan") + 0.1} size={52} bg="#fff" color={ACCENT} rot={4} />
      <Cabbage x={1080} y={640} size={230} at={C(id, "every game")} out={C(id, "but what if") + 0.1} rot={-10} />
      <Sticker text="RIP" x={1080} y={660} at={C(id, "another cabbage gone")} out={C(id, "but what if") + 0.1} size={110} color={ACCENT} rot={-14} stamp />
      <CabbagePile x={1080} y={960} cols={6} size={105} keys={[[C(id, "stopped losing"), 0], [C(id, "weaponizing") - 0.2, 15]]} out={exit(2)} />
      <Reticle x={1080} y={700} at={C(id, "weaponizing")} out={exit(3)} r={150} />
      <Confetti x={1080} y={560} at={C(id, "weaponizing") + 0.25} />
    </>
  );
};

// ---------------------------------------------------------------- 2. intro

const Intro: React.FC = () => {
  const id = "intro";
  const out = END(id);
  const { t } = useT();
  const convOut = C(id, "i once turned") + 0.1;
  const bearsOut = C(id, "and the whole thing") + 0.1;
  const priceOut = C(id, "okay i tap") + 0.1;
  const tapOut = C(id, "one what hand") + 0.1;
  const listOut = C(id, "by the end") + 0.1;
  const walk = C(id, "walked over");
  const friendX = 960 + (1140 - 960) * smooth(ramp(t, walk, walk + 1.6));
  return (
    <>
      <RansomTitle text="WIL D. CARD" x={420} y={560} at={C(id, "this is wil") + 0.25} out={C(id, "and welcome") + 0.1} size={60} />
      {/* the converter: one cabbage in, robots / bears / wolves / dinosaurs out */}
      <RansomTitle text="CABBAGE CONVERTER" x={732} y={140} at={C(id, "cabbage converter")} out={C(id, "nuclear weapons") - 0.2} size={56} stagger={0.03} />
      <Cabbage x={210} y={560} size={190} at={C(id, "ordinary cabbages")} out={convOut} />
      <PaperArrow x1={300} y1={560} x2={340} y2={560} at={C(id, "turn them into")} out={convOut} bend={-40} />
      <CardImg src={T_CONSTRUCT} x={470} y={560} w={250} at={C(id, "robots")} out={convOut} rot={-8} from="bottom" />
      <CardImg src={T_BEAR} x={740} y={560} w={250} at={C(id, "bears")} out={convOut} rot={6} from="bottom" />
      <CardImg src={T_WOLF} x={1010} y={560} w={250} at={C(id, "wolves")} out={convOut} rot={-5} from="bottom" />
      <CardImg src={DINOS} x={1260} y={560} w={230} at={C(id, "even dinosaurs")} out={convOut} rot={7} from="bottom" />
      <Sticker text="NUCLEAR WEAPONS" x={732} y={170} at={C(id, "nuclear weapons")} out={convOut} size={64} color={GOLD} rot={-4} />
      {/* 73 bears, and an opponent who needs a minute with a wall */}
      <CabbagePile x={470} y={990} cols={9} size={88} keys={[[C(id, "i once turned"), 0], [C(id, "into bears"), 36]]} badge="4/4" badgeAt={C(id, "into bears")} out={bearsOut} />
      <Counter x={470} y={260} keys={[[C(id, "73 cabbages"), 0], [C(id, "73 cabbages") + 1.0, 73]]} out={bearsOut} size={70} />
      <CardImg src={T_BEAR} x={1050} y={470} w={330} at={C(id, "into bears")} out={C(id, "my opponent got") + 0.1} rot={8} from="right" />
      <Wall x={1300} y={330} w={70} h={560} at={C(id, "my opponent got")} out={bearsOut} />
      <Friend x={friendX} y={620} back="kraft" at={C(id, "my opponent got")} out={bearsOut} scale={1.0} mouth={t > walk + 1.6 ? "flat" : "o"} />
      <Sticker text="5 MINUTES" x={1060} y={300} at={C(id, "five minutes")} out={bearsOut} size={56} bg="#fff" color={INK} rot={-5} />
      {/* the price */}
      <PriceTag text="$214" x={480} y={470} at={C(id, "and the whole thing")} out={priceOut} size={150} />
      <CardImg src={MERCHANT} x={1060} y={545} w={420} at={C(id, "thirty of that")} out={priceOut} rot={6} from="bottom" />
      <PriceTag text="$30" x={1160} y={330} at={C(id, "thirty of that") + 0.45} out={priceOut} size={70} rot={10} stamp />
      {/* "Okay, I tap twenty cabbages" */}
      <Callout label="ME" text="“Okay, I tap [[twenty cabbages]].”" x={130} y={130} w={600} at={C(id, "okay i tap")} out={tapOut} size={40} />
      <CabbagePile x={430} y={960} cols={7} size={92} keys={[[C(id, "i wanted to sit"), 0], [C(id, "okay i tap"), 20]]} tapAt={C(id, "twenty cabbages")} tapN={20} out={tapOut} />
      {([[880, "navy"], [1080, "kraft"], [1280, "charcoal"]] as const).map(([x, back], i) => (
        <Friend key={back} x={x} y={470} back={back} at={C(id, "watch everyone's faces") + i * 0.12} out={tapOut} scale={0.82} mouth="o" brows="raised" />
      ))}
      <CabbagePile x={1090} y={1000} cols={7} size={86} keys={[[C(id, "bury your friends"), 0], [C(id, "bury your friends") + 1.3, 28]]} out={tapOut} />
      {/* the promise: four things, and one secret win con that should never work */}
      {(
        [
          ["one what hand", "1  WHAT HAND TO KEEP"],
          ["two what you", "2  YOUR GAME BY TURN 5"],
          ["three how to win", "3  HOW TO WIN (+3 SECRET WAYS)"],
          ["and four", "4  CARDS THAT SING + UPGRADES"],
        ] as const
      ).map(([w, label], i) => (
        <Sticker key={i} text={label} x={560} y={250 + i * 140} at={C(id, w)} out={listOut} size={44} bg={i === 2 ? "#ffe16b" : "#fff"} color={INK} rot={i % 2 ? 2 : -2} />
      ))}
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        {t >= C(id, "one of those secret") && t < listOut + 0.3 && (
          <div
            {...audit("card", "secret card back", C(id, "one of those secret"), pop(t, 30, C(id, "one of those secret"), listOut, 11))}
            style={{ position: "absolute", left: 1210 - 125, top: 470 - 175, transform: `rotate(6deg) scale(${pop(t, 30, C(id, "one of those secret"), listOut, 11)})`, filter: "drop-shadow(8px 10px 0 rgba(0,0,0,0.16))" }}
          >
            <CardBackFace w={250} />
          </div>
        )}
      </div>
      <Sticker text="?" x={1210} y={470} at={C(id, "one of those secret") + 0.3} out={C(id, "but it does") - 0.1} size={150} color={GOLD} rot={8} stamp />
      <Sticker text="SHOULD NEVER WORK" x={1100} y={840} at={C(id, "should never work")} out={listOut} size={44} bg="#fff" color={ACCENT} rot={-4} />
      <Sticker text="IT DOES" x={1210} y={560} at={C(id, "but it does")} out={listOut} size={70} color={ACCENT} rot={-12} stamp />
      {/* cabbage master */}
      <CardImg src={MERCHANT} x={380} y={560} w={430} at={C(id, "by the end")} out={out} rot={-5} from="left" />
      <RansomTitle text="CABBAGE MASTER" x={900} y={150} at={C(id, "cabbage master")} out={out} size={62} stagger={0.03} />
      <Callout label="EVERYONE" text="“Wait… [[how many cabbages?]]”" x={690} y={480} w={560} at={C(id, "wait how many")} out={out} size={40} rot={2} />
    </>
  );
};

// ---------------------------------------------------------------- 3. the commander

const Merchant: React.FC = () => {
  const id = "the-cabbage-merchant";
  const out = END(id);
  const spellOut = C(id, "cabbages are foods") + 0.1;
  const tokenOut = C(id, "one little downside") + 0.1;
  return (
    <>
      <CardImg src={MERCHANT} x={380} y={545} w={560} at={sec(id).start + 0.35} out={out} rot={-3} from="pop" />
      <Sticker text="3 MANA · MONO-GREEN" x={1010} y={150} at={C(id, "three mana")} out={C(id, "whenever an opponent") + 0.4} size={42} bg="#fff" color={INK} rot={-2} />
      <Friend x={1190} y={400} back="navy" at={C(id, "whenever an opponent")} out={spellOut} scale={0.95} name="OPPONENT" mouth="grin" />
      <Toss x1={1190} y1={400} x2={920} y2={580} at={C(id, "noncreature spell")} dur={0.5} w={90} />
      <Cabbage x={920} y={580} size={170} at={C(id, "we make a food")} out={C(id, "and we can tap") + 0.1} />
      <Sticker text="= A CABBAGE" x={930} y={790} at={C(id, "that's a cabbage")} out={C(id, "and we can tap") + 0.1} size={52} bg="#fff" color={ACCENT} rot={3} />
      <CabbagePile x={870} y={690} cols={2} size={140} keys={[[C(id, "and we can tap"), 2]]} tapAt={C(id, "tap two cabbages") + 0.2} tapN={2} out={spellOut} />
      <PaperArrow x1={1000} y1={640} x2={1110} y2={720} at={C(id, "for one mana")} out={spellOut} bend={-50} />
      <Pip x={1200} y={740} sym="✦" at={C(id, "for one mana") + 0.3} out={spellOut} size={120} color={GOLD} />
      <CardImg src={T_FOOD} x={1060} y={470} w={330} at={C(id, "cabbages are foods")} out={tokenOut} rot={5} from="right" />
      <Sticker text="ARTIFACT + TOKEN" x={1060} y={820} at={C(id, "artifacts and tokens")} out={tokenOut} size={52} bg="#ffe16b" color={INK} rot={-3} />
      <Callout label="THE DOWNSIDE" text="Whenever a creature deals combat damage to you, [[sacrifice a Food token]]." x={730} y={200} w={600} at={C(id, "one little downside")} out={out} size={36} rot={1} />
      <Sticker text="FIXED LATER ✓" x={1030} y={720} at={C(id, "we've got it covered")} out={out} size={54} bg="#fff" color="#1f7a3a" rot={-4} />
    </>
  );
};

// ---------------------------------------------------------------- 4. the game plan

const GamePlan: React.FC = () => {
  const id = "the-game-plan";
  const out = END(id);
  const pileOut = C(id, "we help our") + 0.1;
  return (
    <>
      <CabbagePile x={732} y={1000} cols={13} size={96} keys={[[sec(id).start, 3], [C(id, "absurd amount"), 20], [C(id, "i'm talking"), 70]]} out={pileOut} />
      <Counter x={732} y={170} keys={[[C(id, "absurd amount"), 20], [C(id, "i'm talking"), 99]]} out={pileOut} size={72} />
      <Sticker text="TOKENS: SOLD OUT" x={732} y={330} at={C(id, "the store ran out")} out={pileOut} size={58} bg="#fff" color={ACCENT} rot={-4} />
      <Die x={330} y={520} n={5} at={C(id, "dice")} out={pileOut} rot={-12} />
      <Die x={450} y={470} n={3} at={C(id, "dice") + 0.15} out={pileOut} rot={14} />
      <Chip x={1010} y={500} color={ACCENT} at={C(id, "poker chips")} out={pileOut} />
      <Chip x={1130} y={470} color="#2b3d68" at={C(id, "poker chips") + 0.15} out={pileOut} />
      <Chip x={1080} y={560} color={GOLD} at={C(id, "poker chips") + 0.3} out={pileOut} />
      {/* the plan, as three steps */}
      <Sticker text="1  GROUP HUG" x={420} y={250} at={C(id, "we help our")} out={out} size={50} bg="#fff" color={INK} rot={-2} />
      <Sticker text="2  STACK CABBAGES" x={480} y={470} at={C(id, "we stack cabbages")} out={out} size={50} bg="#fff" color={INK} rot={2} />
      <Sticker text="3  DUMBEST PLAYS EVER" x={510} y={690} at={C(id, "dumbest plays")} out={out} size={50} bg="#ffe16b" color={INK} rot={-2} />
      <CardImg src={MINE} x={1150} y={330} w={260} at={C(id, "group hug") + 0.2} out={C(id, "we stack cabbages") + 0.1} rot={6} from="right" />
      <CabbagePile x={1120} y={930} cols={5} size={88} keys={[[C(id, "we stack cabbages"), 0], [C(id, "harvest season"), 18]]} out={out} />
      <CardImg src={DINOS} x={1150} y={330} w={260} at={C(id, "dumbest plays")} out={out} rot={-6} from="top" />
    </>
  );
};

// ---------------------------------------------------------------- 5. opening hands

const OpeningHands: React.FC = () => {
  const id = "opening-hands";
  const out = END(id);
  const curveOut = C(id, "don't be afraid") + 0.1;
  const handOut = C(id, "second we want") + 0.1;
  return (
    <>
      <Chapter n={1} text="WHAT HAND TO KEEP" at={sec(id).start} out={C(id, "two things") + 0.2} />
      <Sticker text="ONLY 2 THINGS" x={700} y={470} at={C(id, "two things")} out={C(id, "first and most") + 0.1} size={96} color={GOLD} rot={-5} />
      <Sticker text="1  CABBAGE MAN, FAST" x={470} y={130} at={C(id, "first and most")} out={C(id, "second we want") - 0.45} size={46} bg="#fff" color={INK} rot={-2} />
      <CardImg src={MERCHANT} x={732} y={580} w={400} at={C(id, "the cabbage merchant out")} out={C(id, "one-mana dork") + 0.1} rot={4} from="bottom" />
      <Sticker text="ASAP" x={900} y={400} at={C(id, "as fast as possible")} out={C(id, "one-mana dork") + 0.1} size={90} color={ACCENT} rot={-12} stamp />
      {/* the curve: land + dork, then land + Merchant */}
      <Sticker text="TURN 1" x={375} y={330} at={C(id, "on turn one")} out={curveOut} size={44} bg="#ffe16b" color={INK} rot={-3} />
      <Sticker text="TURN 2" x={1005} y={330} at={C(id, "on turn two")} out={curveOut} size={44} bg="#ffe16b" color={INK} rot={3} />
      <CardImg src={FOREST} x={230} y={610} w={260} at={C(id, "and two lands")} out={curveOut} rot={-6} from="bottom" />
      <CardImg src={ELVES} x={520} y={610} w={260} at={C(id, "one-mana dork")} out={curveOut} rot={5} from="bottom" />
      <CardImg src={FOREST} x={860} y={610} w={260} at={C(id, "then land and")} out={curveOut} rot={-4} from="bottom" />
      <CardImg src={MERCHANT} x={1150} y={610} w={260} at={C(id, "land and cabbage merchant")} out={curveOut} rot={6} from="bottom" />
      <BackFan x={720} y={760} n={7} w={170} at={C(id, "don't be afraid")} out={C(id, "i once kept") + 0.1} drop={2} dropAt={C(id, "five or six cards")} />
      <Sticker text="MULLIGAN TO 5 OR 6? FINE." x={720} y={480} at={C(id, "don't be afraid")} out={C(id, "i once kept") + 0.1} size={58} bg="#fff" color={INK} rot={-3} />
      {/* the four-card hand */}
      <Sticker text="4 CARDS. THAT'S IT." x={720} y={290} at={C(id, "i once kept")} out={handOut} size={50} bg="#fff" color={ACCENT} rot={2} />
      <CardImg src={FOREST} x={270} y={620} w={270} at={C(id, "forest forest")} out={handOut} rot={-9} from="bottom" />
      <CardImg src={FOREST} x={560} y={620} w={270} at={C(id, "forest llanowar")} out={handOut} rot={-3} from="bottom" />
      <CardImg src={ELVES} x={850} y={620} w={270} at={C(id, "llanowar elves")} out={handOut} rot={3} from="bottom" />
      <CardImg src={BELL} x={1140} y={620} w={270} at={C(id, "a temple bell")} out={handOut} rot={9} from="bottom" />
      <Burst x={705} y={650} r={240} at={C(id, "i still won")} out={handOut} />
      <Sticker text="I STILL WON" x={705} y={630} at={C(id, "i still won")} out={handOut} size={110} color={ACCENT} rot={-9} stamp />
      {/* draw and group hug */}
      <Sticker text="2  CARD DRAW + GROUP HUG" x={560} y={130} at={C(id, "second we want")} out={out} size={46} bg="#fff" color={INK} rot={2} />
      <CardImg src={MINE} x={430} y={580} w={430} at={C(id, "howling mine")} out={out} rot={-6} from="left" />
      <CardImg src={BELL} x={950} y={580} w={430} at={C(id, "and temple bell")} out={out} rot={6} from="right" />
    </>
  );
};

// ---------------------------------------------------------------- 6. subscribe

const Subscribe: React.FC = () => {
  const id = "subscribe";
  const out = END(id);
  const start = sec(id).start;
  // kept to the upper left so the overlay (bottom right) has room
  return (
    <>
      <CardImg src={MERCHANT} x={330} y={430} w={320} at={start} out={out} rot={-5} from="pop" />
      <CabbagePile x={760} y={640} cols={5} size={96} keys={[[start + 0.2, 0], [start + 1.6, 14]]} out={out} />
      <Sticker text="IT GETS SILLY →" x={760} y={790} at={C(id, "gets silly")} out={out} size={56} bg="#ffe16b" color={INK} rot={-4} />
    </>
  );
};

// ---------------------------------------------------------------- 7. by turn five

const TurnFive: React.FC = () => {
  const id = "by-turn-five";
  const out = END(id);
  const t3Out = C(id, "this is where you become") + 0.1;
  const hugOut = C(id, "by turn five", 1) + 0.1;
  const listOut = C(id, "that's when things") + 0.1;
  const chaosOut = C(id, "worried about") + 0.1;
  const sinksOut = C(id, "from there") + 0.1;
  const engineOut = C(id, "true story") + 0.1;
  return (
    <>
      <Chapter n={2} text="BY TURN FIVE" x={560} y={120} at={sec(id).start} out={C(id, "on turn three") - 0.3} />
      <TurnTrack x={732} y={120} at={C(id, "on turn three") + 0.15} out={listOut} marks={[[C(id, "on turn three"), 3], [C(id, "by turn five", 1), 5]]} />
      {/* turn three: Harmonize off exactly four mana */}
      <CardImg src={HARMONIZE} x={380} y={590} w={440} at={C(id, "harmonize")} out={t3Out} rot={-6} from="left" />
      {["L", "L", "L", "E"].map((s, i) => (
        <Pip key={i} x={800 + i * 135} y={430} sym={s === "L" ? "🌲" : "🧝"} at={C(id, "it's four mana") + i * 0.15} out={t3Out} size={110} color={s === "L" ? "#d9ecc9" : "#ffe9a8"} />
      ))}
      <Sticker text="TURN 3 = 4 MANA ✓" x={1000} y={600} at={C(id, "exactly what you've got")} out={t3Out} size={52} bg="#fff" color="#1f7a3a" rot={-3} />
      <CabbagePile x={1000} y={930} cols={6} size={80} keys={[[C(id, "plus whatever cabbages"), 0], [C(id, "plus whatever cabbages") + 1.0, 6]]} out={t3Out} />
      {/* everyone's best friend */}
      {([[430, "navy"], [760, "kraft"], [1090, "charcoal"]] as const).map(([x, back], i) => (
        <Friend key={back} x={x} y={560} back={back} at={C(id, "and this is where") + i * 0.12} out={hugOut} scale={1.1} mouth={i === 1 ? "grin" : "smile"} />
      ))}
      <Callout label="THEM" text="“I need cards.”" x={250} y={220} w={360} at={C(id, "i need cards")} out={C(id, "they want mana") + 1.4} size={40} />
      <Toss x1={1500} y1={640} x2={430} y2={520} at={C(id, "you give them cards")} dur={0.6} w={90} />
      <Callout label="THEM" text="“Mana?”" x={700} y={220} w={260} at={C(id, "they want mana")} out={hugOut} size={40} rot={2} />
      <Pip x={1450} y={620} sym="G" dx={-690} dy={-80} moveAt={C(id, "you give them mana")} at={C(id, "you give them mana")} out={hugOut} size={80} />
      <CabbagePile x={732} y={1000} cols={12} size={80} keys={[[C(id, "you keep getting"), 0], [C(id, "you keep getting") + 1.4, 24]]} out={hugOut} />
      {/* the turn-five checklist */}
      {(
        [
          ["the cabbage man out", "✓ CABBAGE MAN OUT"],
          ["a pile of cabbages", "✓ A PILE OF CABBAGES"],
          ["the whole table", "✓ THE TABLE CASTING SPELLS"],
        ] as const
      ).map(([w, label], i) => (
        <Sticker key={i} text={label} x={570} y={330 + i * 150} at={C(id, w)} out={listOut} size={50} bg="#fff" color={INK} rot={i % 2 ? 2 : -2} />
      ))}
      <CardImg src={MERCHANT} x={1240} y={560} w={270} at={C(id, "the cabbage man out") + 0.2} out={listOut} rot={6} from="right" />
      {/* chaos, and a count nobody can keep */}
      <Sticker text="CHAOS" x={732} y={420} at={C(id, "that's when things")} out={C(id, "this is usually when") + 0.1} size={150} color={ACCENT} rot={-8} />
      {([[300, "navy"], [732, "kraft"], [1160, "charcoal"]] as const).map(([x, back], i) => (
        <Friend key={"c" + back} x={x} y={730} back={back} at={C(id, "people are casting spells") + i * 0.1} out={chaosOut} scale={1.1} mouth={i === 1 ? "o" : "teeth"} brows={i === 1 ? "raised" : "angry"} />
      ))}
      <Toss x1={300} y1={700} x2={1160} y2={700} at={C(id, "people are casting spells") + 0.3} dur={0.7} w={80} />
      <Toss x1={1160} y1={700} x2={732} y2={690} at={C(id, "to stop other") + 0.1} dur={0.5} w={80} />
      <Toss x1={732} y1={700} x2={300} y2={690} at={C(id, "to stop other") + 0.5} dur={0.5} w={80} />
      <Counter x={1000} y={170} keys={[[C(id, "your cabbage production"), 12], [C(id, "37"), 37], [C(id, "41") - 0.1, 37], [C(id, "41") + 0.3, 41]]} out={chaosOut} size={72} />
      <Callout label="SOMEONE" text="“Wait, how many [[Food tokens]] do you have?”" x={130} y={250} w={560} at={C(id, "wait how many food")} out={chaosOut} size={38} />
      {/* mana sinks */}
      <Sticker text="TOO MUCH MANA?" x={732} y={500} at={C(id, "worried about")} out={C(id, "mana sinks") + 0.1} size={70} bg="#fff" color={INK} rot={-4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Pip key={"m" + i} x={400 + i * 160} y={720 + (i % 2) * 60} sym="✦" at={C(id, "worried about") + 0.3 + i * 0.1} out={C(id, "mana sinks") + 0.1} size={90} color={GOLD} />
      ))}
      <Sticker text="MANA SINKS" x={732} y={140} at={C(id, "mana sinks")} out={sinksOut} size={64} bg="#ffe16b" color={INK} rot={-3} />
      <CardImg src={FOUNDRY} x={250} y={560} w={290} at={C(id, "retrofitter foundry")} out={sinksOut} rot={-7} from="bottom" />
      <CardImg src={ARCH} x={560} y={560} w={290} at={C(id, "arch of orazca")} out={sinksOut} rot={-2} from="bottom" />
      <CardImg src={PACKMASTER} x={870} y={560} w={290} at={C(id, "wren's run packmaster")} out={sinksOut} rot={3} from="bottom" />
      <CardImg src={DEPTHS} x={1180} y={560} w={290} at={C(id, "of course dark depths")} out={sinksOut} rot={8} from="bottom" />
      <Sticker text="LATER…" x={1180} y={560} at={C(id, "more on that")} out={sinksOut} size={72} color={GOLD} rot={-12} stamp />
      {/* hug dealer to war engine */}
      <CabbagePile x={732} y={1000} cols={13} size={80} keys={[[C(id, "from there"), 0], [C(id, "from there") + 1.6, 40]]} out={engineOut} />
      <Sticker text="FRIENDLY HUG DEALER" x={560} y={240} at={C(id, "friendly hug dealer")} out={engineOut} size={52} bg="#fff" color={INK} rot={-3} />
      <PaperArrow x1={560} y1={300} x2={620} y2={390} at={C(id, "war engine") - 0.2} out={engineOut} bend={-60} />
      <Sticker text="CABBAGE WAR ENGINE" x={700} y={440} at={C(id, "war engine")} out={engineOut} size={62} color={ACCENT} rot={3} />
      <Callout label="ME" text="“Hey judge, can we use [[dice]] instead?”" x={320} y={540} w={620} at={C(id, "hey judge")} out={engineOut} size={40} rot={-1} />
      {/* the judge story */}
      <CabbagePile x={330} y={1000} cols={6} size={86} keys={[[C(id, "true story"), 0], [C(id, "borrow tokens") + 1.3, 20]]} out={out} />
      <CabbagePile x={1120} y={1000} cols={6} size={86} keys={[[C(id, "two separate"), 0], [C(id, "two separate") + 1.3, 20]]} out={out} />
      <Sticker text="POD 1" x={330} y={330} at={C(id, "borrow tokens") + 0.2} out={out} size={44} bg="#fff" color={INK} rot={-3} />
      <Sticker text="POD 2" x={1120} y={330} at={C(id, "two separate")} out={out} size={44} bg="#fff" color={INK} rot={3} />
      <Friend x={732} y={520} back="charcoal" at={C(id, "the judge started")} out={out} scale={1.0} name="JUDGE" mouth="o" brows="raised" />
      <Sticker text="*CLICK*" x={732} y={450} at={C(id, "taking pictures")} out={out} size={64} color={GOLD} rot={-6} stamp />
    </>
  );
};

// ---------------------------------------------------------------- 8. how to win

const HowToWin: React.FC = () => {
  const id = "how-to-win";
  const out = END(id);
  const g1 = C(id, "a pile of 7/7") + 0.1;
  const artOut = C(id, "the all-star") + 0.1;
  const dinoOut = C(id, "your sol ring") + 0.1;
  const rowOut = C(id, "halsin emerald") + 0.1;
  const halsinOut = C(id, "one rules thing") + 0.1;
  const rulesOut = C(id, "idol of oblivion") + 0.1;
  return (
    <>
      <Chapter n={3} text="HOW TO WIN" at={sec(id).start} out={C(id, "and it's a bracket") + 0.3} />
      <Sticker text="BRACKET 2" x={560} y={340} at={C(id, "bracket 2")} out={g1} size={70} bg={GOLD} color={INK} rot={2} />
      <Sticker text="0 GAME CHANGERS" x={560} y={500} at={C(id, "no game changers")} out={g1} size={54} bg="#fff" color={INK} rot={-2} />
      <Sticker text="∞ = BORING" x={1130} y={280} at={C(id, "infinite is boring")} out={g1} size={76} color={ACCENT} rot={6} />
      <ArtPanel src={art("displaced-dinosaurs")} x={700} y={500} w={740} at={C(id, "a pile of 7/7")} out={artOut} rot={-2} />
      <Sticker text="THAT'S ART." x={700} y={140} at={C(id, "that's art")} out={artOut} size={60} color={GOLD} rot={-4} />
      <CabbagePile x={700} y={1000} cols={11} size={70} keys={[[C(id, "dinosaur cabbages"), 0], [C(id, "dinosaur cabbages") + 1, 16]]} badge="7/7" badgeAt={C(id, "that's art")} out={artOut} />
      {/* Displaced Dinosaurs */}
      <CardImg src={DINOS} x={380} y={545} w={540} at={C(id, "the all-star")} out={dinoOut} rot={-3} from="pop" />
      <Callout label="DISPLACED DINOSAURS" text="As a historic permanent you control enters, it becomes a [[7/7 Dinosaur]]. (Artifacts are historic.)" x={720} y={170} w={620} at={C(id, "once it's out")} out={dinoOut} size={34} rot={1} />
      <Cabbage x={1020} y={690} size={200} at={C(id, "every cabbage we make")} out={dinoOut} />
      <Sticker text="7/7 DINO" x={1020} y={700} at={C(id, "a 7/7 dino")} out={dinoOut} size={60} color={GOLD} rot={-12} stamp />
      <CardImg src={SOL} x={330} y={580} w={330} at={C(id, "your sol ring")} out={rowOut} rot={-6} from="bottom" />
      <CardImg src={CART} x={732} y={580} w={330} at={C(id, "hot dog cart")} out={rowOut} rot={3} from="bottom" />
      <CardImg src={T_TREASURE} x={1134} y={580} w={330} at={C(id, "random treasure")} out={rowOut} rot={7} from="bottom" />
      <Sticker text="DINO" x={330} y={600} at={C(id, "ring dino")} out={rowOut} size={80} color={GOLD} rot={-14} stamp />
      <Sticker text="DINO" x={732} y={600} at={C(id, "cart dino")} out={rowOut} size={80} color={GOLD} rot={10} stamp />
      <Sticker text="ALSO A DINO" x={1134} y={600} at={C(id, "also a dino")} out={rowOut} size={58} color={GOLD} rot={-10} stamp />
      {/* Halsin */}
      <CardImg src={HALSIN} x={380} y={545} w={540} at={C(id, "halsin emerald")} out={halsinOut} rot={-3} from="pop" />
      <Callout label="HALSIN" text="{1}: target token you control becomes a [[4/4 Bear]] until end of turn." x={720} y={170} w={620} at={C(id, "for one mana")} out={C(id, "i've had turns") + 0.1} size={36} rot={1} />
      <CabbagePile x={1010} y={830} cols={5} size={100} keys={[[C(id, "ten mana and ten"), 0], [C(id, "ten mana and ten") + 0.8, 10]]} badge="4/4" badgeAt={C(id, "that's nothing") - 0.4} out={C(id, "i've had turns") + 0.1} />
      <Sticker text="10 BEARS = 40 DAMAGE" x={1010} y={930} at={C(id, "for this deck")} out={C(id, "i've had turns") + 0.1} size={46} bg="#fff" color={ACCENT} rot={-3} />
      <Sticker text="30 BEARS + SPARE MANA" x={1030} y={200} at={C(id, "30 bears")} out={halsinOut} size={42} bg="#ffe16b" color={INK} rot={-3} />
      <ArtPanel src="ep003/art/token-bear.jpg" x={1010} y={580} w={500} at={C(id, "the bears were just")} out={halsinOut} rot={3} caption="just standing there, holding cabbages" />
      {/* the summoning-sickness rule */}
      <Callout label="ONE RULES THING" text="A bear can only attack if that cabbage has been yours [[since the start of your turn]]." x={170} y={180} w={760} size={40} at={C(id, "one rules thing")} out={rulesOut} rot={-1} />
      <Cabbage x={470} y={700} size={170} at={C(id, "cabbages you made")} out={rulesOut} />
      <Sticker text="MADE ON THEIR TURN: GO ✓" x={470} y={860} at={C(id, "good to go")} out={rulesOut} size={42} bg="#fff" color="#1f7a3a" rot={-2} />
      <Sticker text="SAME FOR DINOS" x={1060} y={700} at={C(id, "same goes for")} out={rulesOut} size={52} color={GOLD} rot={4} />
      {/* backups */}
      <CardImg src={IDOL} x={240} y={530} w={290} at={C(id, "idol of oblivion")} out={out} rot={-6} from="bottom" />
      <CardImg src={T_ELDRAZI} x={550} y={530} w={290} at={C(id, "into a 10/10")} out={out} rot={4} from="bottom" />
      <CardImg src={FOUNDRY} x={880} y={530} w={290} at={C(id, "retrofitter foundry makes")} out={out} rot={-4} from="bottom" />
      <CardImg src={T_CONSTRUCT} x={1190} y={530} w={290} at={C(id, "4/4 constructs")} out={out} rot={6} from="bottom" />
      <Sticker text="FULL DECKLIST IN THE DESCRIPTION ↓" x={720} y={880} at={C(id, "full decklist")} out={out} size={44} bg="#ffe16b" color={INK} rot={-2} />
    </>
  );
};

// ---------------------------------------------------------------- 9. three secret win cons

const Secrets: React.FC = () => {
  const id = "three-secret-win-cons";
  const out = END(id);
  const introOut = C(id, "first up is") + 0.1;
  const depthsOut = C(id, "next is night") + 0.1;
  const sweetsOut = C(id, "and the last one") + 0.1;
  return (
    <>
      <RansomTitle text="SECRET WIN CONS" x={732} y={170} at={sec(id).start} out={introOut} size={70} stagger={0.03} />
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <CardImg src={[DEPTHS, SWEETS, KARN][i]} x={400 + i * 330} y={580} w={280} at={sec(id).start + 0.4 + i * 0.2} flipAt={i === 0 ? C(id, "first up is") - 0.6 : 10000} out={introOut} rot={(i - 1) * 6} from="bottom" />
          <Sticker text={`#${i + 1}`} x={400 + i * 330} y={400} at={sec(id).start + 0.6 + i * 0.2} out={introOut} size={60} color={GOLD} rot={(i - 1) * 8} stamp />
        </React.Fragment>
      ))}
      <Callout label="THEM" text="“Wait. [[That's]] how you're attacking me?”" x={700} y={830} w={640} at={C(id, "that's how you're")} out={introOut} size={36} rot={1} />
      {/* #1 Dark Depths */}
      <CardImg src={DEPTHS} x={380} y={545} w={540} at={C(id, "first up is") + 0.3} out={depthsOut} rot={-3} from="pop" />
      <IceCounters x={1010} y={290} at={C(id, "first up is") + 0.5} out={C(id, "life totals") + 0.3} meltA={C(id, "takes a while")} meltB={C(id, "last ice counter") + 0.4} />
      <CardImg src={T_MARIT} x={1010} y={565} w={330} at={C(id, "life totals")} out={C(id, "i've had someone") + 0.1} rot={5} from="pop" />
      <Sticker text="PAID IN CABBAGES" x={1010} y={880} at={C(id, "cabbage money")} out={depthsOut} size={50} bg="#fff" color={INK} rot={-3} />
      <Friend x={1010} y={540} back="kraft" at={C(id, "i've had someone")} out={depthsOut} scale={1.05} mouth="grin" brows="up" />
      <Sticker text="CONCEDED OUT OF RESPECT" x={1045} y={230} at={C(id, "conceded out of respect")} out={depthsOut} size={40} bg="#ffe16b" color={INK} rot={3} />
      {/* #2 Night of the Sweets' Revenge */}
      <CardImg src={SWEETS} x={380} y={545} w={540} at={C(id, "next is night")} out={sweetsOut} rot={-3} from="pop" />
      <Callout label="BOTTOM OF THE CARD" text="{5}{G}{G}, sacrifice it: creatures you control get [[+X/+X]], where X is the number of [[Foods you control]]." x={720} y={160} w={620} at={C(id, "look at the bottom")} out={sweetsOut} size={34} rot={1} />
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <CardImg src={ELVES} x={830 + i * 200} y={700} w={190} at={C(id, "three 1/1 elves") + i * 0.12} out={sweetsOut} rot={(i - 1) * 7} from="bottom" />
          <Sticker text="52/52" x={830 + i * 200} y={720} at={C(id, "became 52/52s") + i * 0.1} out={sweetsOut} size={52} color={GOLD} rot={-12 + i * 8} stamp />
        </React.Fragment>
      ))}
      {/* #3 Karn */}
      <CardImg src={KARN} x={380} y={545} w={540} at={C(id, "and the last one")} out={out} rot={-3} from="pop" />
      <Sticker text="SHOULD NEVER WORK" x={1030} y={170} at={C(id, "should never work")} out={C(id, "this has happened") + 0.1} size={44} bg="#fff" color={ACCENT} rot={-2} />
      <Callout label="KARN'S ULTIMATE (−7)" text="Tap an untapped artifact you control: this emblem deals [[1 damage]] to any target." x={720} y={260} w={620} at={C(id, "his ultimate")} out={C(id, "this has happened") + 0.1} size={34} rot={1} />
      <CabbagePile x={1010} y={1000} cols={8} size={80} keys={[[C(id, "every cabbage becomes"), 0], [C(id, "every cabbage becomes") + 1.0, 20], [C(id, "47 cabbages"), 20], [C(id, "47 cabbages") + 1, 47]]} out={out} />
      <Reticle x={1010} y={860} at={C(id, "nuclear weapon")} out={C(id, "this has happened") + 0.1} r={130} />
      <Counter x={1010} y={560} keys={[[C(id, "47 cabbages"), 20], [C(id, "47 cabbages") + 1.0, 47]]} out={C(id, "he scooped") - 0.1} size={64} />
      <Callout label="THE TARGET" text="“I can't even be mad.”" x={760} y={250} w={480} at={C(id, "i can't even be mad")} out={out} size={40} rot={-1} />
      <Burst x={1010} y={600} r={135} at={C(id, "he scooped") + 0.15} out={out} />
      <Sticker text="SCOOPED" x={1010} y={600} at={C(id, "he scooped") + 0.15} out={out} size={70} color={ACCENT} rot={-8} stamp />
    </>
  );
};

// ---------------------------------------------------------------- 10. crazy value

const CrazyValue: React.FC = () => {
  const id = "crazy-value";
  const out = END(id);
  const g0 = C(id, "academy manufactor") + 0.1;
  const mfOut = C(id, "clock of omens") + 0.1;
  const clockOut = C(id, "sarinth steelseeker") + 0.1;
  const solOut = C(id, "untap temple bell") + 0.1;
  return (
    <>
      <Chapter n={4} text="CARDS THAT SING" at={sec(id).start} out={g0} x={732} y={330} />
      <Sticker text="(OR SCREAM)" x={732} y={500} at={C(id, "or scream")} out={g0} size={64} color={ACCENT} rot={-5} />
      {/* Academy Manufactor */}
      <CardImg src={MANUFACTOR} x={380} y={545} w={540} at={C(id, "academy manufactor")} out={mfOut} rot={-3} from="pop" />
      <Cabbage x={1040} y={250} size={150} at={C(id, "whenever we'd make")} out={mfOut} />
      <PaperArrow x1={1040} y1={335} x2={1040} y2={420} at={C(id, "instead")} out={C(id, "should be illegal")} bend={0} />
      <CardImg src={T_FOOD} x={820} y={620} w={210} at={C(id, "a food a treasure")} out={mfOut} rot={-6} from="pop" />
      <CardImg src={T_TREASURE} x={1040} y={620} w={210} at={C(id, "a treasure and")} out={mfOut} rot={0} from="pop" />
      <CardImg src={T_CLUE} x={1260} y={620} w={210} at={C(id, "and a clue")} out={mfOut} rot={6} from="pop" />
      <Sticker text="SHOULD BE ILLEGAL" x={1040} y={900} at={C(id, "should be illegal")} out={mfOut} size={52} color={ACCENT} rot={-4} />
      {/* Clock of Omens */}
      <CardImg src={CLOCK} x={380} y={545} w={540} at={C(id, "clock of omens")} out={clockOut} rot={-3} from="pop" />
      <Callout label="CLOCK OF OMENS" text="Tap two untapped artifacts you control: [[untap target artifact]]." x={720} y={160} w={620} at={C(id, "tap two cabbages")} out={clockOut} size={36} rot={1} />
      <CabbagePile x={1000} y={760} cols={5} size={110} keys={[[C(id, "handful of cabbages"), 0], [C(id, "handful of cabbages") + 0.6, 5]]} out={C(id, "tap two cabbages") + 0.1} />
      <CabbagePile x={840} y={700} cols={2} size={120} keys={[[C(id, "tap two cabbages"), 2]]} tapAt={C(id, "to untap an artifact")} tapN={2} out={solOut} />
      <Tapped x={1170} y={640} untapAt={C(id, "every cabbage is basically")}>
        <CardImg src={SOL} x={1170} y={640} w={250} at={C(id, "untap sol ring")} out={solOut} from="pop" />
      </Tapped>
      <Sticker text="1 CABBAGE = 1 MANA" x={1030} y={880} at={C(id, "basically a colorless")} out={solOut} size={46} bg="#fff" color={INK} rot={-3} />
      <CardImg src={BELL} x={900} y={640} w={250} at={C(id, "untap temple bell")} out={clockOut} rot={-4} from="bottom" />
      <CardImg src={IDOL} x={1200} y={640} w={250} at={C(id, "or idol of")} out={clockOut} rot={5} from="bottom" />
      <Sticker text="2 CABBAGES = 1 CARD" x={1030} y={880} at={C(id, "two cabbages for a card")} out={clockOut} size={46} bg="#ffe16b" color={INK} rot={-3} />
      {/* Sarinth Steelseeker */}
      <CardImg src={SARINTH} x={380} y={545} w={540} at={C(id, "sarinth steelseeker")} out={out} rot={-3} from="pop" />
      <Callout label="SARINTH" text="Whenever an artifact you control enters, look at the top card of your library. If it's a [[land]], it can go to your [[hand]]." x={720} y={160} w={620} at={C(id, "every time an artifact")} out={out} size={34} rot={1} />
      <CardImg src={FOREST} x={1030} y={640} w={250} at={C(id, "top card of our")} flipAt={C(id, "if it's a land")} out={out} rot={5} from="pop" />
      <Sticker text="→ HAND" x={1030} y={890} at={C(id, "goes to our hand")} out={out} size={50} bg="#fff" color="#1f7a3a" rot={-3} />
    </>
  );
};

// ---------------------------------------------------------------- 11. cabbage doubling

const Doubling: React.FC = () => {
  const id = "cabbage-doubling";
  const out = END(id);
  const g0 = C(id, "night of the") + 0.1;
  const g1 = C(id, "put just a couple") + 0.1;
  const g2 = C(id, "someone once asked") + 0.1;
  return (
    <>
      <Sticker text="×2" x={1100} y={250} at={C(id, "count twice")} out={g0} size={180} color={GOLD} rot={-8} />
      <CardImg src={HARVEST} x={380} y={545} w={540} at={C(id, "second harvest")} out={g0} rot={-3} from="pop" />
      <CabbagePile x={1010} y={980} cols={8} size={84} keys={[[sec(id).start, 8], [C(id, "copy of every"), 8], [C(id, "copy of every") + 0.8, 16]]} out={g0} />
      <CardImg src={SWEETS} x={260} y={440} w={330} at={C(id, "night of the")} out={g1} rot={-6} from="left" />
      <CardImg src={JAHEIRA} x={620} y={440} w={330} at={C(id, "jaheira friend of")} out={g1} rot={4} from="bottom" />
      <Sticker text="WAS: 2 CABBAGES = 1 MANA" x={460} y={790} at={C(id, "normally it takes")} out={g1} size={40} bg="#fff" color={INK} rot={-2} />
      <Sticker text="NOW: 1 CABBAGE = 1 MANA" x={460} y={910} at={C(id, "so that doubles")} out={g1} size={40} bg="#ffe16b" color={INK} rot={2} />
      <CardImg src={PEREGRIN} x={1110} y={520} w={300} at={C(id, "and peregrin took")} out={g1} rot={7} from="right" />
      <Sticker text="+1 FOOD" x={1110} y={530} at={C(id, "an extra food")} out={g1} size={64} color={GOLD} rot={-10} stamp />
      {/* Merchant + Jaheira + Peregrin */}
      <CardImg src={MERCHANT} x={300} y={500} w={330} at={C(id, "put just a couple")} out={g2} rot={-6} from="bottom" />
      <CardImg src={JAHEIRA} x={660} y={500} w={330} at={C(id, "say jaheira")} out={g2} rot={0} from="bottom" />
      <CardImg src={PEREGRIN} x={1020} y={500} w={330} at={C(id, "and peregrin") } out={g2} rot={6} from="bottom" />
      <Sticker text="1 SPELL = 2 CABBAGES = 2 MANA" x={660} y={860} at={C(id, "gives you two cabbages")} out={g2} size={46} bg="#ffe16b" color={INK} rot={-2} />
      <Callout label="SOMEONE" text="“How much mana do you have?”" x={150} y={160} w={560} at={C(id, "how much mana")} out={out} size={40} />
      <Burst x={1030} y={330} r={210} at={C(id, "said yes")} out={out} />
      <Sticker text="“YES.”" x={1030} y={330} at={C(id, "said yes")} out={out} size={130} color={ACCENT} rot={-6} stamp />
      <CabbagePile x={732} y={1000} cols={13} size={82} keys={[[C(id, "someone once asked"), 6], [C(id, "said yes"), 50]]} out={out} />
    </>
  );
};

// ---------------------------------------------------------------- 12. protection

const Protection: React.FC = () => {
  const id = "protection";
  const out = END(id);
  const { t } = useT();
  const bye = C(id, "goes away");
  return (
    <>
      <Callout label="THE DOWNSIDE" text="Combat damage → [[sacrifice a Food]]" x={720} y={200} w={560} at={C(id, "remember that downside")} out={C(id, "black creatures") - 0.45} size={40} rot={-1} />
      <div style={{ opacity: 1 - 0.6 * ramp(t, bye, bye + 0.5) }}>
        <CardImg src={GRASS} x={380} y={545} w={540} at={C(id, "elephant grass")} out={out} rot={-3} from="pop" />
      </div>
      <Sticker text="THE FIX" x={380} y={170} at={C(id, "here's the fix")} out={out} size={60} bg="#ffe16b" color={INK} rot={-4} stamp />
      <Callout label="ELEPHANT GRASS" text="Black creatures can't attack you. Everything else pays [[{2} for each]] creature attacking you." x={720} y={200} w={600} at={C(id, "black creatures")} out={out} size={36} rot={1} />
      <Sticker text="UPKEEP: +1 EVERY TURN" x={1045} y={640} at={C(id, "goes up by one")} out={out} size={42} bg="#fff" color={INK} rot={-2} />
      <Sticker text="STOP PAYING = GONE" x={1030} y={790} at={C(id, "stop paying it")} out={out} size={46} bg="#fff" color={ACCENT} rot={2} />
      <Sticker text="BYE" x={380} y={560} at={bye} out={C(id, "or keep paying")} size={110} color={ACCENT} rot={-14} stamp />
    </>
  );
};

// ---------------------------------------------------------------- 13. upgrades

/** One upgrade: the card on the left with its price tag, from its name to the next upgrade's name. */
const UpCard: React.FC<{ src: string; price: string; at: number; priceAt: number; out: number }> = ({ src, price, at, priceAt, out }) => (
  <>
    <CardImg src={src} x={380} y={545} w={540} at={at} out={out} rot={-3} from="pop" />
    <PriceTag text={price} x={560} y={230} at={priceAt} out={out} size={84} rot={-10} stamp />
  </>
);

const Upgrades: React.FC = () => {
  const id = "upgrades";
  const out = END(id);
  const n = {
    clock: C(id, "unwinding clock about"),
    vault: C(id, "fomori vault about"),
    fair: C(id, "inventors' fair about"),
    voyage: C(id, "collective voyage about"),
    horn: C(id, "horn of greed about"),
    trio: C(id, "doubling season parallel lives"),
    math: C(id, "with the cabbage man"),
    total: C(id, "all of these together"),
    arch: C(id, "why is the cabbage"),
  };
  const grid: [string, number, number][] = [
    [UNWINDING, 250, 330],
    [FOMORI, 550, 330],
    [FAIR, 850, 330],
    [VOYAGE, 1150, 330],
    [HORN, 250, 700],
    [SEASON, 550, 700],
    [LIVES, 850, 700],
    [VIGOR, 1150, 700],
  ];
  return (
    <>
      <Sticker text="FARMERS MARKET" x={420} y={330} at={C(id, "farmers market")} out={n.clock + 0.1} size={56} bg="#fff" color={INK} rot={-4} />
      <PaperArrow x1={600} y1={390} x2={760} y2={530} at={C(id, "industrial agriculture") - 0.2} out={n.clock + 0.1} bend={-80} />
      <Sticker text="INDUSTRIAL AGRICULTURE" x={860} y={620} at={C(id, "industrial agriculture")} out={n.clock + 0.1} size={56} color={ACCENT} rot={3} />
      <CabbagePile x={860} y={1000} cols={12} size={70} keys={[[sec(id).start, 0], [C(id, "industrial agriculture") + 1.5, 30]]} out={n.clock + 0.1} />
      {/* Unwinding Clock */}
      <UpCard src={UNWINDING} price="$21" at={n.clock} priceAt={C(id, "about 21")} out={n.vault + 0.1} />
      <Callout label="UNWINDING CLOCK" text="Untap all artifacts you control during [[each other player's untap step]]." x={720} y={330} w={620} at={C(id, "this untaps every")} out={n.vault + 0.1} size={36} rot={1} />
      <Burst x={1010} y={840} r={160} at={C(id, "four times the mana")} out={n.vault + 0.1} color="#9fd06d" />
      <Sticker text="4× THE MANA" x={1010} y={840} at={C(id, "four times the mana")} out={n.vault + 0.1} size={80} color={GOLD} rot={-6} stamp />
      {/* Fomori Vault */}
      <UpCard src={FOMORI} price="$15" at={n.vault} priceAt={C(id, "about 15")} out={n.fair + 0.1} />
      <Callout label="FOMORI VAULT" text="{3}, {T}, discard a card: look at the top X cards, [[X = your artifacts]]. Take one." x={720} y={330} w={620} at={C(id, "discard a card")} out={n.fair + 0.1} size={36} rot={1} />
      <Sticker text="PICK YOUR FAVORITE" x={1030} y={760} at={C(id, "picking your favorite")} out={n.fair + 0.1} size={46} bg="#fff" color={INK} rot={-3} />
      {/* Inventors' Fair */}
      <UpCard src={FAIR} price="$19" at={n.fair} priceAt={C(id, "about 19")} out={n.voyage + 0.1} />
      <Sticker text="A MENU FOR WAR CRIMES" x={1030} y={480} at={C(id, "menu for war crimes")} out={n.voyage + 0.1} size={40} color={ACCENT} rot={-4} />
      <Sticker text="SWAP OUT 2 FORESTS" x={1030} y={700} at={C(id, "couple of forests")} out={n.voyage + 0.1} size={46} bg="#ffe16b" color={INK} rot={2} />
      {/* Collective Voyage */}
      <UpCard src={VOYAGE} price="$8" at={n.voyage} priceAt={C(id, "about 8")} out={n.horn + 0.1} />
      <Sticker text="EVERYONE CHIPS IN" x={1030} y={380} at={C(id, "everyone chips in")} out={C(id, "i once convinced") + 0.1} size={46} bg="#fff" color={INK} rot={-2} />
      <Sticker text="23 MANA" x={1010} y={380} at={C(id, "23 mana")} out={n.horn + 0.1} size={80} color={GOLD} rot={-6} />
      <CardImg src={HALSIN} x={1010} y={700} w={260} at={C(id, "guess who had")} out={n.horn + 0.1} rot={6} from="right" />
      {/* Horn of Greed */}
      <UpCard src={HORN} price="$17" at={n.horn} priceAt={C(id, "about 17")} out={n.trio + 0.1} />
      <Sticker text="EVERYONE DRAWS" x={1030} y={500} at={C(id, "everyone draws")} out={n.trio + 0.1} size={46} bg="#fff" color={INK} rot={-3} />
      {/* the three doublers */}
      <CardImg src={SEASON} x={290} y={590} w={330} at={n.trio} out={n.math + 0.1} rot={-6} from="bottom" />
      <CardImg src={LIVES} x={660} y={590} w={330} at={C(id, "parallel lives and")} out={n.math + 0.1} rot={0} from="bottom" />
      <CardImg src={VIGOR} x={1030} y={590} w={330} at={C(id, "and primal vigor")} out={n.math + 0.1} rot={6} from="bottom" />
      <PriceTag text="$32" x={290} y={240} at={C(id, "doubling season's about")} out={n.math + 0.1} size={60} rot={-8} />
      <PriceTag text="$40" x={660} y={240} at={C(id, "parallel lives about")} out={n.math + 0.1} size={60} rot={4} />
      <PriceTag text="$15" x={1030} y={240} at={C(id, "primal vigor about")} out={n.math + 0.1} size={60} rot={-4} />
      <Sticker text="THEIRS TOO" x={1030} y={620} at={C(id, "theirs included")} out={n.math + 0.1} size={62} color={GOLD} rot={-12} stamp />
      {/* the dozen tokens */}
      <CardImg src={MERCHANT} x={330} y={360} w={260} at={n.math} out={n.total + 0.1} rot={-6} from="top" />
      <CardImg src={MANUFACTOR} x={730} y={360} w={260} at={C(id, "academy manufactor and")} out={n.total + 0.1} rot={0} from="top" />
      <CardImg src={PEREGRIN} x={1130} y={360} w={260} at={C(id, "and peregrin took")} out={n.total + 0.1} rot={6} from="top" />
      <CabbagePile x={730} y={990} cols={6} size={100} keys={[[C(id, "a dozen tokens"), 0], [C(id, "a dozen tokens") + 0.9, 12]]} out={n.total + 0.1} />
      <Sticker text="PROVE THE MATH" x={1120} y={760} at={C(id, "prove the math")} out={n.total + 0.1} size={50} bg="#fff" color={ACCENT} rot={4} />
      {/* all eight, and which to buy first */}
      {grid.map(([src, x, y], i) => (
        <CardImg key={i} src={src} x={x} y={y} w={230} at={n.total + i * 0.08} out={n.arch + 0.1} rot={(i % 3) - 1} from="pop" />
      ))}
      <PriceTag text="ALL 8: $166" x={1150} y={960} at={C(id, "about 166")} out={n.arch + 0.1} size={52} rot={-4} />
      <Sticker text="PICK 1 OR 2" x={420} y={960} at={C(id, "pick one or two")} out={n.arch + 0.1} size={52} bg="#ffe16b" color={INK} rot={3} />
      <Sticker text="RAW POWER" x={250} y={350} at={C(id, "raw power")} out={n.arch + 0.1} size={46} color={GOLD} rot={-12} stamp />
      <Sticker text="FRIENDLY" x={1150} y={350} at={C(id, "like your friends")} out={n.arch + 0.1} size={46} color={GOLD} rot={10} stamp />
      <Sticker text="CHAOS" x={550} y={720} at={C(id, "love chaos")} out={n.arch + 0.1} size={56} color={ACCENT} rot={-10} stamp />
      <Callout label="YOUR TABLE" text="“Why is the [[cabbage player]] the archenemy?”" x={260} y={380} w={820} at={n.arch} out={out} size={44} rot={-1} />
    </>
  );
};

// ---------------------------------------------------------------- 14. outro

/** The recurring verdict card (as Ep002): one row per takeaway. */
const VerdictCard: React.FC<{ x: number; y: number; at: number; out: number; rows: [string, string, number][] }> = ({ x, y, at, out, rows }) => {
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
        width: 1060,
        transform: `rotate(-1.5deg) scale(${p})`,
        transformOrigin: "left top",
        background: "#fffdf7",
        border: `6px solid ${INK}`,
        borderRadius: 18,
        boxShadow: "12px 14px 0 rgba(0,0,0,0.16)",
        padding: "22px 34px 26px",
      }}
    >
      <div style={{ fontFamily: BLOCK, fontSize: 44, color: ACCENT, letterSpacing: 2 }}>WILD CARD VERDICT</div>
      {rows.map(([k, v, when]) => {
        const r = pop(t, fps, when, out, 10);
        return (
          <div
            key={k}
            style={{
              display: "flex",
              gap: 18,
              alignItems: "baseline",
              marginTop: 14,
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

const Outro: React.FC = () => {
  const id = "outro";
  const out = END(id);
  const s = sec(id).start;
  const verdictOut = C(id, "if you build it") + 0.1;
  const askOut = C(id, "the next time") + 0.1;
  const deckOut = C(id, "my cabbages are") + 0.1;
  return (
    <>
      <VerdictCard
        x={150}
        y={110}
        at={s + 1.8}
        out={verdictOut}
        rows={[
          ["PRICE", "About $214 (the Merchant is $30)", s + 2.4],
          ["BRACKET", "2 (no Game Changers, no combos)", s + 3.1],
          ["HOW IT WINS", "7/7 dino cabbages, 4/4 cabbage bears", s + 3.8],
          ["SECRET WINS", "Dark Depths, Night of the Sweets, Karn", s + 4.5],
          ["FIRST UPGRADE", "Unwinding Clock (about $21)", s + 5.2],
          ["FUN", "Your friends will be buried in produce", C(id, "beating them to death")],
        ]}
      />
      {/* the comment prompt */}
      <Callout label="COMMENTS ↓" text="Your highest [[cabbage count]]? And what would you cut for [[Unwinding Clock]]?" x={130} y={200} w={660} at={C(id, "if you build it")} out={askOut} size={42} rot={-1} />
      <Sticker text="MY RECORD: 70+" x={1130} y={330} at={C(id, "my record's")} out={askOut} size={44} bg="#fff" color={INK} rot={3} />
      <CardImg src={UNWINDING} x={1060} y={700} w={260} at={C(id, "to fit in unwinding")} out={askOut} rot={6} from="right" />
      {/* $2,000 combo deck vs cabbages */}
      <Sticker text="$2,000 COMBO DECK" x={470} y={330} at={C(id, "the next time")} out={deckOut} size={56} bg="#fff" color={INK} rot={-4} />
      <Sticker text="VS" x={720} y={500} at={C(id, "just remember")} out={deckOut} size={90} color={ACCENT} rot={-6} />
      <CabbagePile x={1050} y={900} cols={6} size={100} keys={[[C(id, "just remember"), 0], [C(id, "turning cabbages into") , 16]]} out={deckOut} />
      <Reticle x={1050} y={700} at={C(id, "nuclear weapons")} out={deckOut} r={140} />
      <RansomTitle text="MY CABBAGES" x={732} y={380} at={C(id, "my cabbages are")} out={out} size={70} stagger={0.03} />
      <RansomTitle text="ARE YOUR CABBAGES" x={732} y={540} at={C(id, "are your cabbages")} out={out} size={60} stagger={0.03} />
      <Confetti x={732} y={600} at={C(id, "are your cabbages") + 0.5} />
    </>
  );
};

/** End card: subscribe (as Ep002). Switch to a "watch next" card once ep002 is public. */
const EndScreen: React.FC = () => {
  const { t, fps } = useT();
  const at = T.narrationEnd + 0.2;
  const p = pop(t, fps, at);
  if (p < 0.01) return null;
  const btn = pop(t, fps, at + 0.5);
  const pressAt = at + 2.6;
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
        {...audit("label", "More deck techs, rules and combos.", at + 0.9, tag)}
        style={{ position: "absolute", left: 700, top: 720, transform: `translate(-50%, -50%) scale(${tag})`, fontFamily: HAND, fontSize: 42, color: INK, whiteSpace: "nowrap" }}
      >
        More deck techs, rules and combos.
      </div>
    </>
  );
};

// ---------------------------------------------------------------- Wil's performance

/** Reactions tied to what's being said; spaced at least 2.6 s apart so his mood never flip-flops. */
const RAW_EVENTS: [string, string, string][] = [
  ["intro", "nuclear weapons", "mind-blown"],
  ["intro", "walked over", "laugh"],
  ["intro", "okay i tap", "tap"],
  ["intro", "should never work", "peek"],
  ["intro", "cabbage master", "deal-with-it"],
  ["the-cabbage-merchant", "introducing", "point"],
  ["the-cabbage-merchant", "one little downside", "nervous-sweat"],
  ["the-game-plan", "absurd amount", "shocked"],
  ["the-game-plan", "group hug", "love"],
  ["opening-hands", "go down to five", "mulligan"],
  ["opening-hands", "i still won", "celebrate"],
  ["by-turn-five", "best friend", "love"],
  ["by-turn-five", "chaotic", "table-flip"],
  ["by-turn-five", "mana sinks", "mana"],
  ["by-turn-five", "taking pictures", "shocked"],
  ["how-to-win", "infinite is boring", "sip-tea"],
  ["how-to-win", "also a dino", "laugh"],
  ["how-to-win", "30 bears", "mind-blown"],
  ["how-to-win", "linked in the description", "link-below"],
  ["three-secret-win-cons", "remember those three", "peek"],
  ["three-secret-win-cons", "out of respect", "laugh"],
  ["three-secret-win-cons", "52/52s", "mind-blown"],
  ["three-secret-win-cons", "he scooped", "celebrate"],
  ["crazy-value", "should be illegal", "shocked"],
  ["crazy-value", "absurd rate", "big-brain"],
  ["cabbage-doubling", "count twice", "infinite-combo"],
  ["cabbage-doubling", "said yes", "deal-with-it"],
  ["protection", "stop paying", "shrug"],
  ["upgrades", "absolutely disgusting", "shocked"],
  ["upgrades", "war crimes", "laugh"],
  ["upgrades", "prove the math", "thinking"],
  ["upgrades", "archenemy", "nervous-sweat"],
  ["outro", "death with produce", "laugh"],
  ["outro", "in the comments", "comment"],
  ["outro", "thanks for watching", "wave"],
];
const GAP = 2.6;
const WIL_EVENTS: WilEvent[] = (() => {
  const hello = C("intro", "hello everyone");
  const sub = sec("subscribe");
  const evs: WilEvent[] = [
    { at: hello, anim: "enter" },
    { at: Math.max(C("intro", "wild card commander"), hello + 1.35), anim: "deal-with-it" },
  ];
  const sorted = RAW_EVENTS.map(([s, phrase, anim]) => ({ at: C(s, phrase), anim })).sort((a, b) => a.at - b.at);
  for (const e of sorted) {
    const last = evs[evs.length - 1];
    const at = Math.max(e.at, last.at + GAP);
    // he's off stage while the subscribe overlay (with its own Wil) plays
    if (at > sub.start - 2.2 && at < sub.start + 5) continue;
    evs.push({ at, anim: e.anim });
  }
  evs.push({ at: T.narrationEnd + 2.6, anim: "bell" });
  return evs;
})();

const WilHost: React.FC<{ subStart: number }> = ({ subStart }) => {
  const { t } = useT();
  const hello = C("intro", "hello everyone");
  const move = C("intro", "and welcome");
  if (t < hello) return null;
  const away = ramp(t, subStart - 0.25, subStart) * (1 - ramp(t, subStart + 4.4, subStart + 4.7));
  if (away > 0.999) return null;
  const k = 1 - Math.pow(1 - ramp(t, move, move + 0.7), 3);
  const x = 960 + (1640 - 960) * k;
  const y = 700 + (820 - 700) * k;
  const scale = 2 + (1.25 - 2) * k;
  return (
    <div style={{ opacity: 1 - away }}>
      <Wil timing={T} events={WIL_EVENTS} x={x} y={y} scale={scale} still voice={voiceJson as Voice} looks={looksJson as number[]} expression={expressionJson as unknown as Expression} />
    </div>
  );
};

// ---------------------------------------------------------------- composition

/** [section, scene, camera punch-ins, impact shakes] */
const SCENES: [string, React.FC, string[], string[]][] = [
  ["the-cabbage-merchant", Merchant, [], []],
  ["the-game-plan", GamePlan, ["i'm talking"], []],
  ["opening-hands", OpeningHands, [], []],
  ["subscribe", Subscribe, [], []],
  ["by-turn-five", TurnFive, [], ["chaotic"]],
  ["how-to-win", HowToWin, ["30 bears"], ["also a dino"]],
  ["three-secret-win-cons", Secrets, ["became 52/52s"], ["life totals"]],
  ["crazy-value", CrazyValue, ["absurd rate"], []],
  ["cabbage-doubling", Doubling, [], []],
  ["protection", Protection, [], []],
  ["upgrades", Upgrades, ["a dozen tokens"], []],
  ["outro", Outro, [], []],
];

export const Ep003: React.FC<{ audit?: boolean }> = ({ audit: auditOn = false }) => {
  const fps = 30;
  const sub = sec("subscribe");
  return (
    <AbsoluteFill style={{ background: "#ffffff", overflow: "hidden" }}>
      <div {...audit("root", "stage", 0, 1)} style={{ position: "absolute", inset: 0 }} />
      {/* Wil's narration (Gemini Fenrir; timing.json comes from this exact file) */}
      <Audio src={staticFile("ep003/narration.wav")} />
      <ColdOpen />
      <Cam sec="intro" punches={[C("intro", "73 cabbages"), C("intro", "should never work")]}>
        <Intro />
      </Cam>
      {SCENES.map(([id, Scene, punches, shakes]) => (
        <Cam key={id} sec={id} punches={punches.map((p) => C(id, p))} shakes={shakes.map((p) => C(id, p))}>
          <Scene />
        </Cam>
      ))}
      <Flash times={[C("by-turn-five", "taking pictures"), C("by-turn-five", "taking pictures") + 0.7]} />
      <EndScreen />
      <Sequence from={Math.round(sub.start * fps)} durationInFrames={135}>
        <SubscribeBeat line="More deck breakdowns like this!" accent={ACCENT} background={null} />
      </Sequence>
      <WilHost subStart={sub.start} />
      {auditOn && <AuditProbe every={3} />}
    </AbsoluteFill>
  );
};
