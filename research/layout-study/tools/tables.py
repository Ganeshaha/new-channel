"""Render markdown tables from measurements.json -> tables.md (pasted into REPORT.md)."""
import json

ROOT = r"C:/Users/ganes/Desktop/New Channel/research/layout-study"
m = json.load(open(f"{ROOT}/measurements.json"))
C = m["channels"]
ORDER = ["salubrious-snail", "next-level-commander", "really-bad-at-mtg", "33-elk", "the-trinket-mage", "defcat-mtg", "maldhound", "_REFERENCE_WHITE_POOLED", "ours"]
SHORT = {"salubrious-snail": "Salubrious Snail", "next-level-commander": "Next Level Cmdr", "really-bad-at-mtg": "Really Bad At MTG",
         "33-elk": "3/3 Elk", "the-trinket-mage": "Trinket Mage", "defcat-mtg": "DefCat", "maldhound": "MaldHound",
         "_REFERENCE_WHITE_POOLED": "**Ref pooled (4 page-style)**", "ours": "**Ours (ep002 v17)**"}
ROWS = [
    ("Flat-page frames %", "paper_share", None),
    ("Margin left %W", "m_left", "iqr"), ("Margin right %W", "m_right", "iqr"), ("Margin top %H", "m_top", "iqr"), ("Margin bottom %H", "m_bottom", "iqr"),
    ("Tighter side margin %W", "min_side_margin", "iqr"),
    ("Ink coverage %", "ink", "iqr"), ("Occupied area % (holes filled)", "filled", "iqr"),
    ("Elements on screen", "elements", "iqr"),
    ("Ink centre x %W", "com_x", "iqr"), ("Ink centre y %H", "com_y", "iqr"),
    ("Frames with >=1 card %", "frames_with_card_pct", None), ("Frames with >=3 cards %", "frames_with_3plus_cards_pct", None),
    ("Cards per frame (when any)", "cards_when_present", "iqr"),
    ("Largest card height %H", "card_height_largest", "iqr"), ("Card height when 1 card %H", "card_height_when_single", "iqr"),
    ("All card heights %H", "card_height_all", "iqr"),
    ("Gap between separated cards, % card width", "card_gap_separated_pct_of_width", "iqr"),
    ("Neighbour cards touching/overlapping %", "card_pairs_touching_or_overlapping_pct", None),
    ("Display text cap height %H (lines >=2%)", "text_cap_display_lines", "iqr"),
    ("Largest text per frame %H", "text_cap_largest_per_frame", "iqr"),
    ("Display text lines per frame", "text_lines_display", "iqr"),
    ("Frames with any text line %", "frames_with_text_pct", None),
]


def fmt(v, mode):
    if v is None:
        return "–"
    if isinstance(v, dict):
        if mode == "iqr":
            return f"{v['median']:g} ({v['p25']:g}–{v['p75']:g})"
        return f"{v['median']:g}"
    if isinstance(v, list):
        return ",".join(f"{x:g}" for x in v)
    return f"{v:g}"


def table(chans):
    out = ["| Metric | " + " | ".join(SHORT[c] for c in chans) + " |", "|---|" + "---|" * len(chans)]
    out.append("| Frames (videos) | " + " | ".join(f"{C[c]['frames']} ({C[c]['videos']})" for c in chans) + " |")
    out.append("| Page colour (RGB median) | " + " | ".join(fmt(C[c].get('bg_rgb_median'), None) for c in chans) + " |")
    for label, key, mode in ROWS:
        out.append(f"| {label} | " + " | ".join(fmt(C[c].get(key), mode) for c in chans) + " |")
    hk = [("Layout hold, median s", "layout_hold_median_s"), ("Layout changes / min", "layout_changes_per_min"),
          ("Element pop-ins / min", "element_adds_per_min"), ("Share of seconds with no change", "share_seconds_static")]
    for label, key in hk:
        out.append(f"| {label} | " + " | ".join(fmt(C[c].get('hold', {}).get(key), None) for c in chans) + " |")
    return "\n".join(out)


md = ["## Per-channel metrics (median, IQR in brackets)\n", table([c for c in ORDER if c in C]), ""]
o = C["ours"]
md.append("\n## Ours with the mascot zone removed (x 1450–1830, y 600–1050 @1080p)\n")
md.append("| Metric | Value |\n|---|---|")
for label, key in [("Margin left %W", "nm_left"), ("Margin right %W", "nm_right"), ("Margin top %H", "nm_top"), ("Margin bottom %H", "nm_bottom"),
                   ("Ink centre x %W", "nm_com_x"), ("Ink coverage %", "nm_ink"), ("Mascot height %H", "mascot_h"), ("Mascot width %W", "mascot_w")]:
    md.append(f"| {label} | {fmt(o.get(key), 'iqr')} |")
open(f"{ROOT}/tables.md", "w", encoding="utf-8").write("\n".join(md) + "\n")
print("\n".join(md))
