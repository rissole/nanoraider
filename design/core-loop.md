# NanoRaider - Core Loop Document

## Overview

NanoRaider has three interlocking loops:
1. **Micro Loop** (1-2 minutes): Review → Plan → Execute → Evaluate
2. **Session Loop** (Flexible): Energy-driven gameplay allowing casual (5 min) or marathon (hours) sessions
3. **Meta Loop** (18 in-game days): Full character lifecycle from creation to death

**Key Mechanic:** Energy gates how much you can play per session. New players (50 energy) can do ~3-4 activities per session. Veterans (200+ energy) can complete multiple in-game days in one sitting.

**Evolution System:** Every MMO choice you make (dungeon rushing vs. cautious farming, solo play vs. guild raids, hoarding gold vs. helping others) tracks hidden personality stats. When your hero dies, these stats determine which evolution you unlock—a Berserker, Master Crafter, Raid Legend, or one of 30+ unique evolutions. Each unlock adds to your collection and grants permanent bonuses for future heroes.

## Micro Loop: Single Day Planning

### 1. Review (30 seconds)
Player opens the game and sees:
- **Energy bar:** "45/50 energy available" (regenerated since last session)
- Current hero status (level, in-game day/age, gear quality per slot)
- Yesterday's results (loot gained, XP earned, events triggered)
- World events ("Guild recruiting for Molten Core tonight!")
- Hero thoughts ("My helmet is my weakest slot...")
- **Personality hints:** Subtle UI hints about evolving traits:
  - "Your hero seems increasingly reckless..." (after multiple risky dungeon runs)
  - "Your hero prefers working alone..." (after declining guild invites)
  - "Your hero has a merchant's eye..." (after prioritizing gold farming)

**Goal:** Orient player to current state and available energy, provide subtle evolution feedback

### 2. Plan (1-2 minutes)
Player drags activities into a 24-hour schedule:

**Available Activities (with energy costs):**
- Quest (4h, 10 energy) → XP, gold, zone rep
- Dungeon Run (2h, 15 energy) → Targeted loot
- Raid (6h, 30 energy) → BiS loot, lockout risk
- Study Boss (2h, 12 energy) → +survival %
- Farm Gold (3h, 8 energy) → Consumables, repairs
- Craft/Profession (2h, 10 energy) → Create items
- Travel (1-3h, 5 energy) → Change zones
- Rest (8h, 0 energy) → Required!

**Planning UI shows:**
- **Energy cost** for each activity (running total as you plan)
- Projected outcomes (estimated loot, XP, gold)
- Risk levels (death % for dungeons/raids)
- Mutually exclusive choices highlighted (24h time limit per day)
- Energy remaining indicator: "30/50 energy left"
- "Can't afford" grayed out when energy insufficient
- **Hidden personality tracking:** Each choice affects hidden stats (not shown numerically):
  - Rush dungeon without prep = +Reckless, +Combat-focused
  - Study boss mechanics first = +Cautious, +Strategic
  - Farm gold alone = +Solo, +Economic
  - Join guild raid = +Social, +Combat-focused
  - Help other players = +Generous
  - Hoard consumables = +Greedy
  - Explore new zones = +Explorer
  - Optimize route efficiency = +Efficient

**Example Schedule (New Player with 50 energy):**
```
21:00 - 05:00: Rest (8h, 0 energy) [recover exhaustion]
05:00 - 07:00: Travel to Scholomance (2h, 5 energy)
07:00 - 09:00: Scholomance (2h, 15 energy) [35% helmet drop]
09:00 - 11:00: Scholomance (2h, 15 energy) [35% gloves drop]
11:00 - 14:00: Farm Gold (3h, 8 energy) [~50g expected]
14:00 - 21:00: Rest (7h, 0 energy) [minimal rest]

Total energy cost: 43/50 energy
Time allocated: 24/24 hours
```

**Example Schedule (Veteran with 150 energy):**
```
Could plan TWO full days worth of activities in one session:

Day 1:
- Multiple dungeon runs, gold farming, boss study (60 energy)

Day 2:
- Raid attempt, crafting, quest chain completion (80 energy)

Total: 140/150 energy spent
Can complete 2 full in-game days in 15-20 minute session
```

