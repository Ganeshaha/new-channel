"""Bucket long-form uploads by format, print summaries, and export report/data.json."""
import json, os, re, statistics as st
from collections import defaultdict

A = os.path.dirname(os.path.abspath(__file__))
rows = json.load(open(os.path.join(A, "dataset.json"), encoding="utf-8"))

# First match wins, so the order matters.
PATTERNS = [
    ("Deck I built / deck showcase", r"\bi built|how i built|built a deck|my playgroup|most (complicated|powerful|difficult)|i spent two years|deck breakdown|how i failed|why i built|deck is \$"),
    ("Community challenge", r"challenge|given three|i challenged"),
    ("Precon / product / set critique", r"precon|sets feel|core set|lorehold|hybrid mana|wotc|reviews"),
    ("Channel / community meta", r"channel updates|controversial video|r/edh"),
    ("Contrarian concept essay", r"problem with|trap|curse|wrong|misunderstood|forgotten|don't|doesn't|strange|subtle|hidden|difficult reality|odd truth|debacle|dark side|era of|defense|impossible|stop |effect|conundrum|ideology|matter|ethical|lessons|is the|is gonti|what is going on|too much|fail"),
    ("How-to guide", r"guide|how to|when \(not\)|art of|weird trick|way to|mistakes|reasons|deserves|rules for|question that|sauce|okay to|more lands"),
]
CHART_GROUP = {"How-to guide": "guide", "Contrarian concept essay": "essay", "Deck I built / deck showcase": "deck"}


def bucket(title):
    t = title.lower()
    for name, pat in PATTERNS:
        if re.search(pat, t):
            return name
    return "Card-specific / other"


longs = [r for r in rows if r["kind"] == "videos"]
for r in longs:
    r["bucket"] = bucket(r["title"])
json.dump(rows, open(os.path.join(A, "dataset.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

by = defaultdict(list)
for r in longs:
    by[r["bucket"]].append(r)
print("== Long-form by format")
for k, v in sorted(by.items(), key=lambda kv: -st.median(x["views"] for x in kv[1])):
    print(f"{k:34} n={len(v):>2} median={st.median(x['views'] for x in v):>9,.0f}")

year = defaultdict(list)
quarter = defaultdict(list)
for r in longs:
    y, m = r["date"][:4], int(r["date"][5:7])
    year[y].append(r["views"])
    quarter[f"{y} Q{(m - 1) // 3 + 1}"].append(r["views"])
print("\n== Median views by upload year")
for y, v in sorted(year.items()):
    print(y, len(v), f"{st.median(v):,.0f}")

os.makedirs(os.path.join(A, "report"), exist_ok=True)
json.dump({
    "pts": [{"d": r["date"], "v": r["views"], "g": CHART_GROUP.get(r["bucket"], "other"), "t": r["title"], "f": r["bucket"]} for r in longs],
    "fmt": sorted([{"f": k, "n": len(v), "m": st.median(x["views"] for x in v)} for k, v in by.items()], key=lambda x: -x["m"]),
    "qs": [{"q": k, "m": st.median(v), "n": len(v)} for k, v in sorted(quarter.items())],
}, open(os.path.join(A, "report", "data.json"), "w", encoding="utf-8"), ensure_ascii=False)
print("\nwrote report/data.json")
