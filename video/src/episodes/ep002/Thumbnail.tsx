import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ACCENT, GOLD, INK, MascotRig, PAPER } from "../../mascot/Rig";
import { BLOCK } from "../kit";

/**
 * Episode 002 thumbnail (1280x720). Template for the channel:
 * white paper, the product and one or two real card scans, a 2–4 word solid headline, Wil reacting.
 * `variant` picks the verdict so the same layout can be A/B tested in YouTube's Test & Compare.
 */
export type ThumbProps = { variant: "messed-up" | "one-card" | "solo" };

/**
 * Solid headline: one heavy face, thick ink outline and a hard shadow so it reads at phone size.
 * Each part gets one flat colour (no per-letter tiles).
 */
const Headline: React.FC<{ parts: [string, string][]; size: number }> = ({
  parts,
  size,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: size * 0.28,
      fontFamily: BLOCK,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: size * 0.01,
      transform: "rotate(-2deg)",
      whiteSpace: "nowrap",
    }}
  >
    {parts.map(([text, color]) => (
      <span
        key={text}
        style={{
          color,
          WebkitTextStroke: `${size * 0.09}px ${INK}`,
          paintOrder: "stroke fill",
          textShadow: `${size * 0.06}px ${size * 0.07}px 0 rgba(0,0,0,0.22)`,
        }}
      >
        {text}
      </span>
    ))}
  </div>
);

const Card: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  rot: number;
}> = ({ src, x, y, w, rot }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      borderRadius: w * 0.045,
      transform: `rotate(${rot}deg)`,
      filter: "drop-shadow(12px 16px 0 rgba(0,0,0,0.22))",
    }}
  />
);

export const Ep002Thumbnail: React.FC<ThumbProps> = ({ variant }) => {
  const headline: [string, string][] =
    variant === "messed-up"
      ? [["WOTC", ACCENT], ["MESSED UP", "#fff"]]
      : variant === "solo"
        ? [["1 CARD", ACCENT], ["WINS", INK]]
        : [["1 CARD", ACCENT], ["WINS", "#fff"]];
  const size = variant === "messed-up" ? 112 : 142;
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      {/* faint paper tone so the white doesn't read as empty */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 40% 45%, #ffffff 0%, #fbf8f1 55%, #efe8d8 100%)",
        }}
      />

      {/* verdict, full width across the top */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 22,
          width: 1280,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Headline parts={headline} size={size} />
      </div>

      {variant === "solo" ? (
        <>
      {/* solo: the box, the one card that wins, the result, and a big Wil face */}
      <Img
        src={staticFile("ep002/product/deck.png")}
        style={{
          position: "absolute",
          left: 26,
          top: 250,
          width: 250,
          transform: "rotate(-9deg)",
          filter: "drop-shadow(10px 14px 0 rgba(0,0,0,0.22))",
        }}
      />
      <Card src="ep002/cards/dack-fayden-helping-hand.png" x={200} y={206} w={340} rot={-4} />
      <div
        style={{
          position: "absolute",
          left: 690,
          top: 470,
          transform: "translate(-50%, -50%) rotate(-8deg)",
          fontFamily: BLOCK,
          fontSize: 330,
          lineHeight: 1,
          color: GOLD,
          WebkitTextStroke: `10px ${INK}`,
          paintOrder: "stroke fill",
          textShadow: "9px 10px 0 rgba(0,0,0,0.2)",
        }}
      >
        ∞
      </div>
      <div style={{ position: "absolute", left: 830, top: 196 }}>
        <MascotRig
          id="thumb-solo"
          scale={1.65}
          rotate={-6}
          shadesY={-26}
          shadesRotate={-14}
          eyes="wide"
          brows="up"
          mouth="o"
          leftArm={150}
          rightArm={150}
          legs={10}
        />
      </div>
        </>
      ) : (
        <>
      {/* the precon box, with the two combo cards coming out of it */}
      <Img
        src={staticFile("ep002/product/deck.png")}
        style={{
          position: "absolute",
          left: 28,
          top: 186,
          width: 330,
          transform: "rotate(-7deg)",
          filter: "drop-shadow(12px 16px 0 rgba(0,0,0,0.22))",
        }}
      />
      <Card src="ep002/cards/dack-fayden-helping-hand.png" x={255} y={270} w={265} rot={-3} />
      <Card src="ep002/cards/venser-fervent-forger.png" x={430} y={296} w={265} rot={8} />

      {/* the result: a big infinity sticker */}
      <div
        style={{
          position: "absolute",
          left: 790,
          top: 500,
          transform: "translate(-50%, -50%) rotate(-8deg)",
          fontFamily: BLOCK,
          fontSize: 340,
          lineHeight: 1,
          color: GOLD,
          WebkitTextStroke: `10px ${INK}`,
          paintOrder: "stroke fill",
          textShadow: "9px 10px 0 rgba(0,0,0,0.2)",
        }}
      >
        ∞
      </div>

      {/* Wil, bottom right, shades pushed up in shock */}
      <div style={{ position: "absolute", left: 900, top: 250 }}>
        <MascotRig
          id="thumb"
          scale={1.25}
          rotate={-6}
          shadesY={-26}
          shadesRotate={-14}
          eyes="wide"
          brows="up"
          mouth="o"
          leftArm={150}
          rightArm={150}
          legs={10}
        />
      </div>
        </>
      )}
    </AbsoluteFill>
  );
};