**Goal:** Create strategic plan that fits within energy budget and maximizes hero progress

### 3. Execute (Instant / Auto-resolve)
Player confirms schedule → game simulates the day:
- Animated summary (cute pixel hero doing activities)
- RNG resolution (did drops occur? Any events?)
- Results tallied

**Time options:**
- Instant resolve (skip animation)
- Watch simulation (optional, satisfying)
- Auto-pilot mode (runs next 3 days based on saved template)

**Goal:** Satisfy player with results, show progress

### 4. Evaluate (30 seconds)
Results screen shows:
- Loot obtained (with rarity effects)
- XP/Level ups (if any)
- Gold earned/spent
- Random events that occurred
- Updated gear comparison
- Failures (death attempts survived, close calls)
- **Personality hints:** Occasional subtle feedback:
  - "Your hero's confidence is growing..." (after successful risky plays)
  - "Your hero values efficiency above all..." (after optimized routes)
  - "Your hero enjoys helping the community..." (after generous choices)

**Note:** Players don't see exact personality numbers—they discover their evolution through organic play and hints. The mystery creates "what will I become?" intrigue.

Player decides:
- Continue planning tomorrow?
- Adjust strategy based on results?
- Hero died → Meta loop begins

**Goal:** Create feedback loop informing next planning session, build anticipation for evolution reveal

---

## Session Loop: Energy-Driven Flexible Sessions

Session length is determined by available energy and player preference, not fixed time gates.

### Session Types

**Type 1: Quick Session (5 min, 50 energy)**
*For new players or busy moments*
- Login → Check energy (45/50 available)
- Plan partial day: 3-4 activities
- Execute → See results
- Done for now (energy depleted or natural stopping point)

**Type 2: Standard Session (10-15 min, 100-150 energy)**
*For mid-progression players*
- Login → Check energy (100/100 available)
- Plan 1-2 full in-game days
- Execute → Review → Adjust → Execute day 2
- Strategic decisions based on RNG outcomes
- Natural stopping point after completing days

**Type 3: Marathon Session (30-60+ min, 200+ energy)**
*For veterans or weekend grinding*
- Login → Check energy (200/200 available)
- Plan 3-5 in-game days in advance
- Execute all → Review cumulative progress
- Deep strategic optimization
- Could progress entire lifecycle phase in one sitting

### Flexible Session Flow

**Login → Assess (1 min)**
- How much energy do I have?
- Where is hero in lifecycle? (In-game Day 3? Day 10?)
- What's the current goal? (Farming Pre-BiS? Attempting raids?)
- What happened since last session?

**Strategic Planning (Variable)**
- Review gear needs (which slots need upgrades?)
- Prioritize content (which dungeons/raids to target?)
- Resource check (enough gold for consumables? Need to farm?)
- Risk assessment (ready for raid attempts or need more prep?)
- **Energy budgeting:** How many activities can I afford?

**Execute (Variable)**
- Spend available energy on planned activities
- Review results after each day
- Adjust strategy based on RNG outcomes

**Natural Exit Points:**
- Energy depleted (hard stop)
- Completed a meaningful milestone (got gear drop, leveled up)
- Finished an in-game day (clean stopping point)
- Hero died (enter legacy flow)

### Example Session Narrative (New Player, 50 energy)

> **In-Game Day 7 Check-in:**
> - Energy available: 50/50 (full bar, regenerated overnight)
> - Hero is level 28, approaching endgame
> - Worst gear: Helmet (green), Chest (green), Gloves (blue)
> - Goal: Farm Pre-BiS before attempting first raid
> - Gold: 450 (need 500 for mount, improves travel time)
>
> **Plan (50 energy budget):**
> - Travel to Scholomance (5 energy)
> - Scholomance run #1 (15 energy) [35% helmet drop]
> - Scholomance run #2 (15 energy) [35% gloves drop]
> - Farm Gold (8 energy)
> - Total: 43/50 energy
>
> **Execute Day 7:**
> - Helmet dropped! Gloves dropped! Got 30g from runs.
> - Random event: "Guild invites you to UBRS run tonight (costs 15 energy, +1 gear slot attempt)"
> - Player has 7 energy left → Can't afford (grayed out)
> - Declined event (not enough energy)
>
> **Day 7 Results:**
> - Great session! 2/3 hoped-for drops obtained
> - Now 5 energy from empty, natural stopping point
> - Will check back later when energy regenerates
> - **Satisfaction:** Got loot, made progress, clear next step

