# What makes YouTube videos and channels perform (general, as of Sep 2026)

Researched 26 Sep 2026 for Wild Card Commander. The scope is all of YouTube, not just MTG. It was written after reading `RETENTION.md` and `WORKFLOW.md`, and it focuses on what is **new**, what **refines** those files, and what **contradicts** them.

**Source key:**
- **[P]**: primary YouTube source (Help Center, YouTube Blog, Creator Insider / Liaison).
- **[P2]**: secondary report of a primary statement.
- **[R]**: peer-reviewed research.
- **[3P]**: third-party creator-education data or opinion.
- **⚠ OLD**: older than 2024.
- **⚠ UNVERIFIED**: not confirmed against a primary source.

Numbered sources with URLs and dates are at the end.

**What we applied, and when, is in [APPLIED.md](APPLIED.md).**

---

## Executive summary

1. **The monetisation bar doubles on 1 Feb 2027.** From that date, new YPP applicants need 1,000 subscribers plus **8,000 watch hours in 365 days, or 20M Shorts views in 90 days** [3][4]. Shorts revenue will also need 10M Shorts views per 90 days. This favours long-form watch time over Shorts views, and argues for slightly longer videos (8 min or more also unlocks mid-rolls [37]). I found no primary source on grandfathering for applications pending at the cutoff.
2. **YouTube ranks on satisfaction, not a single metric.** Recommendations are "pulled" for each viewer. YouTube weighs appeal, engagement and satisfaction (surveys, likes/dislikes, whether viewers come back) [5][6][7][8]. Beaupré (Sep 2026): subscribers click only about 10% of uploads in their feed, and the subscribe action "isn't as strong as a lot of people think" [8]. The first hour is not make-or-break, and YouTube reserves homepage slots for new channels [8][9].
3. **"AI slop" is policed through viewers as well as policy.** The July 2025 "inauthentic content" rule demonetises templated, mass-produced AI content [1][2]. If YouTube "cannot clearly tell that you made the content", monetisation can be removed **channel-wide** [1]. Since March 2026, YouTube has been testing "Did this feel like AI slop?" surveys [20]. An AI narrator is allowed; a video that *feels* templated is the real risk.
4. **Disclosure is not required for us, but the audio carries watermarks.** An animated mascot with a generic (not cloned) synthetic voice needs no "altered or synthetic" disclosure [10][11]. Gemini 3.8 TTS audio carries a **SynthID watermark** [22]. YouTube's automatic labels target *photorealistic* visuals, and YouTube says labels don't change recommendations or monetisation [21][23].
5. **YouTube's A/B tests pick winners on watch time, not CTR.** Test & Compare covers **titles** as well as thumbnails (Dec 2025) and chooses by **watch-time share** [12][13]. *Dynamic thumbnails* (Sep 2026) serve the best of three per audience segment. Video "cut" A/B testing (up to three hooks) was announced on 23 Sep 2026 [14][15].
6. **Packaging data points short.** 1of10 (300k 2025 outlier videos) [16][17]: titles of about 5 words or ≤30 characters did best; thumbnail text under 10 characters (under 7% of the image) did best; bright thumbnails did best; faces made no overall difference. Peer-reviewed work (16k videos): strong emotion in thumbnails raises views, while question-style clickbait titles lower them [18].
7. **The TV is now the #1 YouTube screen in the US** (Feb 2025) [24], and TV viewers "want longer videos" [8]. Design for the 3-metre view and the phone at once: large type, few words, high contrast.
8. **Learning research supports the white-paper, no-music style**, with caveats: background music *and* environmental sounds hurt learning [28]; on-screen text should be short keywords, not repeated narration [27]; an on-screen character that **looks and gestures at** the content improves learning [30][31].
9. **Shorts cannot hurt long-form** (YouTube Help) [25]. Since 31 Mar 2025, Shorts count a view on every start or replay, while YPP counts only "engaged views" [26]. Shorts can now be grouped into **seasons and episodes** [14] and can link one long-form "related video" [36].
10. **Upload myths that are officially dead:** tags are "not important" (they only correct misspellings); publish time has no known long-term effect; upload frequency is "not correlated" with growth in views per upload [19].

---

## 1. How recommendations work now

