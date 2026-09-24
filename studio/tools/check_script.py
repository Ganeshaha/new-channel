"""Flag writing that reads as AI-generated. Free, local. Required before any viewer-facing text ships (see VOICE.md).

    python studio/tools/check_script.py episodes/002-.../SCRIPT.md      # narration lines (starting with ">") in a script
    python studio/tools/check_script.py some_title_or_description.txt    # any plain text file

It does two things:
  1. Measures word rates against the targets in VOICE.md (measured from ~670k words of real creator speech).
  2. Flags known AI tells: vocabulary, stock phrases, negative parallelisms, em dashes, tidy aphorism endings.
Passing the checker is necessary but NOT sufficient. A human line-by-line read-aloud pass is still required.
"""
import re
import sys

# Rates per 1,000 words: (pattern, max or (min, max)), from the transcripts of the three studied channels.
RATES = {
    "honestly": (r"\bhonestly\b", 0.5),
    "actually": (r"\bactually\b", 2.0),
    "really": (r"\breally\b", 2.5),
    "I think": (r"\bi think\b", 3.0),
    "kind of / sort of": (r"\b(?:kind of|sort of)\b", 3.0),
    "we / us / our": (r"\b(?:we|we're|we've|we'll|us|our)\b", (10, 35)),
    "'So…' openers": (r"(?:^|[.?!]\s+)so\b", (2, 8)),
}

# Known AI tells. Each is (label, regex). Matches are reported with their sentence for a human to judge.
TELLS = [
    ("AI vocabulary", r"\b(?:delve|delves|delving|tapestry|testament|pivotal|underscore[sd]?|intricate|showcas(?:e|es|ing)|vibrant|boasts?|nestled|realm|landscape|embark|foster(?:s|ing)?|seamless(?:ly)?|robust|leverag(?:e|es|ing)|elevate[sd]?|unleash|unlock(?:s|ing)?|navigat(?:e|es|ing) the|ever-evolving|game[- ]changer|crucial|additionally|moreover|furthermore)\b"),
    ("Stock opener/closer", r"\b(?:let's dive in|dive into|without further ado|buckle up|here's the (?:thing|kicker|deal|uncomfortable truth)|real talk|in this video,? (?:we|i)(?:'ll| will)|in conclusion|to sum (?:it )?up|at the end of the day|it's (?:important|worth) (?:to note|noting)|the bottom line|make no mistake|spoiler alert|stay tuned)\b"),
    ("Negative parallelism", r"\b(?:not (?:just|only) [^.?!]{1,40}(?:,|;)? but(?: also)?|it's not [^.?!]{1,30}[.,;] it's|isn't [^.?!]{1,30}[.;] it's|rather than [^.?!]{1,30}, [^.?!]{1,20})"),
    ("Copula dodge", r"\b(?:serves as|stands as|acts as a testament|marks a (?:shift|turning point)|represents a (?:shift|new era))\b"),
    ("Significance puffery", r"\b(?:pivotal moment|indelible|changes everything|a new era|redefin(?:e|es|ing) (?:the|how)|nothing short of|like never before)\b"),
    ("Vague attribution", r"\b(?:experts (?:say|agree|argue)|many (?:people|players) (?:say|believe)|studies show|it is widely (?:believed|known))\b"),
    ("Em dash", r"—"),
    ("Aphorism ending (check)", r"(?:^|[.?!]\s+)(?:that's|and that's) (?:the (?:point|whole point|secret|magic|beauty)|what (?:it's|this is) all about|everything)\.?$"),
]


def narration(text: str, path: str) -> str:
    if path.lower().endswith(".md") and re.search(r"^>\s", text, re.M):
        body = text.split("## Chapters")[0]
        lines = [l[1:].strip() for l in body.splitlines() if l.startswith(">") and not l.startswith("> **") and not l.startswith("> -")]
        return "\n".join(re.sub(r"\[[^\]]*\]", "", l) for l in lines if l)
    return text


def main(path: str) -> int:
    raw = open(path, encoding="utf-8").read()
    is_script = path.lower().endswith(".md") and bool(re.search(r"^>\s", raw, re.M))
    text = narration(raw, path)
    low = text.lower().replace("’", "'")
    words = max(1, len(low.split()))
    print(f"{path}: {words} words\n\nRates per 1,000 words (targets from VOICE.md):")
    fails = 0
    for label, (pat, target) in RATES.items():
        n = len(re.findall(pat, low, re.M))
        rate = n / words * 1000
        ok = rate <= target if isinstance(target, float) else target[0] <= rate <= target[1]
        if isinstance(target, tuple) and (not is_script or words < 150):
            ok = True  # ranges describe spoken narration; skip for titles, descriptions, posts
        fails += not ok
        print(f"  {'OK ' if ok else 'FIX'} {label:20} {n:>3} = {rate:5.1f}   target {'≤' + str(target) if isinstance(target, float) else f'{target[0]}–{target[1]}'}")
    if is_script and words >= 150:
        import statistics
        lens = [len(x.split()) for x in re.split(r"(?<=[.?!])\s+", text.strip()) if x.split()]
        med = statistics.median(lens)
        short = sum(l <= 6 for l in lens) / len(lens) * 100
        long_ = sum(l >= 25 for l in lens) / len(lens) * 100
        checks = [("median sentence length", med, 6, 10), ("sentences of <=6 words (%)", short, 35, 55), ("sentences of >=25 words (%)", long_, 0, 8)]
        print("\nCadence (targets from Next Level Commander / Salubrious Snail transcripts):")
        for label, val, lo, hi in checks:
            ok = lo <= val <= hi
            fails += not ok
            print(f"  {'OK ' if ok else 'FIX'} {label:28} {val:5.1f}   target {lo}–{hi}")
    print("\nAI tells (review each; some are false positives):")
    sentences = re.split(r"(?<=[.?!])\s+", text)
    found = 0
    for label, pat in TELLS:
        for sent in sentences:
            if re.search(pat, sent.lower().replace("’", "'")):
                found += 1
                print(f"  [{label}] {sent.strip()[:140]}")
    if not found:
        print("  none found")
    print(f"\nResult: {fails} rate problem(s), {found} tell(s) to review. Then do the read-aloud pass (VOICE.md).")
    return 1 if fails else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1]))
