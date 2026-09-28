"""Wil's expression plan: when he makes a head accent, raises his brows and gestures while talking.

    python scripts/wil_director.py src/episodes/ep002            (writes src/episodes/ep002/expression.json)
    python scripts/wil_director.py src/episodes/ep002 --check    (only validates an existing plan)

Reads the episode's timing.json and voice.json, plus public/<ep>/narration.wav for pitch.

Why a plan: v18 nodded on every stressed syllable (63 a minute) and flicked his brows on and off
154 times a minute (user, 26 Sep 2026: "the eyebrows keep appearing and disappearing and he keeps
motioning down, it looks janky"). research/wil-motion/REPORT.md has the evidence behind these rules:
real speakers put a clear accent on about one word per sentence; head accents follow pitch, not
loudness; brow raises are short eased flashes on intensifying words; animators "hit the main
accents" and never "machine-gun every note"; and each channel needs a budget and a cooldown.

THE EXPRESSION BUDGET (the channel's rules; change them here and in WORKFLOW.md):
- ACCENTS: at most one candidate per sentence, the most prominent content word (pitch + loudness
  + length, z-scored within its sentence). Accepted in priority order, at least ACCENT_GAP apart and
  at most ACCENT_MAX per minute. The stroke lands LEAD seconds before the word's loudest moment.
  Each accent is a head move: usually anticipate down then rise or tilt, sometimes a dip; the size
  follows prominence. Never the same dip every time.
- BROWS: a short eased flash (rise, hold, fall) only on an intensifier: a question/exclamation
  sentence or one of the most prominent accents. At least BROW_GAP apart, at most BROW_MAX a minute.
- GESTURES: only on strong accents, at least GESTURE_GAP apart, at most GESTURE_MAX a minute.
  The arm is picked pseudo-randomly, never the same arm three times running.
Library reactions (WIL_EVENTS) override all of this while they play; qa_layout.py checks their
spacing separately (WIL REACTIONS TOO CLOSE).
"""
import json, math, os, re, sys

FPS = 30
ACCENT_GAP, ACCENT_MAX = 2.0, 9.0      # s, per minute (research: 6-10/min, gap >= 1.2 s)
BROW_GAP, BROW_MAX = 4.0, 3.0          # research: 4-8/min in total; reactions add ~4/min of their own
GESTURE_GAP, GESTURE_MAX = 3.0, 6.0    # research: 4-8/min, cooldown >= 2.5 s
LEAD = 0.1                             # s the stroke leads the loudest moment of the word
BROW_SHAPE = [0.15, 0.3, 0.3]          # s: rise, hold, fall (research: 400-600 ms total, eased)
BROW_TOP = 0.25                        # top share of accents that count as intensifiers
GESTURE_TOP = 0.5                      # gestures only on the top half of accents
SENT_END = re.compile(r"[.?!…]$")
FUNCTION = set("""a an the and or but so to of in on at for with by from as is are was were be been it it's its
this that these those i you he she we they him her them his their our your my me us do does did have has had
not no just then than if when what which who how yeah okay um uh there here up out now one""".split())


def clean(w):
    return re.sub(r"[^a-z0-9']", "", w.lower().replace("’", "'"))


def sentences(timing):
    out, cur = [], []
    words = [w for s in timing["sections"] for w in s["words"]]
    for i, w in enumerate(words):
        cur.append(w)
        nxt = words[i + 1] if i + 1 < len(words) else None
        if SENT_END.search(w["w"].strip('"”’)')) or nxt is None or nxt["s"] - w["e"] >= 0.6:
            out.append(cur)
            cur = []
    return out


def pitch_track(wav):
    """F0 (Hz) at 100 frames/s, NaN where unvoiced."""
    import librosa, numpy as np
    y, sr = librosa.load(wav, sr=16000, mono=True)
    f0, voiced, _ = librosa.pyin(y, fmin=70, fmax=320, sr=sr, frame_length=1024, hop_length=160)
    f0[~voiced] = np.nan
    return f0


def hash01(i, salt):
    return (math.sin(i * 12.9898 + salt * 78.233) * 43758.5453) % 1.0


