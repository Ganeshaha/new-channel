"""Turn a channel's raw captions and yt-dlp metadata into clean, searchable text.

    python research/tools/build_corpus.py <slug> [<slug> ...]      (or: --all)

For each research/<slug>/ it writes:
    text/<id>.txt             one video: header (title, date, views, chapters) then the transcript
                              in ~40 s paragraphs, each starting with a [m:ss] marker
    analysis/dataset.json     one row per upload: views, likes, comments, duration, words, wpm,
                              hook_15s / hook_60s / outro_45s, chapters, tags, baseline multiple
Works from transcripts/<id>.*.vtt and analysis/meta/*/<id>.info.json.
"""
import glob
import json
import os
import re
import statistics
import sys
from datetime import date
from pathlib import Path

RESEARCH = Path(os.environ.get("RESEARCH_DIR") or Path(__file__).resolve().parent.parent)
TS =re.compile(r"(\d+):(\d+):(\d+\.\d+)")
CUE = re.compile(r"^(\d+:\d+:\d+\.\d+) --> ")
WORD = re.compile(r"<(\d+:\d+:\d+\.\d+)><c>\s*([^<]*)</c>")
NOISE = re.compile(r"^\[[^\]]*\]$|^>>+$")  # [Music], [Applause], >>
PARA_SECONDS = 40


def secs(s):
    h, m, x = TS.match(s).groups()
    return int(h) * 3600 + int(m) * 60 + float(x)


def parse_vtt(path):
    """[(seconds, word)]. Word-timed for auto captions; falls back to cue text for manual ones."""
    words, plain, cue_start, last = [], [], None, None
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            m = CUE.match(line)
            if m:
                cue_start = secs(m.group(1))
                continue
            if "<c>" in line:
                first = line.split("<", 1)[0].strip()
                if first:
                    words.append((cue_start, first))
                for t, w in WORD.findall(line):
                    if w.strip():
                        words.append((secs(t), w.strip()))
            elif cue_start is not None and line.strip() and not line.startswith(("WEBVTT", "Kind:", "Language:")):
                txt = re.sub(r"<[^>]+>", "", line).strip()
                if txt and txt != last:
                    plain.append((cue_start, txt))
                    last = txt
    if not words:
        words = [(t, w) for t, txt in plain for w in txt.split()]
    return [(t, w) for t, w in words if not NOISE.match(w)]


def pick_vtt(tx_dir, vid):
    found = sorted(glob.glob(os.path.join(tx_dir, f"{vid}.*.vtt")))
    for p in found:
        if p.endswith(".en.vtt"):
            return p
    return found[0] if found else None


def clock(t):
    t = int(t)
    return f"{t // 3600}:{t % 3600 // 60:02d}:{t % 60:02d}" if t >= 3600 else f"{t // 60}:{t % 60:02d}"


def paragraphs(words):
    out, start, cur = [], None, []
    for t, w in words:
        if start is None:
            start = t
        elif (t - start >= PARA_SECONDS and cur[-1][-1] in ".?!") or t - start >= PARA_SECONDS * 1.6:
            out.append((start, " ".join(cur)))
            start, cur = t, []
        cur.append(w)
    if cur:
        out.append((start or 0, " ".join(cur)))
    return out


def between(words, a, b):
    return " ".join(w for t, w in words if a <= t < b)


