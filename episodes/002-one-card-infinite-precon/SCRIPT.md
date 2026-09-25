# Episode 002: The New Jace Precon Has a One-Card Infinite Combo

| | |
|---|---|
| **Format** | A rules breakdown of a news story. This is Attack on Cardboard's most reliable lane (rules-change and rules-explainer videos have medians of 66k–93k) applied to a brand-new card. |
| **Timing** | **Publish before the set releases on 2 Oct 2026.** The Reddit thread is from about 21 Sep and MTGRocks has already covered it, so the window is closing. |
| **Target length** | About 5:46 (~1127 spoken words). Section times below are approximate. |
| **Host** | Wil D. Card introduces himself after the hook, in Next Level Commander's pattern: hook, then "Hello everyone, this is Wil D. Card with Wild Card Commander", then "Today we're looking at…". |
| **Named idea** | "The gap": the moment between a trigger happening and it going on the stack. |
| **Open loop** | "The one card in the same deck that can stop you from winning with it." This is set up in the intro and paid off with Darksteel Angel. |
| **Subscribe segment** | Right after the combo reveal (the first payoff, about 36% in). It ends on a question that leads into the rules section. |
| **Comment prompt** | "Would you keep Dack in the deck?", at least a minute after the subscribe segment. |
| **OpenRouter spend** | None needed. Card images are Scryfall scans (covered by the WotC permission), and the rest is the mascot library and code-drawn visuals. |

> **Before recording:**
> - Read it out loud and change any word you wouldn't actually say. See [VOICE.md](../../VOICE.md).
> - `[OPTIONAL]` lines are for your real experience only. Cut them if they don't apply.
> - Work through the fact-check list at the bottom. Everything in the script is traced in [RESEARCH.md](RESEARCH.md).

---

## Script

The card images are in `assets/cards/`. Animation names refer to `brand/animations/`.

### 0:00 · Cold open (hook)

**VO:**
> The new Jace precon isn't even out yet, and people have already found a way to win the game with it. With one card, straight out of the box. Yeah. Wizards messed up.

**VISUAL:**
- Frame 1: the real Multiverse Reforged deck box (official product shot) with a "NOT EVEN OUT YET" stamp, then a cut-out-letter "ONE-CARD WIN".
- On "one card": Dack's card slams in, with "1 CARD" stamped next to it.
- On "out of the box": a big "∞" sticker slapped on the box, then "NO UPGRADES".
- On "messed up": the cut-out title swaps to "WIZARDS MESSED UP".

### 0:12 · Intro and promise

**VO:**
> Hello everyone, this is Wil D. Card with Wild Card Commander. Today we're looking at the Dack and Venser combo. A Redditor called Huaojozu posted it on r/magicTCG, and the thread's been going nuts ever since. We'll go through how it works and why it's even legal. And there's one card in this same deck that stops you from winning with it. We'll get to that. Let's take a look.

**VISUAL:**
- **Wil D. Card is introduced:** he bounces in centre-stage (`enter`), waves, and gets a cut-out-letter name card "WIL D. CARD" plus a "WILD CARD COMMANDER" sticker. Then he slides down to his usual corner.
- Dack and Venser slam in side by side, with a "r/magicTCG IS LOSING IT" sticker.
- A checklist of four items appears as they're named. The fourth, "the card that stops it", is shown face-down with a "?" (the open loop).

### 0:37 · The two cards

**VO:**
> All right, real quick. The deck is Multiverse Reforged. It's the four-color Jace precon from Reality Fracture, and it's out October 2nd. Two of the new cards in it are the problem.
>
> First up, Dack Fayden, Helping Hand. Dack's a six-mana creature now. Already a bit weird. When he enters, you reveal cards off the top until you hit one creature for each opponent. In a normal four-player game, that's three creatures. They come in under your control, you shuffle, and they're goaded for the rest of the game. Then you hand one to each opponent. Merry Christmas.
>
> Next up, Venser, Fervent Forger. When Venser enters, one of his modes makes two token copies of target permanent an opponent controls. They've got haste, and you sacrifice them at the next end step.

