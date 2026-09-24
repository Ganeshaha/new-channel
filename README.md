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

Data was pulled with [yt-dlp](https://github.com/yt-dlp/yt-dlp) on 24 Sep 2026. The raw `.info.json` metadata runs to hundreds of MB, so it's gitignored. Everything the analysis uses is kept in each channel's `analysis/dataset.json`.

## The two playbooks in one line each

- **Attack on Cardboard:** be the fastest trusted answer when the rules change or a tournament ruling blows up, and multiply the reach with rules-question Shorts.
- **Salubrious Snail:** coin names for patterns players feel but can't describe, explain them with cheap original drawings, and publish steadily.

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
