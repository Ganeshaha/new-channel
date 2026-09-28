# Permissions and asset rights

## Wizards of the Coast: Magic: The Gathering assets

- **Status:** granted. The channel owner holds **written permission from Wizards of the Coast** to use Magic: The Gathering card images and related assets in the channel's videos.
- **Recorded:** 24 Sep 2026, on the owner's statement. The letter itself is kept privately by the owner, not in this repo.
- **Scope:** card images and related assets, as set out in the letter. Check the letter's exact wording before any use that goes beyond ordinary channel videos and thumbnails, for example:
  - merchandise
  - paid or members-only content
  - Wizards logos or trademarks
  - work made for a third party

- **Product images confirmed (24 Sep 2026):** the owner confirmed the permission also covers official product images, such as precon deck boxes and key art. That includes the Magic logo as it appears on the packaging. Episode 002 uses the Multiverse Reforged deck-box shot and the Jace key art from Wizards' own decklist article (`video/public/ep002/product/`).

This permission supersedes the earlier "check Wizards' Fan Content Policy" caveat in the research notes, for this channel's own videos.

## What this does not cover

The Wizards permission covers Wizards' material only. It does not extend to anyone else's IP, such as film stills, celebrity or reaction memes, or other franchises' characters. The Attack on Cardboard teardown flagged these as a copyright-claim risk. The video pipeline in `video/` uses an original mascot and original drawings instead.

## AI voice and YouTube's disclosure setting

**Answer "No" to "Altered or synthetic content".** Reasoning, checked 26 Sep 2026 against YouTube's own help page (support.google.com/youtube/answer/14328491):
- Disclosure is required for *realistic* content: a real person saying or doing something they didn't, altered footage of real events, or realistic-looking scenes that didn't happen.
- It is **not** required for "clearly unrealistic content, such as animation", or for production help. Wil is an animated card back, and nothing in the videos passes as real footage.
- The voice is Gemini's stock "Fenrir" voice, not a clone of any real person. **Never clone a real person's voice** (including a creator you like); that would flip the answer to Yes.
- Gemini TTS audio carries Google's SynthID watermark. YouTube's automatic AI labels (May 2026) target photorealistic visuals, and YouTube says a label doesn't change recommendations or monetisation. If one ever appears, leave it.
- **If YouTube labels a video as AI anyway** (the owner saw this on 27 Sep 2026):
  - Our renders carry **no C2PA credentials**: checked 27 Sep 2026, and the MP4 has only ftyp/moov/free/mdat boxes. So the label comes from the upload's disclosure answer or from YouTube's own detection, most likely SynthID in the Gemini voice.
  - YouTube Help (answer 14328491): creators can change the disclosure to **No** "under most circumstances". It's locked only for YouTube's own AI tools, C2PA metadata, or manual review.
  - Fix in Studio: Content → the video → Details → Show more → altered/AI content → No → Save.
  - Don't use YouTube's AI features on the upload (auto-dubbing, AI thumbnails or titles, Dream Screen); those make the label permanent.
  - **Never strip or tamper with watermarks.** If the label keeps coming back, the legitimate fix is a narration voice that doesn't carry Google's SynthID. Check the new provider's own provenance marks first. That changes the voice, so it's the owner's call and needs an OK for any spend.
  - YouTube says the label doesn't affect reach or monetisation.

**Monetisation (the "inauthentic content" rule, July 2025).** An AI voice is allowed; mass-produced, templated videos are not, and the review is channel-wide. Each episode keeps: an original script with an opinion, at least one bespoke visual set piece, card text never the bulk of a segment, and visible human choices (sources in the description, a pinned citation comment, real replies). See `research/youtube-general/REPORT.md` §4.

## Other sources

| Asset | Source | Notes |
|---|---|---|
| Card images and data | [Scryfall API](https://scryfall.com/docs/api) | Follow Scryfall's API guidelines (rate limits, no paywalling their data). The WotC permission covers the images themselves. |
| Product shots and key art | Wizards' own announcement pages (magic.wizards.com, media.wizards.com) | Download the official image rather than a retailer's copy. No credit line in descriptions (owner's decision, 25 Sep 2026); link the source article when the video is about it. |
| Comprehensive Rules text | Wizards of the Coast | Quoted to cite rules (for example CR 509.2). |
| Fonts, music, sound effects | To be decided | Record each licence here when chosen. |