**VISUAL:**
- Zoom on Dack's card and underline "Put those creature cards onto the battlefield", then circle "Each opponent gains control".
- Three mini cards fly out, one to each of three paper opponents.
- Zoom on Venser and underline the second mode.
- Mascot `draw` when the cards are revealed.

### 1:27 · The combo

**VO:**
> Now let's say we flip Venser as one of those three.
>
> Dack's ability is resolving. Venser comes in under your control, so when his trigger happens, it's your trigger. Then, still in the middle of Dack's ability, Venser gets handed to an opponent.
>
> Dack finishes. Now we put Venser's trigger on the stack. And Venser's on an opponent's side now, right? They control him. So you can point his ability at… Venser. Yeah. Himself.
>
> We get two token Vensers. Legend rule, you keep one, and the other goes to the graveyard. But they both entered. That means we've got two new Venser triggers. One targets the original Venser again, and that keeps the loop going. The other can target anything an opponent controls. Remember the other two creatures Dack flipped? They're on your opponents' boards now. Our second trigger can copy one of those.
>
> And it just keeps going. Every loop, you get two hasty copies of whatever you pointed at. Their creatures, their artifacts, even their lands. Copy the lands, and that's basically unlimited mana. Loop it as many times as you want, and you end up with endless copies of their whole board. They all get sacrificed at the beginning of the next end step, though. So do it before combat, then swing.
>
> And yeah, before anyone types it. It's two cards. But you only cast one. Dack goes and finds the other one for you.

**VISUAL:**
- A step-by-step "stack" strip across the screen, with numbered paper cards stacking:
  1. Dack resolves.
  2. Venser enters (your trigger).
  3. Venser goes to an opponent.
  4. The trigger goes on the stack and targets Venser.
- On "legend rule": two token Vensers appear and one poofs to the graveyard (use `Poof`).
- Mascot `infinite-combo` from "that just keeps going".
- The end state: token copies of the opponents' creatures, artifacts and lands pile up on your side, with an "∞ MANA" tag on the lands, then a "SACRIFICED AT END STEP" timer and "DO IT BEFORE COMBAT".

### ≈2:37 · Subscribe segment (≤5s, overlaid, narration continues)

**VO:**
> Quick thing. I break down weird new interactions like this before they hit your table. Subscribe, or Dack goads your commander. Okay. Quick quiz. When does Venser's trigger actually pick its target? Pause if you want. Three, two, one.

**VISUAL:**
- `studio/assets/subscribe-beat.webm`, bottom-right, over a Dack + Venser = ∞ recap. Then "…OR GET GOADED".
- On "quick quiz": a QUICK QUIZ banner, the question in cut-out letters, "PAUSE IF YOU WANT", and a 3-2-1 countdown that holds until the answer lands.

### 2:53 · The gap (rules payoff)

**VO:**
> It's when it goes on the stack. That's the thing everyone in the Reddit thread kept asking about.
>
> Venser's ability triggers the moment he enters. But it doesn't go on the stack yet. It waits until the next time a player would get priority, which is after Dack's whole ability is done. That's rule 603.3. And you choose targets as it goes on the stack, not when it triggers. That's 603.3d.
>
> The trigger's yours, because you controlled Venser when it triggered. That's 603.3a. But you pick the target after he's already switched sides. I mean, it's a tiny gap. But yeah, that's the whole reason it works.

**VISUAL:**
- A timeline bar with three markers: "Venser triggers (you control him)", "Dack finishes (he's theirs now)" and "trigger goes on stack → choose target". A spotlight lands on the space between the last two, labelled "THE GAP".
- Rule numbers appear as paper tags as they're said (603.3, 603.3d, 603.3a).
- Mascot `peek` on "when targets get chosen", then `big-brain` on "the entire combo".

### 3:33 · The odds

