# DefCat's deck-tech template, and how the Cabbage Man script compares

Written 28 Sep 2026 for Deck Check's Cabbage Merchant deck tech (`D:\Deck Check\06 - Series & Episodes\Cabbage Man\Cabbage Man - script.md`).

**Sources:**
- All 8 DefCat transcripts in `transcripts/`, read in full, with metadata and thumbnails from `analysis/meta/videos/`.
- DefCat's 47 long-form uploads since June 2025, for channel context. The median is 23.6k views, and the channel has about 35k subscribers.
- Next Level Commander (NLC) and Salubrious Snail, via `research/tools/search.py`, their `dataset.json` files and both FINDINGS.md.
- The repo's RETENTION.md and VOICE.md.
- Card text and prices from the Scryfall API on 28 Sep 2026.

**Caveat:** the captions for `rQxAk2weu24` and `Tke6a91YS4k` are machine translations: the commander "Brigone" comes out as "Bone", and some card names appear in Spanish. Quotes from those two show the structure only, not his exact words.

---

## A. DefCat's template, reverse-engineered

### A1. The eight videos at a glance

| id | Title (short) | Views | Length | wpm | Price first said | Commander / engine explained | "I'll teach you N things" | Mulligan | How to win | Card rundown share | First CTA | Subscribe ask |
|---|---|---:|---:|---:|---|---|---|---|---|---:|---|---|
| kOBVwA6hbac | My Favorite Commander Deck… Reverse Landfall | 245k | 10:34 | 239 | "$100 variation" 1:02 | concept 0:10, overview 1:34 | four things, ~1:25 | 2:20 | 3:47 | 25% | comment ask, 10:13 (96%) | none |
| 4Egnh_suplc | My 26$ Aura Farm Commander Deck | 86k | 13:43 | 224 | "$26" 1:02, repeated 3:05 / 3:35 / 4:06 | 1:02 | four steps, 3:35 | 3:35 | ~4:06 | 57% | Patreon + Discord, 2:03 (15%) | none |
| 0dBQ581fuWY | My Most Evil Deck Ever Created | 39k | 22:54 | 224 | none (a paid custom build) | ~1:32 | three things, 2:33 | 3:03 | 5:37 | ~50% | Patreon, 0:30 (2%) | none |
| nUP6rcZtqCU | Sonic 50$ Deck Tech w/ Upgrade Guide | 30k | 9:00 | 246 | "$50 or less" 1:03 | 2:35 (in "turn 5") | three things, 1:33 | 2:21 | 3:25 | 31% + upgrades 5% | "Please subscribe" 8:40 (96%) | end only |
| rvoNZtNseCQ | A Kefka Pre-con w/ UPGRADE GUIDE | 24k | 13:36 | 225 | "$50 TCG value" ~0:10 | 1:31 | three things, 2:31 | 3:03 | 4:58 | 30% + upgrades 24% | Moxfield comment ask, 13:08 | none |
| U_V8h79tTwM | The Commander Deck That Plays Itself! | 23k | 19:22 | 213 | none | 0:30 | ~1:37 | 3:23 | ~4:39 | 48% + cEDH 14% | subscribe + Patreon, 2:07 (11%) | 2:07 |
| rQxAk2weu24 | The $18 ANIME PROTAGONIST Commander Deck | 19k (7 weeks old) | 12:46 | ~190* | "$18" ~0:10, said 3× by 0:31 | 1:01 | four things, 3:03 | 3:23 | 7:01 | 23% (by role, not type) | Patreon 2:32, sponsor 7:55 | none |
| Tke6a91YS4k | The Reverse mana Curve… | 13k | 21:51 | ~210* | none | 0:10–1:00 | three things, 4:35 | 4:35 | 7:11 | 57% | Patreon + ManaBox + chair sponsor, 2:01–4:04 | none |

\* translated captions, so the word counts are approximate.

**Pace:** 213–246 wpm on the English captions, averaging about 230, which is faster than NLC (~220) and Snail (~205).

**Length:** 9–23 minutes. Only the top two sit between 10 and 14 minutes.

### A2. Section order

The order below repeats in every video. The only things that move are how long the card rundown runs and whether an upgrade section is included.

1. **Question-stack cold open (0:00–0:30).**
   - Two to four quick "Have you / Do you / Did you" questions, mixing pop-culture and identity. The last one tilts toward the deck.
   - Then a pivot ("What if we did the opposite?", "Then…", "Well, then…", "Ladies and gentlemen…").
   - Then a one-sentence reveal of the deck's concept name.
