"""Fetch a low-res (<=240p) section of each video and extract frames for pacing analysis.
No cookies. --sleep-requests 1 / --sleep-interval 2. Media -> research/pacing/clips (gitignore it).
Outputs per video:
  frames/<id>/g5.npz   grayscale 192x108 at 5 fps (analysis)
  frames/<id>/c1/NNNN.jpg  colour 1 fps, 426x240 (contact sheets)
  meta/<id>.json       views, duration, title, channel, section start/end
"""
import json, os, subprocess, sys, time, glob
import numpy as np

ROOT = r"C:/Users/ganes/Desktop/New Channel/research/pacing"
YT = ["py", "-3.12", "-m", "yt_dlp", "--no-update", "--no-playlist", "--encoding", "utf-8",
      "--sleep-requests", "1", "--sleep-interval", "2"]
PICKS = json.load(open(f"{ROOT}/picks.json", encoding="utf-8"))


def log(*a):
    s = " ".join(str(x) for x in a)
    print(s, flush=True)
    open(f"{ROOT}/fetch_log.txt", "a", encoding="utf-8").write(s + "\n")


def extract(src, vid, start=0.0):
    od = f"{ROOT}/frames/{vid}"
    os.makedirs(f"{od}/c1", exist_ok=True)
    W, H = 192, 108
    r = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", src, "-vf", f"fps=5,scale={W}:{H}:flags=area,format=gray",
                        "-f", "rawvideo", "-"], capture_output=True)
    a = np.frombuffer(r.stdout, np.uint8).reshape(-1, H, W)
    np.savez_compressed(f"{od}/g5.npz", g=a, start=start)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-vf", "fps=1,scale=426:240",
                    "-q:v", "3", f"{od}/c1/%04d.jpg"])
    return len(a)


def main():
    for p in PICKS:
        vid = p["id"]
        if os.path.exists(f"{ROOT}/frames/{vid}/g5.npz"):
            continue
        if p.get("local"):
            m = dict(p); m.update(section=[0, None])
            json.dump(m, open(f"{ROOT}/meta/{vid}.json", "w"), indent=1)
            n = extract(p["local"], vid)
            log(vid, "local frames", n)
            continue
        url = f"https://www.youtube.com/watch?v={vid}"
        info = subprocess.run(YT + ["--skip-download", "--dump-json", url], capture_output=True, text=True,
                              encoding="utf-8", errors="replace")
        try:
            j = json.loads(info.stdout)
        except Exception:
            log(vid, "META FAIL", (info.stderr or "")[-300:]); time.sleep(20); continue
        dur = j.get("duration") or 600
        s, e = (60, 360) if dur >= 400 else (30, max(60, dur - 10))
        meta = dict(id=vid, title=j.get("title"), channel=j.get("channel"), views=j.get("view_count"),
                    duration=dur, upload_date=j.get("upload_date"), group=p["group"], style=p["style"],
                    section=[s, e])
        sb = [f for f in j.get("formats", []) if str(f.get("format_id", "")).startswith("sb")]
        meta["storyboards"] = [dict(id=f["format_id"], w=f.get("width"), h=f.get("height"),
                                    fps=f.get("fps"), cols=f.get("columns"), rows=f.get("rows")) for f in sb]
        json.dump(meta, open(f"{ROOT}/meta/{vid}.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        clip = f"{ROOT}/clips/{vid}.mp4"
        for attempt in range(3):
            if os.path.exists(clip):
                break
            if attempt:
                time.sleep(15 * attempt)
            r = subprocess.run(YT + ["-f", "bv*[height<=240][ext=mp4]/bv*[height<=240]/worst",
                                     "--download-sections", f"*{s}-{e}", "-o", clip, url],
                               capture_output=True, text=True, encoding="utf-8", errors="replace")
            if not os.path.exists(clip):
                log(vid, "media fail", attempt, (r.stderr or "")[-300:].replace("\n", " | "))
                if "429" in (r.stderr or ""):
                    time.sleep(120)
        if not os.path.exists(clip):
            log(vid, "GIVE UP"); continue
        n = extract(clip, vid, s)
        log(vid, meta["views"], dur, "frames5", n, meta["title"][:50])
        time.sleep(3)
    log("DONE")


if __name__ == "__main__":
    main()
