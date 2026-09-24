import { Easing } from "remotion";
import { I, S, hump } from "./util";
import { ACCENT, Bubble, Drop, GOLD, Heart, INK, MotionLines, PAPER, RigProps, Sparkle, Stamp } from "./Rig";

// Expressive animation library for the Wild Card Commander mascot.
// Each entry maps a frame to rig props. Render one with:  npx remotion render Mascot-<id> out/<id>.webm (see README)

export type Anim = { id: string; label: string; duration: number; loop?: boolean; group?: string; fn: (f: number, fps: number) => RigProps };

const CONFETTI = Array.from({ length: 16 }, (_, i) => {
  const a = (-Math.PI / 2) + (i - 7.5) * 0.17 + ((i * 37) % 7) * 0.02;
  const v = 9 + ((i * 53) % 5);
  return { vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: (i * 47) % 360, spin: ((i % 3) - 1) * 14, c: [ACCENT, GOLD, "#4a6aa0", "#1f7a3a", PAPER][i % 5] };
});

export const ANIMS: Anim[] = [
  {
    id: "idle",
    label: "idle",
    duration: 60,
    loop: true,
    fn: (f) => {
      const s = Math.sin((f / 60) * Math.PI * 2);
      return {
        y: s * 3,
        squash: 1 + s * 0.015,
        leftArm: 45 + s * 4,
        rightArm: 45 - s * 4,
        children: <Sparkle x={132} y={58} s={I(f, [20, 26, 34], [0, 1, 0])} />,
      };
    },
  },
  {
    id: "wave",
    label: "wave",
    duration: 60,
    fn: (f) => {
      const amp = I(f, [0, 8, 50, 58], [0, 1, 1, 0]);
      return {
        rightArm: 45 + amp * 105 + amp * Math.sin(f * 0.55) * 28,
        rotate: -3 * amp,
        y: -4 * amp,
        mouth: amp > 0.3 ? "grin" : "smile",
        brows: "up",
      };
    },
  },
  {
    id: "deal-with-it",
    label: "shades drop",
    duration: 60,
    fn: (f, fps) => {
      const falling = f < 16;
      const shadesY = falling ? I(f, [0, 16], [-150, 56], Easing.in(Easing.quad)) : 56;
      const arm = S(f, fps, 18);
      return {
        shadesY,
        eyes: f < 14 ? "open" : "none",
        pupilY: -3,
        brows: f < 14 ? "raised" : "none",
        mouth: f < 16 ? "flat" : "grin",
        squash: 1 - 0.08 * hump(f, 16, 10),
        rightArm: 45 + arm * 92,
        rightArmLength: 50 + arm * 8,
        children: (
          <g>
            {falling && <MotionLines x={90} y={shadesY - 20} />}
            <Sparkle x={134} y={58} s={I(f, [20, 25, 32], [0, 1.1, 0])} />
          </g>
        ),
      };
    },
  },
  {
    id: "peek",
    label: "hold on… (peek)",
    duration: 75,
    fn: (f, fps) => {
      const arm = S(f, fps, 0, { damping: 14 }) * (1 - I(f, [58, 68], [0, 1]));
      const down = I(f, [10, 22], [0, 1]) * (1 - I(f, [56, 66], [0, 1]));
      const lookX = f < 34 ? -3 : f < 40 ? 3 : 0;
      return {
        rightArm: 45 + arm * 169,
        shadesY: 56 + 28 * down,
        eyes: down > 0.4 ? (f >= 42 && f <= 45 ? "closed" : "open") : "none",
        pupilX: lookX,
        brows: "raised",
        mouth: f < 60 ? "flat" : "smile",
      };
    },
  },
  {
    id: "shocked",
    label: "shocked",
    duration: 45,
    fn: (f, fps) => {
      const shadesY = I(f, [3, 10, 24, 34], [56, -50, -50, 56]);
      const pop = S(f, fps, 2, { damping: 9 }) * (1 - I(f, [34, 42], [0, 1]));
      return {
        y: -34 * hump(f, 0, 14),
        squash: 1 - 0.1 * hump(f, 14, 6),
        shadesY,
        shadesRotate: I(f, [3, 10, 24, 34], [0, -25, -25, 0]),
        eyes: shadesY < 40 ? "wide" : "none",
        brows: "up",
        mouth: f < 30 ? "o" : "flat",
        leftArm: I(f, [0, 6, 26, 34], [45, 160, 160, 45]),
        rightArm: I(f, [0, 6, 26, 34], [45, 160, 160, 45]),
        children: <Bubble x={200} y={-20} s={pop} text="!" />,
      };
    },
  },
  {
    id: "laugh",
    label: "laugh",
    duration: 60,
    fn: (f) => {
      const shake = Math.sin(f * 1.5) * I(f, [0, 6, 52, 60], [0, 1, 1, 0]);
      const has = [8, 22, 36].map((t0, k) => (
        <Bubble key={k} x={k % 2 ? -30 : 210} y={-4 - k * 14} s={I(f, [t0, t0 + 5, t0 + 14, t0 + 18], [0, 1, 1, 0])} text="ha" color={GOLD} size={40} />
      ));
      return {
        rotate: shake * 5,
        y: -Math.abs(Math.sin(f * 0.75)) * 8,
        mouth: "open",
        brows: "up",
        leftArm: 75 + shake * 12,
        rightArm: 75 - shake * 12,
        children: <g>{has}</g>,
      };
    },
  },
  {
    id: "shrug",
    label: "shrug",
    duration: 50,
    fn: (f) => {
      const up = I(f, [0, 10, 38, 48], [0, 1, 1, 0], Easing.out(Easing.quad));
      return {
        leftArm: 45 + up * 95,
        rightArm: 45 + up * 95,
        leftArmLength: 50 + up * 8,
        rightArmLength: 50 + up * 8,
        y: -8 * up,
        rotate: -5 * up,
        mouth: "wavy",
        brows: "raised",
        children: <Bubble x={200} y={-10} s={up} text="?" color={GOLD} />,
      };
    },
  },
  {
    id: "facepalm",
    label: "facepalm",
    duration: 70,
    fn: (f, fps) => {
      const arm = S(f, fps, 0, { damping: 12 });
      const slump = I(f, [8, 20], [0, 1]);
      return {
        rightArm: 45 + arm * 180,
        rightArmLength: 50 + arm * 63,
        rotate: 6 * slump,
        y: 6 * slump,
        squash: 1 - 0.04 * slump,
        shadesRotate: 10 * slump,
        shadesX: 4 * slump,
        mouth: "frown",
        brows: "sad",
        children: <Drop x={160} y={30 + I(f, [24, 60], [0, 40])} opacity={I(f, [24, 30, 58, 66], [0, 1, 1, 0])} />,
      };
    },
  },
  {
    id: "celebrate",
    label: "celebrate",
    duration: 60,
    fn: (f) => {
      const crouch = f < 6 ? I(f, [0, 6], [0, 1]) : 0;
      const air = hump(f, 6, 20);
      const t = Math.max(0, f - 12);
      const fade = I(f, [44, 58], [1, 0]);
      return {
        y: -80 * air,
        squash: f < 6 ? 1 - 0.1 * crouch : f < 26 ? 1 + 0.06 * air : 1 - 0.1 * hump(f, 26, 6),
        leftArm: f < 6 ? 30 : 165 + Math.sin(f * 0.8) * 10,
        rightArm: f < 6 ? 30 : 165 - Math.sin(f * 0.8) * 10,
        mouth: "grin",
        brows: "up",
        fixed:
          f >= 12 ? (
            <g opacity={fade}>
              {CONFETTI.map((c, i) => (
                <rect
                  key={i}
                  x={90 + c.vx * t - 5}
                  y={-30 + c.vy * t + 0.35 * t * t - 3}
                  width={10}
                  height={6}
                  fill={c.c}
                  stroke={INK}
                  strokeWidth={1.2}
                  transform={`rotate(${c.rot + c.spin * t} ${90 + c.vx * t} ${-30 + c.vy * t + 0.35 * t * t})`}
                />
              ))}
            </g>
          ) : null,
      };
    },
  },
  {
    id: "sad",
    label: "sad",
    duration: 60,
    fn: (f) => {
      const d = I(f, [0, 20], [0, 1], Easing.out(Easing.quad));
      return {
        rotate: -3 * d,
        y: 10 * d,
        squash: 1 - 0.05 * d,
        leftArm: 45 - 30 * d,
        rightArm: 45 - 30 * d,
        shadesY: 56 + 10 * d,
        shadesRotate: -6 * d,
        brows: "sad",
        mouth: "frown",
        children: <Drop x={58} y={100 + I(f, [22, 56], [0, 70])} opacity={I(f, [22, 26, 52, 58], [0, 1, 1, 0])} />,
      };
    },
  },
  {
    id: "yes",
    label: "yes (nod)",
    duration: 45,
    fn: (f, fps) => {
      const bob = f < 30 ? Math.abs(Math.sin((f * Math.PI) / 10)) : 0;
      return {
        y: bob * 8,
        shadesY: 56 + bob * 6,
        rotate: bob * 2,
        mouth: "smile",
        brows: "up",
        children: <Stamp x={220} y={0} s={S(f, fps, 18, { damping: 10 })} kind="tick" />,
      };
    },
  },
  {
    id: "no",
    label: "no (head shake)",
    duration: 45,
    fn: (f, fps) => {
      const shake = f < 32 ? Math.sin(f * 0.8) * (1 - f / 40) : 0;
      return {
        rotate: shake * 9,
        shadesX: shake * 3,
        mouth: "flat",
        brows: "angry",
        children: <Stamp x={220} y={0} s={S(f, fps, 16, { damping: 10 })} kind="cross" />,
      };
    },
  },
  {
    id: "point",
    label: "point",
    duration: 50,
    fn: (f, fps) => {
      const p = S(f, fps, 0, { damping: 10, stiffness: 170 });
      const beat = f >= 14 && f <= 40 ? Math.max(0, Math.sin((f - 14) * 0.5)) : 0;
      return {
        rightArm: 45 + p * 51,
        rightArmLength: 50 + p * 22,
        rotate: 4 * p,
        y: -beat * 6,
        mouth: "grin",
        brows: "raised",
        children: <Sparkle x={258} y={128} s={I(f, [8, 13, 20], [0, 1, 0])} color={GOLD} />,
      };
    },
  },
  {
    id: "thinking",
    label: "thinking",
    duration: 75,
    fn: (f, fps) => {
      const a = S(f, fps, 0, { damping: 14 });
      const dots = [
        { t: 15, x: 206, y: 18, r: 6 },
        { t: 25, x: 226, y: -12, r: 9 },
        { t: 35, x: 252, y: -48, r: 14 },
      ];
      return {
        rightArm: 45 + a * 213,
        rightArmLength: 50 + a * 12,
        rotate: Math.sin(f * 0.12) * 2,
        shadesRotate: 4 * a,
        brows: "raised",
        mouth: "wavy",
        children: (
          <g>
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.r * I(f, [d.t, d.t + 6], [0, 1])} fill={PAPER} stroke={INK} strokeWidth={3} />
            ))}
          </g>
        ),
      };
    },
  },
  {
    id: "love",
    label: "love",
    duration: 60,
    fn: (f) => {
      const bob = Math.sin(f * 0.25);
      const xs = [-20, 200, 40, 170, 90];
      return {
        y: bob * 4 - 3,
        rotate: bob * 3,
        blush: I(f, [0, 12], [0, 1]),
        mouth: "smile",
        brows: "up",
        children: (
          <g>
            {xs.map((x0, k) => {
              const t = f - k * 8;
              return t < 0 ? null : <Heart key={k} x={x0 + Math.sin(t * 0.2) * 8} y={60 - t * 3.2} s={1.5} opacity={I(t, [0, 6, 30, 40], [0, 1, 1, 0])} />;
            })}
          </g>
        ),
      };
    },
  },
  {
    id: "enter",
    label: "enter",
    duration: 40,
    fn: (f, fps) => {
      const sp = S(f, fps, 0, { damping: 11, stiffness: 120 });
      return {
        y: 440 * (1 - sp),
        squash: 1 - 0.1 * hump(f, 9, 8),
        leftArm: f < 10 ? 150 : I(f, [10, 20], [150, 45]),
        rightArm: f < 10 ? 150 : I(f, [10, 20], [150, 45]),
        mouth: "grin",
        brows: "up",
      };
    },
  },
  {
    id: "exit",
    label: "exit",
    duration: 30,
    fn: (f) => ({
      y: f < 6 ? 0 : I(f, [6, 13, 30], [0, -60, 540], Easing.in(Easing.quad)),
      squash: f < 6 ? 1 - 0.1 * I(f, [0, 6], [0, 1]) : 1.05,
      leftArm: f < 6 ? 40 : 160,
      rightArm: f < 6 ? 40 : 160,
      mouth: "grin",
      brows: "up",
    }),
  },
];