2. **Proof or story (about 0:30–1:30).** A "this actually happened" beat, or a boast that shows credibility:
   - "It all happened at a convention. I was going through a dollar box…" (4Egnh 0:31)
   - "The Kamigawa Landfill has been described as the most interesting Aesi deck ever made." (kOBV 0:31)
   - "I've now played four games with this deck in practice, which trust me is a lot more than most YouTubers who make lists like this." (nUP6 1:03)
3. **"Introducing [commander]. [Commander] says…"** He reads the card in plain words, then gives its implications and one rules reminder:
   - "Big reminder. That means if someone discards an artifact creature that is two cards…" (rvoN 1:31)
   - "This has massive implications. First off…" (U_V8 1:00)
   - This lands between 0:30 and 1:35 in six of the eight videos.
4. **Channel promise.** "Welcome to DefCat MTG, where I don't just show you a deck list, I teach you to pilot it." It appears in all eight videos, between 3% and 26% of the runtime, and is usually framed against "boring" channels:
   - "If you wanted a list, go to Moxfield or any of these other boring channels." (rvoN 0:30)
   - "We ain't those channels that just show you cards on screen and here's the deck list." (U_V8 1:37)
5. **Numbered roadmap.** "I'm going to teach you three/four things":
   - opening hands;
   - what you do by turn five (turn three for fast decks);
   - combos or tech;
   - how to win;
   - and in the four-step version, "the individual cards".

   In nUP6 1:33 he also says why each step matters: "if you want to take a deck and go bring it to FNM, you need to know what to keep in your opening hand so you don't get screwed."
6. **Opening hands (17–26% in).** Hard numbers, a mulligan floor, then a "spice" add-on:
   - "At minimum three lands and two ramp spells. That means you can mulligan down to five in this deck safely." (kOBV 2:05)
   - "the non required spice that isn't needed to keep the hand, but is something really fun to look for" (nUP6 2:04)

   He closes the section by restating the rule in one line.
7. **Turn-five checkpoint.** A turn-by-turn picture:
   - "On turn one you play a dork. On turn two you play something fun. On turn three you build up to your commander. On turn four you play the commander. And on turn five you play its background." (4Egnh 4:06)
   - "By turn five, Aesi should be out. You should have probably at least one extra land drop spell out…" (kOBV 2:35)
8. **Tech / combos, then "how to win" (24–41% in, except rQxA at 55%).** Usually two or three named routes plus a "hail mary".
9. **Card rundown by type.** Planeswalkers or battles first, then creatures, sorceries, instants, artifacts, enchantments. Each chapter opens with a spoken one-word header ("All right, creatures." "Instants." "Enchantments."). Each card gets one or two lines and a joke. The newest video (rQxA) groups cards by role instead ("untaps", "pump and protect", "side characters").
10. **Upgrade guide** (only in the budget and precon videos). He gives specific swaps:
    - "we replace the three ring artifacts with these three spells" (nUP6 7:39)
    - "I'm going to tell you what cards to take out so you know what to put in." (rvoN 9:50)

    He sorts upgrades by bracket and points to Moxfield's Considering section (kOBV 8:40).
11. **Outro.**
    - A send-off that pictures the viewer at the table: "So when you go out and play this deck now you get to tell people you're playing reverse landfall…" (kOBV 9:11).
    - A community ask.
    - A personal faith or charity message (5 of 8 videos).
    - "This has been DefCat." (4Egnh, nUP6, rvoN) or "Thanks for watching."

### A3. The hooks: first 30 seconds, quoted

- **kOBV (245k):** "Have your friends ran you over with a billion [beasts]? Are they the type of people that still use fidget spinners? Because no offense, but I've seen enough live leak videos to understand landfall at this point. What if we did the opposite? Ladies and gentlemen, welcome to the Kamigawa landfill. A deck from which you will benefit from lands leaving the battlefield."
- **4Egnh (86k):** "Have you seen one of these animes? Have you seen one of these films? Do you know of a man named Jack Sparrow? Then at least on some level, you know what true aura is… There's something unbeatable about being able to do nothing and still win. And ladies and gentlemen, I've built the ultimate aura farm deck."
- **0dBQ (39k):** "Do you have someone in your life that you care for? Do you have friends that you regularly play Magic with? … What if you had the opposite? Ladies and gentlemen, I have been paid for and tasked to create the most annoying and evil deck for someone's playgroup."
- **nUP6 (30k):** "Did you enjoy ski ball as a kid? At one point, did you realize you just had to be faster than your dad…? … Well, good lord have mercy. Have you found yourself to be the perfect person to play Sonic the Hedgehog?"
- **rvoN (24k):** "Was Fight Club more than just a movie to you? Would you consider White Monster in a Candy Bar a balanced breakfast? Is name brand cereal a hoax? Then it's time that you and I blow every precon out of the water for $50 TCG value Kefka."
- **U_V8 (23k):** "Do you remember Spark Notes? Did you experience the Scholastic Book Fair? And have you played a warlock in DnD? Well, then it's time to unlock your true affinity for spell books."
- **rQxA (19k, translated):** "Do you find these women intimidating or attractive? Have you ever wanted to have God and anime on your side? Well… today for only $18, you can live the ultimate life of an anime protagonist."
- **Tke6 (13k, translated):** "Did you identify with Toji from Jujutsu Kaisen? … Do you see this mana curve as so healthy? What would happen if we did the opposite? Introducing Omnath, locus of all… casts eight-mana creatures no later than turn four."

