# NanoRaider - Systems Design

## 1. Energy System

Energy is the primary meta-resource that gates **how many activities you can do per in-game day**. It creates the roguelike progression layer where advanced legacy paths are literally impossible without sufficient energy capacity.

### Core Concept

**Energy = Actions per in-game day budget**

- Each activity costs energy (in addition to in-game time)
- **Energy refills to max at the start of each new in-game day**
- Max energy increases through death bonuses and legacy path unlocks
- **Higher max energy = more activities per day = more accomplishments per 12-day lifespan**
- **Advanced legacy paths mathematically impossible without high max energy**

### Dynamic Activity Roster

The list of available activities is **not static**. As players shift their position in the Build Triangle or increase their Renown, new niche activities will dynamically appear on their schedule.
- **Renown-based Unlocks:** Reaching high Renown might unlock "Host Guild Meeting".
- **Triangle/Daring Unlocks:** Leaning into Wealth + high Daring might unlock "Black Market Trading".

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

**Base Stats (New Player):**
- Max Energy: 50 per in-game day
- Total energy budget over 12-day lifespan: **600 energy**

### Session Flexibility (Real-Time Doesn't Matter)

**The Beauty of Per-Day Energy:**
- Real-time session length is irrelevant
- Play 1 in-game day per session or 12 in a marathon - your choice
- No pressure to "check in" - come back whenever you want
- Single-player game means convenience is king

### Legacy Path Energy Requirements (CRITICAL HARD GATES)

**This is the core progression system:** Advanced legacy paths are **mathematically impossible** without sufficient max energy.

#### Tier 1 Legacy Paths (Achievable with 50-70 energy/day)

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

#### Tier 2 Legacy Paths (Need 100-120 energy/day)

**Raid Legend (Defeat 4/5 raid bosses):**
- Prerequisites: Berserker + Scholar legacy paths already unlocked
- Energy needed:
  - Days 1-3: Leveling (10 energy/day × 3 = 30 energy)
  - Days 4-7: Dungeon farming for gear (15 energy × 6/day × 4 days = 360 energy)
  - Days 8-10: Study 4 raid bosses (12 energy × 5 sessions × 4 bosses = 240 energy)
  - Days 11-12: Attempt 4 raid bosses (30 energy × 4 = 120 energy)
  - **Total: ~750 energy over 12 days**
  - **50 energy/day:** 12 days × 50 = 600 total → **BARELY POSSIBLE** ⚠️
  - **100 energy/day:** 12 days × 100 = 1,200 total → **COMFORTABLE** ✅

**Master Crafter (Profession mastery):**
- Prerequisites: Merchant King + Scholar legacy paths already unlocked
- Energy needed:
  - Days 1-3: Leveling (30 energy)
  - Days 4-9: Heavy crafting + material farming (10 craft + 15 dungeon × 3 = 55/day × 6 days = 330 energy)
  - Days 10-12: Final crafts (10 energy × 5/day × 3 days = 150 energy)
  - **Total: ~510 energy over 12 days**
  - **50 energy/day:** 12 days × 50 = 600 total → **BARELY POSSIBLE** ⚠️
  - **100 energy/day:** 12 days × 100 = 1,200 total → **COMFORTABLE** ✅

#### Tier 3 Legacy Paths (Need 150-200+ energy/day)

**Ultimate Raider (Defeat ALL 5 raid bosses):**
- Prerequisites: Must have Raid Legend + Master Crafter + Scholar + Treasure Hunter unlocked
- Energy needed:
  - Days 1-2: Speed leveling to 30 (10 energy × 4/day × 2 = 80 energy)
  - Days 3-5: Craft epic weapon using Master Crafter blueprints (10 energy × 5/day × 3 = 150 energy)
  - Days 6-8: Farm dungeons for epic materials + remaining gear (15 energy × 8/day × 3 days = 360 energy)
  - Days 9-10: Study ALL 5 raid bosses intensively (12 energy × 8 sessions × 5 bosses = 480 energy, spread over 2 days = 240/day)
  - Days 11-12: Attempt all 5 raid bosses (30 energy × 5 = 150 energy) + backup dungeon runs if failures (15 energy × 10 = 150 energy)
  - **Total: ~1,430 energy over 12 days**
  - **50 energy/day:** 12 days × 50 = 600 total → **IMPOSSIBLE** ❌
  - **100 energy/day:** 12 days × 100 = 1,200 total → **BARELY POSSIBLE** ⚠️
  - **150 energy/day:** 12 days × 150 = 1,800 total → **COMFORTABLE** ✅

**Perfect Run (All bosses + 5000g + Day 12+):**
- Prerequisites: Ultimate Raider + Merchant King + Death Defier + Speed Demon
- Energy needed: Similar to Ultimate Raider BUT also need heavy gold farming
  - Ultimate Raider requirements: 1,430 energy
  - Gold farming for 5000g: (8 energy × 10 sessions = 80 energy per day × 7 days = 560 energy)
  - **Total: ~1,990 energy over 12 days**
  - **150 energy/day:** 12 days × 150 = 1,800 total → **BARELY POSSIBLE** ⚠️
  - **200 energy/day:** 12 days × 200 = 2,400 total → **COMFORTABLE** ✅

