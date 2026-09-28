"""Measure how often the picture changes, from frames/<id>/g5.npz (grey 192x108 @ 5 fps).

Per 0.2 s step the frame is split into a 16x9 grid (12x12-px cells, each cell = 1/144 of the frame).
A cell 'changes' if its mean absolute grey difference from the previous frame > CELL_T.
  - CUT  : >= CUT_F of all cells change in one step (abrupt replacement of the picture;
           steps within 1 s are merged into one cut, so a wipe/crossfade counts once).
  - AMBIENT cells: cells that change in >= AMB_F of all steps (face-cam, idle mascot, looping bg).
  - BEAT : onset of change in >= BEAT_N non-ambient cells after >= QUIET s with no non-ambient change
           (an element pops in, moves, highlights...). Continuous motion = one long beat.
  - STILL: step with no non-ambient cell changing.  FULL-STILL: no cell changing at all.
Writes results.json and prints a table.  python tools/analyze.py [id ...] [--debug id start_s dur_s]
"""
import glob, json, os, sys
import numpy as np
from scipy import ndimage

ROOT = r"C:/Users/ganes/Desktop/New Channel/research/pacing"
GX, GY, CS = 16, 9, 12
FPS = 5
CELL_T = 3.0     # mean abs grey diff per 12x12 cell (0-255) -- see calibrate notes in REPORT
CUT_F = 0.45
AMB_F = 0.70
BEAT_N = 2
QUIET = 0.6      # seconds of no (non-ambient) change before a new beat counts


def cellgrid(g):
    d = np.abs(g[1:].astype(np.int16) - g[:-1].astype(np.int16)).astype(np.float32)
    return d.reshape(len(d), GY, CS, GX, CS).mean(axis=(2, 4))  # (T-1, 9, 16)


def runs(mask):
    """lengths (in steps) of True-runs"""
    out = []; n = 0
    for m in mask:
        if m: n += 1
        elif n: out.append(n); n = 0
    if n: out.append(n)
    return out


def analyse(vid, skip_s=1.0, ignore=None):
    z = np.load(f"{ROOT}/frames/{vid}/g5.npz")
    g = z["g"][int(skip_s * FPS):]
    d = cellgrid(g)
    ch = d > CELL_T                                   # changed cells per step
    frac = ch.mean(axis=(1, 2))
    amb = ch.mean(axis=0) >= AMB_F                    # ambient cells
    if ignore is not None:
        amb = amb | ignore
    na = ch & ~amb
    na_n = na.sum(axis=(1, 2))
    # cuts
    cut_steps = np.where(frac >= CUT_F)[0]
    cuts = []
    for s in cut_steps:
        if not cuts or s - cuts[-1][-1] > FPS:        # merge within 1 s
            cuts.append([s])
        else:
            cuts[-1].append(s)
    cut_t = [c[0] / FPS for c in cuts]
    cut_set = set(x for c in cuts for s in c for x in range(s - 2, s + FPS + 1))
    # beats (onsets after quiet)
    q = int(QUIET * FPS)
    moving = na_n >= BEAT_N
    beat_t = []
    quiet_run = q
    for i, m in enumerate(moving):
        if m:
            if quiet_run >= q and i not in cut_set:
                beat_t.append(i / FPS)
            quiet_run = 0
        else:
            quiet_run += 1
    ev = sorted(cut_t + beat_t)
    still = na_n == 0
    full_still = ch.sum(axis=(1, 2)) == 0
    holds = np.array(runs(still)) / FPS
    # things moving at once: connected blobs of changed cells in steps with change (excluding cuts)
    blobs = []
    for i in range(len(ch)):
        if i in cut_set or not moving[i]:
            continue
        lab, n = ndimage.label(ch[i], structure=np.ones((3, 3)))
        blobs.append(n)
    T = len(ch) / FPS
    off = skip_s + float(z["start"]) + 1.0 / FPS
    # where is the longest still hold
    best = (0, 0); n = 0
    for i, m in enumerate(still):
        n = n + 1 if m else 0
        if n > best[0]: best = (n, i - n + 1)

    def med_gap(t):
        return float(np.median(np.diff(t))) if len(t) > 2 else None
    return dict(
        seconds=round(T, 1),
        cuts_per_min=round(60 * len(cut_t) / T, 2), median_s_between_cuts=med_gap(cut_t),
        beats_per_min=round(60 * len(beat_t) / T, 2),
        changes_per_min=round(60 * len(ev) / T, 2), median_s_between_changes=med_gap(ev),
        p75_s_between_changes=float(np.percentile(np.diff(ev), 75)) if len(ev) > 2 else None,
        share_still=round(float(still.mean()), 3), share_full_still=round(float(full_still.mean()), 3),
        ambient_share_of_frame=round(float(amb.mean()), 3),
        still_hold_median_s=float(np.median(holds)) if len(holds) else 0,
        still_holds_ge5s=int((holds >= 5).sum()), still_holds_ge10s=int((holds >= 10).sum()),
        longest_still_s=float(holds.max()) if len(holds) else 0,
        blobs_moving_median=float(np.median(blobs)) if blobs else 0,
        blobs_moving_p90=float(np.percentile(blobs, 90)) if blobs else 0,
        longest_still_at=round(best[1] / FPS + off, 1),
        cut_times=[round(t + off, 1) for t in cut_t], beat_times=[round(t + off, 1) for t in beat_t],
    )


def debug(vid, start, dur):
    z = np.load(f"{ROOT}/frames/{vid}/g5.npz")
    g = z["g"]
    d = cellgrid(g)
    ch = d > CELL_T
    amb = ch.mean(axis=0) >= AMB_F
    for i in range(int(start * FPS), int((start + dur) * FPS)):
        n = ch[i].sum(); na = (ch[i] & ~amb).sum()
        print(f"{(i+1)/FPS:6.1f}s  all={n:3d} nonamb={na:3d}  maxd={d[i].max():5.1f} meand={d[i].mean():4.1f} "
              + ("CUT" if n / 144 >= CUT_F else "") + " " + "#" * min(60, n))


def main():
    a = sys.argv[1:]
    if a and a[0] == "--debug":
        debug(a[1], float(a[2]), float(a[3])); return
    ids = a or sorted(os.path.basename(os.path.dirname(p)) for p in glob.glob(f"{ROOT}/frames/*/g5.npz"))
    res = json.load(open(f"{ROOT}/results.json")) if os.path.exists(f"{ROOT}/results.json") else {}
    for v in ids:
        r = analyse(v)
        res[v] = r
        print(v, {k: x for k, x in r.items() if not k.endswith("_times")})
        if v.startswith("ours"):   # second pass with Wil's box (x 1450-1830, y 600-1050) masked
            ig = np.zeros((GY, GX), bool); ig[5:9, 12:16] = True
            r = analyse(v, ignore=ig); res[v + "_noWil"] = r
            print(v + "_noWil", {k: x for k, x in r.items() if not k.endswith("_times")})
    json.dump(res, open(f"{ROOT}/results.json", "w"), indent=1)


if __name__ == "__main__":
    main()
