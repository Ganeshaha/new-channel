# Episode workflow

This is how an episode goes from idea to a narrated render. Episode 002 is the working reference: every step below was done on it. Read this first so nothing has to be re-researched.

Standing rules:
- **Nothing viewer-facing may feel AI-made** (VOICE.md).
- **No OpenRouter spend without an explicit OK.**
- **No background music.**
- **No burned-in captions.**
- **Commit only when asked.**

## 0. Where things live

| What | Where |
|---|---|
| Script, research, decklist, thumbnails, build notes | `episodes/<nnn-slug>/` (`SCRIPT.md`, `RESEARCH.md`, `VIDEO.md`, `thumbnail/`) |
| Video code | `video/src/episodes/<ep>/` (`EpNNN.tsx`, `Thumbnail.tsx`, `timing.json`); shared parts are in `video/src/episodes/kit.tsx` |
| Mascot rig and animation library | `video/src/mascot/` |
| Card scans, art crops, product shots, narration | `video/public/<ep>/` (`cards/`, `art/`, `product/`, `narration.wav`) |
| Voice reference and narration takes (private, gitignored) | `studio/voice/` |
| Paid-call helper and budget ledger | `studio/tools/openrouter.mjs` |
| Voice, retention and research rules | `VOICE.md`, `RETENTION.md`, `research/*/FINDINGS.md` |

## 1. Research and fact-check

- **Card text:** Scryfall `https://api.scryfall.com/cards/named?exact=<name>`, with a User-Agent header. Use `&set=<code>` to get the precon's own printing.
  - For a whole decklist in one call: `POST /cards/collection`, up to 75 identifiers per call.
- **Comprehensive Rules:** find the current `.txt` link on https://magic.wizards.com/en/rules, download it, and grep the rule numbers you plan to cite. Rule numbers do change.
- **Scan the precon for supporting cards:**
  - answers to the combo (instant removal, bounce);
  - clones or copy effects;
  - tutors and top-of-library setup;
  - creatures worth showing in a worked example.
  - Grep the Oracle text of the whole decklist.
- **Record every checked claim in `RESEARCH.md`, with its source and date.** Add a checkbox list to `SCRIPT.md` for things to re-check on recording day (for example "Has Wizards said anything?").
- **Mistakes we caught on ep002, so check these every time:**
  - "Belongs to" vs "controls": ownership and control are different in the rules.
  - Read the full planeswalker ability. Jace's −3 exiles one of your own creatures first.
  - A loop is optional, so never say "you can deck yourself mid-combo".
  - "One card" vs "two-card infinite": head this off in the script ("It's two cards. But you only cast one.").
  - **Explain the end state of a combo, not just the loop** (user correction, 25 Sep 2026). For Dack + Venser:
    - Each loop makes two token Vensers. The legend rule sends one to the graveyard, but both entered, so there are two triggers.
    - One trigger retargets the original Venser to keep the loop going. The other copies anything an opponent controls.
    - You end with endless hasty copies of their creatures, artifacts and lands (so effectively unlimited mana).
    - All of the copies are sacrificed at the beginning of the next end step, so do it before combat.
    - Say what you end up with and what the catch is, and show it as a board.

## 2. Script

- **Structure** (from the 13 reference hits; see the ep002 analysis in `episodes/002-*/VIDEO.md`):
  1. Hook with a verdict (≤10 s).
  2. "Hello everyone, this is Wil D. Card with Wild Card Commander."
  3. Credit the finder, if any.
  4. A two-item promise plus one open loop.
  5. Card context.
  6. A worked example on a concrete board.
  7. Head off the obvious comment.
  8. Subscribe line: a reason plus a content joke, then a quiz or question into the rules payoff.
  9. Rules payoff, citing CR numbers aloud.
  10. Odds or practicality.
  11. The catch, paying off the open loop.
  12. How to stop it, using answers in the same product.
  13. Opinion (≤120 words), including "Has Wizards said anything?".
  14. A yes/no comment prompt on the core dispute.
  15. Recap, then "Thanks for watching, and I'll see you in the next one."
- **Voice:** US spelling. The studied channels never say "Today we're looking at" or "I'm X, and this is Y"; they say "this is X with Y".
- **Checks, all required:**
  1. `python studio/tools/check_script.py episodes/<ep>/SCRIPT.md`: 0 rate problems and 0 tells.
    - The usual failures are too many "So…" openers and a low "we/us" rate. Fix them by trimming "So" and narrating combos as "we flip / we put".
  2. A line-by-line read for AI tells.
  3. A read-aloud of the full narration: `awk '/^## Script/,/^## Chapters/' SCRIPT.md | grep "^> "`.
    - This catches dangling setups. On ep002, "hold that thought" had no payoff.

