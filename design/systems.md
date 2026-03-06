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

The list of available activities is **not static**. As players level up specific Core Stats or lean heavily into certain Personality Axes, new niche activities will dynamically appear on their schedule.
- **Stat-based Unlocks:** Reaching high `Charisma/Influence` might unlock "Host Guild Meeting".
- **Personality-based Unlocks:** Leaning heavily into `Economic` and `Reckless` might unlock "Black Market Trading".

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

## 2. The Dimensions Framework & Legacy Path System

Everything in the game—from the activities you can perform to the legacy paths you unlock upon death—is governed by a bottoms-up "Dimensions Framework". 

### Core Dimensions

1. **Core Stats**: The physical and mental attributes of your hero. Leveling up these stats is the primary trigger for unlocking new specific activities.
   - **Strength**: Increases physical damage and allows demanding physical activities.
   - **Agility**: Increases speed, critical strikes, and unlocks finesse-based activities.
   - **Intelligence**: Increases magical power, and unlocks complex cognitive/magical activities.
   - **Stamina**: Increases health, and allows high-endurance activities.
   - **Charisma/Influence**: Determines social sway, unlocking guild leadership, social events, and mercantile opportunities.

2. **Personality Axes**: These 6 spectrums track your behavioral patterns based on how you play. They act as secondary gates for niche activities (e.g., a "Black Market Trading" activity only unlocks if you lean heavily into *Economic* and *Reckless*).
   - **Combat Style**: Cautious vs. Reckless
   - **Social Style**: Solo vs. Social
   - **Economic Focus**: Combat vs. Economic
   - **Exploration**: Focused vs. Wanderer
   - **Preparation**: Improviser vs. Methodical
   - **Ambition**: Survivor vs. Glory-Seeker

3. **Secondary Dimensions**: 
   - **Reputation**: Standing with various zones or factions.
   - **Boss Knowledge**: Earned through study, directly reduces death risk.

## 3. Knowledge Transfer System

What persists between runs depends on which evolutions you've unlocked.

### Base Knowledge Transfer (No Evolutions)

**Always Persists:**
- Boss knowledge percentage (0-100% per boss)
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

Each piece has:
- **Primary Stat** (Strength, Agility, Intelligence, Stamina)

## 6. Death & Failure System

Permadeath is central, but failure teaches.

### Death Triggers

**Combat Death:**
- Failed dungeon run (based on gear + boss knowledge + RNG)
- Failed raid encounter (high risk, partially mitigated by prep)

**Old Age Death:**
- Random chance starting Day 10+
- Unavoidable eventually (creates urgency)

### Death Probability Formula

```
Death % = Base Risk - (Bonuses) + (Penalties)
```

## 7. Random Event System

Simulated MMO world creates emergent decisions. Random events should be rare, exciting, and high impact. They can help you create a god run.

They should only appear once every 2-3 runs, and have a chance to appear after completing any activity

## Design Principles Summary

1. **Systems are interconnected** - No system exists in isolation. Legacy paths affect knowledge transfer, energy, and starting bonuses.
2. **Player agency matters** - RNG exists but skill/planning >>> luck. Personality stats reward intentional playstyles.
3. **Progression is multi-dimensional** - Levels, gear, knowledge, achievements, energy, AND unlocks all matter
4. **Meaningful replayability** - 30+ legacy paths to collect.
5. **Hidden depth, natural play** - Personality tracking is invisible during runs, encouraging authentic choices over min-maxing
10. **Long-term goals** - Legacy collection is a 20-30+ run journey with Tier 3 evolutions requiring mastery of multiple playstyles
