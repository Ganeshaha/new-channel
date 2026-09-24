"""Bucket long-form uploads by format, print summaries, and export report/data.json."""
import json, os, re, statistics as st
from collections import defaultdict

A = os.path.dirname(os.path.abspath(__file__))
rows = json.load(open(os.path.join(A, "dataset.json"), encoding="utf-8"))

# First match wins, so the order matters. Duration-based buckets are applied before title patterns.
PATTERNS = [
    ("Correction / \"you're building it wrong\"", r"\bwrong\b|correct way|doesn't work|is not a|not the answer|top-heavy problem|another look|missing out|fixing the worst|identity crisis"),
    ("Budget / playgroup-stakes deck tech", r"\$|¢|destroying my group|losing to the same deck|angeriest|biggest commander deck|only edh deck"),
    ("New-commander deck tech", r"deck tech|commander|redefine|wholesaling|solved|needs a|is saving|interesting|enables|turns|best .* deck|voltron|beasts|spacecraft|insurance fraud"),
    ("EDH strategy guide", r"guide|you need to|stop playing|cards you can cut|evaluate|better commander player|planeswalkers|more fun|choices|edhrec|15 cards|ranking"),
]
MEME = r"sounds for focus|pov:|beyblade"


def bucket(r):
    t = r["title"].lower()
    if (r["duration"] or 0) >= 30 * 60:
        return "Long session (stream-style build, box opening, gameplay)"
    if re.search(MEME, t):
        return "Meme / skit"
    for name, pat in PATTERNS:
        if re.search(pat, t):
            return name
    return "Other"


longs = [r for r in rows if r["kind"] == "videos"]
for r in longs:
    r["bucket"] = bucket(r)
json.dump(rows, open(os.path.join(A, "dataset.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

by = defaultdict(list)
for r in longs:
    by[r["bucket"]].append(r)
print("== Long-form by format")
for k, v in sorted(by.items(), key=lambda kv: -st.median(x["views"] for x in kv[1])):
    print(f"{k:58} n={len(v):>2} median={st.median(x['views'] for x in v):>8,.0f}")
    for x in sorted(v, key=lambda x: -x["views"])[:6]:
        print(f"        {x['views']:>8,} {x['date']} {x['title'][:70]}")

month = defaultdict(list)
for r in longs:
    month[r["date"][:7]].append(r)
print("\n== By upload month: uploads, median views, median length (min), median comments/1k")
for m, v in sorted(month.items()):
    print(m, f"{len(v):>2}", f"{st.median(x['views'] for x in v):>8,.0f}",
          f"{st.median((x['duration'] or 0) / 60 for x in v):>5.1f}",
          f"{st.median(x['comment_rate'] or 0 for x in v):>5.1f}")

short = [r for r in longs if (r["duration"] or 0) < 30 * 60]
print("\n== 5-15 min videos only:", len(short), "median", f"{st.median(x['views'] for x in short):,.0f}")
print("== 30+ min videos:", len(longs) - len(short), "median", f"{st.median(x['views'] for x in longs if (x['duration'] or 0) >= 1800):,.0f}")

os.makedirs(os.path.join(A, "report"), exist_ok=True)
groups = {"Correction / \"you're building it wrong\"": "fix", "Budget / playgroup-stakes deck tech": "budget", "New-commander deck tech": "new"}
json.dump({
    "pts": [{"d": r["date"], "v": r["views"], "g": groups.get(r["bucket"], "other"), "t": r["title"], "f": r["bucket"]} for r in longs],
    "fmt": sorted([{"f": k, "n": len(v), "m": st.median(x["views"] for x in v)} for k, v in by.items()], key=lambda x: -x["m"]),
    "qs": [{"q": m, "m": st.median(x["views"] for x in v), "n": len(v)} for m, v in sorted(month.items())],
}, open(os.path.join(A, "report", "data.json"), "w", encoding="utf-8"), ensure_ascii=False)
print("\nwrote report/data.json")
