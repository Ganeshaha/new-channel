"""Print every tagged element's real on-screen box at given times, from a saved layout-audit log.

    python scripts/audit_boxes.py <audit.log> 112.5 [233.4 ...] [--grep KEEPS]

Use it to fix what qa_layout.py reports: it shows where things actually ended up after Fit scaling
and camera moves (left, top, right, bottom in 1920x1080 frame pixels, plus rotation and pop progress).
"""
import json, re, sys

FPS = 30


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    grep = sys.argv[sys.argv.index("--grep") + 1] if "--grep" in sys.argv else None
    if grep in args:
        args.remove(grep)
    if len(args) < 2:
        sys.exit(__doc__)
    text = open(args[0], encoding="utf-8", errors="ignore").read()
    frames = {}
    for m in re.finditer(r"AUDIT (\d+) (\[.*?\]\])", text):
        try:
            frames[int(m.group(1))] = json.loads(m.group(2))
        except json.JSONDecodeError:
            pass
    for t in map(float, args[1:]):
        f = min(frames, key=lambda k: abs(k - t * FPS))
        print(f"== t={f / FPS:.1f}s (frame {f})")
        for r in frames[f]:
            kind, label, at, p, left, top, w, h = r[:8]
            if grep and grep.lower() not in label.lower():
                continue
            print(f"  {kind:8} {label[:44]:44} x {left:5}-{left + w:5}  y {top:5}-{top + h:5}  rot {r[10]:5}  p {p:.2f}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
