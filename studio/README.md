# Studio: one-shot AI video runs

This folder replicates the "made entirely with Opus + $3.21 of OpenRouter" workflow. Claude Code writes the script, generates images and voice through OpenRouter, animates everything in code, and renders an MP4.

> **Spending rule:** Claude must get the channel owner's explicit **OK** before any paid OpenRouter call (images, voice, music), with a cost estimate each time. `check` and `spend` are free and don't need an OK.

## One-time setup

1. **Create an OpenRouter account** at https://openrouter.ai and add credits (about $10 is plenty to start). Each short costs roughly $1–5 in API calls.
2. **Create an API key** at https://openrouter.ai/settings/keys.
   - Give it a **credit limit** (for example $10). This is the hard stop if a run goes wrong.
   - Name it something like `studio`.
3. **Add the key locally.** Copy `.env.example` to `.env` in this folder, then paste your key after `OPENROUTER_API_KEY=`.
   - `.env` is gitignored. Never commit it or paste the key into chat.
4. **Check the key works:**
   ```
   cd studio
   node tools/openrouter.mjs check
   ```
   You should see "key OK", your usage and your credit limit.
5. **Optional smoke test** (costs about $0.05):
   ```
   node tools/openrouter.mjs image "a snail wearing a tiny wizard hat, hand-drawn collage style" test/snail.png --aspect 1:1
   node tools/openrouter.mjs speech "Is this card draw? Let's find out." test/voice.wav
   ```

## Running a video

1. Open Claude Code in this folder (`cd studio`, then `claude`). Choose Opus with `/model`.
2. **Let it run unattended.** A one-shot run is only hands-off if Claude doesn't stop to ask permission for every command. Pick one of these options:
   - approve the first few prompts with "don't ask again" for `node`, `ffmpeg`, `npm` and `python`, or
   - add those commands to `.claude/settings.local.json` in this folder.

   Avoid `--dangerously-skip-permissions` outside a disposable environment.
3. Paste the prompt from [PROMPT.md](PROMPT.md) with the blanks filled in, and walk away.
4. The results land in `runs/<date-slug>/`: `final.mp4`, `script.md`, `sources.md`, `REPORT.md` and `spend.jsonl`.

## Costs

| What | Where it's billed | Reddit example |
|---|---|---|
| Claude (writing, coding, directing) | Your Claude plan or API | About 10% of a 5-hour window on Max 5 |
| Images (Gemini 3.1 Flash Image, "Nano Banana 2") | OpenRouter | Most of the $3.21 |
| Voice (gpt-audio-mini by default) | OpenRouter | A few cents |

Check the running total for a run at any time:

```
RUN_DIR=runs/<run> node tools/openrouter.mjs spend
```

## Models

These are the defaults, set in `.env`. Any OpenRouter model with image or audio output works.

- `IMAGE_MODEL=google/gemini-3.1-flash-image`. Alternatives are `google/gemini-3-pro-image` (higher quality, pricier) and `openai/gpt-5-image-mini`.
- `SPEECH_MODEL=openai/gpt-audio-mini`. `openai/gpt-audio` sounds better and costs more. The voices are alloy, echo, fable, onyx, nova and shimmer.
- Music: `google/lyria-3-clip-preview` and `google/lyria-3-pro-preview` output audio. The helper doesn't wrap them yet, but Claude can call them directly during a run.
