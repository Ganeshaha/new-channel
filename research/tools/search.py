"""Full-text search across every transcript in research/*/text/.

    python research/tools/search.py "table talk"                    top matching passages
    python research/tools/search.py "rule 0" -c defcat-mtg -n 20    one channel, 20 results
    python research/tools/search.py "kingmaking" --group            which videos discuss it most
    python research/tools/search.py "power level" --min-views 50000 --by-views
    python research/tools/search.py --stats                         what's indexed

Query syntax is SQLite FTS5: "exact phrase", a OR b, a NEAR(b c, 8), prefix*. Words are stemmed
(deck / decks / decking match). The index lives in research/.kb/ and rebuilds itself when any
text file is newer than it. Every hit carries a youtu.be link that opens at that moment.
"""
import argparse
import os
import re
import sqlite3
import sys
from pathlib import Path

RESEARCH = Path(os.environ.get("RESEARCH_DIR") or Path(__file__).resolve().parent.parent)
DB = RESEARCH / ".kb" / "kb.sqlite"
HEAD = re.compile(r"^date: (\S+) \| views: ([\d,]+)")
PARA = re.compile(r"^\[(?:(\d+):)?(\d+):(\d+)\] (.*)$")


def text_files():
    return sorted(RESEARCH.glob("*/text/*.txt"))


def build():
    DB.parent.mkdir(exist_ok=True)
    DB.unlink(missing_ok=True)
    con = sqlite3.connect(DB)
    con.execute("CREATE VIRTUAL TABLE para USING fts5(text, slug UNINDEXED, vid UNINDEXED, title UNINDEXED, "
                "date UNINDEXED, views UNINDEXED, t UNINDEXED, tokenize='porter unicode61')")
    n = 0
    for p in text_files():
        slug, vid = p.parent.parent.name, p.stem
        title, date, views = vid, "", 0
        for line in p.read_text(encoding="utf-8").splitlines():
            if line.startswith("# ") and title == vid:
                title = line[2:]
            m = HEAD.match(line)
            if m:
                date, views = m.group(1), int(m.group(2).replace(",", ""))
            m = PARA.match(line)
            if m:
                h, mi, s, body = m.groups()
                t = int(h or 0) * 3600 + int(mi) * 60 + int(s)
                con.execute("INSERT INTO para VALUES (?,?,?,?,?,?,?)", (body, slug, vid, title, date, views, t))
                n += 1
    con.commit()
    con.close()
    return n


def ensure_index(force=False):
    files = text_files()
    if force or not DB.exists() or (files and max(f.stat().st_mtime for f in files) > DB.stat().st_mtime):
        print(f"(indexing {len(files)} transcripts...)", file=sys.stderr)
        build()


def clock(t):
    return f"{t // 3600}:{t % 3600 // 60:02d}:{t % 60:02d}" if t >= 3600 else f"{t // 60}:{t % 60:02d}"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("query", nargs="?")
    ap.add_argument("-c", "--channel", help="channel slug, e.g. defcat-mtg")
    ap.add_argument("-n", type=int, default=10, help="number of results")
    ap.add_argument("--min-views", type=int, default=0)
    ap.add_argument("--by-views", action="store_true", help="rank by the video's views instead of relevance")
    ap.add_argument("--group", action="store_true", help="one row per video with the number of matching passages")
    ap.add_argument("--stats", action="store_true")
    ap.add_argument("--rebuild", action="store_true")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")

    ensure_index(a.rebuild)
    con = sqlite3.connect(DB)
    if a.stats:
        for slug, v, w in con.execute("SELECT slug, count(DISTINCT vid), sum(length(text) - length(replace(text,' ',''))+1) "
                                      "FROM para GROUP BY slug ORDER BY 3 DESC"):
            print(f"{slug:26s} {v:5d} videos {w:>10,} words")
        return
    if not a.query:
        ap.error("give a query, or --stats")

    where, args = "para MATCH ?", [a.query]
    if a.channel:
        where += " AND slug = ?"
        args.append(a.channel)
    if a.min_views:
        where += " AND views >= ?"
        args.append(a.min_views)

    if a.group:
        rows = con.execute(f"SELECT slug, vid, title, date, views, count(*) c FROM para WHERE {where} "
                           f"GROUP BY vid ORDER BY {'views' if a.by_views else 'c'} DESC LIMIT ?", args + [a.n])
        for slug, vid, title, date, views, c in rows:
            print(f"{c:3d} passages | {views:>9,} views | {slug} | {title} ({date}) https://youtu.be/{vid}")
        return

    order = "views DESC" if a.by_views else "rank"
    rows = con.execute(f"SELECT slug, vid, title, date, views, t, snippet(para, 0, '»', '«', ' … ', 40) "
                       f"FROM para WHERE {where} ORDER BY {order} LIMIT ?", args + [a.n])
    for slug, vid, title, date, views, t, snip in rows:
        print(f"{slug} | {title} ({date}, {views:,} views)\n  [{clock(t)}] https://youtu.be/{vid}?t={t}\n  {snip}\n")


if __name__ == "__main__":
    main()