**VO:**
> Okay, so how often does this happen? We've got 18 creatures in this deck. Dack's one of them, and he's already on the battlefield. That leaves 17. Dack grabs the first three he finds. Assuming you haven't drawn any other creatures yet, the chance Venser's one of them is three in seventeen. So, about 18 percent.
>
> But you can help it along. Say Venser's already in your hand. Brainstorm or Brainsurge, both in the deck, let you put him back on top. Then Dack finds him every time.
>
> We can get there with Jace too. His minus three exiles one of your other creatures, then puts the next creature or planeswalker off the top into play. That could be Dack. Lots of ifs. But it's all in the box.

**VISUAL:**
- A big "3 / 17" with "≈ 18%" underneath. Seventeen mini card backs in a row, three flipping up.
- Mascot `coin-flip` on "about 18 percent".
- The Brainstorm card zooms in; Venser slides from the hand to the top of the library.
- Jace's card, with his −3 underlined.

### 4:20 · The catch (pays off the open loop)

**VO:**
> Now, there's a catch. It's my favorite part of this whole thing.
>
> Every creature Dack finds goes to a different opponent. And this deck also has Darksteel Angel. Darksteel Angel says you can't lose the game, and your opponents can't win the game. So if Dack flips Venser and the Angel, the Angel goes to an opponent. And now you're one of the people who can't win. You've got a board full of infinite copies, and you're not allowed to win. Love that for you. And it's indestructible, so killing it won't work. Luckily, this deck has other ways to get rid of it. Hold that thought.
>
> The dream version is the other way around. If Dack also finds Archon of Cruelty, we don't even need to attack. Every copy of Archon makes an opponent lose three life. The problem is, every copy also makes *you* draw a card. Three opponents on 40 life is around 40 copies. Count your library before you start.

**VISUAL:**
- The face-down "?" card from the claim flips over: Darksteel Angel.
- Mascot `facepalm`.
- Darksteel Angel's card with "your opponents can't win the game" circled. An arrow points from "your opponents" to the mascot.
- Archon of Cruelty's card, with a life counter ticking down (`life-loss`) next to a library pile shrinking with each draw.
- Mascot `nervous-sweat` on "lose to your own combo".
- **Timing note (on-screen text, no VO needed):** "Cast Dack before combat. The copies are sacrificed at end of turn."

### 5:19 · How to stop it

**VO:**
> So what if someone pulls this on you? Every loop needs the original Venser. The one sitting on an opponent's board. If he leaves while a trigger's pointing at him, that trigger does nothing. That's rule 608.2b. Swords to Plowshares does it. Path to Exile, Despark, even a bounce spell like Fatehold Charm. All in this same precon. They handle that Angel too. Hold one up, and that's your moment.

**VISUAL:**
- "HOW TO STOP IT" heading. The original Venser on the opponent's side with a reticle, and a trigger arrow pointing at him.
- On "does nothing": a "FIZZLES" stamp and a "CR 608.2b" tag.
- The four answers fan in as real card scans, all from the precon: Swords to Plowshares, Path to Exile, Despark and Fatehold Charm.
- Mascot `point`, then `deal-with-it`.

### 5:46 · The Venser problem

**VO:**
> One more thing people in the thread pointed out. This can happen to *you*, too. If you've got Venser out and an opponent copies him, their copy's trigger can target your Venser. And now they're the one going infinite. This precon even has a Cursed Mirror that can do it. Which makes Venser kind of a liability.

**VISUAL:**
- Two Vensers facing each other, with the opponent's side getting "∞".
- Mascot `sip-tea`.

### 6:06 · Is this a problem? + comment prompt

