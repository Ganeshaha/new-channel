# Episode 002 Short: upload copy and plan

**File:** `ep002-short-v2.mp4` (1080×1920, 43 s, −16 LUFS). v2 adds burned-in captions and drops the stickers that repeated them. The research and template behind it are in `research/shorts/REPORT.md`.

## Before uploading

1. **Publish the long video first.** The Short's link has to point at a public or unlisted video.
2. Upload the Short from **desktop Studio**, then set **Related video** to the long video (Content → the Short → Related video). This needs advanced features (phone verification). **This link is the whole point:** description and comment links aren't clickable in Shorts.
3. **Timing:** post it the same day as the long video, or within 48 h.

## Title (39 characters)

**This Precon Goes Infinite With ONE Card**

It's deliberately different from the long title, and within the 40-character limit. A spare to test on a later Short: "Venser Can Target HIMSELF?!"

## Description

```
Dack Fayden hands Venser to an opponent, and Venser ends up targeting himself. Loop it and you copy their whole board. The catch, and how to stop it, is in the full video. Tap the link under the title.

#mtg #commander #edh
```

## Pinned comment

```
The catch that stops you winning, and the cards that shut this down, are in the full breakdown. Link's under the title. Would you let this fly at your table?
```

## Cover frame

Custom Shorts thumbnails need YPP, so until then pick a frame. Use the frame at about **2 s**: "THIS PRECON WINS WITH ONE CARD" plus the deck box. A reference still is in `cover-frame-2s.png`.

## Checks done

- Layout audit in Shorts mode (`qa_layout.py Ep002Short --shorts`): **0 problems**. Nothing important sits outside x 60–880, y 250–1500, which is where the Shorts buttons, title and link carousel go.
- Viewer-facing text through `check_script.py`: 0 tells, 0 rate problems. A line-by-line read and a read-aloud also passed.
- The spliced narration was re-transcribed with whisper: every word is intact and nothing is clipped.
- Key frames were checked against a mock of the Shorts interface. Wil points down at the link; the "?" card turns into the long video's thumbnail.

## After publishing

- **7 and 28 days:** viewed vs swiped (70% or more is good; under 60% means fix the first second), engaged views, average % viewed, and the long video's views coming from Shorts.
- **Post 2–3 more Shorts from this episode over 1–2 weeks**, all linking to the long video. YouTube says Shorts viewers rarely cross over to long videos, so each extra Short is another chance. Vary the format; don't reuse this template with swapped words:
  1. **"RULES QUESTION: Can Venser target himself?"** A question on screen, then the 603.3 / 603.3d answer (the long video's "the gap" section). This is Attack on Cardboard's best-performing Shorts format.
  2. **"This Angel stops you winning."** The Darksteel Angel twist (the long video's "the catch") as its own story.
  3. **"How to stop the one-card infinite."** Kill the original Venser in response (608.2b), with the four answers in the precon.

## Captions (v2)

The owner decided on 27 Sep 2026: burned-in captions on every Short from now on. Long videos keep the uploaded SRT only.
- The captions are 1–3 words, synced to the voice (`ShortCaptions` in kit.tsx). They sit in a band right of Wil (x 300–880, y 1385–1497): one line at up to 72 px, or two balanced lines at 56 px.
- **Once the captions carry the words, stickers never restate the narration.** v1 had "TRIGGER WAITS…", "HE'S THEIRS", "HIMSELF?!", "2 NEW TRIGGERS", "KEEPS IT GOING", "NOT EVEN OUT YET", "WIZARDS MESSED UP", "BUT THERE'S A CATCH…" and the Venser callout; v2 drops them all. What's left adds what the voice doesn't say: OPPONENT / YOU, TOKEN, LOOPS: n, YOUR BOARD NOW, the card types with ×∞, and the call to the full video.
- **Music:** none, consistent with the channel.
