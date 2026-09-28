# Making Wil's narration motion flow

Researched 26 Sep 2026, after the owner said: "the eyebrows keep appearing and disappearing and he keeps motioning down, it looks janky… make a rule to not have his expressions change way too often if it doesn't make sense."

**What we built from this** is at the end (see *Applied*). The rules live in `video/scripts/wil_director.py`, and `qa_layout.py` enforces them.

## Summary

The jank came from four things:
- **Too many triggers.** Every loudness peak (about 1 per second) fired a nod, and every other peak an arm gesture. Real speakers put a large visible accent on roughly **one word per sentence**.
- **Loudness is the wrong driver.** Head motion follows **pitch** much more closely than loudness. Viewers rate pitch-driven head motion as natural, and jittery (high-frequency) head motion lowers naturalness ratings.
- **The brows switched instantly.** Real eyebrow raises are smooth rise-and-fall movements of about 300–600 ms. A binary up/none swap, plus a sine wave on top, has no human equivalent.
- **Every accent was the same downward dip.** Real head accents vary in direction and size, and (Richard Williams) the head accent is usually "anticipate down, then accent *up*".

The fix is three layers:
1. A slow **base layer**: posture, breathing and lean, low-pass filtered.
2. A sparse **accent layer**: a few chosen words, each with a smooth rise-hold-fall envelope, budgeted by priority and cooldowns.
3. An **attitude layer**: the face for the current thought. It changes only at thought boundaries or on a script cue, and holds for at least about 2 s.

Because Remotion renders offline, the scheduler can look ahead and start moves just *before* the sound.

## 1. How real speakers move (visual prosody)

