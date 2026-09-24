"""Check that generated narration says exactly what the script says. Free: runs locally with faster-whisper.

    python tools/check_voice.py narration.wav expected.txt

Prints a match score and every word the voice added, dropped or changed. Anything under ~97% deserves a listen.
"""
import difflib, re, sys
from faster_whisper import WhisperModel


def words(text):
    return re.findall(r"[a-z0-9']+", text.lower().replace("’", "'"))


def main(audio, expected_path):
    expected = words(open(expected_path, encoding="utf-8").read())
    model = WhisperModel("small.en", device="cpu", compute_type="int8")
    segs, _ = model.transcribe(audio, vad_filter=True)
    heard = words(" ".join(s.text for s in segs))
    sm = difflib.SequenceMatcher(a=expected, b=heard, autojunk=False)
    print(f"match: {sm.ratio():.1%}  ({len(expected)} words expected, {len(heard)} heard)")
    for op, a1, a2, b1, b2 in sm.get_opcodes():
        if op == "equal":
            continue
        print(f"  {op:8} script: {' '.join(expected[a1:a2]) or '-':40.40}  audio: {' '.join(heard[b1:b2]) or '-'}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
