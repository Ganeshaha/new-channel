import "./index.css";
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { SubscribeBeat, subscribeBeatSchema } from "./SubscribeBeat";
import { BackOptions, Banner, MascotSheet, ProfilePicture } from "./Mascot";
import { AnimationGallery, LIBRARY, MascotAnimation } from "./mascot/library";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* 4.5 s transparent subscribe overlay. Place once, right after the first payoff (see /RETENTION.md).
          Render: npx remotion render SubscribeBeat out/subscribe-beat.webm --codec=vp8 --image-format=png --pixel-format=yuva420p */}
      <Composition
        id="SubscribeBeat"
        component={SubscribeBeat}
        schema={subscribeBeatSchema}
        durationInFrames={135}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          line: "New channel. Subscribing helps!",
          accent: "#c8372d",
          background: null,
        }}
      />

      {/* Mascot character sheet (still). npx remotion still MascotSheet out/mascot-sheet.png */}
      <Composition id="MascotSheet" component={MascotSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="BackOptions" component={BackOptions} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="ProfilePicture" component={ProfilePicture} durationInFrames={1} fps={30} width={800} height={800} />
      <Composition id="Banner" component={Banner} durationInFrames={1} fps={30} width={2560} height={1440} />

      {/* Mascot animation library: one transparent 600x600 composition per move (see brand/animations/README.md) */}
      {LIBRARY.map((a) => (
        <Composition
          key={a.id}
          id={`Mascot-${a.id}`}
          component={MascotAnimation}
          durationInFrames={a.duration}
          fps={30}
          width={600}
          height={600}
          defaultProps={{ anim: a.id }}
        />
      ))}
      <Composition id="MascotGallery" component={AnimationGallery} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{ groups: ["core"] }} />
      <Composition id="MascotGalleryMagic" component={AnimationGallery} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{ groups: ["magic"] }} />
      <Composition id="MascotGalleryYouTubeMeme" component={AnimationGallery} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{ groups: ["youtube", "meme"] }} />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          logoColor1: "#91dAE2",
          logoColor2: "#86A8E7",
        }}
      />
    </>
  );
};