**The formula:** stacked questions, then a pivot, then a named deck concept, then a concrete promise (a price or an absurd outcome), all inside 30 seconds. The inversion ("What if we did the opposite?") is his strongest move: it opens his best video and two others.

### A4. Price and budget

- **Every budget video puts an exact dollar figure in the title and says it in the first 65 seconds:**
  - "$50 TCG value", about 0:10 (rvoN);
  - "only $18", about 0:10 (rQxA);
  - "$26" at 1:02 (4Egnh);
  - "all for $50 or less… Manapool has this right now at under $50" at 1:03 (nUP6).
- **He repeats it as a refrain:** "And again, all for 26 bucks… It's literally less than a precon costs." (4Egnh 3:05–3:35)
- **He names where the price comes from** (TCG, ManaPool).
- **He compares it with a precon.**
- **The price tiers are $18, $26, $50 and $100.** The $100 figure is a budget *version* of his own full deck ("I've made a $100 variation of it for you", kOBV 1:02). NLC and Snail use the same range ($20, $25, $50, $90, $100). None of the three channels calls a $200+ deck "budget".

### A5. Stories, jokes, skits, gameplay

- **No gameplay footage.** In every transcript he's talking to camera on a green screen ("I'm on a small green screen, so I can't go too wild", nUP6 2:04), with cards on screen.
- **Skits:**
  - friends unable to attack the goaded board (4Egnh 1:33);
  - a heckler: "Really, DefCat? I've been playing since Codie started" (U_V8 1:24);
  - meme sound effects ("CALL AN AMBULANCE", 0dBQ 0:30).
- **Anecdotes are short "my favorite play" beats, one to three per video:**
  - "I've put down like 12 lands in one turn with this" (kOBV 8:10);
  - "I once used this deck to kill the rest of the table by using a Torment of Hellfire from someone else's hand" (0dBQ 5:37);
  - "I created 161 1/1 tokens" at MagicCon (Tke6 7:42).
- **Jokes land roughly every 30–45 seconds**, as self-deprecating asides and pop culture:
  - "Did y'all know I could dance?"
  - "it is way too hot in here"
  - "Of course, I made this deck sober"
  - "I have dyslexia and this card kills me"
- **A running anti-boring stance:**
  - "No one likes a clown with one joke" (U_V8 1:00);
  - "not some two-card boring infinite" (rvoN 10:08);
  - "I despise YouTube videos that go, 'Here's a deck of only charcoal rolled baby mongooses.'" (4Egnh 2:03)

### A6. Decklist and CTAs

- **The decklist link always goes in the description**, right under his standard Patreon and sponsor lines ("Deck list: moxfield…"), along with chapters. He also refers to it out loud:
  - "I'm giving you guys the full deck list" (nUP6 2:04);
  - the Considering section (kOBV 8:40);
  - "go to the Moxfield link and comment and let's help people get this deck better" (rvoN 13:08).
- **CTAs are mostly Patreon**, since custom decks are his business. His ask sits right after the channel promise, at 9–20% of the runtime in 6 of 8 videos, with a second plug before the card rundown in some.
- **Subscribe asks are rare:** 2 of 8 videos.
  - U_V8 at 2:07: "If you haven't already, make sure to subscribe."
  - nUP6 at the very end: "Please subscribe. This has been Defcat."
- **He never asks for likes.**
- **The end CTA is a community ask:**
  - "please comment someone you would like to see their deck from" (kOBV 10:13);
  - "send me your best pictures of you aura farming" (4Egnh 13:12).
- **NLC works the same way.** The list is "down in the description" (rc_S1idV-1g 7:02). It uses one comment prompt about the list ("Is there anything I'm missing from this deck list?", u7pUcOv5DLw 7:19) and a subscribe line at the end, sometimes also early (rc_S1idV-1g 0:42).

### A7. Recurring phrases and signatures

