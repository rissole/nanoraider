# NanoRaider - Prototype Scope Document

## Purpose

This document defines the **Minimum Viable Prototype (MVP)** to test core design assumptions. The goal is to build the smallest possible version that validates:

1. **Is energy-gated planning fun?**
2. **Do dual resource trade-offs (energy + time) create meaningful decisions?**
3. **Does death feel educational rather than frustrating?**
4. **Is energy meta-progression compelling enough for repeat runs?**
5. **Does the energy system create satisfying session flexibility?**

---

## Prototype Goals

### Primary Goal
Validate the core loop: **Play → Die → Discover Evolution → Collect Them All**

The #1 question to answer: **Does evolution discovery feel rewarding?** and **Do players want to collect all evolutions?**

### Success Criteria
- Playtesters complete 2+ full character runs (18 in-game days each)
- **70%+ report evolution discovery is "exciting" or "very exciting"**
- **Players immediately plan next run to unlock different evolution**
- **Players understand prerequisite evolutions** (e.g., "I need Berserker + Scholar to unlock Raid Legend")
- **Players excited to unlock new evolution paths** ("I want to try for Merchant next!")
- **Death reveals feel like discovery, not failure** ("I can't wait to see what evolution I unlocked!")
- Players understand death = progression (+5 energy + AP + evolution unlock)
- Players report energy system creates "one more run" appeal
- Session length averages 5-10 minutes OR players optionally play 15-30 min sessions (flexibility validated)
- Energy feels rewarding (not punishing) to earn
- **Collection screen (Pokédex UI) drives engagement** (players check it frequently)

