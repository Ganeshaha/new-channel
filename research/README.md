# Research

Teardowns and transcript corpora of Magic: The Gathering YouTube channels, used to plan and write Wild Card Commander videos. The channel list, with sizes, lanes and why each was picked, is in [channels.json](channels.json).

## Layout

```
research/
  channels.json         every channel studied, and the ones considered and skipped
  tools/                fetch_channel.py, build_corpus.py, search.py
  youtube-general/      REPORT.md: how YouTube ranks, monetises and labels AI in 2026, packaging data,
                        and the P0/P1/P2 checklist the upload steps follow
  shorts/               REPORT.md: Shorts that drive viewers to a long video (length, the related-video link,
                        safe zones, CTA, captions, timing) and our promo-Short template
  wil-motion/           REPORT.md: how talking characters move naturally (visual prosody, animation craft,
                        VTuber/ECA systems) and the expression budget Wil follows
  layout-study/         REPORT.md: frame ratios measured on the white-background channels vs ours
                        (card sizes, ink coverage, text, pacing), with its tools; frames are gitignored
  <channel>/
    FINDINGS.md         what made the channel grow (first three channels)
    transcripts/        raw captions, <video id>.en.vtt (gitignored for channels added after the first three)
    text/               clean transcripts, <video id>.txt: header, chapters, then ~40 s paragraphs with [m:ss] markers
    analysis/
      dataset.json      one row per upload: views, likes, comments, length, words, wpm, hooks, chapters
      meta/videos/      <id>.jpg thumbnails (tracked) and <id>.info.json (gitignored, large)
      *_flat.tsv        listing of each tab (videos, streams, shorts)
```

## Using the corpus

```
python research/tools/search.py "table talk"                    top matching passages, with a link to the moment
python research/tools/search.py "rule 0" -c defcat-mtg -n 20    one channel
python research/tools/search.py "kingmaking" --group            which videos discuss it most
python research/tools/search.py "power level" --min-views 50000 --by-views
python research/tools/search.py --stats
```

The index rebuilds itself when any transcript changes. Query syntax is SQLite FTS5 (`"exact phrase"`, `a OR b`, `prefix*`).

## Adding a channel

1. Find its channel ID (`python -m yt_dlp --print channel_id --playlist-items 1 <videos url>`).
2. Fetch, in two passes:
   ```
   python research/tools/fetch_channel.py --phase meta <slug> <channel_id>
   python research/tools/fetch_channel.py --phase subs <slug> <channel_id>
   ```
   Both are resumable and pace themselves (a few seconds between videos). Shorts are listed with title and views only.
3. `python research/tools/build_corpus.py <slug>` writes `text/` and `analysis/dataset.json`.
4. Add the channel to `channels.json`.

## Why two passes: YouTube throttles captions

Caption requests are limited much harder than everything else. After a burst of a few hundred requests (scouting, searching, test downloads) every caption request returns **HTTP 429** for a while, on every player client, even though video info, thumbnails and channel listings keep working. So:

- Don't scout with lots of `yt-dlp` calls right before a caption pull. Use the web or a few flat listings.
- Fetch metadata and thumbnails first (`--phase meta`), then captions (`--phase subs`, which can wait with `--wait MIN` and backs off 10, 15, then 30 minutes on each 429).
- Keep yt-dlp current (`pip install -U yt-dlp`) and install `curl_cffi` so it can impersonate a browser; without it yt-dlp warns that no impersonation target is available.
- Don't use `--cookies-from-browser` to get around it: that ties the requests to a Google account.

Checked 25 Sep 2026 with yt-dlp 2026.08.19.
