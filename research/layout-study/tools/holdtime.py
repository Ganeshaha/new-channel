"""How long a layout holds, from 1-fps 320-px frames in dense/<channel>/.
A 16x9 grid of cells; a cell 'changes' between consecutive seconds if its mean abs grey diff > 6.
 - event: >= 3 cells (2%) changed  -> something was added/removed/moved
 - major: >= 35% of cells changed   -> composition replaced (scene change)
For 'ours' a second pass ignores the mascot cells (Wil idles/animates constantly).
Writes holdtime.json."""
import glob, json, os, re
import numpy as np
from PIL import Image

ROOT = r"C:/Users/ganes/Desktop/New Channel/research/layout-study"
GX, GY = 16, 9


def cells(path):
    a = np.asarray(Image.open(path).convert("L").resize((320, 180)), dtype=np.float32)
    return a.reshape(GY, 180 // GY, GX, 320 // GX).mean(axis=(1, 3)), a


def occupancy(a):
    """16x9 grid: cell occupied if >3% of its pixels differ from the page colour (border mode)"""
    b = np.concatenate([a[:3].ravel(), a[-3:].ravel(), a[:, :3].ravel(), a[:, -3:].ravel()])
    vals, cnt = np.unique((b // 8).astype(int), return_counts=True)
    bg = b[(b // 8).astype(int) == vals[cnt.argmax()]].mean()
    m = np.abs(a - bg) > 38
    return m.reshape(GY, 180 // GY, GX, 320 // GX).mean(axis=(1, 3)) > 0.03


def analyse(files, ignore=None):
    prev = None; ev = []; maj = []; frac = []
    anchor = None; holds = []; start = 0; adds = 0
    prev_occ = None
    for i, f in enumerate(files):
        _, a = cells(f)
        occ = occupancy(a)
        if ignore is not None:
            occ = occ & ~ignore
        if anchor is None:
            anchor = occ; start = i
        else:
            u = (occ | anchor).sum(); j = (occ & anchor).sum() / u if u else 1.0
            if j < 0.5:
                holds.append(i - start); anchor = occ; start = i
        if prev_occ is not None and (occ & ~prev_occ).sum() >= 2:
            adds += 1
        prev_occ = occ
        if prev is not None:
            d = np.abs(a - prev).reshape(GY, 180 // GY, GX, 320 // GX).mean(axis=(1, 3))
            ch = d > 6
            if ignore is not None:
                ch = ch & ~ignore
            n = ch.sum() / (ch.size - (ignore.sum() if ignore is not None else 0))
            frac.append(float(n))
            if n >= 0.02: ev.append(i)
            if n >= 0.35: maj.append(i)
        prev = a
    secs = len(files)
    holds.append(len(files) - start)
    hl = np.array(holds[1:-1]) if len(holds) > 2 else np.array(holds)

    def gaps(ix):
        if len(ix) < 2:
            return []
        return list(np.diff(ix))
    return dict(seconds=secs, events=len(ev), events_per_min=60 * len(ev) / max(1, secs - 1),
                majors=len(maj), majors_per_min=60 * len(maj) / max(1, secs - 1),
                median_s_between_events=float(np.median(gaps(ev))) if len(ev) > 1 else None,
                median_s_between_majors=float(np.median(gaps(maj))) if len(maj) > 1 else None,
                layout_holds=len(hl), layout_hold_median_s=float(np.median(hl)) if len(hl) else None,
                layout_hold_p25_s=float(np.percentile(hl, 25)) if len(hl) else None, layout_hold_p75_s=float(np.percentile(hl, 75)) if len(hl) else None,
                layout_changes_per_min=60 * (len(holds) - 1) / max(1, secs - 1), element_adds_per_min=60 * adds / max(1, secs - 1),
                share_seconds_static=float(np.mean(np.array(frac) < 0.02)) if frac else None)


def main():
    out = {}
    for chdir in sorted(glob.glob(f"{ROOT}/dense/*")):
        ch = os.path.basename(chdir)
        vids = sorted(set(re.sub(r"_\d+\.jpg$", "", os.path.basename(p)) for p in glob.glob(f"{chdir}/*.jpg")))
        out[ch] = {}
        for v in vids:
            files = sorted(glob.glob(f"{chdir}/{v}_*.jpg"))
            if len(files) < 30:
                continue
            files = files[2:]  # skip section start (black/keyframe)
            out[ch][v] = analyse(files)
            if ch == "ours":
                ig = np.zeros((GY, GX), bool)
                # mascot zone x 1450-1830, y 600-1050 of 1920x1080
                ig[int(600 / 120):, int(1450 / 120):int(1830 / 120) + 1] = True
                out[ch][v + "_no_mascot"] = analyse(files, ig)
    json.dump(out, open(f"{ROOT}/holdtime.json", "w"), indent=1)
    for ch, vs in out.items():
        for v, r in vs.items():
            print(ch, v, {k: (round(x, 2) if isinstance(x, float) else x) for k, x in r.items()})


if __name__ == "__main__":
    main()
