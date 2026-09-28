# Episode 003 video: build notes

**Status (28 Sep 2026): narrated and synced. Awaiting the owner's review in Remotion Studio** (`npx remotion studio` in `video/`, then http://localhost:3000/Ep003). Final render only when the owner says it's done.

## What's built

- **Composition:** `Ep003` in `video/src/Root.tsx`, code in `video/src/episodes/ep003/` (`Ep003.tsx` scenes, `parts.tsx` props). 12:28 of narration plus the end card.
- **Narration:** Gemini 3.8 Flash TTS, voice Fenrir, 14 sections (`video/scripts/ep003_narration.py`).
  - Word match per section 91–100%. The misses are the transcriber writing numbers as digits or mishearing card names (Halsin as "Hausen"); nothing was skipped.
  - Median pitch 136–173 Hz, variation 4.2–5.9 semitones. The cold open came out at 140 Hz, so no re-take was needed for a high first line.
  - Pauses after the story punchlines (`BEATS`). Respellings for Wil D., $214, 7/7, 4/4, 1/1, 10/10, 52/52s, Orazca, Jaheira, Sarinth.
  - Loudness −15 LUFS. Listening copy on the review artifact page.
- **Wil:** voice envelope (`voice.json`), expression plan (`expression.json`: 8.3 nods, 1.8 brow raises and 3.8 gestures a minute), and 35 reactions (about 2.8 a minute). He's in the new `still` idle: no breathing or sway loop, just a small pose shift every 4–8 s.
- **Pacing:** follows `research/pacing/REPORT.md`, measured on 22 MTG videos.
  - No idle wobble, camera drift or decorative showers.
  - Payoff effects about once a minute.
  - Layouts hold still while they're explained.
- **Images:** `video/scripts/ep003_images.py`, from Scryfall. The Marit Lage token is the MH1 printing, because the TLE one is a still from the show.
- **Props** (`parts.tsx`):
  - cabbages: a code-drawn cabbage, piles that grow, tap, get badges or scatter, and a rolling counter;
  - price tags, mana pips, dice and chips, a wall;
  - Dark Depths' ice counters, a turn tracker, a tapped-card wrapper;
  - flashes, starbursts and a mulligan fan.
- **Removed on review (28 Sep 2026):**
  - the "CABBAGES MADE" counter: its total mixed cabbages from different stories, so the number meant nothing, and it never paid off;
  - the "!" badges in the cold open;
  - the confetti on "nuclear weapons";
  - the "NORMAL MAGIC? NAH." sticker (a line not in the script);
  - "NO INFINITE COMBOS" (four stickers at once);
  - the "CARDS THAT SING" title (it repeated the chapter sticker);
  - the duplicate "my record" counter.
  - The judge flashes went from three to two, and softer. Wil's glances are now at least 7 s apart.
- **Signature segment:** the WILD CARD VERDICT card over the outro.
- **Subscribe:** the overlay at 3:12 (26%), right after the four-card-hand payoff.
- **Captions:** `SUBS.srt` (274 captions), made from the real timing.
- **Chapters:** in SCRIPT.md, from the real timing.
- **Decklist:** `DECKLIST.txt`: grouped by type with prices, the upgrades, and an import block.

## Costs

| Item | Cost |
|---|---|
| Narration (Fenrir, 13k characters, 14 sections) | about $0.25 (OpenRouter logs Gemini low; account total is now $0.71) |
| Card images | $0 |

## Still to do

1. The owner's notes from Studio.
2. Layout audit on the real narration: **0 problems** (28 Sep 2026, after moving "*CLICK*" onto the judge as a stamp). Wil passes jitter, flicker and the expression plan. `looks.json` was made from that audit (105 glances). After any change the owner asks for, re-run the audit and the Wil close-ups, then do the full render.
3. Thumbnail and title. No "budget" at $214. Options: "My Cabbage Man Deck Turns Cabbages Into 7/7 Dinosaurs", "My $200 Group Hug Deck Turns Cabbages Into Nuclear Weapons", "My Friends Keep Losing to a Pile of Cabbages".
4. The owner to confirm the story numbers (73 bears, 47 cabbages, 23 mana, 52/52s, "record past seventy") and the Moxfield link for the description.
