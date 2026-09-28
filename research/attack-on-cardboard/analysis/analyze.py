"""Join yt-dlp metadata with transcripts; compute breakout multiples and timeline."""
import glob, json, os, re, statistics
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, "analysis")
TODAY = date(2026, 9, 24)


def norm(s):
    s = s.translate(str.maketrans("：？｜＂／＊＜＞", ':?|"/*<>'))
    return re.sub(r"[^a-z0-9]", "", s.lower())


tx = {norm(t["file_title"]): t for t in json.load(open(os.path.join(A, "transcripts.json"), encoding="utf-8"))}

rows = []
for p in glob.glob(os.path.join(A, "meta", "*", "*.info.json")):
    kind = os.path.basename(os.path.dirname(p))
    d = json.load(open(p, encoding="utf-8"))
    ud = d.get("upload_date")
    if not ud:
        continue
    up = date(int(ud[:4]), int(ud[4:6]), int(ud[6:]))
    age = max((TODAY - up).days, 1)
    v = d.get("view_count") or 0
    t = tx.get(norm(d["title"]))
    rows.append({
        "id": d["id"], "kind": kind, "title": d["title"], "date": up.isoformat(),
        "views": v, "likes": d.get("like_count"), "comments": d.get("comment_count"),
        "duration": d.get("duration"), "age_days": age,
        "like_rate": round((d.get("like_count") or 0) / v * 100, 2) if v else None,
        "comment_rate": round((d.get("comment_count") or 0) / v * 1000, 2) if v else None,
        "tags": d.get("tags") or [], "description": (d.get("description") or "")[:400],
        "thumb": os.path.relpath(p.replace(".info.json", ".jpg"), A).replace("\\", "/"),
        "subs": d.get("channel_follower_count"),
        "has_transcript": bool(t), "wpm": t and t["wpm"], "hook_15s": t and t["hook_15s"],
        "hook_60s": t and t["hook_60s"],
    })

rows.sort(key=lambda r: r["date"])

# Breakout multiple: views vs median of the previous 10 uploads of the same kind.
for kind in ("videos", "shorts", "streams"):
    ks = [r for r in rows if r["kind"] == kind]
    for i, r in enumerate(ks):
        prev = [x["views"] for x in ks[max(0, i - 10):i]]
        base = statistics.median(prev) if prev else None
        r["baseline"] = base
        r["multiple"] = round(r["views"] / base, 2) if base else None

json.dump(rows, open(os.path.join(A, "dataset.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

matched = sum(r["has_transcript"] for r in rows)
print(f"{len(rows)} uploads, {matched} matched to transcripts, subs={rows[-1]['subs']}")
for kind in ("videos", "shorts", "streams"):
    ks = [r for r in rows if r["kind"] == kind]
    if not ks:
        continue
    vs = [r["views"] for r in ks]
    print(f"\n== {kind}: n={len(ks)} total={sum(vs):,} median={statistics.median(vs):,.0f}")
    for r in sorted(ks, key=lambda r: -r["views"])[:15]:
        print(f"{r['views']:>9,} x{r['multiple'] or 0:>6} {r['date']} {r['duration'] or 0:>5}s L%{r['like_rate']} C/k{r['comment_rate']} | {r['title'][:85]}")

print("\n== long-form timeline (date, views, multiple)")
for r in [r for r in rows if r["kind"] == "videos"]:
    print(f"{r['date']} {r['views']:>9,} x{r['multiple'] or 0:>6} {r['duration'] or 0:>5}s | {r['title'][:80]}")
