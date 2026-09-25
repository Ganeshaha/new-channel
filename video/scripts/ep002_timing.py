"""Build src/episodes/ep002/timing.json from the episode script.

For now the timing is ESTIMATED from word lengths and punctuation (~200 wpm).
When the real narration exists, replace `estimate()` with word timestamps from
faster-whisper on the audio (same output format) and the whole video re-syncs.
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(ROOT, "..", "episodes", "002-one-card-infinite-precon", "SCRIPT.md")
OUT = os.path.join(ROOT, "src", "episodes", "ep002", "timing.json")
GAP = 0.45  # seconds of breathing room between sections


def sections():
    body = open(SCRIPT, encoding="utf-8").read().split("## Chapters")[0]
    out = []
    for sec in re.split(r"\n### ", body)[1:]:
        title = sec.splitlines()[0].split(" · ", 1)[1]
        lines = [l[1:].strip() for l in sec.splitlines() if l.startswith(">") and not l.startswith("> **") and not l.startswith("> -")]
        text = " ".join(re.sub(r"\[[^\]]*\]", "", l).replace("*", "") for l in lines).strip()
        if text:
            out.append((title, text))
    return out


def estimate(text, t0):
    words = []
    t = t0
    for w in text.split():
        dur = 0.2 + 0.028 * len(re.sub(r"[^\w]", "", w))
        words.append({"w": w, "s": round(t, 3), "e": round(t + dur, 3)})
        t += dur
        if w.endswith(("…", "...")):
            t += 0.45
        elif w[-1] in ".?!":
            t += 0.32
        elif w[-1] in ",:;":
            t += 0.12
    return words, t


def main():
    t = 0.3
    secs = []
    for i, (title, text) in enumerate(sections()):
        words, end = estimate(text, t)
        key = re.sub(r"[^a-z]+", "-", title.lower().split("(")[0]).strip("-")
        secs.append({"id": key, "title": title, "start": round(t, 3), "end": round(end, 3), "words": words})
        t = end + GAP
    data = {"source": "estimate", "fps": 30, "narrationEnd": round(t, 3), "sections": secs}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for s in secs:
        print(f"{s['start']:7.1f}-{s['end']:7.1f}s  {s['id']:34} {len(s['words'])} words")
    print(f"narration ends at {t:.1f}s")


if __name__ == "__main__":
    main()
