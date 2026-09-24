# Animation roadmap

This document covers what the animation system has now, what's missing, and the order to build it in. It's based on:
- the three channel teardowns;
- the episode 001 script;
- research on explainer-video toolkits and syncing a mascot's mouth to a voice (sources at the bottom).

Written 24 Sep 2026.

## What exists (all code, all original)

| Piece | File | What it does |
|---|---|---|
| Rig | `src/mascot/Rig.tsx` | The mascot as a puppet: lean, squash and stretch, spin, grow, mirror, fade, sunglasses position and tilt, eyes (open, wide, closed, happy, X, star), eyebrows above the sunglasses, 9 mouth shapes, arm angles and lengths, leg splay, plus layers behind, attached to, and in front of the body. |
| Props | `src/mascot/props.tsx` | Mini cards (back and generic face), d20, coin, gems, shield, broom, tombstone, salt shaker, table, life counter, thumbs-up, bell, chat bubble, video thumbnail, spinner, brain, cup, popcorn, printer, keyboard, arrow. |
| Animations | `src/mascot/animations.tsx` (17 core) and `animations2.tsx` (31 Magic, YouTube and meme-style) | Each is a pure function **frame → rig settings**, so it can be dropped into any Remotion composition. |
| Library | `src/mascot/library.tsx` | A registry of all 48, a renderer for transparent 600×600 videos, and preview galleries. |
| Stills | `src/Mascot.tsx` | Poses, the mascot sheet, the profile picture and the banner. |
| Overlay | `src/SubscribeBeat.tsx` | The subscribe segment. |

Because each animation is just `fn(frame, fps) => RigProps`, JavaScript-built videos can play the mascot directly in their own timeline. They don't have to rely on the pre-rendered WebMs, which exist for use with ffmpeg or other editors.

## Priority 1: needed for every video, starting with episode 001

1. **A talking mouth synced to the narration.** This is the most important gap, since narration is AI voice.
   - Read the narration's loudness frame by frame with Remotion's `useAudioData()` and `visualizeAudio()`, and map it to closed, `chew`, `o` and `open` mouths.
   - Open the mouth **1–2 frames before** each sound, which looks more natural.
   - Add small random gestures while talking (arm shifts, eyebrow twitches, the odd lean), so a 5-minute narration doesn't look frozen.
2. **A mascot timeline.** A `<MascotTrack>` component that takes a list like `[{at: 12.3, anim: "facepalm", pos: "right"}, …]` and plays the animations back to back. It should blend between poses instead of snapping, return to `idle` between moves, and offer position presets (corner, centre, bottom-centre for Shorts).
3. **Text on screen** (in the collage style):
   - The hook title built from cut-out letters. The episode 001 opening card is "YOU'RE PLAYING COMMANDER WRONG".
   - Word-by-word burned-in captions. Shorts need these.
   - Lower thirds for chapter titles.
   - Callout labels such as "my rule, not official", and handwritten notes.
   - The research recommends reinforcing the narration visually every 3–5 seconds, with a small set of consistent text styles rather than a new look for each segment.
4. **Card presentation:**
   - a real card scan (from Scryfall) floating in and zooming;
   - a hand-drawn circle or underline highlighting part of the rules text;
   - two cards side by side for comparisons;
   - ✓ or ✗ stamps on a card, and price tags ("$50").
5. **The channel's signature segments:**
   - **The Rematch check**, a three-item checklist card that ticks off. It closes episode 001 and can recur.
   - **Your own rating card** (Next Level Commander's most distinctive element), in the Wild Card style.
   - **Bracket tabs 1–5.**
   - A **tally counter** and a **group-chat phone mock-up**, both used in episode 001's cold open.
6. **Transitions:** a card-flip wipe (on brand), a paper slide, and a chapter card. Use 2–3 at most, the same ones every time.
7. **The end of the video:** a 20-second end-screen layout that leaves space for YouTube's end-screen elements, with the mascot doing `watch-next` or `link-below`. Also a 1-second logo sting for chapter breaks. Don't add a long intro; the research says 5 seconds or less, or none.
8. **Sound effects:** pop, whoosh, ding, card flick, shuffle, stamp and paper rustle, each tied to an animation.
   - They need a licensed source, such as the YouTube Audio Library or CC0 sound packs.
   - Record the licence for each in `PERMISSIONS.md`.
   - Generating them through OpenRouter is possible, but needs an OK first.

## Priority 2: Magic explainers (rules and deckbuilding videos)

- **The stack:** cards pile up and resolve last-in-first-out, with the mascot pointing.
- **Combat:** attacker and blocker arrows, and damage assignment.
- **The turn:** a strip of phases and steps with a moving marker.
- **The zones:** a board layout with library, hand, battlefield, graveyard, exile and command zone, with cards moving between them.
- **A four-player table from above:** a seat for each player, with priority passing around the table.
- **Counters:** commander tax, and an animated table of the four life totals.

## Priority 3: characters and variety

- **A recurring cast.** The research on the three channels found named friends build loyalty. Make variants of the mascot for the friends in your stories, using different card back colours plus one accessory each (a cap, round glasses, a scarf), all original.
- **More expressions:** angry, confused, asleep (the long-turn joke), a suspicious squint, crying with laughter, scared.
- **More motion:** a walk cycle, a run, sitting at the table, and turning to face the other way (the rig already supports mirroring).
- **Thumbnail poses:** big, exaggerated stills (shocked, facepalm, verdict) rendered at high resolution, with a thumbnail text template (a card plus five words or fewer).
- **Shorts layouts:** 9:16 versions with big captions, the mascot bottom-centre, and an ending that loops back to the start.

## Suggested next step

Build Priority 1, items 1–3 (talking mouth, timeline, text), then assemble episode 001's cold open, about 20 seconds, as a first real test of the whole pipeline.

## Sources

- [visualizeAudio() (Remotion docs)](https://www.remotion.dev/docs/visualize-audio)
- [Audio visualization (Remotion docs)](https://www.remotion.dev/docs/audio/visualization)
- [How to Sync Lips for Animated Characters (Picasso IA)](https://blog.picassoia.com/how-to-sync-lips-for-animated-characters)
- [Best YouTube Editing Styles 2026 (OlafMotion)](https://olafmotion.com/trends-inspiration/best-youtube-editing-styles-2026/)
- [Text Animation Secrets (Demotion)](https://trydemotion.com/blog/text-animation-secrets)
- [Lower Third Maker (Videobolt)](https://videobolt.net/lower-third)