- **Pull, not push.** "When you open the homepage, YouTube is going to say hey Rene is here, we need to give Rene the best content that is going to make Rene happy today." (Beaupré, Jan 2025 [5]). Time of day and device are ranking signals. Weights differ by context: time watched matters more on TV, likes/dislikes more on mobile (Sep 2026 [8]).
- **Official evaluation** [6][7]: *appeal* (chose to watch vs ignored / "not interested"), *engagement* (stuck around), *satisfaction* (enjoyed it). Signals include "viewing behavior, likes, dislikes, subscriptions, and feedback, including from satisfaction surveys". "No metric on its own is a good indicator of value." [8][9]
- **Satisfaction surveys** affect how a video and similar videos are recommended [5]. A 2026 test survey asks "Did this feel like AI slop?" on a 5-point scale [20].
- **Subscribers are a weak lever:** about 10% or less CTR in the subscriptions row; the top place subscribers watch a channel's videos is the **suggested list** [8].
- **New channels and videos:** first-hour tests already reach non-viewers; the system learns per audience. For new channels YouTube uses topic-fit signals and reserves "a slot or two" on home for newer channels (Sep 2026 interview via [9]; ⚠ wording unverified). Videos can find an audience "in six months" [5]. A video is re-recommended to the same viewer at most about 8 times [8].
- **"First-hour velocity" is a myth** [8][9].
- **Upload frequency:** "growth in views across uploads is not correlated with time between uploads" [19]. (vidIQ correlational counterpoint [40].) YPP maintenance from Feb 2027: 1,000 hours/365 d, or 1M Shorts views/90 d, **or 2 long-form or 5 Shorts per 90 days** [4].
- **CTR is contextual:** half of channels sit between 2% and 10% [32]; CTR naturally **falls as impressions grow** (9% at 10k vs 3.5% at 100k is successful expansion) [33].
- **Viewer segments** since July 2025: new, casual (1–5 of last 12 months), regular (6+) [34].
- **TV:** "People are watching on television and they want longer videos." [8]

**For us:** optimise for "was this worth my time?" (deliver the promise fast, real payoff, no padding). Subscribers are a bonus, not the engine. Judge a video at 28 days, not 48 hours (the 48 h Intro check stays for diagnosis).

---

## 2. Packaging

- **Test & Compare:** up to 3 titles, 3 thumbnails or 3 combos; winner = highest watch time; tests finish within 2 weeks; desktop Studio only; not for Shorts/Premieres/kids. **If any thumbnail is below 1280×720, all variants drop to 480p** [12]. Title testing rolled out globally Dec 2025 [13]. Ritchie: it "returns watch time… because watch time includes both" CTR and AVP [17].
- **New tools (Sep 2026)** [14][15]: dynamic thumbnails (live), channel-style thumbnail generation, **Ask Studio draft feedback** on unpublished videos, video A/B testing of up to 3 cuts (Shorts from 2027). The Inspiration tab is being retired [41].
- **Thumbnail limits:** 50 MB, 4K (3840×2160) supported (early 2026) [42].
- **1of10 data (300k+ 2025 outliers)** [16] (3P, correlational): titles of 5 words best, decline after 6; **≤30 characters ≈ +60% views**; ~70 characters worst; conversational +20%; **numbers ≈ −11%**; **negative framing ≈ +22%**. Thumbnails: text-bearing averaged −19%; best with **<10 characters covering <7%**; brightness 100–110 peaked; cyan +36%, green and yellow/orange strong. Faces: no overall effect; only mattered for 200k+ channels [17]. Length: views peak at 18–24 min (for videos under 30 min).
- **ViewsKit (61,838 videos):** titles ≤30 characters earn ~2× the median views of 80–100-character titles; stacking ALL-CAPS, digits and power words costs 7–12% [43].
- **Peer-reviewed (J. Business Research 2024, 16,215 videos)** [18]: strong thumbnail emotion raises views; positive title sentiment raises clicks; **question-bait titles get fewer views** (⚠ abstract only).
- **Consistency:** Galloway: "familiar but unexpected", 80% core / 20% experiments, ride formats until they stop working [39]. Beaupré: "Same audience? Same channel. Different audience? Different channel." [44]
- **MrBeast handbook:** every video starts with the title and thumbnail; the first minute must validate them [38].

