"""Send a video to our TikTok drafts (Content Posting API, "upload to inbox", scope video.upload).
You finish it in the TikTok app: caption, sound, then Post.

    python studio/tools/publish/tiktok.py auth                 # once: log in in the browser (PKCE), saves tokens
    python studio/tools/publish/tiktok.py status               # who's logged in, token age
    python studio/tools/publish/tiktok.py draft VIDEO.mp4 [--yes]

Without --yes, `draft` only prints what it would send. Needs studio/secrets/tiktok-app.json
({"client_key", "client_secret", "redirect_uri"}) made per SETUP.md; auth writes studio/secrets/tiktok.json.

Docs: developers.tiktok.com/doc/content-posting-api-reference-upload-video, .../media-transfer-guide,
.../login-kit-desktop (PKCE: TikTok wants the code challenge as a HEX SHA-256, not base64url),
.../oauth-user-access-token-management (access 24 h, refresh 365 days and it can rotate: always save the new one).
"""
import argparse
import hashlib
import http.server
import math
import os
import secrets
import sys
import time
import urllib.parse
import webbrowser

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import gate, load, mask, save  # noqa: E402

API = "https://open.tiktokapis.com"
SCOPES = "user.info.basic,video.upload"
MIN_CHUNK = 5 * 1024 * 1024
CHUNK = 10 * 1024 * 1024


def check(r):
    try:
        j = r.json()
    except ValueError:
        r.raise_for_status()
        return {}
    err = j.get("error") or {}
    code = err.get("code") if isinstance(err, dict) else err
    if r.status_code >= 400 or (code and code != "ok"):
        sys.exit(f"TikTok API error {r.status_code}: {j}")
    return j


def cmd_auth(_):
    app = load("tiktok-app.json")
    verifier = secrets.token_urlsafe(64)[:96]
    challenge = hashlib.sha256(verifier.encode()).hexdigest()  # hex, per TikTok's desktop docs
    state = secrets.token_urlsafe(16)
    redirect = app["redirect_uri"]  # e.g. http://localhost:8765/callback (registered in the app)
    url = "https://www.tiktok.com/v2/auth/authorize/?" + urllib.parse.urlencode({
        "client_key": app["client_key"], "scope": SCOPES, "response_type": "code", "redirect_uri": redirect,
        "state": state, "code_challenge": challenge, "code_challenge_method": "S256"})
    got = {}

    class H(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            got.update({k: v[0] for k, v in q.items()})
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write("Logged in. You can close this tab.".encode())

        def log_message(self, *args):
            pass

    port = urllib.parse.urlparse(redirect).port or 80
    srv = http.server.HTTPServer(("127.0.0.1", port), H)
    print("Opening TikTok login in the browser…\nIf it doesn't open, visit:\n" + url)
    webbrowser.open(url)
    while "code" not in got and "error" not in got:
        srv.handle_request()
    if got.get("state") != state or "code" not in got:
        sys.exit(f"login failed: {got}")
    j = check(requests.post(f"{API}/v2/oauth/token/", data={
        "client_key": app["client_key"], "client_secret": app["client_secret"], "code": got["code"],
        "grant_type": "authorization_code", "redirect_uri": redirect, "code_verifier": verifier}))
    j["saved"] = int(time.time())
    save("tiktok.json", j)
    print(f"logged in: open_id {j.get('open_id')}, scopes {j.get('scope')}, access {mask(j.get('access_token'))}")


def access_token():
    tok, app = load("tiktok.json"), load("tiktok-app.json")
    if time.time() - tok.get("saved", 0) < tok.get("expires_in", 0) - 300:
        return tok["access_token"]
    j = check(requests.post(f"{API}/v2/oauth/token/", data={
        "client_key": app["client_key"], "client_secret": app["client_secret"],
        "grant_type": "refresh_token", "refresh_token": tok["refresh_token"]}))
    j["saved"] = int(time.time())
    save("tiktok.json", j)  # the refresh token may have rotated: keep the new one
    return j["access_token"]


def cmd_status(_):
    tok = access_token()
    j = check(requests.get(f"{API}/v2/user/info/", params={"fields": "open_id,display_name"},
                           headers={"Authorization": f"Bearer {tok}"}))
    print("logged in as:", j.get("data", {}).get("user", {}).get("display_name"))


def cmd_draft(a):
    size = os.path.getsize(a.video)
    if size <= MIN_CHUNK:
        chunk, n = size, 1
    else:
        chunk = CHUNK
        n = size // chunk  # the last chunk takes the remainder (allowed up to 128 MB)
    gate(f"TikTok draft (goes to your TikTok inbox; you add the caption and post in the app):\n"
         f"  file: {a.video} ({size / 1e6:.1f} MB, {n} chunk(s))", a.yes)
    tok = access_token()
    h = {"Authorization": f"Bearer {tok}", "Content-Type": "application/json; charset=UTF-8"}
    j = check(requests.post(f"{API}/v2/post/publish/inbox/video/init/", headers=h, json={
        "source_info": {"source": "FILE_UPLOAD", "video_size": size, "chunk_size": chunk, "total_chunk_count": n}}))
    pid, upload_url = j["data"]["publish_id"], j["data"]["upload_url"]
    with open(a.video, "rb") as f:
        for i in range(n):
            start = i * chunk
            end = size - 1 if i == n - 1 else start + chunk - 1
            f.seek(start)
            body = f.read(end - start + 1)
            r = requests.put(upload_url, data=body, timeout=3600, headers={
                "Content-Type": "video/mp4", "Content-Length": str(len(body)),
                "Content-Range": f"bytes {start}-{end}/{size}"})
            if r.status_code not in (200, 201, 206):
                sys.exit(f"chunk {i + 1}/{n} failed: {r.status_code} {r.text[:300]}")
            print(f"  chunk {i + 1}/{n} sent")
    for _ in range(60):
        s = check(requests.post(f"{API}/v2/post/publish/status/fetch/", headers=h, json={"publish_id": pid}))
        st = s.get("data", {}).get("status")
        print("  status:", st)
        if st in ("SEND_TO_USER_INBOX", "PUBLISH_COMPLETE"):
            print("done: open TikTok, check your inbox/notifications for the draft, then add the caption and post.")
            return
        if st == "FAILED":
            sys.exit(f"TikTok rejected it: {s}")
        time.sleep(5)
    print("still processing; check the TikTok app in a few minutes. publish_id", pid)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("auth").set_defaults(fn=cmd_auth)
    sub.add_parser("status").set_defaults(fn=cmd_status)
    p = sub.add_parser("draft")
    p.add_argument("video")
    p.add_argument("--yes", action="store_true", help="actually send (otherwise a dry run)")
    p.set_defaults(fn=cmd_draft)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
