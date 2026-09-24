# New Channel research

This repo holds teardowns of Magic: The Gathering YouTube channels, used to plan a new channel. Each channel folder has the same layout:

```
<channel>/
  FINDINGS.md     what made the channel grow, what's weak, and a 12-month roadmap
  transcripts/    caption files (.vtt)
  analysis/       scripts, dataset.json, thumbnail sheets, sample frames, report source
```

| Channel | Lane | Subscribers | Median long-form views | Findings | Visual report (private) |
|---|---|---:|---:|---|---|
| [Attack on Cardboard](https://www.youtube.com/@attackoncardboard) | MTG rules answers and rules news | 35.7k | 16.7k | [FINDINGS.md](attack-on-cardboard/FINDINGS.md) | [report](https://claude.ai/artifact/1WxaT8uRL3RGuHwBZjbvdA) |
| [Salubrious Snail](https://www.youtube.com/@salubrioussnail) | EDH deckbuilding theory essays | 99.5k | 115k | [FINDINGS.md](salubrious-snail/FINDINGS.md) | [report](https://claude.ai/artifact/Awa6TxvcLutaixcGYL5Kn1) |
| [Next Level Commander](https://www.youtube.com/@NextLevelCommander) | New-commander deck techs (16 months old) | 7.2k | 4.3k (13.5k since Mar 2026) | [FINDINGS.md](next-level-commander/FINDINGS.md) | [report](https://claude.ai/artifact/JhFF91GVnxWjkB9AfSt2iz) |

Data was pulled with [yt-dlp](https://github.com/yt-dlp/yt-dlp) on 24 Sep 2026. The raw `.info.json` metadata runs to hundreds of MB, so it's gitignored. Everything the analysis uses is kept in each channel's `analysis/dataset.json`.

## Making videos

**`studio/`** is the main workflow. You paste one prompt into Claude Code, and it writes, illustrates, voices, animates and renders a video, using OpenRouter for images and voice. Setup is in [studio/README.md](studio/README.md), and the prompt template is in [studio/PROMPT.md](studio/PROMPT.md).

**`video/`** is an optional [Remotion](https://www.remotion.dev/docs) project (React + TypeScript) for producing the channel's videos in code.

```
cd video
npm i             # first time only
npm run dev       # Remotion Studio: live preview in the browser
npx remotion render HelloWorld out/hello.mp4
```

Card images can be used: the channel owner has written permission from Wizards of the Coast (see [PERMISSIONS.md](PERMISSIONS.md) for scope and what it doesn't cover). Compositions are registered in `video/src/Root.tsx`. Rendered files go to `video/out/`, which is gitignored. Remotion is free for individuals and teams of up to 3; larger companies need a [license](https://www.remotion.pro/license).

## How scripts should sound

[VOICE.md](VOICE.md) sets out how scripts should sound: honest, genuine and conversational. Its targets are measured from the three channels' real transcripts. Episodes live in `episodes/`, starting with [001](episodes/001-youre-playing-commander-wrong/SCRIPT.md).

## Keeping people watching

[RETENTION.md](RETENTION.md) covers hooks, holding viewers through the middle, Shorts, and exactly where the subscribe segment goes, with a pre-upload checklist. The subscribe overlay is `studio/assets/subscribe-beat.webm`, built from `video/src/SubscribeBeat.tsx`.

## The three playbooks in one line each

- **Attack on Cardboard:** be the fastest trusted answer when the rules change or a tournament ruling blows up, and multiply the reach with rules-question Shorts.
- **Salubrious Snail:** coin names for patterns players feel but can't describe, explain them with cheap original drawings, and publish steadily.
- **Next Level Commander:** one 8–10 minute deck-tech format with a signature rating card, first on every new commander, with a price and playgroup stakes in the title.

## Adding another channel

1. `mkdir <channel>/{transcripts,analysis}` and copy `salubrious-snail/analysis/*.py` into the new `analysis/` folder. Its captions are keyed by video ID, which is the more robust of the two setups.
2. Fetch the metadata, thumbnails and captions:
   ```
   yt-dlp --skip-download --write-info-json --write-thumbnail --convert-thumbnails jpg \
     --write-auto-subs --sub-langs en --sub-format vtt --sleep-requests 1 \
     -o "analysis/meta/videos/%(id)s.%(ext)s" -o "subtitle:transcripts/%(id)s.%(ext)s" \
     "https://www.youtube.com/@<handle>/videos"
   ```
   Repeat for `/shorts` and `/streams`. Use a few parallel workers at most, because YouTube starts showing a bot check after a few hundred rapid requests.
3. Run `build_dataset.py`, then `categorize.py` (adjust the title patterns to the channel), then `sheets.py`.