**For us:** keep verdict / negative framing; numbers optional. Thumbnail headline ≤10 characters where possible. Render thumbnails at 3840×2160 (never below 1280×720). On the white light-mode feed, add a saturated block or thick outline so the thumbnail's edge reads. Wil's big emotional face substitutes for a human face.

---

## 3. Retention and editing

- **Hooks:** the first seconds decide [6]; "the first act has to be a reward" (Ritchie, ⚠ 2023) [45]; MrBeast: first minute validates the thumbnail, a "re-engagement" around minute 3 [38].
- **Retention graph** [46]: Intro = % still watching at 30 s (if low: fix title/thumbnail match first); **spikes** = rewatched (in a rules video, possibly *confusion*); dips = skipped/left; compare against "typical retention" for your last 10 similar videos.
- **Benchmarks** (⚠ UNVERIFIED): 50–60% AVP "strong" for 5–10 min [47].
- **Visual density:** Kurzgesagt ~200 unique assets per 10 min (one every ~3 s), storyboards and visual metaphors first [48].
- **Build visuals progressively:** Khan-style drawing held attention better than slides (6.9M edX sessions; ⚠ 2014) [29].
- **On-screen text:** verbatim narration on screen hurts learning (redundancy principle); **short keyword text helps**, as do highlights and arrows (signaling principle) [27]; arrows/annotations pull attention [31].
- **Legibility:** body text 40–60 px at 1080p, titles ~50% larger; **≤30 characters per line, ≤3 lines**; ~1 s per 13 characters [49]; text height 1/20–1/10 of the frame, floor ~44 px [50].
- **Devices:** US TV passed mobile for watch time in 2025 [24].
- **Sound:** background music and added sounds reduced learning (⚠ 2000) [28]; top explainers still use tightly timed SFX for rhythm and comedy [48][51]. SFX should be sparse and tied to one visual event.
- **Loudness:** YouTube turns content louder than about −14 LUFS down; speech −14 to −16 LUFS, true peak ≤ −1 dBTP [52].
- **Chapters:** 00:00 first, ≥3, each ≥10 s [53].
- **End screens:** video ≥25 s; last 5–20 s; up to 4 elements; not shown on mobile web [54]. **Cards:** up to 5; now "only viewable on computers" [55].

**For us:** slow ruling / CR-citation lines to ~150–170 wpm with a 0.5–1 s pause after each ruling (my synthesis). Treat a spike on a rules section as confusion. Keep the bottom ~20% of the centre free of critical text (captions + progress bar). Body text ≥44 px (48 preferred), stickers/titles ≥64 px, ≤30 chars per line, ≤3 lines, ≤7 words per callout. Keywords, not transcripts. Aim for 8–12 min when the topic supports it; never pad.

---

## 4. AI voice and faceless channels: policy

