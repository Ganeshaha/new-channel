"""Close-up strips of Wil, for eyeballing his motion before a full render.

    python scripts/wil_closeups.py Ep002 out.png 14 48 101 [--secs 3]

For each start time it renders `secs` seconds at 10 frames a second, crops around Wil (his corner
spot; centre stage before he walks over) and tiles everything into one sheet, one row per stretch,
time-stamped. Look for: brows popping in and out, the same dip on every word, stiff or snapping
poses, a face that changes mood without a reason, anything off the card (stray mouths, arcs).
The numeric side of the same check is qa_layout.py (WIL FACE FLICKER, WIL REACTIONS TOO CLOSE,
WIL EXPRESSION PLAN). Run both before every full render.
"""
import glob, os, subprocess, sys, tempfile
from PIL import Image, ImageDraw

FPS = 30
CORNER = (1450, 560, 1830, 1060)   # Wil at home (x 1640, y 820, scale 1.25)
CENTRE = (740, 300, 1180, 1000)    # Wil centre-stage during the intro
SLIDE = (740, 300, 1830, 1060)     # while he slides from centre to his corner
TILE = 220                         # px per tile
PER_ROW = 15


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    secs = float(sys.argv[sys.argv.index("--secs") + 1]) if "--secs" in sys.argv else 3.0
    if "--secs" in sys.argv:
        args.remove(sys.argv[sys.argv.index("--secs") + 1])
    if len(args) < 3:
        sys.exit(__doc__)
    comp, out, starts = args[0], args[1], [float(x) for x in args[2:]]
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    rows = []
    for st in starts:
        tmp = tempfile.mkdtemp()
        f0, f1 = int(st * FPS), int((st + secs) * FPS) - 1
        subprocess.run(f'npx remotion render {comp} "{tmp}" --sequence --frames={f0}-{f1} --image-format=jpeg --scale=0.5',
                       cwd=root, shell=True, capture_output=True)
        frames = sorted(glob.glob(os.path.join(tmp, "*.jpeg")) + glob.glob(os.path.join(tmp, "*.jpg")))[::3]
        tiles = []
        for k, f in enumerate(frames):
            t = st + k * 3 / FPS
            box = CENTRE if t < 13.3 else SLIDE if t < 14.4 else CORNER
            im = Image.open(f).crop(tuple(v // 2 for v in box))
            im.thumbnail((TILE, 290))
            pad = Image.new("RGB", (TILE, 290), "white")
            pad.paste(im, ((TILE - im.width) // 2, 290 - im.height))
            im = pad
            ImageDraw.Draw(im).text((3, 2), f"{t:.1f}", fill=(0, 0, 0))
            tiles.append(im)
        rows += [tiles[i:i + PER_ROW] for i in range(0, len(tiles), PER_ROW)]
    w = TILE * max(len(r) for r in rows)
    h = sum(max(t.height for t in r) for r in rows)
    sheet = Image.new("RGB", (w, h), "white")
    y = 0
    for r in rows:
        for k, t in enumerate(r):
            sheet.paste(t, (k * TILE, y))
        y += max(t.height for t in r)
    sheet.save(out)
    print(f"{len(rows)} strips -> {out}")


if __name__ == "__main__":
    main()
