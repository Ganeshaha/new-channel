# Uploading straight to YouTube, Instagram and TikTok

Researched 28 Sep 2026 from the official developer docs. Links are at the bottom. Items marked "unverified" couldn't be confirmed.

## At a glance

| | YouTube | Instagram Reels | TikTok |
|---|---|---|---|
| Can a personal script post publicly? | Yes, **after an API audit**. Before it, uploads are locked private. | **Yes, now.** Standard Access covers your own account; no app review. | **Not realistically.** Personal apps are refused review, and unaudited posts are private-only on a private account. |
| What you set up | Google Cloud project, Desktop OAuth client, phone-verified channel; for the audit, a small website plus privacy policy | Meta developer app, an Instagram Creator/Business account; a Facebook Page if we upload local files | Developer app (sandbox), to try the "send to drafts" route |
| Uploads a day | 100 | 100 posts in any 24 h | Drafts: 5 pending per 24 h |
| AI label by API | `containsSyntheticMedia` (for *realistic* synthetic content) | `is_ai_generated` (Jun 2026) | `is_aigc` |
| Thumbnail / cover | Yes (`thumbnails.set`, up to 50 MB) | Cover image or frame | Cover frame only |
| Captions file | Yes (SRT) | No | No |
| Scheduling | Yes (`publishAt`) | No (we run our own timer) | No |
| Can't be done by API | The Shorts "Related video" link (Studio only) | Licensed music (Facebook Login only) | Trending sounds (pick them in the app when posting from drafts) |

## YouTube

**API:** Data API v3 `videos.insert`, a resumable upload from a local file. A vertical video of 3 minutes or less becomes a Short automatically.

**Setup you do:**
1. Create a Google Cloud project and enable YouTube Data API v3.
2. Set up the OAuth consent screen (External), then set it to **"In production"**. In "Testing", logins expire every 7 days. You don't need Google's verification for personal use: you just click past the "unverified app" warning.
3. Create an OAuth client of type **Desktop app** and download `client_secret.json`.
4. Phone-verify the channel. Custom thumbnails need it.

**The gate:** uploads from an unaudited API project are **locked private**, and you can't make them public afterwards. You'd have to re-upload.
- The free audit form asks for a website, a privacy policy and terms, screenshots of the tool, and a use-case write-up.
- Google gives no timeline; third-party reports say about 2–4 weeks.

**Limits** (per-endpoint quotas since 1 Jun 2026): 100 uploads a day. Thumbnails, captions and edits come out of 10,000 units a day.

**Settable:** title, description, tags, category, privacy, scheduled time, made-for-kids, the AI disclosure, thumbnail, SRT captions, playlist.

## Instagram (Reels)

**Two ways to log in:**
- **Instagram Login:** no Facebook Page needed, but the video must be at a *public URL* for Meta to fetch.
- **Facebook Login for Business:** the Instagram account must be linked to a Facebook Page. This one supports true upload from a local file.

**Setup you do:**
1. Make your Instagram account a Creator or Business account.
2. Create a Meta developer app and add the Instagram product.
3. Add your account as a tester.
4. Generate a token in the dashboard.

**The gate:** none for your own account. Standard Access is enough.

**Tokens:** they last 60 days. The script refreshes them weekly.

**Limits:** 100 posts in 24 h. Reels can be 3 s to 15 min and up to 300 MB.

**Settable:** caption, share-to-feed, cover image or frame, collaborators, the AI label (`is_ai_generated`), Trial Reels.

## TikTok

**The Content Posting API has two modes:**
- **Direct Post** needs an audit. Its app-review rules say apps "must not be for private or personal use".
- **Unaudited:** posts are `SELF_ONLY`, and the account itself must be private.

**Drafts route** (`video.upload`): the script sends the video to your TikTok inbox, and you tap post in the app, which also lets you add a trending sound. It's unverified whether this works in sandbox for your own account; it's worth a free test.

**Fallbacks:**
- TikTok Studio's own desktop scheduler (free, Creator or Business account).
- A service with an audited app:
  - Buffer: free for 3 channels, 10 scheduled posts each; paid is $5–10 per channel per month.
  - Upload-Post: $24/month.

## AI disclosure

Each platform now has a flag:
- **YouTube's** is only for *realistic* synthetic content. PERMISSIONS.md already records the decision that our cartoon-mascot videos answer "No".
- **TikTok and Instagram** have their own labels.

Decide them per platform with the owner. Never strip or hide AI watermarks.

## Sources

- **YouTube:** [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert) · [videos resource](https://developers.google.com/youtube/v3/docs/videos) · [revision history](https://developers.google.com/youtube/v3/revision_history) · [quota costs](https://developers.google.com/youtube/v3/determine_quota_cost) · [thumbnails.set](https://developers.google.com/youtube/v3/docs/thumbnails/set) · [captions.insert](https://developers.google.com/youtube/v3/docs/captions/insert) · [audits](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits) · [audit form](https://support.google.com/youtube/contact/yt_api_form) · [locked-private videos](https://support.google.com/youtube/answer/7300965)
- **Google OAuth:** [7-day testing tokens](https://developers.google.com/identity/protocols/oauth2) · [verification exceptions](https://support.google.com/cloud/answer/13464323) · [unverified apps](https://support.google.com/cloud/answer/7454865)
- **TikTok:** [Direct Post](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post) · [Upload to inbox](https://developers.tiktok.com/doc/content-posting-api-reference-upload-video) · [media transfer](https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide) · [content sharing guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines) · [app review guidelines](https://developers.tiktok.com/doc/app-review-guidelines) · [sandbox](https://developers.tiktok.com/doc/add-a-sandbox) · [desktop login](https://developers.tiktok.com/doc/login-kit-desktop) · [tokens](https://developers.tiktok.com/doc/oauth-user-access-token-management)
- **Instagram:** [content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) · [media reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media) · [resumable uploads](https://developers.facebook.com/docs/instagram-platform/content-publishing/resumable-uploads/) · [Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login) · [access levels](https://developers.facebook.com/docs/instagram-platform/overview) · [token refresh](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token)
- **Services:** [Buffer pricing](https://buffer.com/pricing) · [Buffer API](https://developers.buffer.com/) · [Upload-Post pricing](https://www.upload-post.com/pricing-comparison/)
