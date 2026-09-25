"""Pacing check on a render: stretches with no new visual beat, blank frames, and contact sheets.

    python scripts/qa_pacing.py ../episodes/002-.../render/x.mp4 ep002 [--sheets OUTDIR]

- "static": 4 s or more where nothing outside Wil's corner changes (target: a new beat every 2-4 s).
- "blank": 1 s or more with an empty stage (Wil's corner masked).
- --sheets writes 4x4 contact sheets (one frame every 2.5 s) for an overlap review.
Tip: render a fast 1/4-scale preview first: npx remotion render Ep002 out.mp4 --scale=0.25
"""
import glob, json, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image

video, ep = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t = json.load(open(os.path.join(ROOT, "src", "episodes", ep, "timing.json"), encoding="utf-8"))
tmp = tempfile.mkdtemp()
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", video, "-vf", "fps=4,scale=480:270", os.path.join(tmp, "f%05d.png")], check=True)


def secof(x):
    for s in t["sections"]:
        if s["start"] - 0.2 <= x <= s["end"] + 0.45:
            return s["id"]
    return "end screen"


prev, last, runs, blank = None, 0, [], []
for i, f in enumerate(sorted(glob.glob(os.path.join(tmp, "f*.png")))):
    g = np.asarray(Image.open(f).convert("L")).astype(np.int16)
    h, w = g.shape
    g[int(h * 0.44):, int(w * 0.75):] = 255  # Wil's corner
    if (g < 225).mean() < 0.004:
        blank.append(i / 4)
    if prev is not None and (np.abs(g - prev) > 30).mean() > 0.004:
        if (i - last) / 4 >= 4.0:
            runs.append((last / 4, i / 4))
        last = i
    prev = g
for a, b in runs:
    print(f"  static {a:6.1f}-{b:6.1f}  {b - a:4.1f}s  {secof(a)}")
print("static >=4s:", len(runs))
br, st = [], None
for x in blank:
    if st is None:
        st = [x, x]
    elif x - st[1] <= 0.26:
        st[1] = x
    else:
        if st[1] - st[0] >= 1:
            br.append(tuple(st))
        st = [x, x]
if st and st[1] - st[0] >= 1:
    br.append(tuple(st))
print("blank >=1s:", br)
if "--sheets" in sys.argv:
    out = sys.argv[sys.argv.index("--sheets") + 1]
    os.makedirs(out, exist_ok=True)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", video, "-vf",
                    "fps=0.4,scale=480:270,pad=484:274:2:2:black,tile=4x4", os.path.join(out, "sheet-%02d.png")], check=True)
    print("contact sheets in", out)
