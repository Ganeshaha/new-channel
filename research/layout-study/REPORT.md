# Layout study: how the flat-background MTG channels use the 1920×1080 frame, and how ep002 compares

Measured 26 Sep 2026. Sample: 33 top long-form videos from 7 channels, 1,650 frames at one every 6 s plus 9,900 frames at one per second for pacing. Compared against `episodes/002-one-card-infinite-precon/render/ep002-v17.mp4` (69 frames at one every 6 s; 415 at one per second).

**What we changed because of it (v18) is in the last section.**

**Summary.**
- Our text size, side margins and card spacing already match the references.
- The big difference is **card size**. When the reference channels show one card, it fills a median **91% of the frame height**; ours fills **44%**.
- The references cover about **2.3× more of the frame** (34% ink vs 15%).
- They put **fewer items and less text** on screen.
- Their **layouts hold about twice as long** (8.5 s vs 4.5 s).
- Wil, at 36% of the height, is the same scale as the only reference with a mascot fixed in a corner (Really Bad At MTG, 28%). The bigger mascot channels also cut to much larger mascot shots, 75–95% of the height.

## 1. Method

**Which videos.** For each channel I took the top long-form uploads by views. I skipped Shorts, streams, podcasts and anything under 4 minutes.
- Salubrious Snail and Next Level Commander: from `analysis/dataset.json`.
- DefCat: from `meta/videos/*.info.json`.
- Trinket Mage and MaldHound: from `videos_flat.tsv`.
- Really Bad At MTG and 3/3 Elk: their uploads were listed with yt-dlp (`lists/*.tsv`).
- The picks are in `lists/picks.json`. Based Deck Department was skipped because it uses a black background.

**Getting frames.** yt-dlp 2026.08.19 under `py -3.12`, with no cookies. I downloaded seconds 60–360 of each video at up to 720p (`--download-sections`). Some requests got 403 errors but succeeded on retry, so the storyboard fallback was never needed.
- `frames/<channel>/`: one frame every 6 s, 50 per video, 1280×720.
- `dense/<channel>/`: one frame per second, 320 px wide, used for pacing.
- Our video was sampled the same way over its full length.

