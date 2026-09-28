# How scripts should sound

Scripts, narration, Shorts, titles and on-screen text should sound like a real person talking to their playgroup: honest, genuine and conversational. They should never read like AI copy. Viewer loyalty on these channels comes from a real human voice, and polished, generic writing throws that away.

> ## HARD RULE: nothing ships that feels AI-made
>
> This applies to **every viewer-facing thing**: scripts, narration, Shorts, titles, descriptions, thumbnail text, on-screen text, pinned comments and community posts. Before anything is handed over or published, it must pass all three checks below, and the results must be reported to the channel owner.
>
> 1. **Automated check:** run `python studio/tools/check_script.py <file>`. There must be no rate problems, and every flagged tell must be fixed or explicitly justified. See "What makes content feel AI-made" below.
> 2. **Line-by-line read:** read every line against the tells list below. The checker misses shapes like tidy one-liner endings, sentences that read as written rather than spoken, and "X, not Y" framing, so a human-style read is required.
> 3. **Read-aloud pass:** read it out loud and change any word the channel owner wouldn't actually say. For AI narration, also run `studio/tools/check_voice.py` and listen for the voice tells below.
>
> Passing the numbers is necessary but **not sufficient**.

The targets below come from **~670,000 words of real speech**, the auto-captions of all three channels studied (`research/*/analysis/transcripts.json`). Use those transcripts as the reference for how people in this niche actually talk. Use them as a guide to rhythm and wording, not as material to copy.

## What the transcripts show (per 1,000 spoken words)

