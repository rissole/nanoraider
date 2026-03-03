import { ACTIVITIES } from "../data/activities";
import { GEAR_ITEMS } from "../data/gear";
import type {
  ActivityDefinition,
  ActivityId,
  ActivityRiskBreakdown,
  BossId,
  CoreStatKey,
  DimensionDeltas,
  DungeonActivityId,
  GearReadinessBand,
  GearReadinessMetric,
  GearRarity,
  GearItem,
  Hero,
  MaterialId,
  MetaProgression,
  RiskBand,
  ResolvedActivity,
} from "../data/types";
import { applyKnowledgeGain, getBossReadiness } from "./bossKnowledge";
import { generateGear, getEffectiveCoreStats, randomGearSlot, sumGearStats } from "./gearGenerator";

function roll(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addMaterials(
  source: Partial<Record<MaterialId, number>>,
  delta: Partial<Record<MaterialId, number>>,
): Partial<Record<MaterialId, number>> {
  const next: Partial<Record<MaterialId, number>> = { ...source };
  for (const [id, amount] of Object.entries(delta)) {
    const materialId = id as MaterialId;
    const current = next[materialId] ?? 0;
    const nextValue = current + amount;
    if (nextValue <= 0) {
      delete next[materialId];
      continue;
    }
    next[materialId] = nextValue;
  }
  return next;
}

function applyDimensionDeltas(hero: Hero, deltas: DimensionDeltas): Hero {
  const next: Hero = {
    ...hero,
    coreStats: { ...hero.coreStats },
    personality: { ...hero.personality },
    secondary: {
      reputation: { ...hero.secondary.reputation },
      bossKnowledge: { ...hero.secondary.bossKnowledge },
      dungeonFamiliarity: { ...hero.secondary.dungeonFamiliarity },
    },
  };

  if (deltas.coreStats !== undefined) {
    for (const [key, value] of Object.entries(deltas.coreStats)) {
      const statKey = key as keyof Hero["coreStats"];
      next.coreStats[statKey] += value;
    }
  }

  if (deltas.personality !== undefined) {
    for (const [key, value] of Object.entries(deltas.personality)) {
      const axisKey = key as keyof Hero["personality"];
      next.personality[axisKey] += value;
    }
  }

  if (deltas.reputation !== undefined) {
    for (const [key, value] of Object.entries(deltas.reputation)) {
      const repKey = key as keyof Hero["secondary"]["reputation"];
      next.secondary.reputation[repKey] += value;
    }
  }

  if (deltas.bossKnowledgeIntel !== undefined) {
    for (const [key, value] of Object.entries(deltas.bossKnowledgeIntel)) {
      const bossKey = key as BossId;
      const current = next.secondary.bossKnowledge[bossKey];
      next.secondary.bossKnowledge[bossKey] = applyKnowledgeGain(current, "intel", value);
    }
  }

  if (deltas.bossKnowledgeDrills !== undefined) {
    for (const [key, value] of Object.entries(deltas.bossKnowledgeDrills)) {
      const bossKey = key as BossId;
      const current = next.secondary.bossKnowledge[bossKey];
      next.secondary.bossKnowledge[bossKey] = applyKnowledgeGain(current, "drills", value);
    }
  }

  if (deltas.bossKnowledgeExecution !== undefined) {
    for (const [key, value] of Object.entries(deltas.bossKnowledgeExecution)) {
      const bossKey = key as BossId;
      const current = next.secondary.bossKnowledge[bossKey];
      next.secondary.bossKnowledge[bossKey] = applyKnowledgeGain(current, "execution", value);
    }
  }

  return next;
}

const DEFAULT_STAT_WEIGHTS: Record<ActivityDefinition["category"], Record<CoreStatKey, number>> = {
  combat: { strength: 0.35, agility: 0.2, intelligence: 0.1, stamina: 0.3, charismaInfluence: 0.05 },
  knowledge: { strength: 0.05, agility: 0.1, intelligence: 0.55, stamina: 0.1, charismaInfluence: 0.2 },
  economic: { strength: 0.1, agility: 0.2, intelligence: 0.25, stamina: 0.1, charismaInfluence: 0.35 },
  social: { strength: 0.05, agility: 0.1, intelligence: 0.25, stamina: 0.05, charismaInfluence: 0.55 },
  general: { strength: 0.2, agility: 0.2, intelligence: 0.2, stamina: 0.25, charismaInfluence: 0.15 },
};

const DEFAULT_RISK_PROFILE: Record<ActivityDefinition["category"], Required<NonNullable<ActivityDefinition["riskProfile"]>>> = {
  combat: {
    coreStats: DEFAULT_STAT_WEIGHTS.combat,
    gearFactor: 0.14,
    prepFactor: 0.0015,
    knowledgeFactor: 0.02,
    minRisk: 0.04,
    maxRisk: 0.9,
  },
  knowledge: {
    coreStats: DEFAULT_STAT_WEIGHTS.knowledge,
    gearFactor: 0.06,
    prepFactor: 0.0015,
    knowledgeFactor: 0.01,
    minRisk: 0.01,
    maxRisk: 0.8,
  },
  economic: {
    coreStats: DEFAULT_STAT_WEIGHTS.economic,
    gearFactor: 0.08,
    prepFactor: 0.0012,
    knowledgeFactor: 0.01,
    minRisk: 0.01,
    maxRisk: 0.8,
  },
  social: {
    coreStats: DEFAULT_STAT_WEIGHTS.social,
    gearFactor: 0.05,
    prepFactor: 0.0015,
    knowledgeFactor: 0.01,
    minRisk: 0.005,
    maxRisk: 0.75,
  },
  general: {
    coreStats: DEFAULT_STAT_WEIGHTS.general,
    gearFactor: 0.08,
    prepFactor: 0.0012,
    knowledgeFactor: 0.01,
    minRisk: 0.01,
    maxRisk: 0.85,
  },
};

function rarityRank(rarity: GearRarity): number {
  switch (rarity) {
    case "gray":
      return 0;
    case "green":
      return 1;
    case "blue":
      return 2;
    case "purple":
      return 3;
  }
}

function countSlotsAtOrAboveRarity(hero: Hero, minRarity: GearRarity): number {
  const minRank = rarityRank(minRarity);
  return Object.values(hero.gear).reduce((count, item) => {
    if (item === null) {
      return count;
    }
    return rarityRank(item.rarity) >= minRank ? count + 1 : count;
  }, 0);
}

function readinessValue(hero: Hero, metric: GearReadinessMetric): number {
  if (metric === "greenPlusSlots") {
    return countSlotsAtOrAboveRarity(hero, "green");
  }
  if (metric === "bluePlusSlots") {
    return countSlotsAtOrAboveRarity(hero, "blue");
  }
  return countSlotsAtOrAboveRarity(hero, "purple");
}

function bandMatches(value: number, band: GearReadinessBand): boolean {
  if (band.min !== undefined && value < band.min) {
    return false;
  }
  if (band.max !== undefined && value > band.max) {
    return false;
  }
  return true;
}

function resolveReadinessFloor(hero: Hero, def: ActivityDefinition): { floor: number; label: string | null } {
  const rule = def.gearReadiness;
  if (rule === undefined) {
    return { floor: 0, label: null };
  }

  if (def.progressionTier === "capstone_raid") {
    const greenPlusSlots = countSlotsAtOrAboveRarity(hero, "green");
    if (greenPlusSlots < 5) {
      return {
        floor: 0.99,
        label: `Not even full green. Capstone is almost guaranteed death (${greenPlusSlots}/5 greenPlusSlots)`,
      };
    }
  }

  const value = readinessValue(hero, rule.metric);
  const matchedBand = rule.bands.find((band) => bandMatches(value, band));
  if (matchedBand === undefined) {
    return { floor: 0, label: null };
  }

  const metricLabelById: Record<GearReadinessMetric, string> = {
    greenPlusSlots: "green+ slots",
    bluePlusSlots: "blue+ slots",
    purpleSlots: "purple slots",
  };

  return {
    floor: matchedBand.riskFloor,
    label: `${matchedBand.label} (${value}/5 ${metricLabelById[rule.metric]})`,
  };
}

function isDungeonTier(tier: ActivityDefinition["progressionTier"]): boolean {
  return tier === "early_dungeon" || tier === "mid_dungeon";
}

const DUNGEON_FAMILIARITY_PER_SURVIVAL = 0.012;
const DUNGEON_FAMILIARITY_MAX_MITIGATION = 0.12;
const DUNGEON_ACTIVITY_IDS: DungeonActivityId[] = [
  "dungeon_irondeep",
  "dungeon_whispering_crypts",
  "dungeon_scholomance",
  "dungeon_blackrock",
];

function isTrackedDungeonActivity(activityId: ActivityId): activityId is DungeonActivityId {
  return DUNGEON_ACTIVITY_IDS.includes(activityId as DungeonActivityId);
}

function computeLevelRiskAdjustment(hero: Hero, def: ActivityDefinition): { levelPenalty: number; levelMitigation: number } {
  const range = def.levelRange;
  if (range === undefined) {
    return { levelPenalty: 0, levelMitigation: 0 };
  }

  if (hero.level < range.min) {
    const levelsBelow = range.min - hero.level;
    return {
      levelPenalty: Math.min(0.45, levelsBelow * 0.08),
      levelMitigation: 0,
    };
  }

  const span = Math.max(1, range.max - range.min);
  const progressToTop = clamp((hero.level - range.min) / span, 0, 1);
  const baseMitigation = progressToTop * 0.18;
  if (hero.level <= range.max) {
    return {
      levelPenalty: 0,
      levelMitigation: baseMitigation,
    };
  }

  const levelsAbove = hero.level - range.max;
  return {
    levelPenalty: 0,
    levelMitigation: Math.min(0.3, baseMitigation + levelsAbove * 0.03),
  };
}

function riskBandFromValue(risk: number): RiskBand {
  if (risk < 0.05) {
    return "safe";
  }
  if (risk < 0.15) {
    return "manageable";
  }
  if (risk < 0.3) {
    return "dangerous";
  }
  return "lethal";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function mergeRiskProfile(def: ActivityDefinition): Required<NonNullable<ActivityDefinition["riskProfile"]>> {
  const defaults = DEFAULT_RISK_PROFILE[def.category];
  return {
    coreStats: { ...defaults.coreStats, ...(def.riskProfile?.coreStats ?? {}) },
    gearFactor: def.riskProfile?.gearFactor ?? defaults.gearFactor,
    prepFactor: def.riskProfile?.prepFactor ?? defaults.prepFactor,
    knowledgeFactor: def.riskProfile?.knowledgeFactor ?? defaults.knowledgeFactor,
    minRisk: def.riskProfile?.minRisk ?? defaults.minRisk,
    maxRisk: def.riskProfile?.maxRisk ?? defaults.maxRisk,
  };
}

function toPercentDelta(value: number): string {
  const pct = Math.round(value * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

function buildRiskHints(def: ActivityDefinition, breakdown: ActivityRiskBreakdown): string[] {
  const rows: Array<{ label: string; amount: number; kind: "penalty" | "mitigation" }> = [
    { label: "Base danger", amount: breakdown.baseRisk, kind: "penalty" },
    { label: "Gear readiness floor", amount: breakdown.readinessFloor, kind: "penalty" },
    { label: "Level mismatch", amount: breakdown.levelPenalty, kind: "penalty" },
    { label: "Level advantage", amount: breakdown.levelMitigation, kind: "mitigation" },
    { label: "Core stats", amount: breakdown.coreStatMitigation, kind: "mitigation" },
    { label: "Preparation", amount: breakdown.prepMitigation + breakdown.knowledgeMitigation, kind: "mitigation" },
    { label: "Dungeon familiarity", amount: breakdown.dungeonFamiliarityMitigation, kind: "mitigation" },
    { label: "Legacy combat bonus", amount: breakdown.metaMitigation, kind: "mitigation" },
    { label: "Age pressure", amount: breakdown.agePenalty, kind: "penalty" },
    { label: "Reckless pressure", amount: breakdown.recklessPressure, kind: "penalty" },
  ];

  if (def.deathRisk <= 0) {
    return ["No lethal risk for this activity"];
  }

  return rows
    .filter((row) => row.amount > 0.005)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map((row) => `${row.label} ${row.kind === "penalty" ? toPercentDelta(row.amount) : toPercentDelta(-row.amount)}`);
}

export function computeActivityRisk(hero: Hero, activityId: ActivityId, meta: MetaProgression): ActivityRiskBreakdown {
  const def = ACTIVITIES[activityId];
  if (def.deathRisk <= 0) {
    return {
      baseRisk: 0,
      coreStatMitigation: 0,
      prepMitigation: 0,
      knowledgeMitigation: 0,
      metaMitigation: 0,
      dungeonFamiliarityMitigation: 0,
      levelPenalty: 0,
      levelMitigation: 0,
      agePenalty: 0,
      recklessPressure: 0,
      readinessFloor: 0,
      readinessLabel: null,
      finalRisk: 0,
      riskBand: "safe",
    };
  }

  const profile = mergeRiskProfile(def);
  const effectiveStats = getEffectiveCoreStats(hero);
  const statWeights = profile.coreStats;
  const weightedStats = (Object.entries(statWeights) as [CoreStatKey, number][])
    .reduce((sum, [key, weight]) => sum + effectiveStats[key] * weight, 0);
  const baselineStats = 5;
  const coreStatMitigation = Math.max(0, (weightedStats - baselineStats) * 0.0075);

  const prepMitigation = Math.max(0, hero.personality.preparation) * profile.prepFactor;

  let knowledgeMitigation = 0;
  if (def.progressionTier === "entry_raid" || def.progressionTier === "capstone_raid") {
    const knowledge = getBossReadiness(hero, "molten_fury");
    knowledgeMitigation = (knowledge / 100) * 0.28;
  } else if (def.category === "combat") {
    knowledgeMitigation = (Math.max(0, hero.personality.preparation) / 100) * profile.knowledgeFactor;
  }

  const metaMitigation = Math.max(0, meta.evolutionBonuses.combatBonus ?? 0) * 0.25;
  const levelAdjustment = computeLevelRiskAdjustment(hero, def);
  const dungeonFamiliarityMitigation = isDungeonTier(def.progressionTier) && isTrackedDungeonActivity(activityId)
    ? Math.min(
        DUNGEON_FAMILIARITY_MAX_MITIGATION,
        hero.secondary.dungeonFamiliarity[activityId] * DUNGEON_FAMILIARITY_PER_SURVIVAL,
      )
    : 0;

  let agePenalty = 0;
  if (hero.inGameDay >= 13 && hero.inGameDay <= 15) {
    agePenalty = (hero.inGameDay - 12) * 0.015;
  } else if (hero.inGameDay >= 16) {
    agePenalty = 0.06 + (hero.inGameDay - 16) * 0.04;
  }

  const recklessPressure =
    def.category === "combat"
      ? Math.max(0, hero.personality.ambition - 18) * 0.001 + Math.max(0, hero.personality.combatStyle - 22) * 0.0009
      : 0;

  const unclamped = def.deathRisk
    - coreStatMitigation
    - prepMitigation
    - knowledgeMitigation
    - metaMitigation
    - dungeonFamiliarityMitigation
    - levelAdjustment.levelMitigation
    + levelAdjustment.levelPenalty
    + agePenalty
    + recklessPressure;
  const clampedRisk = clamp(unclamped, profile.minRisk, profile.maxRisk);
  const readiness = resolveReadinessFloor(hero, def);
  const adjustedReadinessFloor = isDungeonTier(def.progressionTier)
    ? Math.max(0, readiness.floor - levelAdjustment.levelMitigation)
    : readiness.floor;
  const finalRisk = Math.max(clampedRisk, adjustedReadinessFloor);

  return {
    baseRisk: def.deathRisk,
    coreStatMitigation,
    prepMitigation,
    knowledgeMitigation,
    metaMitigation,
    dungeonFamiliarityMitigation,
    levelPenalty: levelAdjustment.levelPenalty,
    levelMitigation: levelAdjustment.levelMitigation,
    agePenalty,
    recklessPressure,
    readinessFloor: adjustedReadinessFloor,
    readinessLabel: readiness.label,
    finalRisk,
    riskBand: riskBandFromValue(finalRisk),
  };
}

export function resolveActivity(hero: Hero, activityId: ActivityId, meta: MetaProgression): { resolved: ResolvedActivity; updatedHero: Hero } {
  const def = ACTIVITIES[activityId];
  const goldSpent = def.goldCost ?? 0;
  const effectiveEffects: DimensionDeltas = {
    ...def.effects,
    ...(def.effects.bossKnowledgeIntel !== undefined ? { bossKnowledgeIntel: { ...def.effects.bossKnowledgeIntel } } : {}),
    ...(def.effects.bossKnowledgeDrills !== undefined ? { bossKnowledgeDrills: { ...def.effects.bossKnowledgeDrills } } : {}),
    ...(def.effects.bossKnowledgeExecution !== undefined ? { bossKnowledgeExecution: { ...def.effects.bossKnowledgeExecution } } : {}),
  };
  if (def.category === "knowledge") {
    const multiplier = meta.evolutionBonuses.knowledgeTransferMultiplier ?? 1;
    const scales: Array<"bossKnowledgeIntel" | "bossKnowledgeDrills" | "bossKnowledgeExecution"> = [
      "bossKnowledgeIntel",
      "bossKnowledgeDrills",
      "bossKnowledgeExecution",
    ];
    for (const key of scales) {
      const channelEffects = effectiveEffects[key];
      if (channelEffects === undefined) {
        continue;
      }
      for (const [bossId, baseGain] of Object.entries(channelEffects)) {
        channelEffects[bossId as BossId] = Math.round(baseGain * multiplier);
      }
    }
  }

  const riskBreakdown = computeActivityRisk(hero, activityId, meta);
  const finalDeathRisk = riskBreakdown.finalRisk;
  const died = finalDeathRisk > 0 && Math.random() < finalDeathRisk;
  const riskHints = buildRiskHints(def, riskBreakdown);

  if (activityId === "raid_molten_fury") {
    const executionGain = died ? 2 : 6;
    const existing = effectiveEffects.bossKnowledgeExecution ?? {};
    effectiveEffects.bossKnowledgeExecution = {
      ...existing,
      molten_fury: (existing.molten_fury ?? 0) + executionGain,
    };
  }

  let materialsGained: Partial<Record<MaterialId, number>> = {};
  if (!died) {
    if (activityId === "dungeon_irondeep" || activityId === "dungeon_whispering_crypts") {
      materialsGained = addMaterials(materialsGained, { iron_shards: 1 });
    }
    if (activityId === "dungeon_scholomance" || activityId === "dungeon_blackrock") {
      materialsGained = addMaterials(materialsGained, { iron_shards: 1, arcane_essence: 1 });
    }
    if (activityId === "raid_molten_fury") {
      materialsGained = addMaterials(materialsGained, { ember_core: 1 });
    }
    if (activityId === "raid_eternal_throne") {
      materialsGained = addMaterials(materialsGained, { ember_core: 2, vault_relic: 1 });
    }
  }

  // Loot drops
  const lootDropped: GearItem[] = [];
  if (!died) {
    for (const drop of def.outcomes.lootTable) {
      if (Math.random() < drop.chance) {
        if (drop.itemId !== undefined) {
          const item = GEAR_ITEMS[drop.itemId];
          if (item !== undefined) {
            lootDropped.push(item);
          }
          continue;
        }
        if (drop.rarity !== undefined) {
          const slot = drop.slot ?? randomGearSlot();
          const item = generateGear(hero.heroClass, slot, drop.rarity, hero.level, hero.gear);
          lootDropped.push(item);
        }
      }
    }
  }

  const xpGained = died ? 0 : roll(def.outcomes.xpMin, def.outcomes.xpMax);
  const goldGained = died ? 0 : roll(def.outcomes.goldMin, def.outcomes.goldMax);

  const resolved: ResolvedActivity = {
    activityId,
    xpGained,
    goldGained,
    goldSpent,
    lootDropped,
    died,
    appliedEffects: effectiveEffects,
    effectiveDeathRisk: finalDeathRisk,
    riskBand: riskBreakdown.riskBand,
    riskBreakdown,
    riskHints,
    ...(Object.keys(materialsGained).length > 0 ? { materialsGained } : {}),
  };

  // Update hero dimensions and gold
  let updatedHero: Hero = {
    ...applyDimensionDeltas(hero, effectiveEffects),
    gold: hero.gold + goldGained - goldSpent,
    materials: addMaterials(hero.materials, materialsGained),
  };

  if (!died && isDungeonTier(def.progressionTier) && isTrackedDungeonActivity(activityId)) {
    updatedHero = {
      ...updatedHero,
      secondary: {
        ...updatedHero.secondary,
        dungeonFamiliarity: {
          ...updatedHero.secondary.dungeonFamiliarity,
          [activityId]: updatedHero.secondary.dungeonFamiliarity[activityId] + 1,
        },
      },
    };
  }

  // Raid defeat tracking
  if (activityId === "raid_molten_fury" && !died) {
    updatedHero = {
      ...updatedHero,
      raidLockouts: { ...updatedHero.raidLockouts, molten_fury: hero.inGameDay },
    };
  }
  if (activityId === "raid_eternal_throne" && !died) {
    updatedHero = {
      ...updatedHero,
      raidLockouts: { ...updatedHero.raidLockouts, eternal_throne: hero.inGameDay },
    };
  }

  // Equip better loot automatically
  for (const item of lootDropped) {
    const currentInSlot = updatedHero.gear[item.slot];
    if (currentInSlot === null || sumGearStats(item) > sumGearStats(currentInSlot)) {
      updatedHero = {
        ...updatedHero,
        gear: { ...updatedHero.gear, [item.slot]: item },
      };
    }
  }

  return { resolved, updatedHero };
}

export function isActivityUnlocked(hero: Hero, def: ActivityDefinition, meta: MetaProgression): boolean {
  const cond = def.unlockConditions;
  if (cond === undefined) {
    return true;
  }
  if (cond.requiresRaidDeath === true && meta.raidDeaths < 1) {
    return false;
  }
  if (cond.minLevel !== undefined && hero.level < cond.minLevel) {
    return false;
  }
  if (cond.minCoreStats !== undefined) {
    for (const [key, value] of Object.entries(cond.minCoreStats)) {
      if (hero.coreStats[key as keyof Hero["coreStats"]] < value) {
        return false;
      }
    }
  }
  if (cond.minPersonality !== undefined) {
    for (const [key, value] of Object.entries(cond.minPersonality)) {
      if (hero.personality[key as keyof Hero["personality"]] < value) {
        return false;
      }
    }
  }
  if (cond.minReputation !== undefined) {
    for (const [key, value] of Object.entries(cond.minReputation)) {
      if (hero.secondary.reputation[key as keyof Hero["secondary"]["reputation"]] < value) {
        return false;
      }
    }
  }
  if (cond.minBossKnowledge !== undefined) {
    for (const [key, value] of Object.entries(cond.minBossKnowledge)) {
      if (getBossReadiness(hero, key as BossId) < value) {
        return false;
      }
    }
  }
  if (cond.minGreenPlusSlots !== undefined && countSlotsAtOrAboveRarity(hero, "green") < cond.minGreenPlusSlots) {
    return false;
  }
  if (cond.minBluePlusSlots !== undefined && countSlotsAtOrAboveRarity(hero, "blue") < cond.minBluePlusSlots) {
    return false;
  }
  if (cond.minPurpleSlots !== undefined && countSlotsAtOrAboveRarity(hero, "purple") < cond.minPurpleSlots) {
    return false;
  }
  return true;
}

export function getActivityUnlockGaps(hero: Hero, def: ActivityDefinition, meta: MetaProgression): string[] {
  const cond = def.unlockConditions;
  if (cond === undefined) {
    return [];
  }

  const gaps: string[] = [];
  if (cond.requiresRaidDeath === true && meta.raidDeaths < 1) {
    gaps.push("Die to a raid once");
  }
  if (cond.minLevel !== undefined && hero.level < cond.minLevel) {
    gaps.push(`Level ${cond.minLevel}`);
  }
  if (cond.minCoreStats !== undefined) {
    for (const [key, value] of Object.entries(cond.minCoreStats)) {
      const need = value;
      const current = hero.coreStats[key as keyof Hero["coreStats"]];
      if (current < need) {
        gaps.push(`${key} ${current}/${need}`);
      }
    }
  }
  if (cond.minPersonality !== undefined) {
    for (const [key, value] of Object.entries(cond.minPersonality)) {
      const need = value;
      const current = hero.personality[key as keyof Hero["personality"]];
      if (current < need) {
        gaps.push(`${key} ${current}/${need}`);
      }
    }
  }
  if (cond.minReputation !== undefined) {
    for (const [key, value] of Object.entries(cond.minReputation)) {
      const need = value;
      const current = hero.secondary.reputation[key as keyof Hero["secondary"]["reputation"]];
      if (current < need) {
        gaps.push(`${key} rep ${current}/${need}`);
      }
    }
  }
  if (cond.minBossKnowledge !== undefined) {
    for (const [key, value] of Object.entries(cond.minBossKnowledge)) {
      const need = value;
      const current = getBossReadiness(hero, key as BossId);
      if (current < need) {
        gaps.push(`${key} knowledge ${Math.round(current)}/${need}`);
      }
    }
  }
  const greenPlus = countSlotsAtOrAboveRarity(hero, "green");
  if (cond.minGreenPlusSlots !== undefined && greenPlus < cond.minGreenPlusSlots) {
    gaps.push(`green+ slots ${greenPlus}/${cond.minGreenPlusSlots}`);
  }
  const bluePlus = countSlotsAtOrAboveRarity(hero, "blue");
  if (cond.minBluePlusSlots !== undefined && bluePlus < cond.minBluePlusSlots) {
    gaps.push(`blue+ slots ${bluePlus}/${cond.minBluePlusSlots}`);
  }
  const purple = countSlotsAtOrAboveRarity(hero, "purple");
  if (cond.minPurpleSlots !== undefined && purple < cond.minPurpleSlots) {
    gaps.push(`purple slots ${purple}/${cond.minPurpleSlots}`);
  }
  return gaps;
}

export function canAffordActivities(activities: ActivityId[], maxEnergy: number): boolean {
  const total = activities.reduce((sum, id) => {
    const def = ACTIVITIES[id];
    return sum + def.energyCost;
  }, 0);
  return total <= maxEnergy;
}

export function totalEnergyCost(activities: ActivityId[]): number {
  return activities.reduce((sum, id) => {
    const def = ACTIVITIES[id];
    return sum + def.energyCost;
  }, 0);
}
