"""Layout audit: overlaps, off-screen clipping and minimum on-screen time, measured from the real render.

    python scripts/qa_layout.py Ep002 [--frames 0-3000] [--log existing.log]

How it works:
- Every kit component (and the episode's own ones) tags its root with data-audit attributes
  (kind, label, appear time, pop progress, stamp flag). See `audit()` / `AuditProbe` in src/episodes/kit.tsx.
- With the `audit` prop on, the composition logs every tagged element's on-screen box and own rotation
  on every 3rd frame (10 samples a second). This script renders at 1/10 scale to collect those lines.
- It rebuilds each element as a rotated rectangle and reports:
  1. OVERLAP: two visible elements sharing space (text/text, text/card, anything/Wil). Stamps
     (e.g. "FIZZLES" on a card) may sit on cards and drawings, but not on other text or on Wil.
  2. CLIPPED: text partly outside the 1920x1080 frame, or (at rest) within 24 px of its edge.
  3. TOO SHORT: an element fully visible for less than its reading time
     (text: max(1.5 s, characters/15 + 0.5 s), capped at 5 s; cards and characters: 1.2 s).
  4. BLEED: an element still on screen more than 1.2 s after its section ended (it belongs to the
     previous thought and clutters the next scene), unless it appeared so late that it needs that long.
  5. WIL CUT SHORT: one of Wil's animations interrupted by the next cue before 60 % of it played.
  7. WIL REACTIONS TOO CLOSE: two library animations starting under REACTION_GAP apart; and the
     expression plan (nods/brows/gestures) breaking its minimum gaps (scripts/wil_director.py).
  --shorts: a 1080x1920 Short; "CLIPPED" then means outside the area the Shorts UI leaves clear (SHORTS_SAFE).
  6. SMALL TEXT: rendered text size at rest below MIN_TEXT for its kind (phones and TVs; see
     research/youtube-general). --fonts lists every element's size.
  It warns (not counted) about CAPTION ZONE text, mostly inside the bottom-centre area where YouTube draws captions.
  It also prints BLANK BEATS as warnings: 0.3 s or more with only Wil on stage (usually a scene handoff
  where the old group fades before the new one arrives).
Text must keep a MARGIN (12 px) of clear space from whatever it's checked against, so "just touching"
counts as an overlap.
Exit code 1 if anything is reported.
"""
import json, math, os, re, subprocess, sys, tempfile

sys.stdout.reconfigure(encoding="utf-8")  # labels contain symbols the Windows console codepage can't print
from collections import defaultdict

FPS, EVERY = 30, 3
DT = EVERY / FPS
TEXT = {"sticker", "callout", "title", "label", "note", "caption"}
# "note" = card-like text (a trigger on the stack, the verdict card): read like text, and a stamp may sit on it
SOLID = {"card", "fig", "char", "wil", "note"}
W, H = 1920, 1080
# Vertical Shorts (--shorts): YouTube's UI covers the top ~250 px, the right rail (x >= 880: like/
# comment/share) and the bottom ~420 px (handle, title, carousel with the related-video link, progress).
SHORTS_SAFE = (60, 250, 880, 1500)  # research/shorts/REPORT.md (Jun 2026 player adds a carousel row)
MARGIN = 12      # px of clear space required around text
SAFE = 24        # px text keeps inside the frame edge at rest
BLEED = 1.2      # s an element may outlive its section
REACTION_GAP = 2.5  # s between the starts of two of Wil's library reactions (his face mustn't flip-flop)
REACTION_OK_AFTER = {"enter"}  # a designed sequence: the entrance flows straight into its follow-up
# What Wil's face actually does in the render (the "face" probe in kit.tsx), research/wil-motion:
BROW_MIN_SPELL = 0.25   # s a brow raise must stay visible (shorter reads as a flicker)
BROW_MIN_GAP = 1.0      # s before brows may come back after vanishing
BROW_MAX_PER_MIN = 8    # appearances in any minute (research: 4-8 flashes a minute)
EYES_MIN_SPELL = 0.3    # s an eye state (open, wide, closed...) must hold, blinks aside
JITTER_REVERSALS = 4    # fast direction reversals of his tilt, height or sideways position in one second
JITTER_FAST = 4         # frames: a reversal counts as "fast" if the previous one was this recent (> ~4 Hz)
JITTER_MIN_STEP = 0.04  # deg / px per frame: smaller steps don't count as movement
# (a deliberate nod like "yes" reverses every ~6 frames and passes; a 2-3 frame wobble fails)
# rendered font px at rest. Calibrated on the white-background MTG channels (research/layout-study):
# their display text has a cap height of ~3.4 % of the frame (about 50 px type, 25th percentile ~35 px),
# body lines ~1.9 % (about 30 px). Below these, text is smaller than what those audiences read comfortably.
MIN_TEXT = {"sticker": 40, "title": 48, "callout": 30, "label": 30, "note": 28, "caption": 56}
# YouTube draws captions here (bottom centre); critical text should stay out of it
CAPTION_ZONE = [(480, 870), (1440, 870), (1440, 1060), (480, 1060)]


