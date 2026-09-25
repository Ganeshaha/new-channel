"""Measure voice takes: pace, pitch, pitch variation, brightness and word accuracy. Free, runs locally.

    python tools/voice_metrics.py "<expected text>" take1.wav take2.wav ...

How to read it (for a late-20s male narrator):
- medianF0: roughly 100-170 Hz. Over 200 Hz reads young or high.
- var (pitch standard deviation in semitones): about 3-4.5 is lively. Under 2.5 sounds flat.
- wpm: 170-210 matches the studied channels.
- centroid: lower is warmer, higher is brighter.
- match: word accuracy against the text. Card names often "miss" because the transcriber mishears them, so listen before acting.
"""
import difflib, re, sys
import numpy as np, librosa
from faster_whisper import WhisperModel

ref, files = sys.argv[1], sys.argv[2:]
words = lambda s: re.findall(r"[a-z0-9']+", s.lower().replace("’", "'"))
model = WhisperModel("small.en", device="cpu", compute_type="int8")
for f in files:
    y, sr = librosa.load(f, sr=16000)
    dur = len(y) / sr
    f0, _, _ = librosa.pyin(y, fmin=70, fmax=300, sr=sr, frame_length=2048)
    f0 = f0[~np.isnan(f0)]
    st = 12 * np.log2(f0 / np.median(f0))
    cen = np.median(librosa.feature.spectral_centroid(y=y, sr=sr)[0])
    segs, _ = model.transcribe(f, beam_size=5)
    heard = words(" ".join(s.text for s in segs))
    sm = difflib.SequenceMatcher(a=words(ref), b=heard, autojunk=False)
    print(f"{f}: {dur:5.1f}s wpm={len(heard) / dur * 60:4.0f} medianF0={np.median(f0):4.0f}Hz "
          f"var={np.std(st):4.2f}st centroid={cen:5.0f}Hz match={sm.ratio():.0%}")
    for op, a1, a2, b1, b2 in sm.get_opcodes():
        if op != "equal":
            print(f"    {op}: {' '.join(words(ref)[a1:a2])} -> {' '.join(heard[b1:b2])}")
