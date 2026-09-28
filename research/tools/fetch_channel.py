"""Pull a channel's video metadata, thumbnails and English captions with yt-dlp, politely.

    python research/tools/fetch_channel.py [--phase meta|subs] [--wait MIN] <slug> <channel_id> [<slug> <channel_id> ...]

Two phases, because YouTube rate-limits caption requests (HTTP 429) far harder than the rest:
    meta   info.json + thumbnail for every long video (no caption requests)
    subs   English captions only; waits --wait minutes first, then goes slowly and backs off on 429

Each channel lands in research/<slug>/ using the same layout as the older studies:
    transcripts/<id>.en.vtt              raw captions (gitignored; distilled by build_corpus.py)
    analysis/meta/videos/<id>.info.json  yt-dlp metadata (gitignored, large)
    analysis/meta/videos/<id>.jpg        thumbnail
    analysis/{videos,streams,shorts}_flat.tsv   listing of each tab
    analysis/fetch_state.jsonl           outcome per video, so a re-run skips finished ones

Long videos and streams get captions; Shorts are listed only (title, views, duration).
Both phases are resumable and pace themselves. Stops if it hits a bot check.
"""
import json
import random
import subprocess
import sys
import time
from pathlib import Path

RESEARCH = Path(__file__).resolve().parent.parent
YT = [sys.executable, "-m", "yt_dlp", "--no-update", "--js-runtimes", "node"]
BACKOFF = [600, 900, 1800]  # seconds to wait after consecutive 429s (last value repeats)
MAX_429_IN_A_ROW = 24  # about 11 hours of trying before giving up
PAUSE = {"meta": (4.0, 8.0), "subs": (6.0, 12.0)}  # seconds between videos
DONE = {"ok", "nocaps", "unavailable"}


def run(args, cwd):
    p = subprocess.run(YT + args, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    return p.returncode, p.stdout, p.stderr


def list_tab(cwd, channel_id, tab):
    """Flat listing of a channel tab -> list of [id, title, views, duration]."""
    url = f"https://www.youtube.com/channel/{channel_id}/{tab}"
    for attempt in range(4):
        rc, out, err = run(["--flat-playlist", "--print", "%(id)s\t%(title)s\t%(view_count)s\t%(duration)s", url], cwd)
        rows = [l.split("\t") for l in out.splitlines() if l.count("\t") == 3]
        if rows or "does not have a" in err or "tab" in err.lower():
            return rows
        time.sleep(30 * (attempt + 1))
    return []


def load_state(path):
    state = {}
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.strip():
                r = json.loads(line)
                state[r["id"]] = r["status"]
    return state


def fetch_one(cwd, vid, phase):
    """Returns 'ok', 'nocaps', 'unavailable', '429', 'botcheck' or 'error'."""
    if phase == "meta":
        args = ["--write-info-json", "--write-thumbnail", "--convert-thumbnails", "jpg",
                "-o", "analysis/meta/videos/%(id)s.%(ext)s"]
    else:
        args = ["--write-subs", "--write-auto-subs", "--sub-langs", "en", "--sub-format", "vtt",
                "-o", "subtitle:transcripts/%(id)s.%(ext)s"]
    rc, out, err = run(["--skip-download", "--ignore-errors", "--retries", "2"] + args
                       + [f"https://www.youtube.com/watch?v={vid}"], cwd)
    text = (out + err).lower()
    if "not a bot" in text or "sign in to confirm" in text:
        return "botcheck"
    if phase == "meta" and (cwd / "analysis" / "meta" / "videos" / f"{vid}.info.json").exists():
        return "ok"
    if phase == "subs" and (cwd / "transcripts" / f"{vid}.en.vtt").exists():
        return "ok"
    if "429" in text or "too many requests" in text:
        return "429"
    if phase == "subs" and "no subtitles" in text:
        return "nocaps"
    if any(s in text for s in ("video unavailable", "private video", "members-only", "this video is not available")):
        return "unavailable"
    return "error"


def fetch_channel(slug, channel_id, phase):
    cwd = RESEARCH / slug
    (cwd / "analysis" / "meta" / "videos").mkdir(parents=True, exist_ok=True)
    (cwd / "transcripts").mkdir(parents=True, exist_ok=True)

    listing = {}
    for tab in ("videos", "streams", "shorts"):
        flat = cwd / "analysis" / f"{tab}_flat.tsv"
        if flat.exists() and flat.stat().st_size:
            listing[tab] = [l.split("\t") for l in flat.read_text(encoding="utf-8").splitlines() if l.strip()]
        else:
            listing[tab] = list_tab(cwd, channel_id, tab)
            flat.write_text("".join("\t".join(r) + "\n" for r in listing[tab]), encoding="utf-8")
        print(f"[{slug}] {tab}: {len(listing[tab])} listed", flush=True)

    ids = []
    for tab in ("videos", "streams"):
        for r in listing[tab]:
            if r[0] not in ids:
                ids.append(r[0])

    state_file = cwd / "analysis" / f"fetch_state_{phase}.jsonl"
    state = load_state(state_file)
    todo = [v for v in ids if state.get(v) not in DONE]
    print(f"[{slug}/{phase}] {len(ids)} long videos, {len(ids) - len(todo)} already done, {len(todo)} to fetch", flush=True)

    in_a_row = 0
    for n, vid in enumerate(todo, 1):
        while True:
            status = fetch_one(cwd, vid, phase)
            if status == "429":
                in_a_row += 1
                if in_a_row > MAX_429_IN_A_ROW:
                    print(f"[{slug}/{phase}] still rate limited after {MAX_429_IN_A_ROW} waits; stopping. Re-run to resume.", flush=True)
                    return False
                wait = BACKOFF[min(in_a_row - 1, len(BACKOFF) - 1)]
                print(f"[{slug}/{phase}] 429 on {vid}; waiting {wait // 60} min (#{in_a_row})", flush=True)
                time.sleep(wait)
                continue
            break
        if status == "botcheck":
            print(f"[{slug}/{phase}] bot check on {vid}; stopping. Re-run later to resume.", flush=True)
            return False
        in_a_row = 0
        with state_file.open("a", encoding="utf-8") as f:
            f.write(json.dumps({"id": vid, "status": status, "ts": int(time.time())}) + "\n")
        print(f"[{slug}/{phase}] {n}/{len(todo)} {status:11s} {vid}", flush=True)
        time.sleep(random.uniform(*PAUSE[phase]))
    return True


if __name__ == "__main__":
    args, phase, wait = sys.argv[1:], "meta", 0
    while args and args[0].startswith("--"):
        flag = args.pop(0)
        if flag == "--phase":
            phase = args.pop(0)
        elif flag == "--wait":
            wait = float(args.pop(0))
    if phase not in PAUSE or not args or len(args) % 2:
        sys.exit(__doc__)
    if wait:
        print(f"waiting {wait:g} min before starting", flush=True)
        time.sleep(wait * 60)
    for slug, cid in zip(args[::2], args[1::2]):
        if not fetch_channel(slug, cid, phase):
            sys.exit(1)
    print("ALL DONE", flush=True)
