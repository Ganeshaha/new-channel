"""Download the card scans, token scans and art crops episode 003 uses into public/ep003/ (Scryfall; WotC permission in PERMISSIONS.md)."""
import json, os, re, sys, time, urllib.request

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "ep003")
UA = {"User-Agent": "wildcardcommander/1.0", "Accept": "application/json"}

CARDS = [
    "The Cabbage Merchant", "Llanowar Elves", "Forest", "Temple Bell", "Howling Mine", "Harmonize",
    "Retrofitter Foundry", "Arch of Orazca", "Wren's Run Packmaster", "Dark Depths", "Displaced Dinosaurs",
    "Sol Ring", "Hot Dog Cart", "Halsin, Emerald Archdruid", "Idol of Oblivion", "Night of the Sweets' Revenge",
    "Karn, Living Legacy", "Academy Manufactor", "Clock of Omens", "Sarinth Steelseeker", "Second Harvest",
    "Jaheira, Friend of the Forest", "Peregrin Took", "Elephant Grass", "Unwinding Clock", "Fomori Vault",
    "Inventors' Fair", "Collective Voyage", "Horn of Greed", "Doubling Season", "Parallel Lives", "Primal Vigor",
]
# tokens by set/collector number: (file name, set, number)
TOKENS = [
    ("food-1", "ttla", "19"), ("food-2", "ttla", "20"), ("food-3", "ttla", "21"), ("bear", "ttla", "12"),
    ("marit-lage", "tmh1", "6"), ("eldrazi", "tm3c", "1"), ("construct", "tc18", "20"),
    ("treasure", "tlci", "18"), ("clue", "tmkm", "14"), ("wolf", "tlrw", "10"),
]
ART = ["The Cabbage Merchant", "Displaced Dinosaurs", "Dark Depths", "Halsin, Emerald Archdruid"]

slug = lambda n: re.sub(r"[^a-z0-9]+", "-", n.lower().replace("'", "")).strip("-")


def get(url, path):
    if os.path.exists(path):
        return
    req = urllib.request.Request(url, headers={"User-Agent": UA["User-Agent"]})
    open(path, "wb").write(urllib.request.urlopen(req).read())
    time.sleep(0.1)


def main():
    for d in ("cards", "art"):
        os.makedirs(os.path.join(OUT, d), exist_ok=True)
    body = json.dumps({"identifiers": [{"name": n} for n in CARDS]}).encode()
    req = urllib.request.Request("https://api.scryfall.com/cards/collection", data=body,
                                 headers={**UA, "Content-Type": "application/json"})
    data = json.load(urllib.request.urlopen(req))
    if data.get("not_found"):
        print("NOT FOUND", data["not_found"])
    for c in data["data"]:
        iu = c.get("image_uris") or c["card_faces"][0]["image_uris"]
        get(iu["png"], os.path.join(OUT, "cards", slug(c["name"]) + ".png"))
        if c["name"] in ART:
            get(iu["art_crop"], os.path.join(OUT, "art", slug(c["name"]) + ".jpg"))
        print("card", slug(c["name"]))
    for name, st, num in TOKENS:
        c = json.load(urllib.request.urlopen(urllib.request.Request(f"https://api.scryfall.com/cards/{st}/{num}", headers=UA)))
        iu = c.get("image_uris") or c["card_faces"][0]["image_uris"]
        get(iu["png"], os.path.join(OUT, "cards", "token-" + name + ".png"))
        get(iu["art_crop"], os.path.join(OUT, "art", "token-" + name + ".jpg"))
        print("token", name, c["name"], c.get("artist"))
        time.sleep(0.1)


if __name__ == "__main__":
    main()