## 3. Timing, then build the video

1. **Estimated timing:** `python video/scripts/epNNN_timing.py` (about 200 wpm). It gets replaced by the real narration in step 5.
2. **Scenes** are built from the kit components:
   - text: `Sticker`, `Callout` (`[[highlight]]`), `RansomTitle`;
   - cards and art: `CardImg`, `ProductImg`, `ArtPanel`;
   - motion and markers: `PaperArrow`, `FlyCard`, `Reticle`, `Confetti`;
   - characters: `Friend`;
   - episode-local helpers: `TriggerCard`, `BackRow`, `VerdictCard`.
   - Every element takes `at={C(id, "spoken phrase")}` and `out={...}`.
3. **Layout:**
   - Wrap each scene in `<Fit box={[x0,y0,x1,y1]} sec="id" punches={[C(...)]}>`. It scales the scene into the space left of Wil's corner, adds a slow push-in, and punch-in zooms on key lines.
   - Don't let Wil's corner (bottom-right) collide with content; the Fit box keeps things out of it.
   - **Ratios** (measured on the white-background MTG channels, `research/layout-study/REPORT.md`). Heights below are rendered, after Fit scaling (%H = share of the 1080 px frame height):
     - A lone hero card fills **70–90 %H**. The reference median is 91 %; v17 had 44 %, which read as small and empty. That's a rendered width of about 520–650 px.
     - Two cards: 55–75 %H. Three: 55–65 %H. Rows and grids: 38–46 %H.
     - Cards rest straight. `CardImg` settles to 30 % of its `rot`, so tilt is just for the entrance.
     - Fill the frame. The references cover about 34 % of pixels (v17: 15 %) and leave only a ~4 %H top margin (v17: 12 %).
     - Two or three elements plus Wil, and one or two lines of display text per frame.
     - Text sizes and margins already match (enforced by the audit). Wil at ~36 %H in the corner matches Really Bad At MTG.
     - A card's rendered height ≈ `w × 1.396 × Fit scale`. The scale is printed nowhere, so check with `audit_boxes.py`.
     - Remember that the camera punch-in (×1.06) and drift (×1.03) push big cards toward the frame edge. Keep a card's rendered left edge at x ≥ 40.
4. **Type system:**
   - Arial Black for stickers;
   - Georgia for quoted card or rules text (Callout);
   - Segoe Print for handwritten notes;
   - ransom letters for titles only.
5. **After every script edit:**
   1. Re-run the timing script.
   2. Run `python video/scripts/qa_cues.py <ep>` to list cues whose words were removed. It must say 0.
   3. Run `npx tsc --noEmit`.
6. **Readability rules** (user requirement, 25 Sep 2026: nothing overlaps, and everything stays up long enough to read and register). These are enforced in code and checked by the audit below.
   - **Minimum display time.** Every kit component pushes its `out` later if needed (`holdOut` in kit.tsx), so it's fully visible for at least its reading time:
     - text: max(1.5 s, characters ÷ 15 + 0.5 s), capped at 5 s. That's based on subtitle rates: BBC about 15 characters/s, Netflix 17–20, minimum about 0.8 s.
     - cards, characters and arrows: 1.2 s.
     - Short narration windows need **shorter text**, not faster text. The ep002 "goaded" definition went from 80 characters to 36.
   - **No overlaps, with a 12 px margin.** Text never touches other text, cards, characters or Wil.
     - Only elements marked `stamp` (for example "FIZZLES", "RIP", "×∞", "SWING!", or labels like "TOKEN" sitting on their card) may sit on a card, a drawing or a "note" (the trigger card, the verdict card), and never on other text.
   - **Title-safe.** At rest, text stays 24 px inside the frame, since YouTube's player controls cover the edges.
     - `STAGE` in Ep002.tsx is sized so that even at the deepest camera zoom (drift 1.03 × punch 1.06) everything stays inside.
     - Don't raise the drift or punch without re-checking.
   - **No scene bleed.** Nothing stays more than 1.2 s after its section ends, unless it appeared in the section's last words and needs that long to be read.
   - **Replace, don't stack.** When a new label takes over the same spot, end the old one first. For example, "ON THEIR BOARDS" ends before "+2 HASTY 10/10s" appears in its place.
   - **Hand off, never blank.** A scene's elements leave just *after* the next scene's first element lands, so the stage is never empty (only Wil) between thoughts:
     - between sections: `END(id)` in Ep002.tsx = max(section end + 0.35, next section start + 0.3);
     - inside a section, when one group replaces another: `out = C(id, "next group's cue") + 0.1`.
     - The audit prints BLANK BEATS (0.3 s+ with only Wil on stage) as warnings. The two left in ep002 are on purpose (Wil alone and centred as he says hello; the end card).
   - **Text size** (from the layout study, 26 Sep 2026): stickers render at 40 px or more, titles 48+, callout lines and labels 30+, card-like notes 28+, measured after Fit scaling. A callout's header is ~0.94 × its body size (it was a fixed 24 px, too small on a phone). Remember the Fit box scales everything: a `size={30}` sticker in the combo scene renders at 33.
   - **Keep the caption zone clear where you can.** YouTube draws captions in the bottom-centre (about x 480–1440, y 870–1060). The audit warns about text that sits mostly inside it; move key text up when the layout allows.
