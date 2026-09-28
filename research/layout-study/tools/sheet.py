"""Contact sheet: sheet.py out.jpg cols img1 img2 ... (thumb 480 wide, labelled)"""
import sys
from PIL import Image, ImageDraw
import os
GRID = os.environ.get("GRID") == "1"
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
W = 480; H = 270; pad = 4
rows = (len(files) + cols - 1) // cols
S = Image.new("RGB", (cols * (W + pad), rows * (H + pad + 16)), (60, 60, 60))
d = ImageDraw.Draw(S)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((W, H))
    x = (i % cols) * (W + pad); y = (i // cols) * (H + pad + 16)
    if GRID:
        g = ImageDraw.Draw(im)
        for k in range(1, 10):
            g.line([(0, H * k / 10), (W, H * k / 10)], fill=(0, 200, 255) if k != 5 else (255, 0, 255), width=1)
            g.line([(W * k / 10, 0), (W * k / 10, H)], fill=(0, 200, 255) if k != 5 else (255, 0, 255), width=1)
    S.paste(im, (x, y + 16)); d.text((x + 2, y + 2), f.replace("\\", "/").split("/")[-1], fill=(255, 255, 0))
S.save(out, quality=85)
