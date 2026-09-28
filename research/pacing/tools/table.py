"""Markdown tables from results.json + meta/*.json -> tables.md"""
import json, os
import numpy as np

ROOT = r"C:/Users/ganes/Desktop/New Channel/research/pacing"
res = json.load(open(f"{ROOT}/results.json"))
picks = json.load(open(f"{ROOT}/picks.json", encoding="utf-8"))
order = [p["id"] for p in picks]


def meta(v):
    b = v.replace("_noWil", "")
    m = json.load(open(f"{ROOT}/meta/{b}.json", encoding="utf-8"))
    return m


def f(x, d=1):
    return "–" if x is None else (f"{x:.{d}f}" if isinstance(x, float) else str(x))


rows = []
hdr = ("| Group | Channel / video | Views | Length | Cuts /min | Median s between cuts | Any change /min | "
       "Median s between changes | Still time % | Longest still (s) | Still holds ≥10 s | Things moving at once (median / p90) |")
sep = "|" + "---|" * 12
lines = [hdr, sep]
groups = {}
for v in order + ["ours_ep002_v22_noWil"]:
    if v not in res:
        continue
    r = res[v]; m = meta(v)
    ch = (m.get("channel") or "Ours").replace("Wild Card Commander", "Ours")
    t = (m.get("title") or "")[:38]
    name = f"{ch}: {t}" + (" (Wil masked)" if v.endswith("_noWil") else "")
    views = m.get("views"); dur = m.get("duration")
    g = m.get("group", "ours")
    groups.setdefault(g, []).append(r)
    lines.append(f"| {g} | {name} | {views/1000:.0f}k |" if views else f"| {g} | {name} | – |")
    lines[-1] += (f" {int(dur)//60}:{int(dur)%60:02d} |" if dur else " 7:00 |")
    lines[-1] += (f" {r['cuts_per_min']:.1f} | {f(r['median_s_between_cuts'])} | {r['changes_per_min']:.1f} | "
                  f"{f(r['median_s_between_changes'])} | {100*r['share_still']:.0f} | {r['longest_still_s']:.0f} | "
                  f"{r['still_holds_ge10s']} | {r['blobs_moving_median']:.0f} / {r['blobs_moving_p90']:.0f} |")
out = "\n".join(lines)
out += "\n\n**Group medians**\n\n| Group | n | Cuts /min | Any change /min | Median s between changes | Still time % | Longest still (s) |\n|---|---|---|---|---|---|---|\n"
for g, rs in groups.items():
    def md(k):
        xs = [r[k] for r in rs if r[k] is not None]
        return float(np.median(xs)) if xs else None
    out += (f"| {g} | {len(rs)} | {md('cuts_per_min'):.1f} | {md('changes_per_min'):.1f} | "
            f"{f(md('median_s_between_changes'))} | {100*md('share_still'):.0f} | {md('longest_still_s'):.0f} |\n")
open(f"{ROOT}/tables.md", "w", encoding="utf-8").write(out)
print(out)
