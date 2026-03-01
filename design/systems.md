# NanoRaider - Systems Design

## 1. Energy System

Energy is the primary meta-resource that gates **how many activities you can do per in-game day**. It creates the roguelike progression layer where advanced evolutions are literally impossible without sufficient energy capacity.

### Core Concept

**Energy = Actions per in-game day budget**

- Each activity costs energy (in addition to in-game time)
- **Energy refills to max at the start of each new in-game day**
- Max energy increases through death bonuses and evolution unlocks
- **Higher max energy = more activities per day = more accomplishments per 18-day lifespan**
- **Advanced evolutions mathematically impossible without high max energy**

**Critical Design Principle:**
- Energy is NOT about real-time gating (this is single-player, convenience is good)
- Energy is about **what you can accomplish in one hero's lifetime**
- 18-day lifespan × 50 energy/day = 900 total energy budget
- 18-day lifespan × 150 energy/day = 2,700 total energy budget
- **Ultimate Raider needs ~2,700 energy to achieve** → IMPOSSIBLE with base 50 energy/day

### Energy Costs

| Activity | Energy Cost | Notes |
|----------|-------------|-------|
| **Quest** | 10 | XP, gold, zone rep, story progress |
| **Dungeon Run** | 15 | Targeted loot farming, moderate death risk |
| **Raid Boss** | 30 | BiS loot, high death risk, weekly lockout |
| **Study Boss** | 12 | +2-5% survival for specific boss |
| **Farm Gold** | 8 | ~40-60g, no XP, safe |
| **Craft/Profession** | 10 | Create consumables or gear |
| **Random Event** | Varies | Triggered by world sim, optional |

**Rest = End Day Button:**
- Not an activity with a cost
- When done spending energy (or satisfied with day), click "Rest"
- Day ends, energy refills to max, character ages +1 day
- Like "End Turn" in Slay the Spire or Into the Breach

**Design Rationale:**
- High-value activities (dungeons, raids, study) cost more energy
- Low-intensity activities (quests, gold farming) cost less
- Rest is just the "end day" button (no cost, no time requirement)
- Raids are expensive (prevents spam-running endgame)
- **Energy costs create hard gates:** Can only do 3 dungeons per day at 50 energy (15 × 3 = 45), but 10 dungeons per day at 150 energy

### Energy Refill Model

**How Energy Works:**
- **Energy refills to max at the start of each new in-game day**
- Think of it like "daily quest energy" in other games, but for in-game days not real days
- Can spend all 50 energy on Day 1 activities, then Day 2 starts with full 50 energy again
- Real-time doesn't matter - play 1 day per session or 18 days in one sitting

**Base Stats (New Player):**
- Max Energy: 50 per in-game day
- Total energy budget over 18-day lifespan: **900 energy**

**What New Players Can Do Per Day:**
- Example Day 1: Quest (10) + Quest (10) + Dungeon (15) + Dungeon (15) = 50 energy
- That's ~4-5 activities per day
- **Over 18 days:** ~72-90 activities total in hero's lifetime

**Veteran Stats (150 max energy):**
- Max Energy: 150 per in-game day
- Total energy budget over 18-day lifespan: **2,700 energy**

**What Veterans Can Do Per Day:**
- Example Day 1: Quest (10) × 3 + Dungeon (15) × 6 + Study (12) × 2 = 144 energy
- That's ~12-15 activities per day
- **Over 18 days:** ~216-270 activities total in hero's lifetime

**Veteran Stats (275 max energy - fully upgraded):**
- Max Energy: 275 per in-game day
- Total energy budget over 18-day lifespan: **4,950 energy**
- **Over 18 days:** ~400+ activities total - can do EVERYTHING

### Session Flexibility (Real-Time Doesn't Matter)

**The Beauty of Per-Day Energy:**
- Real-time session length is irrelevant
- Play 1 in-game day per session or 18 in a marathon - your choice
- No pressure to "check in" - come back whenever you want
- Single-player game means convenience is king

**Session Examples:**

**Casual "One Day at a Time" (Any energy level):**
- Play 1 in-game day (5-10 minutes)
- Plan activities, execute, see results
- Come back tomorrow (real-time) and play Day 2
- Completes full hero run over 2-3 weeks real-time

**Active "Binge Player" (Any energy level):**
- Play 5-10 in-game days in one sitting (30-60 minutes)
- Marathon on weekend, complete most of hero's life
- Take a break for a week, finish the run later
- Completes full hero run over 1-2 weeks real-time

**Veteran "Full Run" (Any energy level):**
- Play all 18 in-game days in one marathon session (1-3 hours)
- See entire character arc from birth to death
- Perfect for speedrunners and evolution hunters
- Completes full hero run in single day real-time

**Energy Level Doesn't Change Session Style:**
- 50 energy/day: Just means fewer activities per in-game day
- 275 energy/day: Means more activities per in-game day
- Both can play 1 day or 18 days per session

### Evolution Energy Requirements (CRITICAL HARD GATES)

**This is the core progression system:** Advanced evolutions are **mathematically impossible** without sufficient max energy.

#### Tier 1 Evolutions (Achievable with 50-70 energy/day)

**Berserker (Combat-focused):**
- Requirements: Level to 30, defeat 3+ dungeon bosses, high combat focus
- Energy needed:
  - Days 1-5: Leveling (10 energy/day × 5 = 50 energy)
  - Days 6-12: Dungeon farming (15 energy × 3 dungeons/day × 7 days = 315 energy)
  - **Total: ~365 energy over 12 days**
  - **50 energy/day:** 12 days × 50 = 600 total → **ACHIEVABLE** ✅

