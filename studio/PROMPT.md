# One-shot video prompt

Copy the block below into Claude Code, started from inside `studio/`. Fill in the `{{…}}` parts first. It keeps the shape of the Reddit prompt: a single prompt, fully autonomous, with a hard spending cap. It also adds the things a real channel needs: an MP4 you can upload, fact-checking, original art, and a cost report.

```
Create a {{30-60}}s {{vertical 9:16 YouTube Short | 16:9 video}} on the topic: {{TOPIC}}.
Style: {{whimsical hand-drawn collage | cardboard cut-out | stick-figure diagrams}}, with appropriate music/sound design and a narrated voiceover.

Production value should be as high as possible, at a professional level. Quality is paramount. Take your time.
I will be away from my computer, so work autonomously until the video is finished.

Setup and tools:
- Work inside a new folder: runs/{{YYYY-MM-DD-slug}}/. Put every file you create there.
- The OpenRouter API key is in studio/.env. Use `node tools/openrouter.mjs` for images and speech
  (run it with RUN_DIR=runs/{{YYYY-MM-DD-slug}} so spend is logged per run). Read the header of that file first.
  You may call other OpenRouter models directly if they do the job better.
- Max OpenRouter spend for this video: ${{10}}. Check `node tools/openrouter.mjs spend` as you go.
- ffmpeg, Node 24 and Python 3.10 are installed. Microsoft Edge is installed, so you can drive it headless
  (e.g. playwright-core with channel "msedge") to capture a JS/canvas animation frame by frame.
  You may use any other tools or resources you can find. Remotion is available in ../video but is optional.

Content rules:
- This is for my Magic: The Gathering channel. I have written permission from Wizards of the Coast to use
  card images (see ../PERMISSIONS.md). Fetch card images from the Scryfall API.
- Every other character, mascot, illustration and background must be original. Don't draw or imitate
  characters from films, TV, games or other franchises, and don't use memes or stills of real people.
- Every rules or factual claim must be correct. Cite Comprehensive Rules numbers in sources.md and
  double-check each claim before narrating it. If you are unsure of a ruling, leave it out.
- Open with the stakes in the first sentence: no greeting, no "in this video", no sponsor read.
- HARD RULE: nothing may feel AI-written. Follow ../VOICE.md, run `python tools/check_script.py` on the
  narration and fix every flag, and avoid the listed tells (AI vocabulary, "not just X, it's Y", reflexive
  triplets, stock openers, tidy one-liner endings, em dashes). Never invent anecdotes or stats.
- Follow the pre-upload checklist in ../RETENTION.md: hook within 15s, a new visual beat every 2–4s,
  at least one open loop paid off later, and one comment prompt tied to the content.
- Long-form only: overlay studio/assets/subscribe-beat.webm exactly once, right after the first payoff
  (25–40% in, never in the first 60s or last 10%), with a one-line spoken reason and an open loop straight
  after it. Use the ffmpeg command in ../RETENTION.md (it needs `-c:v libvpx` to keep transparency).
  End with a "watch next" end-screen slot in the last 5–20s, not a second subscribe ask.
- Shorts: no spoken subscribe ask; a thumb-stopping first frame; the ending loops back to the opening line.

Deliverables in the run folder:
1. final.mp4: {{1080x1920 | 1920x1080}}, H.264 + AAC, loudness about -14 LUFS, burned-in captions.
2. thumbnail.png (for 16:9 videos): one card or image plus a verdict of five words or fewer.
3. script.md: the narration, with timestamps.
4. sources.md: rules citations and asset sources.
5. REPORT.md: what you made, which models and APIs you used, OpenRouter spend, time taken,
   and a list of anything you think still needs fixing.
```

## Tips

- Start with 60-second Shorts. They're cheap to test, and the teardowns show rules-question Shorts were Attack on Cardboard's biggest reach engine.
- Keep what works. When a run looks good, copy its style decisions (palette, fonts, mascot, pacing) into a `STYLE.md` and add "Follow STYLE.md" to the prompt. That turns one-offs into a recognisable channel look.
- Always watch the result before uploading. The Reddit poster said their one-shot still had "some things need to be fixed".
- Your voice beats TTS for loyalty. Once a format works, try recording the narration yourself and have Claude sync the animation to your audio.
