"""Draw measured boxes onto frames for visual QA: debug_overlay.py out.jpg frame1 frame2 ..."""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from measure import measure, ROOT
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
tiles = []
for f in files:
    ch = f.replace("\\", "/").split("/")[-2]
    r, _ = measure(f, ch)
    im = Image.open(f).convert("RGB").resize((r["W"], r["H"]))
    d = ImageDraw.Draw(im)
    W, H = r["W"], r["H"]
    if "m_left" in r:
        d.rectangle([r["m_left"] * W / 100, r["m_top"] * H / 100, W - r["m_right"] * W / 100, H - r["m_bottom"] * H / 100], outline=(0, 200, 255), width=2)
    for b in r.get("card_boxes", []):
        d.rectangle(b, outline=(255, 0, 0), width=4)
    for b in r.get("text_boxes", []):
        d.rectangle(b, outline=(0, 180, 0), width=2)
    txt = f"paper={r['paper']} ink={r['ink']} el={r.get('elements')} cards={r.get('cards')} ch={[round(x) for x in r.get('card_h', [])]} lines={r.get('text_lines')} caps={[round(x,1) for x in r.get('text_caps', [])][:6]}"
    d.rectangle([0, 0, W, 22], fill=(0, 0, 0)); d.text((4, 4), os.path.basename(f) + "  " + txt, fill=(255, 255, 0))
    tiles.append(im.resize((640, 360)))
cols = 2; rows = (len(tiles) + 1) // 2
S = Image.new("RGB", (cols * 644, rows * 364), (40, 40, 40))
for i, t in enumerate(tiles):
    S.paste(t, ((i % cols) * 644, (i // cols) * 364))
S.save(out, quality=85)
