import { Easing } from "remotion";
import type { Anim } from "./animations";
import { ACCENT, armTip, Bubble, Drop, GOLD, INK, MotionLines, RigProps, Sparkle } from "./Rig";
import {
  Arrow,
  BellIcon,
  Brain,
  Broom,
  ChatBubble,
  Coin,
  Cup,
  D20,
  Gem,
  InfinitySym,
  Kernel,
  Keyboard,
  LifeCounter,
  MiniCard,
  Poof,
  PopcornBox,
  Printer,
  Shaker,
  Shield,
  Spinner,
  Table,
  ThumbsUp,
  Tombstone,
  VideoThumb,
} from "./props";
import { hump, I, lerp, S } from "./util";

// Second animation set: Magic, YouTube and meme-style moves. All original drawings.

const R = (deg: number, len = 50) => armTip(180, 150, deg, len, 1);
const L = (deg: number, len = 50) => armTip(0, 150, deg, len, -1);
const GEM_COLORS = ["#f5f0dc", "#3d7cc9", "#3a3a3f", "#d9453a", "#3f9b4c"];

const roll = (f: number, fps: number, win: boolean): RigProps => {
  const deg = I(f, [0, 5, 9], [45, 160, 70]);
  const [hx, hy] = R(deg, 55);
  const t = I(f, [8, 30], [0, 1]);
  const flying = f >= 8;
  const dx = flying ? lerp(205, 275, t) : hx;
  const dy = flying ? lerp(95, 290, t) - 60 * Math.abs(Math.sin(Math.PI * t * 2.5)) * (1 - t) : hy - 10;
  const landed = f >= 30;
  const face = landed ? (win ? "20" : "1") : String(((f * 7) % 20) + 1);
  const after = f >= 32;
  const body: RigProps = win
    ? {
        y: -40 * hump(f, 32, 14),
        leftArm: after ? 165 : 45,
        rightArm: after ? 165 : deg,
        mouth: after ? "grin" : "o",
        brows: "up",
      }
    : {
        rotate: after ? -4 : 0,
        y: after ? 8 : 0,
        squash: after ? 0.95 : 1,
        leftArm: after ? 15 : 45,
        rightArm: after ? 15 : deg,
        mouth: after ? "frown" : "o",
        brows: after ? "sad" : "up",
      };
  return {
    ...body,
    fixed: (
      <g>
        <D20 x={dx} y={dy} rot={landed ? 0 : f * 25} s={landed ? 1 + 0.25 * hump(f, 30, 8) : 1} num={face} color={landed ? (win ? GOLD : "#6e1f1a") : "#4a6aa0"} />
        <Bubble x={90} y={-70} s={S(f, fps, 32)} text={win ? "NAT 20!" : "NAT 1"} color={win ? GOLD : ACCENT} size={46} />
        {!win && <Drop x={58} y={100 + I(f, [36, 58], [0, 50])} opacity={I(f, [36, 40, 56, 60], [0, 1, 1, 0])} />}
      </g>
    ),
  };
};

