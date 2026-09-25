"""List every visual cue in an episode whose words aren't in timing.json (run after any script edit).

    python scripts/qa_cues.py ep002

Checks `C(id, "phrase")` and `C("section", "phrase")` calls against the section's words.
Cues built from variables (e.g. `C(id, cueWord)`) aren't seen; check those by hand.
"""
import json, os, re, sys

ep = sys.argv[1] if len(sys.argv) > 1 else "ep002"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = os.path.join(ROOT, "src", "episodes", ep)
t = json.load(open(os.path.join(d, "timing.json"), encoding="utf-8"))
secs = {s["id"]: s for s in t["sections"]}
norm = lambda w: re.sub(r"[^a-z0-9']", "", w.lower().replace("’", "'"))


def has(sec, phrase):
    toks = [norm(w["w"]) for w in secs[sec]["words"]]
    tgt = [norm(x) for x in phrase.split() if norm(x)]
    return any(toks[i:i + len(tgt)] == tgt for i in range(len(toks)))


src = open(os.path.join(d, ep.capitalize() + ".tsx"), encoding="utf-8").read()
bad = []
for block in re.split(r"\n(?=const [A-Za-z_]+[:=])", src):
    m = re.search(r'const id = "([^"]+)"', block)
    bid = m.group(1) if m else None
    for mm in re.finditer(r'\bC\(\s*(id|"[^"]+")\s*,\s*"([^"]+)"', block):
        sec = bid if mm.group(1) == "id" else mm.group(1).strip('"')
        if sec not in secs:
            bad.append((sec, mm.group(2), "NO SECTION"))
        elif not has(sec, mm.group(2)):
            bad.append((sec, mm.group(2), "missing"))
for x in sorted(set(bad)):
    print(x)
print("missing cues:", len(bad))
sys.exit(1 if bad else 0)
