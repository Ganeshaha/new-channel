"""Aggregate per_frame.jsonl + holdtime.json + persistent.json into measurements.json and markdown tables (tables.md)."""
import json, os
import numpy as np

ROOT = r"C:/Users/ganes/Desktop/New Channel/research/layout-study"
REF_WHITE = ["salubrious-snail", "next-level-commander", "really-bad-at-mtg", "33-elk"]


def q(vals):
    v = np.array([x for x in vals if x is not None], dtype=float)
    if len(v) == 0:
        return None
    return dict(n=int(len(v)), median=round(float(np.median(v)), 2), p25=round(float(np.percentile(v, 25)), 2), p75=round(float(np.percentile(v, 75)), 2),
                p10=round(float(np.percentile(v, 10)), 2), p90=round(float(np.percentile(v, 90)), 2))


def summarise(rows):
    allr = rows
    paper = [r for r in rows if r.get("paper") and not r.get("empty")]
    s = dict(frames=len(allr), videos=len(set(r["video"] for r in allr)), paper_frames=len(paper),
             paper_share=round(100 * len(paper) / max(1, len(allr)), 1))
    if not paper:
        return s
    for k in ["m_left", "m_right", "m_top", "m_bottom", "ink", "filled", "elements", "com_x", "com_y", "cards", "card_area", "text_lines"]:
        s[k] = q([r.get(k) for r in paper])
    s["min_side_margin"] = q([min(r["m_left"], r["m_right"]) for r in paper if "m_left" in r])
    s["frames_with_card_pct"] = round(100 * np.mean([r.get("cards", 0) >= 1 for r in paper]), 1)
    s["frames_with_3plus_cards_pct"] = round(100 * np.mean([r.get("cards", 0) >= 3 for r in paper]), 1)
    s["cards_when_present"] = q([r["cards"] for r in paper if r.get("cards", 0) >= 1])
    s["card_height_all"] = q([h for r in paper for h in r.get("card_h", [])])
    s["card_height_largest"] = q([max(r["card_h"]) for r in paper if r.get("card_h")])
    s["card_height_when_single"] = q([r["card_h"][0] for r in paper if r.get("cards") == 1])
    s["card_gap_pct_of_width"] = q([g for r in paper for g in r.get("card_gaps", [])])
    s["card_gap_separated_pct_of_width"] = q([g for r in paper for g in r.get("card_gaps", []) if g > 0.5])
    s["card_pairs_touching_or_overlapping_pct"] = round(100 * np.mean([g <= 0.5 for r in paper for g in r.get("card_gaps", [])]), 1) if any(r.get("card_gaps") for r in paper) else None
    s["card_tilt_deg"] = q([t for r in paper for t in r.get("card_tilt", [])])
    tl = [r for r in paper if "text_caps" in r]
    s["text_cap_all_lines"] = q([c for r in tl for c in r["text_caps"]])
    s["text_cap_display_lines"] = q([c for r in tl for c in r["text_caps"] if c >= 2.0])
    s["text_cap_largest_per_frame"] = q([max(r["text_caps"]) for r in tl if r["text_caps"]])
    s["text_lines_display"] = q([sum(1 for c in r["text_caps"] if c >= 2.0) for r in tl])
    s["frames_with_text_pct"] = round(100 * np.mean([len(r["text_caps"]) > 0 for r in tl]), 1) if tl else None
    s["bg_rgb_median"] = [round(float(np.median([r["bg"][i] for r in paper])), 1) for i in range(3)]
    # ours-only extras
    if any("nm_left" in r for r in paper):
        for k in ["nm_left", "nm_right", "nm_top", "nm_bottom", "nm_com_x", "nm_ink", "mascot_h", "mascot_w"]:
            s[k] = q([r.get(k) for r in paper])
    return s


def main():
    import glob
    rows = [json.loads(l) for f in sorted(glob.glob(f"{ROOT}/data/per_frame_*.jsonl")) for l in open(f, encoding="utf-8")]
    hold = json.load(open(f"{ROOT}/holdtime.json")) if os.path.exists(f"{ROOT}/holdtime.json") else {}
    persist = {}
    for f in glob.glob(f"{ROOT}/data/persistent_*.json"):
        persist.update(json.load(open(f)))
    chans = sorted(set(r["channel"] for r in rows))
    out = dict(method_note="see REPORT.md; percentages are of frame width (x-metrics) or height (y-metrics); card height = long side for portrait cards",
               channels={}, per_video={}, hold=hold, persistent_overlays=persist)
    for ch in chans:
        cr = [r for r in rows if r["channel"] == ch]
        out["channels"][ch] = summarise(cr)
        for v in sorted(set(r["video"] for r in cr)):
            out["per_video"][f"{ch}/{v}"] = summarise([r for r in cr if r["video"] == v])
        hv = [h for k, h in hold.get(ch, {}).items() if not k.endswith("_no_mascot")]
        if hv:
            out["channels"][ch]["hold"] = {k: round(float(np.median([h[k] for h in hv if h.get(k) is not None])), 2)
                                           for k in ["layout_hold_median_s", "layout_changes_per_min", "element_adds_per_min", "share_seconds_static", "events_per_min"]
                                           if any(h.get(k) is not None for h in hv)}
    ref = [r for r in rows if r["channel"] in REF_WHITE]
    out["channels"]["_REFERENCE_WHITE_POOLED"] = summarise(ref)
    hv = [h for ch in REF_WHITE for k, h in hold.get(ch, {}).items()]
    if hv:
        out["channels"]["_REFERENCE_WHITE_POOLED"]["hold"] = {k: round(float(np.median([h[k] for h in hv if h.get(k) is not None])), 2)
                                                             for k in ["layout_hold_median_s", "layout_changes_per_min", "element_adds_per_min", "share_seconds_static", "events_per_min"]}
    json.dump(out, open(f"{ROOT}/measurements.json", "w"), indent=1)
    print(json.dumps({c: {k: (v["median"] if isinstance(v, dict) and "median" in v else v) for k, v in s.items()} for c, s in out["channels"].items()}, indent=0)[:9000])


if __name__ == "__main__":
    main()