**Scholar (Knowledge-focused):**
- Requirements: Study 3+ raid bosses to 50%+ knowledge each
- Energy needed:
  - Days 1-5: Leveling (50 energy)
  - Days 6-15: Heavy studying (12 energy × 4 sessions/day × 10 days = 480 energy)
  - **Total: ~530 energy over 15 days**
  - **50 energy/day:** 15 days × 50 = 750 total → **ACHIEVABLE** ✅

**Merchant King (Economic-focused):**
- Requirements: Accumulate 2,500+ gold
- Energy needed:
  - Days 1-5: Leveling (50 energy)
  - Days 6-15: Gold farming (8 energy × 5 sessions/day × 10 days = 400 energy)
  - **Total: ~450 energy over 15 days**
  - **50 energy/day:** 15 days × 50 = 750 total → **ACHIEVABLE** ✅

#### Tier 2 Evolutions (Need 100-120 energy/day)

**Raid Legend (Defeat 4/5 raid bosses):**
- Prerequisites: Berserker + Scholar evolutions already unlocked
- Energy needed:
  - Days 1-5: Leveling (10 energy/day × 5 = 50 energy)
  - Days 6-10: Dungeon farming for gear (15 energy × 6/day × 5 days = 450 energy)
  - Days 11-14: Study 4 raid bosses (12 energy × 5 sessions × 4 bosses = 240 energy)
  - Days 15-18: Attempt 4 raid bosses (30 energy × 4 = 120 energy)
  - **Total: ~860 energy over 18 days**
  - **50 energy/day:** 18 days × 50 = 900 total → **BARELY POSSIBLE** ⚠️
  - **100 energy/day:** 18 days × 100 = 1,800 total → **COMFORTABLE** ✅

**Master Crafter (Profession mastery):**
- Prerequisites: Merchant King + Scholar evolutions already unlocked
- Energy needed:
  - Days 1-5: Leveling (50 energy)
  - Days 6-15: Heavy crafting + material farming (10 craft + 15 dungeon × 3 = 55/day × 10 days = 550 energy)
  - Days 16-18: Final crafts (10 energy × 5/day × 3 days = 150 energy)
  - **Total: ~750 energy over 18 days**
  - **50 energy/day:** 18 days × 50 = 900 total → **BARELY POSSIBLE** ⚠️
  - **100 energy/day:** 18 days × 100 = 1,800 total → **COMFORTABLE** ✅

#### Tier 3 Evolutions (Need 150-200+ energy/day)

**Ultimate Raider (Defeat ALL 5 raid bosses):**
- Prerequisites: Must have Raid Legend + Master Crafter + Scholar + Treasure Hunter unlocked
- Energy needed:
  - Days 1-3: Speed leveling to 30 (10 energy × 4/day × 3 = 120 energy)
  - Days 4-6: Craft epic weapon using Master Crafter blueprints (10 energy × 5/day × 3 = 150 energy)
  - Days 7-10: Farm dungeons for epic materials + remaining gear (15 energy × 8/day × 4 days = 480 energy)
  - Days 11-14: Study ALL 5 raid bosses intensively (12 energy × 8 sessions × 5 bosses = 480 energy, spread over 4 days = 120/day)
  - Days 15-18: Attempt all 5 raid bosses (30 energy × 5 = 150 energy) + backup dungeon runs if failures (15 energy × 10 = 150 energy)
  - **Total: ~1,530 energy over 18 days**
  - **50 energy/day:** 18 days × 50 = 900 total → **IMPOSSIBLE** ❌
  - **100 energy/day:** 18 days × 100 = 1,800 total → **BARELY POSSIBLE** ⚠️
  - **150 energy/day:** 18 days × 150 = 2,700 total → **COMFORTABLE** ✅

**Perfect Run (All bosses + 5000g + Day 18+):**
- Prerequisites: Ultimate Raider + Merchant King + Death Defier + Speed Demon
- Energy needed: Similar to Ultimate Raider BUT also need heavy gold farming
  - Ultimate Raider requirements: 1,530 energy
  - Gold farming for 5000g: (8 energy × 10 sessions = 80 energy per day × 10 days = 800 energy)
  - **Total: ~2,330 energy over 18 days**
  - **150 energy/day:** 18 days × 150 = 2,700 total → **BARELY POSSIBLE** ⚠️
  - **200 energy/day:** 18 days × 200 = 3,600 total → **COMFORTABLE** ✅

**Key Insight:**
- **Tier 1 evolutions:** Designed for 50-70 energy/day (new players)
- **Tier 2 evolutions:** Designed for 100-120 energy/day (10-15 runs completed)
- **Tier 3 evolutions:** Designed for 150-200+ energy/day (20-30+ runs completed)
- **This creates natural progression:** You MUST collect Tier 1 evolutions (which grant energy bonuses) before attempting Tier 2, and MUST collect Tier 2 before attempting Tier 3

### Energy as Progression Gate (Not Engagement Hook)

**Energy is about WHAT you can achieve, not WHEN you play:**
- More max energy = more complex evolutions accessible
- Natural progression: Unlock Tier 1 → Get energy bonuses → Unlock Tier 2 → Get more energy → Unlock Tier 3
- **Evolution collection IS the engagement driver** ("I need to unlock Master Crafter so I can attempt Ultimate Raider")
- Energy is the **mechanical gate** that enforces evolution progression

**Why return to the game?**
- Want to attempt next evolution in your collection
- Ready to start new hero run with more energy capacity
- New strategy to try based on unlocked evolution bonuses
- "One more run" to unlock that next Tier 2 evolution

**Natural stopping points:**
- Completed an in-game day (satisfying milestone)
- Achieved a goal (got evolution unlock, got gear drop)
- Death (character run ended, evolution revealed)
- Satisfied with session length (no artificial pressure)

**No FOMO (Fear of Missing Out):**
- No real-time pressure whatsoever
- No time-limited events (all content always available)
- Play at your own pace - single player game
- Take a week off, come back, nothing changed
- Energy refills per in-game day, not real-time