**Key Insight:**
- **Tier 1 legacy paths:** Designed for 50-70 energy/day (new players)
- **Tier 2 legacy paths:** Designed for 100-120 energy/day (10-15 runs completed)
- **Tier 3 legacy paths:** Designed for 150-200+ energy/day (20-30+ runs completed)
- **This creates natural progression:** You MUST collect Tier 1 paths (which grant energy bonuses) before attempting Tier 2, and MUST collect Tier 2 before attempting Tier 3

## 2. The Dimensions Framework

Everything in the game—from the activities you can perform to the legacy paths you unlock upon death—is governed by a 5-dimension system that tracks your hero's development and behavior.

### The Build Triangle: War / Wit / Wealth

The core of a hero's identity is expressed through three visible poles. Every energy spend shifts the hero's position within this triangle.

- **War (Combat)**: Focus on martial prowess, dungeon clearing, and physical challenges.
- **Wit (Knowledge)**: Focus on study, boss research, and intellectual mastery.
- **Wealth (Economy)**: Focus on gold accumulation, trade, and resource management.

**Mechanics:**
- Position is expressed as (War%, Wit%, Wealth%) summing to 100%.
- **7 Natural Zones:**
    - **3 Corners:** One axis >= 50%, others < 30% (e.g., Pure Warrior).
    - **3 Edges:** Two axes >= 30%, third < 30% (e.g., Battle-Scholar).
    - **1 Center:** All axes between 25-40% (The Generalist).

### Renown (Visible, 0-100)

Renown represents your social investment and fame. It is orthogonal to the Build Triangle but competes for the same energy budget.

- High Renown unlocks social activities, guild leadership, and prestigious legacy paths.
- It effectively doubles the 7 triangle zones into ~14 visible archetypes (e.g., "Famous Warrior" vs. "Hedge Knight").

### Daring (Hidden, 0-100)

Daring is a hidden dimension revealed only at death. It tracks your risk-taking patterns across the hero's life.

- **High Daring:** Early raid attempts, low-readiness tries, aggressive time bets.
- **Low Daring:** Methodical preparation, conservative scheduling, high-readiness attempts.
- **Impact:** Daring influences the specific flavor of legacy paths unlocked (e.g., "Speed Demon" vs. "Death Defier").

### Boss Readiness (Visible, 0-100% per boss)

Replaces complex knowledge channels with a single progress bar per raid boss. 
- Increased through study and scouting activities.
- Directly impacts success chance and survival in raids.

### Level (Visible, Single Scalar)

A single scalar representing overall hero power. 
- Replaces individual stats (STR/AGI/INT/STA/CHA).
- Increased through most activities; acts as a primary gate for advanced gear and dungeons.

**What's Cut:** To streamline the experience, we have removed 5 core stats, 6 personality axes, 3 boss knowledge channels, dungeon familiarity, and faction reputation.

## 3. Knowledge Transfer System

What persists between runs depends on which evolutions you've unlocked.

### Base Knowledge Transfer (No Evolutions)

**Always Persists:**
- Boss Readiness percentage (0-100% per boss)
- Achievement points
- Energy upgrades purchased
- Gear codex (cosmetic collection)

## 4. Aging System

Heroes age based on in-game days completed, creating natural character arc and eventual end.

### Age Phases

Normal: No additional risk modifier
Aging: Increases steadily from 5% at day 8 to 10% on day 13.

## 5. Gear System

Inspired by WoW's slot-based gear progression with clear upgrade paths.

### Gear Slots (8 Total)

1. Helmet
2. Chest
4. Legs
6. Weapon
7. Off-hand / Shield

### Gear Rarity Tiers

| Rarity | Color | Source |
|--------|-------|------------|--------|
| **Common** | Gray | Starting gear |
| **Uncommon** | Green | Quests, early dungeons |
| **Rare** | Blue | Dungeons (Pre-BiS) |
| **Epic** | Purple | Raids (BiS) |
| **Legendary** | Orange | Extreme endgame, meta unlocks |

### Gear Stats

Each piece contributes to the hero's overall **Level** scalar. Higher rarity gear provides more significant Level boosts, which in turn unlocks more challenging activities.

## 6. Death & Failure System

Permadeath is central, but failure teaches.

### Death Triggers

**Combat Death (Raids Only):**
- Only raid boss encounters can result in permanent death.
- Failed dungeon runs are non-lethal but result in wasted energy and missed opportunities.
- Success in raids is heavily influenced by **Boss Readiness** and **Level**.

**Old Age Death:**
- Random chance starting Day 10+
- Unavoidable eventually (creates urgency)

### Death Probability Formula

```
Death % = Base Risk - (Boss Readiness) + (Daring Penalty)
```

## 7. Random Event System

Simulated MMO world creates emergent decisions. Random events should be rare, exciting, and high impact. They can help you create a god run.

They should only appear once every 2-3 runs, and have a chance to appear after completing any activity

## Design Principles Summary

1. **Systems are interconnected** - No system exists in isolation. Legacy paths affect knowledge transfer, energy, and starting bonuses.
2. **Player agency matters** - RNG exists but skill/planning >>> luck. Triangle positioning, Renown investment, and Daring reward intentional playstyles.
3. **Progression is multi-dimensional** - Levels, gear, knowledge, achievements, energy, AND unlocks all matter
4. **Meaningful replayability** - 30+ legacy paths to collect.
5. **Hidden depth, natural play** - Daring tracking is invisible during runs, encouraging authentic choices over min-maxing
10. **Long-term goals** - Legacy collection is a 20-30+ run journey with Tier 3 evolutions requiring mastery of multiple playstyles
