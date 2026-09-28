"""Download a 5-minute low-res section of each picked video and extract frames.
Frames: frames/<channel>/<id>_NNN.jpg at 1 per 6 s (layout metrics)
        dense/<channel>/<id>_NNN.jpg at 1 per 1 s, 320 px wide (layout hold-time)
Falls back to storyboard sprites if media download fails."""
import json, os, subprocess, sys, time, glob, re
from PIL import Image
ROOT = r"C:/Users/ganes/Desktop/New Channel/research/layout-study"
CLIPS = os.environ.get("CLIPS", r"C:/Users/ganes/AppData/Local/Temp/claude/layout_clips")
os.makedirs(CLIPS, exist_ok=True)
YTDLP = ["py", "-3.12", "-m", "yt_dlp", "--no-update", "--no-playlist", "--encoding", "utf-8"]
picks = json.load(open(f"{ROOT}/lists/picks.json", encoding="utf-8"))
log = open(f"{ROOT}/lists/fetch_log.txt", "a", encoding="utf-8")
def L(*a):
    s = " ".join(str(x) for x in a); print(s, flush=True); log.write(s + "\n"); log.flush()

def storyboard(ch, vid):
    url = f"https://www.youtube.com/watch?v={vid}"
    out = f"{CLIPS}/{vid}_sb"
    os.makedirs(out, exist_ok=True)
    info = subprocess.run(YTDLP + ["-J", url], capture_output=True, text=True, encoding="utf-8", errors="replace")
    try:
        sbs = [f for f in json.loads(info.stdout)["formats"] if f["format_id"].startswith("sb")]
        fm = max(sbs, key=lambda f: f.get("width") or 0)
    except Exception as e:
        L("  storyboard info fail", e); return 0
    r = subprocess.run(YTDLP + ["-f", fm["format_id"], "-o", f"{out}/sb.%(ext)s", url], capture_output=True, text=True, encoding="utf-8", errors="replace")
    import email, io
    for mh in glob.glob(f"{out}/*.mhtml"):
        msg = email.message_from_binary_file(open(mh, "rb"))
        k = 0
        for part in msg.walk():
            if part.get_content_maintype() == "image":
                k += 1; open(f"{out}/sheet_{k:03d}.jpg", "wb").write(part.get_payload(decode=True))
    cols, rows, w, h = fm["columns"], fm["rows"], fm["width"], fm["height"]
    fps = fm.get("fps") or 0
    sheets = sorted(glob.glob(f"{out}/sheet_*.jpg"))
    L("  sb0", cols, rows, w, h, len(sheets))
    od = f"{ROOT}/frames/{ch}"; os.makedirs(od, exist_ok=True)
    n = 0
    for s in sheets:
        im = Image.open(s).convert("RGB")
        for yy in range(rows):
            for xx in range(cols):
                t = im.crop((xx*w, yy*h, xx*w+w, yy*h+h))
                if t.getbbox() is None: continue
                n += 1; t.save(f"{od}/{vid}_sb{n:03d}.jpg", quality=92)
    return n

def fetch(ch, vid, dur):
    od = f"{ROOT}/frames/{ch}"; dd = f"{ROOT}/dense/{ch}"
    os.makedirs(od, exist_ok=True); os.makedirs(dd, exist_ok=True)
    if glob.glob(f"{od}/{vid}_*.jpg"):
        L("  skip (have frames)", vid); return "have"
    url = f"https://www.youtube.com/watch?v={vid}"
    clip = f"{CLIPS}/{vid}.mp4"
    start = 60; end = min(360, int(dur) - 10) if dur else 360
    for attempt in range(2):
      if os.path.exists(clip): break
      if attempt: time.sleep(8)
      r = subprocess.run(YTDLP + ["-f", "bv*[height<=720][ext=mp4]/bv*[height<=720]", "--download-sections", f"*{start}-{end}",
                                    "-o", clip, url], capture_output=True, text=True, encoding="utf-8", errors="replace")
      if r.returncode != 0 or not os.path.exists(clip):
            L("  media fail:", (r.stderr or "")[-400:].replace("\n", " | "))
    if not os.path.exists(clip):
            n = storyboard(ch, vid); L("  storyboard frames", n); return f"sb{n}"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", clip, "-vf", "fps=1/6", "-q:v", "2", f"{od}/{vid}_%03d.jpg"])
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", clip, "-vf", "fps=1,scale=320:-2", "-q:v", "4", f"{dd}/{vid}_%03d.jpg"])
    n = len(glob.glob(f"{od}/{vid}_*.jpg"))
    L("  frames", n); return f"media{n}"

only = sys.argv[1:]  # optional channel filter
for ch, vids in picks.items():
    if only and ch not in only: continue
    for v in (vids[::-1] if os.environ.get("REVERSE") else vids):
        vid, title, views, dur = v
        L(f"[{ch}] {vid} {title[:50]}")
        try: fetch(ch, vid, dur)
        except Exception as e: L("  ERROR", e)
        time.sleep(4)
L("DONE")