export const ANIMS2: Anim[] = [
  // ---------------------------------------------------------------- Magic
  {
    id: "tap",
    label: "tap / untap",
    group: "magic",
    duration: 60,
    fn: (f) => ({
      spin: I(f, [6, 14], [0, 90], Easing.out(Easing.back(1.6))) - I(f, [40, 48], [0, 90], Easing.out(Easing.cubic)),
      mouth: "grin",
      brows: "up",
      fixed: <Bubble x={90} y={-60} s={I(f, [12, 16, 38, 42], [0, 1, 1, 0])} text="TAP" color={GOLD} size={48} />,
    }),
  },
  {
    id: "shuffle",
    label: "shuffle",
    group: "magic",
    duration: 60,
    fn: (f) => {
      const [lx, ly] = L(292, 66);
      const [rx, ry] = R(292, 66);
      const flying = Array.from({ length: 10 }, (_, k) => {
        const t = (f - 8 - k * 3) / 10;
        if (t < 0 || t > 1) return null;
        const fwd = k % 2 === 0;
        return <MiniCard key={k} x={lerp(fwd ? lx : rx, fwd ? rx : lx, t)} y={ly - 50 * Math.sin(Math.PI * t)} rot={lerp(-25, 25, t)} s={0.85} />;
      });
      return {
        y: -2 * Math.abs(Math.sin(f * 0.4)),
        leftArm: 292,
        rightArm: 292,
        leftArmLength: 66,
        rightArmLength: 66,
        mouth: "smile",
        brows: "up",
        children: (
          <g>
            {[0, 1, 2].map((i) => (
              <MiniCard key={`l${i}`} x={lx - 2 + i} y={ly + 4 - i * 2} rot={-12} s={0.85} />
            ))}
            {[0, 1, 2].map((i) => (
              <MiniCard key={`r${i}`} x={rx + 2 - i} y={ry + 4 - i * 2} rot={12} s={0.85} />
            ))}
            {flying}
          </g>
        ),
      };
    },
  },
  {
    id: "draw",
    label: "draw a card",
    group: "magic",
    duration: 60,
    fn: (f, fps) => {
      const deg = f < 10 ? I(f, [0, 10], [45, 150]) : I(f, [10, 20], [150, 232]);
      const len = f < 10 ? 55 : I(f, [10, 20], [55, 72]);
      const [hx, hy] = R(deg, len);
      const cx = f < 6 ? 320 : f < 10 ? lerp(320, hx, (f - 6) / 4) : hx;
      const cy = f < 6 ? -60 : f < 10 ? lerp(-60, hy, (f - 6) / 4) : hy;
      const turn = Math.cos(Math.PI * I(f, [20, 28], [0, 1]));
      const down = I(f, [24, 34], [0, 1]);
      return {
        rightArm: deg,
        rightArmLength: len,
        shadesY: 56 + 28 * down,
        eyes: down > 0.4 ? (f > 32 ? "wide" : "open") : "none",
        pupilX: 3,
        brows: f > 34 ? "up" : "raised",
        mouth: f > 36 ? "grin" : "flat",
        children: (
          <g>
            <g transform={`translate(${cx} ${cy}) scale(${Math.abs(turn) * 1.7} 1.7)`}>
              <MiniCard x={0} y={0} face={turn < 0} />
            </g>
            <Bubble x={210} y={-20} s={S(f, fps, 34, { damping: 9 })} text="!" />
          </g>
        ),
      };
    },
  },
  {
    id: "mulligan",
    label: "mulligan",
    group: "magic",
    duration: 60,
    fn: (f, fps) => {
      const deg = f < 28 ? I(f, [0, 8], [45, 215]) : I(f, [28, 36], [215, 150]);
      const [hx, hy] = R(deg, 64);
      const look = I(f, [8, 14], [0, 1]) * (1 - I(f, [44, 52], [0, 1]));
      const cards = [-1, 0, 1].map((k) => {
        if (f < 30) return <MiniCard key={k} x={hx + k * 12} y={hy - Math.abs(k) * 3} rot={k * 15} s={1.2} />;
        const t = f - 30 - (k + 1) * 2;
        return t < 0 ? (
          <MiniCard key={k} x={hx + k * 12} y={hy} rot={k * 15} s={1.2} />
        ) : (
          <MiniCard key={k} x={hx - t * 12 + k * 10} y={hy - t * 8 + 0.5 * t * t} rot={k * 15 - t * 25} s={1.2} o={I(t, [10, 18], [1, 0])} />
        );
      });
      return {
        rightArm: deg,
        rightArmLength: 64,
        shadesY: 56 + 28 * look,
        eyes: look > 0.4 ? "open" : "none",
        pupilX: 3,
        brows: f > 18 && f < 46 ? "angry" : "raised",
        mouth: f < 18 ? "flat" : f < 46 ? "frown" : "smile",
        children: <g>{cards}</g>,
        fixed: <Bubble x={210} y={-30} s={I(f, [46, 52], [0, 1])} text="NEW 7" color={GOLD} size={34} />,
      };
    },
  },
  {
    id: "counterspell",
    label: "counterspell (nope)",
    group: "magic",
    duration: 50,
    fn: (f, fps) => {
      const orbX = f < 18 ? I(f, [6, 18], [-340, -165]) : I(f, [18, 30], [-165, -330]);
      const orbY = 130 - (f >= 18 ? I(f, [18, 30], [0, 80]) : 0);
      return {
        leftArm: I(f, [0, 6], [45, 100]),
        leftArmLength: 58,
        brows: f < 18 ? "angry" : "raised",
        mouth: f < 18 ? "flat" : "grin",
        children: <Sparkle x={134} y={58} s={I(f, [30, 34, 40], [0, 1, 0])} />,
        fixed: (
          <g>
            <Shield x={-110} y={130} s={S(f, fps, 3, { damping: 9 })} text="NOPE" />
            {f >= 6 && f <= 30 && <circle cx={orbX} cy={orbY} r={14} fill="#8e5bd6" stroke={INK} strokeWidth={3} />}
            <Sparkle x={-160} y={130} s={1.4 * hump(f, 18, 8)} color={GOLD} />
          </g>
        ),
      };
    },
  },
  {
    id: "board-wipe",
    label: "board wipe",
    group: "magic",
    duration: 60,
    fn: (f) => {
      const [hx, hy] = R(60, 62);
      const sweep = Math.sin(f * 0.35) * 35 * I(f, [0, 6, 44, 50], [0, 1, 1, 0]);
      const cards = [150, 190, 230, 270, 310, 120].map((x0, k) => {
        const fk = 10 + k * 5;
        const t = f - fk;
        return (
          <g key={k}>
            <MiniCard
              x={t < 0 ? x0 : x0 + t * 14}
              y={t < 0 ? 306 : 306 - t * 9 + 0.6 * t * t}
              rot={t < 0 ? 90 : 90 + t * 30}
              o={t < 0 ? 1 : I(t, [12, 18], [1, 0])}
            />
            <Poof x={x0} y={300} s={0.7 * hump(f, fk, 12)} o={0.9} />
          </g>
        );
      });
      return {
        rightArm: 60,
        rightArmLength: 62,
        rotate: sweep * 0.08,
        brows: f < 46 ? "angry" : "up",
        mouth: f < 46 ? "flat" : "smile",
        children: (
          <g transform={`rotate(${sweep} ${hx} ${hy})`}>
            <Broom x={hx} y={hy + 110} />
          </g>
        ),
        fixed: <g>{cards}</g>,
      };
    },
  },
  {
    id: "infinite-combo",
    label: "infinite combo",
    group: "magic",
    duration: 75,
    fn: (f, fps) => {
      const jitter = Math.sin(f * 2.2) * Math.min(2, f / 30);
      const n = f < 55 ? `x${Math.floor(Math.pow(2, f / 4.5))}` : "x∞";
      return {
        rotate: jitter * 3,
        x: jitter * 1.5,
        mouth: f < 30 ? "grin" : "open",
        brows: "up",
        leftArm: 120 + jitter * 10,
        rightArm: 120 - jitter * 10,
        fixed: (
          <g>
            <InfinitySym x={90} y={-72} s={S(f, fps, 4) * (1 + 0.08 * Math.sin(f * 0.5))} rot={Math.sin(f * 0.1) * 10} />
            {f > 8 && <Bubble x={270} y={60} s={1} text={n} color={GOLD} size={34} />}
            {[0, 1].map((k) => {
              const a = f * 0.15 + k * Math.PI;
              return <Arrow key={k} x={90 + 170 * Math.cos(a)} y={140 + 120 * Math.sin(a)} rot={(a * 180) / Math.PI} s={0.6} color={ACCENT} />;
            })}
          </g>
        ),
      };
    },
  },
  { id: "nat-20", label: "nat 20", group: "magic", duration: 60, fn: (f, fps) => roll(f, fps, true) },
  { id: "nat-1", label: "nat 1", group: "magic", duration: 60, fn: (f, fps) => roll(f, fps, false) },
  {
    id: "coin-flip",
    label: "coin flip",
    group: "magic",
    duration: 60,
    fn: (f, fps) => {
      const t = I(f, [6, 34], [0, 1]);
      const caught = f >= 34;
      const [hx, hy] = R(110, 55);
      return {
        rightArm: I(f, [0, 6], [45, 110]),
        rightArmLength: 55,
        rotate: -4 * Math.sin(Math.PI * t),
        brows: caught ? "up" : "raised",
        mouth: caught ? "grin" : "o",
        fixed: (
          <g>
            <Coin x={hx + 4} y={caught ? hy - 14 : hy - 14 - 200 * Math.sin(Math.PI * t)} sx={caught ? 1 : Math.cos(f * 0.9)} />
            <Bubble x={230} y={-40} s={S(f, fps, 36)} text="HEADS!" color={GOLD} size={36} />
          </g>
        ),
      };
    },
  },
  {
    id: "mana",
    label: "mana",
    group: "magic",
    duration: 60,
    fn: (f, fps) => {
      const r = 150 * S(f, fps, 6);
      const gems = GEM_COLORS.map((c, k) => {
        const a = f * 0.08 + (k * Math.PI * 2) / 5;
        return { c, x: 90 + r * Math.cos(a), y: 126 + 0.45 * r * Math.sin(a), front: Math.sin(a) > 0, k };
      });
      const draw = (front: boolean) =>
        gems.filter((g) => g.front === front).map((g) => <Gem key={g.k} x={g.x} y={g.y} color={g.c} s={1.3} rot={f * 4} />);
      return {
        leftArm: I(f, [0, 10], [45, 160]),
        rightArm: I(f, [0, 10], [45, 160]),
        mouth: "grin",
        brows: "up",
        behind: (
          <g>
            <ellipse cx={90} cy={126} rx={170 * S(f, fps, 4)} ry={170 * S(f, fps, 4)} fill={GOLD} opacity={0.18} />
            {draw(false)}
          </g>
        ),
        children: <Sparkle x={134} y={58} s={I(f, [20, 25, 32], [0, 1, 0])} />,
        fixed: <g>{draw(true)}</g>,
      };
    },
  },
  {
    id: "reanimate",
    label: "reanimate",
    group: "magic",
    duration: 80,
    fn: (f, fps) => {
      const down = I(f, [0, 10], [0, 1], Easing.in(Easing.quad));
      const up = S(f, fps, 40, { damping: 10 });
      const lying = down * (1 - up);
      const zombie = f >= 40;
      return {
        spin: -90 * lying,
        y: 70 * lying,
        shadesOn: f < 4 || zombie,
        eyes: f >= 4 && !zombie ? "x" : "none",
        mouth: zombie ? "open" : "flat",
        brows: zombie ? "angry" : "none",
        leftArm: zombie ? 95 : 45,
        rightArm: zombie ? 95 : 45,
        leftArmLength: zombie ? 62 : 50,
        rightArmLength: zombie ? 62 : 50,
        behind: (
          <g>
            <circle cx={90} cy={140} r={200} fill="#6ee07a" opacity={0.35 * hump(f, 32, 30)} />
            <Tombstone x={150} y={300 + I(f, [12, 24], [140, 0])} o={I(f, [12, 14, 52, 62], [0, 1, 1, 0])} />
          </g>
        ),
      };
    },
  },
  {
    id: "exile",
    label: "exile (beamed away)",
    group: "magic",
    duration: 50,
    fn: (f) => ({
      y: I(f, [12, 40], [0, -420], Easing.in(Easing.quad)),
      grow: I(f, [12, 40], [1, 0.6]),
      opacity: I(f, [30, 40], [1, 0]),
      leftArm: I(f, [4, 12], [45, 150]),
      rightArm: I(f, [4, 12], [45, 150]),
      mouth: "o",
      brows: "up",
      behind: <rect x={-20} y={-160} width={220} height={480} rx={20} fill="#fff4b8" opacity={I(f, [0, 8, 40, 50], [0, 0.75, 0.75, 0])} />,
      fixed: (
        <g>
          {[0, 1, 2, 3].map((k) => (
            <Sparkle key={k} x={[10, 170, 40, 150][k]} y={260 - (f - k * 5) * 9} s={hump(f, 6 + k * 5, 24)} color={GOLD} />
          ))}
        </g>
      ),
    }),
  },
  {
    id: "sleeve-up",
    label: "sleeve up",
    group: "magic",
    duration: 50,
    fn: (f) => {
      const sy = I(f, [4, 20], [-320, -6], Easing.out(Easing.quad));
      const shine = I(f, [24, 36], [-40, 240]);
      return {
        squash: 1 - 0.06 * hump(f, 20, 8),
        mouth: f > 20 ? "grin" : "o",
        brows: "up",
        children: (
          <g>
            <rect x={-6} y={sy} width={192} height={264} rx={16} fill="#ffffff" fillOpacity={0.22} stroke="#9fc3d9" strokeWidth={3} />
            {f >= 24 && f <= 36 && <line x1={shine} y1={4} x2={shine - 70} y2={248} stroke="#fff" strokeWidth={10} strokeOpacity={0.6} strokeLinecap="round" />}
            <Sparkle x={170} y={10} s={I(f, [36, 40, 46], [0, 1.2, 0])} />
          </g>
        ),
      };
    },
  },
  {
    id: "salty",
    label: "salty",
    group: "magic",
    duration: 60,
    fn: (f, fps) => {
      const [hx, hy] = R(190, 120);
      const grains = Array.from({ length: 12 }, (_, k) => {
        const t = (f - 6 - k * 3 + 60) % 24;
        return f < 6 + k * 3 ? null : <rect key={k} x={hx - 18 + ((k * 13) % 36)} y={hy + 20 + t * 5} width={5} height={5} fill="#fff" stroke={INK} strokeWidth={1} opacity={I(t, [0, 3, 18, 24], [0, 1, 1, 0])} />;
      });
      return {
        rightArm: I(f, [0, 6], [45, 190]),
        rightArmLength: I(f, [0, 6], [50, 120]),
        brows: "angry",
        mouth: "wavy",
        children: (
          <g>
            <Shaker x={hx} y={hy - 4} rot={180 + Math.sin(f * 1.2) * 25} />
            {grains}
          </g>
        ),
        fixed: <Bubble x={-40} y={-30} s={S(f, fps, 12)} text="salty" color={GOLD} size={34} />,
      };
    },
  },
  {
    id: "table-flip",
    label: "table flip (rage quit)",
    group: "magic",
    duration: 50,
    fn: (f, fps) => {
      const t = Math.max(0, f - 14);
      const flying = f >= 14;
      return {
        squash: f < 10 ? 1 - 0.1 * I(f, [0, 10], [0, 1]) : f < 18 ? 1.08 : 1,
        rotate: f >= 10 ? -6 : 0,
        leftArm: f < 10 ? 20 : 175,
        rightArm: f < 10 ? 20 : 175,
        brows: "angry",
        mouth: "open",
        fixed: (
          <g opacity={I(f, [38, 48], [1, 0])}>
            <Table x={90 + t * 9} y={330 - t * 14 + 0.8 * t * t} rot={flying ? -t * 14 : 0} />
            {flying &&
              [0, 1, 2, 3, 4, 5].map((k) => (
                <MiniCard key={k} x={40 + k * 20 + t * (k - 2) * 5} y={318 - t * (10 + k) + 0.7 * t * t} rot={t * (k % 2 ? 30 : -30)} />
              ))}
            <Bubble x={90} y={-60} s={S(f, fps, 16)} text="RAGE QUIT" color={ACCENT} size={40} />
          </g>
        ),
      };
    },
  },
  {
    id: "life-loss",
    label: "life loss",
    group: "magic",
    duration: 60,
    fn: (f) => {
      const hits = [10, 25, 40];
      const n = f < 10 ? 40 : f < 25 ? 33 : f < 40 ? 26 : 19;
      const hit = hits.reduce((acc, h) => acc + hump(f, h, 6), 0);
      const hurt = hits.filter((h) => f >= h).length;
      return {
        squash: 1 - 0.08 * hit,
        rotate: Math.sin(f * 3) * 4 * hit,
        x: -6 * hit,
        brows: hurt > 0 ? "sad" : "none",
        mouth: hurt === 0 ? "smile" : hurt < 3 ? "frown" : "teeth",
        fixed: (
          <g>
            <LifeCounter x={265} y={30} n={n} shake={Math.sin(f * 3) * 8 * hit} />
            {hits.map((h, k) =>
              f >= h ? <Bubble key={k} x={300} y={-20 - (f - h) * 3} s={I(f - h, [0, 3, 12, 16], [0, 1, 1, 0])} text="-7" color={ACCENT} size={30} /> : null,
            )}
          </g>
        ),
      };
    },
  },
  // ---------------------------------------------------------------- YouTube
  {
    id: "like",
    label: "like",
    group: "youtube",
    duration: 50,
    fn: (f, fps) => ({
      rightArm: I(f, [0, 8], [45, 150]),
      rightArmLength: 60,
      y: -8 * hump(f, 6, 12),
      mouth: "grin",
      brows: "up",
      fixed: (
        <g>
          <ThumbsUp x={228} y={30} s={S(f, fps, 6, { damping: 8 })} />
          <Bubble x={292} y={-10 - I(f, [16, 40], [0, 60])} s={I(f, [16, 20, 36, 42], [0, 1, 1, 0])} text="+1" color={GOLD} size={34} />
        </g>
      ),
    }),
  },
  {
    id: "bell",
    label: "ring the bell",
    group: "youtube",
    duration: 50,
    fn: (f) => {
      const [hx, hy] = R(160, 60);
      const ring = Math.sin(f * 1.1) * 30 * I(f, [4, 44], [1, 0]);
      return {
        rightArm: I(f, [0, 5], [45, 160]),
        rightArmLength: 60,
        mouth: f > 6 ? "open" : "smile",
        brows: "up",
        children: (
          <g>
            <BellIcon x={hx} y={hy - 34} rot={ring} />
            {[18, 30].map((r, k) => (
              <path
                key={k}
                d={`M${hx + r + 14} ${hy - 60} q10 20 0 40 M${hx - r - 14} ${hy - 60} q-10 20 0 40`}
                stroke={INK}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                opacity={Math.abs(ring) > 8 ? 0.8 : 0}
              />
            ))}
          </g>
        ),
        fixed: <Bubble x={250} y={-30} s={I(f, [6, 10, 38, 44], [0, 1, 1, 0])} text="ding!" color={GOLD} size={32} />,
      };
    },
  },
  {
    id: "comment",
    label: "typing a comment",
    group: "youtube",
    duration: 60,
    fn: (f, fps) => {
      const tap = Math.sin(f * 1.4) * 4;
      return {
        leftArm: 337 + tap,
        rightArm: 337 - tap,
        leftArmLength: 103,
        rightArmLength: 103,
        brows: "raised",
        mouth: f < 40 ? "flat" : "smile",
        children: <Keyboard x={90} y={262} />,
        fixed: <ChatBubble x={230} y={-40} s={S(f, fps, 2)} dots={Math.floor(f / 5) % 3} lines={f < 28 ? 0 : Math.min(3, 1 + Math.floor((f - 28) / 6))} />,
      };
    },
  },
  {
    id: "link-below",
    label: "link in the description",
    group: "youtube",
    duration: 50,
    fn: (f, fps) => ({
      rightArm: I(f, [0, 6], [45, 12]),
      rightArmLength: 72,
      rotate: 4,
      mouth: "grin",
      brows: "up",
      fixed: (
        <g>
          <Arrow x={250} y={262 + 10 * Math.sin(f * 0.5)} s={S(f, fps, 4)} />
          <Bubble x={250} y={335} s={S(f, fps, 8)} text="description" color={GOLD} size={26} />
        </g>
      ),
    }),
  },
  {
    id: "watch-next",
    label: "watch next",
    group: "youtube",
    duration: 50,
    fn: (f, fps) => ({
      rightArm: I(f, [0, 6], [45, 140]),
      rightArmLength: 70,
      rotate: 3,
      mouth: "grin",
      brows: "up",
      fixed: (
        <g>
          <VideoThumb x={275} y={-15} s={S(f, fps, 6, { damping: 9 })} />
          <MotionLines x={275} y={-70} opacity={I(f, [8, 14, 30, 36], [0, 1, 1, 0])} color={GOLD} />
        </g>
      ),
    }),
  },
  {
    id: "views-up",
    label: "views going up",
    group: "youtube",
    duration: 60,
    fn: (f, fps) => {
      const pts: [number, number][] = [
        [-140, 300],
        [-70, 250],
        [0, 270],
        [80, 170],
        [160, 190],
        [250, 40],
        [320, -60],
      ];
      const t = I(f, [4, 40], [0, 1]) * (pts.length - 1);
      const whole = Math.floor(t);
      const shown = pts.slice(0, whole + 1);
      if (whole < pts.length - 1) {
        const [ax, ay] = pts[whole];
        const [bx, by] = pts[whole + 1];
        shown.push([lerp(ax, bx, t - whole), lerp(ay, by, t - whole)]);
      }
      const [ex, ey] = shown[shown.length - 1];
      const labels = [
        { at: 1.5, x: -60, y: 220, text: "1K" },
        { at: 3.5, x: 90, y: 140, text: "10K" },
        { at: 5.5, x: 250, y: 10, text: "100K" },
      ];
      return {
        rotate: -3,
        leftArm: 30,
        rightArm: 30,
        leftArmLength: 40,
        rightArmLength: 40,
        mouth: "smile",
        children: <Sparkle x={134} y={58} s={I(f, [42, 46, 52], [0, 1.2, 0])} />,
        behind: (
          <g>
            <polyline points={shown.map((p) => p.join(",")).join(" ")} fill="none" stroke="#1f7a3a" strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={ex} cy={ey} r={9} fill="#5fd068" stroke={INK} strokeWidth={3} />
            {labels.map((l, k) => (
              <Bubble key={k} x={l.x} y={l.y} s={t >= l.at ? S(f, fps, Math.round(4 + (l.at / 6) * 36)) : 0} text={l.text} color={GOLD} size={30} />
            ))}
          </g>
        ),
      };
    },
  },
  {
    id: "loading",
    label: "loading…",
    group: "youtube",
    duration: 60,
    loop: true,
    fn: (f) => ({
      legs: Math.max(0, Math.sin(f * 0.6)) * 10,
      leftArm: 30,
      rightArm: 30,
      leftArmLength: 38,
      rightArmLength: 38,
      brows: "angry",
      mouth: "flat",
      fixed: <Spinner x={90} y={-70} rot={f * 12} />,
    }),
  },
  // ---------------------------------------------------------------- Meme-style
  {
    id: "big-brain",
    label: "big brain",
    group: "meme",
    duration: 80,
    fn: (f, fps) => {
      const stage = f < 30 ? 1 : f < 50 ? 2 : 3;
      const s = f < 10 ? 0 : f < 30 ? S(f, fps, 10) * 0.8 : f < 50 ? 0.8 + S(f, fps, 30) * 0.35 : 1.15 + S(f, fps, 50) * 0.4;
      return {
        mouth: stage === 1 ? "smile" : stage === 2 ? "grin" : "open",
        brows: "up",
        grow: stage === 3 ? I(f, [50, 60], [1, 1.04]) : 1,
        children: <Sparkle x={134} y={58} s={hump(f, 10, 10) + hump(f, 30, 10) + hump(f, 50, 10)} />,
        fixed: <Brain x={90} y={-60} s={s} hue={["#f2a3b3", "#c9a0f2", "#8fd3f4"][stage - 1]} glow={stage === 3 ? I(f, [50, 60], [0, 1]) : stage === 2 ? 0.4 : 0} />,
      };
    },
  },
  {
    id: "mind-blown",
    label: "mind blown",
    group: "meme",
    duration: 50,
    fn: (f) => {
      const boom = f >= 10;
      const shake = boom && f < 30 ? Math.sin(f * 3) * 3 : 0;
      return {
        leftArm: I(f, [0, 8], [45, 172.9]),
        rightArm: I(f, [0, 8], [45, 172.9]),
        leftArmLength: I(f, [0, 8], [50, 80.6]),
        rightArmLength: I(f, [0, 8], [50, 80.6]),
        x: shake,
        shadesY: boom ? I(f, [10, 20], [56, -160]) : 56,
        shadesRotate: boom ? (f - 10) * 30 : 0,
        eyes: boom ? (f > 30 ? "star" : "wide") : "none",
        brows: "up",
        mouth: boom ? "o" : "flat",
        fixed: (
          <g>
            <Poof x={90} y={-30} s={I(f, [10, 18], [0, 1.8])} o={I(f, [30, 44], [1, 0])} />
            {[0, 1, 2, 3, 4].map((k) => (
              <Sparkle key={k} x={90 + Math.cos(k * 1.3) * (f - 10) * 6} y={-30 + Math.sin(k * 1.3) * (f - 10) * 4} s={boom ? hump(f, 10 + k, 20) : 0} color={GOLD} />
            ))}
          </g>
        ),
      };
    },
  },
  {
    id: "sip-tea",
    label: "sips tea (side-eye)",
    group: "meme",
    duration: 75,
    fn: (f) => {
      const raise = I(f, [0, 12], [0, 1]) * (1 - I(f, [44, 56], [0, 1]));
      const deg = lerp(300, 250.3, raise);
      const len = lerp(60, 74, raise);
      const [hx, hy] = R(deg, len);
      const peek = I(f, [14, 24], [0, 1]) * (1 - I(f, [60, 70], [0, 1]));
      return {
        rightArm: deg,
        rightArmLength: len,
        shadesY: 56 + 28 * peek,
        eyes: peek > 0.4 ? "open" : "none",
        pupilX: -4,
        brows: "raised",
        mouth: raise > 0.5 ? "flat" : "smile",
        children: <Cup x={hx} y={hy} rot={raise > 0.9 && f > 20 && f < 40 ? -20 : 0} steam={f} />,
      };
    },
  },
  {
    id: "popcorn",
    label: "popcorn (watching drama)",
    group: "meme",
    duration: 80,
    loop: true,
    fn: (f) => {
      const p = (Math.sin(f * 0.35) + 1) / 2;
      const deg = lerp(288.9, 253.6, p);
      const len = lerp(107.8, 88.6, p);
      const [hx, hy] = R(deg, len);
      return {
        leftArm: 300,
        leftArmLength: 90,
        rightArm: deg,
        rightArmLength: len,
        shadesY: 84,
        eyes: "open",
        pupilX: 4,
        brows: "raised",
        mouth: p > 0.7 ? (Math.floor(f / 3) % 2 ? "chew" : "flat") : "chew",
        children: (
          <g>
            <PopcornBox x={78} y={200} />
            {p < 0.8 && <Kernel x={hx} y={hy - 6} />}
            {[0, 1].map((k) => {
              const t = (f + k * 20) % 40;
              return <Kernel key={k} x={70 + k * 20 + t * (k ? 2 : -2)} y={170 - t * 4 + 0.15 * t * t} o={I(t, [0, 4, 30, 40], [0, 1, 1, 0])} />;
            })}
          </g>
        ),
      };
    },
  },
  {
    id: "nervous-sweat",
    label: "nervous sweat",
    group: "meme",
    duration: 60,
    loop: true,
    fn: (f) => ({
      x: Math.sin(f * 2.5) * 1.5,
      mouth: "teeth",
      brows: "sad",
      shadesY: 56 + I(f, [0, 40], [0, 10]),
      shadesRotate: I(f, [0, 40], [0, 5]),
      leftArm: 20,
      rightArm: 20,
      leftArmLength: 40,
      rightArmLength: 40,
      children: (
        <g>
          {[20, 160, 40, 140].map((x, k) => {
            const t = (f + k * 15) % 40;
            return <Drop key={k} x={x} y={20 + t * 5} opacity={I(t, [0, 4, 32, 40], [0, 1, 1, 0])} />;
          })}
        </g>
      ),
    }),
  },
  {
    id: "dab",
    label: "dab",
    group: "meme",
    duration: 40,
    fn: (f) => {
      const d = I(f, [6, 12], [0, 1], Easing.out(Easing.back(1.5))) * (1 - I(f, [34, 40], [0, 1]));
      return {
        rotate: -12 * d,
        rightArm: lerp(45, 140, d),
        rightArmLength: lerp(50, 80, d),
        leftArm: lerp(45, 225, d),
        leftArmLength: lerp(50, 99, d),
        mouth: "grin",
        brows: "up",
        fixed: <MotionLines x={260} y={30} opacity={I(f, [10, 14, 26, 32], [0, 1, 1, 0])} color={GOLD} />,
      };
    },
  },
  {
    id: "reprint",
    label: "reprint printer go brrr",
    group: "meme",
    duration: 80,
    fn: (f, fps) => {
      const printing = f >= 10 && f < 62;
      const cards = Array.from({ length: 10 }, (_, k) => {
        const t = (f - 10 - k * 5) / 16;
        if (t < 0) return null;
        const u = Math.min(1, t);
        return <MiniCard key={k} x={lerp(-50, 230, u)} y={lerp(255, 318 - k * 4, u) - 70 * Math.sin(Math.PI * u)} rot={lerp(0, 90, u)} s={1.1} />;
      });
      const happy = f >= 30;
      return {
        mouth: happy ? "grin" : "o",
        brows: "up",
        y: happy ? -10 * Math.abs(Math.sin(f * 0.3)) : 0,
        leftArm: happy ? 160 : 45,
        rightArm: happy ? 160 : 45,
        fixed: (
          <g>
            <Printer x={-100} y={250} shake={printing ? Math.sin(f * 3) * 2 : 0} />
            {cards}
            <Bubble x={-100 + (printing ? Math.sin(f * 2) * 3 : 0)} y={170} s={printing ? S(f, fps, 12) : 0} text="BRRR" color={GOLD} size={38} />
          </g>
        ),
      };
    },
  },
];
