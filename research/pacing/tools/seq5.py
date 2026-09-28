"""Sheet of consecutive frames at 5 fps from the downloaded clip: python tools/seq5.py <id> <video_time_s> [n=16] [fps=5]"""
import json, subprocess, sys, os, glob
from PIL import Image, ImageDraw, ImageFont
ROOT = r"C:/Users/ganes/Desktop/New Channel/research/pacing"
vid, t = sys.argv[1], float(sys.argv[2]); n = int(sys.argv[3]) if len(sys.argv) > 3 else 16
fps = float(sys.argv[4]) if len(sys.argv) > 4 else 5
meta = json.load(open(f"{ROOT}/meta/{vid}.json", encoding="utf-8"))
src = meta.get("local") or f"{ROOT}/clips/{vid}.mp4"
off = (meta.get("section") or [0])[0] or 0
tmp = f"{ROOT}/frames/{vid}/tmp5"; os.makedirs(tmp, exist_ok=True)
for f in glob.glob(tmp + "/*.jpg"): os.remove(f)
subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", str(t - off), "-i", src, "-vf", f"fps={fps},scale=320:180",
                "-frames:v", str(n), "-q:v", "3", tmp + "/%03d.jpg"])
fs = sorted(glob.glob(tmp + "/*.jpg")); cols = 4; rows = (len(fs) + 3) // 4
S = Image.new("RGB", (cols * 324 + 4, rows * 184 + 32), "#222"); d = ImageDraw.Draw(S)
F = ImageFont.truetype("arial.ttf", 16)
d.text((6, 6), f"{vid} {meta.get('title','')[:50]}  {fps:g} fps from {t:.1f}s", fill="white", font=F)
for k, f in enumerate(fs):
    x = 4 + (k % cols) * 324; y = 30 + (k // cols) * 184
    S.paste(Image.open(f), (x, y)); d.rectangle((x, y, x + 56, y + 20), fill="black")
    d.text((x + 3, y + 2), f"{t + k / fps:.1f}", fill="yellow", font=F)
out = f"{ROOT}/sheets/{vid}_5fps_{int(t)}.jpg"; S.save(out, quality=85); print(out)
