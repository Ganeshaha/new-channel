import "./index.css";
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { SubscribeBeat, subscribeBeatSchema } from "./SubscribeBeat";
import { Avatar, Banner, MascotSheet } from "./Mascot";

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
      <Composition id="Avatar" component={Avatar} durationInFrames={1} fps={30} width={800} height={800} />
      <Composition id="Banner" component={Banner} durationInFrames={1} fps={30} width={2560} height={1440} />

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
