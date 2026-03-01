// ─── Dimensions ────────────────────────────────────────────────────────────────

export type CoreStatKey = "strength" | "agility" | "intelligence" | "stamina" | "charismaInfluence";

export interface CoreStats {
  strength: number;
  agility: number;
  intelligence: number;
  stamina: number;
  charismaInfluence: number;
}

export type PersonalityAxisKey =
  | "combatStyle"
  | "socialStyle"
  | "economicFocus"
  | "exploration"
  | "preparation"
  | "ambition";

export interface PersonalityAxes {
  combatStyle: number; // cautious(-) ↔ reckless(+)
  socialStyle: number; // solo(-) ↔ social(+)
  economicFocus: number; // combat(-) ↔ economic(+)
  exploration: number; // focused(-) ↔ wanderer(+)
  preparation: number; // improviser(-) ↔ methodical(+)
  ambition: number; // survivor(-) ↔ glory-seeker(+)
}

export type FactionId = "adventurers_guild" | "scholomance_order";
export type BossId = "molten_fury";

export interface SecondaryDimensions {
  reputation: Record<FactionId, number>;
  bossKnowledge: Record<BossId, number>; // 0-100
}

export interface DimensionDeltas {
  coreStats?: Partial<Record<CoreStatKey, number>>;
  personality?: Partial<Record<PersonalityAxisKey, number>>;
  reputation?: Partial<Record<FactionId, number>>;
  bossKnowledge?: Partial<Record<BossId, number>>;
}

// ─── Activity ────────────────────────────────────────────────────────────────

export type ActivityId =
  | "quest"
  | "dungeon_scholomance"
  | "dungeon_blackrock"
  | "farm_gold"
  | "study_boss"
  | "raid_molten_fury"
  | "host_guild_meeting"
  | "black_market_trading";

export interface UnlockConditions {
  minLevel?: number;
  minCoreStats?: Partial<Record<CoreStatKey, number>>;
  minPersonality?: Partial<Record<PersonalityAxisKey, number>>;
  minReputation?: Partial<Record<FactionId, number>>;
  minBossKnowledge?: Partial<Record<BossId, number>>;
}

export interface ActivityDefinition {
  id: ActivityId;
  name: string;
  description: string;
  energyCost: number;
  durationHours: number;
  category: "combat" | "economic" | "knowledge" | "social" | "general";
  effects: DimensionDeltas;
  outcomes: ActivityOutcomeTable;
  unlockConditions?: UnlockConditions;
  deathRisk: number; // 0–1
  riskProfile?: {
    coreStats?: Partial<Record<CoreStatKey, number>>;
    gearFactor?: number;
    prepFactor?: number;
    knowledgeFactor?: number;
    minRisk?: number;
    maxRisk?: number;
  };
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

// ─── Daily Events ─────────────────────────────────────────────────────────────

export type DailyEventId =
  | "militia_training"
  | "traveling_merchant"
  | "scholar_lecture"
  | "guild_conflict";

export interface DailyEventChoice {
  id: string;
  label: string;
  description: string;
  effects: DimensionDeltas;
  xpGain?: number;
  goldGain?: number;
}

export interface DailyEventDefinition {
  id: DailyEventId;
  title: string;
  description: string;
  minDay: number;
  maxDay?: number;
  weight: number;
  choices: DailyEventChoice[];
}

export interface PendingDailyEvent {
  eventId: DailyEventId;
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

// ─── Evolution ───────────────────────────────────────────────────────────────

export type EvolutionId = "berserker" | "merchant" | "scholar" | "raid_legend";
export type EvolutionTier = 1 | 2 | 3;

export interface EvolutionUnlockCondition {
  minCoreStats?: Partial<Record<CoreStatKey, number>>;
  minPersonality?: Partial<Record<PersonalityAxisKey, number>>;
  minGoldAtDeath?: number;
  minBossKnowledge?: Partial<Record<BossId, number>>;
  mustDefeatRaids?: BossId[];
}

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

export interface EvolutionBonuses {
  energyBonus: number; // permanent max energy increase
  startGold?: number; // gold on new run start
  combatBonus?: number; // % damage increase (0.1 = 10%)
  bossKnowledgeBonus?: number; // % boss knowledge on new hero (0.05 = 5%)
  knowledgeTransferMultiplier?: number; // multiplier on study gains
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

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
  level: number;
  xp: number;
  xpToNextLevel: number;
  inGameDay: number; // 1–18+
  gold: number;
  gear: GearSlots;
  coreStats: CoreStats;
  personality: PersonalityAxes;
  secondary: SecondaryDimensions;
  completedActivitiesToday: ActivityId[];
  raidLockouts: Partial<Record<BossId, number>>; // bossId -> day attempted
}

// ─── Run State ────────────────────────────────────────────────────────────────

export type GameScreen =
  | "main_menu"
  | "hero_creation"
  | "planning"
  | "daily_event"
  | "day_results"
  | "death"
  | "collection"
  | "upgrades";

export interface DayResult {
  day: number;
  activitiesResolved: ResolvedActivity[];
  eventsResolved: ResolvedDailyEvent[];
  totalXp: number;
  totalGold: number;
  lootObtained: GearItem[];
  heroSurvived: boolean;
  deathCause?: "combat" | "old_age";
  personalitySnapshot: PersonalityAxes;
  coreStatsSnapshot: CoreStats;
}

export interface ResolvedActivity {
  activityId: ActivityId;
  xpGained: number;
  goldGained: number;
  lootDropped: GearItem[];
  died: boolean;
  appliedEffects: DimensionDeltas;
  effectiveDeathRisk: number;
  riskBand: RiskBand;
  riskBreakdown: ActivityRiskBreakdown | null;
  riskHints: string[];
}

export type RiskBand = "safe" | "manageable" | "dangerous" | "lethal";

export interface ActivityRiskBreakdown {
  baseRisk: number;
  coreStatMitigation: number;
  gearMitigation: number;
  prepMitigation: number;
  knowledgeMitigation: number;
  metaMitigation: number;
  agePenalty: number;
  recklessPressure: number;
  finalRisk: number;
  riskBand: RiskBand;
}

export interface ResolvedDailyEvent {
  eventId: DailyEventId;
  choiceId: string;
  xpGained: number;
  goldGained: number;
  appliedEffects: DimensionDeltas;
}

// ─── Meta-Progression (persists across runs) ──────────────────────────────────

export interface MetaProgression {
  totalRuns: number;
  maxEnergy: number; // starts at 50, grows permanently
  achievementPoints: number;
  unlockedEvolutions: EvolutionId[]; // Pokédex collection
  evolutionBonuses: EvolutionBonuses; // stacked from all unlocked evolutions
  bossKnowledgeBank: Partial<Record<BossId, number>>; // persists across runs
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
