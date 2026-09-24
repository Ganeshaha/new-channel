"""Build labelled thumbnail contact sheets: top vs bottom long-form, top shorts."""
import json, os
from PIL import Image, ImageDraw, ImageFont

A = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(A, "sheets")
os.makedirs(OUT, exist_ok=True)
rows = json.load(open(os.path.join(A, "dataset.json"), encoding="utf-8"))
try:
    FONT = ImageFont.truetype("arialbd.ttf", 22)
except OSError:
    FONT = ImageFont.load_default()


def sheet(items, name, cols=4, w=480):
    h = int(w * 9 / 16)
    cells = []
    for r in items:
        p = os.path.join(A, r["thumb"])
        if not os.path.exists(p):
            continue
        im = Image.open(p).convert("RGB")
        im = im.resize((w, int(im.height * w / im.width)))
        if im.height > h:  # centre-crop shorts / odd ratios
            top = (im.height - h) // 2
            im = im.crop((0, top, w, top + h))
        cell = Image.new("RGB", (w, h + 34), "black")
        cell.paste(im, (0, 0))
        ImageDraw.Draw(cell).text((6, h + 5), f"{r['views']:,} views  {r['date']}", fill="white", font=FONT)
        cells.append(cell)
    rows_n = (len(cells) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * w, rows_n * (h + 34)), "black")
    for i, c in enumerate(cells):
        canvas.paste(c, ((i % cols) * w, (i // cols) * (h + 34)))
    canvas.save(os.path.join(OUT, name), quality=85)
    print(name, len(cells))


longs = [r for r in rows if r["kind"] == "videos"]
shorts = [r for r in rows if r["kind"] == "shorts"]
by_views = sorted(longs, key=lambda r: -r["views"])
sheet(by_views[:12], "top_longform.jpg")
sheet(by_views[-12:], "bottom_longform.jpg")
sheet([r for r in by_views if r["date"] >= "2024-01-01"][-12:], "bottom_longform_since2024.jpg")
sheet(sorted(shorts, key=lambda r: -r["views"])[:8], "top_shorts.jpg", cols=4)
sheet(sorted(longs, key=lambda r: r["date"])[-8:], "recent_longform.jpg")
