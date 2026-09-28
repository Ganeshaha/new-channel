"""Build a Short's narration from lines of an episode's existing narration (no new voice lines, no TTS cost).

    python scripts/short_cut.py scripts/short_ep002.json

The config lists clips by time range in the source narration (clips with the same "scene" share one
section, so cues and the audit's scene rules work per scene); each range snaps to whole words (from the
source timing.json), is cut in the silence around those words with 8 ms fades (no clicks), and the clips
are joined with `gap` seconds of silence. It writes:
- public/<out>/narration.wav                 (same loudness as the long-form: cut from its normalised narration)
- src/episodes/<out>/timing.json             (one section per scene, the same words re-timed; C(...) cues work)
- src/episodes/<out>/voice.json              (lip-sync envelope, via voice_envelope.py)
- src/episodes/<out>/expression.json         (Wil's expression plan, via wil_director.py)
"""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    cfg = json.load(open(sys.argv[1], encoding="utf-8"))
    src_t = json.load(open(os.path.join(ROOT, cfg["timing"]), encoding="utf-8"))
    y, sr = sf.read(os.path.join(ROOT, cfg["audio"]), always_2d=False)
    if y.ndim > 1:
        y = y.mean(axis=1)
    words = [w for s in src_t["sections"] for w in s["words"]]
    lead, gap = cfg.get("lead", 0.25), cfg.get("gap", 0.3)
    out = [np.zeros(int(lead * sr), np.float32)]
    t = lead
    sections = []
    fade = int(0.008 * sr)
    for clip in cfg["clips"]:
        a, b = clip["from"], clip["to"]
        ws = [w for w in words if w["s"] >= a - 0.05 and w["e"] <= b + 0.05]
        assert ws, f"no words in {a}-{b}"
        i0, i1 = words.index(ws[0]), words.index(ws[-1])
        prev_e = words[i0 - 1]["e"] if i0 > 0 else 0.0
        next_s = words[i1 + 1]["s"] if i1 + 1 < len(words) else len(y) / sr
        # cut in the silence: at most 0.12 s outside the words, and never into a neighbouring word
        c0 = max(ws[0]["s"] - 0.12, (prev_e + ws[0]["s"]) / 2)
        c1 = min(ws[-1]["e"] + 0.15, (ws[-1]["e"] + next_s) / 2)
        seg = y[int(c0 * sr):int(c1 * sr)].astype(np.float32).copy()
        seg[:fade] *= np.linspace(0, 1, fade)
        seg[-fade:] *= np.linspace(1, 0, fade)
        shift = t - c0
        sw = [{"w": w["w"], "s": round(w["s"] + shift, 3), "e": round(w["e"] + shift, 3)} for w in ws]
        scene = clip.get("scene", clip["id"])
        if sections and sections[-1]["id"] == scene:  # clips of one scene share a section
            sections[-1]["words"] += sw
            sections[-1]["end"] = sw[-1]["e"]
        else:
            sections.append({"id": scene, "title": clip.get("title", scene), "start": sw[0]["s"], "end": sw[-1]["e"], "words": sw})
        out.append(seg)
        t += len(seg) / sr
        pause = clip.get("gap", gap)
        out.append(np.zeros(int(pause * sr), np.float32))
        t += pause
        print(f"{clip['id']:14} {sw[0]['s']:6.2f}-{sw[-1]['e']:6.2f}s  {' '.join(w['w'] for w in ws)}")
    audio = np.concatenate(out)
    pub = os.path.join(ROOT, "public", cfg["out"])
    epi = os.path.join(ROOT, "src", "episodes", cfg["out"])
    os.makedirs(pub, exist_ok=True)
    os.makedirs(epi, exist_ok=True)
    wav = os.path.join(pub, "narration.wav")
    sf.write(wav, audio, sr)
    narration_end = round(sections[-1]["end"], 3)
    json.dump({"source": f"cut from {cfg['audio']}", "fps": 30, "narrationEnd": narration_end, "sections": sections},
              open(os.path.join(epi, "timing.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"narration {len(audio) / sr:.1f}s (speech ends {narration_end:.1f}s) -> {wav}")
    subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "voice_envelope.py"), wav, os.path.join(epi, "voice.json")], check=True)
    # Wil's expression plan reads public/<basename>/narration.wav
    subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "wil_director.py"), epi], check=False)


if __name__ == "__main__":
    main()