def plan(voice, timing, f0):
    import numpy as np
    lv = voice["level"]
    L = lambda t: lv[max(0, min(len(lv) - 1, int(round(t * FPS))))]
    cands = []
    for sent in sentences(timing):
        feats = []
        for w in sent:
            fr = range(int(w["s"] * FPS), max(int(w["s"] * FPS) + 1, int(w["e"] * FPS)))
            loud_t = max(fr, key=lambda f: lv[min(f, len(lv) - 1)]) / FPS
            seg = f0[int(w["s"] * 100):max(int(w["s"] * 100) + 1, int(w["e"] * 100))]
            seg = seg[~np.isnan(seg)]
            feats.append({
                "w": w, "t": loud_t, "e": L(loud_t),
                "f": float(np.log(seg.max())) if len(seg) else np.nan,
                "d": w["e"] - w["s"],
                "content": clean(w["w"]) not in FUNCTION and len(clean(w["w"])) > 1,
            })
        content = [x for x in feats if x["content"]]
        if not content:
            continue

        def z(key):
            vals = np.array([x[key] for x in feats], float)
            ok = ~np.isnan(vals)
            if ok.sum() < 2 or np.nanstd(vals) < 1e-6:
                return {id(x): 0.0 for x in feats}
            m, s = np.nanmean(vals), np.nanstd(vals)
            return {id(x): (0.0 if np.isnan(x[key]) else (x[key] - m) / s) for x in feats}

        zf, ze, zd = z("f"), z("e"), z("d")
        for x in content:
            x["p"] = zf[id(x)] + ze[id(x)] + 0.5 * zd[id(x)]
        best = max(content, key=lambda x: x["p"])
        end = sent[-1]["w"].strip('"”’)')
        cands.append({"t": best["t"] - LEAD, "p": best["p"], "word": best["w"]["w"],
                      "intense": end.endswith("?") or end.endswith("!")})

    def budgeted(items, gap, per_min):
        """Accept in priority order: at least `gap` apart, at most `per_min` in any 60 s window."""
        chosen = []
        for c in sorted(items, key=lambda c: -c["p"]):
            if any(abs(c["t"] - o["t"]) < gap for o in chosen):
                continue
            trial = chosen + [c]
            near = [o for o in trial if abs(o["t"] - c["t"]) < 30]
            if any(sum(1 for y in trial if abs(y["t"] - o["t"]) < 30) > per_min for o in near):
                continue
            chosen.append(c)
        return sorted(chosen, key=lambda c: c["t"])

    accents = budgeted(cands, ACCENT_GAP, ACCENT_MAX)
    ps = sorted(a["p"] for a in accents)
    q = lambda share: ps[min(len(ps) - 1, int(len(ps) * (1 - share)))] if ps else 0
    brows = budgeted([a for a in accents if a["intense"] or a["p"] >= q(BROW_TOP)], BROW_GAP, BROW_MAX)
    gestures = budgeted([a for a in accents if a["p"] >= q(GESTURE_TOP)], GESTURE_GAP, GESTURE_MAX)

    lo, hi = (ps[0], ps[-1]) if ps else (0, 1)
    acc_out = []
    for i, a in enumerate(accents):
        amp = 0.6 + 0.8 * (a["p"] - lo) / max(hi - lo, 1e-6)       # 0.6-1.4 by prominence
        r = hash01(i, 1)
        kind = "up" if r < 0.45 else "tilt" if r < 0.7 else "down"   # ~70 % up/tilt, ~30 % down
        acc_out.append({"t": round(a["t"], 3), "kind": kind, "amp": round(amp, 2),
                        "dir": 1 if hash01(i, 2) < 0.5 else -1, "word": a["word"]})
    ges_out, arms = [], []
    for i, g in enumerate(gestures):
        arm = "R" if hash01(i, 3) < 0.5 else "L"
        if len(arms) >= 2 and arms[-1] == arms[-2] == arm:
            arm = "L" if arm == "R" else "R"
        arms.append(arm)
        ges_out.append({"t": round(g["t"], 3), "arm": arm, "amp": round(0.7 + 0.5 * hash01(i, 4), 2)})
    return {
        "accents": acc_out,
        "brows": [round(b["t"] - 0.08, 3) for b in brows],   # peak lands just before the syllable
        "gestures": ges_out,
        "browShape": BROW_SHAPE,
    }


def check(p, minutes):
    """The expression budget; returns (problems, rates per minute)."""
    probs = []
    series = {
        "accents": ([a["t"] for a in p["accents"]], ACCENT_GAP, ACCENT_MAX),
        "brows": (p["brows"], BROW_GAP, BROW_MAX),
        "gestures": ([g["t"] for g in p["gestures"]], GESTURE_GAP, GESTURE_MAX),
    }
    rates = {}
    for name, (xs, gap, per_min) in series.items():
        for a, b in zip(xs, xs[1:]):
            if b - a < gap - 1e-6:
                probs.append(f"{name}: {a:.2f}s and {b:.2f}s are {b - a:.2f}s apart (min {gap}s)")
        for x in xs:
            n = sum(1 for y in xs if abs(y - x) < 30)
            if n > per_min:
                probs.append(f"{name}: {n} within a minute around {x:.1f}s (max {per_min:g})")
                break
        rates[name] = len(xs) / minutes
    arms = [g["arm"] for g in p["gestures"]]
    if any(arms[i] == arms[i + 1] == arms[i + 2] for i in range(len(arms) - 2)):
        probs.append("gestures: the same arm three times running (twinning)")
    return probs, rates


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    d = os.path.abspath(sys.argv[1])
    voice = json.load(open(os.path.join(d, "voice.json")))
    timing = json.load(open(os.path.join(d, "timing.json"), encoding="utf-8"))
    out = os.path.join(d, "expression.json")
    if "--check" in sys.argv:
        p = json.load(open(out))
    else:
        root = os.path.dirname(os.path.dirname(os.path.dirname(d)))
        wav = os.path.join(root, "public", os.path.basename(d), "narration.wav")
        p = plan(voice, timing, pitch_track(wav))
        json.dump(p, open(out, "w", encoding="utf-8"), ensure_ascii=False)
    probs, rates = check(p, len(voice["level"]) / FPS / 60)
    kinds = {k: sum(1 for a in p["accents"] if a["kind"] == k) for k in ("up", "tilt", "down")}
    print(f"head accents {rates['accents']:.1f}/min {kinds}, brow flashes {rates['brows']:.1f}/min, "
          f"gestures {rates['gestures']:.1f}/min -> {out}")
    for x in probs:
        print("  PROBLEM", x)
    sys.exit(1 if probs else 0)


if __name__ == "__main__":
    main()