- **Inauthentic content** (renamed 15 Jul 2025) [1]: not monetisable: "repetitive or mass-produced", "templated storylines", "AI-generated content made with generic or unoriginal templates…". Allowed: "Same intro and outro for your videos, but the bulk of your content is different".
- **Reused content** [1]: not allowed: content that "exclusively features readings of other materials you did not originally create"; slideshows or scrolling text with minimal narrative. **Review is channel-level.**
- **Liaison (Jul 2025)** [2]: "channels that use AI in their content remain eligible for monetization"; targets are "narrative stories with only superficial differences" and "slideshows with identical narration".
- **Enforcement:** fake-trailer channels terminated Dec 2025; 16 channels (35M subs) Jan 2026; some human-made faceless channels report collateral demonetisation [56][57] (⚠ unverified details). 2026 CEO letter: extending spam/clickbait systems to "low quality, repetitive content" [58].
- **Disclosure** [10][11]: required for *realistic* content (realistic people incl. a real person's synthetic voice; altered real events; realistic fake scenes). **Not required** for "clearly unrealistic content, such as animation", production help, or cloning your own voice. Animated content that is labelled gets the label in the expanded description.
- **Auto-labelling** (May 2026) [21][23]: photorealistic AI detected via C2PA/SynthID; labels don't "change how a video is recommended or whether it's eligible to earn money".
- **Our voice:** Gemini 3.8 Flash TTS embeds SynthID (and reportedly C2PA) [22].
- **YPP** [3][4]: now 1k subs + 4k hours/12 months or 10M Shorts views/90 d; **from 1 Feb 2027 for new applicants 8k hours/365 d or 20M Shorts views/90 d**; existing partners must stay active. Hype needs YPP and 500–500k subs [60].

| Monetisable signals | Demonetisation signals |
|---|---|
| Original script with a point of view | Script reads source text verbatim |
| Bespoke visuals per episode | Same scene template, card names swapped |
| A character that *acts* on the content | Static image or slideshow with narration |
| Visible human editorial choices (sources, replies, corrections) | High-volume near-identical Shorts |
| Same intro/outro only; bulk differs | Identical narration structure across videos |

**For us:** every episode needs ≥1 bespoke set piece; the Shorts series must not be a fill-in template; never let card-text reading be the bulk of a segment; publish human-authorship signals (About text, sourced descriptions, pinned citation comment, real replies); disclosure = **No**; never clone a real voice.

---

## 5. Metadata

- **Tags:** "Not important… primarily used to help correct for common spelling mistakes." [19]
- **Hashtags:** up to 3 show by the title; >60 means all ignored [61]. Use 2–3.
- **Descriptions:** the first lines (before "more") should describe the video in searchable words [62].
- **Captions:** no official statement that they help ranking (⚠ [63]); useful for accessibility, sound-off, auto-translate and **auto-dubbing**.
- **Auto-dubbing** open to all creators (4 Feb 2026), 27 languages [64]; creators dubbing ≥80% of watch time "tend to have more success" [5]. MTG risk: card names have official translations; **review dubs**; start with Spanish and Portuguese.
- **Publish time** "is not known to impact a video's long-term performance" [19].
- Check upload defaults such as "allow automatic concepts" [65].

---

## 6. Shorts

- Up to 3 minutes (since Oct 2024) [66]; third-party data peaks at **50–60 s** [67].
- Ranking: "% of viewers who chose to view, avg. view duration and avg. % viewed"; "no minimum posting cadence" [25].
- "Shorts… can't hurt your Video performance." [25] Recommendations consider recent long-form from channels viewed in Shorts [44].
- Every start/replay counts as a view since Mar 2025; YPP counts **engaged views** [26].
- One **related video** link per Short to your own long-form [36].
- Custom Shorts thumbnails (Jul 2026, YPP, ~3:2 crops, no A/B) [35].
- **Series:** seasons and episodes (Sep 2026) [14].
- Safe zone for 1080×1920: critical text inside the central ~900×1160; clear ~240–380 px top, ~380 px bottom, ~120–200 px right, ~60 px left [68].

**For us:** 45–60 s; related-video link on every Short; publish RULES QUESTION as a Shorts series; judge by engaged views and viewed-vs-swiped.

---

## 7. Community

- **Posts:** polls, quizzes, images; can reach Home and Subscriptions; image posts can appear in the Shorts feed [69].
- **Hype:** YPP, 500–500k subs, long-form, within 7 days [60].
- **Replies/hearts/pins:** no primary statement that they boost ranking (⚠ [70]); treat as community-building.
- Ritchie: "The algorithm follows the audience, so please the audience." [71]

**For us:** a quiz post before each episode; a pinned comment with CR citations; human replies in the first week.

---

## 8. Animated and explainer channels

- **Kurzgesagt:** script first; storyboard the whole video with a visual metaphor per concept; ~200 assets per 10 min; bespoke sound; recurring characters [48].
- **TED-Ed:** visual metaphors; ~130 wpm cited by secondary guides (⚠ unverified) [72].
- **OverSimplified:** minimal characters with clear emotion; bait-and-switch gags; SFX timed to the frame [51].
- **Wendover:** research-heavy narration, maps and diagrams [73].
- **Research:** pedagogical agents have a small positive effect (43 studies, ⚠ 2013) [30]; agents with human-like **gesture, expression and gaze** improve transfer, **but only with a human-sounding voice** (⚠ 2012) [30b]; instructor gaze toward content improves learning, **g = 0.33** (2023 meta-analyses) [31].

**For us:** Wil looks or points at each new card or callout within ~0.3 s; add a storyboard / visual-metaphor pass; OverSimplified-style SFX (one hit per gag) fits the no-music rule.

---

## Prioritised checklist (as delivered)

Tags: **[NEW]** not in RETENTION/WORKFLOW; **[REFINES]**; **[CONTRADICTS]**; **[ALREADY]**.

### P0: before the next upload
1. **[NEW]** Anti-"inauthentic" check per episode (≥1 bespoke set piece, ≥1 opinion beat, card text never the bulk, varied Shorts).
2. **[NEW]** Disclosure = No; record reasoning in PERMISSIONS.md; never clone a real voice.
3. **[NEW]** Human-authorship signals (About text, sources in descriptions, pinned citation comment).
4. **[REFINES]** Thumbnails at 3840×2160, <50 MB; never below 1280×720.
5. **[REFINES]** Thumbnail text ≤10 characters, ≤7% of the image; one strong emotion; bright; saturated block or thick outline for the light feed.
6. **[REFINES]** Titles ≤50 chars (ideally ≤30), ~5 words; verdict/negative framing ok; numbers optional; no question-bait.
7. **[NEW]** Test & Compare on every long-form (3 title+thumbnail combos); record outcomes.
8. **[REFINES]** Text ≥44 px body (48 target), ≥64 px stickers/titles; ≤30 chars/line, ≤3 lines, ≤7 words per callout; add a check to qa_layout.
9. **[NEW]** Caption-safe zone: no critical text in the bottom 20% of the centre.
10. **[REFINES]** End screen 15–20 s, 4 empty zones, nothing important underneath; "Best for viewer" + Subscribe once a second video exists.

### P1: next 2–4 episodes
11. **[CONTRADICTS]** Rules payoff lines at ~150–170 wpm with a 0.5–1 s pause after each ruling.
12. **[NEW]** Wil gaze/gesture toward each new card or callout within ~0.3 s (audit warning if none within 1 s).
13. **[REFINES]** Keywords, not transcripts, on screen (card/rules quotes excepted).
14. **[NEW]** Storyboard / metaphor pass; one visual gag per ~60 s.
15. **[REFINES]** SFX: at most ~1 per 5–10 s, on stamps/slams/reveals, never under key words.
16. **[ALREADY/REFINES]** −15 LUFS fine; add true peak ≤ −1 dBTP; check "content loudness" after upload.
17. **[CONTRADICTS]** Aim for 8–12 min when the topic supports it; 6–7 min for thin topics; never pad.
18. **[NEW]** Upload unlisted and run Ask Studio draft feedback before publishing.

### P2: channel operations
19. **[NEW]** Shorts: 45–60 s, related-video link, Shorts series, safe zone, custom thumbnails once in YPP.
20. **[REFINES]** Judge Shorts on engaged views and viewed-vs-swiped.
21. **[NEW]** Metadata: 2–3 hashtags; tags only for misspellings; first two description lines state the combo and ruling.
22. **[NEW]** Auto-dub Spanish and Portuguese after reviewing card names; translated titles/descriptions; keep uploading the SRT.
23. **[NEW]** Community: quiz post, pinned citation comment, first-week replies; ignore first-hour velocity.
24. **[REFINES]** Analytics cadence: 48 h (Intro, subscribe dip), 7 d (Test & Compare), 28 d (typical retention, rules-section spikes, CTR by source, regular vs casual viewers).
25. **[NEW]** YPP timeline: long-form watch hours are the priority; apply before 31 Jan 2027 if 1k subs + 4k hours come within reach.
26. **[ALREADY]** Hook-first, title/thumbnail/hook match, 2–4 s beats, open loops, one subscribe beat, chapters, no burned-in captions, SRT upload.

---

## Sources

Dates are publication or last-update dates where shown; "n.d." pages were accessed 26 Sep 2026.

1. YouTube Help, *YouTube channel monetization policies* (inauthentic and reused content; 15 Jul 2025). https://support.google.com/youtube/answer/1311392 [P]
2. Social Media Today, *YouTube Clarifies Changes to Monetization Rules Around Inauthentic Content*, 13 Jul 2025. https://www.socialmediatoday.com/news/youtube-clarifies-monetization-update-inauthentic-repeated-content/752892/ [P2]
3. YouTube Blog, *New opportunities to earn and changes to the YouTube Partner Program*, 10 Aug 2026. https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/ [P]
4. YouTube Help, *Changes to the YouTube Partner Program*, 2026. https://support.google.com/youtube/answer/12843009 ; *YPP overview*, https://support.google.com/youtube/answer/72851 [P]
5. Search Engine Journal, *How YouTube's Recommendation System Works In 2025*, 27 Jan 2025. https://www.searchenginejournal.com/how-youtubes-recommendation-system-works-in-2025/538379/ [P2]
6. YouTube Help, *Understand your content performance for YouTube's recommendation system*. https://support.google.com/youtube/answer/16559650 [P]
7. YouTube, *How YouTube Works: Recommendations*. https://www.youtube.com/howyoutubeworks/product-features/recommendations/ [P]
8. PPC Land, *Subscribers skip 90% of uploads in their feed, YouTube director says*, Sep 2026 (Creator Insider, 1 Sep 2026, https://www.youtube.com/watch?v=rHLjxrbXmmY). https://ppc.land/subscribers-skip-90-of-uploads-in-their-feed-youtube-director-says/ [P2]
9. KDCC, *YouTube's Growth Director Just Debunked 6 Algorithm Myths*, 4 Sep 2026. https://blog.kdcc.social/youtubes-growth-director-just-debunked-6-algorithm-myths/ [P2]
10. YouTube Help, *Disclosing use of altered or synthetic content*. https://support.google.com/youtube/answer/14328491 [P]
11. YouTube Blog, *How we're helping creators disclose altered or synthetic content*, 18 Mar 2024. https://blog.youtube/news-and-events/disclosing-ai-generated-content/ [P]
12. YouTube Help, *A/B testing: Test & Compare*. https://support.google.com/youtube/answer/13861714 [P]
13. Search Engine Journal, *YouTube Title A/B Testing Rolls Out Globally*, Dec 2025. https://www.searchenginejournal.com/youtube-title-a-b-testing-rolls-out-globally-to-creators/562571/ [P2]
14. YouTube Blog, *Made On YouTube 2026: All Announcements*, 23 Sep 2026. https://blog.youtube/news-and-events/innovation-youtube-era-made-on-viewers-creators/ [P]
15. TechCrunch, 23 Sep 2026. https://techcrunch.com/2026/09/23/youtube-adds-new-creator-tools-like-video-a-b-testing-dynamic-thumbnails-and-live-dubbing/ ; Shelly Palmer, 24 Sep 2026. https://shellypalmer.com/2026/09/youtube-will-pick-your-thumbnail/ [P2]
16. 1of10, *What actually makes a YouTube video go viral*, Feb 2026. https://1of10.com/blog/what-actually-makes-a-youtube-video-go-viral-in-2025/ [3P]
17. Search Engine Journal, *Do Faces Help YouTube Thumbnails?*, 22 Dec 2025. https://www.searchenginejournal.com/do-faces-help-youtube-thumbnails-heres-what-the-data-says/563944/ [3P]
18. *Clicks for money…*, Journal of Business Research, 2024. https://www.sciencedirect.com/science/article/abs/pii/S0148296324003539 [R ⚠ abstract only]
19. YouTube Help, *YouTube performance FAQ & troubleshooting*. https://support.google.com/youtube/answer/141805 [P]
20. gHacks, 23 Mar 2026. https://www.ghacks.net/2026/03/23/youtube-is-testing-pop-up-surveys-asking-users-to-rate-videos-as-ai-slop/ ; Digital Trends. https://www.digitaltrends.com/movies/youtube-is-now-asking-viewers-if-videos-feel-like-ai-slop/ [P2]
21. TubeBuddy, *YouTube marking AI video*, May 2026. https://www.tubebuddy.com/blog/youtube-ai-labeling-update-2026/ [3P]
22. Google Blog, *Gemini 3.8 Flash TTS and Flash-Lite TTS*, 23 Sep 2026. https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-text-to-speech/ ; MarkTechPost. https://www.marktechpost.com/2026/09/23/google-releases-gemini-3-8-flash-tts-and-flash-lite-tts-with-prompt-based-voice-design/ [P / 3P ⚠ C2PA detail secondary]
23. Futurism, 28 May 2026. https://futurism.com/artificial-intelligence/youtube-scanning-labeling-ai-slop [P2]
24. Deadline, Feb 2025. https://deadline.com/2025/02/youtube-viewership-tv-screens-exceeds-mobile-for-first-time-in-u-s-1236284781/ [P2]; 24b. Señal News (⚠). https://senalnews.com/en/data/usa-youtube-surpasses-45-billion-viewing-hours-in-h1-2025-as-tv-usage-overtakes-mobile ; Nielsen Gauge May 2026. https://www.nielsen.com/news-center/2026/streaming-embarks-on-annual-summer-ascent-in-nielsens-may-2026-gauge-reports/
25. YouTube Help, *Search & discovery tips – Shorts*. https://support.google.com/youtube/answer/11914225 [P]
26. Sprout Social, Mar 2025. https://support.sproutsocial.com/hc/en-us/articles/35874991211533 ; vidIQ. https://vidiq.com/blog/post/youtube-view-count-update/ [P2]
27. Frontiers in Psychology, *Two types of redundancy in multimedia learning*, 2023. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1148035/full [R]
28. Moreno & Mayer, *A coherence effect in multimedia learning*, 2000. https://tecfa.unige.ch/tecfa/teaching/methodo/Moreno_Mayer00.pdf [R ⚠ OLD]
29. Guo, Kim & Rubin, ACM L@S 2014. https://dl.acm.org/doi/10.1145/2556325.2566239 [R ⚠ OLD]
30. Schroeder, Adesope & Gilbert, 2013. https://journals.sagepub.com/doi/10.2190/EC.49.1.a [R ⚠ OLD]; 30b. Mayer & DaPra, 2012. https://www.ncbi.nlm.nih.gov/pubmed/22642688 [R ⚠ OLD]
31. *Effect of the Instructor's Eye Gaze…*, Educational Psychology Review, 2023. https://link.springer.com/article/10.1007/s10648-023-09820-7 ; Computers in Human Behavior 2020. https://www.sciencedirect.com/science/article/abs/pii/S0747563220300352 [R]
32. YouTube Help, *Impressions & click-through rate FAQs*. https://support.google.com/youtube/answer/7628154 [P]
33. YouTube Help, *Decoding CTR & impressions*. https://support.google.com/youtube/answer/16767369 [P]
34. YouTube Help, *Understand new, casual, & regular viewers*, Jul 2025. https://support.google.com/youtube/answer/10246996 [P]
35. PPC Land, 25 Jul 2026. https://ppc.land/youtube-ends-2-year-wait-for-shorts-thumbnails-but-blocks-a-b-testing/ [P2]
36. YouTube Help, *Add a related video to your YouTube Shorts*. https://support.google.com/youtube/answer/14075157 [P]
37. YouTube Help, *Manage mid-roll ad breaks*. https://support.google.com/youtube/answer/6175006 [P]
38. *How to Succeed in MrBeast Production* (via Simon Willison), 15 Sep 2024. https://simonwillison.net/2024/Sep/15/how-to-succeed-in-mrbeast-production/ [3P]
39. Colin & Samir, *The New Rules of YouTube from Paddy Galloway* (⚠ undated). https://www.colinandsamir.com/resources/the-new-rules-of-youtube-from-paddy-galloway [3P]
40. vidIQ Research, 2026. https://vidiq.com/research/ [3P ⚠ snippet only]
41. YouTube Help, *Explore Inspiration tab*. https://support.google.com/youtube/answer/15575509 [P]
42. Android Headlines, Mar 2026. https://www.androidheadlines.com/2026/03/youtube-thumbnail-size-limit-50mb-tv-upgrade.html ; 9to5Google. https://9to5google.com/2025/10/30/youtube-video-thumbnail-file-size-limits/ [P2]
43. ViewsKit, *The YouTube Title Length Curve*, 2026. https://viewskit.com/blog/youtube-title-length-curve [3P]
44. CreatiCalc, 2026. https://creaticalc.com/blog/do-youtube-shorts-hurt-long-form [P2 ⚠ secondary]
45. Search Engine Journal, 14 Aug 2023. https://www.searchenginejournal.com/youtube-algorithm-insights-from-creator-liaison-renee-ritchie/493901/ [P2 ⚠ OLD]
46. YouTube Help, *Measure key moments for audience retention*. https://support.google.com/youtube/answer/9314415 [P]
47. vidIQ, *Average view duration*. https://vidiq.com/blog/post/average-view-duration/ ; Prepublish. https://prepublish.ai/blog/good-average-view-duration-youtube [3P ⚠]
48. 10 Studio, Kurzgesagt. https://10.studio/the-incredible-amount-of-work-behind-kurzgesagts-beautiful-animated-videos/ ; Epic Mountain. https://www.epic-mountain.com/ [3P ⚠ undated]
49. legibility.info, *Rules for text in videos*. https://legibility.info/rules-for-text-in-videos [3P ⚠ undated]
50. vSubtitle, 2026. https://vsubtitle.com/subtitle-font-size-and-reading-speed-2026/ [3P]
51. Async, *OverSimplified*. https://async.com/blog/who-is-oversimplified/ [3P ⚠ undated]
52. Youlean. https://youlean.co/how-to-edit-a-video-to-achieve-good-audio-loudness-on-youtube/ ; Frame.io. https://workflow.frame.io/guide/loudness-for-youtube [3P ⚠ no official spec]
53. YouTube Help, *Video chapters*. https://support.google.com/youtube/answer/9884579 [P]
54. YouTube Help, *Add end screens to videos*. https://support.google.com/youtube/answer/6388789 [P]
55. YouTube Help, *Add cards to videos*. https://support.google.com/youtube/answer/6140493 [P]
56. The Next Web, 15 Jun 2026. https://thenextweb.com/news/youtube-ai-slop-crackdown-faceless-creators-collateral-damage [3P ⚠]
57. Bottle Rocket, 2026. https://www.bottlerocketcontent.com/youtube-ai-slop-crackdown-faceless-creators-2026/ [3P]
58. YouTube Blog, *Neal Mohan's 2026 letter*, Jan 2026. https://blog.youtube/inside-youtube/the-future-of-youtube-2026/ ; CNBC. https://www.cnbc.com/2026/01/21/youtube-chief-says-managing-ai-slop-is-a-priority-for-2026-.html [P]
59. vidIQ, *YouTube Partner Program guide*, 2026. https://vidiq.com/blog/post/youtube-partner-program-guide/ [3P]
60. YouTube Help, *Hyping videos*. https://support.google.com/youtube/answer/15509925 [P]
61. YouTube Help, *Hashtags on YouTube*. https://support.google.com/youtube/answer/6390658 [P]
62. YouTube Help, *Tips for video descriptions*. https://support.google.com/youtube/answer/12948449 [P]
63. vidIQ, *Closed Captions*. https://vidiq.com/blog/post/closed-captions-rank-youtube/ [3P ⚠]
64. Social Media Today, 4 Feb 2026. https://www.socialmediatoday.com/news/youtube-expands-auto-dubbing-to-all-creators/811375/ ; YouTube Blog. https://blog.youtube/news-and-events/youtube-auto-dubbing-expressive-speech/ [P2/P]
65. Gyre, 2026. https://gyre.pro/blog/required-settings-you-must-do-before-uploading-a-youtube-video [3P]
66. YouTube Help, *Understand three-minute YouTube Shorts*. https://support.google.com/youtube/answer/15424877 [P]
67. Piktochart, 2026. https://piktochart.com/blog/how-long-youtube-shorts/ [3P]
68. Kreatli. https://kreatli.com/guides/youtube-shorts-safe-zone ; YouTubeToolkit. https://youtubetoolkit.com/blog/youtube-shorts-dimensions [3P]
69. YouTube Help, *Create posts on YouTube*. https://support.google.com/youtube/answer/9409631 [P]
70. CommentShark. https://www.commentshark.com/blog/do-youtube-comments-affect-the-algorithm [3P ⚠]
71. Tubefilter, 26 Aug 2024. https://www.tubefilter.com/2024/08/26/rene-ritchie-shorts-creator-faqs/ [P2]
72. TED-Ed, *Making a TED-Ed Lesson: Animation*. https://ed.ted.com/lessons/making-a-ted-ed-lesson-animation [3P ⚠]
73. Wikipedia, *Sam Denby*. https://en.wikipedia.org/wiki/Sam_Denby [3P]

### Gaps and caveats
- Beaupré's Sep 2026 "new-channel homepage slot" claim is reported by [9] only; watch the Creator Insider video in [8] to confirm.
- No primary YouTube source on thumbnail text size, reply effects, caption ranking, or the loudness target.
- All 1of10, vidIQ and ViewsKit figures are correlational across all niches. MTG-specific evidence in `research/*/FINDINGS.md` wins where it conflicts; settle conflicts with Test & Compare.
