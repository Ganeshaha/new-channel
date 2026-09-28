# Episode 002: video build

- **Render:** `render/ep002-v17.mp4` (gitignored, since it's large). It's **narrated by Gemini 3.8 Flash TTS (Fenrir), with real word timing**. A 720p preview is on the private page https://claude.ai/artifact/KyBJuLpV9U5KkvYaL7AKKt.
- **Source:** `video/src/episodes/ep002/Ep002.tsx`, built on the shared toolkit in `video/src/episodes/kit.tsx` and Wil D. Card's animation library.

## How it's put together

- **White stage.** Wil D. Card is always bottom-right, talking and reacting. There are no burned-in captions (channel preference). Upload an SRT instead.
- **Every visual beat is cued to a word** in the script through `cue(section, "phrase")`, so cards, callouts, stickers and arrows appear exactly when they're said.
- **Timing comes from `video/src/episodes/ep002/timing.json`,** built from the real narration by `video/scripts/ep002_narration.py timing` (faster-whisper word timestamps aligned to the script).
- **Layout:** each scene is scaled into the space left of Wil's corner (`Fit`). It gets a slow camera push-in across the section, plus quick punch-in zooms on key lines (`punches`).
- **Images** (all covered by the WotC permission, see PERMISSIONS.md):
  - card scans in `video/public/ep002/cards/`;
  - card art crops in `video/public/ep002/art/`;
  - the official deck-box product shot in `video/public/ep002/product/`.

## What changed in v10–v11 (25 Sep 2026)

These changes came from a comparison with 13 similar hit videos (Attack on Cardboard rules explainers, Next Level Commander and Salubrious Snail), plus a fresh fact-check.

- **Script (see SCRIPT.md):**
  - The owner/controller wording is fixed.
  - Jace's −3 is described correctly: it exiles one of your other creatures first.
  - The Archon line no longer overstates decking.
  - The "it's two cards" comment is answered up front.
  - The finder is credited in the intro.
  - The subscribe ask is now a reason plus a joke, followed by a quiz.
  - New "How to stop it" section, using the answers in this same precon (CR 608.2b).
  - Cursed Mirror is the Venser-problem example.
  - New "Has Wizards said anything?" beat.
  - The comment prompt is now on the core dispute.
  - The close is a recap.
- **New scenes and beats:**
  - The quiz, with a 3-2-1 countdown.
  - A worked example with The Ur-Sphinx and Serra's Emissary on the opponents' side.
  - Definition callouts for goad and priority.
  - A trigger card shown on the stack.
  - The "How to stop it" scene, where the trigger fizzles and the four answer cards fan in.
  - The "Wild Card verdict" summary card: a recurring end segment in the style of Next Level Commander's rating card.
- **Pacing:** stretches of 4 seconds or more with no new visual beat (measured at 4 fps, with Wil's corner masked) went from **28 in v9 (up to 9.8 s) to 4 in v11**. All four are 4.0–4.5 s, just past the 2–4 s target, in the opinion section and the verdict card. The only one-second "blank" is Wil sliding to his corner in the intro, which is motion, not an empty frame.

## Narration (v12, 25 Sep 2026)

- **The voice** was designed free in Qwen3-TTS VoiceDesign with the VOICE.md prompt. It's take 2 of 3, picked for being the lowest-pitched, least bright and most varied male voice. It's saved privately as `studio/voice/wil-reference.wav` (gitignored).
- **The narration** was made with Fish Audio S2.1 Pro on OpenRouter, cloning that clip, one file per section. Each section carries inline delivery directions (`[intrigued]`, `[deadpan]`, `[pitch rising, disbelief]`, `[slowing on the numbers]` …) so the pitch and pace vary where the script turns.
- **Pronunciation fixes** apply only to what the voice is given:
  - "Wil" is read as "Will";
  - "D." is read as "Dee", because it was being read as the numeral ("the 500th");
  - rule numbers are read as "six-oh-three point three D";
  - "r/magicTCG" is read as "r slash magic TCG".
- **Cost:** $0.12 in total, including one intro retake. It's logged in `studio/voice/ep002/spend.jsonl`.
- **Rebuild:**
  1. `python scripts/ep002_narration.py texts`
  2. Delete the section's mp3.
  3. `python scripts/ep002_narration.py generate`
  4. `python scripts/ep002_narration.py timing`
  5. Re-render.
- **Loudness** is normalised to -15 LUFS, with a true peak of -1.5 dB.

## v13–v14 (25 Sep 2026): Fenrir voice, combo end state, readability pass

- **Voice:** the narration was redone in Gemini 3.8 Flash TTS "Fenrir", the user's pick from a 12-voice shootout, because the Fish clone sounded like AI. It cost about $0.13, plus a few cents for the combo and close retakes.
- **Combo:** the section now explains the end state:
  - one trigger keeps the loop going, and the other copies anything an opponent controls;
  - so you end with endless hasty copies of their creatures, artifacts and lands (effectively unlimited mana);
  - the copies are sacrificed at the next end step, so do it before combat.
  - A new "YOUR BOARD NOW" board shows piles of real card scans with ×∞, ∞ MANA, the sacrifice and before-combat tags, and SWING.
- **Readability:**
  - Every element now holds for at least its reading time.
  - A layout audit (`qa_layout.py`) measured every element 10 times a second: 87 → 0 problems. It covers overlaps, text within 24 px of the edge, too-short displays, scene bleed and cut-off Wil animations.
  - A contact-sheet pass caught the things the audit can't see: an arrow under the trigger note, Wil's props off the frame edge, and a stale tip.
- **Wil:** his poses now blend over 0.28 s instead of snapping, and he fades around the subscribe overlay.
- **End screen:** subscribe-only, since there are no other videos yet. The close line now asks viewers to subscribe.
- **Final checks on v15:**
  - `qa_layout`: 0 problems.
  - `qa_pacing`: no stretch of 4 s or more with nothing new on screen.
  - `qa_cues`: 0 missing.
  - `check_script`: 0 flags.

## v16 (26 Sep 2026)

- The cold-open hook was re-voiced. Read on its own, Fenrir pitched it about 200 Hz, and the user said it sounded off. Generating the hook together with the next line and cutting before "Hello" brought it to 150 Hz, in line with the other sections (137–154 Hz). The old take is in `studio/voice/ep002/sections-fenrir/old/`.
- `qa_layout`: 0 problems after small re-spacing, since the new hook shifts everything by about 0.1 s.

## v17 (26 Sep 2026)

- **Smoother opening.**
  - The deck box starts centred and big with a slow push-in, then glides left as the title arrives.
  - The cold-open pieces leave one after another as Wil walks on, so there's no blank beat.
  - "WIZARDS MESSED UP" fully clears before "WIL D. CARD" lands.
  - The "WILD CARD COMMANDER" sticker sits beside Wil instead of on his head.
  - The first cards arrive as Wil slides to his corner.
- **Wil talks through his animations** instead of freezing his mouth when one plays.
- `qa_layout`: 0 problems.

## v18 (26 Sep 2026): polish pass against the research

Based on `research/layout-study/REPORT.md` (frame ratios measured on the white-background channels) and `research/youtube-general/REPORT.md`.

- **Bigger cards.** Spotlight cards went from 44 %H to about 60–75 %H: Dack and Venser in the two-cards scene, the Angel and Archon, Brainstorm and Jace, and the intro pair. The combo board, the tokens and the end-state fans are about 20 % bigger. Text was moved to make room. The references go to about 91 %H for a lone card, so there's room to go further next episode.
- **Cards rest nearly straight.** A card now enters at its full tilt and settles to 30 % of it (`CARD_REST_TILT` in kit.tsx). The reference channels never tilt resting cards.
- **Text size.** Callout headers went from a fixed 24 px to about 32 px, and seven small stickers in the combo scene went up to at least 40 px. The audit now fails on text below the reference-calibrated minimums.
- **Beats after rulings.** 3.9 s of pauses were spliced into the narration (free; voice untouched): after each rule number, after "Himself.", and after the loop's end state. The narration now ends at 400.9 s, and the chapters after the combo moved 1–4 s (UPLOAD.md is updated).
- **Wil:**
  - The mouth now follows the voice's loudness frame by frame, from `voice.json`.
  - He nods and gestures on stressed syllables and leans toward the stage while talking.
  - His shades glint every ~9 s.
  - He glances at each new card or callout as it lands (82 looks, one every ~4 s) and points at every other one.
  - The opponent friends blink.
  - His brows no longer float above the card when his shades are pushed up.
- **Scene handoffs** swap instead of leaving an empty stage between groups.
- **Captions:** `SUBS.srt` (166 captions, made from the script with the narration timing).
- **Thumbnails:** 4K renders, plus a cyan and a yellow version of the solo thumbnail for Test & Compare (combos in UPLOAD.md).
- **Checks:** `qa_layout`: 0 problems (it took three passes after the resize). `qa_cues`: 0 missing. The pinned comment passed `check_script`.

## v19 (26 Sep 2026)

- **Mouth fix** (user: "the card has 2 mouths while talking, an upside down pink one"). The talking mouth's tongue was a pink arc bowing upward, so on open syllables it read as a second, upside-down mouth. It's now a filled tongue resting on the lower lip, clipped inside the mouth (`Tongue` in Rig.tsx). The static "open" mouth uses the same tongue. Nothing else changed from v18.

## v20 (26 Sep 2026): Wil flows

User: "the eyebrows keep appearing and disappearing and he keeps motioning down, it looks janky". Research in `research/wil-motion/REPORT.md`; the rules are in WORKFLOW.md under "The expression budget".

| | v19 | v20 |
|---|---|---|
| Head accents | 63/min, the same dip on every stressed syllable | 8.7/min, one per sentence at most, varied direction, driven by pitch |
| Brows on/off | 154 switches/min, 0.3 s flashes, instant | 5.0 raises/min in total, eased, no flicker (audited) |
| Gestures | every other syllable, strictly alternating arms | 4/min on strong accents, pseudo-random arm |
| Glances | up to 12/min | about 10/min, at least 4 s apart |
| Reactions | 38, some 1.1–2.2 s apart | 33, at least 2.5 s apart |

Also:
- The lean no longer snaps between words.
- Breathing and sway are on non-repeating periods.
- A reaction's brows linger and soften, and brow gaps under 1.2 s are bridged.
- Small accents fade out around reactions.

Removed reactions:
- "how it works" thinking;
- "next up" point;
- "before anyone" facepalm, which came 1.9 s after the celebrate;
- "what if someone" thinking;
- the second "yes".

The closing wave now waits 2.5 s after the bell.

Checks before the render: `qa_layout` 0 problems (with the new WIL REACTIONS / EXPRESSION PLAN / FACE FLICKER checks); close-up strips at 14 s, 93 s, 99 s, 143 s, 180 s, 242 s and 398 s reviewed.

## v21 (27 Sep 2026): cleaner first 15 seconds

User: "wil looks a little glitchy at 9 seconds. take a critical pass over the first 15 seconds… too many banners etc. and repeated info".

**Findings** (from a 4 fps contact sheet of 0–16 s plus every frame from 8.5 to 11 s):

| Time | Problem | Fix |
|---|---|---|
| 9.63–9.77 s | Wil flashed on in his resting pose for 2 frames, vanished for 3, then popped up with his entrance. The host drew him from `hello - 0.05`, before the entrance animation began. | Drawn only from the entrance's first frame. |
| 5.3 s | A "1 CARD" sticker beside Dack repeated the "ONE-CARD WIN" title directly above it. | Removed. |
| 6.9 s | "NO UPGRADES" repeated "straight out of the box", which the ∞ stamp on the box already shows. | Removed. |
| 1.6–9.6 s | "NOT EVEN OUT YET" stayed up for 8 s, long after its line. | Hands off to the title (about 2.8 s). |
| 7–9 s | Title + 3 stickers + ∞ at once. | Title + ∞ only. The box and card carry the rest. |
| 9.7–11.4 s | Wil walked on under "WIZARDS MESSED UP". | The title clears once read, about 1 s into his entrance. |
| 12.3 s | "WILD CARD COMMANDER" sticker + confetti on top of the name card and the shades gag. The channel name is already under the video. | Removed. |
| 11.6–14.2 s | "WIL D. CARD" waited in the title spot for the old title to clear, so it arrived 1.2 s late and faded over his slide and the first cards. | Moved beside him. It lands on "Wil D. Card" (10.6 s) and clears before he slides. |

The rules are in WORKFLOW.md §3 step 10.

## v22 (27 Sep 2026): no more jitter

User: "around 33 seconds he is jittering".

Stepping through every frame and logging Wil's pose on each one found the cause. His lean toward the stage zig-zagged ±0.25° on a 3-frame cycle (about 10 Hz), from 31–33 s and again at 35 s. The smoothed "mid-flow" signal driving the lean sampled the voice every 3rd frame, so its value flickered as each new frame shifted the sample grid. It's now computed from every frame with raised-cosine weights.

A new every-frame WIL JITTER check then scanned the whole video and found four library animations with built-in shakes too fast to read:

| Animation | Before | After |
|---|---|---|
| laugh (64 s) | 7 Hz, ±5° shake plus a 5 Hz hop | a 2.6 Hz rock and bounce, ±3° |
| infinite-combo (124 s) | 10 Hz vibration | a 3 Hz building sway |
| mind-blown (133 s) | 10 Hz sideways rattle | one recoil |
| nervous-sweat (140 s, 290 s) | 6 Hz tremble | a 2 Hz fidget |

The check was proven both ways: it flags 31–33 s on the old code and passes the fix. Final audit: 0 problems. Close-ups of 31.5, 63.8, 123.6, 133.2 and 140 s were reviewed.

## Still to do

- **Listen-through:** check the pronunciation of "Dack" (the transcriber hears "Dak"/"Dax") and "Venser" ("Vensor"). If any sound off, add a respelling to `SPOKEN` in `ep002_narration.py` and regenerate that section, at about a cent each.
- **Sound effects** (pop, whoosh, stamp, shuffle), from a licensed source recorded in PERMISSIONS.md.
- **End screen:** switch to a "watch next" card once there's a second video.
- **The owner's call** (from the layout study; these change the style, so they weren't applied):
  - fewer labels on screen at once: we show about 4 text lines per frame, the references 1;
  - longer layout holds: ours is 4.5 s, the references 8.5 s, and they're fully still 77 % of the time vs our 1 %;
  - a few big-Wil reaction shots (70–90 %H) for jokes and the verdict.
- **After upload:** record the Test & Compare winner here (paper vs cyan thumbnail, and the title), since it decides the thumbnail template.
