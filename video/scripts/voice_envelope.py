"""Voice envelope for Wil's lip-sync and talking gestures, one value per video frame.

    python scripts/voice_envelope.py public/ep002/narration.wav src/episodes/ep002/voice.json

Writes {"fps": 30, "level": [...], "peaks": [...]}:
- level: how loud the voice is at each frame, 0-1. Normalised to the narration's own loud parts,
  with a fast attack and a slower release, so the mouth snaps open on a syllable and eases shut.
- peaks: times (s) of stressed syllables (clear local loudness peaks at least 0.45 s apart), which Wil
  nods and gestures on.
ep002_narration.py timing runs this automatically.
"""
import json, sys
import numpy as np
import soundfile as sf

FPS = 30


def envelope(wav_path, fps=FPS):
    y, sr = sf.read(wav_path, always_2d=False)
    if y.ndim > 1:
        y = y.mean(axis=1)
    n_frames = int(np.ceil(len(y) / sr * fps))
    win = int(0.030 * sr)
    raw = np.zeros(n_frames)
    for i in range(n_frames):
        c = int(i / fps * sr)
        seg = y[max(0, c - win // 2): c + win // 2]
        raw[i] = np.sqrt(np.mean(seg ** 2)) if len(seg) else 0.0
    voiced = raw[raw > np.percentile(raw, 40)]
    ref = np.percentile(voiced, 95) if len(voiced) else 1.0
    floor = np.percentile(raw, 20)
    lv = np.clip((raw - floor) / max(ref - floor, 1e-6), 0, 1) ** 0.7
    # fast attack, slower release: opens with the syllable, closes gently
    out = np.zeros_like(lv)
    for i, v in enumerate(lv):
        prev = out[i - 1] if i else 0.0
        out[i] = prev + (v - prev) * (0.85 if v > prev else 0.45)
    # stressed syllables: local maxima that stand well above their neighbourhood
    peaks, last = [], -1.0
    half = int(0.25 * fps)
    for i in range(half, len(out) - half):
        w = out[i - half: i + half + 1]
        if out[i] == w.max() and out[i] > 0.72 and out[i] - w.min() > 0.35 and i / fps - last >= 0.45:
            peaks.append(round(i / fps, 3))
            last = i / fps
    return {"fps": fps, "level": [round(float(v), 3) for v in out], "peaks": peaks}


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    data = envelope(sys.argv[1])
    json.dump(data, open(sys.argv[2], "w"), separators=(",", ":"))
    lv = np.array(data["level"])
    print(f"{len(lv)} frames, mean level {lv.mean():.2f}, {len(data['peaks'])} stressed syllables -> {sys.argv[2]}")
