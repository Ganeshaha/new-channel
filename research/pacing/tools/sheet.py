"""Contact sheets from frames/<id>/c1/NNNN.jpg (1 fps colour, 426x240).
python tools/sheet.py even <id> [n=20]          -> sheets/<id>_even.jpg   (n frames evenly spaced)
python tools/sheet.py seq <id> <start_s> [n=12] [step_s=1]  -> sheets/<id>_seq<start>.jpg (n consecutive seconds)
Timestamps printed on each tile are seconds into the original video."""
import glob, json, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = r"C:/Users/ganes/Desktop/New Channel/research/pacing"
TW, TH = 320, 180
try:
    FONT = ImageFont.truetype("arial.ttf", 16)
except Exception:
    FONT = ImageFont.load_default()


def make(vid, idx, out, cols=4, title=""):
    meta = json.load(open(f"{ROOT}/meta/{vid}.json", encoding="utf-8"))
    off = meta.get("section", [0])[0] or 0
    files = sorted(glob.glob(f"{ROOT}/frames/{vid}/c1/*.jpg"))
    idx = [i for i in idx if 0 <= i < len(files)]
    rows = (len(idx) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (TW + 4) + 4, rows * (TH + 4) + 4 + 28), "#222")
    dr = ImageDraw.Draw(sheet)
    dr.text((6, 5), (title or f"{vid}  {meta.get('title','')[:60]}  views={meta.get('views')}"), fill="white", font=FONT)
    for k, i in enumerate(idx):
        im = Image.open(files[i]).convert("RGB").resize((TW, TH))
        x = 4 + (k % cols) * (TW + 4); y = 32 + (k // cols) * (TH + 4)
        sheet.paste(im, (x, y))
        t = off + i  # frame i (0-based) at ~i+0.5 s into section
        dr.rectangle((x, y, x + 58, y + 20), fill="black")
        dr.text((x + 3, y + 2), f"{int(t)//60}:{int(t)%60:02d}", fill="yellow", font=FONT)
    sheet.save(out, quality=85)
    return out


if __name__ == "__main__":
    mode, vid = sys.argv[1], sys.argv[2]
    files = sorted(glob.glob(f"{ROOT}/frames/{vid}/c1/*.jpg"))
    if mode == "even":
        n = int(sys.argv[3]) if len(sys.argv) > 3 else 20
        idx = [int(i * (len(files) - 1) / (n - 1)) for i in range(n)]
        print(make(vid, idx, f"{ROOT}/sheets/{vid}_even.jpg"))
    else:
        meta = json.load(open(f"{ROOT}/meta/{vid}.json", encoding="utf-8"))
        off = meta.get("section", [0])[0] or 0
        s = int(float(sys.argv[3])); n = int(sys.argv[4]) if len(sys.argv) > 4 else 12
        step = int(sys.argv[5]) if len(sys.argv) > 5 else 1
        idx = list(range(s - off, s - off + n * step, step))
        print(make(vid, idx, f"{ROOT}/sheets/{vid}_seq{s}.jpg"))
