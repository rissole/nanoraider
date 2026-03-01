import { ACTIVITIES } from "../data/activities";
import { GEAR_ITEMS } from "../data/gear";
import type {
  ActivityDefinition,
  ActivityId,
  ActivityRiskBreakdown,
  BossId,
  CoreStatKey,
  DimensionDeltas,
  GearItem,
  Hero,
  MetaProgression,
  RiskBand,
  ResolvedActivity,
} from "../data/types";

function roll(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function applyDimensionDeltas(hero: Hero, deltas: DimensionDeltas): Hero {
  const next: Hero = {
    ...hero,
    coreStats: { ...hero.coreStats },
    personality: { ...hero.personality },
    secondary: {
      reputation: { ...hero.secondary.reputation },
      bossKnowledge: { ...hero.secondary.bossKnowledge },
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

  if (deltas.bossKnowledge !== undefined) {
    for (const [key, value] of Object.entries(deltas.bossKnowledge)) {
      const bossKey = key as BossId;
      const current = next.secondary.bossKnowledge[bossKey];
      next.secondary.bossKnowledge[bossKey] = Math.min(100, Math.max(0, current + value));
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

function sumGearPower(hero: Hero): number {
  return Object.values(hero.gear).reduce((sum, item) => sum + (item?.itemPower ?? 0), 0);
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
    { label: "Core stats", amount: breakdown.coreStatMitigation, kind: "mitigation" },
    { label: "Gear", amount: breakdown.gearMitigation, kind: "mitigation" },
    { label: "Preparation", amount: breakdown.prepMitigation + breakdown.knowledgeMitigation, kind: "mitigation" },
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
      gearMitigation: 0,
      prepMitigation: 0,
      knowledgeMitigation: 0,
      metaMitigation: 0,
      agePenalty: 0,
      recklessPressure: 0,
      finalRisk: 0,
      riskBand: "safe",
    };
  }

  const profile = mergeRiskProfile(def);
  const statWeights = profile.coreStats;
  const weightedStats = (Object.entries(statWeights) as [CoreStatKey, number][])
    .reduce((sum, [key, weight]) => sum + hero.coreStats[key] * weight, 0);
  const baselineStats = 5;
  const coreStatMitigation = Math.max(0, (weightedStats - baselineStats) * 0.0075);

  const gearPower = sumGearPower(hero);
  const gearMitigation = (Math.min(800, gearPower) / 800) * profile.gearFactor;

  const prepMitigation = Math.max(0, hero.personality.preparation) * profile.prepFactor;

  let knowledgeMitigation = 0;
  if (activityId === "raid_molten_fury") {
    const knowledge = hero.secondary.bossKnowledge["molten_fury"];
    knowledgeMitigation = (knowledge / 100) * 0.28;
  } else if (def.category === "combat") {
    knowledgeMitigation = (Math.max(0, hero.personality.preparation) / 100) * profile.knowledgeFactor;
  }

  const metaMitigation = Math.max(0, meta.evolutionBonuses.combatBonus ?? 0) * 0.25;

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

  const unclamped = def.deathRisk - coreStatMitigation - gearMitigation - prepMitigation - knowledgeMitigation - metaMitigation + agePenalty + recklessPressure;
  const finalRisk = clamp(unclamped, profile.minRisk, profile.maxRisk);

  return {
    baseRisk: def.deathRisk,
    coreStatMitigation,
    gearMitigation,
    prepMitigation,
    knowledgeMitigation,
    metaMitigation,
    agePenalty,
    recklessPressure,
    finalRisk,
    riskBand: riskBandFromValue(finalRisk),
  };
}

export function resolveActivity(hero: Hero, activityId: ActivityId, meta: MetaProgression): { resolved: ResolvedActivity; updatedHero: Hero } {
  const def = ACTIVITIES[activityId];
  const effectiveEffects: DimensionDeltas = {
    ...def.effects,
    ...(def.effects.bossKnowledge !== undefined ? { bossKnowledge: { ...def.effects.bossKnowledge } } : {}),
  };
  if (activityId === "study_boss" && effectiveEffects.bossKnowledge !== undefined) {
    const multiplier = meta.evolutionBonuses.knowledgeTransferMultiplier ?? 1;
    for (const [bossId, baseGain] of Object.entries(effectiveEffects.bossKnowledge)) {
      effectiveEffects.bossKnowledge[bossId as BossId] = Math.round(baseGain * multiplier);
    }
  }

  const riskBreakdown = computeActivityRisk(hero, activityId, meta);
  const finalDeathRisk = riskBreakdown.finalRisk;
  const died = finalDeathRisk > 0 && Math.random() < finalDeathRisk;
  const riskHints = buildRiskHints(def, riskBreakdown);

  // Loot drops
  const lootDropped: GearItem[] = [];
  if (!died) {
    for (const drop of def.outcomes.lootTable) {
      if (Math.random() < drop.chance) {
        const item = GEAR_ITEMS[drop.itemId];
        if (item !== undefined) {
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
    lootDropped,
    died,
    appliedEffects: effectiveEffects,
    effectiveDeathRisk: finalDeathRisk,
    riskBand: riskBreakdown.riskBand,
    riskBreakdown,
    riskHints,
  };

  // Update hero dimensions and gold
  let updatedHero: Hero = {
    ...applyDimensionDeltas(hero, effectiveEffects),
    gold: hero.gold + goldGained,
  };

  // Raid defeat tracking
  if (activityId === "raid_molten_fury" && !died) {
    updatedHero = {
      ...updatedHero,
      raidLockouts: { ...updatedHero.raidLockouts, molten_fury: hero.inGameDay },
    };
  }

  // Equip better loot automatically
  for (const item of lootDropped) {
    const currentInSlot = updatedHero.gear[item.slot];
    if (currentInSlot === null || item.itemPower > currentInSlot.itemPower) {
      updatedHero = {
        ...updatedHero,
        gear: { ...updatedHero.gear, [item.slot]: item },
      };
    }
  }

  return { resolved, updatedHero };
}

export function isActivityUnlocked(hero: Hero, def: ActivityDefinition): boolean {
  const cond = def.unlockConditions;
  if (cond === undefined) {
    return true;
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
      if (hero.secondary.bossKnowledge[key as BossId] < value) {
        return false;
      }
    }
  }
  return true;
}

export function getActivityUnlockGaps(hero: Hero, def: ActivityDefinition): string[] {
  const cond = def.unlockConditions;
  if (cond === undefined) {
    return [];
  }

  const gaps: string[] = [];
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
      const current = hero.secondary.bossKnowledge[key as BossId];
      if (current < need) {
        gaps.push(`${key} knowledge ${Math.round(current)}/${need}`);
      }
    }
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