**How each metric is measured** (`tools/measure.py`, using numpy, scipy and PIL). Frames are scaled to 1280×720. Percentages are of frame width (%W) or frame height (%H).
- **Background colour:** the most common colour in a 6-px strip around the frame edge.
- **Ink:** any pixel that differs from the background by more than 38 in any colour channel.
- **Textured paper** (Next Level Commander's crumpled paper) counts as background if it is bright and low-saturation.
- **Flat-background frame:** at least 40% of the edge strip is one colour (or textured paper) and ink covers less than 80% of the frame. Only these frames are used for the layout metrics.
- **Margins:** the empty border around all ink. **Ink coverage:** the share of ink pixels. **Occupied area:** the same with enclosed holes filled.
- **Elements:** ink spread out by 1% of frame width, then separate blobs of at least 0.3% of the frame are counted.
- **Cards:** blobs whose best-fit rectangle has a short-to-long side ratio of 0.655–0.785 and nearly fills that rectangle. The fit also works for tilted cards.
  - A card must have texture and colour, and a uniform border on 2 of 3 edges when it is not tilted. This rejects photos and screenshots.
  - Rows of touching cards are split at the card borders. Card height is the long side.
- **Card gap:** the horizontal distance to the nearest card of the same size in the same row, as a % of card width.
- **Text:** small thin shapes outside cards, found three ways: on the background, dark text on lighter boxes, and light text on darker boxes.
  - Shapes are grouped into lines of at least 3 similar-height letters, and the line must be at least 2.5× wider than tall.
  - Cap height is the 75th-percentile letter height in the line.
  - Lines under 2%H are left out of the "display text" rows; they are mostly card rules text or screenshot interface text.
- **Pacing** (`tools/holdtime.py`): the frame is split into a 16×9 grid and compared once per second.
  - A **layout** lasts until the cells with ink overlap its first second by less than half.
  - A **pop-in** is a second in which at least 2 new cells gain ink.
  - A **still second** is one in which fewer than 2% of cells change.
  - For our video there is a second pass with Wil's cells masked out.
- **Mascots:** fixed characters come from pixels that are ink in at least 60% of a video's frames. Other mascot sizes were read off contact sheets with a 10% grid. The detectors were checked against overlays in `sheets/dbg_*.jpg`.

**Limits.**
- Fanned or stacked cards are often missed, so card counts are a minimum.
- Dark Moxfield interface panels sometimes pass as cards.
- Text-line counts are approximate; cap heights are reliable.
- The pacing measure counts constant idle motion as change. For our video that is part of the finding.
- DefCat and MaldHound are only 24–28% flat-background frames (mostly face-cam), and Trinket Mage 59%, so none of them is in the pooled reference.
- **Pooled reference = Salubrious Snail, Next Level Commander, Really Bad At MTG and 3/3 Elk (20 videos, 1,000 frames).** 3/3 Elk's background is flat grey (RGB about 106–126), not white.

## 2. Per-channel metrics

Each cell is the median, with the middle 50% range in brackets. %W is percent of frame width and %H percent of frame height. At 1080p, 1%H = 10.8 px and 1%W = 19.2 px.

| Metric | Salubrious Snail | Next Level Cmdr | Really Bad At MTG | 3/3 Elk | Trinket Mage | DefCat | MaldHound | **Ref pooled** | **Ours v17** |
|---|---|---|---|---|---|---|---|---|---|
| Frames (videos) | 250 (5) | 250 (5) | 250 (5) | 250 (5) | 250 (5) | 200 (4) | 200 (4) | 1000 (20) | 69 (1) |
| Flat-background frames % | 99.6 | 98.8 (textured) | 97.6 | 100 (grey) | 59.2 (cream/red) | 23.5 | 27.5 | 99 | 100 |
| Margin left %W | 2.6 (1.3–5.9) | 9.1 (3.8–21.6) | 10.4 (4.0–19.9) | 2.9 (1.9–6.5) | 10.0 (5.9–27.9) | 5.2 | 1.6 | 4.8 (2.1–14.1) | 5.6 (3.9–7.3) |
| Margin right %W | 4.1 (1.1–13.8) | 7.9 (3.3–30.3) | 5.6 (5.6–5.6) | 7.6 (5.2–7.8) | 7.9 (5.8–28.3) | 12.4 | 0 | 5.6 (4.6–9.0) | 5.8 (5.5–5.9) |
| Margin top %H | 3.2 (1.4–6.1) | 5.4 (3.5–7.2) | 10.7 (3.9–22.6) | 1.8 (1.5–3.2) | 5.6 (5.0–9.6) | 0 | 5.7 | 4.2 (1.8–10.4) | **11.9 (6.9–23.6)** |
| Margin bottom %H | 5.6 (2.2–17.2) | 4.4 (2.9–7.4) | 7.1 (3.7–12.9) | 1.8 (1.7–3.7) | 5.7 (5.0–10.0) | 0 | 0 | 4.2 (1.8–9.1) | 5.0 (4.7–5.3) |
| Narrower side margin %W | 1.5 (0.6–2.6) | 5.6 (2.3–14.9) | 5.6 (3.9–5.6) | 2.8 (1.9–6.5) | 7.8 (5.8–27.9) | 4.0 | 0 | 3.6 (1.7–5.6) | 5.4 (3.8–5.7) |
| Ink coverage % | 27.3 (14.6–38.3) | 40.4 (27.7–50.4) | 27.9 (6.9–36.9) | 45.0 (26.0–48.2) | 41.2 (26.8–51.9) | 54.7 | 50.8 | 34.5 (19.2–46.0) | **14.8 (12.9–18.5)** |
| Occupied area % (holes filled) | 31.9 | 46.5 | 33.6 | 53.1 | 51.7 | 62.8 | 58.7 | 37.9 (22.4–53.1) | **19.0 (15.5–24.1)** |
| Elements on screen | 3 (2–6) | 2 (1–3) | 2 (2–3) | 3 (2–3) | 1 (1–2) | 1 | 2 | 3 (2–4) | 4 (3–5) |
| Ink centre x / y % | 47 / 44 | 49 / 46 | 39 / 51 | 39 / 52 | 50 / 46 | 44 / 47 | 47 / 56 | 45 / 49 | 47 / 53 |
| Frames with ≥1 card / ≥3 cards % | 78 / 49 | 69 / 18 | 28 / 1 | 58 / 5 | 66 / 4 | 43 / 2 | 60 / 11 | 58 / 18 | 65 / 6 |
| Cards per frame (when any) | 4 (2–6) | 1 (1–3) | 1 | 1 | 1 (1–2) | 1 | 2 | 1 (1–3) | 1 |
| **Largest card height %H** | 46.4 (38.8–46.5) | 83.2 (56.1–89.1) | 79.5 (61.2–92.5) | 96.3 (90.9–96.4) | 79.9 (69.9–89.9) | 93.6 | 74.0 | **67.6 (46.4–92.0)** | **39.9 (36.1–46.0)** |
| **Card height, one card on screen %H** | 46.3 | 88.0 (85.2–91.8) | 83.8 (60.8–93.6) | 96.3 | 79.9 (66.5–89.9) | 92.8 | 32.2 | **91.0 (67.5–96.3)** | **44.0 (36.6–48.9)** |
| Gap between separated cards, % of card width | 9.9 (4.5–40.9) | 20.4 (12.7–26.5) | 5.2 | 27.4 | 39.0 | 8.7 | 5.2 | 13.2 (5.0–32.0) | 23.1 |
| Card tilt, degrees (75th / 90th percentile) | 0.0 / 0.1 | 0.0 / 0.2 | 0.9 / 7.7 | 0.0 / 0.1 | 0.0 / 10 | – | – | **0.04 / 0.16** | **4.6 / 5.5** (median 2.1) |
| Display text cap height %H | 3.7 (2.8–4.4) | 2.5 (2.2–3.3) | 2.7 (2.3–3.9) | 2.6 (2.2–4.5) | 2.4 | 2.4 | 2.9 | 3.0 (2.4–4.1) | 3.1 (2.5–3.7) |
| Largest text per frame %H | 4.9 (3.1–6.0) | 3.3 (2.7–5.0) | 3.0 (2.4–4.3) | 4.3 (2.8–4.9) | 3.9 | 3.2 | 4.5 | 3.8 (2.6–5.1) | 4.2 (3.5–4.9) |
| Display text lines per frame | 1 (0–6) | 0 (0–4) | 0 (0–2) | 0 (0–2) | 1 (0–4) | 1 | 6 | 1 (0–3) | **4 (1–7)** |
| Frames with any text % | 72 | 53 | 53 | 51 | 56 | 75 | 96 | 57 | **88** |
| **Layout hold, median s** | 10 | 9.5 | 3 | 6 | 7 | face-cam | face-cam | **8.5** | **4.5** (4.0 without Wil) |
| Layout changes per min | 3.2 | 3.2 | 13.5 | 4.4 | 5.7 | 0.4 | 0.8 | 4.3 | 8.6 |
| Pop-ins per min | 8.1 | 7.7 | 25.1 | 9.1 | 15.4 | 9.7 | 24.2 | 8.5 | **29.3** |
| Share of seconds that are fully still | 0.84 | 0.81 | 0.25 | 0.61 | 0.67 | 0 | 0.08 | 0.77 | **0.01** (0.16 without Wil) |

**Ours with Wil's zone masked out** (x 1450–1830, y 600–1050):
- Content runs from x 5.6% to 71% and from y 12% to 79%.
- Ink coverage is 11%, and the ink centre sits at x 35%.
- Wil is 35.6%H (384 px) by 17.5%W (336 px), fixed in the box x 77–94%, y 59–95%.

Per-video results are in `per_video.md`. Channels are consistent from video to video. Every reference video except Salubrious Snail's has a largest card of at least 60%H, and 12 of those 15 are at 74%H or more.

## 3. Pooled reference vs ours

| Metric | Reference median (middle 50%) | Ours (v17) | Verdict |
|---|---|---|---|
| Card height, one card on screen | 91%H (68–96), about 980 px | 44%H, about 475 px | **Far too small** |
| Largest card | 68%H (46–92) | 40%H | **Too small** |
| Ink coverage / occupied area | 34% / 38% | 15% / 19% | **Too empty** |
| Top margin | 4.2%H (45 px) | 11.9%H (129 px) | **Top band wasted** |
| Bottom of content (without Wil) | about 4%H from the edge | 21%H from the edge | Content stops high |
| Narrower side margin | 3.6%W (69 px) | 5.4%W (104 px) | OK |
| Vertical centre of ink | 49%H | 53%H | Slightly low |
| Elements on screen | 3 (2–4) | 4 (3–5) | A bit busy |
| Display text lines per frame / frames with text | 1 / 57% | 4 / 88% | **Too much text** |
| Display cap height / largest text | 3.0%H / 3.8%H | 3.1%H / 4.2%H | OK |
| Gap between cards | 13% of card width (5–32) | 23% | OK |
| Card tilt | 0° | median 2.1° | References never tilt |
| Layout hold / pop-ins per min / still seconds | 8.5 s / 8.5 / 77% | 4.5 s / 29 / 1% (16% without Wil) | **Too busy, never still** |
| Mascot height | Really Bad At MTG corner 28%H; 3/3 Elk bust 75–95%H; Trinket 70–85%H | 36%H | Matches Really Bad At MTG; we have no big shots |

## 4. What each channel does on screen

Contact sheets with a 10% grid are in `sheets/grid_*.jpg`; there is also `sheets/ours.jpg`, and one-frame-per-second strips in `sheets/dense_*.jpg`.

**Salubrious Snail** (white; 350k–970k views)
- The only reference that uses small cards (39–46%H). It makes up for that with quantity: rows and grids of 3–8 cards, 4 per frame on average.
- Stacks are drawn as offset piles, with loose arrows and boxes around them.
- Text is plain black sans with no boxes: headlines about 4.9%H, lists about 3.7%H, top-left.
- Content runs to 1–3% from the frame edge. When the stick figure appears it is 40–50%H.
- No shadows and no tilt. It uses hard cuts and pop-ins, and each layout builds over about 10 s while being still 84% of the time.

**Next Level Commander** (crumpled-paper texture)
- Built around one hero card at 85–92%H. Two cards run 75–80%H with gaps of 15–25% of card width; three cards about 65%H.
- The stick figure is 45–55%H, and the Yume character about 55–60%H at the right edge.
- Titles use a colour handwritten marker font at 3–6%H.
- Photos and memes appear as plain rectangles. Nothing is tilted, and layouts hold about 9.5 s.

**Really Bad At MTG** (pure white; the closest match to our setup)
- The blob mascot is fixed at x 75–94%, y 52–79% (about 28%H by 20%W). It floats with about 20% of empty space below it.
- Everything else sits in the left 70%: a single card at about 84%H, and photos at 50–80%H.
- Lists use a Comic-style font at 2.7–3.7%H.
- It is the fastest reference (3 s layouts, 25 pop-ins per minute), but it is still fully still 25% of the time.

**3/3 Elk** (flat grey)
- A strict two-zone layout. Hero cards fill x 2–41% at 96%H. The mascot bust takes the right 40–45% at 75–95%H, cut off by the bottom edge, and changes expression every few seconds.
- Cards cut in, sometimes as offset pairs. Question screens use rounded white boxes with soft shadows. Big white serif statements run 7–10%H.
- Cards are never tilted.

**The Trinket Mage** (cream, red or blurred-light backgrounds)
- Cards at 80–90%H, either one alone or two pinned to the edges.
- The mascot sticker appears alone and centred at 70–85%H as a reaction shot, not as a permanent corner fixture.

**DefCat and MaldHound** (face-cam; contrast only)
- Overlay cards run 75–95%H and captions are small (2.4–2.9%H).

**Ours (v17)**
- Bold condensed-caps sticker labels: tilted, with borders, drop shadows and yellow, white or red fills. Quotes are in serif with highlighted words.
- Cards are 40–50%H, tilted 2–5°, with drop shadows. Wil is fixed bottom-right at 36%H.
- The top 12% of the frame is empty. Something moves in 99% of seconds (84% even with Wil masked out), with 29 pop-ins per minute.

## 5. Recommendations, in priority order

1. **Make the hero card twice as big.**
   - One card on screen: **80–90%H**, which is 865–970 px tall and about 620–700 px wide. The reference median is 91%H; ours was 44%H.
   - Centre it at about x 30–40% so it stays clear of Wil (x ≥ 1450). That is 3/3 Elk's card-left, character-right split.
   - Two cards: **70–80%H**. Three cards: **55–65%H**. Grids of 4 to 8: **38–46%H**.
2. **Fill the frame: aim for 30–45% ink coverage** (ours was 15%).
   - Cut the top margin to about **4%H (45 px)**; ours was 129 px.
   - Let hero cards run to about 4%H from the bottom edge.
   - Move the vertical centre of content from 53%H up to **47–50%H**.
3. **Put less on screen at once.**
   - Aim for **2–3 elements, counting Wil**, with a hard cap of 4.
   - Show **at most 2 display text lines** per frame, and have text on screen in about **55–60% of frames** (we were at 88%). Drop labels that repeat the narration.
4. **Slow down and let frames rest.**
   - Hold each layout for a median of **6–10 s**, and keep pop-ins to **10–15 per minute**.
   - Keep **at least 50% of seconds fully still outside Wil**. Ours was 16%; the references are 61–84%, and even the fastest one is still 25% of the time.
   - Remove the idle bobbing on cards and labels, and keep idle motion only on Wil.
5. **Keep cards straight (0°).** Reference cards have 0° tilt in 90% of frames. Keep the sticker tilt on labels only, and hold cards at 0–1°.
6. **Keep the current text sizes.**
   - Minimum for display text: **2.2%H (24 px)**.
   - Body text: **2.5–3.7%H (27–40 px)**.
   - One headline per frame: **4–5%H (43–55 px)**. Single-idea statements can go to **7–10%H**.
7. **Margins.** Keep **3.5–5.5%W (67–106 px)** as the safe zone for text on the sides. Hero cards may come to 2–4%H from the top and bottom.
8. **Wil.**
   - His current size (36%H by 17.5%W) is right for a fixed corner mascot.
   - Consider raising him so his feet sit at about 85–90%H instead of 95%, which is how Really Bad At MTG floats its mascot.
   - Add a few big-Wil reaction shots per video at **70–90%H**: centred when he is alone (as Trinket Mage does), or filling the right 40% next to a 90%H card (as 3/3 Elk does). Use them for jokes and verdicts.
9. **Card gaps are fine.** Use **15–25% of card width** for rows of 2–3 cards, and **5–10%** for grids.
10. **Styling.** Use plain card scans with at most a soft shadow, and one accent style per frame.

## 6. Files

- `measurements.json`: all distributions, pacing results and fixed-overlay data.
- `tables.md`, `per_video.md`: the generated tables.
- `frames/`, `dense/`: the extracted frames, including `ours`. About 360 MB; gitignored, so re-extract them with `tools/fetch.py`.
- `data/per_frame_<channel>.jsonl`: raw measurements for every frame (gitignored).
- `tools/`: `fetch.py`, `measure.py`, `holdtime.py`, `aggregate.py`, `tables.py`, `persistent_mascot.py`, `sheet.py` (set `GRID=1` for a 10% grid), `debug_overlay.py`.
- `sheets/`: contact sheets and detector overlays.
- `lists/`: upload lists, picks and logs.

**Notes.**
- yt-dlp on Python 3.10 is stuck at an old release; use `py -3.12 -m yt_dlp`.
- No cookies were used.
- 403 errors on media downloads went away on retry.

To re-measure a new render, put its frames in `frames/ours` and `dense/ours`, then run:

```
python tools/measure.py ours && python tools/holdtime.py && python tools/aggregate.py && python tools/tables.py
```

---

## What we applied (ep002 v18, 26 Sep 2026)

- **Cards:** every hero card is bigger. Spotlight cards went from about 44%H to about 60–75%H, with a second pass in progress (see below). The end-state board and the token cards are about 20% bigger. Callouts and stickers were moved to make room, and the layout audit was re-run until it reported 0 problems.
- **Card tilt** was reduced (see the kit's `CardImg`).
- **Text sizes:** they were already on target. The layout audit now enforces a minimum rendered size per kind of text, calibrated on these numbers (`MIN_TEXT` in `video/scripts/qa_layout.py`).
- **Not applied yet:**
  - fewer labels per frame;
  - longer layout holds and still frames;
  - big-Wil reaction shots.

  These change the channel's style (the owner asked for "lots of fun animations"), so they are left for the owner to decide. See VIDEO.md.