def build(slug):
    root = RESEARCH / slug
    tx_dir, meta_dir, text_dir = root / "transcripts", root / "analysis" / "meta", root / "text"
    text_dir.mkdir(exist_ok=True)

    shorts_ids = set()
    flat = root / "analysis" / "shorts_flat.tsv"
    if flat.exists():
        shorts_ids = {l.split("\t")[0] for l in flat.read_text(encoding="utf-8", errors="replace").splitlines() if l.strip()}
    stream_ids = set()
    flat = root / "analysis" / "streams_flat.tsv"
    if flat.exists():
        stream_ids = {l.split("\t")[0] for l in flat.read_text(encoding="utf-8", errors="replace").splitlines() if l.strip()}

    today = date.today()
    rows = []
    for p in sorted(glob.glob(str(meta_dir / "*" / "*.info.json"))):
        d = json.load(open(p, encoding="utf-8"))
        ud = d.get("upload_date")
        if not ud:
            continue
        vid = d["id"]
        kind = "shorts" if vid in shorts_ids else "streams" if vid in stream_ids else os.path.basename(os.path.dirname(p))
        up = date(int(ud[:4]), int(ud[4:6]), int(ud[6:]))
        views = d.get("view_count") or 0
        vtt = pick_vtt(str(tx_dir), vid)
        words = parse_vtt(vtt) if vtt else []
        dur = d.get("duration") or (words[-1][0] if words else 0)
        wpm = round(len(words) / (words[-1][0] / 60), 1) if words and words[-1][0] else None

        if words:
            chapters = d.get("chapters") or []
            head = [
                f"# {d['title']}",
                f"channel: {d.get('channel') or slug} | https://youtu.be/{vid}",
                f"date: {up.isoformat()} | views: {views:,} | likes: {d.get('like_count') or 0:,} | "
                f"comments: {d.get('comment_count') or 0:,} | length: {clock(dur)} | words: {len(words):,} | wpm: {wpm}",
            ]
            if chapters:
                head.append("chapters: " + "; ".join(f"{clock(c.get('start_time', 0))} {c.get('title')}" for c in chapters))
            if d.get("tags"):
                head.append("tags: " + ", ".join(d["tags"][:15]))
            body = [f"[{clock(t)}] {txt}" for t, txt in paragraphs(words)]
            (text_dir / f"{vid}.txt").write_text("\n".join(head) + "\n\n" + "\n\n".join(body) + "\n", encoding="utf-8")

        rows.append({
            "id": vid, "kind": kind, "title": d["title"], "date": up.isoformat(),
            "views": views, "likes": d.get("like_count"), "comments": d.get("comment_count"),
            "duration": d.get("duration"), "age_days": max((today - up).days, 1),
            "like_rate": round((d.get("like_count") or 0) / views * 100, 2) if views else None,
            "comment_rate": round((d.get("comment_count") or 0) / views * 1000, 2) if views else None,
            "tags": d.get("tags") or [], "description": (d.get("description") or "")[:400],
            "chapters": [c.get("title") for c in (d.get("chapters") or [])],
            "thumb": os.path.relpath(p.replace(".info.json", ".jpg"), root / "analysis").replace("\\", "/"),
            "subs": d.get("channel_follower_count"),
            "has_transcript": bool(words), "words": len(words) or None, "wpm": wpm,
            "hook_15s": between(words, 0, 15) if words else None,
            "hook_60s": between(words, 0, 60) if words else None,
            "outro_45s": between(words, dur - 45, dur + 1) if words and dur else None,
        })

    rows.sort(key=lambda r: r["date"])
    for kind in ("videos", "streams"):
        ks = [r for r in rows if r["kind"] == kind]
        for i, r in enumerate(ks):
            prev = [x["views"] for x in ks[max(0, i - 10):i]]
            base = statistics.median(prev) if prev else None
            r["baseline"] = base
            r["multiple"] = round(r["views"] / base, 2) if base else None
    (root / "analysis" / "dataset.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")

    n_tx = sum(r["has_transcript"] for r in rows)
    total_words = sum(r["words"] or 0 for r in rows)
    print(f"{slug}: {len(rows)} uploads, {n_tx} transcripts, {total_words:,} words")


if __name__ == "__main__":
    args = sys.argv[1:]
    if args == ["--all"]:
        args = sorted(p.name for p in RESEARCH.iterdir() if (p / "analysis" / "meta").is_dir())
    if not args:
        sys.exit(__doc__)
    for slug in args:
        build(slug)
