// ─── Activity ────────────────────────────────────────────────────────────────

export type ActivityId = "quest" | "dungeon_scholomance" | "dungeon_blackrock" | "farm_gold" | "study_boss" | "raid_molten_fury";

export interface ActivityDefinition {
  id: ActivityId;
  name: string;
  description: string;
  energyCost: number;
  durationHours: number;
  category: "combat" | "economic" | "knowledge" | "general";
  personalityDeltas: Partial<PersonalityStats>;
  outcomes: ActivityOutcomeTable;
  minLevel: number;
  deathRisk: number; // 0–1
}

export interface ActivityOutcomeTable {
  xpMin: number;
  xpMax: number;
  goldMin: number;
  goldMax: number;
  lootTable: LootDrop[];
}

export interface LootDrop {
  itemId: string;
  chance: number; // 0–1
}

// ─── Gear ─────────────────────────────────────────────────────────────────────

export type GearSlot = "helmet" | "chest" | "gloves" | "boots" | "weapon" | "offhand" | "legs" | "accessory";
export type GearRarity = "gray" | "green" | "blue" | "purple";

export interface GearItem {
  id: string;
  name: string;
  slot: GearSlot;
  rarity: GearRarity;
  itemPower: number;
  description: string;
}

// ─── Personality ─────────────────────────────────────────────────────────────

export interface PersonalityStats {
  aggression: number;   // combat-focused choices
  wisdom: number;       // study / preparation
  greed: number;        // gold-farming, economic focus
  cunning: number;      // risky / sneaky play
  patience: number;     // methodical, slow-burn prep
  recklessness: number; // high-risk content, skip prep
}

// ─── Evolution ───────────────────────────────────────────────────────────────

export type EvolutionId = "berserker" | "merchant" | "scholar" | "raid_legend";
export type EvolutionTier = 1 | 2 | 3;

export interface EvolutionDefinition {
  id: EvolutionId;
  name: string;
  tier: EvolutionTier;
  description: string;
  lore: string;
  prerequisites: EvolutionId[]; // must be already unlocked in collection
  unlockCondition: EvolutionUnlockCondition;
  bonuses: EvolutionBonuses;
  hint: string; // shown when locked
  unlocksPath: EvolutionId[]; // evolutions this is a prereq for
}

export interface EvolutionUnlockCondition {
  // Personality thresholds (must reach this score)
  minAggression?: number;
  minWisdom?: number;
  minGreed?: number;
  minRecklessness?: number;
  // Achievement conditions
  minGoldAtDeath?: number;
  minBossKnowledge?: number; // 0–100
  mustDefeatRaid?: boolean;
}

export interface EvolutionBonuses {
  energyBonus: number;       // permanent max energy increase
  startGold?: number;        // gold on new run start
  combatBonus?: number;      // % damage increase (0.1 = 10%)
  bossKnowledgeBonus?: number; // % boss knowledge on new hero (0.05 = 5%)
  knowledgeTransferMultiplier?: number; // multiplier on study gains
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export type HeroClass = "warrior" | "mage" | "healer";

export interface HeroNurtureChoice {
  question: string;
  optionA: string;
  optionB: string;
  choiceAClass: HeroClass;
  choiceBClass: HeroClass;
}

export interface GearSlots {
  helmet: GearItem | null;
  chest: GearItem | null;
  gloves: GearItem | null;
  boots: GearItem | null;
  weapon: GearItem | null;
  offhand: GearItem | null;
  legs: GearItem | null;
  accessory: GearItem | null;
}

export interface Hero {
  name: string;
  heroClass: HeroClass;
  level: number;
  xp: number;
  xpToNextLevel: number;
  inGameDay: number;   // 1–18+
  gold: number;
  gear: GearSlots;
  // Hidden during run, revealed on death
  personality: PersonalityStats;
  // Boss knowledge (0–100 per boss)
  bossKnowledge: Record<string, number>;
  // Activities done this day (for lockout logic)
  completedActivitiesToday: ActivityId[];
  // Raids attempted (day → boss id)
  raidLockouts: Record<string, number>; // bossId → dayAttempted
}

// ─── Run State ────────────────────────────────────────────────────────────────

export type GameScreen =
  | "main_menu"
  | "hero_creation"
  | "planning"
  | "executing"
  | "day_results"
  | "death"
  | "collection"
  | "upgrades";

export interface PlannedActivity {
  activityId: ActivityId;
  slot: number; // order in the day
}

export interface DayResult {
  day: number;
  activitiesResolved: ResolvedActivity[];
  totalXp: number;
  totalGold: number;
  lootObtained: GearItem[];
  heroSurvived: boolean;
  deathCause?: "combat" | "old_age";
  personalitySnapshot: PersonalityStats;
}

export interface ResolvedActivity {
  activityId: ActivityId;
  xpGained: number;
  goldGained: number;
  lootDropped: GearItem[];
  died: boolean;
  personalityDeltas: Partial<PersonalityStats>;
}

// ─── Meta-Progression (persists across runs) ──────────────────────────────────

export interface MetaProgression {
  totalRuns: number;
  maxEnergy: number;                    // starts at 50, grows permanently
  achievementPoints: number;
  unlockedEvolutions: EvolutionId[];    // Pokédex collection
  evolutionBonuses: EvolutionBonuses;  // stacked from all unlocked evolutions
  bossKnowledgeBank: Record<string, number>; // persists across runs
  apUpgrades: APUpgradeId[];
}

export type APUpgradeId = "energy_10" | "start_gold_100";

export interface APUpgrade {
  id: APUpgradeId;
  name: string;
  description: string;
  cost: number;
  maxPurchases: number;
}