7. **Layout audit** (`python video/scripts/qa_layout.py EpNNN`, about 8 minutes):
   - **How it works:** it renders at 1/10 scale with the `audit` prop on. Every tagged element logs its real on-screen box, rotation and pop progress 10 times a second (`AuditProbe`, `audit()` in kit.tsx).
   - **It reports:** OVERLAPS, CLIPPED (off-frame, or inside the 24 px safe margin at rest), TOO SHORT, BLEED, WIL CUT SHORT and SMALL TEXT (the probe also logs each element's smallest rendered font size). It must end at **0 problems**. It also warns about CAPTION ZONE text and BLANK BEATS.
   - `--fonts` lists every element's rendered text size, smallest first. `--log <audit.log>` re-analyses a saved run without rendering again (the script prints where the log is).
   - **Tag anything you build locally.** Spread `{...audit(kind, label, at, p)}` on its root. Kinds: sticker, callout, title, label, note, card, fig, char. The composition needs the `root` stage-marker div and `{audit && <AuditProbe/>}`.
   - **To fix a problem,** print the real boxes at the reported time: `python video/scripts/audit_boxes.py <audit.log> 112.5 233.4 [--grep LABEL]`. Then move, resize or retime the element. Don't guess from the code: the Fit scaling, the camera and the pop-in overshoot (up to ×1.25 while a sticker lands) change the numbers.
   - Two things in the same spot must **swap**: the first one's `out` ends about 0.4 s before the second one's `at`, and its reading time must fit before that. If it doesn't, give the second one another spot.
   - **Workflow that worked on ep002:** 87 problems → 26 → 5 → 0 in four passes. Then the 12 px margin, title-safe and bleed rules were added (22 more) → 0. The v18 card resize took 49 → 3 → 7 → 0.
8. **Pacing and visual QA** (the audit can't see arrows, confetti, flying cards or Wil's props, so this pass is still needed):
   1. Render a fast preview: `npx remotion render EpNNN out.mp4 --scale=0.25`.
   2. Run `python video/scripts/qa_pacing.py out.mp4 <ep> --sheets <dir>`.
   3. Review every contact sheet.
   - Targets: no stretch of 4 s or more with no new beat, and no blank second.
   - Fix a static stretch with a beat tied to what's being said: a definition callout, a label, a card, or a stamp.
   - Things only the eye catches:
     - arrows crossing text (start an arrow from the note it belongs to);
     - flying cards crossing labels;
     - Wil's animation props (bubbles, thumbnails, counters) running off the frame edge. Keep library props within about 230 rig units to the right of his body.
9. **Wil's animations blend.**
   - The `Wil` component eases every change of pose over `WIL_BLEND` (0.28 s): into an animation, from one animation into the next, and back to idle. Numbers interpolate, faces switch at the halfway point, and props cross-fade. The only exception is the entrance (`NO_BLEND_IN`).
   - **Space the cues.** An animation shouldn't be interrupted before about 60 % of it has played; the audit flags that as WIL CUT SHORT. If two cues are too close:
     - delay the second one with `Math.max(cue, previousCue + seconds)`;
     - or swap in a shorter animation (for example `yes`, 45 frames, instead of `deal-with-it`, 60).
   - Wil fades out and back in around the subscribe overlay (which has its own Wil) instead of blinking.
   - **Wil keeps talking through every animation** (user, 26 Sep 2026). Lip-sync is layered on top of whatever pose is playing: while a word is spoken, his mouth follows the speech; between words, the animation's own mouth shows. It's done in the `Wil` component in kit.tsx. Don't make an animation's mouth override speech.
   - **The mouth follows the real voice.** `scripts/voice_envelope.py` turns narration.wav into `voice.json`: loudness per frame (fast attack, slower release) and the stressed syllables. The narration timing step runs it automatically. Pass it as `voice={voiceJson as Voice}`; the rig's `talk` mouth opens exactly as far as the voice is loud (`mouthOpen` 0–1) and closes in pauses.
   - **The expression budget: don't let his face change more often than it makes sense** (user, 26 Sep 2026: "the eyebrows keep appearing and disappearing and he keeps motioning down, it looks janky"). v18 nodded on every stressed syllable (63 a minute) and flicked his brows on and off 154 times a minute. The evidence is in `research/wil-motion/REPORT.md`: real speakers accent about one word per sentence, head accents follow pitch rather than loudness, and animators "hit the main accents" and never "machine-gun every note". The rules:
     - **Plan, don't react.** `python video/scripts/wil_director.py video/src/episodes/<ep>` writes `expression.json` from the narration's pitch, loudness and word timing. Pass it as `expression={...}`. Run it again after any narration change.
     - **Head accents:** one candidate per sentence (its most prominent content word). Chosen in priority order, at least 2 s apart and at most 9 a minute (ep002: 8.7). Each one is a small anticipation, a stroke just before the syllable, then a slower settle. The direction varies (up, tilt or dip) and the size follows emphasis. Never the same dip every time.
     - **Brows:** a raise is a short eased flash (rise 0.15 s, hold 0.3 s, fall 0.3 s). It never switches on or off instantly: the rig's `browAmt` fades them and lifts them into place. Raises go only on questions, exclamations and the strongest accents, at least 4 s apart and at most 3 a minute from the plan. Total brow raises including reactions must stay ≤ 8 a minute (ep002: 5.0).
     - **Gestures:** only on strong accents, at least 3 s apart and at most 6 a minute. The arm is pseudo-random, never the same arm three times running.
     - **Around a reaction** (a library animation): the small accents fade out from 2 s before it and for 0.6 s after. A planned brow raise that would start while he's calming is skipped, not half-shown.
     - **Brows never flick.** A reaction's brows linger and soften over 1.2 s after it ends ("hold the last shape and soften it"). If his brows would drop and come back within 1.2 s, the rig looks ahead and keeps them up through the gap (the offline render makes this possible). Brow shape changes fade out, then in.
     - **Reactions** (WIL_EVENTS) are tied to meaning and start at least 2.5 s apart; the entrance's follow-up is the one exception. Don't follow one mood with its opposite (celebrate, then facepalm 1.9 s later, was cut).
     - **Base layer:** breathing on a 3.4 s cycle and sway on incommensurate periods (6.53 s and 15.53 s) so the idle never visibly loops. **From ep003, pass `still`:** no breathing or sway loop. He holds a pose and eases into a slightly different one every 4–8 s. The top channels' mascots move 2–7 % of the time, while ours swayed 40–78 % (research/pacing/REPORT.md). Keep reactions to about 2–3 a minute. The lean toward the stage follows a smoothed "mid-flow" signal, never snapping between words. Shades glint every ~9 s.
     - **No jitter** (user, 27 Sep 2026: "around 33 seconds he is jittering"). Nothing on Wil's body may oscillate faster than about 3.5 Hz:
       - A laugh rocks at about 2.6 Hz, a nervous fidget at about 2 Hz, a power-up sway at about 3 Hz. An impact is one recoil, not a rattle.
       - Any smoothed signal must be computed from *every* frame, with smooth weights. v21's "mid-flow" lean sampled the voice every 3rd frame, so its value flickered as the sample grid shifted, and he wobbled ±0.25° on a 3-frame cycle.
       - Remember that `|sin(k·f)|` bounces at twice the rate of `sin(k·f)`.
     - **The audit checks all of it:** WIL REACTIONS TOO CLOSE, WIL EXPRESSION PLAN (the director's gaps and budgets), WIL FACE FLICKER, and WIL JITTER. WIL JITTER uses his tilt, height and sideways position logged on **every** frame (`AUDITF` lines). It flags 4+ fast reversals (≤ 4 frames apart) in a second. A deliberate nod reverses every ~6 frames and passes. The every-3rd-frame audit could never have seen the v21 bug: a 3-frame wobble looks perfectly still when you sample every 3rd frame. The last reads what his face *actually* shows in the render (a hidden `face` probe) and flags brows up under 0.25 s, brows back within 1 s, more than 8 raises a minute, or an eye state under 0.3 s.
   - **He looks at what just arrived.** `looks={looksJson}`: at each look time he turns his shades and head toward the stage, and on every other one points at it (it pulls the viewer's eye to the new thing; instructor-gaze research). Make `looks.json` from the audit log: `python video/scripts/wil_looks.py <audit.log> video/src/episodes/<ep>/looks.json` (card/callout/title/sticker arrivals, at least 4 s apart, never mid-animation; 2.2 s read as twitchy). Re-run it after moving cues.
   - **Friends blink** (staggered) and look toward the middle of the stage.
   - **Brows never leave the card.** When an animation or thumbnail pushes his shades up, the brows stop at y 30 (they used to float above the card in the face colour: invisible on white, stray white arcs on any other background).
10. **The opening seconds need to look intentional** (user, 26 Sep 2026: "the intro needs to be smoothed out"):
   - **Frame 0 is never a small object on an empty stage.** Open on the key object centred and big with a slow push-in (use `at={-0.4}` so it's already popped in), then glide it to its spot as the next elements arrive.
   - **Never clear the stage before the next scene is ready.** Stagger exits (about 0.06 s apart) so they land as the next thing enters (for example, as Wil walks on). Don't let every element fade at the section end and leave a blank beat.
   - **Keep titles in the same spot sequential.** A ransom title's hold covers its typing and reading time. Give the next title's `at` enough delay, or type the first one faster (`stagger={0.02}`).
   - **Keep labels off a big centred Wil**, including where his shades fly up during `deal-with-it`. Put them beside him.
   - **Start the next scene's first visual as Wil slides to his corner,** not a second later.
   - **Check the first 25 seconds** with a 2–4 fps contact sheet (`ffmpeg -t 25 … fps=2,tile=8x6`), plus `qa_layout.py EpNNN --frames 0-900`.
   - **One idea on screen per beat; never repeat the title** (user, 27 Sep 2026: "too many banners etc. and repeated info"). In the hook, show the title plus at most one sticker, and let the objects (box, card, ∞ stamp) carry the rest. Ep002 v20 had "ONE-CARD WIN" plus "1 CARD", "NOT EVEN OUT YET", "NO UPGRADES" and "∞" all up at once (5 text elements), when the reference channels show 1–2. v21 dropped "1 CARD" (it repeats the title) and "NO UPGRADES" (it repeats the ∞ on the box). "NOT EVEN OUT YET" now hands off to the title instead of lingering for 8 s.
   - **A sticker leaves when its line is over**, handing off to the next beat, not when the whole cold open ends.
   - **One label per introduction.** Wil's name card is enough. The channel name is already under every video, so no "WILD CARD COMMANDER" sticker (and no confetti on top of his shades gag).
   - **Don't make Wil walk on under the previous beat's title.** The cold open's last title clears about a second into his entrance, once read.
   - **His name card sits beside him, not in the title spot.** In the title spot it had to wait for the previous title to clear, so its reading time pushed it into his slide and over the first cards. Beside him it can land exactly on "Wil D. Card", be read, and clear before he moves.
   - **Wil is drawn only from the first frame of his entrance.** v20 drew him 0.05 s early, so he flashed on in his resting pose for two frames, vanished, then popped up (the user's "glitchy at 9 seconds"). Frame-step (every frame, not a contact sheet) through every entrance and exit, because a 2-frame flash hides between contact-sheet samples.

## 4. Images

- **Wizards material** (covered by the owner's written permission, recorded in PERMISSIONS.md):
  - card scans (Scryfall `image_uris.png`);
  - art crops (`art_crop`);
  - official product shots from magic.wizards.com and media.wizards.com. For example, the deck-box webp in the decklist article has a transparent background.
- **Description:** no card-art credits and no Wizards copyright line (user decision, 26 Sep 2026). Keep the finder credit and the source links.
- **No generated images needed so far.** No film stills or memes of other franchises.

## 5. Narration (Wil's voice)

1. **Wil's narrator is Gemini 3.8 Flash TTS, voice "Fenrir"** (the user's pick; see "Voice lessons" below). It's the default `NARRATOR` preset.
   - The older setup is kept as `NARRATOR=fish-clone`: Fish Audio cloning `studio/voice/wil-reference.wav`, a voice designed free with the prompt in VOICE.md. The user found it sounded like AI.
   - To redesign it, use the Hugging Face Space `Qwen/Qwen3-TTS` through `gradio_client`, `api_name="/generate_voice_design"`. There's a free ZeroGPU quota of about 3 takes per session; log in with an HF token for more.
   - Measure the takes with `python studio/tools/voice_metrics.py "<text>" take*.wav`, then listen.
2. **Narrate** with `video/scripts/ep002_narration.py`. Copy it for a new episode and change the paths and `DIRECTIONS`.
   - `texts` writes the per-section input, with pronunciation respellings (`SPOKEN`). Only the Fish preset adds `[direction]` tags; Gemini would read them aloud.
   - `generate` narrates any missing sections on OpenRouter. Needs an OK. **Fenrir costs about $0.13 for a 7-minute episode**, and re-voicing one section costs a cent or two.
     - It skips sections that already exist. To retake one, move its file to `old/` and run `generate` again.
   - `timing` trims each section, transcribes it with faster-whisper word timestamps, aligns them to the script's words (respellings mapped back), writes `timing.json`, and joins everything into `public/<ep>/narration.wav` at -15 LUFS.
3. **Check each section:** `python studio/tools/voice_metrics.py "$(cat NN-x.plain.txt)" NN-x.mp3`, run from `studio/voice/<ep>/sections/`.
   - Leaked tags: direction words heard aloud.
   - Accuracy ≥90%. Remaining misses are usually the transcriber mishearing card names.
   - Pitch variation about 3–4 semitones.
4. **Known pronunciation traps:**
   - "D." is read as the numeral 500, so respell it "Dee".
   - Rule numbers: write them out ("six-oh-three point three D").
   - "r/magicTCG": respell as "r slash magic TCG".
   - "Wil": respell as "Will".
   - Listen for new card names ("Dack", "Venser").
5. **Beats after rulings.** Gemini reads at ~180–220 wpm; explainer research wants ~150–170 on rules payoffs with a beat after each ruling. The timing step splices extra silence after the phrases listed in `BEATS` (for example 0.5 s after "That's rule 603.3."). It's free (no regeneration) and the voice is untouched. Ep002 got 3.9 s of beats: after each rule number, after "Himself.", and after the loop's end state. The visuals follow automatically, since every cue is a phrase.
6. **Then:** `qa_cues`, then `qa_layout` (it must end at 0 problems, since real line lengths shift everything), then `wil_looks.py` on the audit log, then `qa_pacing` plus the contact-sheet review, then the full render.
7. **Captions:** `python video/scripts/make_srt.py video/src/episodes/<ep>/timing.json episodes/<ep>/SUBS.srt`. The script's own spelling with the narration's word times, 2 lines of at most 42 characters. Upload it; never burn captions in. Re-run after any timing change.

### Voice lessons (25 Sep 2026)

- **The Fish clone of the Qwen-designed voice sounded AI** to the user. It measured at 159 Hz with 3.2 semitones of pitch variation, fairly flat.
  - The Reddit reference, which the user called "super natural", measures at about 100 Hz (deep) with about 6.8 semitones of variation.
  - Cloning a clip that is itself synthetic probably compounds the artifacts.
- **A shootout of 13 stock voices** on the same passage costs about $0.17 in total. Listening page: `studio/voice/shootout/compare.html`. The most lively and deep options are Gemini 3.8 Flash (Charon, Fenrir, Puck) and MiniMax 2.8 HD (English_expressive_narrator, Jovialman).
- **Gemini on `/audio/speech` reads any style instruction aloud.** Don't prefix "Say this like…". Choose the voice and write the delivery into the script itself (punctuation, short sentences, "Yeah.").
- **Decision (25 Sep 2026): Wil's narrator is Gemini 3.8 Flash TTS, voice "Fenrir".** The user picked it from the shootout. It's the default `NARRATOR` preset in `ep002_narration.py`; the Fish clone is kept as `NARRATOR=fish-clone`.
  - It takes plain text only, with no tags.
  - A 7-minute episode costs about $0.13.
  - Pitch varies 3.4–5.2 semitones per section, against 3.2 for the Fish clone.
  - Word accuracy is 87–99% per section; the misses are the transcriber mishearing card names.
  - The logged cost for Gemini undercounts, because OpenRouter prices it by audio tokens. Check the real spend with `openrouter.mjs check`.
- **The first line of a video comes out too high.** Read with no context, Fenrir over-excites the hook: 175–230 Hz across 5 takes, against about 150 Hz for normal narration.
  - Fix: generate the hook plus the next sentence in one call, then cut the audio at the gap before the next sentence. Find the cut with faster-whisper word timestamps.
  - On ep002 that gave 142–150 Hz. Check every section's pitch with `voice_metrics.py` and redo any outlier this way.
- **Generation settings per model:**
  - Gemini: `--voice <Name>`, output `.wav` (PCM).
  - MiniMax: `--voice English_…`, output `.mp3`.
  - OpenAI GPT Audio: the `speech` command with `--voice cedar|marin --style "…"`.
- **Measured cost per ~280-character clip:**
  - Gemini: about $0.005.
  - MiniMax: about $0.03.
  - GPT Audio: about $0.03–0.05.

### End screen

- **With no other videos on the channel, the end card only asks viewers to subscribe** (user, 25 Sep 2026):
  - a big "SUBSCRIBE!";
  - a button that clicks to "SUBSCRIBED ✓" with a bell;
  - one line of reason ("More Commander rules, combos and hot takes.");
  - Wil ringing his bell.
- The narration's close ends with "if you want more breakdowns like this, subscribe" instead of pointing at a next video.
- Once there's a second video, switch back to a "watch next" card; that's what the growth research recommends.

## 6. Thumbnail and title

- **Built in code:** `video/src/episodes/<ep>/Thumbnail.tsx`, registered as `EpNNNThumbA/B/C…` in `Root.tsx`, rendered with `npx remotion still`.
  - Render the upload copy at **3840×2160** with `--scale=3` into `thumbnail/4k/` (YouTube takes 4K up to 50 MB and shows it sharper on TVs). Keep the 1280×720 render as a fallback. Never test mixed sizes: one variant under 1280×720 drops them all to 480p.
  - `bg`: `paper` (the channel look), `cyan` or `yellow`. YouTube's feed is white in light mode, so a cream thumbnail's edge barely shows. Test paper against a saturated background in Test & Compare before settling the template (ep002: combos in UPLOAD.md).
- **Style:**
  - white paper;
  - the real product and one card (the picture must match the words);
  - a 2–4 word **solid Arial Black headline with a thick ink outline**. No multicoloured ransom tiles; the user found them illegible.
  - a big Wil with visible **big eyes** and a shocked or reacting face.
- **Compare every thumbnail** in a mock feed, light and dark, at phone size with the duration badge, against the studied channels' top thumbnails (`research/*/analysis/meta/videos/<id>.jpg`).
- **Title:** state the take as an opinion backed by a checkable fact ("WOTC Messed Up: This Precon Wins With ONE Card"). Never invent motives, such as claiming it was an accident or that they knew.
  - At most 50 characters (shorter is better: 1of10's 2025 data puts the best titles at about 5 words / 30 characters). No question-bait titles.
  - Headline text on the thumbnail: about 10 characters or fewer, one strong emotion on Wil.
- **Test & Compare** every long-form upload: up to 3 title + thumbnail combos. YouTube picks by watch-time share, not CTR. Record the winner in the episode's VIDEO.md.
- **Upload checklist:** the general YouTube research (`research/youtube-general/REPORT.md`) ends with a prioritised checklist (P0 before every upload). The episode's UPLOAD.md carries the per-episode version: disclosure (No, see PERMISSIONS.md), 2–3 hashtags, a pinned comment with the rule citations, unlisted first with Ask Studio feedback, the SRT, and the 48 h / 7 d / 28 d analytics checks.

## 6b. Shorts that promote the episode

The research and our template are in `research/shorts/REPORT.md`. Ep002's Short is the worked example: `video/src/episodes/ep002short/Short.tsx`, with its upload copy in `episodes/<ep>/short/SHORT.md`.

1. **Plan:** 40–55 s. Deliver the headline promise in full (the combo), then open a second question that the long video answers (the catch, how to stop it). One strong beat every 2–3 s.
2. **Narration, cut from the episode (free):**
   - List the lines by time range in `video/scripts/short_<ep>.json`, grouped into `scene`s.
   - Run `python video/scripts/short_cut.py video/scripts/short_<ep>.json`. It snaps to whole words, cuts in the silences with 8 ms fades, and writes the Short's narration.wav, timing.json, voice.json and expression.json.
   - **Re-transcribe the result with whisper** to check no word was clipped. You can't hear it, so this is the listen-through.
3. **Vertical composition** (1080×1920):
   - Everything readable inside **x 60–880, y 250–1500**. The Shorts interface covers the top, the right rail and the bottom ~420 px (handle, title, the carousel with the related-video link).
   - Wil stands bottom-left, so he's clear of the right rail and can point down at the link.
   - Stage: OPPONENT on top, YOU below.
   - Hook: the claim is on screen at frame 0 (`at={-1.2}`, so it has fully settled), with the first word by 0.3 s.
   - Keep a faint grey scrim at the bottom and right, so YouTube's white interface text stays legible.
4. **Call to action in the last ~3 s, with no new voice line:**
   - Wil does `point-down` (the Shorts variant of `link-below`, with no "description" bubble).
   - The long video's thumbnail flashes (YouTube's own guidance).
   - One line of text: what the full video answers, plus "FULL VIDEO ↓".
5. **Burned-in captions on every Short** (owner, 27 Sep 2026; long videos still get the SRT only):
   - Add `<ShortCaptions timing={T} x={590} y={1441} maxWidth={580} />`. It shows 1–3 words synced to the voice, ink with a white outline, in a band right of Wil (x 300–880, y 1385–1497).
   - A lone word joins the chunk before it unless that chunk ended a sentence. Long chunks become two balanced lines at 56 px.
   - Keep the band clear: nothing else between y 1380 and 1500 on the right.
   - **Stickers never restate the narration once captions carry it.** Keep only labels that add something the voice doesn't say: who owns what, counts, card types, the call to the full video.
   - The audit treats captions as text: no overlaps, at least 56 px, and no reading-time rule, since they're read along with the voice.
6. **Checks:**
   - `qa_layout.py Ep<NNN>Short --shorts` must reach 0 problems. In Shorts mode, "CLIPPED" means outside the Shorts safe box.
   - Stills over a mock of the Shorts interface.
   - `check_script.py` on the title, description, pinned comment and on-screen text.
7. **Upload** (details in SHORT.md):
   - Publish the long video first, then the Short within 48 h.
   - Set **Related video** in Studio. It's the only clickable link in a Short; description and comment links don't work.
   - Title of 40 characters or fewer, different from the long title. 2–3 hashtags.
   - Pinned comment pointing at "the link under the title".
   - Plan 2–3 more Shorts per episode, in varied formats. "RULES QUESTION:" is the best-proven one.

## 7. Render and hand-off

- **Sanity check before every full render** (user, 26 Sep 2026: "do a sanity check on stuff like that before rendering"). A full render plus the upload takes about 20 minutes, so catch problems first:
  1. **Numbers:** `qa_layout.py` must end at 0 problems, including the three WIL checks. `wil_director.py --check` must pass.
  2. **Eyes on Wil:** `python video/scripts/wil_closeups.py EpNNN out.png <t1> <t2> …` renders 3-second close-up strips of Wil (10 frames a second). Always include the intro walk-on, a long plain-talking stretch, two or three reactions, and anywhere the user flagged. Look for brows popping, the same move on every word, snapping poses, a mood change with no reason, and stray shapes (for example the v18 "second mouth" tongue).
  3. **Any other change you made** (a new prop, text, card or effect): render stills at its moments and look at them.
- **Work-in-progress reviews happen in Remotion Studio, not renders** (user, 28 Sep 2026). Run `npx remotion studio --no-open` in `video/`; the owner remotes into the PC and opens http://localhost:3000. Render only when the episode is done.
- **Full render:** `npx remotion render EpNNN ../episodes/<ep>/render/<ep>-vN.mp4`. Takes about 10–15 minutes for 7 minutes of video.
  - Run it in the background and wait with `until grep -q RENDERED …`.
- **Verify:**
  - both audio and video streams: `ffprobe -show_entries stream=codec_type,duration`;
  - loudness: `ffmpeg -af ebur128`.
- **Publishing** (research/publishing/REPORT.md, setup in studio/tools/publish/SETUP.md):
  - YouTube is uploaded by hand from the episode's upload pack.
  - Instagram Reels: `python studio/tools/publish/instagram.py post <video> --caption-file <txt> [--cover-ms N] [--yes]`.
  - TikTok to drafts: `python studio/tools/publish/tiktok.py draft <video> [--yes]`.
  - Without `--yes` it's a dry run. Ask the owner before every real post.
- **Update `episodes/<ep>/VIDEO.md`** with what changed, the costs, and what's still to do.

## Costs so far

| Item | Cost |
|---|---|
| Voice design (Qwen VoiceDesign, HF Space) | $0 |
| Episode 002 narration (Fish S2.1 Pro, 7.6k chars + one retake) | $0.12 |
| Card and product images | $0 |

## Environment notes (Windows, this PC)

- **Hardware:** Intel Core Ultra 7 270K, 31 GB RAM, AMD RX 7800 XT.
- **Local AI:**
  - Local image and voice models are **not** worth it here. ROCm on Windows doesn't officially list the 7800 XT, and it needs Python 3.12.
  - faster-whisper on CPU (`small.en`, int8) is fine for timing and checks.
- **Python 3.10** has librosa, faster-whisper and gradio_client installed.
- **Tool quirks:**
  - yt-dlp is `python -m yt_dlp`. YouTube currently 403s media downloads, though metadata still works.
  - ffmpeg `drawtext` fails on Windows font paths. Label frames with PIL instead.
  - Remotion 4.0.528: `<Audio src={staticFile(...)}/>` for narration.
- **Safety check:** the shell blocks `rm -f $VAR/*`. Use `"${VAR:?}"/*` or a literal path.
