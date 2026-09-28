"""Captions (SRT) from an episode's timing.json, for uploading to YouTube instead of burning them in.

    python scripts/make_srt.py src/episodes/ep002/timing.json ../episodes/002-one-card-infinite-precon/SUBS.srt

Uses the script's own words with the narration's word timings, so names and rule numbers are spelled
right (YouTube's auto-captions mangle card names, and auto-dubbing and translations start from these).
Each caption is at most 2 lines of 42 characters and 6 seconds. It breaks at sentence ends, at pauses
of 0.6 s or more, and at section boundaries.
"""
import json, sys

LINE = 42
MAX_SECS = 6.0
PAUSE = 0.6


def fmt(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


def wrap(words):
    """Two balanced lines if it doesn't fit on one."""
    text = " ".join(words)
    if len(text) <= LINE:
        return text
    best = None
    for i in range(1, len(words)):
        if len(words[i - 1]) == 2 and words[i - 1][0].isupper() and words[i - 1][1] == ".":
            continue  # keep "D. Card" together
        a, b = " ".join(words[:i]), " ".join(words[i:])
        if len(a) <= LINE and len(b) <= LINE:
            score = abs(len(a) - len(b))
            if best is None or score < best[0]:
                best = (score, a + "\n" + b)
    return best[1] if best else text


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    timing = json.load(open(sys.argv[1], encoding="utf-8"))
    cues = []
    for sec in timing["sections"]:
        cur = []
        for i, w in enumerate(sec["words"]):
            if cur:
                wrapped = wrap([x["w"] for x in cur + [w]])
                gap = w["s"] - cur[-1]["e"]
                too_long = any(len(line) > LINE for line in wrapped.splitlines())
                if too_long or w["e"] - cur[0]["s"] > MAX_SECS or gap >= PAUSE:
                    cues.append(cur)
                    cur = []
            cur.append(w)
            # end a caption on a sentence end once it has a few words
            initial = len(w["w"]) == 2 and w["w"][0].isupper()  # "Wil D. Card"
            if w["w"][-1:] in ".?!" and not initial and len(cur) >= 2:
                cues.append(cur)
                cur = []
        if cur:
            cues.append(cur)
    out = []
    for n, c in enumerate(cues):
        start = c[0]["s"]
        # hold a little after the last word, but never into the next caption
        end = max(c[-1]["e"] + 0.3, start + 1.0)  # at least a second, where the next caption allows
        if n + 1 < len(cues):
            end = min(end, cues[n + 1][0]["s"] - 0.02)
        out.append(f"{n + 1}\n{fmt(start)} --> {fmt(end)}\n{wrap([x['w'] for x in c])}\n")
    open(sys.argv[2], "w", encoding="utf-8").write("\n".join(out))
    print(f"{len(cues)} captions -> {sys.argv[2]}")


if __name__ == "__main__":
    main()
