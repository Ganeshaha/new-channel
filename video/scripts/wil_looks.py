"""When Wil should glance at the stage: the moments new cards, callouts and titles land.

    python scripts/wil_looks.py <audit.log> src/episodes/ep002/looks.json

Reads the log the layout audit saves (scripts/qa_layout.py prints where) and writes a sorted list of
times. Wil (kit.tsx) turns his shades and head toward the stage at each one and points on every
other one, which pulls the viewer's eye to the new thing (instructor-gaze research, g = 0.33; see
research/youtube-general/REPORT.md). Looks are at least GAP seconds apart so he doesn't twitch, and
none lands while he's playing a library animation (that would be swallowed anyway).
Re-run after moving cues; Wil's own looks don't change the audit, so one audit pass is enough.
"""
import os, json, re, sys

FPS = 30
KINDS = {"card", "callout", "title", "sticker", "fig", "note"}  # never "face" or "wil"
GAP = float(os.environ.get("LOOK_GAP", 4.0))  # s between looks (2.2 s read as twitchy; ep003 uses 7 s, research/pacing)
DELAY = 0.15   # s after the element starts popping in


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    text = open(sys.argv[1], encoding="utf-8", errors="ignore").read()
    frames = {}
    for m in re.finditer(r"AUDIT (\d+) (\[.*?\]\])", text):
        try:
            frames[int(m.group(1))] = json.loads(m.group(2))
        except json.JSONDecodeError:
            pass
    first, wil_anim = {}, {}
    for f, rows in sorted(frames.items()):
        t = f / FPS
        for r in rows:
            kind, label, at, p = r[0], r[1], r[2], r[3]
            if kind == "wil":
                wil_anim[f] = label.startswith("anim:")
            elif kind in KINDS and label != "subscribe overlay" and p >= 0.3:
                key = (kind, re.sub(r"\d+", "#", label), round(at, 1))
                first.setdefault(key, t)
    arrivals = sorted(set(round(t + DELAY, 2) for t in first.values()))
    sampled = sorted(wil_anim)
    looks = []
    for t in arrivals:
        if looks and t - looks[-1] < GAP:
            continue
        near = min(sampled, key=lambda f: abs(f / FPS - t)) if sampled else None
        if near is None or abs(near / FPS - t) > 0.2 or wil_anim[near]:
            continue  # Wil isn't on stage yet, or he's mid-animation
        looks.append(t)
    json.dump(looks, open(sys.argv[2], "w"))
    print(f"{len(arrivals)} arrivals -> {len(looks)} looks -> {sys.argv[2]}")


if __name__ == "__main__":
    main()