- **Openers and reveals:** "Ladies and gentlemen", "What if we did the opposite?", "Introducing…", "[Card] says…"
- **The channel promise:** "Welcome to DefCat MTG… I teach you how to pilot", "as if you built it", "you found your deck"
- **The roadmap:** "I'm going to teach you three/four things", "opening hands", "by turn five", "how to win"
- **Tone words:** "spice/spicy", "baby" ("We zip, baby", "time to combo, baby"), "hail mary", "Geneva suggestion", "war crime", "one-trick pony", "boring"
- **Context:** bracket talk (named in 6 of 8), precon comparisons
- **Sign-off:** "This has been DefCat"

### A8. What the higher-view videos do differently

This is 8 videos with confounds (age, topic, the algorithm), so treat it as pattern, not proof.

1. **Concept or meme first, commander second.**
   - The top two titles never name the commander: "Reverse Landfall" (245k) and "Aura Farm" (86k).
   - The commander- or product-named ones (Sonic 30k, Kefka 24k, Codie 23k) sit near his median.
2. **They're shorter.**
   - The top two run 10.6 and 13.7 minutes.
   - Three of the bottom four run 19–23 minutes, spending 48–57% of it on card-by-card reading.
3. **No plug before the teaching starts.**
   - The #1 video has no Patreon or sponsor plug until the last minute.
   - The lowest one (Tke6, 13k) spends 2:01–4:04 on Patreon, ManaBox and an E-Win chair read before any teaching.
4. **Proof in the first minute.** Story time (4Egnh 0:27), or a third-party claim (kOBV 0:31).
5. **Thumbnails.** The hits show a smug side-eye face, physical cards held up, two to four words of slab-serif text on white, and a price tag ("MY FRIENDS CAN'T BEAT IT = 26$"; "Reverse Landfall…"). The lowest (Tke6) has no words, just mana-curve bars.

---

## B. The Cabbage Man script against the template

**Timings are estimates.** The recording ran about 2,900 spoken words in 17:20 (168 wpm, including pauses). At that pace the 2,229-word script runs about 13:15. At DefCat's ~230 wpm it would be about 9:45.

| Script section | Est. start | DefCat equivalent | Verdict |
|---|---|---|---|
| 1. Cold open | 0:00 | Question-stack hook | **Matches.** A pop-culture question, then pain, then "what if we…" (his inversion move). Lands in 18 s. |
| 2. Intro | 0:18 | Reveal, proof, promise | **Strong proof** (73 bears, the wall). **Too long:** 263 words (~94 s) before the commander is named. **No price. No channel promise.** |
| 3. Meet the Cabbage Merchant | 1:52 | "Introducing X. X says…" | Clear and correct, but about 20–40 s later than DefCat. Doesn't give the mana cost, which the mulligan logic depends on. |
| 4. The game plan ("two truths") | 2:21 | Quick deck overview | **Good.** "Truth two" (artifacts *and* tokens) sets up Dinosaurs, Halsin and Jaheira, but it's never called back. |
| (roadmap is inside 2) | ~1:30 | "Teach you N things" | Present, but it's a six-item run-on. The recording had "I'm going to teach you three things", which is closer to DefCat. |
| 5. Mulligans | 3:05 (23%) | Opening hands (17–26%) | **Matches**, with a keep rule, a mulligan floor and a proof story (the four-card hand). |
| 6–8. Early / mid / late game | 3:52 | "By turn five" | **Weaker.** Good table moments, but no turn-by-turn benchmark and only one concrete instruction (use mana sinks). |
| 9–10. Win cons + 3 secret win cons | 5:27 (41%) | How to win (24–41%) | **Matches, and one of the script's best parts.** It pays off the open loop. It never names the bracket (DefCat names it in 6 of 8). |
| 11. Cards that make it sing | 8:20 | Card rundown | **Better for a 12-minute video** than DefCat's full type-by-type reading, and close to his newest role-based grouping (rQxA). About 17% of the runtime, near his best video's 25%. |
| 12. Upgrades | 10:36 (80%) | Upgrade guide (72–84%) | Right place, but they're **adds with no cuts**, only one price, and no bracket effect. |
| 13. Outro | 12:25 | Send-off, community ask, sign-off | Good send-off. The ask is vague ("send me your stories": where?). No sign-off with the channel name. "That's the point." gets flagged by the checker. |

**Specific checks:**

