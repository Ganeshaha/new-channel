# Episode 002: The New Jace Precon Has a One-Card Infinite Combo

| | |
|---|---|
| **Format** | A rules breakdown of a news story. This is Attack on Cardboard's most reliable lane (rules-change and rules-explainer videos have medians of 66k–93k) applied to a brand-new card. |
| **Timing** | **Publish before the set releases on 2 Oct 2026.** The Reddit thread is from about 21 Sep and MTGRocks has already covered it, so the window is closing. |
| **Target length** | About 5:46 (~1127 spoken words). Section times below are approximate. |
| **Named idea** | "The gap": the moment between a trigger happening and it going on the stack. |
| **Open loop** | "One card in the same deck that can stop you from winning with it." This is set up in the claim and paid off with Darksteel Angel. |
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
> There's an infinite combo in the new Jace precon. Like, straight out of the box. No upgrades. And if your deck's shuffled the right way, it takes one card. One.

**VISUAL:**
- Frame 1: Dack's card slams onto a paper table. Mascot `shocked` on the right.
- On "in the box": a precon box with a big "∞" sticker slapped on it.
- On "one card": the text "1 CARD" stamps in.

### 0:09 · Claim and promise

**VO:**
> It's Dack Fayden and Venser. And the reason it works trips up a lot of players. So we'll go through how it works, how often it'll come up, the card in the same deck that can stop you from winning with it, and whether I'd even leave it in.

**VISUAL:**
- Dack and Venser side by side.
- A checklist of four items appears as they're named. The third, "the card that stops it", is shown face-down with a "?" (the open loop).
- Mascot `thinking`.

### 0:26 · The two cards

**VO:**
> All right, quick context. The deck is Multiverse Reforged. It's the four-colour Jace precon from Reality Fracture, and it's out October 2nd. Two of the new cards in it are the problem.
>
> First up, Dack Fayden, Helping Hand. Dack's a six-mana creature now. Already a bit weird. When he enters, you reveal cards off the top until you hit one creature for each opponent. In a normal four-player game, that's three creatures. They come in under your control, you shuffle, and they're goaded for the rest of the game. Then you hand one to each opponent. Merry Christmas.
>
> Next up, Venser, Fervent Forger. When Venser enters, one of his modes makes two token copies of target permanent an opponent controls. They've got haste, and you sacrifice them at the next end step.

**VISUAL:**
- Zoom on Dack's card and underline "Put those creature cards onto the battlefield", then circle "Each opponent gains control".
- Three mini cards fly out, one to each of three paper opponents.
- Zoom on Venser and underline the second mode.
- Mascot `draw` when the cards are revealed.

### 1:09 · The combo

**VO:**
> Now let's say we flip Venser as one of those three.
>
> Dack's ability is resolving. Venser comes in under your control, so when his trigger happens, it's your trigger. Then, still in the middle of Dack's ability, Venser gets handed to an opponent.
>
> Dack finishes. We put Venser's trigger on the stack. That's when you pick the target. Venser belongs to an opponent now, right? So you can point his ability at… Venser. Yeah. Himself.
>
> We get two token Vensers. Legend rule, you keep one, and the other goes to the graveyard. But they both entered. That means we've got two new Venser triggers. One targets the original Venser again. The other copies whatever you want off an opponent's board.
>
> And it just keeps going. Basically, every loop you get two more Vensers. One keeps the loop alive. The other makes two hasty copies of something good. Do it as many times as you want, then swing.

**VISUAL:**
- A step-by-step "stack" strip across the screen, with numbered paper cards stacking:
  1. Dack resolves.
  2. Venser enters (your trigger).
  3. Venser goes to an opponent.
  4. The trigger goes on the stack and targets Venser.
- On "legend rule": two token Vensers appear and one poofs to the graveyard (use `Poof`).
- Mascot `infinite-combo` from "that just keeps going".

### ≈2:01 · Subscribe segment (≤5s, overlaid, narration continues)

