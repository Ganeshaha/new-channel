"""Episode 002 narration: script -> Wil's voice (NARRATOR preset) -> real word timing.

    python scripts/ep002_narration.py texts      # write per-section TTS input (with delivery directions)
    python scripts/ep002_narration.py generate   # narrate missing sections on OpenRouter (Fish Audio S2.1 Pro, paid)
    python scripts/ep002_narration.py timing     # trim, transcribe, align -> timing.json + public/ep002/narration.wav

Delivery directions are Fish Audio inline tags ([tag] before the words they shape). They aren't read aloud.
Pronunciation fixes only change what the voice is given; timing.json keeps the script's own words,
so every visual cue in Ep002.tsx still matches.
"""
import difflib, json, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ep002_timing import sections  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))          # video/
REPO = os.path.dirname(ROOT)
STUDIO = os.path.join(REPO, "studio")
VOICE_DIR = os.path.join(STUDIO, "voice", "ep002")
# Narrator presets. Pick one with the NARRATOR env var (default: fenrir, chosen by the user on 25 Sep 2026).
#   fish-clone: Fish Audio S2.1 Pro cloning studio/voice/wil-reference.wav; takes inline [direction] tags.
#               Sounded AI to the user (cloning a synthetic clip; flat pitch).
#   fenrir:     Gemini 3.8 Flash TTS, stock voice "Fenrir". Plain text only: Gemini reads [tags] and style
#               instructions out loud, so the delivery has to come from the script's own punctuation.
NARRATORS = {
    "fish-clone": {"model": "fish-audio/s2.1-pro", "voice": None, "clone": True, "tags": True, "ext": ".mp3", "dir": "sections"},
    "fenrir": {"model": "google/gemini-3.8-flash-tts", "voice": "Fenrir", "clone": False, "tags": False, "ext": ".wav", "dir": "sections-fenrir"},
}
NARRATOR = NARRATORS[os.environ.get("NARRATOR", "fenrir")]
SEC_DIR = os.path.join(VOICE_DIR, NARRATOR["dir"])
REF = os.path.join(STUDIO, "voice", "wil-reference.wav")
REF_TEXT = os.path.join(STUDIO, "voice", "wil-reference.txt")
TIMING = os.path.join(ROOT, "src", "episodes", "ep002", "timing.json")
NARRATION = os.path.join(ROOT, "public", "ep002", "narration.wav")
GAP = 0.35   # breathing room between sections
LEAD = 0.3   # silence before the first word

# Extra silence (s) spliced in after a phrase, so a ruling or a reveal lands before the next line.
# TTS reads rules at ~200 wpm; explainer research says rules payoffs want ~150-170 wpm with a beat
# after each ruling (research/youtube-general/REPORT.md). Free: no regeneration, the words don't change.
BEATS = {
    "the-combo": [("Himself.", 0.5), ("keeps the loop going.", 0.35),
                  ("copies of their whole board.", 0.45), ("next end step, though.", 0.35)],
    "the-gap": [("That's rule 603.3.", 0.5), ("That's 603.3d.", 0.5), ("That's 603.3a.", 0.4)],
    "the-catch": [("you're not allowed to win.", 0.35)],
    "how-to-stop-it": [("That's rule 608.2b.", 0.5)],
}

# Word-level pronunciation fixes (script word -> what the voice is told to say).
SPOKEN = {
    "Wil": "Will",
    "D.": "Dee",  # otherwise read as the Roman numeral ("Will the 500th")
    "r/magicTCG,": "r slash magic TCG,",
    "603.3.": "six-oh-three point three.",
    "603.3d.": "six-oh-three point three D.",
    "603.3a.": "six-oh-three point three A.",
    "608.2b.": "six-oh-eight point two B.",
}

