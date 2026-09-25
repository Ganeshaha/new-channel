# Episode 002: video build

- **Render:** `render/ep002-v15.mp4` (gitignored, since it's large). It's **narrated by Gemini 3.8 Flash TTS (Fenrir), with real word timing**. A 720p preview is on the private page https://claude.ai/artifact/KyBJuLpV9U5KkvYaL7AKKt.
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

## Still to do

- **Listen-through:** check the pronunciation of "Dack" (the transcriber hears "Dak"/"Dax") and "Venser" ("Vensor"). If any sound off, add a respelling to `SPOKEN` in `ep002_narration.py` and regenerate that section, at about a cent each.
- **Sound effects** (pop, whoosh, stamp, shuffle), from a licensed source recorded in PERMISSIONS.md.
- **End screen:** switch to a "watch next" card once there's a second video.
