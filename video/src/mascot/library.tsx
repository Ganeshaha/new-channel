import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Anim, ANIMS } from "./animations";
import { ANIMS2 } from "./animations2";
import { INK, MascotRig, PAPER } from "./Rig";

// The full mascot animation library, plus the renderers used by Root.tsx.

export const LIBRARY: Anim[] = [...ANIMS.map((a) => ({ ...a, group: a.group ?? "core" })), ...ANIMS2];
export const GALLERY_GROUPS = ["core", "magic", "youtube", "meme"] as const;

/** One animation on a transparent 600x600 canvas (mascot centred), for overlays. */
export const MascotAnimation: React.FC<{ anim: string }> = ({ anim }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = LIBRARY.find((x) => x.id === anim) ?? LIBRARY[0];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: "translateY(30px)" }}>
        <MascotRig id={`a-${a.id}`} scale={1.2} {...a.fn(frame, fps)} />
      </div>
    </AbsoluteFill>
  );
};

/** Animations of one or more groups looping side by side, for previewing the library. */
export const AnimationGallery: React.FC<{ groups: string[] }> = ({ groups }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = LIBRARY.filter((a) => groups.includes(a.group ?? "core"));
  return (
    <AbsoluteFill style={{ background: PAPER, flexDirection: "row", flexWrap: "wrap", alignContent: "center", justifyContent: "center", padding: "20px 30px" }}>
      {items.map((a) => (
        <div key={a.id} style={{ width: 300, height: 340, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
          <div style={{ transform: "translateY(-6px)" }}>
            <MascotRig id={`g-${a.id}`} scale={0.62} {...a.fn(frame % (a.duration + 15), fps)} />
          </div>
          <div style={{ fontFamily: '"Segoe Print", "Comic Sans MS", cursive', fontSize: 22, color: INK }}>{a.label}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