### Example Session Narrative (Veteran, 150 energy)

> **In-Game Days 7-8 Planning Session:**
> - Energy available: 150/150
> - Can plan TWO full days
>
> **Day 7 Plan (70 energy):**
> - Scholomance x3, Farm Gold x2, Boss Study
>
> **Day 8 Plan (65 energy):**
> - First raid attempt on Molten Fury (30 energy)
> - Backup: If raid fails, switch to more dungeon farming
>
> **Execute Both Days:**
> - Day 7: Perfect drops on all runs, gold target hit
> - Day 8: Raid successful! First purple item obtained!
> - Random events handled in real-time
> - **Total: 15-minute session, 2 days of progress**
> - **Satisfaction:** Veteran efficiency, deep strategic play

---

## Meta Loop: Character Lifecycle (18 In-Game Days)

**Flexible Real-Time Completion:**
- Casual players (50 energy): 2-4 weeks real-time
- Active players (100 energy): 1-2 weeks real-time
- Veterans (200+ energy): 3-7 days real-time

Each character run follows an arc from creation to death.

### Phase 1: Leveling (Days 1-5)

**Objectives:**
- Reach max level (30)
- Make early choices that define class archetype
- Learn game systems
- Unlock first dungeons

**Gameplay:**
- Binary nurture choices shape class ("Help villager" vs "Study magic")
- Questing for XP
- Low stakes (can't die easily)
- Tutorial-ish but engaging

**Session frequency:** Flexible based on energy (casual: 1x daily, active: 2-3x daily)

### Phase 2: Pre-BiS Farming (Days 6-10)

**Objectives:**
- Upgrade all 8 gear slots from green → blue
- Farm gold for consumables/mount
- Study early raid bosses
- Optimize dungeon routes

**Gameplay:**
- Peak planning complexity
- Multiple viable paths (focus speed, gold, or gear?)
- RNG creates variance (did the drop happen?)
- First real death risks in dungeons

**Session frequency:** Flexible (casual: 5-10 min daily, active: 15-30 min daily, veteran: marathon sessions possible)

### Phase 3: Endgame Push (Days 11-14)

**Objectives:**
- Attempt raid bosses
- Chase BiS (purple) loot
- Complete chosen win condition
- Manage aging debuffs

**Gameplay:**
- High stakes (raids can kill you)
- Lockout timers create pressure
- Strategic resource management (use consumables or save?)
- Aging stats declining, rewards increasing

**Session frequency:** Flexible (veterans may speedrun this phase in single marathon session)

### Phase 4: Death & Legacy (5-10 min)

**Triggers:**
- Died in raid/dungeon
- Died of old age (random chance after In-Game Day 16+)
- Died from exhaustion (skipped rest too many times)

**Death Sequence:**
1. **Death scene** - Cinematic moment showing how hero fell
2. **Legacy screen** - Achievements unlocked, knowledge gained, stats summary
   - **+5 Max Energy (permanent)**
   - Achievement Points awarded based on performance
   - Boss knowledge updates
3. **Mentor selection** - Choose one bonus from fallen hero for next run
4. **Meta-progression** - Spend achievement points on unlocks (including more energy!)
5. **Energy notification** - "Your max energy is now 55! Next run you can do more activities!"
6. **Create new hero** - Start Phase 1 again with new advantages

### Meta-Progression Between Runs

**Persistent unlocks:**
- **+5 Max Energy per run** (automatic, caps at 30 runs)
- Boss knowledge (each % studied = permanent survival boost)
- Zone unlocks (skip early zones)
- Profession recipes
- Achievement points → spend on unlocks:
  - **Energy upgrades** (+10 energy for 50 AP, repeatable)
  - **2x Energy regen rate** (500 AP, game-changing)
  - Start with mount (500 AP)
  - Start at level 10 (1000 AP)
  - Increased drop rates (+10% for 750 AP)
  - Longer lifespan (+2 in-game days in Prime phase, 1500 AP)
  - New class archetypes (2000 AP)

**Mentor bonuses (pick one per run):**
- Inherit best gear piece from last hero
- +10% boss knowledge for bosses they killed
- Starting gold (500g)
- Instant profession unlock

---

## Loop Interconnection

```
MICRO LOOP (Activity planning)
    ↓
Gated by ENERGY SYSTEM (meta-resource)
    ↓
Feeds into SESSION LOOP (Flexible based on energy capacity)
    ↓
Feeds into META LOOP (18 in-game day character lifecycle)
    ↓
Death triggers LEGACY SYSTEM
    ↓
Permanent +5 energy + AP unlocks feed back into SESSION LOOP
    ↓
More energy = Longer sessions = Faster progression on next run
```

### Why This Works

1. **Micro loop** is quick and satisfying → Immediate gratification
2. **Energy gating** creates natural stopping points → No FOMO, healthy engagement
3. **Session loop** is flexible → Casual or hardcore, both valid
4. **Meta loop** creates long-term goals → "One more run" appeal
5. **Failure feeds progression** → Death grants +5 energy + AP, always feels like progress
6. **Energy meta-progression** → Early runs short (50 energy), veteran runs marathon (200+)

### Engagement Hooks

- **Per session:** Spend energy, get loot, see numbers go up (dopamine hit)
- **Per death:** +5 permanent energy (always feel stronger)
- **Per 2-3 in-game days:** Major gear upgrades, level milestones
- **Per lifecycle phase:** Reach Pre-BiS → Endgame transition
- **Per character run:** Complete 18 in-game days, feel bittersweet attachment, celebrate victories
- **Long-term:** Collection of achievements across multiple heroes, energy capacity doubling/tripling

---

## Comparison to Reference Games

| Game | Loop Length | Energy Model | NanoRaider Equivalent |
|------|-------------|--------------|----------------------|
| Melvor Idle | Check every few hours | Passive timers | Energy-gated activity sessions |
| Slay the Spire | 45-60 min run | No energy | 18 in-game day character lifecycle |
| Reigns | 5-10 min run | No energy | Single day planning (new players) |
| WoW Classic | Months of progression | No energy | One character run lifecycle |
| Clash of Clans | 2-5x daily check-ins | Building timers | Energy regeneration model |
| Candy Crush | Lives system | 5 lives, regen over time | 50 energy base, regen 1/10min |

**NanoRaider's Unique Hybrid:**
- Energy system (like Clash/Candy Crush) for session gating
- Roguelike meta-progression (like Slay the Spire) for energy capacity increases
- Planning depth (like Melvor Idle) for strategic optimization
- Permadeath stakes (like roguelikes) with forgiving meta-progression

---

## Anti-Patterns to Avoid

- **Too slow:** If daily simulation takes >30 seconds, players will churn
- **Too shallow:** If planning doesn't matter (RNG overrides strategy), feels hollow
- **Too punishing:** If death feels unfair (no counterplay) AND doesn't grant progression, players quit
- **Too grindy:** If optimal strategy is repetitive, engagement drops
- **Too complex:** If UI is cluttered or overwhelming, mobile players bounce
- **Energy predatory:** If energy refills are required to progress (pay-to-win), players revolt
- **FOMO mechanics:** If missing a day feels punishing, creates unhealthy engagement

---

## Key Takeaway

**The core loop is planning-execution-evaluation with satisfying feedback at each step. Strategic depth comes from dual resource economy (energy + time). Emotional engagement comes from watching heroes grow, struggle, and eventually fall—knowing their death grants permanent +5 energy and makes the next hero's journey easier. Energy meta-progression transforms frustration into anticipation: "I can't wait to play more with my increased capacity!"**
