"""Layout measurements for white-background frames.

python measure.py            -> measures every frames/<channel>/*.jpg, writes per_frame.jsonl + measurements.json
Frames are normalised to 1280x720 (storyboard frames keep their own size; text metrics skipped when < 640 px wide).
All sizes are reported as % of frame width (x) or height (y) unless the key says px1080 (pixels at 1920x1080).
"""
import glob, json, os, sys, re
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = r"C:/Users/ganes/Desktop/New Channel/research/layout-study"
W0, H0 = 1280, 720
# our mascot zone (1080p coords from the brief) scaled later
OUR_MASCOT_1080 = (1450, 600, 1830, 1050)


def load(path):
    im = Image.open(path).convert("RGB")
    if im.width >= 640:
        im = im.resize((W0, H0), Image.BILINEAR)
    return np.asarray(im).astype(np.int16)


def page_bg(a):
    b = 6
    border = np.concatenate([a[:b].reshape(-1, 3), a[-b:].reshape(-1, 3), a[:, :b].reshape(-1, 3), a[:, -b:].reshape(-1, 3)])
    q = (border // 8)
    key = q[:, 0] * 1024 + q[:, 1] * 32 + q[:, 2]
    vals, cnt = np.unique(key, return_counts=True)
    m = vals[cnt.argmax()]
    sel = border[key == m]
    return sel.mean(0), cnt.max() / len(key)


def disk(r):
    y, x = np.ogrid[-r:r + 1, -r:r + 1]
    return x * x + y * y <= r * r


def pca_rect(ys, xs):
    """side lengths (long, short) and angle of the best-fitting rectangle via second moments"""
    c = np.cov(np.vstack([xs, ys]).astype(np.float64))
    ev, evec = np.linalg.eigh(c)
    ev = np.clip(ev, 1e-6, None)
    L1, L2 = np.sqrt(12 * ev[1]), np.sqrt(12 * ev[0])
    v = evec[:, 1]
    ang = np.degrees(np.arctan2(v[1], v[0]))
    return L1, L2, ang


def edge_ok(lum, box):
    """MTG cards have a uniform frame border: the column just inside the left/right edge and the row just inside the top
    are near-constant. Photos / screenshots mostly are not. Needs 2 of 3 edges uniform."""
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    if bw < 12 or bh < 12:
        return False
    ins = max(2, int(0.012 * bw))
    ys = slice(y0 + int(0.1 * bh), y1 - int(0.1 * bh)); xs = slice(x0 + int(0.1 * bw), x1 - int(0.1 * bw))
    cols = [lum[ys, min(lum.shape[1] - 1, x0 + ins)], lum[ys, max(0, x1 - 1 - ins)], lum[min(lum.shape[0] - 1, y0 + ins), xs]]
    return sum(float(c.std()) < 32 for c in cols) >= 2


def find_cards(a, lum, filled_lbl, n_filled, dark_lbl, n_dark, H, W):
    cards = []
    minA = (0.07 * H) ** 2 * 0.716
    for lbl, n in ((filled_lbl, n_filled), (dark_lbl, n_dark)):
        if n == 0:
            continue
        objs = ndi.find_objects(lbl)
        areas = ndi.sum(np.ones_like(lbl), lbl, index=np.arange(1, n + 1))
        for i, sl in enumerate(objs):
            if sl is None or areas[i] < minA:
                continue
            sub = lbl[sl] == (i + 1)
            ys, xs = np.nonzero(sub)
            L1, L2, ang = pca_rect(ys, xs)
            asp = L2 / L1
            sol = areas[i] / (L1 * L2)
            region = a[sl][sub]
            l = lum[sl][sub]
            chroma = (region.max(1) - region.min(1)).mean()
            if l.std() < 28 or chroma < 14:
                continue
            y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
            bw, bh = x1 - x0, y1 - y0
            a_mod = abs(((ang + 90) % 180) - 90)  # 0 = long axis horizontal
            portrait = a_mod > 45
            tilt = 90 - a_mod if portrait else a_mod
            dk = (lum[y0:y1, x0:x1] < 75)
            if 0.655 <= asp <= 0.785 and 0.88 <= sol <= 1.10:
                if not portrait and tilt < 8:
                    # landscape: two touching portrait cards, or one sideways card? look for a dark seam near the middle
                    # a portrait card has its light text box in the lower half; a pair keeps that, a sideways card puts it left/right
                    lb = lum[y0:y1, x0:x1]
                    up, lo = lb[:int(0.45 * bh)].mean(), lb[int(0.55 * bh):].mean()
                    le, ri = lb[:, :int(0.45 * bw)].mean(), lb[:, int(0.55 * bw):].mean()
                    if (lo - up) > 12 and (lo - up) > abs(le - ri):
                        n_split, horiz = 2, True
                    else:
                        cards.append(dict(box=[int(x0), int(y0), int(x1), int(y1)], long=float(L1), short=float(L2),
                                          portrait=False, tilt=float(tilt), asp=float(asp), sol=float(sol), src="sideways"))
                        continue
                else:
                    if tilt < 2 and not edge_ok(lum, [x0, y0, x1, y1]):
                        continue
                    cards.append(dict(box=[int(x0), int(y0), int(x1), int(y1)], long=float(L1), short=float(L2),
                                      portrait=bool(portrait), tilt=float(tilt), asp=float(asp), sol=float(sol), src="single"))
                    continue
            else:
                # axis-aligned row / column of touching cards
                if areas[i] / (bw * bh) < 0.88:
                    continue
                rw = bw / (0.716 * bh); rc = bh / (bw / 0.716)
                if round(rw) >= 2 and abs(rw - round(rw)) < 0.14 * round(rw):
                    n_split, horiz = int(round(rw)), True
                elif round(rc) >= 2 and abs(rc - round(rc)) < 0.14 * round(rc):
                    n_split, horiz = int(round(rc)), False
                else:
                    continue
                prof = dk.mean(0) if horiz else dk.mean(1)
                ln = bw if horiz else bh
                seams = [prof[max(0, int(ln * k / n_split) - 4):int(ln * k / n_split) + 4].max() for k in range(1, n_split)]
                if not seams or max(seams) < 0.5:
                    continue
            pieces = []
            for k in range(n_split):
                if horiz:
                    pieces.append([int(x0 + bw * k / n_split), int(y0), int(x0 + bw * (k + 1) / n_split), int(y1)])
                else:
                    pieces.append([int(x0), int(y0 + bh * k / n_split), int(x1), int(y0 + bh * (k + 1) / n_split)])
            if sum(edge_ok(lum, pc) for pc in pieces) < len(pieces):
                continue
            for k in range(n_split):
                if horiz:
                    cx0 = x0 + bw * k / n_split; cx1 = x0 + bw * (k + 1) / n_split
                    box = [int(cx0), int(y0), int(cx1), int(y1)]; lng, sht = bh, bw / n_split
                else:
                    cy0 = y0 + bh * k / n_split; cy1 = y0 + bh * (k + 1) / n_split
                    box = [int(x0), int(cy0), int(x1), int(cy1)]; lng, sht = bh / n_split, bw
                cards.append(dict(box=box, long=float(max(lng, sht)), short=float(min(lng, sht)), portrait=bool(lng >= sht),
                                  tilt=0.0, asp=float(min(lng, sht) / max(lng, sht)), sol=float(sol), src=f"split{n_split}"))
    # dedupe by IoU
    out = []
    for c in sorted(cards, key=lambda c: -c["long"] * c["short"]):
        bx = c["box"]
        dup = False
        for o in out:
            ob = o["box"]
            ix = max(0, min(bx[2], ob[2]) - max(bx[0], ob[0])); iy = max(0, min(bx[3], ob[3]) - max(bx[1], ob[1]))
            inter = ix * iy
            u = (bx[2] - bx[0]) * (bx[3] - bx[1]) + (ob[2] - ob[0]) * (ob[3] - ob[1]) - inter
            if inter / u > 0.4 or inter / ((bx[2] - bx[0]) * (bx[3] - bx[1])) > 0.7:
                dup = True; break
        if not dup:
            out.append(c)
    return out


def card_gaps(cards):
    gaps = []
    for c in cards:
        best = None
        for d in cards:
            if d is c:
                continue
            if not (0.85 <= d["long"] / c["long"] <= 1.18):
                continue
            cy0, cy1 = c["box"][1], c["box"][3]; dy0, dy1 = d["box"][1], d["box"][3]
            ov = min(cy1, dy1) - max(cy0, dy0)
            if ov < 0.6 * min(cy1 - cy0, dy1 - dy0):
                continue
            g = d["box"][0] - c["box"][2]
            if g < 0 and d["box"][0] <= c["box"][0]:
                continue
            if d["box"][0] <= c["box"][0]:
                continue
            if best is None or d["box"][0] < best[0]:
                best = (d["box"][0], g)
        if best is not None and best[1] <= 1.5 * c["short"]:
            gaps.append(100.0 * best[1] / c["short"])
    return gaps


def text_lines(content, lum, cards, H, W):
    lbl, n = ndi.label(content, structure=np.ones((3, 3)))
    if n == 0:
        return []
    objs = ndi.find_objects(lbl)
    areas = ndi.sum(content, lbl, index=np.arange(1, n + 1))
    keep = np.zeros(n + 1, bool)
    hs = np.zeros(n + 1)
    for i, sl in enumerate(objs):
        h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        if not (0.009 * H <= h <= 0.12 * H):
            continue
        if w > 0.09 * W or w > 3.0 * h + 0.02 * W:
            continue
        fill = areas[i] / (h * w)
        if fill > 0.8 or areas[i] < 12:
            continue
        cy = (sl[0].start + sl[0].stop) / 2; cx = (sl[1].start + sl[1].stop) / 2
        inside = False
        for c in cards:
            b = c["box"]; m = 0.02 * W
            if b[0] - m <= cx <= b[2] + m and b[1] - m <= cy <= b[3] + m:
                inside = True; break
        if inside:
            continue
        keep[i + 1] = True; hs[i + 1] = h
    gmask = keep[lbl]
    if not gmask.any():
        return []
    # group glyphs into lines: horizontal smear proportional to glyph size
    medh = np.median(hs[keep]) if keep.any() else 10
    k = max(5, int(0.9 * medh))
    smear = ndi.binary_dilation(gmask, structure=np.ones((3, k)))
    llbl, ln = ndi.label(smear)
    lines = []
    for j, sl in enumerate(ndi.find_objects(llbl)):
        gl = np.unique(lbl[sl][(llbl[sl] == j + 1) & gmask[sl]])
        gl = gl[gl > 0]
        if len(gl) < 3:
            continue
        gh = hs[gl]
        h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        if w < 2.5 * h or h > 0.16 * H:
            continue
        if gh.std() / gh.mean() > 0.6:
            continue
        cap = float(np.percentile(gh, 75))
        lines.append(dict(box=[sl[1].start, sl[0].start, sl[1].stop, sl[0].stop], cap=cap, glyphs=int(len(gl))))
    return lines


def measure(path, channel):
    a = load(path)
    H, W = a.shape[:2]
    bg, bgshare = page_bg(a)
    lum = (0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2])
    diff = np.abs(a - bg[None, None, :]).max(2)
    content = diff > 38
    # textured paper (crumpled / grain, e.g. Next Level Commander): border mostly bright & neutral but no single flat colour
    b = 6
    bord = np.concatenate([a[:b].reshape(-1, 3), a[-b:].reshape(-1, 3), a[:, :b].reshape(-1, 3), a[:, -b:].reshape(-1, 3)])
    bl = 0.299 * bord[:, 0] + 0.587 * bord[:, 1] + 0.114 * bord[:, 2]
    bc = bord.max(1) - bord.min(1)
    neutral = (bl > 185) & (bc < 25)
    textured = bool(bgshare <= 0.40 and neutral.mean() >= 0.6)
    if textured:
        lo = np.percentile(bl[neutral], 3) - 12
        chroma_px = a.max(2) - a.min(2)
        content = ~((lum > lo) & (chroma_px < 28))
    # remove specks (< 0.004% of frame)
    lbl, n = ndi.label(content)
    if n:
        sizes = ndi.sum(content, lbl, index=np.arange(1, n + 1))
        content = np.isin(lbl, np.nonzero(sizes >= max(6, 0.00004 * H * W))[0] + 1)
    ink = content.mean()
    bg_l = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]
    bg_chroma = bg.max() - bg.min()
    white = bool(bg_l > 195 and bg_chroma < 35)
    # 'paper' = a flat page layout (any flat colour; white for most refs, grey for 3/3 Elk) as opposed to face-cam / full-bleed footage
    paper = bool((bgshare > 0.40 or textured) and ink < 0.80 and bg_chroma < 60)
    r = dict(file=os.path.basename(path), channel=channel, video=re.sub(r"_(sb)?\d+\.jpg$", "", os.path.basename(path)),
             W=W, H=H, bg=[round(float(x), 1) for x in bg], bg_share=round(float(bgshare), 3), paper=paper, white=white, textured=textured, ink=round(float(ink) * 100, 2))
    if ink < 0.002:
        r["empty"] = True
    if not paper or ink < 0.002:
        return r, None
    # margins: bbox of all content ignoring specks < 0.02%
    lbl, n = ndi.label(content)
    sizes = ndi.sum(content, lbl, index=np.arange(1, n + 1))
    big = np.isin(lbl, np.nonzero(sizes >= 0.0002 * H * W)[0] + 1)
    if big.any():
        ys, xs = np.nonzero(big)
        r.update(m_left=100 * xs.min() / W, m_right=100 * (W - 1 - xs.max()) / W, m_top=100 * ys.min() / H, m_bottom=100 * (H - 1 - ys.max()) / H)
        # centre of mass of ink
        r["com_x"] = 100 * xs.mean() / W; r["com_y"] = 100 * ys.mean() / H
    filled = ndi.binary_fill_holes(content)
    r["filled"] = round(float(filled.mean()) * 100, 2)
    # elements: dilate ~1% of width
    rad = max(2, int(0.0095 * W))
    dil = ndi.binary_dilation(content, structure=disk(rad))
    elbl, en = ndi.label(dil)
    esz = ndi.sum(dil, elbl, index=np.arange(1, en + 1)) if en else np.array([])
    r["elements"] = int((esz >= 0.003 * H * W).sum())
    # cards
    flbl, fn = ndi.label(ndi.binary_opening(filled, structure=np.ones((3, 3))))
    dark = ndi.binary_fill_holes(lum < 75)
    dlbl, dn = ndi.label(dark)
    cards = find_cards(a, lum, flbl, fn, dlbl, dn, H, W)
    if channel == "ours":
        zx0, zy0, zx1, zy1 = [v * W / 1920 if i % 2 == 0 else v * H / 1080 for i, v in enumerate(OUR_MASCOT_1080)]
        cards = [c for c in cards if not (zx0 - 20 <= (c["box"][0] + c["box"][2]) / 2 <= zx1 + 20 and zy0 - 20 <= (c["box"][1] + c["box"][3]) / 2 <= zy1 + 20)]
        zone = np.zeros_like(big); zone[int(zy0):int(zy1), int(zx0):int(zx1)] = True
        mz = big & zone
        if mz.any():
            ys, xs = np.nonzero(mz)
            r["mascot_h"] = 100 * (ys.max() - ys.min()) / H; r["mascot_w"] = 100 * (xs.max() - xs.min()) / W
        rest = big & ~zone
        if rest.any():
            ys, xs = np.nonzero(rest)
            r.update(nm_left=100 * xs.min() / W, nm_right=100 * (W - 1 - xs.max()) / W, nm_top=100 * ys.min() / H, nm_bottom=100 * (H - 1 - ys.max()) / H,
                     nm_com_x=100 * xs.mean() / W, nm_ink=100 * (content & ~zone).mean())
    r["cards"] = len(cards)
    r["card_h"] = [100 * c["long"] / H if c["portrait"] else 100 * c["short"] / H for c in cards]
    r["card_long"] = [100 * c["long"] / H for c in cards]
    r["card_tilt"] = [c["tilt"] for c in cards]
    r["card_boxes"] = [c["box"] for c in cards]
    r["card_gaps"] = card_gaps(cards)
    r["card_area"] = 100 * sum(c["long"] * c["short"] for c in cards) / (H * W)
    # text
    if W >= 640:
        lines = text_lines(content, lum, cards, H, W)
        # second pass: dark strokes on any lighter surface (text on label boxes / sticky notes / speech bubbles)
        k = max(9, int(0.03 * H)) | 1
        stroke_dark = (ndi.grey_closing(lum, size=(k, k)) - lum) > 35
        stroke_light = (lum - ndi.grey_opening(lum, size=(k, k))) > 50
        for l2 in text_lines(stroke_dark, lum, cards, H, W) + text_lines(stroke_light, lum, cards, H, W):
            b = l2["box"]; dup = False
            for l1 in lines:
                o = l1["box"]
                ix = max(0, min(b[2], o[2]) - max(b[0], o[0])); iy = max(0, min(b[3], o[3]) - max(b[1], o[1]))
                if ix * iy > 0.3 * min((b[2] - b[0]) * (b[3] - b[1]), (o[2] - o[0]) * (o[3] - o[1])):
                    dup = True; break
            if not dup:
                lines.append(l2)
        r["text_lines"] = len(lines)
        r["text_caps"] = [100 * l["cap"] / H for l in lines]
        r["text_boxes"] = [l["box"] for l in lines]
    return r, content


