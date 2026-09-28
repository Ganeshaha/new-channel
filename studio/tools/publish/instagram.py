"""Post a Reel to our Instagram account from a local file (Instagram API with Facebook Login for Business).

    python studio/tools/publish/instagram.py setup                 # once: long-lived token + find the Instagram account
    python studio/tools/publish/instagram.py status                # token expiry, account, posts left today
    python studio/tools/publish/instagram.py refresh               # renew the 60-day user token (run weekly)
    python studio/tools/publish/instagram.py post VIDEO.mp4 --caption-file caption.txt [--cover-ms 2000]
                                                   [--no-feed] [--ai-label] [--yes]

Without --yes, `post` only prints what it would upload. Needs studio/secrets/instagram-app.json
({"app_id", "app_secret", "user_token"}) made per SETUP.md; setup writes studio/secrets/instagram.json.

Flow (developers.facebook.com/docs/instagram-platform/content-publishing/ and .../resumable-uploads/):
create a REELS container with upload_type=resumable -> send the file to rupload.facebook.com ->
poll the container until FINISHED -> media_publish.
"""
import argparse
import os
import sys
import time

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import gate, load, mask, save  # noqa: E402

VER = os.environ.get("GRAPH_VERSION", "v24.0")
GRAPH = f"https://graph.facebook.com/{VER}"
RUPLOAD = f"https://rupload.facebook.com/ig-api-upload/{VER}"


def check(r):
    try:
        j = r.json()
    except ValueError:
        r.raise_for_status()
        return {}
    if r.status_code >= 400 or "error" in j:
        sys.exit(f"Graph API error {r.status_code}: {j.get('error', j)}")
    return j


def cmd_setup(_):
    app = load("instagram-app.json")
    # 1. short-lived user token (from Graph API Explorer) -> long-lived user token (~60 days)
    j = check(requests.get(f"{GRAPH}/oauth/access_token", params={
        "grant_type": "fb_exchange_token", "client_id": app["app_id"], "client_secret": app["app_secret"],
        "fb_exchange_token": app["user_token"]}))
    user_token = j["access_token"]
    # 2. the Facebook Page linked to the Instagram professional account, and that account's id
    j = check(requests.get(f"{GRAPH}/me/accounts", params={
        "fields": "name,access_token,instagram_business_account{id,username}", "access_token": user_token}))
    pages = [p for p in j.get("data", []) if p.get("instagram_business_account")]
    if not pages:
        sys.exit("No Facebook Page with a linked Instagram professional account was found for this login (SETUP.md step 2).")
    page = pages[0]
    ig = page["instagram_business_account"]
    out = {"ig_id": ig["id"], "username": ig.get("username"), "page_id": page["id"], "page_name": page["name"],
           "user_token": user_token, "page_token": page["access_token"], "saved": int(time.time())}
    print(f"linked: Page '{page['name']}' -> @{ig.get('username')} (id {ig['id']}); user token {mask(user_token)}")
    print("saved", save("instagram.json", out))


def token(cfg):
    # The Page token made from a long-lived user token doesn't expire; fall back to the user token.
    return cfg.get("page_token") or cfg["user_token"]


def cmd_status(_):
    cfg, app = load("instagram.json"), load("instagram-app.json")
    for kind in ("user_token", "page_token"):
        if not cfg.get(kind):
            continue
        j = check(requests.get(f"{GRAPH}/debug_token", params={
            "input_token": cfg[kind], "access_token": f"{app['app_id']}|{app['app_secret']}"})).get("data", {})
        exp = j.get("expires_at", 0)
        left = "never" if not exp else f"{(exp - time.time()) / 86400:.0f} days"
        print(f"{kind}: valid={j.get('is_valid')} expires in {left} scopes={','.join(j.get('scopes', []))}")
    j = check(requests.get(f"{GRAPH}/{cfg['ig_id']}/content_publishing_limit", params={
        "fields": "quota_usage,config", "access_token": token(cfg)}))
    d = (j.get("data") or [{}])[0]
    print(f"@{cfg.get('username')}: {d.get('quota_usage', '?')} of {d.get('config', {}).get('quota_total', '?')} posts used in the last 24 h")


def cmd_refresh(_):
    cfg, app = load("instagram.json"), load("instagram-app.json")
    app["user_token"] = cfg["user_token"]
    save("instagram-app.json", app)
    cmd_setup(None)


def cmd_post(a):
    cfg = load("instagram.json")
    caption = open(a.caption_file, encoding="utf-8").read().strip() if a.caption_file else ""
    size = os.path.getsize(a.video)
    if size > 300 * 1024 * 1024:
        sys.exit("Reels must be 300 MB or less")
    gate(f"Instagram Reel to @{cfg.get('username')}:\n  file: {a.video} ({size / 1e6:.1f} MB)\n"
         f"  share to feed: {not a.no_feed}   cover frame: {a.cover_ms} ms   AI label: {a.ai_label}\n"
         f"  caption ({len(caption)} chars):\n    " + caption.replace("\n", "\n    "), a.yes)
    tok = token(cfg)
    params = {"media_type": "REELS", "upload_type": "resumable", "caption": caption,
              "share_to_feed": "false" if a.no_feed else "true", "access_token": tok}
    if a.cover_ms is not None:
        params["thumb_offset"] = str(a.cover_ms)
    if a.ai_label:
        params["is_ai_generated"] = "true"
    c = check(requests.post(f"{GRAPH}/{cfg['ig_id']}/media", data=params))
    cid = c["id"]
    print("container", cid, "- uploading…")
    with open(a.video, "rb") as f:
        r = requests.post(f"{RUPLOAD}/{cid}", data=f, headers={
            "Authorization": f"OAuth {tok}", "offset": "0", "file_size": str(size)}, timeout=3600)
    check(r)
    for _ in range(120):  # up to ~20 minutes of processing
        s = check(requests.get(f"{GRAPH}/{cid}", params={"fields": "status_code,status", "access_token": tok}))
        if s.get("status_code") == "FINISHED":
            break
        if s.get("status_code") in ("ERROR", "EXPIRED"):
            sys.exit(f"Instagram couldn't process the video: {s}")
        time.sleep(10)
    else:
        sys.exit(f"still processing after 20 minutes; container {cid}")
    m = check(requests.post(f"{GRAPH}/{cfg['ig_id']}/media_publish", data={"creation_id": cid, "access_token": tok}))
    link = check(requests.get(f"{GRAPH}/{m['id']}", params={"fields": "permalink", "access_token": tok})).get("permalink")
    print("posted:", link or m["id"])


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("setup").set_defaults(fn=cmd_setup)
    sub.add_parser("status").set_defaults(fn=cmd_status)
    sub.add_parser("refresh").set_defaults(fn=cmd_refresh)
    p = sub.add_parser("post")
    p.add_argument("video")
    p.add_argument("--caption-file")
    p.add_argument("--cover-ms", type=int)
    p.add_argument("--no-feed", action="store_true")
    p.add_argument("--ai-label", action="store_true", help="Instagram's 'AI info' label (is_ai_generated)")
    p.add_argument("--yes", action="store_true", help="actually post (otherwise a dry run)")
    p.set_defaults(fn=cmd_post)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