def read_secs(label):
    return min(5.0, max(1.5, len(label) / 15 + 0.5))


# ---------------------------------------------------------------- geometry
def rect_poly(cx, cy, hw, hh, deg):
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    return [(cx + x * c - y * s, cy + x * s + y * c) for x, y in ((-hw, -hh), (hw, -hh), (hw, hh), (-hw, hh))]


def area(poly):
    return abs(sum(poly[i][0] * poly[i - 1][1] - poly[i - 1][0] * poly[i][1] for i in range(len(poly)))) / 2


def clip(subject, clipper):
    """Sutherland-Hodgman: intersection of two convex polygons."""
    def inside(p, a, b):
        return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0

    def inter(p1, p2, a, b):
        x1, y1, x2, y2 = *p1, *p2
        x3, y3, x4, y4 = *a, *b
        d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
        if abs(d) < 1e-9:
            return p2
        t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d
        return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))

    # make clipper counter-clockwise in screen coords (y down) for the inside test
    if sum(clipper[i][0] * clipper[i - 1][1] - clipper[i - 1][0] * clipper[i][1] for i in range(len(clipper))) > 0:
        clipper = clipper[::-1]
    out = subject
    for i in range(len(clipper)):
        a, b = clipper[i - 1], clipper[i]
        inp, out = out, []
        if not inp:
            break
        s = inp[-1]
        for e in inp:
            if inside(e, a, b):
                if not inside(s, a, b):
                    out.append(inter(s, e, a, b))
                out.append(e)
            elif inside(s, a, b):
                out.append(inter(s, e, a, b))
            s = e
    return out


def shape(row, m=0.0):
    """The element as a (rotated) rectangle, grown by m px on every side."""
    kind, label, at, p, left, top, bw, bh, lw, lh, rot, stamp = row[:12]
    if kind in ("wil", "char"):
        # the rig's SVG box is wider than the character: keep the body (x 20-80 %, y 11-100 %)
        return rect_poly(left + bw / 2, top + bh * 0.555, bw * 0.3 + m, bh * 0.445 + m, 0)
    cx, cy = left + bw / 2, top + bh / 2
    if lw and lh:
        a = math.radians(rot)
        c, s = abs(math.cos(a)), abs(math.sin(a))
        sc = ((bw / (lw * c + lh * s)) + (bh / (lw * s + lh * c))) / 2
        return rect_poly(cx, cy, lw * sc / 2 + m, lh * sc / 2 + m, rot)
    return rect_poly(cx, cy, bw / 2 + m, bh / 2 + m, 0)


