# Keeping people watching

This combines two sources. The first is evidence from the three channels studied (`attack-on-cardboard/`, `salubrious-snail/`, `next-level-commander/`). The second is published retention guidance, including YouTube's own analytics help. Sources are linked at the bottom. Researched 24 Sep 2026.

Every video (long-form and Shorts) must pass the **checklist at the end** before upload.

## 1. The first 30 seconds decide the video

- YouTube's "Intro" metric is **the share of viewers still watching after 30 seconds**. The steepest drop in almost every retention curve happens here. Guides commonly cite a fall to 65–80% by second 30, and treat holding 70% or more as strong.
- **Plan the value claim for the first 15 seconds.** If the script hasn't said why to keep watching by then, viewers have no reason to stay.
- **Keep any intro under 5 seconds, or cut it.** No greeting, channel name, "it's that time again", or sponsor read before the hook.
- **Hook formats that work:**
  - **Question** (something the viewer is already wondering): "Can you lie to your opponents in Magic?" (590k)
  - **Bold claim:** "People are playing Azula wrong." (40k)
  - **Preview:** show the result from later in the video, such as the deck winning or the ruling on screen.
  - **Story with a named person** (Salubrious Snail and Next Level Commander): "Last spring a couple of friends of mine, Jack and Hans, were having a disagreement…" (971k)
- **The title and thumbnail promise must match the opening.** YouTube itself flags this as the first thing to check when the intro drops.
- **In the three channels, the flops opened** with a sponsor read, "it's that time again", "I want to preface this", "I need your help", or a general topic ("The year is 2025 and we're getting a lot of Magic cards").

## 2. Hold them through the middle

- **Open loops.** Promise something the viewer only gets later, and pay it off.
  - Next Level Commander ends every deck tech on the same rating card (explosiveness, resilience, complexity, budget, bracket), so viewers stay for the verdict.
  - Attack on Cardboard's "Did he cheat?" videos save the ruling for the end.
  - Use one small bridge before each segment: "…but that's not the weird part."
- **Change what's on screen every few seconds.** The Reddit collage film changed scene about every 5.5 seconds. Near-identical frames held for 2 seconds or more were its weak spots. Aim for:
  - a new visual beat (cut, zoom, card, drawing or caption) every 2–4 seconds;
  - a new scene every 5–10 seconds.
- **Keep the pace dense.** Script at 180–220 words per minute with no filler. Salubrious Snail averages about 205 and Next Level Commander about 220. Cut every sentence that doesn't move the argument.
- **Use the rule of three with a deflating punchline.** Three wrong answers, the third a joke, then the real answer. This pattern appeared in the strongest reference video.
- **Show what you say, when you say it.** Every card, number or rule narrated appears on screen at that moment. Cite rules on screen (for example CR 509.2).
- **Front-load the best material.** YouTube's own advice for flat stretches of the retention curve is to "move compelling content earlier", because the audience shrinks over the length of any video.
- **Add chapters** (timestamps in the description) for videos over 5 minutes, so skimmers jump rather than leave.
- **Make one mid-video comment prompt, tied to the content:** "Which of these three would you have ruled? Comment before I tell you." It's a separate beat from the subscribe ask, at least a minute away from it. Don't stack calls to action.

## 3. The subscribe segment: where and how

### What the three channels do

| Channel | Videos that ask for subscribers | Where the first ask falls (median) | Notes |
|---|---|---|---|
| Attack on Cardboard | 52 of 90 | **98%** (last seconds) | 49 of 52 asks come after 75% of the video. |
| Salubrious Snail | 8 of 79 | 96% | Almost never asks, yet has the best conversion (0.74 subscribers per 100 views). The content does the asking. |
| Next Level Commander | 52 of 71 | 98% | 8 asks come in the first 10%, including "Comment, subscribe" at 47 seconds in its 73k video. It also ran a subscribe-to-enter giveaway at 56%. |

Nearly all asks sit in the **last 2–4%** of the video, which only viewers who reach the end ever hear. On Attack on Cardboard, videos that ask had a higher median breakout multiple (1.29×) than those that never ask (0.97×). But later, bigger videos are also the ones more likely to include an ask, so treat that as correlation, not proof.

### The rule for our videos

1. **Ask once, early, and only after the first payoff.** The subscribe segment goes right after the viewer first gets something: the answer to the hook question, the first ruling, or the first "aha". That usually lands **25–40% into a long-form video**, never in the first 60 seconds and never in the last 10%. Published guidance says asking before you deliver on the promise makes viewers leave, and that a single well-placed prompt beats several awkward ones.
2. **Keep it to 5 seconds or less, over the narration.** Use the overlay in `studio/assets/subscribe-beat.webm`: the mascot presses SUBSCRIBE, it flips to SUBSCRIBED ✓ and the bell wiggles. It plays while the story keeps going. Never cut to a separate "please subscribe" scene.
3. **Give a reason tied to the channel's promise**, spoken in one line:
   - "I cover every rules change within 72 hours. Subscribe so the next one doesn't catch you out."
   - "Every new commander, built better than the EDHREC average. Subscribe for the next one."