**VO:**
> Quick thing. If you like rules breakdowns like this, subscribing helps a new channel a lot. Okay. But wait. How is Venser allowed to target himself?

**VISUAL:**
- `studio/assets/subscribe-beat.webm`, bottom-right.

### 2:10 · The gap (rules payoff)

**VO:**
> So the thing everyone in the Reddit thread kept asking about is when you pick targets.
>
> Venser's ability triggers the moment he enters. But it doesn't go on the stack yet. It waits until the next time a player would get priority, which is after Dack's whole ability is done. That's rule 603.3. And you choose targets as it goes on the stack, not when it triggers. That's 603.3d.
>
> The trigger's yours, because you controlled Venser when it triggered. That's 603.3a. But you pick the target after he's already switched sides. I mean, it's a tiny gap. But yeah, that's the whole reason it works.

**VISUAL:**
- A timeline bar with three markers: "Venser triggers (you control him)", "Dack finishes (he's theirs now)" and "trigger goes on stack → choose target". A spotlight lands on the space between the last two, labelled "THE GAP".
- Rule numbers appear as paper tags as they're said (603.3, 603.3d, 603.3a).
- Mascot `peek` on "when targets get chosen", then `big-brain` on "the entire combo".

### 2:44 · The odds

**VO:**
> Okay, so how often does this happen? We've got 18 creatures in this deck. Dack's one of them, and he's already on the battlefield. That leaves us at most 17 in the library. Dack grabs the first three. If none of the others have been drawn yet, the chance Venser's one of them is three in seventeen. So, about 18 percent.
>
> But you can help it along. Say Venser's already in your hand. Brainstorm or Brainsurge, both in the deck, let you put him back on top. Then Dack finds him every time.
>
> We've also got Jace. His minus three reveals until it hits a creature or a planeswalker, and puts it straight onto the battlefield. In theory, we can spin Jace into Dack, and Dack into Venser. Is that a lot of ifs? Yeah. But you don't need a single card from outside the box.

**VISUAL:**
- A big "3 / 17" with "≈ 18%" underneath. Seventeen mini card backs in a row, three flipping up.
- Mascot `coin-flip` on "about 18 percent".
- The Brainstorm card zooms in; Venser slides from the hand to the top of the library.
- Jace's card, with his −3 underlined.

### 3:32 · The catch (pays off the open loop)

**VO:**
> Now, there's a catch. It's my favourite part of this whole thing.
>
> Every creature Dack finds goes to a different opponent. And this deck also has Darksteel Angel. Darksteel Angel says you can't lose the game, and your opponents can't win the game. So if Dack flips Venser and the Angel, the Angel goes to an opponent. And now you're one of the people who can't win. You've got a board full of infinite copies, and you're not allowed to win. Love that for you. Unless you find a way to get rid of it, that's it.
>
> The dream version is the other way round. If Dack also finds Archon of Cruelty, you don't even need to attack. Every copy of Archon makes an opponent lose three life. The problem is, every copy also makes *you* draw a card. Three opponents on 40 life is around 40 copies. If your library's looking thin, you can deck yourself mid-combo. It's kind of amazing.

**VISUAL:**
- The face-down "?" card from the claim flips over: Darksteel Angel.
- Mascot `facepalm`.
- Darksteel Angel's card with "your opponents can't win the game" circled. An arrow points from "your opponents" to the mascot.
- Archon of Cruelty's card, with a life counter ticking down (`life-loss`) next to a library pile shrinking with each draw.
- Mascot `nervous-sweat` on "lose to your own combo".
- **Timing note (on-screen text, no VO needed):** "Cast Dack before combat. The copies are sacrificed at end of turn."

### 4:26 · The Venser problem

**VO:**
> One more thing people in the thread pointed out. This can happen to *you*, too. If you're on Venser and an opponent copies him with any clone, their copy's trigger can target your Venser. And now they're the one going infinite. Even outside this precon, Venser's kind of a liability.