# Delivery directions: (phrase in the section, Fish Audio tag inserted just before it). First match only.
DIRECTIONS = {
    "cold-open": [
        ("The new Jace", "[intrigued, building up]"),
        ("With one card", "[leaning in, a little incredulous]"),
        ("Yeah.", "[short beat, dry]"),
        ("Wizards messed up", "[deadpan]"),
    ],
    "intro-and-promise": [
        ("Hello everyone", "[warm and upbeat]"),
        ("A Redditor", "[casual aside]"),
        ("We'll go through", "[confident]"),
        ("And there's one card", "[lower, teasing]"),
        ("Let's take a look", "[upbeat]"),
    ],
    "the-two-cards": [
        ("All right, real quick", "[brisk]"),
        ("Already a bit weird", "[amused]"),
        ("Merry Christmas", "[dry, amused]"),
        ("Next up", "[brisk]"),
    ],
    "the-combo": [
        ("Now let's say", "[intrigued]"),
        ("Dack's ability is resolving", "[slowing down, explaining step by step]"),
        ("Venser. Yeah. Himself", "[pitch rising, disbelief]"),
        ("We get two token", "[matter-of-fact]"),
        ("And it just keeps going", "[excited, picking up speed]"),
        ("And yeah, before anyone", "[knowing, dry]"),
    ],
    "subscribe-segment": [
        ("Quick thing", "[quick and friendly]"),
        ("Subscribe, or Dack", "[playful]"),
        ("Okay. Quick quiz", "[upbeat]"),
        ("Pause if you want", "[slower, teasing]"),
        ("Three, two, one", "[counting down slowly]"),
    ],
    "the-gap": [
        ("It's when it goes", "[revealing the answer]"),
        ("Venser's ability triggers", "[explaining clearly]"),
        ("But you pick the target", "[slowing for emphasis]"),
        ("But yeah, that's the whole", "[satisfied]"),
    ],
    "the-odds": [
        ("Okay, so how often", "[curious]"),
        ("three in seventeen", "[slowing on the numbers]"),
        ("But you can help it along", "[brighter]"),
        ("Lots of ifs", "[casual aside]"),
    ],
    "the-catch": [
        ("Now, there's a catch", "[excited, grinning]"),
        ("Every creature Dack finds", "[explaining]"),
        ("you're not allowed to win", "[laughing a little]"),
        ("Love that for you", "[dry]"),
        ("Hold that thought", "[conspiratorial]"),
        ("The dream version", "[brighter]"),
        ("Count your library", "[wry]"),
    ],
    "how-to-stop-it": [
        ("So what if someone", "[helpful, a bit serious]"),
        ("that trigger does nothing", "[emphatic]"),
        ("Swords to Plowshares does it", "[brisk]"),
        ("Hold one up", "[confident]"),
    ],
    "the-venser-problem": [
        ("One more thing", "[lower, conspiratorial]"),
        ("This can happen to", "[mock alarm]"),
        ("Which makes Venser", "[dry]"),
    ],
    "is-this-a-problem-comment-prompt": [
        ("So, did Wizards mess up", "[blunt]"),
        ("Has Wizards said anything", "[casual]"),
        ("Should we worry about it", "[relaxed, reassuring]"),
        ("hey, this deck", "[imitating a friend, casual]"),
        ("If you'd rather not", "[easygoing]"),
        ("Would you let this fly", "[warm, inviting]"),
    ],
    "close": [
        ("So that's the combo", "[wrapping up, upbeat]"),
        ("Thread's linked below", "[friendly]"),
        ("Thanks for watching", "[warm]"),
    ],
}


def section_id(title):
    return re.sub(r"[^a-z]+", "-", title.lower().split("(")[0]).strip("-")


def spoken(text):
    return " ".join(SPOKEN.get(w, w) for w in text.split())


def directed(sid, text):
    out = spoken(text)
    for phrase, tag in DIRECTIONS.get(sid, []):
        i = out.find(phrase)
        if i < 0:
            sys.exit(f"direction phrase not found in {sid}: {phrase!r}")
        out = out[:i] + tag + " " + out[i:]
    return out


def items():
    return [(i, section_id(title), title, text) for i, (title, text) in enumerate(sections(), 1)]


def base(i, sid):
    return os.path.join(SEC_DIR, f"{i:02d}-{sid}")


def cmd_texts():
    os.makedirs(SEC_DIR, exist_ok=True)
    total = 0
    for i, sid, _, text in items():
        d = directed(sid, text) if NARRATOR["tags"] else spoken(text)
        open(base(i, sid) + ".txt", "w", encoding="utf-8").write(d)
        open(base(i, sid) + ".plain.txt", "w", encoding="utf-8").write(spoken(text))
        total += len(d)
        print(f"{i:02d} {sid:34} {len(d):5} chars")
    print(f"total {total} chars")


def cmd_generate():
    for i, sid, _, _ in items():
        out = base(i, sid) + NARRATOR["ext"]
        if os.path.exists(out):
            print(f"skip {os.path.basename(out)} (exists)")
            continue
        env = dict(os.environ, RUN_DIR=VOICE_DIR, BUDGET_USD=os.environ.get("BUDGET_USD", "3"))
        cmd = ["node", os.path.join(STUDIO, "tools", "openrouter.mjs"), "tts", "@" + base(i, sid) + ".txt", out,
               "--model", NARRATOR["model"]]
        if NARRATOR["voice"]:
            cmd += ["--voice", NARRATOR["voice"]]
        if NARRATOR["clone"]:
            cmd += ["--ref", REF, "--ref-text", "@" + REF_TEXT]
        subprocess.run(cmd, check=True, env=env)


def norm(w):
    return re.sub(r"[^a-z0-9']", "", w.lower().replace("’", "'"))


