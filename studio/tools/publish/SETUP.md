# Setting up direct uploads (Instagram and TikTok)

YouTube uploads are done by hand in YouTube Studio. The API would lock them private until Google audits the project, so each episode gets an upload pack instead. The details are in `research/publishing/REPORT.md`.

The logins below go in `studio/secrets/`, which git ignores, so they never get committed. **Nothing is posted without your OK:** the tools only upload when run with `--yes`, and Claude asks you first every time.

---

## Instagram (about 15 minutes, once)

1. **Make the Instagram account a Creator or Business account.** In the Instagram app, go to Settings → *Account type and tools* → *Switch to professional account*, and pick Creator.
2. **Link it to a Facebook Page.**
   - Create a Page for the channel at facebook.com/pages/create if you don't have one.
   - In the Page's settings, open *Linked accounts* → *Instagram* → *Connect*, and log in to the Instagram account.
3. **Create a Meta app.**
   - Go to developers.facebook.com and log in with the same Facebook account. *My Apps* → *Create app*.
   - Pick the use case **"Manage everything on your Page"**, or *Other* → *Business* if the wizard asks for a type. Name it something like "Wild Card Uploader".
   - In the app, add the **Instagram** product and choose **"API setup with Facebook login"**.
4. **Get a token.**
   - Open the **Graph API Explorer** (developers.facebook.com/tools/explorer) and pick your app at the top right.
   - Under *Permissions*, add: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `business_management`.
   - Click **Generate Access Token**, then approve access to your Page and the Instagram account.
5. **Save the keys.**
   - Create the file `studio/secrets/instagram-app.json` with:
     ```json
     { "app_id": "…", "app_secret": "…", "user_token": "…" }
     ```
   - App ID and App secret are under *App settings → Basic* in the app dashboard. `user_token` is the token from step 4.
   - Then tell Claude, who runs `instagram.py setup`. That swaps the token for a long-lived one and finds your Instagram account. The token from step 4 expires in about an hour, so do this soon after generating it.

The app stays in development mode, which is fine for posting to your own account. Meta's docs say your own account needs no app review.

## TikTok (about 15 minutes, once; then a test)

TikTok's official API won't post publicly from a personal tool, so this sends each video to your **TikTok drafts**. You add the caption and sound in the app and tap Post. Whether TikTok allows this for a personal sandbox app is **not confirmed**; the first test will tell us. If it doesn't work, the fallbacks are TikTok Studio's scheduler or Buffer.

1. **Create a developer account and an app.** Go to developers.tiktok.com, log in, then *Manage apps* → *Connect an app*.
2. **Add the products and the scope.**
   - In the app, add **Login Kit** and the **Content Posting API**.
   - Under scopes, make sure **`video.upload`** is on (and `user.info.basic`).
3. **Register the login redirect.** Under Login Kit, choose platform *Desktop* and add the redirect URI:
   `http://localhost:8765/callback`
4. **Add yourself as a sandbox user.**
   - Switch the app to **Sandbox**.
   - Under *Sandbox settings* → *Target users*, add your TikTok account.
5. **Save the keys.**
   - Create the file `studio/secrets/tiktok-app.json` with:
     ```json
     { "client_key": "…", "client_secret": "…", "redirect_uri": "http://localhost:8765/callback" }
     ```
     `client_key` and `client_secret` are on the app's page.
   - Then tell Claude, who runs `tiktok.py auth`. A browser opens on the PC; log in to TikTok and approve.

## YouTube (by hand, every upload)

Each finished episode gets an upload pack in `episodes/<episode>/`:
- the final video, the thumbnail (4K) and `SUBS.srt`;
- `UPLOAD.md` with the title, description (chapters and links), tags and a pinned comment;
- the settings: AI disclosure "No" (see PERMISSIONS.md), and set the Short's Related video.

Upload the video in YouTube Studio, then paste in the details.