### Eyebrows
- **They follow pitch accents, and only loosely.** Cavé et al. 1996 [pre-2015]: rapid rise-and-fall brow movements coincided with pitch rises in only 71% of cases. The authors say brows and pitch are "not automatically linked" and reflect communicative choice. [Frontiers review](https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2022.903015/full), [IEEE](https://ieeexplore.ieee.org/document/607235/)
- **Rate in newsreaders, Dutch** (Swerts & Krahmer 2010) [pre-2015]. [PDF](https://repository.tilburguniversity.edu/server/api/core/bitstreams/3ca0fc5c-6b05-4461-be39-5b979fe0f910/content)
  - Across 985 words there were 303 brow movements of any size.
  - Strong accents were about 7% of words, around 1.1 per 16-word sentence.
  - 70% of strong accents had a brow movement.
- **Rate in newsreaders, Swedish** (Ambrazaitis & House). [Lund PDF](https://lup.lub.lu.se/search/files/4039262/8570221.pdf), [2017](https://portal.research.lu.se/en/publications/multimodal-prominences-exploring-the-patterning-and-usage-of-foca/)
  - Clearly visible brow beats were only 6.8% of words.
  - They hit about 14% of focal-accent words and 3.6% of other words.
  - 60 of the 67 coincided with a head beat.
  - The authors call them an "intensification marker": contrast, value, magnitude, emotionally loaded words.
- **Timing.**
  - Raises start about 60 ms before the accented syllable, more than 80% within 330 ms of it (Flecha-García 2010 [pre-2015], via [Gast 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC9854528/)).
  - In interviews, raises are symmetric and about 300–600 ms wide, with onset about 270 ms before the peak (Gast 2023).
  - Synthesis envelopes: KTH used 100 ms rise, 200 ms hold, 200 ms fall, kept "subtle… distinctive although not too obvious" [pre-2015, [PDF](https://www.internationalphoneticassociation.org/icphs-proceedings/ICPhS1999/papers/p14_0655.pdf)]; Tilburg used 100/100/100 ms.
- **Misplacing them misleads.** Brows raise the perceived prominence of the accented word *and lower it for neighbouring words*, so a brow on the wrong word actively misleads (Krahmer & Swerts). [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0749596X07000708)
- **Ekman 1979, "About Brows"** [pre-2015]: brows act as conversational "batons" and "underliners" for particular words. (From secondary summaries only; the source is a scanned PDF.)

### Head
- **Graf, Cosatto, Strom & Huang 2002** [pre-2015], [PDF](https://www.cstr.ed.ac.uk/downloads/publications/2002/paper.vtts.pdf):
  - Prosodic nods span 2–4 phones (about 150–400 ms) and sit on pitch accents.
  - In short greetings, 42% of accents had a simple nod, 18% a nod with overshoot and 20% a one-way swing.
  - In read news, movements were "less pronounced".
  - "Amplitudes vary widely, yet their timing shows surprising consistency."
- **Direction varies.** Dutch newsreaders' head movements went 27% left, 14% right, 28% forward and 26% up.
- **Munhall et al. 2004** [pre-2015], [PDF](https://www.queensu.ca/psychology/sites/psycwww/files/uploaded_files/Faculty/Kevin%20Munhall/Munhall_Psyc_Sci.pdf):
  - Head motion explained about 63% of the variance in pitch but only about 32% of loudness.
  - Natural head motion helped intelligibility, and doubled motion scored worse.
- **Ma, Le & Deng, CHI 2011** [pre-2015] (abstract only): naturalness tracked pitch correlation, "not the RMS energy", and more high-frequency head motion lowered naturalness.
- **Hadar et al. 1983** [pre-2015]: fast head moves mark stress, and phrase boundaries show up as **stillness**.

### Blinks and gaze
- **Blink rate:** about 26 per minute in conversation, 17 at rest, 4.5 while reading (Bentivoglio 1997) [pre-2015].
- **Blink placement:** blinks cluster at pauses and sentence ends (Nakano & Kitazawa 2010) [pre-2015], and come with gaze or head shifts (Evinger 1994) [pre-2015].
- **Blink length:** blinks over about 400 ms read as a deliberate signal (Hömke 2018).
- **Gaze:** speakers look at the listener about 41% of the time, in glances of about 3 s (Argyle, via Frontiers 2025).

## 2. Animation craft

- **Richard Williams, *Animator's Survival Kit*, dialogue chapter** [pre-2015; OCR, so wording is approximate]:
  - "Just hit the main accents, select what's important."
  - Like a fast passage in music, "you don't have to machine-gun every note equally".
  - "We can only project one gesture at a time."
  - Accenting everything ("Mickey Mousing") "is considered corny".
  - "Most of the time the head accent is up: anticipate down, then accent up."
- **Rhubarb Lip Sync 1.3:** fitting every sound "resulted in jittery animation". Hitting only the important shapes looks "much cleaner… and more in-sync". [CHANGELOG](https://github.com/DanielSWolf/rhubarb-lip-sync/blob/master/CHANGELOG.md)
- **One thought, one expression** (*The Illusion of Life*, Thomas & Johnston) [pre-2015]:
  - Carry the same expression through the thought at "varying degrees of intensity", and change it only when the thought changes.
  - Hold a pose "at least eight, maybe as many as sixteen" frames (0.33–0.67 s) so it reads.
  - Keep holds alive ("moving holds": drift on toward a stronger pose), with motion smaller than the action around it.
  - A drawing can stay still for less than about 2 s, and a blink during a hold "recaptures the living quality".
- **Ham Luske's dialogue rules** (*Illusion of Life*) [pre-2015]:
  - Anticipate dialogue with head, body or gesture **3–4 frames before** the heavy modulation.
  - Show important shapes long enough to read.
  - At phrase ends, hold the last shape and soften it rather than snapping to neutral.
  - Eye accents lead by about 3 frames, and by 4–5 frames for strong ones.
- **Jay Jackson** (Animation Mentor): "If the head moves work with the dialogue, the expression on the face and the mouth shapes become less critical." [link](https://www.animationmentor.com/blog/some-tips-for-animating-dialogue/)
- **Avoid twinning:** mirrored or strictly alternating actions read as dead. Asymmetric brows read as thinking; symmetric ones read as surprise. [Animation Mentor](https://www.animationmentor.com/blog/twinning-and-why-you-should-usually-avoid-it/)

## 3. How procedural and real-time systems avoid jitter

| System | Mechanism | Takeaway for Wil |
|---|---|---|
| **BEAT** (Cassell et al., SIGGRAPH 2001) [pre-2015] [PDF](https://www.media.mit.edu/gnl/publications/siggraph2001.pdf) | Proposes every plausible behaviour, then filters. Beats and brow flashes go only on new-information words. Conflicts on one body part go to the higher priority, and a priority threshold drops the rest. | Over-generate candidates, then prune by priority and cooldown. |
| **Cerebella** (Marsella et al. 2013) [pre-2015] [PDF](http://www.ccs.neu.edu/home/marsella/publications/pdf/marsellasca13.pdf) | Stress = above the 90th percentile of both energy and pitch within the utterance. Drops behaviours "too close in time… to be realized smoothly". Chains nearby gestures without returning to rest. | Per-sentence prominence from pitch and energy. |
| **BML** | Sync points: start, ready, stroke, relax, end. | Align the *stroke* to the stressed syllable. |
| **Greta** [pre-2015] | Expressivity dials: activation, spatial extent, fluidity, power, repetition. | One "energy" dial. |
| **JALI** (2016) [PDF](https://dgp.toronto.edu/~elf/JALISIG16.pdf) | A viseme starts about 120 ms before its sound and decays over 120 ms; duplicates merge. | Lead the sound. |
| **Oculus Lipsync** | Smoothing default 70 of 100. | Heavy smoothing is the norm. |
| **VTube Studio** | Handoffs between parameter sources are "always faded smoothly… to prevent any ugly jumps". Expressions have fade times. | Never hard-switch. |
| **Live2D breath** | Idle sines with incommensurate periods (6.53, 3.53, 5.53, 15.53 s; breath 3.23 s). Blink interval random between 0 and 2× the mean. | Non-repeating idle, random blinks. |
| **Adobe Character Animator** | Pose-to-pose with a Minimum Pose Duration (defaults unverified; help pages returned 403). | A minimum dwell time is standard. |
| **1€ filter** (CHI 2012) [pre-2015] | A low-pass whose cutoff rises with speed. | Use it on continuous audio-driven channels. |

## 4. Recommended numbers (the researcher's synthesis; about 150–160 wpm narration)

- **Accents:** about 1 strong accent per sentence from per-sentence prominence (pitch + energy + duration), preferring new, contrastive, numeric or emotional words. About 8–12 per minute.
- **Head accent:**
  - 6–10 per minute, at least 1.2 s apart.
  - Shape: anticipate down 3–4 frames, stroke up or tilt, settle over 6–10 frames.
  - About 70% up or tilt and 30% down, amplitude 0.5–1.5× by prominence.
  - Lead the stressed vowel by 2–4 frames. Be still for 6–10 frames at sentence ends.
- **Brow flashes:**
  - Intensification words only, 4–8 per minute, at least 2.5 s apart.
  - Envelope: rise 4 frames, hold 4–8, fall 6–8 (about 400–600 ms total), peaking just before the syllable.
  - Never a discrete switch.
  - Sustained brow attitudes (question, doubt) hold at least 1.5–2 s and change only at phrase boundaries.
- **Arm gestures:**
  - At most 1 per sentence, 4–8 per minute, cooldown at least 2.5 s, on strong accents.
  - Phases: prep, stroke on the accent, hold, retract.
  - Choose the arm weighted-randomly, with no strict alternation and no identical gesture twice in a row.
- **Attitude changes:** dwell at least 2 s, only at sentence or clause boundaries or on a script cue. Cross-fade faces over 150–250 ms. Hide an unavoidable face swap under a blink or squash.
- **Canned reactions:**
  - About 1 per 30–60 s with at least 20 s between them. *This is the researcher's judgement call; no study measures it for cartoon narrators.*
  - Tie each to a script beat and prefer sentence ends.
  - Entry about 0.2–0.3 s, exit about 0.4–0.6 s (exits slower).
- **Blinks** (only when the eyes are visible): 12–20 per minute, randomised 1.5–6 s intervals, biased to pauses and head turns, about 200–260 ms long.
- **Glances:** 3–6 per minute, only when something new appears, each held at least 1 s.
- **Idle:** breathing on a 3.2–4.5 s cycle; sway from 2–3 sines with incommensurate periods, each ≤1–2 px or ≤1°. The lean toward the stage follows a low-passed "is talking" signal (0.5–1 s).

## 5. The expression budget, in priority order

1. **Accents come from meaning and pitch, not loudness peaks.**
2. **Nothing switches instantly; everything has an envelope.**
3. **Budget and cooldown per channel.** When two collide, keep the higher priority.
4. **Attitude dwell at least 2 s,** changed only at thought boundaries. Accents modulate the attitude; they don't replace it.
5. **Lead the sound** by 2–6 frames. The mouth stays on the sound.
6. **Vary form; never twin.**
7. **Holds are alive but quiet.** Break any still stretch near 2 s.
8. **Mark sentence ends** with a settle; put reactions there.
9. **Smaller is more natural.** Cap amplitudes.

**Confidence.**
- **Verified from primary PDFs:** Graf 2002, Swerts & Krahmer 2010, the Lund papers, Munhall 2004, the KTH and Tilburg envelopes, BEAT, Cerebella, JALI, Rhubarb, *Illusion of Life*, the *Survival Kit* OCR, Live2D and VTube Studio.
- **Unverified:** Ma 2011 (abstract only), Flecha-García (via Gast), Ekman (scan), the Character Animator defaults, veadotube, and the frame-count rules of thumb.
- **Judgement calls:** the reaction rate and exact cooldowns.

---

## Applied (ep002 v20, 26 Sep 2026)

See `video/scripts/wil_director.py` for the exact numbers; they are the channel's rules.

- **Accents:**
  - One candidate per sentence: the word with the highest prominence, scored as pitch (pYIN F0) plus loudness plus length, z-scored within the sentence and skipping function words.
  - Accepted in priority order under a budget and cooldown, with the stroke placed just before the stressed syllable.
  - Each accent is a varied head move: mostly a small anticipating dip and then a rise or tilt, sometimes a dip. The amplitude scales with prominence.
- **Brows:** rare flashes, only on intensification (question or exclamation sentences, or the most prominent accents). They ease up, hold briefly and ease down, and fade and lift rather than popping.
- **Gestures:** only on strong accents, with a cooldown. The arm is chosen pseudo-randomly, never three times in a row.
- **Canned reactions:** at least 2.5 s apart start to start, which the audit enforces. The v19 list was thinned from 38 to 33 by dropping the ones that flip-flopped (for example celebrate, then facepalm 1.9 s later). The owner asked for "lots of fun animations", so we kept many more than the researcher's 8–12 per video.
- **Base layer:** the lean follows a smoothed talking signal (no snapping between words); the idle sway uses incommensurate periods.
- **Glances:** at least 4 s apart (about 10 a minute in ep002, above the research's 3–6; they're subtle, but the next thing to trim if he still feels busy). The hold length is unchanged.
- **Also added:**
  - a reaction's brows linger and soften over 1.2 s;
  - brow gaps under 1.2 s are bridged by looking ahead in the render;
  - small accents fade out from 2 s before a reaction, and a planned raise that would start during that fade is skipped;
  - the audit's WIL FACE FLICKER check reads what the face actually shows in the render.
- **Result (ep002 v20):** 8.7 head accents, 5.0 brow raises and 4.0 gestures a minute; 0 audit problems.