def cmd_timing():
    import numpy as np
    import librosa
    import soundfile as sf
    from faster_whisper import WhisperModel

    model = WhisperModel("small.en", device="cpu", compute_type="int8")
    sr = 48000
    t = LEAD
    chunks = [np.zeros(int(LEAD * sr), dtype=np.float32)]
    secs = []
    for i, sid, title, text in items():
        y, _ = librosa.load(base(i, sid) + NARRATOR["ext"], sr=sr, mono=True)
        y, _ = librosa.effects.trim(y, top_db=40)
        y = np.concatenate([np.zeros(int(0.05 * sr), np.float32), y, np.zeros(int(0.05 * sr), np.float32)])
        tmp = base(i, sid) + ".trim.wav"
        sf.write(tmp, y, sr)
        segs, _ = model.transcribe(tmp, word_timestamps=True, beam_size=5)
        heard = [(norm(w.word), w.start, w.end) for s in segs for w in s.words if norm(w.word)]

        # script words, each expanded to the tokens the voice actually says
        disp = text.split()
        toks, owner = [], []
        for k, w in enumerate(disp):
            for tk in re.split(r"[\s\-]+", SPOKEN.get(w, w)):
                if norm(tk):
                    toks.append(norm(tk)); owner.append(k)
        sm = difflib.SequenceMatcher(a=toks, b=[h[0] for h in heard], autojunk=False)
        tok_time = [None] * len(toks)
        for a, b, n in sm.get_matching_blocks():
            for j in range(n):
                tok_time[a + j] = (heard[b + j][1], heard[b + j][2])
        # fill unmatched tokens by interpolating between matched neighbours
        dur = len(y) / sr
        known = [k for k, v in enumerate(tok_time) if v]
        for k in range(len(toks)):
            if tok_time[k]:
                continue
            prev = max([p for p in known if p < k], default=None)
            nxt = min([p for p in known if p > k], default=None)
            s0 = tok_time[prev][1] if prev is not None else 0.05
            s1 = tok_time[nxt][0] if nxt is not None else dur - 0.05
            gap_n = (nxt if nxt is not None else len(toks)) - (prev if prev is not None else -1)
            step = (s1 - s0) / max(gap_n, 1)
            pos = k - (prev if prev is not None else -1)
            tok_time[k] = (s0 + step * (pos - 1), s0 + step * pos)
        words = []
        for k, w in enumerate(disp):
            ts = [tok_time[j] for j in range(len(toks)) if owner[j] == k]
            if not ts:  # punctuation-only word
                ts = [words[-1]["_t"]] if words else [(0.05, 0.1)]
            s, e = min(x[0] for x in ts), max(x[1] for x in ts)
            words.append({"w": w, "s": round(t + s, 3), "e": round(t + e, 3), "_t": (s, e)})
        matched = sum(1 for v in sm.get_matching_blocks() for _ in range(v.size))
        # beats: open up the pause after each listed phrase (words were timed on the audio without them)
        dn = [norm(w) for w in disp]
        for phrase, pause in BEATS.get(sid, []):
            pt = [norm(w) for w in phrase.split()]
            k = next((j + len(pt) - 1 for j in range(len(dn) - len(pt) + 1) if dn[j:j + len(pt)] == pt), None)
            assert k is not None and k + 1 < len(words), f"beat phrase not found (or last word): {sid}: {phrase}"
            cut = (words[k]["e"] + words[k + 1]["s"]) / 2 - t   # middle of the existing pause, section time
            n = int(round(cut * sr))
            y = np.concatenate([y[:n], np.zeros(int(pause * sr), np.float32), y[n:]])
            for w in words[k + 1:]:
                w["s"] = round(w["s"] + pause, 3); w["e"] = round(w["e"] + pause, 3)
        dur = len(y) / sr
        for w in words:
            del w["_t"]
        secs.append({"id": sid, "title": title, "start": words[0]["s"], "end": words[-1]["e"], "words": words})
        print(f"{sid:34} {t:6.1f}s  {dur:5.1f}s  aligned {matched}/{len(toks)} tokens")
        chunks.append(y)
        t += dur
        chunks.append(np.zeros(int(GAP * sr), np.float32))
        t += GAP
    audio = np.concatenate(chunks)
    os.makedirs(os.path.dirname(NARRATION), exist_ok=True)
    raw = NARRATION.replace(".wav", ".raw.wav")
    sf.write(raw, audio, sr)
    # loudness to YouTube's -14 LUFS range, true peak -1.5 dB
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", "loudnorm=I=-15:TP=-1.5:LRA=11",
                    "-ar", str(sr), "-ac", "1", NARRATION], check=True)
    os.remove(raw)
    data = {"source": f"narration ({NARRATOR['model']} {NARRATOR['voice'] or 'clone'}; faster-whisper timing)", "fps": 30,
            "narrationEnd": round(t, 3), "sections": secs}
    json.dump(data, open(TIMING, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"narration ends at {t:.1f}s -> {NARRATION}")
    # the voice envelope drives Wil's lip-sync and talking gestures
    subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "voice_envelope.py"), NARRATION,
                    os.path.join(os.path.dirname(TIMING), "voice.json")], check=True)


if __name__ == "__main__":
    {"texts": cmd_texts, "generate": cmd_generate, "timing": cmd_timing}[sys.argv[1] if len(sys.argv) > 1 else "texts"]()
