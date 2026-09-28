"""Write episodes/003-cabbage-merchant/DECKLIST.txt: the Cabbage Merchant list grouped by type, with Scryfall prices,
plus an import-ready block. Source: the Deck Check import list (Cabbage Man - decklist.txt)."""
import datetime, json, os, re, sys, urllib.request

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = r"D:/Deck Check/06 - Series & Episodes/Cabbage Man/Cabbage Man - decklist.txt"
OUT = os.path.join(ROOT, "episodes", "003-cabbage-merchant", "DECKLIST.txt")
UA = {"User-Agent": "wildcardcommander/1.0", "Accept": "application/json", "Content-Type": "application/json"}
UPGRADES = ["Unwinding Clock", "Fomori Vault", "Inventors' Fair", "Collective Voyage", "Horn of Greed",
            "Doubling Season", "Parallel Lives", "Primal Vigor"]

rows = []
for line in open(SRC, encoding="utf-8"):
    m = re.match(r"(\d+)\s+(.+)", line.strip())
    if m:
        rows.append((int(m.group(1)), m.group(2)))
names = [n for _, n in rows] + UPGRADES
cards = {}
for i in range(0, len(names), 70):
    body = json.dumps({"identifiers": [{"name": n} for n in names[i:i + 70]]}).encode()
    data = json.load(urllib.request.urlopen(urllib.request.Request("https://api.scryfall.com/cards/collection", data=body, headers=UA)))
    assert not data.get("not_found"), data["not_found"]
    for c in data["data"]:
        cards[c["name"]] = c
        cards[c["name"].split(" // ")[0]] = c


def usd(n):
    p = cards[n].get("prices") or {}
    return float(p.get("usd") or p.get("usd_foil") or 0)


def kind(n):
    t = cards[n]["type_line"].split(" // ")[0]
    for k, key in (("Lands", "Land"), ("Creatures", "Creature"), ("Planeswalkers", "Planeswalker"), ("Artifacts", "Artifact"),
                   ("Enchantments", "Enchantment"), ("Instants", "Instant"), ("Sorceries", "Sorcery")):
        if key in t and not (k == "Lands" and "Creature" in t):
            return k
    return "Other"


commander = rows[0][1]
groups = {}
for q, n in rows[1:]:
    groups.setdefault(kind(n), []).append((q, n))
total = sum(usd(n) * (0 if n == "Forest" else q) for q, n in rows)
count = sum(q for q, _ in rows)
gc = [n for _, n in rows if cards[n].get("game_changer")]
illegal = [n for _, n in rows if cards[n]["legalities"]["commander"] != "legal"]
today = datetime.date.today().strftime("%d %b %Y")

L = [
    "THE CABBAGE CONVERTER: The Cabbage Merchant (Commander deck)",
    "=" * 62,
    f"{count} cards. About ${total:.0f} without basic lands (Scryfall prices, {today}).",
    f"Bracket 2: {'no Game Changers' if not gc else 'Game Changers: ' + ', '.join(gc)}, no infinite combos.",
    f"Commander legal: {'yes, every card' if not illegal else 'NO: ' + ', '.join(illegal)}.",
    "",
    f"COMMANDER (1)",
    f"  1 {commander:<40} ${usd(commander):>6.2f}",
]
for k in ("Creatures", "Artifacts", "Enchantments", "Instants", "Sorceries", "Planeswalkers", "Lands", "Other"):
    g = sorted(groups.get(k, []), key=lambda x: x[1])
    if not g:
        continue
    L += ["", f"{k.upper()} ({sum(q for q, _ in g)})"]
    for q, n in g:
        L.append(f"  {q} {n:<40} " + ("(basic)" if n == "Forest" else f"${usd(n):>6.2f}"))
up_total = sum(usd(n) for n in UPGRADES)
L += ["", f"UPGRADES FROM THE VIDEO (not in the list; about ${up_total:.0f} for all eight)"]
for n in UPGRADES:
    L.append(f"  {n:<42} ${usd(n):>6.2f}")
L += [
    "",
    "Notes:",
    "  - The land count (16 Forest) was inferred to make 100 cards; the original list didn't record it.",
    "  - Fomori Vault and Inventors' Fair can replace two Forests.",
    "",
    "IMPORT (paste into Moxfield or Archidekt)",
    "-" * 42,
] + [f"{q} {n}" for q, n in rows]
open(OUT, "w", encoding="utf-8").write("\n".join(L) + "\n")
print(f"{OUT}: {count} cards, ${total:.2f}, upgrades ${up_total:.2f}, game changers {gc}, illegal {illegal}")