4. **Go straight into an open loop:** "…and that's only the first mistake." This keeps the ask from becoming a drop-off point.
5. **End the video with a "watch next" end screen, not a second spoken ask.** Use the last 5–20 seconds to point to one related video. Sending viewers to another of your videos matters more than a second subscribe ask.
6. **Shorts get no spoken subscribe ask.** In the first 1–2 seconds, the only job is stopping the swipe. Let the ending loop back to the opening line. If you want a prompt at all, use a small on-screen text in the last second.
7. **Check it in YouTube Studio.** In the retention graph ("key moments"), look for a dip at the segment's timestamp. If more viewers leave there than in the surrounding seconds, shorten the line or move it after a stronger payoff.
8. **Check YouTube's contest policies** before copying Next Level Commander's subscribe-to-enter giveaway.

### Adding the overlay to a finished video

The subscribe overlay is a 4.5-second transparent WebM, 1920×1080. To place it at T seconds (for example T=95):

```
ffmpeg -i final.mp4 -c:v libvpx -i studio/assets/subscribe-beat.webm \
  -filter_complex "[1:v]setpts=PTS-STARTPTS+95/TB[sb];[0:v][sb]overlay=0:0:enable='between(t,95,99.5)'[v]" \
  -map "[v]" -map 0:a -c:a copy final_with_sub.mp4
```

`-c:v libvpx` before the overlay input is required, because ffmpeg's default VP8 decoder drops the transparency.

To change the line or button colour, edit the props and re-render from `video/`:

```
npx remotion render SubscribeBeat out/subscribe-beat.webm --codec=vp8 --image-format=png --pixel-format=yuva420p \
  --props='{"line":"Every new commander, built better.","accent":"#c8372d","background":null}'
```

The mascot is an original placeholder (a paper-cut card with a face). Swap it in `video/src/SubscribeBeat.tsx` once the channel mascot is final.

## 4. Shorts retention

- **The key metric is "Viewed vs. swiped away".** Published targets put first-3-second swipe-aways below about 25% for Shorts under 30 seconds and below about 35% for Shorts of 30–60 seconds.
- **The first frame has to stop the thumb:** movement, an unusual frame, or a contradiction. Start mid-action, with no greeting.
- **Make the loop useful.** Ending on a line that the opening answers rewards a second viewing.
- The "RULES QUESTION:" format (one card, one question on screen) was Attack on Cardboard's biggest reach engine: a 77k median, with a top Short of 1.08M.

## Pre-upload checklist

- [ ] The title, thumbnail and first sentence make the same promise.
- [ ] The stakes or claim are stated within 15 seconds, and the first word comes within about 0.3 seconds. No black frame, no greeting.
- [ ] A new visual beat every 2–4 seconds, with no frame held for more than about 2 seconds.
- [ ] At least one open loop, paid off later (a verdict, ruling or rating card at the end).
- [ ] Exactly one subscribe segment: after the first payoff, 25–40% in, 5 seconds or less, over the narration, with a reason and a loop out of it.
- [ ] One comment prompt tied to the content, at least a minute from the subscribe segment.
- [ ] A "watch next" end screen in the last 5–20 seconds, and no second spoken ask.
- [ ] Chapters in the description for videos over 5 minutes.
- [ ] Shorts: a thumb-stopping first frame, no spoken ask, and an ending that loops to the opening.
- [ ] After 48 hours, check the Intro percentage and any dip at the subscribe segment in YouTube Studio.

## Sources

- [Measure key moments for audience retention (YouTube Help)](https://support.google.com/youtube/answer/9314415?hl=en)
- [Audience retention: How to keep video viewers hooked (Backlinko)](https://backlinko.com/hub/youtube/retention)
- [Best Time to Ask for YouTube Subscriptions (Vizard)](https://vizard.ai/blog/best-time-to-ask-for-youtube-subscription)
- [YouTube Audience Retention 2026 (SocialRails)](https://socialrails.com/blog/youtube-audience-retention-complete-guide)
- [YouTube First 30 Seconds: The 3-Phase Opening Structure (Prepublish)](https://prepublish.ai/guides/first-30-seconds)
- [How to Hook Viewers in the First 30 Seconds (1of10)](https://1of10.com/blog/how-to-hook-viewers-in-the-first-30-seconds-of-a-youtube-video/)
- [YouTube Audience Retention Guide 2026 (Teleprompter.com)](https://www.teleprompter.com/blog/youtube-audience-retention)
- [YouTube Shorts Retention: What Is Good and How to Fix It (Prepublish)](https://prepublish.ai/guides/youtube-shorts-retention)
- [YouTube Shorts Retention Rate 2026 (Shortimize)](https://www.shortimize.com/blog/youtube-shorts-retention-rate)
