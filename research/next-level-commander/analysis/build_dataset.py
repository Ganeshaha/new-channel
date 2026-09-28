"""Parse captions (named by video id) and join with yt-dlp metadata into dataset.json.

Same logic as analysis/parse_vtt.py + analysis/analyze.py for the Attack on Cardboard
study, but keyed by video id instead of title.
"""
import glob, json, os, re, statistics
from datetime import date

A = os.path.dirname(os.path.abspath(__file__))
TX_DIR = os.path.join(os.path.dirname(A), "transcripts")
TODAY = date(2026, 9, 24)
TS = re.compile(r"(\d+):(\d+):(\d+\.\d+)")
CUE = re.compile(r"^(\d+:\d+:\d+\.\d+) --> ")
WORD = re.compile(r"<(\d+:\d+:\d+\.\d+)><c>\s*([^<]*)</c>")


def secs(s):
    h, m, x = TS.match(s).groups()
    return int(h) * 3600 + int(m) * 60 + float(x)


def parse(path):
    """Word-timed captions. Falls back to plain cue text for manual (non word-timed) subs."""
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
    if words:
        return words
    return [(t, w) for t, txt in plain for w in txt.split()]


def between(words, a, b):
    return " ".join(w for t, w in words if a <= t < b)


tx = {}
for p in glob.glob(os.path.join(TX_DIR, "*.vtt")):
    vid = os.path.basename(p).split(".")[0]
    if vid in tx:  # prefer the first language variant found
        continue
    words = parse(p)
    if not words:
        continue
    dur = words[-1][0] or 1
    tx[vid] = {
        "words": len(words), "wpm": round(len(words) / (dur / 60), 1),
        "hook_15s": between(words, 0, 15), "hook_60s": between(words, 0, 60),
        "outro_45s": between(words, dur - 45, dur + 1), "full": " ".join(w for _, w in words),
    }
json.dump(tx, open(os.path.join(A, "transcripts.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

rows = []
for p in glob.glob(os.path.join(A, "meta", "*", "*.info.json")):
    kind = os.path.basename(os.path.dirname(p))
    d = json.load(open(p, encoding="utf-8"))
    ud = d.get("upload_date")
    if not ud:
        continue
    up = date(int(ud[:4]), int(ud[4:6]), int(ud[6:]))
    v = d.get("view_count") or 0
    t = tx.get(d["id"], {})
    rows.append({
        "id": d["id"], "kind": kind, "title": d["title"], "date": up.isoformat(),
        "views": v, "likes": d.get("like_count"), "comments": d.get("comment_count"),
        "duration": d.get("duration"), "age_days": max((TODAY - up).days, 1),
        "like_rate": round((d.get("like_count") or 0) / v * 100, 2) if v else None,
        "comment_rate": round((d.get("comment_count") or 0) / v * 1000, 2) if v else None,
        "tags": d.get("tags") or [], "description": (d.get("description") or "")[:400],
        "chapters": [c.get("title") for c in (d.get("chapters") or [])],
        "thumb": os.path.relpath(p.replace(".info.json", ".jpg"), A).replace("\\", "/"),
        "subs": d.get("channel_follower_count"),
        "has_transcript": bool(t), "wpm": t.get("wpm"),
        "hook_15s": t.get("hook_15s"), "hook_60s": t.get("hook_60s"),
    })
rows.sort(key=lambda r: r["date"])

for kind in ("videos", "shorts", "streams"):
    ks = [r for r in rows if r["kind"] == kind]
    for i, r in enumerate(ks):
        prev = [x["views"] for x in ks[max(0, i - 10):i]]
        base = statistics.median(prev) if prev else None
        r["baseline"] = base
        r["multiple"] = round(r["views"] / base, 2) if base else None

json.dump(rows, open(os.path.join(A, "dataset.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

print(f"{len(rows)} uploads, {sum(r['has_transcript'] for r in rows)} with transcripts, subs={rows[-1]['subs'] if rows else None}")
for kind in ("videos", "shorts", "streams"):
    ks = [r for r in rows if r["kind"] == kind]
    if not ks:
        continue
    vs = [r["views"] for r in ks]
    print(f"\n== {kind}: n={len(ks)} total={sum(vs):,} median={statistics.median(vs):,.0f}")
    for r in sorted(ks, key=lambda r: -r["views"])[:15]:
        print(f"{r['views']:>9,} x{r['multiple'] or 0:>6} {r['date']} {(r['duration'] or 0)//60:>3}m L%{r['like_rate']} C/k{r['comment_rate']} | {r['title'][:80]}")

print("\n== long-form timeline")
for r in [r for r in rows if r["kind"] == "videos"]:
    print(f"{r['date']} {r['views']:>9,} x{r['multiple'] or 0:>6} {(r['duration'] or 0)//60:>3}m {r['wpm'] or '-':>6}wpm | {r['title'][:78]}")
