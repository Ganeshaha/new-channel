# Mascot animation library

These are 48 short, expressive, **transparent** animations of the Wild Card Commander mascot: an original plain red card back in pixel sunglasses. Each is a 600×600 VP8 WebM with an alpha channel at 30 fps, so it can sit on top of any video. `preview.html` plays every one in a browser, with switchable backgrounds. `_gallery-preview.mp4`, `_gallery-magic.mp4` and `_gallery-youtube-meme.mp4` show each set looping side by side.

## Core set

| File | Length | Use it when… |
|---|---|---|
| `idle.webm` | 2.0s (loops) | the mascot is on screen with nothing else to do; a gentle bob with a glint off the sunglasses |
| `wave.webm` | 2.0s | a hello or goodbye, or the start of a segment |
| `deal-with-it.webm` | 2.0s | a **verdict** or punchline lands; the sunglasses drop into place and it grins |
| `peek.webm` | 2.5s | "hold on…": it lowers the sunglasses to look at a mistake, blinks, then puts them back |
| `shocked.webm` | 1.5s | a surprising card, stat or ruling; it jumps, the sunglasses fly up, eyes go wide, "!" |
| `laugh.webm` | 2.0s | a joke, or a ridiculous play |
| `shrug.webm` | 1.7s | "who knows?" moments, jank, or "it depends" |
| `facepalm.webm` | 2.3s | a misplay or common mistake; hand over the sunglasses, plus a sweat drop |
| `celebrate.webm` | 2.0s | a win or a combo going off; it jumps with confetti |
| `sad.webm` | 2.0s | a loss, a ban, or a card getting worse; it slumps, with a tear |
| `yes.webm` | 1.5s | agreeing or "correct"; a nod plus a green tick stamp |
| `no.webm` | 1.5s | "wrong" or "don't do this"; a head shake plus a red cross stamp |
| `point.webm` | 1.7s | drawing attention to something on the right of the frame |
| `thinking.webm` | 2.5s | posing a question before answering; hand on chin, with thought bubbles |
| `love.webm` | 2.0s | a favourite card, or a wholesome moment; floating hearts and a blush |
| `enter.webm` | 1.3s | bringing the mascot on screen (it bounces up from below) |
| `exit.webm` | 1.0s | taking the mascot off screen (it hops up, then drops out) |

## Magic set

| File | Use it when… |
|---|---|
| `tap.webm` | explaining tapping or untapping; the mascot turns sideways ("TAP") and back |
| `shuffle.webm` | shuffling, randomness, or "new game" |
| `draw.webm` | drawing a card, a topdeck, or a card reveal; it grabs a card, flips it over, and reacts with "!" |
| `mulligan.webm` | mulligan talk, or a bad opening hand; it looks, frowns, tosses the hand, then "NEW 7" |
| `counterspell.webm` | counterspells, "no", or shutting something down; a "NOPE" shield blocks a spell |
| `board-wipe.webm` | board wipes; it sweeps the cards away with a broom |
| `infinite-combo.webm` | combos and loops; an ∞ symbol, spinning arrows and a counter climbing to x∞ |
| `nat-20.webm` / `nat-1.webm` | dice luck, great or terrible outcomes |
| `coin-flip.webm` | coin flips, and "heads!" |
| `mana.webm` | mana, ramp, or colour identity; five coloured gems orbit it |
| `reanimate.webm` | death and graveyard themes, or reanimation; it drops dead, a tombstone rises, then it comes back as a zombie |
| `exile.webm` | exile effects; it's beamed away |
| `sleeve-up.webm` | sleeves, protecting cards, or deck prep |
| `salty.webm` | salt, sore losers, or frustrating cards |
| `table-flip.webm` | rage quits, and feel-bad cards |
| `life-loss.webm` | damage and life totals; a counter drops 40 → 19 while it flinches |

## YouTube set

| File | Use it when… |
|---|---|
| `like.webm` | asking for a like; a thumbs-up and "+1" |
| `bell.webm` | the notification bell ("ding!") |
| `comment.webm` | a comment prompt; it types into a speech bubble |
| `link-below.webm` | "link in the description"; it points down with a bouncing arrow |
| `watch-next.webm` | an end screen or "watch this next"; a video thumbnail pops up |
| `views-up.webm` | growth, popularity, or "this card is everywhere"; a rising chart with 1K, 10K and 100K |
| `loading.webm` (loops) | waiting, slow plays, or "long turn"; a spinner while it taps its foot |

## Meme-style set

These are original takes on familiar meme ideas, performed by the mascot. They don't copy any meme images or characters.

| File | Use it when… |
|---|---|
| `big-brain.webm` | a galaxy-brain play; the brain grows in three stages to a glowing cosmic one |
| `mind-blown.webm` | "wait, what?"; the sunglasses blast off in a poof |
| `sip-tea.webm` | drama or a spicy take; it sips with a side-eye |
| `popcorn.webm` (loops) | watching drama unfold; it munches, eyes to the side |
| `nervous-sweat.webm` (loops) | "this is going badly", or a risky line; gritted teeth and sweat |
| `dab.webm` | a victory flex or a "nailed it" moment |
| `reprint.webm` | reprints and printings; a card printer goes BRRR while it cheers |

## Putting one into a video

Put the mascot in the lower-right corner at 2:03 (123s), scaled to 360px:

```
ffmpeg -i video.mp4 -c:v libvpx -i brand/animations/facepalm.webm \
  -filter_complex "[1:v]scale=360:360,setpts=PTS-STARTPTS+123/TB[m];[0:v][m]overlay=W-w-40:H-h-20:enable='between(t,123,125.3)'[v]" \
  -map "[v]" -map 0:a -c:a copy out.mp4
```

- `-c:v libvpx` before the WebM input is required to keep the transparency.
- To chain moves (`enter` → `idle` → `deal-with-it` → `exit`), overlay them back to back at the same position.
- For Shorts (1080×1920), the same files work. Place the mascot bottom-centre, above the captions.

## Editing or adding animations

- All motion is code in `video/src/mascot/animations.tsx`. Each animation maps a frame to rig settings: body lean, squash and stretch, sunglasses position and tilt, eyes, eyebrows, mouth, arms and effects.
- The character itself is drawn in `video/src/mascot/Rig.tsx`.
- Preview everything live with `cd video && npm run dev`, then open **MascotGallery**.
- Re-render one animation:

  ```
  cd video
  npx remotion render Mascot-<id> ../brand/animations/<id>.webm --codec=vp8 --image-format=png --pixel-format=yuva420p
  ```
- Change the card back colour for every asset at once with `MASCOT_BACK` in `Rig.tsx`.
