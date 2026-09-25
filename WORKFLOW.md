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
| Voice, retention and research rules | `VOICE.md`, `RETENTION.md`, `*/FINDINGS.md` |

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
7. **Layout audit** (`python video/scripts/qa_layout.py EpNNN`, about 8 minutes):
   - **How it works:** it renders at 1/10 scale with the `audit` prop on. Every tagged element logs its real on-screen box, rotation and pop progress 10 times a second (`AuditProbe`, `audit()` in kit.tsx).
   - **It reports:** OVERLAPS, CLIPPED (off-frame, or inside the 24 px safe margin at rest), TOO SHORT, BLEED, and WIL CUT SHORT. It must end at **0 problems**.
   - **Tag anything you build locally.** Spread `{...audit(kind, label, at, p)}` on its root. Kinds: sticker, callout, title, label, note, card, fig, char. The composition needs the `root` stage-marker div and `{audit && <AuditProbe/>}`.
   - **To fix a problem,** print the real boxes at the reported time from the saved `audit.log`, then move, resize or retime the element. Don't guess from the code: the Fit scaling and camera change the numbers.
   - **Workflow that worked on ep002:** 87 problems → 26 → 5 → 0 in four passes. Then the 12 px margin, title-safe and bleed rules were added (22 more) → 0.
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

## 4. Images

- **Wizards material** (covered by the owner's written permission, recorded in PERMISSIONS.md):
  - card scans (Scryfall `image_uris.png`);
  - art crops (`art_crop`);
  - official product shots from magic.wizards.com and media.wizards.com. For example, the deck-box webp in the decklist article has a transparent background.
- **Credit line for the description:** "card and product images © Wizards of the Coast, used with permission", plus the card artists.
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
5. **Then:** `qa_cues`, then `qa_layout` (it must end at 0 problems, since real line lengths shift everything), then `qa_pacing` plus the contact-sheet review, then the full render.

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

- **Built in code:** `video/src/episodes/<ep>/Thumbnail.tsx`, registered as `EpNNNThumbA/B/C` in `Root.tsx`, rendered with `npx remotion still`. Output is 1280×720 and under 2 MB.
- **Style:**
  - white paper;
  - the real product and one card (the picture must match the words);
  - a 2–4 word **solid Arial Black headline with a thick ink outline**. No multicoloured ransom tiles; the user found them illegible.
  - a big Wil with visible **big eyes** and a shocked or reacting face.
- **Compare every thumbnail** in a mock feed, light and dark, at phone size with the duration badge, against the studied channels' top thumbnails (`*/analysis/meta/videos/<id>.jpg`).
- **Title:** state the take as an opinion backed by a checkable fact ("WOTC Messed Up: This Precon Wins With ONE Card"). Never invent motives, such as claiming it was an accident or that they knew.

## 7. Render and hand-off

- **Full render:** `npx remotion render EpNNN ../episodes/<ep>/render/<ep>-vN.mp4`. Takes about 10–15 minutes for 7 minutes of video.
  - Run it in the background and wait with `until grep -q RENDERED …`.
- **Verify:**
  - both audio and video streams: `ffprobe -show_entries stream=codec_type,duration`;
  - loudness: `ffmpeg -af ebur128`.
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