# ---------------------------------------------------------------- collect
def collect(comp, frames, log):
    if log:
        return open(log, encoding="utf-8", errors="ignore").read()
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    tmp = tempfile.mkdtemp()
    out = os.path.join(tmp, "audit.mp4")
    props = os.path.join(tmp, "props.json")  # a file, because Windows mangles quotes in inline JSON
    open(props, "w").write('{"audit": true}')
    cmd = ["npx", "remotion", "render", comp, out, "--scale=0.1" if "--shorts" not in sys.argv else "--scale=0.15", f"--props={props}", "--log=verbose"]
    if frames:
        cmd.append(f"--frames={frames}")
    res = subprocess.run(" ".join(f'"{c}"' if " " in c else c for c in cmd), cwd=root, shell=True,
                         capture_output=True, text=True, encoding="utf-8", errors="ignore")
    text = res.stdout + res.stderr
    log_path = os.path.join(os.path.dirname(out), "audit.log")
    open(log_path, "w", encoding="utf-8").write(text)
    print(f"render log: {log_path}  (reuse with --log; feed to scripts/wil_looks.py)")
    return text


def parse_face_every_frame(text):
    """Wil's pose on every frame ("AUDITF <frame> <label>"), merged with the every-3rd-frame probe rows."""
    out = {}
    for m in re.finditer(r'AUDITF (\d+) ("(?:[^"\\]|\\.)*")', text):
        try:
            out[int(m.group(1))] = json.loads(m.group(2))
        except json.JSONDecodeError:
            pass
    return out


def parse(text):
    frames = {}
    for m in re.finditer(r"AUDIT (\d+) (\[.*?\]\])", text):
        try:
            frames[int(m.group(1))] = json.loads(m.group(2))
        except json.JSONDecodeError:
            pass
    return frames


