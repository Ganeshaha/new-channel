import json, csv, sys
R = r"C:/Users/ganes/Desktop/New Channel/research"
out = {}
def top(rows, n):
    rows = [r for r in rows if r[2] and r[3] and r[3] >= 240]  # long-form, >=4 min
    rows = [r for r in rows if not any(k in r[1].lower() for k in ("podcast","live","stream","magic mirror"))]
    rows = [r for r in rows if r[3] <= 3600]
    rows.sort(key=lambda r: -r[2])
    return rows[:n]
def num(x):
    try: return float(x)
    except: return None
for c in ["salubrious-snail","next-level-commander"]:
    d = json.load(open(f"{R}/{c}/analysis/dataset.json", encoding="utf-8"))
    rows = [(v["id"], v["title"], v.get("views") or 0, v.get("duration") or 0) for v in d if v.get("kind")=="videos"]
    out[c] = top(rows, 5)
import glob, os
dc=[]
for f in glob.glob(f"{R}/defcat-mtg/analysis/meta/videos/*.info.json"):
    j=json.load(open(f,encoding="utf-8"))
    dc.append((j["id"],j.get("title",""),j.get("view_count") or 0,j.get("duration") or 0))
out["defcat-mtg"]=top(dc,4)
for c in ["the-trinket-mage","maldhound"]:
    rows=[]
    for line in open(f"{R}/{c}/analysis/videos_flat.tsv", encoding="utf-8"):
        p=line.rstrip("\n").split("\t")
        rows.append((p[0],p[1],num(p[2]) or 0,num(p[3]) or 0))
    out[c]=top(rows, 5 if c=="the-trinket-mage" else 4)
for c in ["really-bad-at-mtg","33-elk"]:
    rows=[]
    for line in open(f"{c}.tsv", encoding="utf-8", errors="replace"):
        p=line.rstrip("\n").split("\t")
        rows.append((p[0],p[1],num(p[2]) or 0,num(p[3]) or 0))
    out[c]=top(rows,5)
json.dump(out, open("picks.json","w",encoding="utf-8"), indent=1, ensure_ascii=False)
for c,v in out.items():
    print("==",c)
    for r in v: print("  ",r)
