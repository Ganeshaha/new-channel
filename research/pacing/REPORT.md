# Visual pacing: engaging without being distracting

Researched 28 Sep 2026, after the owner asked whether "a new beat every 2–4 seconds" was too busy. The measurements are in `tables.md` and `results.json`, the contact sheets in `sheets/`, and the measuring scripts in `tools/`.

## How it was measured

- **The sample:** 22 MTG videos (14 high-view at 74k–973k views, 8 low-view from the same channels), 2 big non-MTG explainers, and our own ep002 v22.
- **The method:** frames were taken from low-res downloads (or YouTube storyboards where downloads failed), and each frame was compared with the one before. A big difference counts as a **cut**, a moderate one as a **beat** (something added, removed or moved), and anything else as **still**.
- **"Things moving at once"** was judged by eye from the contact sheets.

## What the high-view videos do

| | High-view MTG (median of 14) | Low-view MTG (median of 8) | Ours (ep002 v22) |
|---|---|---|---|
| Seconds between visible changes | 3.5 | 3.6 | 3.3 |
| Share of time nothing moves | **85 %** | 88 % | **14 %** (33 % with Wil ignored) |
| Longest completely still stretch | **18 s** | 19 s | 6 s |
| Things moving at once | 1 (rarely 2) | 1 | 2 (often 3) |

- **How often something new appears is about the same as ours.** The difference is what happens in between: the top videos then stop, and ours never does. Wil sways in 40–78 % of all moments, the stickers wobble and the camera drifts.
- **Long still holds are normal on the biggest videos:**
  - Salubrious Snail's 973k video holds a completely frozen frame for 37 s while the narration explains it, and has 11 holds of 10 s or more.
  - A 3/3 Elk video (104k) holds one flowchart box for 72 s.
  - The Trinket Mage (590k) is still 96 % of the time.
- **The fastest channel still stops.** Really Bad At MTG changes the picture every 2.4 s, but it's still about half the time, and its mascot moves only 2–7 % of the time.
- **Pace doesn't separate hits from flops.** Each channel's low-view videos are paced like its hits, so the topic and packaging matter far more than the edit rate.
- **How they explain a card:** put it up, let it sit, and change one small thing (a highlight, dimming the rest, an outline) when the narration moves on.
- **Kurzgesagt (16.6M) is the one always-moving style,** 3 to 6 things at once. But there the motion *is* the explanation, not decoration on a still layout. 3Blue1Brown (14.3M) moves one thing at a time.

## What the attention research says

- **Decorative motion adds about nothing.** Animation that *shows the idea* helps learning; animation for its own sake doesn't (Höffler & Leutner 2007; Sundararajan & Adesope 2020).
- **Off-topic flash costs viewers' understanding.** Interesting but irrelevant extras lower recall ("seductive details": Rey 2012; Sundararajan & Adesope 2020).
- **Highlighting and dimming help** ("signaling": Schneider et al. 2018; Alpizar et al. 2020).
- **Any new motion grabs the eye automatically** (Abrams & Christ 2003). So every movement should land on what's being said at that moment, or it pulls attention away from the narration.
- **Very fast cutting can overload.**
  - Editing pace raises arousal, but past a point it lowers memory, including memory of the audio (Lang 2000 and follow-ups).
  - One small study found that cuts every 1.5–2 s lowered recall (Collier, Ohio State master's thesis). Treat that as a direction, not a number.
- **Explainer video studies** favour short videos and a speaker who points at the material (Guo, Kim & Rubin 2014; Davis 2018). For Wil, that means pointing at the card is worth more than idle movement.
- **Film shot lengths** have shortened over decades (Cutting et al. 2011), but that's about narrative film, not explainers.
- **YouTube sets no cut rate.** Its retention help page says to look for dips at specific moments ("key moments") and fix those.

## Our rule (replaces "a new visual beat every 2–4 s")

1. **Beats follow the narration, not the clock.**
   - Typical spacing is 3–6 s, and each beat shows what's being said at that moment.
   - Jokes and payoffs can cut fast (1–2 s).
2. **Still is allowed.**
   - A layout may sit still for up to about 15 s while it's being explained. Past that, add one small on-topic beat: a highlight, a label, a count.
   - Never go more than about 30 s without any change.
3. **A new layout when the idea changes,** usually every 8–20 s. No hard cuts closer than about 3 s apart during explanations.
4. **One thing moves at a time.**
   - Entrances take 0.4 s or less, then stop.
   - No idle motion on cards, stickers, labels or the background: no wobble, no slow camera drift, no decorative showers.
   - Aim for at least 60 % still time, not counting Wil.
5. **Wil holds a still pose.**
   - A blink or a small shift every 4–8 s, and his mouth when he talks.
   - He moves on purpose: pointing at the card, a reaction to a joke or a payoff.
   - About 2–3 reactions a minute, not 6.
6. **At most about 2 lines of display text on screen** at a time, besides quoted card text.
7. **Fireworks are for payoffs only.** Screen shake, confetti, starbursts and punch-ins: about one a minute, on the biggest moments. That budget is judgement, not a measured number.

This loosens RETENTION.md's old "no frame held for more than about 2 seconds". RETENTION.md now points here.
