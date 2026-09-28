"""Bucket long-form uploads by format and summarise performance per bucket and per month."""
import json, os, re, statistics
from collections import defaultdict

A = os.path.dirname(os.path.abspath(__file__))
rows = json.load(open(os.path.join(A, "dataset.json"), encoding="utf-8"))

RULES = [
    ("News / product / spoilers", r"compleated|commander decks or collector|announced at magiccon"),
    ("Unboxing / pack opening / vlog", r"unbox|opening|bundle opening|collector box|mail day|pax|the artist|compleat"),
    ("Tournament controversy (cheat/judge/lie)", r"did the winner|did he cheat|pro tour winner cheat|judge|morally|world championship|handshake|unhinged"),
    ("Rules change / update", r"rules? (change|update)|changed the rules|new rule|fixed|update\.\.\.|clarify|new mana abilities|new saga|april update"),
    ("Rules deep-dive / interaction", r"players get these"),
    ("Set mechanics roundup", r"mechanic"),
    ("Rules deep-dive / interaction", r"rules|interaction|explain|layers|apnap|\blie\b|arena|players get these|2025 guide|work\.\.\.|broken|combat"),
    ("News / product / spoilers", r"everything (about|you need to know about (fallout|the commander format))|announced|secret lair|special guest|booster|bans|buying|standard legal|panel|spoil|jump in|brackets? system|game changers"),
    ("Deckbuilding / commander / budget", r"commander|deck|budget|precon|cards|upgrade"),
]


def bucket(title):
    t = title.lower()
    for name, pat in RULES:
        if re.search(pat, t):
            return name
    return "Other"


longs = [r for r in rows if r["kind"] == "videos"]
for r in longs:
    r["bucket"] = bucket(r["title"])

by = defaultdict(list)
for r in longs:
    by[r["bucket"]].append(r)
print("== Long-form by format")
for k, v in sorted(by.items(), key=lambda kv: -statistics.median(x["views"] for x in kv[1])):
    vs = [x["views"] for x in v]
    print(f"{k:42} n={len(v):>2} median={statistics.median(vs):>8,.0f} mean={statistics.mean(vs):>8,.0f} max={max(vs):>8,}")
    for x in sorted(v, key=lambda x: -x["views"]):
        print(f"      {x['views']:>8,} {x['date']} {x['title'][:80]}")

print("\n== Uploads + views by upload year-quarter")
q = defaultdict(lambda: defaultdict(list))
for r in rows:
    y, m = r["date"][:4], int(r["date"][5:7])
    q[f"{y}-Q{(m - 1) // 3 + 1}"][r["kind"]].append(r["views"])
for k in sorted(q):
    parts = []
    for kind in ("videos", "shorts", "streams"):
        vs = q[k][kind]
        parts.append(f"{kind}:{len(vs):>2} ({sum(vs):>9,})")
    print(k, "  ".join(parts))

shorts = [r for r in rows if r["kind"] == "shorts"]
print("\nfirst short:", shorts[0]["date"], shorts[0]["title"][:70])
print("first stream:", [r for r in rows if r["kind"] == "streams"][0]["date"])

json.dump(rows, open(os.path.join(A, "dataset.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