- **Hook (the Avatar Cabbage Man).**
  - It's the right kind of hook: a widely known meme ("MY CABBAGES!") and an inversion, which is exactly the shape of DefCat's best openers ("Aura Farm", "What if we did the opposite?").
  - It's a single question where DefCat stacks two to four, but it already lands a concrete promise at 0:18 ("robots, bears, even dinosaurs"). No major change needed.
  - Say "*Avatar: The Last Airbender*" once, so nobody pictures blue people.
- **Price and budget.**
  - The script never says a price. The recording mentioned a "budget checklist", and the script header calls it a budget deck tech.
  - At about $214 (Scryfall, 28 Sep 2026), it is **not a budget deck by these channels' standards** ($18–$100).
  - Either state the real number and drop "budget" from the title, or build a real sub-$100 version like DefCat's "$100 variation" (kOBV). The eight most expensive cards alone come to about $94, and the Merchant is $29, so that's a real rebuild, not a tweak.
- **Promise and roadmap.** Present but shapeless. The recording had two DefCat-signature lines that the rewrite dropped:
  - "So if you want to make an absurd amount of mana … you've found your deck";
  - "I'm going to teach you three things".
- **Commander explanation.** Accurate (checked against Scryfall). But:
  - it arrives at ~1:52;
  - the cost ({2}{G}) is never said, so "land plus dork, then turn-two Merchant" isn't obviously right to newer players;
  - the "artifacts *and* tokens" point is split off into the next section.
- **Gameplay anecdotes.** This is the script's biggest strength. It has about 10 real stories against DefCat's one to three, including the wall walk, the four-card keep, borrowed tokens and judge photos, the 52/52 elves, the Karn scoop, the 23-mana Voyage and "Yes". Keep all of them.
  - **Number reuse to check:** "73 cabbages into bears" (intro) against "73 dinosaur cabbages" (win cons), and "the 47th time this week" (cold open) against "I had 47 cabbages" (Karn). If each is real, keep them. If not, the repeats make them sound invented.
- **Pacing.** Section order and proportions match DefCat well:
  - mulligans at 23%;
  - win cons at 41%;
  - upgrades at 80%;
  - outro at 7%.

  The drag is the 94-second intro, and the early/mid/late run, which is mostly flavor.
- **Length.** About 12–13.5 minutes at Ganesh's pace, the same band as DefCat's 86k video (13:43). Delivering at around 190–200 wpm would land about 11:30, near his 245k video (10:34).
- **CTAs.** There's no subscribe line anywhere, and the only ask is the outro's "send me your stories / share this".
  - DefCat's early slot (9–20%) holds his Patreon ask. Ganesh has no Patreon, so that slot is free for one subscribe line.
  - RETENTION.md puts it after the first payoff, 25–40% in, under 5 s, with a reason.
  - So it goes at the end of the game plan (about 3:00, ~23%), leading straight into mulligans.
  - DefCat never asks for likes, so don't add one.
- **Decklist mention and link.** "They're all in the decklist" is the only mention. There's no "link in the description" and no Moxfield or Considering section, and the upgrades aren't pointed there.
- **Decklist contradictions.**
  - Every card named in the script is in `Cabbage Man - decklist.md`, except the ones already labeled as upgrades or add-ons: Temur Sabertooth, Cloudstone Curio, Unwinding Clock, Fomori Vault, Inventors' Fair, Collective Voyage, Doubling Season, Parallel Lives, Primal Vigor and Horn of Greed. **No contradictions.**
  - Paleontologist's Pick-Axe appears only in the script's notes, not in the narration. Keep it out.
  - Say "not in the list" out loud for Sabertooth and Curio.
- **Small rules and accuracy points** (from Scryfall oracle text):
  - **Harmonize** costs 4. A turn-three "land, land, land and dork" gives exactly 4, so "mana left over" needs cabbages from opponents' spells.
  - **Elephant Grass's** cumulative upkeep rises by 1 each turn, and you can't sacrifice it on demand. You just stop paying.
  - **Halsin's** bears (and **Displaced Dinosaurs'** dinos) can only attack if that token has been under your control since your turn began. Cabbages made on opponents' turns are fine. That's worth one line: it's the kind of rules reminder DefCat gives ("Big reminder…", rvoN 1:31).
  - **Primal Vigor** doubles *everyone's* tokens.
  - **Displaced Dinosaurs** hits all historic permanents, including legendaries (so Karn and Jaheira too), not just artifacts. That's optional to mention.
  - Everything else checks out: Clock of Omens, Karn's −1 and −7, Night of the Sweets' Revenge ({5}{G}{G}, sacrifice, +X/+X per Food, sorcery speed), Jaheira, Peregrin Took, Academy Manufactor, and Dark Depths (30 mana).
- **Checker baseline.** `check_script.py` on the current script body: 0 rate problems, and 1 flag, "That's the point." in the outro. It's his own recorded line, so it's optional to cut.