---

## 2. Personality & Evolution System

Heroes develop unique personalities based on their MMO choices, determining their evolution path upon death. This creates meaningful replayability and long-term progression.

### Core Concept

**Evolution = Your character's legacy based on how they lived**

- Personality stats track behavior patterns throughout the run
- Upon death, personality determines evolution type
- Each evolution unlocks permanent bonuses and knowledge transfer
- 30+ evolution types across 3 tiers create deep replayability

### Personality Stats

Each hero has hidden personality metrics that track their playstyle:

| Personality Axis | Low End | High End | Tracking |
|-----------------|---------|----------|----------|
| **Combat Style** | Cautious | Reckless | Risk-taking in boss fights, consumable usage |
| **Social Style** | Solo | Social | Group content participation, event engagement |
| **Economic Focus** | Combat | Economic | Gold farming vs dungeon running ratio |
| **Exploration** | Focused | Wanderer | Zone diversity, random event participation |
| **Preparation** | Improviser | Methodical | Study sessions, consumable stockpiling |
| **Ambition** | Survivor | Glory-Seeker | Raid attempts, high-risk content engagement |

### How Choices Affect Personality

**Combat Style Examples:**
- Use consumables before every dungeon = Cautious +5
- Attempt raid with <30% knowledge = Reckless +10
- Skip studying and dive into boss fights = Reckless +8

**Social Style Examples:**
- Accept "Help another player" events = Social +5
- Join spontaneous dungeon groups = Social +7
- Solo all content, ignore events = Solo +5

**Economic Focus Examples:**
- 3+ gold farming sessions = Economic +10
- Craft consumables vs buying = Economic +5
- Spend most time in dungeons/raids = Combat +8

**Exploration Examples:**
- Visit 5+ different zones = Wanderer +10
- Complete all quests in one zone = Focused +5
- Participate in 3+ random events = Wanderer +7

**Preparation Examples:**
- Study boss 5+ times before attempt = Methodical +10
- Stock 10+ consumables before raid = Methodical +8
- Wing it with minimal prep = Improviser +5

**Ambition Examples:**
- Attempt first raid by Day 8 = Glory-Seeker +10
- Play conservatively, survive to Day 15+ = Survivor +10
- Kill 3+ raid bosses in one run = Glory-Seeker +15

### Evolution Determination Formula

Upon death, the game calculates evolution based on:

```
Primary Personality = Highest tracked stat (must be 30+)
Secondary Personality = Second-highest stat (must be 20+)
Milestone Achievements = Specific accomplishments (killed raid boss, reached Day 15, etc.)
Evolution Tier = Based on total personality points + achievement count
```

**Example Calculation:**
- Reckless: 45
- Social: 15
- Combat: 35
- Wanderer: 20
- Methodical: 10
- Glory-Seeker: 40

**Result:** Glory-Seeker (40) + Combat (35) + "Killed 2 raid bosses" = **Raid Legend Evolution** (Tier 2)

### Evolution Tier Examples

**Tier 1: Foundation Evolutions (5-10 energy bonus)**

Single personality dominant (40+ points), basic achievements

- **Berserker** - Reckless + Combat dominant, killed 3+ bosses
  - Bonus: +8 max energy, +5% starting combat stats
  - Knowledge Transfer: 10% boss knowledge for all bosses killed

- **Merchant King** - Economic dominant, earned 2000+ total gold
  - Bonus: +10 max energy, start with 300g
  - Knowledge Transfer: Unlock all vendors (discounts persist)

- **Scholar** - Methodical dominant, studied 5+ bosses
  - Bonus: +8 max energy, +10% study efficiency
  - Knowledge Transfer: 2x boss knowledge transfer (20% instead of 10%)

- **Explorer** - Wanderer dominant, visited 7+ zones
  - Bonus: +10 max energy, start with mount
  - Knowledge Transfer: All zones unlocked for future heroes

**Tier 2: Specialist Evolutions (10-15 energy bonus)**

Two personalities balanced (35+ each), significant achievements, requires at least 1 Tier 1 evolution unlocked

- **Raid Legend** - Glory-Seeker + Combat, killed 4+ raid bosses
  - Bonus: +15 max energy, +10% raid loot chance
  - Knowledge Transfer: +25% boss knowledge for raid bosses
  - Prerequisite: Berserker or Glory-Seeker Tier 1 evolution unlocked

- **Master Crafter** - Methodical + Economic, mastered 2 professions
  - Bonus: +12 max energy, start with profession unlocked
  - Knowledge Transfer: All recipes unlocked, blueprints persist
  - Prerequisite: Merchant King or Scholar evolution unlocked

- **Treasure Hunter** - Wanderer + Economic, looted 15+ blue items
  - Bonus: +15 max energy, +15% loot drop chance
  - Knowledge Transfer: Smart loot weights doubled
  - Prerequisite: Explorer evolution unlocked

- **Speed Demon** - Reckless + Glory-Seeker, killed raid boss before Day 7
  - Bonus: +12 max energy, +10% activity speed
  - Knowledge Transfer: Skip to level 15 on new heroes
  - Prerequisite: Berserker evolution unlocked

**Tier 3: Mastery Evolutions (30-50 energy bonus)**

Multiple high personalities, exceptional achievements, requires 2+ Tier 2 evolutions unlocked

- **Ultimate Raider** - All combat metrics high, killed all raid bosses
  - Bonus: +50 max energy, +20% all combat stats
  - Knowledge Transfer: 100% boss knowledge for all raid bosses
  - Prerequisite: Raid Legend + Speed Demon evolutions unlocked

- **Perfect Run** - Survived to Day 18+, full BiS gear, killed all bosses
  - Bonus: +40 max energy, +25% rewards permanently
  - Knowledge Transfer: Start with full blue gear set
  - Prerequisite: 3+ Tier 2 evolutions unlocked