**VO:**
> So, did Wizards mess up? Yeah. Most precons land in Bracket 2, and Bracket 2 isn't supposed to have two-card infinites. This one ships with one. Has Wizards said anything? Not yet, as far as I know. If they do, I'll pin it in the comments.
>
> Should we worry about it, though? Not really. Most of us won't ever see this happen, and it takes a lot of luck. But if you know about it, tell the table before you shuffle up. Something like, "hey, this deck can go infinite by accident, you cool with that?" Some groups will love it. Some won't. So just ask.
>
> If you'd rather not deal with it, cutting Venser takes two seconds. A lot of people in the thread were cutting Dack. But someone made a good point: handing everyone a random big creature is a pretty fun political game on its own. So I'd keep him.
>
> Would you let this fly at your table? Or is Venser coming out before the first game? Tell me in the comments.

`[OPTIONAL: if you've played the precon or proxied the combo, one or two sentences on how it actually went. Only if it happened.]`

**VISUAL:**
- A paper table of four seats with a speech bubble: "you cool with that?"
- On "mess up": a "WIZARDS MESSED UP" stamp, then a "BRACKET 2: no two-card infinites" tag and a "SHIPS WITH ONE" sticker.
- Mascot `thinking`, then `comment` on the prompt.

### 7:09 · Close

**VO:**
> So that's the combo. Dack hands Venser over, the trigger waits, and by the time you pick a target, he's theirs. All from one box. Thread's linked below, so go give Huaojozu some love. And if you want more breakdowns like this, subscribe. Thanks for watching, and I'll see you in the next one.

