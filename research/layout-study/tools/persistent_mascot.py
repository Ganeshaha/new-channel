"""Find a persistent on-screen character (mascot) per video: pixels that are 'ink' in >=60% of flat-page frames,
largest blob after dilation. Reports its bbox in % of frame. Writes data/persistent_mascot.json"""
import sys, os, glob, json, re
import numpy as np
from scipy import ndimage as ndi
sys.path.insert(0, os.path.dirname(__file__))
from measure import measure, ROOT, disk
out = {}
for ch in sys.argv[1:]:
    vids = sorted(set(re.sub(r"_\d+\.jpg$", "", os.path.basename(p)) for p in glob.glob(f"{ROOT}/frames/{ch}/*.jpg")))
    for v in vids:
        acc = None; k = 0
        for p in sorted(glob.glob(f"{ROOT}/frames/{ch}/{v}_*.jpg")):
            r, m = measure(p, ch)
            if m is None: continue
            acc = m.astype(np.float32) if acc is None else acc + m; k += 1
        if not k: continue
        pm = acc / k >= 0.6
        lbl, n = ndi.label(ndi.binary_dilation(pm, structure=disk(8)))
        if n == 0:
            out[f"{ch}/{v}"] = None; continue
        sz = ndi.sum(pm, lbl, index=np.arange(1, n + 1))
        i = int(sz.argmax()) + 1
        ys, xs = np.nonzero((lbl == i) & pm)
        H, W = pm.shape
        out[f"{ch}/{v}"] = dict(frames=k, x0=round(100 * xs.min() / W, 1), x1=round(100 * xs.max() / W, 1), y0=round(100 * ys.min() / H, 1), y1=round(100 * ys.max() / H, 1),
                                 h=round(100 * (ys.max() - ys.min()) / H, 1), w=round(100 * (xs.max() - xs.min()) / W, 1), ink_px_pct=round(100 * sz.max() / (H * W), 2))
        print(ch, v, out[f"{ch}/{v}"], flush=True)
json.dump(out, open(f"{ROOT}/data/persistent_mascot.json", "w"), indent=1)
