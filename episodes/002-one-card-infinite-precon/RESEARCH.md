# Research: the Dack + Venser infinite in Multiverse Reforged

Researched 24 Sep 2026. The set releases 2 Oct 2026, so the cards aren't out yet.

## The cards (Oracle text from Scryfall, Reality Fracture Commander printings)

**Dack Fayden, Helping Hand** {4}{W}{W}, Legendary Creature — Human Advisor 4/6 (FRC #4, new)
> When Dack Fayden enters, reveal cards from the top of your library until you reveal X creature cards, where X is the number of opponents you have. Put those creature cards onto the battlefield, then shuffle. They're goaded for the rest of the game. For each of those permanents, choose a different opponent. Each opponent gains control of the permanent for which they were chosen.

**Venser, Fervent Forger** {4}{R}{R}, Legendary Creature — Human Sorcerer 5/3 (FRC #9, new)
> Flash
> When Venser enters, choose one —
> • Copy target instant or sorcery spell an opponent controls twice. You may choose new targets for the copies.
> • Create two tokens that are copies of target permanent an opponent controls. They gain haste. At the beginning of the next end step, sacrifice them.

**Supporting cards in the same precon:**
- **Jace, Multiverse Architect** (the commander). His −3 exiles another creature or planeswalker you control, then reveals until it finds a creature or planeswalker card and puts it onto the battlefield. It can hit Dack.
- **Brainstorm** and **Brainsurge** (both in the deck) put two cards from hand back on top of the library, so Venser can be set up as the first creature Dack reveals.
- **Darksteel Angel**: "You can't lose the game and your opponents can't win the game." If Dack gives it to an opponent, *you* can't win while they control it.
- **Archon of Cruelty**: "Whenever this creature enters or attacks, target opponent sacrifices a creature or planeswalker of their choice, discards a card, and loses 3 life. You draw a card and gain 3 life." If Dack gives it away, Venser can copy it. Each copy drains 3 but also draws you a card.

As of 24 Sep 2026, neither Dack nor Venser has official rulings on Scryfall.

## Why it works (Comprehensive Rules, version dated 25 Sep 2026)

| Rule | What it says (summary) | Why it matters |
|---|---|---|
| 603.2 | An ability triggers the moment its trigger event happens, but doesn't do anything yet. | Venser's trigger happens as he enters, *during* Dack's ability. |
| 603.3a | A triggered ability is controlled by whoever controlled its source when it triggered. | Venser entered under **your** control, so the trigger is yours. |
| 603.3 | The triggered ability is put on the stack the next time a player would receive priority. | That's **after** Dack's ability has fully resolved, when Venser already belongs to an opponent. |
| 603.3d | Putting a triggered ability on the stack follows the spell-casting steps in 601.2c–d, which is when targets are chosen. | You choose Venser's target **after** he's changed sides, so "target permanent an opponent controls" can be Venser himself. |
| 117.5 | Before triggers go on the stack, state-based actions are checked. | The legend rule is applied before the new Venser triggers go on the stack. |
| 704.5j | The legend rule: keep one, the rest are put into the graveyard. It is **not** a sacrifice. | Each pair of Venser tokens leaves one survivor, but both already triggered on entering. |

**The loop:**
1. Dack's ability puts Venser onto the battlefield (his trigger is yours), then gives him to an opponent.
2. Venser's trigger goes on the stack. You target the original Venser, now an opponent's permanent.
3. Two token Vensers enter, both triggering. The legend rule removes one.
4. One trigger targets the original Venser again, which repeats the loop. The other copies any permanent an opponent controls.
5. The hasty copies are sacrificed at the next end step, so do this **before combat** and win that turn, by attacking or with Archon copies.

## Odds (worked out from the official decklist)

- The 99 has **18 creatures**, including Dack, Venser and Nissa. Jace is the commander and a planeswalker.
- When Dack resolves, he's on the battlefield, so at most **17** creatures remain in the library.
- With 3 opponents, Dack takes the first 3 creatures revealed. With all 17 still in the library, the chance Venser is among them is **3/17 ≈ 17.6%**, a bit better than one in six.
- If some creatures are already in your hand or graveyard, the odds change.
- If Nissa is the commander instead, Jace goes in the 99. That leaves 16 creatures, so **3/16 ≈ 18.8%**.
- With Venser in hand, Brainstorm or Brainsurge puts him on top, and Dack then finds him every time.

## The Venser liability (outside this deck too)

If you control Venser and an opponent makes a copy of him with any clone effect, their copy's trigger can target your Venser, and the same loop runs for them. Venser can be turned against his owner by any clone.

## Sources

- Original post by u/Huaojozu, r/magicTCG, "There is an infinite game-ending combo in the new Reality Fracture precon…" (posted about 21 Sep 2026), https://www.reddit.com/r/magicTCG/comments/1wmdp45/. In the comments, u/therift289, u/Ak-Xo and others explain the trigger timing, u/matthoback corrects the legend-rule timing, and u/TerribleTransit points out the Darksteel Angel problem.
- [Wizards: Multiverse Reforged decklist](https://magic.wizards.com/en/news/announcements/reality-fracture-multiverse-reforged-commander-decklist)
- [Moxfield: Multiverse Reforged list](https://moxfield.com/decks/JAJNhQHxg0qfdq4ULGcj5g)
- [MTGRocks: players discover one-card infinite combo](https://mtgrocks.com/mtg-multiverse-reforged-infinite-combo/) (also notes the Archon of Cruelty finish)
- [Scryfall: Dack Fayden, Helping Hand](https://scryfall.com/card/frc/4/dack-fayden-helping-hand) and [Venser, Fervent Forger](https://scryfall.com/card/frc/9/venser-fervent-forger)
- [Comprehensive Rules (25 Sep 2026 text)](https://media.wizards.com/2026/downloads/MagicCompRules%2020260925.txt)

## Card images

These are in `assets/cards/` (Scryfall PNGs, covered by the WotC permission in PERMISSIONS.md). `cards.json` lists the artist for each, which is used for the credits in the description.