def run(channels=None):
    rows = []
    masks = {}
    chans = channels or sorted(os.listdir(f"{ROOT}/frames"))
    for ch in chans:
        for p in sorted(glob.glob(f"{ROOT}/frames/{ch}/*.jpg")):
            r, m = measure(p, ch)
            rows.append(r)
            if m is not None:
                key = (ch, r["video"])
                if key not in masks:
                    masks[key] = [np.zeros(m.shape, np.float32), 0]
                if masks[key][0].shape == m.shape:
                    masks[key][0] += m; masks[key][1] += 1
        print(ch, len([r for r in rows if r["channel"] == ch]), flush=True)
    # persistent overlays: pixels that are content in >=70% of a video's paper frames
    persist = {}
    for (ch, v), (acc, k) in masks.items():
        if k >= 8:
            frac = acc / k
            p = frac >= 0.7
            persist[f"{ch}/{v}"] = dict(frames=k, persistent_pct=round(float(p.mean()) * 100, 2),
                                        bbox=([int(x) for x in (np.nonzero(p.any(0))[0].min(), np.nonzero(p.any(1))[0].min(), np.nonzero(p.any(0))[0].max(), np.nonzero(p.any(1))[0].max())] if p.any() else None),
                                        W=int(p.shape[1]), H=int(p.shape[0]))
    os.makedirs(f"{ROOT}/data", exist_ok=True)
    for ch in chans:
        with open(f"{ROOT}/data/per_frame_{ch}.jsonl", "w", encoding="utf-8") as f:
            for r in rows:
                if r["channel"] == ch:
                    f.write(json.dumps(r) + "\n")
        json.dump({k: v for k, v in persist.items() if k.startswith(ch + "/")}, open(f"{ROOT}/data/persistent_{ch}.json", "w"), indent=1)
    return rows


if __name__ == "__main__":
    run(sys.argv[1:] or None)