**VISUAL:**
- Two Vensers facing each other, with the opponent's side getting "∞".
- Mascot `sip-tea`.

### 4:42 · Is this a problem? + comment prompt

**VO:**
> So is this something we should worry about? I mean, it's a precon. Most of us won't ever see this happen at a table, and it takes a lot of luck. But if you're the one who knows about it, I'd tell the table before you shuffle up. Something like, "hey, this deck can go infinite by accident, you cool with that?" Some groups will think it's hilarious. Some won't. And that's pretty much what Rule 0 is for.
>
> If you'd rather not deal with it, cutting Venser takes two seconds. A lot of people in the thread were cutting Dack. But someone made a good point: handing everyone a random big creature is a pretty fun political game on its own. So I'd keep him.
>
> Would you keep Dack in? Let me know in the comments. I'm curious how many of you are cutting him.

`[OPTIONAL: if you've played the precon or proxied the combo, one or two sentences on how it actually went. Only if it happened.]`

**VISUAL:**
- A paper table of four seats with a speech bubble: "you cool with that?"
- Mascot `thinking`, then `comment` on the prompt.

### 5:30 · Close

**VO:**
> Anyway, that's the combo. Big shout out to u/Huaojozu on r/magicTCG, who posted it first, as far as I can tell. Thread's linked below. And if you pull this off at your table, let me know how everyone else took it. I want to hear it.

**VISUAL:**
- The Reddit credit as a paper tag, with mascot `link-below`.
- End screen (about 20s): a "watch next" slot (episode 001 if it's out) and the subscribe element. Mascot `watch-next`.

---

## Chapters

```
0:00 An infinite combo in the box
0:26 Dack and Venser
1:09 How the combo works
2:10 The gap: why Venser can target himself
2:44 How often it happens
3:32 The catch
4:26 The Venser problem
4:42 Should you keep it in?
```

## Title and thumbnail

- **Title (primary):** "The New Jace Precon Has a One-Card Infinite Combo". It's factual, specific and searchable.
- **Alternatives to A/B test:**
  - "This Precon Can Win With ONE Card (Dack + Venser)"
  - "Did Wizards Accidentally Print an Infinite in a Precon?" (this frames "accidentally" as a question, because we don't know it was an accident)
- **Thumbnail:** Dack and Venser's cards overlapping, the mascot `shocked` or wearing the `deal-with-it` sunglasses, and the text **"1 CARD = ∞"** (five words or fewer).
- **Check:** the title, thumbnail and first sentence all make the same promise (one card, infinite, in the box). ✔

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
Magic: The Gathering card images © Wizards of the Coast, used with permission.

[CHAPTERS]
```

## Fact-check before recording

- [ ] **Card text matches the final printed cards.** Recheck Scryfall on release day, in case anything changed before print.
- [ ] **No official ruling or errata since 24 Sep.** If Wizards responds or issues a ruling, update the "is this a problem" section, or make a follow-up video framed as a new story.
- [ ] **Deck contents:** 18 creatures in the 99, and Brainstorm, Brainsurge, Darksteel Angel and Archon of Cruelty are all in the precon. This was checked against the official list; see DECKLIST.md.
- [ ] **The odds (3/17)** assume 3 opponents and that no other creatures have left the library. The script says this.
- [ ] **"Posted it first as far as I can tell"** stays hedged.
- [ ] **"Would you keep Dack?"** is your real opinion. If you'd cut him, change the line.

## Production notes

- **Voice:** OpenRouter narration (needs an OK before generating) or your own recording. Check it with `studio/tools/check_voice.py`.
- **Assets:** card PNGs in `assets/cards/`, the mascot library, and code-drawn stack and timeline visuals (roadmap Priority 2: the stack strip).
- **Retention:** a new visual every 2–4 seconds, one subscribe segment, one comment prompt, and a "watch next" end screen.
- **Publishing timing matters more than polish here.** A good-enough version before 2 Oct beats a perfect one after.