# ---------------------------------------------------------------- analyse
def main():
    comp = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else "Ep002"
    frames = sys.argv[sys.argv.index("--frames") + 1] if "--frames" in sys.argv else None
    log = sys.argv[sys.argv.index("--log") + 1] if "--log" in sys.argv else None
    raw = collect(comp, frames, log)
    data = parse(raw)
    shorts = "--shorts" in sys.argv
    global W, H
    if shorts:
        W, H = 1080, 1920
    face_all = parse_face_every_frame(raw)
    if not data:
        sys.exit("no AUDIT lines found: is the composition rendering <AuditProbe/> with the audit prop?")
    print(f"sampled {len(data)} frames ({DT:.1f} s apart)")

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    timing = json.load(open(os.path.join(root, "src", "episodes", comp.lower(), "timing.json"), encoding="utf-8"))

    def section_end(at):
        end = timing["sections"][0]["end"]  # anything already up at the start belongs to the first section
        for sct in timing["sections"]:
            if sct["start"] - 0.5 <= at:
                end = sct["end"]
        return end

    last_visible = {}
    wil_seen = {}  # (anim, start) -> furthest progress reached before the next pose took over
    overlaps = defaultdict(list)   # (a, b) -> [t]
    clipped = defaultdict(list)
    seen = defaultdict(lambda: [0, None, None])  # key -> [readable samples, first t, last t]
    fonts = defaultdict(list)      # key -> rendered text px while at rest
    face = []                      # (t, brows, eyes) from Wil's face probe
    in_captions = defaultdict(list)

    for f, rows in sorted(data.items()):
        t = f / FPS
        items = []
        for r in rows:
            kind, label, at, p = r[0], r[1], r[2], r[3]
            if kind == "face":
                parts = dict(x.split("=", 1) for x in label.split(";") if "=" in x)
                face.append((t, parts.get("brows", "none"), parts.get("eyes", "")))
                continue
            # live counters (LOOPS: 12, each opponent: 34) are one element whose number changes
            key = (kind, re.sub(r"\d+", "#", label), round(at, 1))
            if kind != "wil":
                st = seen[key]
                if p >= 0.9:
                    st[0] += 1
                st[1] = t if st[1] is None else st[1]
                st[2] = t
            if p < 0.6:
                continue
            if kind == "wil" and label.startswith("anim:"):
                _, anim, start, prog = label.split(":")
                wil_seen[(anim, float(start))] = max(wil_seen.get((anim, float(start)), 0.0), float(prog))
            if kind != "wil" and label != "subscribe overlay" and t < timing["narrationEnd"]:
                last_visible[key] = t
            poly = shape(r)
            items.append((kind, label, r[11], poly, area(poly), shape(r, MARGIN / 2)))
            if kind in TEXT:
                inside = clip(poly, [(0, 0), (W, 0), (W, H), (0, H)])
                lost = 1 - (area(inside) / area(poly) if inside else 0)
                # at rest, text also keeps SAFE px inside the frame (title-safe; the player UI covers edges)
                if 0.97 <= p <= 1.03:
                    x0, y0, x1, y1 = SHORTS_SAFE if shorts else (SAFE, SAFE, W - SAFE, H - SAFE)
                    safe = clip(poly, [(x0, y0), (x1, y0), (x1, y1), (x0, y1)])
                    lost = max(lost, 1 - (area(safe) / area(poly) if safe else 0))
                if lost > 0.02:
                    clipped[(kind, label)].append(t)
                if 0.97 <= p <= 1.03:
                    if len(r) > 12 and r[12]:
                        fonts[key].append(r[12])
                    cz = None if shorts else clip(poly, CAPTION_ZONE)
                    if cz and len(cz) >= 3 and area(cz) > 0.25 * area(poly):
                        in_captions[(kind, label)].append(t)
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                a, b = items[i], items[j]
                ka, kb = a[0], b[0]
                if ka not in TEXT and kb not in TEXT and "wil" not in (ka, kb):
                    continue  # card on card etc. is layout, not a readability problem
                if ka in ("wil",) and kb in ("wil",):
                    continue
                if ka == "wil" and kb == "char" or kb == "wil" and ka == "char":
                    continue
                # a character's own name tag sits under it on purpose
                if {ka, kb} == {"char", "label"} and (a[1].endswith(": " + b[1]) or b[1].endswith(": " + a[1])):
                    continue
                stamp_ok = (a[2] and kb in SOLID - {"wil"}) or (b[2] and ka in SOLID - {"wil"})
                if stamp_ok:
                    continue
                inter = clip(a[5], b[5])  # each grown by half the margin, so a gap under MARGIN px counts
                if not inter or len(inter) < 3:
                    continue
                ia = area(inter)
                if ia >= max(300, 0.03 * min(a[4], b[4])):
                    overlaps[(f"{ka}:{a[1]}", f"{kb}:{b[1]}")].append(t)

    problems = 0

    def spans(ts):
        out, start, prev = [], None, None
        for t in ts:
            if start is None:
                start = prev = t
            elif t - prev > DT * 1.5:
                out.append((start, prev)); start = t
            prev = t
        if start is not None:
            out.append((start, prev))
        return out

    print("\n== OVERLAPS (visible elements sharing space) ==")
    rows = []
    for (a, b), ts in overlaps.items():
        for s0, s1 in spans(sorted(ts)):
            if s1 - s0 + DT >= 0.2:
                rows.append((s0, s1, a, b))
    for s0, s1, a, b in sorted(rows):
        print(f"  {s0:6.1f}-{s1:6.1f}s  {a[:48]:48}  x  {b[:48]}")
    problems += len(rows)

    print("\n== CLIPPED (text off the frame) ==")
    rows = []
    for (k, l), ts in clipped.items():
        for s0, s1 in spans(sorted(ts)):
            if s1 - s0 + DT >= 0.2:
                rows.append((s0, s1, k, l))
    for s0, s1, k, l in sorted(rows):
        print(f"  {s0:6.1f}-{s1:6.1f}s  {k}:{l[:60]}")
    problems += len(rows)

    print("\n== TOO SHORT (fully visible for less than its reading time) ==")
    rows = []
    for (kind, label, at), (n, t0, t1) in seen.items():
        if kind == "caption":
            continue  # captions are read along with the voice, chunk by chunk
        need = read_secs(label) if kind in TEXT else 1.2
        got = n * DT
        if got + DT < need and t0 is not None:
            rows.append((t0, kind, label, got, need))
    for t0, kind, label, got, need in sorted(rows):
        print(f"  {t0:6.1f}s  {kind}:{label[:56]:56} {got:4.1f}s < {need:.1f}s")
    problems += len(rows)

    print("\n== BLEED (still on screen well after its section ended) ==")
    rows = []
    for (kind, label, at), t_last in last_visible.items():
        if label.startswith("HUD:"):
            continue  # a running counter meant to stay up across sections (e.g. ep003's cabbage count)
        over = t_last - section_end(at)
        # something that appears in a section's last words may stay as long as it needs to be read
        need = read_secs(label) if kind in TEXT else 1.2
        if kind == "title":
            need += 0.045 * len(label.replace(" ", ""))  # ransom letters pop in one by one
        allowed = max(BLEED, at + 0.5 + need + 0.3 - section_end(at))
        if over > allowed:
            rows.append((at, kind, label, over))
    for at, kind, label, over in sorted(rows):
        print(f"  {at:6.1f}s  {kind}:{label[:56]:56} +{over:.1f}s past its section")
    problems += len(rows)

    print("\n== WIL CUT SHORT (an animation interrupted before 60 % of it played) ==")
    rows = sorted((start, anim, prog) for (anim, start), prog in wil_seen.items() if prog < 0.6)
    for start, anim, prog in rows:
        print(f"  {start:6.1f}s  {anim:24} only {prog:.0%} played")
    problems += len(rows)

    print(f"\n== WIL REACTIONS TOO CLOSE (library animations starting under {REACTION_GAP}s apart; his mood mustn't flip-flop) ==")
    starts = sorted({(start, anim) for (anim, start) in wil_seen})
    rows = [(a, x, b, y) for (a, x), (b, y) in zip(starts, starts[1:]) if b - a < REACTION_GAP and x not in REACTION_OK_AFTER]
    for a, x, b, y in rows:
        print(f"  {a:6.1f}s  {x} -> {y} after {b - a:.1f}s")
    problems += len(rows)

    print("\n== WIL EXPRESSION PLAN (nods, brow raises, gestures: scripts/wil_director.py rules) ==")
    exp = os.path.join(root, "src", "episodes", comp.lower(), "expression.json")
    if os.path.exists(exp):
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import wil_director
        probs, rates = wil_director.check(json.load(open(exp)), timing["narrationEnd"] / 60)
        print(f"  nods {rates['accents']:.1f}/min, brow raises {rates['brows']:.1f}/min, gestures {rates['gestures']:.1f}/min")
        for x in probs:
            print("  " + x)
        problems += len(probs)
    else:
        print("  no expression.json: run scripts/wil_director.py")

    print(f"\n== WIL FACE FLICKER (brows up < {BROW_MIN_SPELL}s or back within {BROW_MIN_GAP}s, > {BROW_MAX_PER_MIN} brow raises a minute, eye states < {EYES_MIN_SPELL}s) ==")
    rows = []

    def runs(values):
        out, start, cur = [], None, None
        for t, v in values:
            if v != cur:
                if cur is not None:
                    out.append((cur, start, t))
                cur, start = v, t
        if cur is not None:
            out.append((cur, start, values[-1][0] + DT))
        return out

    if face:
        vis = runs([(t, b != "none") for t, b, _ in face])
        ups = [(s0, s1) for v, s0, s1 in vis if v]
        for s0, s1 in ups:
            if s1 - s0 < BROW_MIN_SPELL:
                rows.append(f"  {s0:6.1f}s  brows up for only {s1 - s0:.2f}s")
        for (a0, a1), (b0, b1) in zip(ups, ups[1:]):
            if b0 - a1 < BROW_MIN_GAP:
                rows.append(f"  {a1:6.1f}s  brows back after only {b0 - a1:.2f}s")
        starts_up = [s0 for s0, _ in ups]
        for s0 in starts_up:
            n = sum(1 for x in starts_up if s0 <= x < s0 + 60)
            if n > BROW_MAX_PER_MIN:
                rows.append(f"  {s0:6.1f}s  {n} brow raises in the next minute")
                break
        for v, s0, s1 in runs([(t, e) for t, _, e in face]):
            if v not in ("shades", "closed") and s1 - s0 < EYES_MIN_SPELL and s0 > face[0][0]:
                rows.append(f"  {s0:6.1f}s  eyes '{v}' for only {s1 - s0:.2f}s")
        mins = (face[-1][0] - face[0][0]) / 60
        print(f"  brow raises: {len(ups)} ({len(ups) / max(mins, 1e-6):.1f}/min)")
    for x in rows:
        print(x)
    problems += len(rows)

    print(f"\n== WIL JITTER (his tilt, height or sideways position reversing fast, {JITTER_REVERSALS}+ times in a second: a wobble) ==")
    rows = []
    series = dict(face_all)
    for f, rws in data.items():
        for r in rws:
            if r[0] == "face":
                series[f] = r[1]
    pose = []
    for f in sorted(series):
        d = dict(x.split("=", 1) for x in series[f].split(";") if "=" in x)
        if "rot" in d:
            pose.append((f, float(d["rot"]), float(d["y"]), float(d.get("x", 0))))
    if len(pose) > 3 and all(b[0] - a[0] == 1 for a, b in zip(pose[:50], pose[1:51])):
        for idx, name in ((1, "tilt"), (2, "height"), (3, "sideways position")):
            rev = []
            for i in range(2, len(pose)):
                if pose[i][0] - pose[i - 2][0] != 2:
                    continue
                d1 = pose[i - 1][idx] - pose[i - 2][idx]
                d2 = pose[i][idx] - pose[i - 1][idx]
                if d1 * d2 < 0 and abs(d1) > JITTER_MIN_STEP and abs(d2) > JITTER_MIN_STEP:
                    rev.append(pose[i][0])
            # keep only fast reversals (the previous one within JITTER_FAST frames)
            rev = [b / FPS for a, b in zip(rev, rev[1:]) if b - a <= JITTER_FAST]
            flagged = []
            for t0 in rev:
                if sum(1 for x in rev if t0 <= x < t0 + 1) >= JITTER_REVERSALS and not (flagged and t0 - flagged[-1][1] < 1):
                    flagged.append([t0, t0 + 1])
                elif flagged and t0 - flagged[-1][1] < 1:
                    flagged[-1][1] = t0 + 0.1
            for a, b in flagged:
                rows.append(f"  {a:6.1f}-{b:6.1f}s  his {name} wobbles back and forth")
    else:
        print("  (no every-frame pose data: re-render the audit)")
    for x in rows:
        print(x)
    problems += len(rows)

    print("\n== SMALL TEXT (rendered size at rest below the minimum for its kind; phone and TV viewers) ==")
    rows = []
    for (kind, label, at), px in fonts.items():
        med = sorted(px)[len(px) // 2]
        if med < MIN_TEXT.get(kind, 0):
            rows.append((at, kind, label, med))
    for at, kind, label, med in sorted(rows):
        print(f"  {at:6.1f}s  {kind}:{label[:56]:56} {med:.0f}px < {MIN_TEXT[kind]}px")
    problems += len(rows)
    if "--fonts" in sys.argv:
        for (kind, label, at), px in sorted(fonts.items(), key=lambda kv: sorted(kv[1])[len(kv[1]) // 2]):
            print(f"    font {sorted(px)[len(px) // 2]:4.0f}px  {kind}:{label[:60]}")

    print("\n== CAPTION ZONE (warnings: text mostly inside the bottom-centre area YouTube captions cover) ==")
    for (k, l), ts in sorted(in_captions.items(), key=lambda kv: kv[1][0]):
        for s0, s1 in spans(sorted(ts)):
            if s1 - s0 + DT >= 0.5:
                print(f"  {s0:6.1f}-{s1:6.1f}s  {k}:{l[:60]}")

    print("\n== BLANK BEATS (warnings, not counted: 0.3 s+ with nothing on stage but Wil; fine when Wil is the point) ==")
    st = None
    for f, rows in sorted(data.items()):
        x = f / FPS
        c = sum(1 for r in rows if r[0] not in ("wil", "face") and r[3] >= 0.5)
        if c == 0 and st is None:
            st = x
        if c > 0 and st is not None:
            if x - st >= 0.3:
                print(f"  {st:6.1f}-{x:6.1f}s  make it a swap: the outgoing group leaves just after the next one arrives")
            st = None

    print(f"\n{problems} problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
