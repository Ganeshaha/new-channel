# Wild Card Commander

This repo holds the research and production files for **Wild Card Commander** (@WildCardCommander), a casual Commander channel ("for people who want the rematch"). It's the secondary channel to **Deck Check cEDH** (@DeckCheckMTG).

- **Brand:** `brand/` holds:
  - `profile-picture-800.png`, the YouTube profile picture, tested at 36px, 48px and 98px on light and dark themes;
  - `banner-2560x1440.png`;
  - `mascot-sheet.png`;
  - `animations/`, 17 expressive transparent mascot animations. Its [README](brand/animations/README.md) covers what each is for and the ffmpeg overlay command.

  The source is `video/src/Mascot.tsx` (poses and stills), `video/src/mascot/Rig.tsx` (the character rig), `video/src/mascot/animations.tsx` and `animations2.tsx`. The plan for what's next is in [video/ANIMATION-ROADMAP.md](video/ANIMATION-ROADMAP.md).
- **Mascot: Wil D. Card**, a plain red card back (brick red with a thin cream inner border, not Wizards' back) wearing pixel sunglasses. Red was chosen for contrast at avatar size, because no big Commander channel uses it, and because it pairs with Deck Check cEDH's maroon. Change `MASCOT_BACK` in `video/src/Mascot.tsx` to restyle every asset. The poses are cool, "hold on…" (shades down), verdict (shades drop), shrug, and point.

## Repo layout

| Folder or file | What's in it |
|---|---|
| `research/` | Teardowns and transcript corpora of the studied channels, with a search tool. See [research/README.md](research/README.md) and [Research](#research). |
| `episodes/` | One folder per episode: script, research notes, thumbnails, upload text. |
| `video/` | The Remotion project that renders the videos, plus the mascot rig. |
| `studio/` | Paid-call helper, narration and QA tools, shared assets. |
| `brand/` | Profile picture, banner, mascot sheet and animations. |
| `WORKFLOW.md`, `VOICE.md`, `RETENTION.md`, `PERMISSIONS.md` | Episode pipeline, script voice rules, retention rules, and the Wizards permission scope. |

## Research

`research/` holds teardowns of Magic: The Gathering YouTube channels, used to plan a new channel. Each channel folder has the same layout:

```
research/<channel>/
  FINDINGS.md     what made the channel grow, what's weak, and a 12-month roadmap
  transcripts/    caption files (.vtt)
  analysis/       scripts, dataset.json, thumbnail sheets, sample frames, report source
```

| Channel | Lane | Subscribers | Median long-form views | Findings | Visual report (private) |
|---|---|---:|---:|---|---|
| [Attack on Cardboard](https://www.youtube.com/@attackoncardboard) | MTG rules answers and rules news | 35.7k | 16.7k | [FINDINGS.md](research/attack-on-cardboard/FINDINGS.md) | [report](https://claude.ai/artifact/1WxaT8uRL3RGuHwBZjbvdA) |
| [Salubrious Snail](https://www.youtube.com/@salubrioussnail) | EDH deckbuilding theory essays | 99.5k | 115k | [FINDINGS.md](research/salubrious-snail/FINDINGS.md) | [report](https://claude.ai/artifact/Awa6TxvcLutaixcGYL5Kn1) |
| [Next Level Commander](https://www.youtube.com/@NextLevelCommander) | New-commander deck techs (16 months old) | 7.2k | 4.3k (13.5k since Mar 2026) | [FINDINGS.md](research/next-level-commander/FINDINGS.md) | [report](https://claude.ai/artifact/JhFF91GVnxWjkB9AfSt2iz) |

Data was pulled with [yt-dlp](https://github.com/yt-dlp/yt-dlp) on 24 Sep 2026. The raw `.info.json` metadata runs to hundreds of MB, so it's gitignored. Everything the analysis uses is kept in each channel's `analysis/dataset.json`.

Two cross-channel reports feed every episode:
- [research/youtube-general/REPORT.md](research/youtube-general/REPORT.md): how YouTube recommends, monetises and labels AI content in 2026, packaging data, and the upload checklist.
- [research/layout-study/REPORT.md](research/layout-study/REPORT.md): card sizes, frame fill, text and pacing measured on the white-background channels, compared with ours.

## Making videos

**Start with [WORKFLOW.md](WORKFLOW.md)**. It's the step-by-step episode pipeline, covering research, script checks, the video build, QA tools, Wil's voice, thumbnails and rendering, plus every pitfall found so far.


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

Use `research/tools/fetch_channel.py` (metadata and thumbnails first, then captions), then `build_corpus.py` to get clean text and a dataset. The steps, and why captions are fetched in a separate slow pass, are in [research/README.md](research/README.md#adding-a-channel).
