"""Parse YouTube auto-caption .vtt files into word-timed text + hook excerpts."""
import glob, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TS = re.compile(r"(\d+):(\d+):(\d+\.\d+)")
CUE = re.compile(r"^(\d+:\d+:\d+\.\d+) --> ")
WORD = re.compile(r"<(\d+:\d+:\d+\.\d+)><c>\s*([^<]*)</c>")


def secs(s):
    h, m, x = TS.match(s).groups()
    return int(h) * 3600 + int(m) * 60 + float(x)


def parse(path):
    words = []  # (time, word)
    cue_start = None
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")
            m = CUE.match(line)
            if m:
                cue_start = secs(m.group(1))
                continue
            if "<c>" in line:
                first = line.split("<", 1)[0].strip()
                if first:
                    words.append((cue_start, first))
                for t, w in WORD.findall(line):
                    w = w.strip()
                    if w:
                        words.append((secs(t), w))
    return words


def text_between(words, a, b):
    return " ".join(w for t, w in words if a <= t < b)


out = []
for p in sorted(glob.glob(os.path.join(ROOT, "transcripts", "*.vtt"))):
    words = parse(p)
    if not words:
        continue
    dur = words[-1][0]
    title = os.path.basename(p).replace(".en.vtt", "")
    out.append({
        "file_title": title,
        "words": len(words),
        "duration_s": round(dur),
        "wpm": round(len(words) / (dur / 60), 1) if dur else None,
        "hook_15s": text_between(words, 0, 15),
        "hook_60s": text_between(words, 0, 60),
        "outro_45s": text_between(words, dur - 45, dur + 1),
        "full": " ".join(w for _, w in words),
    })

with open(os.path.join(ROOT, "analysis", "transcripts.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(len(out), "transcripts parsed")