---

## C. Edits, in priority order

Suggested wording is in Ganesh's voice. `[brackets]` mark facts only he knows. Don't guess them.

**1. Say the price, honestly, in the first minute** (end of the intro's first paragraph, about 0:25).

- *Why:* every DefCat budget video says an exact figure by 1:05, and most by 0:10 (rvoN, rQxA, 4Egnh, nUP6). NLC's biggest hit says it in the first sentence: "My group is being destroyed by this $50 deck…" (u7pUcOv5DLw 0:00). $214 isn't "budget" in this niche, so say the number and drop the word.
- *Wording* (check the price on upload day):
  > "And the whole thing comes in around two hundred bucks. About $[214] when I checked, and thirty of that is the Cabbage Man himself."
- If he wants a budget title, he'll need a real sub-$100 list in the description instead (kOBV 1:02: "I've made a $100 variation of it for you").

**2. Replace the roadmap with a pitch, the channel promise, and a numbered four-step roadmap, ending on the teaser** (replaces "We'll go through mulligans, the early, mid and late game…").

- *Why:*
  - The channel promise appears in all eight DefCat videos.
  - "you found your deck" is his line (kOBV 1:02), and Ganesh already said it in the recording.
  - A numbered roadmap is in every video.
  - The teaser before the mulligans copies kOBV 2:05: "There's a card in this deck so powerful… Now that you're interested, opening hands."
- *Wording:*
  > "So if you want to make a stupid amount of mana and then beat your friends to death with produce, you've found your deck. This is Deck Check, where I teach you to play the deck like you built it. So I'm going to teach you four things. One, what hand to keep. Two, what you should be doing by turn five. Three, how to win, including three secret win cons. And four, the cards that make it sing, plus the upgrades if you want to go further. And one of those secret win cons is so stupid it really should never work. But it does."
- Keep "you won't just be a cabbage merchant… cabbage *master*" if there's room. It's his, and it's good.

**3. Trim the intro by about 60 words, so the commander lands by about 1:15 instead of 1:52.**

- *Why:* DefCat introduces the commander between 0:30 and 1:35 in six of eight videos, and NLC by 0:48.
- *What to cut:*
  - "People have called this the weirdest, funniest deck I've ever built, and it works way better than it has any right to."
  - "It looks completely harmless. Just some cabbages and a smile. But it hits hard, it hits fast, and no two games play out the same." This is also a stacked triplet (VOICE.md).
- *What to keep:*
  - the 73 bears and the wall;
  - "I was tired of playing normal Magic";
  - the three ways he's won, which preview the win cons.

**4. Rewrite the commander intro the DefCat way, and fold "truth two" into it** (section 3; section 4 then keeps only truth one and the plan).

- *Why:* DefCat's "Introducing [X]. [X] says…" line comes with the cost and one rules note (4Egnh 1:02, rvoN 1:31, U_V8 0:30). The mulligan logic depends on the Merchant costing 3.
- *Wording:*
  > "Introducing the Cabbage Merchant. Three mana, mono-green, straight out of the Avatar set. Whenever an opponent casts a noncreature spell, we make a Food. That's a cabbage. And we can tap two cabbages for one mana of any color. Oh, and cabbages are Foods, so they're artifacts and tokens. Remember that, it matters a lot later."
- Then keep his downside line and "I'll show you how later".

**5. Add one subscribe line at the end of the game plan (about 3:00, ~23%), leading into the mulligans.**

- *Why:*
  - DefCat's early CTA slot (9–20%) is where his Patreon ask goes, and U_V8 put "make sure to subscribe" there at 2:07. Ganesh has no Patreon, so that slot is free.
  - RETENTION.md says: once, after the first payoff, 5 s or less, with a reason, then an open loop out.
  - Don't add a like ask. DefCat never does.
- *Wording* (only if "a deck I actually play" is true of every episode):
  > "Quick one before the good stuff. Every video on Deck Check is a deck I actually play, broken down like this. If that's your thing, subscribe. Okay. Opening hands. And yes, I'll tell you about the four-card hand I won with."

**6. Turn "Early / mid / late game" into a "By turn five" checkpoint** (sections 6–8, keeping the "37, wait, 41" joke and the borrowed-tokens and judge-photo story).

- *Why:* every DefCat video has a concrete turn-five picture (4Egnh 4:06, kOBV 2:35, rvoN 3:33, and "by turn three to four" in U_V8). It's also where his Harmonize line needs a fix.
- *Wording:*
  > "So what should turn five look like? Turn one, land and a dork. Turn two, the Cabbage Man. Turn three, something that feeds the table, like Howling Mine, Temple Bell or Harmonize. Harmonize is four mana, and that's exactly what you've got on turn three, plus whatever cabbages the table handed you. By turn five you want about [X] cabbages and a mana sink or a payoff on the board, like Clock of Omens or Retrofitter Foundry. If you're there, you're in great shape, even if nobody at the table has noticed yet."
- Then keep his "you become everyone's best friend", mid-game chaos and late-game lines, compressed.

**7. Say the bracket where the script already says there are no infinites** (section 9, first line).

- *Why:* DefCat names the bracket in six of eight videos ("meant to be played at bracket 2 against precons", 4Egnh 2:34; "this is bracket two. I did not include any big game-winning combos", rvoN 5:04). NLC's closing verdict names it too ("technically, it is a bracket three", rc_S1idV-1g 7:02). I didn't spot any Game Changers in the list, but confirm with Moxfield's bracket tag.
- *Wording:*
  > "There are no infinite combos in this list, and I'd call it a bracket [2 or 3] deck."

  Then: "Temur Sabertooth or Cloudstone Curio, *neither of which is in the list*, …"

**8. Name the backup win cons and point to the decklist link** (replaces "They're all in the decklist.").

- *Why:*
  - DefCat always names a backup ("And then our backup to this is Natural Affinity", kOBV 5:08).
  - He points at the list out loud (nUP6 2:04, kOBV 8:40), and so does NLC ("The list is down in the description", rc_S1idV-1g 7:02).
  - Idol of Oblivion ({8}, sacrifice: a 10/10) and Retrofitter Foundry (4/4 Constructs) are both in the list and checked against Scryfall.
- *Wording:*
  > "And if you don't draw either of those, it's fine. Idol of Oblivion turns eight mana into a 10/10, Retrofitter Foundry makes 4/4 Constructs all game, and there's more in the list. The full decklist is linked in the description."

**9. Add one rules line after Halsin** (section 9).

- *Why:* it stops "why can't my new bears attack?" confusion, and it's the kind of rules reminder DefCat gives (rvoN 1:31). Summoning sickness applies to tokens that become creatures, and the same goes for new dinos.
- *Wording:*
  > "One rules thing. A bear can only attack if that cabbage has been on your side since the start of your turn. Cabbages you made on their turns? Good to go."

**10. Fix the Elephant Grass line** (section 11, Protection).

- *Why:* per the oracle text, cumulative upkeep {1} grows every turn, and you can't sacrifice the card on demand.
- *Wording:*
  > "And that cumulative upkeep goes up by one every turn, but this deck makes so much mana you'll barely notice. If your friends start complaining, just stop paying it and it goes away. Or keep paying, and keep making cabbages."

**11. Give every upgrade a price and a cut** (section 12).

- *Why:* DefCat's upgrade guides are swaps, not wish lists ("we replace the three ring artifacts with these three spells", nUP6 7:39; "I'm going to tell you what cards to take out so you know what to put in", rvoN 9:50).
- *Prices* (Scryfall, 28 Sep 2026):

  | Card | Price |
  |---|---:|
  | Unwinding Clock | ~$21 |
  | Fomori Vault | ~$15 |
  | Inventors' Fair | ~$19 |
  | Collective Voyage | ~$8 |
  | Horn of Greed | ~$17 |
  | Doubling Season | ~$32 |
  | Parallel Lives | ~$40 |
  | Primal Vigor | ~$15 |
  | **All eight** | **~$166** |

- *Wording pattern:* "Unwinding Clock, about $21. I'd take out [card] for it."
- The two lands most simply replace two Forests, but that's his call.
- Add this to the Primal Vigor line:
  > "Primal Vigor doubles everyone's tokens, theirs included, which is very group hug of us."
- Close the section with:
  > "All of these together are about $166, so pick one or two. They're all in the Considering section of the list."

  That line only works if he builds the Moxfield list with a Considering section (kOBV 8:40).

**12. Make the outro ask specific, and end with a channel sign-off** (section 13).

- *Why:*
  - DefCat's end asks are concrete and tied to the deck: "please comment someone you would like to see their deck from" (kOBV 10:13); "send me your best pictures of you aura farming" (4Egnh 13:12).
  - His sign-off is "This has been DefCat" (4Egnh, nUP6, rvoN).
  - NLC asks about the list itself ("Is there anything I'm missing from this deck list?", u7pUcOv5DLw 7:19). NLC has the highest comment rate of the three channels studied (7.9 per 1,000 views).
- *Wording* (replaces "So if you build it, send me your stories… share this…"):
  > "If you build it, tell me your highest cabbage count in the comments. My record is [X]. And if you'd cut something different for Unwinding Clock, tell me that too. I'll put the best ideas in the list."
- Final line:
  > "Thanks for watching. This has been Deck Check, and remember: my cabbages are your cabbages."
- Optionally cut "That's the point." (the only checker flag). The line "Look, I know this sounds ridiculous, because it is." already carries it.

**13. Check the repeated numbers** (cold open and section 9).

- *Why:* "73" and "47" each appear twice, in different stories. VOICE.md's honesty rule says never to let a real story read as invented.
- If the cold open's "47th time this week" is a joke number, change it to "the fifth time this week", so the real "47 cabbages" Karn story lands clean.
- If the 73 were bears, change "Attacking someone with 73 dinosaur cabbages" to "Attacking someone with a pile of 7/7 dinosaur cabbages".

**14. Name the show once, and use the card art rather than show footage** (cold open, a production note).

- Say "the Cabbage Man from *Avatar: The Last Airbender*". The card is from the Avatar set (released 21 Nov 2025), so the card art gives him the visual without clipping the show. The WotC permission covers cards, not Nickelodeon footage.
- Optional DefCat touch: add a second quick question before "Ever feel like…" for the question-stack rhythm. VOICE.md warns against stacked triplets, so two is enough.

**15. Add chapters to the description**, in DefCat's casual style.

| Time | Chapter |
|---|---|
| 0:00 | My cabbages |
| ~1:10 | The Cabbage Man |
| ~2:00 | Game plan |
| ~2:50 | Opening hands |
| ~3:40 | By turn five |
| ~5:00 | How to win |
| ~6:30 | 3 secret win cons |
| ~8:00 | Cards that make it sing |
| ~10:00 | Upgrades |
| ~12:00 | Wrap up |

Every DefCat and NLC deck tech has chapters, and RETENTION.md requires them over 5 minutes. Put the Moxfield link directly under the chapters.

**Net length:** cut about 90 words, add about 230, for about 2,370 words. That's roughly 12 minutes at 195 wpm, or 14 at his recorded 168, inside the 10–14 minute band.

**Checker:** the suggested lines above pass `studio/tools/check_script.py` with 0 rate problems and 0 tells. I also read them line by line and softened one tidy ending in edit 6. **Ganesh still needs to do the read-aloud pass** and fill every `[bracket]`.

---

## D. Title and thumbnail options (DefCat style)

DefCat's title patterns:
- first person and a superlative: "My Favorite Commander Deck… A guide to Reverse Landfall" (245k);
- "My [$] [meme] Commander Deck" (86k);
- "The $18 [MEME] Commander Deck";
- "The Commander Deck That [does X]!"

His hits lead with the concept or meme, not the commander. The thumbnails show a face with a side-eye, cards held up, two to four words of heavy slab-serif text on a light background, and a green-glow price or a red price tag.

**Option 1: meme first** (the "Aura Farm" pattern)
- **Title:** "My Cabbage Man Deck Turns Cabbages Into 7/7 Dinosaurs"
- **Thumbnail:**
  - text: "MY CABBAGES!" on top, "= 73 BEARS" in green glow;
  - a fan of Cabbage Merchant, Displaced Dinosaurs and Halsin;
  - a pile of Food tokens;
  - Ganesh's side-eye if he's on camera, or the Merchant card art if he isn't.
- Only use "73 BEARS" if that story is exact.

**Option 2: an honest price** (the "$26 Aura Farm" and "$50 Sonic" pattern)
- **Title:** "My $200 Group Hug Deck Turns Cabbages Into Nuclear Weapons"
- **Thumbnail:** "CABBAGES → DINOSAURS", with a red price tag reading "$214".
- It needs edit 1 in the video, so the title, thumbnail and opening make the same promise (RETENTION.md). If he builds a real sub-$100 version, swap in that number. That's the stronger budget hook.

**Option 3: playgroup stakes** (DefCat's "MY FRIENDS CAN'T BEAT IT" thumbnail, NLC's "DESTROYING My Group")
- **Title:** "My Friends Keep Losing to a Pile of Cabbages"
- **Thumbnail:** "THEY LOST TO CABBAGES", with a card fan and a Food-token pile.
- It's supported by his real stories (the wall walk, the Karn scoop, "conceded out of respect").

**Avoid:**
- "Budget" in the title at $214.
- A commander-name-only title ("The Cabbage Merchant Deck Tech"). DefCat's commander-named titles sit at his median, and the set is 10 months old, so NLC's "first on a new commander" advantage is gone.
- A wordless thumbnail (Tke6, his lowest).