### Failure Signals
- Players abandon before completing first run
- **Evolution reveal feels underwhelming or confusing**
- **Players don't understand prerequisite system** ("Why can't I unlock Raid Legend?")
- **Players don't care about collecting all evolutions** (no collection motivation)
- Planning feels tedious or meaningless
- Death feels punishing/unfair despite energy + evolution rewards
- Energy feels like a paywall (even though it's not)
- Unclear what to do next
- Energy regeneration feels too slow/fast
- **Evolution unlocks feel random rather than tied to playstyle**

---

## MVP Feature Set

### Phase 1: Core Loop (Weeks 1-3)

**Absolutely Essential:**

1. **Energy System (CRITICAL)**
   - Energy bar UI (current/max energy displayed prominently)
   - Energy regeneration (1 per 10 min, runs in background)
   - Base 50 max energy for new players
   - Energy cost shown for each activity
   - Running total as player plans ("30/50 energy remaining")
   - "Not enough energy" state (grayed out activities)
   - Visual: Energy bar at top of screen, always visible

2. **Hero Creation**
   - Name your hero
   - Basic pixel art character
   - 3 nurture choices (binary) that determine class archetype
   - Visual: Simple form UI

3. **Personality Stat Tracking (CRITICAL - HIDDEN)**
   - Track 6-8 hidden stats during gameplay: Aggression, Wisdom, Greed, Cunning, Patience, Recklessness, etc.
   - Every activity increments specific stats (combat → Aggression, study → Wisdom, gold farming → Greed)
   - Players CANNOT see these stats (hidden)
   - Stats determine which evolution unlocks on death
   - Visual: NO UI (completely hidden), only revealed on death screen

4. **Daily Planning UI**
   - Drag-and-drop schedule builder
   - 24-hour timeline
   - 4 activity types (Quest 10 energy, Dungeon 15 energy, Farm Gold 8 energy, Study Boss 12 energy)
   - Projected outcomes shown (estimated XP, gold, loot %, **energy cost**)
   - Energy budget constraint (can't plan more activities than energy allows)
   - Visual: Calendar-like interface with energy costs prominent

5. **Activity Execution**
   - Confirm schedule → deduct energy → instant resolve (no animation for MVP)
   - **Track personality stats based on activity type** (e.g., high-risk dungeon → +Aggression, study → +Wisdom)
   - RNG roll for loot drops
   - Text-based results screen
   - Energy cost deducted after execution
   - Visual: Simple results popup showing energy spent

6. **Hero State**
   - **Current/Max Energy** (displayed prominently)
   - **Personality Stats (HIDDEN)** - not shown in UI
   - Level (1-30)
   - Age (In-Game Days 1-18)
   - 4 gear slots (Weapon, Chest, Helmet, Boots)
   - Gold amount
   - Visual: Character sheet screen with energy bar

7. **Content (Minimal - Evolution Testing)**
   - 2 zones (Greenhollow, Shadowspire)
   - 2 dungeons (Scholomance 15 energy - Scholar evolution, Blackrock Depths 15 energy - Berserker evolution)
   - 1 raid boss (Molten Fury 30 energy - requires study for Scholar)
   - 8 gear items total (2 per slot, green and blue rarity)
   - **Study Boss activity (12 energy, 2h time) - tracks Wisdom stat**
   - **Farm Gold activity (8 energy, 2h time) - tracks Greed stat**
   - Visual: Text-based content descriptions with energy costs

8. **Evolution System (CRITICAL - NEW)**
   - **3 Tier 1 Evolutions:**
     - **Berserker** (high Aggression stat, high-risk combat)
     - **Merchant** (high Greed stat, gold farming)
     - **Scholar** (high Wisdom stat, study time)
   - **1 Tier 2 Evolution:**
     - **Raid Legend** (requires Berserker + Scholar prerequisites unlocked in previous runs, must defeat Molten Fury)
   - Evolution unlock logic: Check personality stats on death, determine which evolution unlocked
   - **Evolution unlocks persist across runs** (saved in LocalStorage)
   - Visual: Evolution data stored, revealed on death screen

9. **Death System (UPDATED)**
   - Combat death (RNG-based on gear)
   - Old age death (In-Game Day 16+)
   - **Death screen showing:**
     - Legacy stats (XP, gold, level, etc.)
     - **+5 Max Energy notification (big celebration!)**
     - **EVOLUTION REVEAL (Pokédex-style)** - "You unlocked BERSERKER evolution!"
     - **Why you unlocked it** - "You spent 60% of your time in combat (Aggression: High)"
     - **What bonuses it gives** - "Knowledge Transfer: Future runs start with +10% damage"
     - **What it's a prerequisite for** - "Berserker unlocks: Raid Legend, Gladiator, Weapon Master"
     - **Hint for next run** - "You were close to Scholar! Try more study sessions next time."
   - Visual: Rich death screen with evolution reveal as centerpiece

10. **Collection Screen (POKÉDEX UI - CRITICAL)**
    - **Main menu option: "Evolution Collection"**
    - Shows all evolutions (5 total in MVP: 3 Tier 1 + 1 Tier 2 + 1 locked)
    - Unlocked evolutions show full details (bonuses, prerequisites, how to unlock)
    - Locked evolutions show silhouette + hint ("Requires high combat focus")
    - Shows prerequisite tree (Berserker + Scholar → Raid Legend)
    - Shows collection progress: "3/5 Evolutions Unlocked"
    - Visual: Grid layout, Pokédex-style, with locked/unlocked states

11. **Knowledge Transfer System**
    - When you unlock an evolution, it grants permanent bonuses
    - **Berserker:** +10% damage on all future runs
    - **Merchant:** Start with +50 gold on all future runs
    - **Scholar:** Start with +5% boss knowledge on all future runs
    - **Raid Legend:** +20% damage and +10% boss knowledge on all future runs
    - Bonuses stack (if you unlock all 3 Tier 1, you get all 3 bonuses)
    - Visual: Displayed in collection screen and character creation

12. **Meta-Progression (UPDATED)**
    - **+5 Max Energy per death** (automatic, celebrated)
    - **Evolution unlock per death** (automatic if conditions met, celebrated)
    - Achievement Points earned from death
    - 2 AP unlocks: "+10 Max Energy (50 AP)" and "Start with 100g (500 AP)"
    - Boss knowledge persists (only 1 boss, so simple)
    - Visual: Upgrade menu showing energy capacity growth + evolution collection progress

**Technical Implementation:**
- **Platform:** Web-based (HTML/CSS/JS) for rapid iteration
- **Data:** JSON for all content (easy to tweak)
- **Art:** Placeholder pixel art / text-based
- **No backend:** LocalStorage for persistence (includes energy state, last login timestamp for regen)
- **Energy System:** Background timer calculates regeneration based on time elapsed since last session

**Critical Path for Energy:**
1. Energy state (current, max, last update timestamp)
2. Regeneration formula: `min(max, current + (minutes_elapsed / 10))`
3. Activity cost validation before execution
4. Energy UI updates in real-time
5. Death rewards (+5 max energy)

**Time Estimate:** 2-3 weeks for solo developer (energy system adds ~2-3 days)

---

### Phase 2: Polish & Feedback (Weeks 4-5)

**If Phase 1 tests well, add:**

1. **Visual Improvements**
   - Character sprite shows equipped gear
   - Simple animations for activity execution
   - Loot drop particles/effects
   - UI polish (icons, colors, responsive design)

2. **Content Expansion**
   - +2 zones (6 total)
   - +2 dungeons (4 total)
   - +1 raid boss (2 total)
   - +12 gear items (20 total)

3. **System Depth**
   - Consumables (2 types: Health Potion, DPS Elixir)
   - Profession system (Alchemy only)
   - Boss study mechanic (2h activity, increases survival %)

4. **Better Feedback**
   - Tooltips explaining mechanics
   - Tutorial messages for first-time players
   - Progress bars and visual indicators

**Time Estimate:** 1-2 weeks

---

### Phase 3: Full MVP (Weeks 6-8)

**If Phase 2 validates, build toward full mobile demo:**

1. **Complete Content**
   - All 6 zones
   - All 8 dungeons
   - All 5 raid bosses
   - Full gear progression (gray → green → blue → purple)

2. **Complete Systems**
   - All activity types (Travel, Craft, etc.)
   - Full aging system (stat modifiers, reward bonuses)
   - Random events (5-10 event types)
   - Mentor system (choose legacy bonus)

3. **Achievement System**
   - 10 victory achievements
   - 10 failure achievements
   - 5 milestone achievements
   - AP spending menu

4. **Mobile Optimization**
   - Touch controls
   - Responsive layout
   - Offline support (PWA)
   - Daily notification system

**Time Estimate:** 2-3 weeks

---

## What to Cut for MVP

### Definitely Out of Scope:

- **All 30 Evolutions** - **MVP tests with 5-8 evolutions only** (3-4 Tier 1, 1-2 Tier 2, rest locked)
- **Advanced Classes** - Stick to 3 archetypes (Warrior, Mage, Healer)
- **PvP Content** - Not core to loop validation
- **Seasonal Events** - Add later if successful
- **Cosmetics** - No portraits, UI themes, etc.
- **Social Features** - No leaderboards, sharing, guilds
- **Heroic Mode** - Normal difficulty only
- **Legendary Gear** - Purple BiS is endgame for MVP
- **Complex Professions** - Alchemy only, or skip entirely
- **Reputation System** - Not core to planning loop
- **Multi-language Support** - English only for testing
- **Tier 3 Evolutions** - Only test Tier 1 (basic) and Tier 2 (prerequisite) for MVP
- **Complex Evolution Trees** - Linear prerequisites only (no branching paths yet)

### Maybe Later (If Time Permits):

- **Mount System** - Nice QoL but not essential
- **Off-hand Gear Slot** - 4 slots enough for testing
- **Crafting Materials** - Consumables can be gold-bought
- **Zone Reputation** - Simplifies content
- **Day/Night Cycles** - Adds complexity without validating core
- **More Tier 2 Evolutions** - 1 is enough to test prerequisite system
- **Evolution Branching** - Simple linear prerequisites test the concept

---

## MVP Testing Plan

### Alpha Test (Phase 1)

**Testers:** 5-10 close friends/colleagues
**Duration:** 2 weeks (enough for 2-3 character runs - CRITICAL for testing evolution collection)
**Feedback Focus:**
- **MOST IMPORTANT: Does evolution discovery feel rewarding?**
- **Do players want to collect all evolutions?**
- **Do players understand prerequisite system?** (Can they explain why Raid Legend is locked?)
- Is planning intuitive?
- Are time trade-offs interesting?
- Does death feel fair?
- Would you play again immediately to unlock different evolution?

**Data to Track:**
- **Evolution unlock rate** (do players unlock 2+ evolutions in 2 weeks?)
- **Collection screen engagement** (how often do players check Pokédex UI?)
- **Run-to-run playstyle changes** (did players intentionally shift strategy for different evolution?)
- **Prerequisite understanding** (can players explain what they need to unlock Raid Legend?)
- Session length
- Completion rate (how many finish 1 run?)
- Time spent in planning vs reviewing
- Drop-off points (when do people quit?)
- **Death screen reaction** (excitement vs disappointment at evolution reveal)

**Critical Questions:**
1. "Did you understand which evolution you unlocked and why?"
2. "Did you immediately want to try for a different evolution?"
3. "Can you explain how to unlock Raid Legend?"
4. "Did the collection screen make you want to unlock all evolutions?"
5. "Did death feel like failure or discovery?"

### Beta Test (Phase 3)

**Testers:** 50-100 via Discord/Reddit (roguelike communities)
**Duration:** 3 weeks (enough for 3-5 character runs - test collection motivation)
**Feedback Focus:**
- **Do players want to complete the collection (unlock all evolutions)?**
- **Does prerequisite system make sense at scale?**
- **Is evolution variety satisfying?** (3-4 Tier 1 evolutions feel different enough?)
- Depth and replayability
- Meta-progression satisfaction (energy + evolutions)
- Content pacing (too fast/slow?)
- Mobile usability

**Data to Track:**
- **Evolution collection progress** (average evolutions unlocked per player after 3 weeks)
- **Prerequisite evolution attempts** (how many players try for Raid Legend after unlocking Berserker + Scholar?)
- **Run diversity** (do players try different strategies each run?)
- **Collection completion rate** (how many players unlock all 5-8 MVP evolutions?)
- Retention (daily logins over 3 weeks)
- Average runs per player
- Most popular evolution targets
- Achievement unlock rates
- **Knowledge transfer usage** (do bonuses stack and feel rewarding?)

**Critical Questions:**
1. "How many evolutions have you unlocked? Do you want to unlock them all?"
2. "Which evolution was most satisfying to unlock?"
3. "Did you understand how to unlock Tier 2 evolutions?"
4. "Did evolution bonuses (Knowledge Transfer) make future runs feel different?"
5. "Would you pay for cosmetic evolutions or new evolution packs?"

---

## Technical Architecture (MVP)

### Tech Stack Recommendation

**Frontend:**
- **Framework:** React or Svelte (component-based, reactive)
- **Styling:** TailwindCSS (rapid UI development)
- **State Management:** Zustand or Context API
- **Persistence:** LocalStorage (simple, no backend needed)

**Backend (Optional for Phase 3):**
- **If needed:** Firebase or Supabase (easy auth + cloud saves)
- **Analytics:** Google Analytics or Mixpanel (track usage)

**Deployment:**
- **Hosting:** Vercel or Netlify (free for MVPs)
- **Mobile:** PWA (Progressive Web App) before native app

### File Structure

```
/nanoraider
├── /design (these documents)
├── /src
│   ├── /components (UI components)
│   │   ├── EnergyBar.jsx (energy UI component)
│   │   ├── PlanningUI.jsx (activity planner)
│   │   ├── DeathScreen.jsx (UPDATED: evolution reveal + legacy/rewards)
│   │   ├── EvolutionCollection.jsx (NEW: Pokédex UI)
│   │   └── EvolutionReveal.jsx (NEW: celebration animation for unlock)
│   ├── /game (game logic, systems)
│   │   ├── energy.js (CORE: energy state, regeneration, costs)
│   │   ├── hero.js (UPDATED: hero state + personality stats tracking)
│   │   ├── activities.js (UPDATED: activity types + personality stat changes)
│   │   ├── loot.js (gear, drops, RNG)
│   │   ├── death.js (UPDATED: death triggers, +5 energy, evolution unlock logic)
│   │   ├── meta.js (UPDATED: achievements, unlocks, energy upgrades, evolution bonuses)
│   │   ├── evolutions.js (NEW: evolution unlock logic, prerequisite checks)
│   │   └── personalityStats.js (NEW: hidden stat tracking, thresholds)
│   ├── /data (JSON content)
│   │   ├── zones.json
│   │   ├── dungeons.json
│   │   ├── raids.json
│   │   ├── gear.json
│   │   ├── achievements.json
│   │   ├── energyConfig.json (base energy, regen rate, costs)
│   │   └── evolutions.json (NEW: all evolutions, prerequisites, bonuses, thresholds)
│   ├── /utils (helpers, calculations)
│   └── App.js (main game loop, energy tick, personality stat updates)
├── /public (assets, images)
└── package.json
```

---

## MVP Development Roadmap

### Week 1: Foundation + Energy + Personality Tracking
- Set up project structure
- **Implement energy system (state, regeneration, UI)**
- **Implement personality stat tracking (hidden)**
- Build hero creation flow
- Implement leveling system
- Create basic UI framework with energy bar
- **Create personality stat tracking system (6-8 hidden stats)**

### Week 2: Core Loop + Energy Integration + Stat Tracking
- Daily planning UI (drag-and-drop) with energy costs
- **Energy validation (can't plan activities without energy)**
- Activity execution logic (deduct energy)
- **Activity execution updates personality stats** (combat → Aggression, study → Wisdom, etc.)
- Results screen (show energy spent, hide personality stats)
- Basic loot drops
- **4 activity types that track different stats** (Dungeon = Aggression, Study = Wisdom, Gold Farm = Greed, Quest = Balanced)

### Week 3: Evolution System + Death Reveal
- **Evolution unlock logic (check personality stats on death)**
- **3 Tier 1 evolutions (Berserker, Scholar, Merchant)**
- **1 Tier 2 evolution (Raid Legend with prerequisites)**
- **Evolution data structure (thresholds, bonuses, prerequisites)**
- Death triggers (combat, old age)
- **Evolution reveal screen (Pokédex-style unlock)**
- **Show why evolution unlocked** (personality stat breakdown)
- Legacy/death screen with +5 energy celebration
- **Evolution bonuses (Knowledge Transfer)**

### Week 4: Collection Screen + Knowledge Transfer
- **Evolution Collection screen (Pokédex UI)**
- **Show all evolutions (locked/unlocked states)**
- **Prerequisite tree visualization** (Berserker + Scholar → Raid Legend)
- **Collection progress tracking** (3/5 unlocked)
- **Knowledge Transfer implementation** (bonuses from unlocked evolutions)
- **Hints for locked evolutions** ("Requires high combat focus")
- Achievement points system
- 2 meta-unlocks: "+10 Max Energy (50 AP)" and "Start with 100g (500 AP)"
- Energy growth visualization

### Week 5: Testing + Balancing
- **Alpha Test Launch** (CRITICAL: Test if evolution discovery feels rewarding)
- **Track evolution unlock rates**
- **Track collection screen engagement**
- Balance personality stat thresholds (too easy/hard to unlock?)
- Balance evolution bonuses (too weak/strong?)
- **Test prerequisite system clarity** (do players understand Raid Legend requirements?)
- Fix bugs from alpha feedback

### Week 6: Content & Polish
- Add 1-2 more Tier 1 evolutions (test variety)
- Add 1 more Tier 2 evolution (test prerequisite complexity)
- Visual improvements (animations, particles)
- **Evolution reveal animation polish** (make it feel like Pokédex moment)
- Tooltip system
- **Hints for how to unlock evolutions** (in collection screen)

### Week 7: Iteration
- Fix alpha feedback issues
- **Refine evolution unlock thresholds** based on data
- Balance tuning (drop rates, death %, XP curves)
- Add consumables & professions
- Better tutorial flow
- **Add "Almost unlocked" hints** on death screen (e.g., "You were 10% away from Scholar!")

### Week 8-9: Expansion
- **Test full evolution set** (5-8 evolutions total)
- Complete achievement system
- Random events (tied to personality stats)
- **Evolution-specific random events** (Berserker gets combat events, Merchant gets trade events)
- Mentor system (grants evolution bonuses)

### Week 10: Mobile Prep + Beta Launch
- Mobile-responsive design
- Touch controls
- PWA setup (offline, notifications)
- **Evolution collection screen mobile optimization**
- **Beta Test Launch** (CRITICAL: Test if players want to collect all evolutions)

---

## Key Metrics to Track

### Engagement Metrics
- **Session Length:** Target 5-10 min avg
- **Sessions per Day:** Target 1-2
- **Retention Day 7:** Target >50%
- **Retention Day 14:** Target >30%

### Progression Metrics
- **Average Run Length:** Target 10-14 days
- **Runs per Player:** Target 3+ in first month
- **Death Causes:** Track combat vs old age vs exhaustion
- **Victory Rate:** Target 10-20% (should be hard but achievable)

### Economic Metrics
- **Gold Earned vs Spent:** Balance check
- **Mount Purchase Rate:** Indicates planning sophistication
- **Consumable Usage:** Indicates risk management

### Meta Metrics
- **Achievement Points Earned:** Track progression speed
- **Most Popular Unlocks:** Indicates what players value (expect energy upgrades to dominate)
- **Boss Knowledge Accumulated:** Shows learning curve

### Energy Metrics (CRITICAL TO TRACK)
- **Max Energy per Player:** Track growth over runs (50 → 100+ validates meta-progression)
- **Energy Spending Patterns:** What activities consume most energy (dungeons vs quests vs study)
- **Sessions per Energy Refill:** How often do players return (target: 2-3x per day)
- **"Out of Energy" Frustration:** Track player feedback when energy runs out (should feel "excited to return" not "frustrated can't play")
- **Energy Upgrade Purchase Rate:** How quickly do players buy +10 energy upgrades with AP
- **Death Reaction to +5 Energy:** Do players celebrate or ignore this reward

### Evolution Metrics (MOST CRITICAL - THE CORE LOOP)
- **Evolution Unlock Rate:** Average evolutions unlocked per player (target: 2+ in first week, 4+ in first month)
- **Collection Screen Engagement:** How often do players open Pokédex UI (target: 2+ times per session)
- **Evolution Discovery Excitement:** Player feedback on death screen reveals (target: 80%+ positive reactions)
- **Prerequisite Understanding:** Can players explain how to unlock Tier 2 evolutions (target: 70%+ understand)
- **Playstyle Diversity:** Do players change strategies between runs (target: 60%+ intentionally shift)
- **"Almost Unlocked" Impact:** When shown "close to unlocking X", do players try for it next run (target: 50%+ do)
- **Collection Completion Motivation:** % of players who express desire to unlock all evolutions (target: 60%+)
- **Knowledge Transfer Usage:** Do evolution bonuses make runs feel different (target: 70%+ notice impact)
- **Most Popular Evolutions:** Which evolutions are unlocked most/least frequently
- **Prerequisite Evolution Success Rate:** % of players who successfully unlock Raid Legend after getting prerequisites (target: 40%+)
- **Evolution Reveal vs Energy Reward:** Which feels more rewarding on death (expect evolution > energy)

---

## Risk Mitigation

### Risk: Energy feels like a paywall (CRITICAL)
**Mitigation:**
- **Always show energy as a reward, not a gate**
- Celebrate +5 energy on death with animation/sound
- Show progression graph (50 → 55 → 60 → ... → 200+)
- Frame as "capacity building" not "gating"
- Ensure energy regenerates fast enough (1 per 10 min = full bar in ~8h overnight)
- NO energy refill IAP in MVP (avoid pay-to-win perception)

### Risk: Energy regeneration too slow/fast
**Mitigation:**
- Make regen rate configurable (easy to tweak in testing)
- Default: 1 per 10 min (50 energy = 8.3h full refill)
- If too slow: Increase to 1 per 5 min
- If too fast: Decrease to 1 per 15 min
- Track "sessions per day" metric to validate

### Risk: Planning is tedious
**Mitigation:**
- Add "Quick Plan" templates (auto-fill common schedules)
- Show projected outcomes clearly (reduce analysis paralysis)
- Keep activity types to 4-5 max in MVP
- Energy budget actually simplifies planning (hard constraint)

### Risk: RNG feels unfair
**Mitigation:**
- Display drop rates transparently
- Add "smart loot" (favor worst slots)
- Ensure preparation can mitigate 80%+ of death risk

### Risk: Death is frustrating
**Mitigation:**
- **Always award +5 max energy on death (permanent, immediate, celebrated)**
- Always award AP on death (feels like double progression)
- Show "what you learned" on death screen
- Show energy progression chart ("You've grown from 50 to 75 max energy!")
- Legacy bonuses make next run easier immediately
- Frame death as "graduation" not "game over"

### Risk: Scope creep
**Mitigation:**
- Ruthlessly cut features not in Phase 1
- Use placeholders for art/content (iterate on fun, not polish)
- Set hard deadlines (1 week per phase)

---

## Success Definition

**MVP is successful if:**

1. **Playtesters complete 2+ runs** (validates core loop)
2. **70%+ want to play more** (validates appeal)
3. **EVOLUTION DISCOVERY FEELS REWARDING** (validates THE core loop)
4. **PLAYERS WANT TO COLLECT ALL EVOLUTIONS** (validates collection motivation)
5. **PLAYERS UNDERSTAND PREREQUISITE SYSTEM** (validates Tier 2 mechanics)
6. **Death feels like discovery, not failure** (validates roguelike + collection design)
7. **Planning is satisfying** (validates core mechanic)
8. **Meta-progression is compelling** (validates long-term engagement: energy + evolutions)
9. **Collection screen drives engagement** (validates Pokédex UI)
10. **Knowledge Transfer makes runs feel different** (validates evolution bonuses)

**If successful, proceed to:**
- **Expand to 30 evolutions** (full collection experience)
- **Add Tier 3 evolutions** (complex prerequisites)
- **Add evolution branching paths** (choose your evolution specialization)
- Full production (art, sound, polish)
- Mobile native app (iOS/Android)
- **Monetization design** (cosmetic evolutions, new evolution packs, NOT pay-to-win)
- Community building (Discord, socials)
- **Evolution leaderboards** (who collected all first)

**If unsuccessful, iterate on:**
- **Evolution unlock clarity** (do players understand why they unlocked X?)
- **Collection motivation** (do players care about completing the Pokédex?)
- **Prerequisite system** (too confusing? too simple?)
- **Evolution bonuses** (too weak? too strong? not impactful enough?)
- Core loop adjustments (simplify planning?)
- Death system (too punishing despite evolution reveal?)
- Meta-progression (not rewarding enough?)
- Content pacing (too fast/slow?)

---

## Next Steps After Design Phase

1. **Create Prototype Backlog**
   - Break Phase 1 into 2-week sprint tasks
   - Prioritize features by validation value

2. **Set Up Dev Environment**
   - Initialize React/Svelte project
   - Set up TailwindCSS
   - Create data structure (JSON schemas)

3. **Build Core Systems First**
   - Hero state management
   - Activity resolution logic
   - Loot drop algorithms
   - Death triggers

4. **UI Second**
   - Wire up systems to placeholder UI
   - Iterate on UX based on internal playtesting
   - Polish once mechanics feel good

5. **Content Last**
   - Use placeholder content while building systems
   - Populate real content once systems are locked
   - Balance content based on playtesting data

---

## Key Takeaway

**Start small, test early, iterate fast. The MVP exists to validate whether the core loop is fun—everything else can be added later. Focus on EVOLUTION COLLECTION as THE core loop, supported by the planning puzzle, dual resource trade-offs (energy + time), meaningful death (evolution reveal), and meta-progression (energy + evolutions). If those work, you have a game. If they don't, no amount of polish or content will save it.**

**THE MOST CRITICAL UNKNOWNS (in priority order):**

**1. Evolution Discovery (MOST CRITICAL)**
- Does evolution reveal on death feel rewarding (not punishing)?
- Do players immediately want to collect all evolutions?
- Do players understand prerequisite system (Tier 2 evolutions)?
- Does the collection screen (Pokédex UI) drive engagement?
- **If this fails, the entire game concept fails.**

**2. Energy System (SECOND MOST CRITICAL)**
- Does energy create "one more run" compulsion?
- Does it feel rewarding (not gating)?
- Does it enable flexible engagement (5 min sessions OR 30 min sessions)?
- **If this fails, retention fails.**

**3. Planning Loop (THIRD MOST CRITICAL)**
- Is planning satisfying (not tedious)?
- Do personality stats feel meaningful when revealed on death?
- Do players understand how their choices led to their evolution?
- **If this fails, the core loop feels random.**

**Build the smallest version that tests your riskiest assumptions first:**
1. **Evolution discovery** (assumption #1)
2. **Energy system** (assumption #2)
3. **Planning + personality tracking** (assumption #3)

**The game is NOT about gear optimization or raid progression. It's about collecting evolutions through playstyle discovery. Everything else supports that.**