**VISUAL:**
- "THAT'S THE COMBO", then the **Wild Card verdict** card, a recurring summary segment. Its rows pop in with the recap: How · Why it works · Cards (2 in the box, you cast 1) · Odds (~18% when Dack resolves) · Stop it (exile or bounce the original Venser) · Bracket 2? (shouldn't be).
- "THREAD LINKED BELOW ↓", with mascot `link-below`.
- End screen (about 18s): a subscribe card only (no other videos yet), with space left for YouTube's subscribe end-screen element. Mascot `bell`.

---

## Chapters

Re-time these from the real narration before upload.

```
0:00 An infinite combo in the box
0:37 Dack and Venser
1:27 How the combo works
2:53 The gap: why Venser can target himself
3:33 How often it happens
4:20 The catch
5:19 How to stop it
5:46 The Venser problem
6:06 Did Wizards mess up?
```

## Title and thumbnail

- **Title:** "WOTC Messed Up: This Precon Wins With ONE Card" (47 characters, so it isn't cut off on mobile).
  - The take is an opinion, stated as one in the video. It's backed by a checkable fact: most precons are meant to sit in Bracket 2, and Bracket 2 means no two-card infinites. See RESEARCH.md.
  - It doesn't claim the combo was an accident, or that Wizards knew. We don't know either.
- **Alternative titles:** "WOTC Printed a One-Card Infinite in a Precon", or "This Precon Wins With ONE Card (Dack + Venser)".
- **Thumbnails** (`thumbnail/`, 1280×720; source: `video/src/episodes/ep002/Thumbnail.tsx`). Both use the same layout: the real Multiverse Reforged box with Dack and Venser fanning out of it, a big ∞, and a shocked Wil. The headline is solid Arial Black with a thick ink outline, with no per-letter tiles, so it reads at phone size.
  - **C (recommended primary): "1 CARD WINS", solo.** It shows only the box, Dack (the one card), ∞ and a bigger Wil, and "WINS" is in ink. Compared at phone size against the channels' biggest hits (Snail 971k, NLC 133k, AoC 589k), it's the cleanest of our three: three to four elements like theirs, and the picture matches the words, since "1 card" shows one card.
  - **B: "1 CARD WINS"** with both cards. It's busier, and its white "WINS" is weaker on light backgrounds. It complements the title instead of repeating it: the title has the take, the thumbnail has the hook.
  - **A (Test & Compare alternate): "WOTC MESSED UP".**
- **Why this layout:**
  - It uses the hit template from all three channels: white paper, real card scans, a 2–4 word verdict and our own character.
  - The product box, the solid outlined headline and Wil keep it ours, not a copy of Next Level Commander's or Salubrious Snail's hand lettering.
- **Check:** the title, thumbnail and first sentence make the same promise. The hook ends "Yeah. Wizards messed up." within 10 seconds. ✔

## Short (9:16, ~40s): the rules question

This uses Attack on Cardboard's best Shorts format ("RULES QUESTION:", with a 77k median).

- **On screen at 0.0s:** "RULES QUESTION: can Venser target himself?" with Venser's card.
- **VO:** "Can Venser target himself with his own trigger? Normally, no. It only targets things your opponents control. But in the new Jace precon, Dack Fayden puts Venser onto the battlefield under your control, then hands him to an opponent. The trigger goes on the stack *after* that, and that's when you pick targets. So yes. And that's an infinite combo. Can Venser target himself?"
- **Loop:** the last line runs straight back into the opening question.
- **Title:** "Can Venser target himself? (infinite combo)"

## Description draft

```
There's an infinite combo in the new Multiverse Reforged (Jace) precon from Reality Fracture: Dack Fayden, Helping Hand + Venser, Fervent Forger.

Original Reddit post by u/Huaojozu: https://www.reddit.com/r/magicTCG/comments/1wmdp45/
Official decklist: https://magic.wizards.com/en/news/announcements/reality-fracture-multiverse-reforged-commander-decklist
Rules referenced: 603.2, 603.3, 603.3a, 603.3d, 704.5j (Comprehensive Rules, Sep 2026)

Card art: Dack Fayden by Josiah "Jo" Cameron, Venser by Borja Pindado, Jace by Volkan Baǵa, Brainstorm by Daarken, Brainsurge by Liiga Smilshkalne, Archon of Cruelty by Andrew Mar, Darksteel Angel by Chippy.
Magic: The Gathering card and product images © Wizards of the Coast, used with permission.

[CHAPTERS]
```

## Fact-check before recording

- [ ] **Card text matches the final printed cards.** Recheck Scryfall on release day, in case anything changed before print.
- [ ] **No official ruling or errata since 24 Sep.** If Wizards responds or issues a ruling, update the "is this a problem" section, or make a follow-up video framed as a new story.
- [ ] **Deck contents:** 18 creatures in the 99, and Brainstorm, Brainsurge, Darksteel Angel and Archon of Cruelty are all in the precon. This was checked against the official list; see DECKLIST.md.
- [ ] **"Posted it first as far as I can tell"** stays hedged.
- [ ] **"Wizards messed up"** stays an opinion, backed by the Bracket 2 line. Don't say it was an accident or that they knew. If Wizards comments before release, update the problem section.
- [ ] **Jace's −3** exiles *another* creature or planeswalker you control first, then reveals until a creature **or planeswalker**. The script says this (Oracle text checked 25 Sep 2026).
- [ ] **How to stop it:** removing or bouncing the original Venser while a trigger targets him makes that trigger do nothing (CR 608.2b, checked against the CR effective 25 Sep 2026). Swords to Plowshares, Path to Exile, Despark (mana value 4+; Venser is 6), Stroke of Midnight and Fatehold Charm are all in the precon.
- [ ] **Cursed Mirror** is in the precon and can enter as a copy of Venser, so its trigger can target your Venser.
- [ ] **"Has Wizards said anything? Not yet"**: re-check on recording day. If they have, change the line.
- [ ] **The odds (3/17)** assume 3 opponents and that no other creatures have left the library. The script says this.
- [ ] **"Would you keep Dack?"** is your real opinion. If you'd cut him, change the line.

## Production notes

- **Voice:** OpenRouter narration (needs an OK before generating) or your own recording. Check it with `studio/tools/check_voice.py`.
- **Assets:** card PNGs in `assets/cards/`, the mascot library, and code-drawn stack and timeline visuals (roadmap Priority 2: the stack strip).
- **Retention:** a new visual every 2–4 seconds, one subscribe segment, one comment prompt, and a "watch next" end screen.
- **Publishing timing matters more than polish here.** A good-enough version before 2 Oct beats a perfect one after.