| Word or pattern | Attack on Cardboard | Salubrious Snail | Next Level Commander | **Target for our scripts** |
|---|---:|---:|---:|---|
| "I / me / my" | 12.5 | 29.2 | 23.3 | 15–35 (it's your opinion, so own it) |
| "you / your" | 23.7 | 13.6 | 20.9 | 15–30 |
| "we / us / our" | 16.4 | 3.4 | 35.5 | 10–35 ("so we've got this card…") |
| "honestly" | 0.1 | 0.3 | 0.4 | **≤ 0.5**, basically never |
| "actually" | 0.6 | 1.1 | 1.4 | ≤ 2 |
| "really" | 1.3 | 1.6 | 2.4 | ≤ 2.5 |
| "I think" | 1.1 | 1.7 | 3.0 | ≤ 3 |
| "kind of / sort of" | 0.2 | 2.5 | 1.8 | ≤ 3 |
| "So…" at the start of a sentence | 2.4 | 1.5 | 7.6 | 2–8 |
| "okay / alright" | 1.4 | 1.3 | 3.8 | 1–4 |
| Questions | 1.1 | 1.8 | 7.7 | 2–8 |
| "um / uh" | 2.3 | 3.1 | 3.4 | **0 in the script.** They come out naturally when you record. |

### Cadence and natural markers (measured from the transcripts)

| Measure | Next Level Commander | Salubrious Snail | **Target** |
|---|---:|---:|---|
| Median words per sentence | 7 | 14 | **6–10** (casual channel, closer to NLC) |
| Sentences of 6 words or fewer | 47% | 23% | **35–55%**: quick reactions like "Yeah. Himself." |
| Sentences of 25+ words | 5% | 25% | **≤8%** |

Natural markers these creators use, per 10,000 words: "kind of" 14–18, "I mean" 2–15, "right?" 1–14, "a bit" 8–13, "basically" 3–6, "wait" 1–6, "okay, so" 1–2.

Use them at about those rates. In a 1,000-word script, that's roughly one or two each, not in every paragraph. Common sentence openers in the transcripts: "This is", "I think", "I mean", "So we", "Yeah,", "We've got / we can", "All right", "Next up", "Okay so".

Overused by drafts compared with real speech: "which is" and "and that's" (real speech is about 4 per 10k).

**Informative but fun:** get the facts exactly right, cite rules, and put the numbers on screen. Then deliver them like you're explaining it at the table: short lines, a joke where it lands naturally ("Merry Christmas" when Dack hands out creatures, "Love that for you" when the Angel stops your win), and your real opinion. `check_script.py` measures cadence too.

### How to open a video (measured from the transcripts)

Next Level Commander, the closest match to this channel, uses the same structure in most videos. 61% introduce the host within the first minute, after a median of 4 words:

1. **Hook, 1–2 sentences, sensational but true:** "My group is being destroyed by this $50 deck and it's so stupid."
2. **Self-intro:** "Hello everyone, this is Jin with Next Level Commander…"
3. **"…and today we have / I present…"** plus what the video covers.

Attack on Cardboard's drama openers work for news-style videos ("You better believe it's that time again", "Reddit, Twitter, and Twitch chat are kicking up a storm, and I'm here to settle this once and for all").

**Our version:** hook, then "Hello everyone, this is Wil D. Card with Wild Card Commander", then "Today we're looking at…", then the promise (with one open loop). "This is [name] with [channel]" is Next Level Commander's own wording; the transcripts never use "I'm X, and this is Y". Keep the hook sensational, but only with claims that are true. An opinion ("Wizards messed up") is fine when it rests on a checkable fact and the video argues it. When something's unknown, frame it as a question.

**Sign-off:** end the narration with "Thanks for watching, and I'll see you in the next one." (or close to it), then the end screen. The transcripts do this: "thanks for watching" appears in 51/90 Attack on Cardboard and 49/90 Salubrious Snail videos, and "see you in the next one" in 57/90 Attack on Cardboard and 22/79 Next Level Commander videos. It's a sign-off, not a second subscribe ask.

**Spelling:** use US spelling in anything viewers read (on-screen text, descriptions, captions): color, favorite. The three channels and most of the audience are American.

**The biggest lesson:** a first draft that tries to sound casual overuses "honestly", "really" and "actually". One early draft of episode 001 used "honestly" 30 times more often than real creators do. Sprinkling casual words everywhere is itself an AI tell. Real casual speech comes from sentence shape, not filler words.

Common sentence openers in the transcripts: "So,", "I think", "And", "Yeah,", "Okay,", "Now,", "This is…", "I mean,", "Well,". Real creators point at what's on screen ("so this is the card…", "and here we've got…") and bring the viewer in with "we".

## Write like this

- **Use contractions** (it's, don't, you've) and uneven sentence lengths. Short ones are fine. Fragments are fine when you'd say them out loud.
- **Label opinions as opinions:** "for me", "my own rule, not anything official", "I'd bet".
- **Admit things:** mistakes you still make, what you're unsure about, when you were wrong.
- **Use real stories with real people**, with their permission, told the way you'd tell them at the table.
- **Point at the screen** ("this card here…") and talk to the viewer ("you've probably seen this", "we've all been there").
- **Keep your natural transitions:** "Okay, number three.", "Now,", "So what do we do about it?"
- **Read it aloud before recording.** Change every word you wouldn't actually say.

## Avoid these AI tells

- **Stock openers:** "Here's the uncomfortable truth", "Real talk", "Let's dive in", "In this video we will explore", "game-changer", "at the end of the day".
- **Neat rhetorical shapes:**
  - "It's not X, it's Y" and "Neither X. The Y is." pairs;
  - "Not just X. Everyone." lines;
  - stacked triplets, and snappy three-word fragments ("Clean, fast, no mercy.");
  - colon-then-reveal lines.
- **Aphorism endings:** a tidy closing line like "That's the point." or "And that changes everything."
- **Overclaiming:** "almost every good player", "the most powerful thing in Commander", "nobody talks about this".
- **Clickbait chapter names:** "Then this happened".
- **Stacked hedges or stacked fillers** in one sentence ("honestly it's really kind of actually…").

## Honesty rules

- **Never present an invented anecdote as real.** Scripts use `[PLACEHOLDER]` for the creator's true stories. If it didn't happen, don't say it happened.
- **Hedge history and "official" claims** unless you have a source ("the way it's usually told…").
- **Mark personal rules as personal**, and never pass them off as official rules.
- **The video must deliver what the title and thumbnail promise.**

## Checking a script

Measure a draft's narration against the table above with the same regex counts used to build it. The per-1,000-word figures should land inside the target column before recording.

## What makes content feel AI-made (researched 24 Sep 2026)

No single sign proves something is AI-made; human writers use every one of these sometimes. What gives it away is **several signs close together**. Research also shows people are poor at judging this by instinct, which is why we check deliberately instead of trusting a gut feeling.

### 1. Writing tells (checked by `check_script.py`, plus the line-by-line read)

| Tell | What it looks like | Instead |
|---|---|---|
| **AI vocabulary** | delve, tapestry, testament, pivotal, crucial, intricate, underscore, showcase, vibrant, boasts, realm, landscape, seamless, robust, leverage, unlock, elevate, game-changer, additionally, moreover | Plain words you'd say at a table |
| **Negative parallelisms** | "It's not just X, it's Y", "not only… but also", "Not X. Y.", "rather than X, Y" | Just say the thing |
| **The rule of three** | Triplets everywhere: three adjectives, three examples, three-beat fragments ("Clean. Fast. Brutal.") | Use two, or four, or one. Let lists be uneven |
| **Copula dodging** | "serves as", "stands as", "marks a shift" in place of "is" | Use "is" |
| **Puffed-up significance** | "a pivotal moment", "changes everything", "a new era", "redefines how…" | Say what it actually changes |
| **Vague attribution** | "Experts say", "many players believe", "studies show" | Name the source ("people in the Reddit thread", "EDHREC shows"), or cut it |
| **Superficial "-ing" analysis** | Sentences ending "…, highlighting its importance" or "…, reflecting the community's love of…" | Cut the tail, or make a specific point |
| **Stock openers and closers** | "Let's dive in", "without further ado", "here's the thing", "real talk", "in conclusion", "at the end of the day", "it's worth noting" | Start with the story or the claim, and end on a real line |
| **Tidy aphorism endings** | Sections that close on a neat one-liner ("And that's the point.", "That gap is the entire combo.") | End on plain speech ("And yeah, that's why it works.") |
| **Em dashes and formatting tics** | Em-dash asides, emoji as bullets, title-case everything | Commas, full stops, and normal sentence case |
| **Over-casual filler** | "honestly" and "really" in every paragraph to sound relaxed | Use the rates in the table above; casual comes from sentence shape |
| **Uniform rhythm** | Every sentence the same length and shape | Mix short and long; allow a fragment when you'd say one |
| **Written-not-spoken sentences** | Nested clauses and "one that…" add-on clauses | Break them into the way you'd say them |
| **Invented specifics** | Made-up anecdotes, stats or quotes presented as real | Only real stories (`[PLACEHOLDER]` until filled), and sourced numbers |

### 2. Narration tells (AI voice)

- **Flat pitch:** questions, emphasis and jokes all come out in the same narrow band. Listeners pick up unnatural delivery almost instantly, and flat narration makes people leave without knowing why.
- **Even pacing:** no speed changes and no breath pauses. Real narrators pause every 10–20 words; TTS only pauses at punctuation.
- **Fixes:** write in short spoken sentences with contractions, put commas, full stops and "…" where a person would breathe, generate one section at a time with a delivery note ("relaxed, like explaining to a friend"), and vary the pace between sections. Always check the output with `check_voice.py` and a listen-through.

### 3. Channel-level "AI slop" signals, and why this is also a policy issue

- **What viewers notice:**
  - a flat synthetic voice with no personality;
  - generic stock or AI visuals loosely matched to the script;
  - templated titles and thumbnails;
  - shallow, repetitive scripts;
  - suspiciously high upload frequency;
  - videos where only the topic changes.
- **YouTube's "inauthentic content" policy** targets mass-produced or repetitive content that looks templated or easily replicable at scale. It led to large channel terminations in January 2026. The line YouTube draws is **meaningful human involvement**: original research, real commentary and opinion, fact-checking, storytelling, and a distinct way of explaining.
- **How this channel stays on the right side:**
  - real research with sources in every video (as in episode 002's RESEARCH.md);
  - the owner's real opinions and stories;
  - rules fact-checked against the Comprehensive Rules;
  - an original mascot and hand-built visuals;
  - varying the format between videos;
  - never publishing an unreviewed one-shot generation.

### Sources

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [Pangram: 9 signs of AI writing, backed by data](https://www.pangram.com/signs-of-ai-writing)
- [isitslop.io: the tells, and why they are not proof](https://isitslop.io/signs-of-ai-writing/)
- [WriteText: why AI writing uses em dashes](https://writetext.io/blog/em-dash-ai/)
- [Narration Box: why AI voice sounds robotic on YouTube](https://narrationbox.com/blog/why-ai-voice-sounds-robotic-on-youtube)
- [ElevenLabs: how to make text to speech sound less robotic](https://elevenlabs.io/blog/how-to-make-text-to-speech-sound-less-robotic)
- [The Hollywood Reporter: YouTube cracks down on AI slop](https://www.hollywoodreporter.com/business/digital/faceless-creators-youtube-ai-damage-1236617586/)
- [ScaleLab: YouTube's AI content crackdown in 2026](https://scalelab.com/en/why-youtube-is-cracking-down-on-ai-generated-content-in-2026)

## Wil's narration voice (researched 25 Sep 2026)

Wil's voice is designed once in Qwen3-TTS VoiceDesign (https://huggingface.co/spaces/Qwen/Qwen3-TTS-Voice-Design). We keep one 20–30 s reference clip of it, and every episode is narrated by cloning that clip (Fish Audio S2.1 Pro on OpenRouter). The clip is the channel's voice, so it stays private.

**Design prompt (main):**

> Male, around 30, General American accent. A clear, natural mid-to-low voice with a warm, lightly textured tone. No rasp, no vocal fry. Friendly and quick-witted, with a light smile in his voice and dry, playful humor. Brisk, conversational pace, a bit faster than an audiobook, slowing down for key numbers and punchlines. Lively intonation: his pitch and energy lift when something surprises him and drop for quick asides. He sounds like a sharp friend explaining a wild card combo at game night, relaxed and confident. Not an announcer, not someone reading a script.

**Variants to A/B against the main prompt:**
- *Calmer:* swap "Brisk, conversational pace…" for "Easygoing, unhurried pace with natural pauses", and "lively intonation" for "gentle, expressive intonation".
- *Higher energy:* add "Upbeat and a little excitable, like he can't wait to tell you the next part."

**Why each part is there:**

| Choice | Evidence |
|---|---|
| Lively pitch and energy (vocal variety) | The most popular TED speakers had about 30% more vocal variety than less popular ones, and variety tracked views. Engagement models weight pitch and energy variation above tempo. This is correlation, not proof, but it's the strongest signal. |
| Brisk pace, slower on key points | In audiobooks, a higher articulation rate predicts listener liking and absorption. Credibility studies favour moderate-to-fast speech over slow speech. The studied channels run 145–220 wpm (Attack on Cardboard's rules videos 145–162, Salubrious Snail about 205, Next Level Commander about 220). |
| No rasp or vocal fry | In a 2014 PLOS ONE study, creaky (fry) voices were rated less competent, trustworthy and likeable. The effect was stronger for women, but it applied to men too. The study's method has been criticised, but there's no evidence a rough voice helps. |
| A light smile in the voice, not a grin | Smiling is audible in speech and reads as friendlier and more trustworthy. A broad smile reads as warmer but less competent, and a rules channel needs competence. |
| Mid-to-low pitch, confident | Lower male voices read as more reliable. The lift in energy keeps it from sounding flat. Listeners judge trustworthiness within about 0.3–0.5 s, so the first line of every video matters. |
| "Not an announcer, not reading a script" | Radio or announcer polish, and every sentence ending on the same pitch, are the clearest synthetic-voice tells. |
| General American | Most of the audience and the three studied channels are American. |

**How to pick the voice:**
1. Paste the cold open and intro ("The new Jace precon isn't even out yet… Let's take a look.") as the text. That's about 20 s, with a hook, a joke and a self-intro.
2. Generate 3–5 takes per prompt, since each run gives a slightly different voice. Keep the favourites.
3. Reject any take with:
   - the same pitch drop at the end of every sentence;
   - no audible breaths;
   - over-crisp consonants;
   - odd stress on numbers or card names;
   - sounding like a trailer voice.
4. Save the winner as `studio/voice/wil-reference.wav`. Keep it private: add it to `.gitignore` before committing, so the channel's voice isn't published in a public repo.

Sources:
- TED vocal variety: https://www.scienceofpeople.com/secrets-of-a-successful-ted-talk/
- Engagement modelling: https://pmc.ncbi.nlm.nih.gov/articles/PMC13269690/
- Audiobook narration appeal: https://arxiv.org/html/2607.02473v1
- Credible voices: https://pubs.aip.org/asa/jasa/article/157/5/3780/3347110/How-does-a-credible-voice-sound
- Vocal fry: https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0097506
- Smiling voice: https://www.york.ac.uk/language/ypl/parlay/01/YPL-PARLAY2013-07-Torre.pdf and https://www.researchgate.net/publication/319494205_Smile_Big_or_Not_Effects_of_Smile_Intensity_on_Perceptions_of_Warmth_and_Competence
- Qwen voice-design prompting: https://getstream.io/blog/qwen3-voice-design/