- **Shapeshifter** - Balanced across all 6 personality axes (25+ each)
  - Bonus: +35 max energy, choose any Tier 1 bonus on new run
  - Knowledge Transfer: Flexible mentor system (pick 2 legacy bonuses)
  - Prerequisite: 4+ different Tier 1 evolutions unlocked

### Personality Visibility

**During Run:**
- Personality stats are hidden (no min-maxing pressure)
- Flavor text hints at personality ("Your hero feels bold today...")
- Post-death summary reveals full personality breakdown

**Between Runs:**
- Evolution collection shows unlocked evolution types
- Can review personality trends from past heroes
- Hints for locked evolutions ("Needs more methodical choices...")

---

## 3. Evolution Collection (Pokédex)

A memorial screen tracks all evolved heroes and provides completion goals.

### Collection Screen Layout

**Unlocked Evolutions:**
- Hero portrait with evolution name
- Death date and cause
- Personality breakdown
- Bonuses unlocked
- Lore description

**Locked Evolutions:**
- Silhouette with "???"
- Hint text: "Kill 4+ raid bosses with reckless playstyle"
- Tier indicator (so players know what's possible)
- Prerequisites if applicable

### Completion Tracking

**Progress Metrics:**
- Evolutions unlocked: 5/30+
- Tier 1: 3/12
- Tier 2: 1/12
- Tier 3: 0/6+
- Achievement: "Collected 10 evolutions" = +15 max energy

**Long-term Goals:**
- "All Tier 1 Evolutions" = +25 max energy
- "All Tier 2 Evolutions" = +50 max energy
- "Unlock Ultimate Raider" = +30 max energy
- "True Master: Unlock all evolutions" = +100 max energy

### Memorial Functionality

**Hero Archive:**
- View past heroes by evolution type
- Compare personality scores across runs
- Replay decision moments (what led to this evolution?)
- Share evolution unlocks with friends (social feature)

**Lore Unlocks:**
- Each evolution has backstory/description
- Tied to simulated MMO world (Berserker = legendary warrior archetype)
- Completionist reward: "Full Compendium" achievement

---

## 4. Knowledge Transfer System

What persists between runs depends on which evolutions you've unlocked.

### Base Knowledge Transfer (No Evolutions)

**Always Persists:**
- Boss knowledge percentage (0-100% per boss)
- Achievement points
- Energy upgrades purchased
- Gear codex (cosmetic collection)

**Mentor System (Pick 1):**
- Inherited gear (best item from previous hero)
- Knowledge boost (+10% to killed bosses)
- Starting gold (500g)
- Profession unlock
- Zone unlock

### Evolution-Based Knowledge Transfer

**Tier 1 Evolution Bonuses:**

- **Berserker** - 10% boss knowledge for all bosses killed (instead of mentor bonus)
- **Merchant King** - All vendors unlocked, 20% discount persists forever
- **Scholar** - 2x mentor knowledge boost (20% instead of 10%)
- **Explorer** - All zones unlocked, no travel time required on future heroes

**Tier 2 Evolution Bonuses:**

- **Raid Legend** - 25% boss knowledge for raid bosses (stacks with base)
- **Master Crafter** - All profession recipes unlocked, blueprints persist
  - Can craft items immediately on new heroes
  - Crafted gear quality +10%
- **Treasure Hunter** - Smart loot system weights doubled (upgrade slots 2x faster)
- **Speed Demon** - Start at level 15 on new heroes (skip early grind)

**Tier 3 Evolution Bonuses:**

- **Ultimate Raider** - 100% boss knowledge for all raid bosses
  - Effectively removes death RNG from raid encounters
  - Still requires gear/consumables
- **Perfect Run** - Start with full rare (blue) gear set
  - Immediately raid-ready
  - Can skip all dungeon farming
- **Shapeshifter** - Flexible mentor system (pick 2 legacy bonuses instead of 1)
  - Ultimate versatility
  - Tailored start for each run type

### Evolution Prerequisites for Complex Paths

**Example: Unlocking Ultimate Raider**

Prerequisites:
1. Must have unlocked Raid Legend evolution (Tier 2)
2. Must have unlocked Speed Demon evolution (Tier 2)
3. Must kill all 6 raid bosses in a single run
4. Must have Glory-Seeker + Combat personality scores 50+ each

**Why This Matters:**
- Can't rush to Tier 3 evolutions
- Requires mastery of multiple playstyles first
- Creates long-term progression arc (20-30+ runs)
- Ultimate Raider is the "endgame" evolution for combat-focused players

**Example: Unlocking Shapeshifter**

Prerequisites:
1. Must have unlocked 4+ different Tier 1 evolutions
2. Must have all 6 personality stats at 25+ in a single run
3. Must survive to Day 15+
4. Must complete 5+ random events in that run

**Why This Matters:**
- Rewards versatile playstyle
- Hardest evolution to unlock (requires balanced play)
- Ultimate flex for completionists
- Enables "perfect" future runs with max flexibility

### Stacking Knowledge Transfer

**Example Progression Arc:**

**Run 1-3:** No evolutions, using mentor system
- Mentor bonus: +10% knowledge for killed bosses

**Run 4:** Unlock Scholar (Tier 1)
- Mentor bonus now: +20% knowledge (2x)
- Faster boss knowledge accumulation

**Run 10:** Unlock Raid Legend (Tier 2)
- Base knowledge from kills: +20% (Scholar bonus)
- Raid boss knowledge: +25% (Raid Legend bonus)
- Combined: Raid boss knowledge grows 45% per kill

**Run 25:** Unlock Ultimate Raider (Tier 3)
- All raid bosses instantly at 100% knowledge
- Raids become "execution tests" not RNG
- Can focus on speedrunning/optimization

### Strategic Evolution Planning

**Players can optimize for:**

1. **Combat Path** - Berserker → Raid Legend → Ultimate Raider
   - Fastest raid progression
   - Best for players who love boss fights

2. **Economic Path** - Merchant King → Master Crafter → Perfect Run
   - Best for players who love optimization/crafting
   - Smoothest new run experience

3. **Exploration Path** - Explorer → Treasure Hunter → Shapeshifter
   - Most flexible/balanced
   - Best for completionists

4. **Speed Path** - Any Tier 1 → Speed Demon → Ultimate Raider
   - Fastest overall progression
   - Best for speedrunners

---

## 5. Raid Lockout System

Raids have weekly lockouts to create strategic tension and prevent spam-running endgame.

### Lockout Mechanics

**Weekly Lockout Rule:**
- Attempt any raid boss = locks THAT boss for 7 in-game days
- Can attempt other bosses during same in-game week
- Die to Boss 1 on Day 10? Can't retry until Day 17

**Strategic Tension:**
- "Am I ready or should I farm more?"
- With aging kicking in at Day 13+, late raid attempts have high stakes
- Forces players to prepare properly before attempts
- Creates meaningful "do or die" moments

**Example:**
- Day 9: Attempt Molten Fury (Boss 1), succeed!
- Day 10: Can't retry Molten Fury (locked), can attempt Boss 2
- Day 16: Molten Fury unlocked again, but you're aging now
- Day 17: Final chance before old age penalties get severe

---

## 6. Aging System

Heroes age based on in-game days completed, creating natural character arc and eventual end.

### Age Phases

| In-Game Days | Phase | Stat Modifier | Reward Modifier | Notes |
|--------------|-------|---------------|-----------------|-------|
| 1-5 | Young | +0% | +0% | Learning phase, low death risk |
| 6-9 | Prime | +5% all stats | +0% | Peak performance |
| 10-12 | Experienced | +0% | +10% rewards | Stats normalize, better loot |
| 13-15 | Aging | -10% physical stats | +25% rewards | Trade power for rewards |
| 16-18 | Elderly | -25% physical stats | +50% rewards | High risk, high reward |
| 19+ | Ancient | -40% physical stats | +100% rewards | Death risk each day |

**Key Point:** These are in-game days, not real-world days. A casual player might take 2 weeks to reach Day 10, while a veteran could reach it in 3 days.

### Aging Effects

**Physical Stats Decline:**
- Strength, Agility, Stamina decrease
- Intelligence, Wisdom unaffected (experience matters)
- Death risk in combat increases
- Rest requirement increases (+1h per phase after Experienced)

**Reward Bonuses:**
- Increased loot drop rates
- Higher gold from activities
- Bonus XP (if not max level yet)
- Better crafting outcomes

### Death from Old Age

Starting at Day 16 (Elderly):
- 5% chance of natural death per in-game day (after activities resolve)
- +5% each subsequent in-game day
- Triggers "Died of Old Age" achievement (peaceful ending)

**Design Intent:** Encourages aggressive play in late lifecycle. "I'm Day 15, I need to attempt this raid NOW before I'm too old."

---

## 7. Gear System

Inspired by WoW's slot-based gear progression with clear upgrade paths.

### Gear Slots (8 Total)

1. Helmet
2. Chest
3. Gloves
4. Legs
5. Boots
6. Weapon
7. Off-hand / Shield
8. Accessory (ring/necklace)

### Gear Rarity Tiers

| Rarity | Color | Item Power | Source |
|--------|-------|------------|--------|
| **Common** | Gray | 10 | Starting gear |
| **Uncommon** | Green | 25 | Quests, early dungeons |
| **Rare** | Blue | 50 | Dungeons (Pre-BiS) |
| **Epic** | Purple | 100 | Raids (BiS) |
| **Legendary** | Orange | 150 | Extreme endgame, meta unlocks |

**Total Item Power** = Sum of all 8 slots
- Minimum (all gray): 80
- Pre-BiS (all blue): 400
- BiS (all purple): 800
- Legendary (all orange): 1200 (near-impossible in one run)

### Gear Stats

Each piece has:
- **Primary Stat** (Strength, Agility, Intelligence, Stamina)
- **Secondary Stats** (Crit, Haste, Versatility, etc.)
- **Item Power** (determines effectiveness)

**Class Affinity:**
- Warriors want Strength + Stamina
- Mages want Intelligence + Crit
- Healers want Intelligence + Versatility

Early nurture choices shape stat priorities.

### Drop System

**Dungeon Loot:**
- Each dungeon has a loot table (4-6 items across slots)
- 30% chance per item per run
- RNG but targetable (farm specific dungeons for specific slots)

**Raid Loot:**
- Each boss drops 1-2 specific slots
- 50% chance per item per kill
- Weekly lockout = high stakes

**Smart Loot:**
- Game weights drops toward your worst slots
- But not guaranteed (RNG still matters)

**Example Dungeon Loot Table: Scholomance**
- Helmet (Blue) - 30% drop
- Gloves (Blue) - 30% drop
- Weapon (Blue) - 20% drop
- Accessory (Blue) - 20% drop
- Dark Runes (Crafting Mat) - 100% (always drops)

---

## 8. Character Progression

Heroes grow through multiple systems simultaneously.

### Leveling (XP System)

- Max level: 30
- Primary XP sources: Questing, dungeons
- Leveling opens access to new zones/content
- Typically reach max level by Day 5-6

**Level Gates:**
- Levels 1-10: Starter zones, basic quests
- Levels 11-20: Dungeons unlock, harder zones
- Levels 21-25: Elite zones, profession mastery
- Levels 26-30: Raid-ready, endgame content

### Class System (Nurture-Based)

Hero creation presents 3 scenario-based dilemmas that reveal class archetype through instinct rather than explicit stat selection. Each presents a concrete in-world situation with two plausible responses — no right answer, just a preference.

**Example dilemmas:**
- Mid-dungeon, overwhelmed: push for the boss or fall back?
- Guild veteran's advice: hit harder, or study the boss pattern?
- Found 300 gold: buy a weapon spike or stock consumables?

**Class Archetypes (resolved from choices):**
- **Warrior** (Tank): High survivability, slower farming
- **Mage** (DPS): High burst damage, fragile
- **Healer** (Support): Balanced, strong in all content; result of mixed instincts

**Class Flexibility:**
- 3 choices determine archetype (majority wins; tie → Healer)
- Hero name is randomly assigned at creation and editable before confirming
- Adds replayability without feeling like a stat screen

### Profession System

**Primary Professions (pick 2):**
- Alchemy (consumables: potions, elixirs)
- Blacksmithing (weapons, armor)
- Enchanting (gear enhancements)
- Herbalism (gather materials)
- Mining (gather materials)

**Progression:**
- Unlock via quest or gold payment
- Level up through crafting activities
- High-level recipes require rare materials from raids
- Can provide edge (self-crafted consumables save gold)

### Reputation System (Optional Depth)

Zones/factions have reputation:
- Unlocks better quest rewards
- Discounts on vendors
- Access to special dungeons
- Time investment (rep grinding vs other activities)

---

## 9. Death & Failure System

Permadeath is central, but failure teaches.

### Death Triggers

**Combat Death:**
- Failed dungeon run (based on gear + boss knowledge + RNG)
- Failed raid encounter (high risk, partially mitigated by prep)

**Old Age Death:**
- Random chance starting Day 16+
- Unavoidable eventually (creates urgency)

**Exhaustion Death:**
- Skip rest 4+ times consecutively
- Rare but preventable (teaches time management)

### Death Probability Formula

```
Death % = Base Risk - (Gear Score Modifier) - (Boss Knowledge) - (Consumable Bonus) + (Age Penalty) + RNG
```

**Example: Raid Boss Attempt**
- Base Risk: 60%
- Gear Score Modifier: -30% (solid Pre-BiS)
- Boss Knowledge: -15% (studied 7-8 times)
- Consumable Bonus: -10% (used potions)
- Age Penalty: +5% (Day 12)
- **Final Death Risk: 10%**
- RNG roll determines outcome

**Design Intent:**
- Players can mitigate risk but never eliminate it
- Preparation matters but isn't everything
- Creates tension even with good gear

### Failure States as Achievements

**Examples:**
- "First Death" - Die to your first boss
- "Greedy Death" - Die while already having 5+ blue items
- "Unprepared" - Die to raid boss with <20% knowledge
- "Speed Casualty" - Die before Day 5
- "Glorious Defeat" - Die to final raid boss

**Rewards:**
- Meta-progression points
- Unlocks new starting bonuses
- Collection/badge system

---

## 10. Meta-Progression System

Knowledge and unlocks persist between character runs. The evolution system (Sections 2-4) is the primary meta-progression driver, with additional layers below.

### Boss Knowledge (Permanent)

Each boss has a knowledge score (0-100%):
- Gain +2-5% per Study session
- Diminishing returns (early study = +5%, later = +2%)
- Persists forever across all characters
- Directly reduces death % in that encounter

**Example:**
- Ragnaros: 45% knowledge (studied across 3 previous characters)
- Every future character gets -45% death risk vs Ragnaros automatically

### Achievement Points (Persistent Currency)

Earned from:
- Completing character runs
- Reaching milestones (hit level 30, kill first raid boss)
- Failure achievements
- Collection achievements
- **Evolution unlocks** (major source)

**Spend on Unlocks:**
- **Energy Upgrades** (see Section 11 for full energy progression tree)
- **Evolution Collection Rewards** - Bonus energy for unlocking evolution tiers
- Start with mount (500 pts) - Reduces travel time
- Start at level 10 (1000 pts) - Skip early grind (or unlock Speed Demon evolution)
- +10% loot drop chance (750 pts) - Better RNG (or unlock Treasure Hunter evolution)
- Longer lifespan (+2 in-game days in Prime phase) (1500 pts)
- New class archetype unlocks (2000 pts) - Necromancer, Bard, etc.

**Note:** Many traditional meta-progression unlocks are now tied to evolution paths (see Section 4), creating more meaningful progression choices.

### Mentor System (Per-Run Bonus)

When a hero dies, choose 1 legacy bonus for next hero (or 2 if Shapeshifter evolution unlocked):

**Options:**
1. **Inherited Gear** - Start with best item from previous hero
2. **Knowledge Transfer** - +10% to all boss knowledge for bosses previous hero killed (20% if Scholar evolution unlocked)
3. **Starting Gold** - Begin with 500g
4. **Profession Mastery** - Instantly unlock profession previous hero mastered
5. **Zone Unlock** - Skip to zone previous hero died in

**Design Intent:**
- Eases early game after multiple runs
- Creates strategic choice (what does next hero need most?)
- Bittersweet connection between heroes
- **Evolution synergies** enhance mentor choices (Scholar doubles knowledge transfer, Shapeshifter allows 2 picks)

### Collection System (Long-term)

**Gear Codex:**
- Permanently record every unique item obtained
- 100+ items across all rarities
- Completionist goal across many runs

**Boss Bestiary:**
- Tracks every boss encountered and killed
- Lore entries unlock as knowledge increases
- "Seen all bosses" = long-term achievement

**Evolution Collection:**
- See Section 3 for full details
- 30+ evolution types to unlock
- Major source of achievement points and energy bonuses
- Primary long-term progression goal

---

## 11. Energy Meta-Progression

Increasing max energy is the primary roguelike progression layer. Each run makes you stronger by expanding your capacity to play.

### Permanent Energy Increases

**Run Completion Bonus:**
- **+5 max energy** per character death (automatic)
- First 10 runs = +50 max energy just from playing
- Encourages completing runs even if you "fail"
- Never feels like wasted time

**Evolution Bonuses (Primary Source):**
- See Section 2 for full evolution system details
- **Tier 1 Evolutions:** +5-10 max energy each
- **Tier 2 Evolutions:** +10-15 max energy each
- **Tier 3 Evolutions:** +30-50 max energy each
- **Collection Achievements:**
  - Unlock 10 evolutions: +15 max energy
  - All Tier 1 evolutions: +25 max energy
  - All Tier 2 evolutions: +50 max energy
  - Unlock Ultimate Raider: +30 max energy
  - True Master (all evolutions): +100 max energy

**Victory Bonuses (Achievements):**
- **First Raid Kill:** +10 max energy
- **Completionist:** +15 max energy
- **Wealthy Baron:** +10 max energy
- **Hardcore Survivor:** +20 max energy

**Note:** Speed Demon and Raid Legend are now evolution types (see Section 2) rather than standalone achievements.

### Achievement Point Energy Unlocks

**Tier 1: Small Boosts (50 AP each)**
- **+10 Max Energy**
- Repeatable 5x = +50 total max energy
- Affordable for new players
- Quick power spikes

**Tier 2: Medium Boosts (100 AP each)**
- **+25 Max Energy**
- Repeatable 3x = +75 total max energy
- Mid-game investment

**Tier 3: Large Boosts (250 AP each)**
- **+50 Max Energy**
- Repeatable 2x = +100 total max energy
- Long-term goal

**Tier 4: Quality of Life (500 AP)**
- **Double Regen Rate** - 1 energy per 5 min (instead of 10 min)
- Only purchasable once
- Doubles effective energy over time
- For active players who check in frequently

### Total Max Energy Potential

**New Player (0 AP spent, 0 runs):**
- Base: 50 energy

**Casual Player (10 runs, ~1500 AP spent):**
- Base: 50
- Run bonuses: +50 (10 runs × 5)
- AP purchases: +60 (Tier 1 boosts)
- Achievements: +30 (some victories)
- **Total: 190 max energy** (~12 activities per session)

**Veteran Player (30 runs, ~5000 AP spent):**
- Base: 50
- Run bonuses: +150 (30 runs × 5, capped)
- AP purchases: +225 (all tiers)
- Achievements: +80 (most victories unlocked)
- **Total: 505 max energy** (~35 activities per session)

**Notes:**
- Run bonus caps at 30 runs (+150 max)
- Prevents infinite scaling
- Veterans still have meaningful ceiling

### Energy Progression Curve

**Early Game (Runs 1-5):**
- Energy grows quickly (+5 per run)
- Can feel power increase immediately
- Unlocks longer play sessions
- Motivates "one more run"

**Mid Game (Runs 6-15):**
- Combining run bonuses + AP unlocks
- Start buying Tier 2-3 energy boosts
- Can complete multiple in-game days per session
- Unlocks new playstyles (marathon sessions)

**Late Game (Runs 16-30):**
- Approaching energy cap
- Focus shifts to achievement hunting
- Energy enables completionist goals
- Can speedrun entire character lifespans

**Endgame (Runs 30+):**
- Max energy reached
- Pure skill/optimization challenges
- Pursuing rare achievements
- Teaching new players strategies

### Energy as Monetization (Single-Player = Convenience is Fine)

**Since this is single-player, pay-for-convenience is perfectly acceptable.**

**Energy Refills (Consumable Purchase):**
- Refill current day energy: +50 energy ($0.99) - "Oops, ran out mid-day"
- Large refill: +150 energy ($2.99) - "Want to do more today"
- Full refill: Restore to max energy ($4.99) - "Marathon mode activated"
- **Use case:** Player has 150 max energy, used 100 today, has 50 left. Buys large refill → now has 200 energy for current day (50 + 150). Tomorrow resets to 150 max as normal.

**Permanent Upgrades (IAP):**
- +50 Max Energy (permanent): $4.99 - Direct power increase
- +100 Max Energy (permanent): $9.99 - Bigger power increase
- +200 Max Energy (ultimate): $19.99 - Skip straight to veteran energy levels
- **These stack with evolution bonuses** - Can buy your way to 275+ energy immediately

**Evolution Shortcuts (Controversial but Single-Player):**
- Unlock specific Tier 1 evolution: $4.99 - Skip the grind
- Unlock evolution bundle (3 Tier 1): $12.99 - Fast-track to Tier 2
- **Still need to ATTEMPT the evolutions** - buying unlocks the bonuses, but you still need to play

**Premium Pass ($9.99/month):**
- +100 temporary max energy while subscribed (removed when unsubscribed)
- Unlimited energy refills (once per in-game day)
- Cosmetic perks (special portraits, UI themes)
- Priority support

**Why This Works for Single-Player:**
- No competitive advantage over others (no PvP)
- Convenience, not pay-to-win (everyone can achieve same goals)
- Impatient players can pay, patient players can grind
- F2P path fully viable (AP + death bonuses grant energy)
- Premium players funding development = better game for everyone

### Why This Works

**Respects Player Autonomy:**
- More max energy = unlock more complex evolutions
- Energy is about progression gates, not time pressure
- Single-player = no guilt about paying for convenience
- Veterans can accomplish more per hero lifetime

**Creates "One More Run" Appeal:**
- Every death = permanent +5 energy per day
- Unlock evolution → gain energy bonus → attempt harder evolution
- **"I need 20 more energy/day to attempt Ultimate Raider"** = clear goal
- Failure still feels like progress

**Flexible Monetization:**
- Optional IAP for impatient players (buy +200 energy immediately)
- F2P players grind evolutions for energy bonuses
- Both paths lead to same endgame (Tier 3 evolutions)
- No predatory mechanics - single-player means no FOMO

**Hard Progression Gates:**
- Tier 1 evolutions: 50-70 energy/day (F2P achievable immediately)
- Tier 2 evolutions: 100-120 energy/day (need 10-15 runs OR $10 IAP)
- Tier 3 evolutions: 150-200+ energy/day (need 20-30 runs OR $20 IAP)
- **Ultimate Raider mathematically impossible without sufficient energy** = natural progression curve

---

## 12. Random Event System

Simulated MMO world creates emergent decisions.

### Event Types

**World Events (Passive):**
- "Guild recruiting for raid" - Flavor text, optional engagement
- "Player selling rare item in trade chat" - Opportunity to buy gear
- "Server maintenance tonight" - Forces rest period (positive constraint)

**Decision Events (Active):**
- "Help another player with quest?" - Cost time, gain rep or reward
- "Join spontaneous dungeon group?" - Unplanned run, could drop loot
- "Rare vendor in town (2h window)" - Divert from plan or ignore?

**Crisis Events (Rare):**
- "Guild needs emergency healer for raid" - High risk, high reward
- "PvP tournament today" - Unique rewards, skip planned activities
- "Server rollback deleted your loot" - Rare negative event (teaching moment)

### Event Frequency

- 1-2 events per day
- Weighted toward mid-game (Days 6-12) for peak decision complexity
- Early game (Days 1-5) = fewer events (learning period)
- Late game (Days 13+) = high-stakes events only

---

## 13. Consumable & Economy System

Gold and consumables create additional planning layer.

### Gold Sources

- Quest rewards: 10-30g
- Dungeon runs: 20-40g
- Gold farming activity: 40-60g
- Selling loot: 10-50g (depending on rarity)

### Gold Sinks

- **Mount:** 500g (one-time, reduces travel by 50%)
- **Consumables:** 5-20g each (potions, food, elixirs)
- **Repairs:** 10-30g per dungeon/raid (unavoidable)
- **Profession Training:** 100-300g (unlocks)
- **Rare Vendor Items:** 200-500g (opportunity cost)

### Consumables

**Types:**
- Health Potions (+10% survivability in combat)
- DPS Elixirs (+5% damage, higher loot chance)
- Buff Food (+stats for 1 activity)

**Usage:**
- Optional but helpful
- Expensive (opportunity cost vs gold farming)
- Required for hardcore min-maxing

**Example Decision:**
- "I have 400g. Do I buy mount (long-term efficiency) or stock up on consumables for tonight's raid attempt (short-term power)?"

---

## Key System Interactions

### Energy + Time = Evolution Accessibility
Energy gates how many activities per in-game day, time determines what fits in a 24h day. More max energy = more complex evolutions accessible within 18-day lifespan.

### Personality + Choices = Evolution Path
Every decision tracks personality stats, creating unique evolution upon death. Hidden during gameplay to prevent min-maxing.

### Evolution + Knowledge Transfer = Compounding Progression
Each evolution unlocks permanent bonuses. Ultimate Raider gives 100% boss knowledge, Master Crafter unlocks all recipes, Shapeshifter enables 2 mentor picks.

### Gear + Boss Knowledge + Consumables = Survival Chance
All three systems combine to mitigate death risk in endgame. Evolution bonuses (Scholar 2x knowledge, Raid Legend +25% raid knowledge) accelerate this.

### Time + Gold + Progression Goals = Planning Puzzle
Mutually exclusive time investments create strategic tension.

### Aging + Risk-Taking = Emotional Arc
As heroes age (in in-game days), players pushed to take bigger risks before it's too late.

### Death + Evolution + Meta-Progression = Long-term Engagement
Each failure unlocks evolution bonuses (+5-50 energy depending on tier), grants AP, and increases boss knowledge. Evolutions create "one more run" appeal to unlock collection.

### Energy Meta-Progression = Evolution Unlocks
Early runs limited (50 energy/day = Tier 1 evolutions only), later runs expansive (200+ energy/day = Tier 3 accessible). Evolution system is the primary driver of energy growth beyond base run bonuses. Power fantasy through what you can ACHIEVE (evolution collection), not just session length.

### Evolution Collection = Long-term Goal
30+ evolutions to unlock across 3 tiers. Tier 3 evolutions require multiple Tier 2 prerequisites, creating 20-30+ run progression arcs. True completionist challenge.

---

## Design Principles Summary

1. **Systems are interconnected** - No system exists in isolation. Evolutions affect knowledge transfer, energy, and starting bonuses.
2. **Player agency matters** - RNG exists but skill/planning >>> luck. Personality stats reward intentional playstyles.
3. **Failure is instructive** - Every death teaches something AND grants permanent +5 energy PLUS unlocks evolution bonuses
4. **Dual resource economy** - Energy (meta) + Time (in-game) create layered decisions
5. **Progression is multi-dimensional** - Levels, gear, knowledge, achievements, energy, AND evolutions all matter
6. **Flexible engagement** - Casual to hardcore, all pacing valid. Evolution paths support different playstyles (combat, economic, exploration, speed).
7. **Fair monetization** - Single-player game means pay-for-convenience is guilt-free. Energy IAP unlocks higher tier evolutions faster, but F2P can achieve same goals through grinding.
8. **Meaningful replayability** - 30+ evolutions across 3 tiers create unique builds and unlock paths. No two runs need to be the same.
9. **Hidden depth, natural play** - Personality tracking is invisible during runs, encouraging authentic choices over min-maxing
10. **Long-term goals** - Evolution collection is a 20-30+ run journey with Tier 3 evolutions requiring mastery of multiple playstyles
