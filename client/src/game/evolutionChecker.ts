import { EVOLUTIONS } from "../data/evolutions";
import type { BossId, EvolutionId, EvolutionUnlockCondition, Hero, MetaProgression } from "../data/types";
import { getBossReadiness } from "./bossKnowledge";

export interface EvolutionCheckResult {
  unlocked: EvolutionId | null;
  almostUnlocked: EvolutionId | null;
  almostReason: string | null;
  whyUnlocked: string | null;
}

export function checkEvolutionOnDeath(hero: Hero, meta: MetaProgression, defeatedRaids: BossId[]): EvolutionCheckResult {
  const alreadyUnlocked = new Set(meta.unlockedEvolutions);

  // Evaluate all evolutions for eligibility
  let bestMatch: EvolutionId | null = null;
  let bestTier = 0;
  let whyUnlocked: string | null = null;

  // Near-miss tracking
  let almostUnlocked: EvolutionId | null = null;
  let almostReason: string | null = null;
  let bestNearMissScore = 0;

  for (const evo of Object.values(EVOLUTIONS)) {
    // Skip already collected
    if (alreadyUnlocked.has(evo.id)) {
      continue;
    }

    // Check prerequisites met
    const prereqsMet = evo.prerequisites.every((prereq) => alreadyUnlocked.has(prereq));

    const cond = evo.unlockCondition;
    const checks = evaluateChecks(hero, cond, defeatedRaids);

    const allPassed = Object.values(checks).every(Boolean);
    const passedCount = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.values(checks).length;

    if (allPassed && prereqsMet && evo.tier > bestTier) {
      bestMatch = evo.id;
      bestTier = evo.tier;
      whyUnlocked = buildWhyString(evo.id, hero, defeatedRaids);
    } else if (!allPassed || !prereqsMet) {
      // Near-miss: passed most conditions
      const score = passedCount / totalChecks;
      if (score > bestNearMissScore && score >= 0.5) {
        bestNearMissScore = score;
        almostUnlocked = evo.id;
        almostReason = buildAlmostReason(evo.id, checks, prereqsMet, cond, hero, defeatedRaids);
      }
    }
  }

  return { unlocked: bestMatch, almostUnlocked, almostReason, whyUnlocked };
}

function evaluateChecks(hero: Hero, cond: EvolutionUnlockCondition, defeatedRaids: BossId[]): Record<string, boolean> {
  const checks: Record<string, boolean> = {};

  if (cond.minCoreStats !== undefined) {
    for (const [key, value] of Object.entries(cond.minCoreStats)) {
      checks[`core_${key}`] = hero.coreStats[key as keyof Hero["coreStats"]] >= value;
    }
  }
  if (cond.minPersonality !== undefined) {
    for (const [key, value] of Object.entries(cond.minPersonality)) {
      checks[`axis_${key}`] = hero.personality[key as keyof Hero["personality"]] >= value;
    }
  }
  if (cond.minBossKnowledge !== undefined) {
    for (const [key, value] of Object.entries(cond.minBossKnowledge)) {
      checks[`knowledge_${key}`] = getBossReadiness(hero, key as BossId) >= value;
    }
  }
  if (cond.minGoldAtDeath !== undefined) {
    checks.gold = hero.gold >= cond.minGoldAtDeath;
  }
  if (cond.mustDefeatRaids !== undefined) {
    for (const raidId of cond.mustDefeatRaids) {
      checks[`raid_${raidId}`] = defeatedRaids.includes(raidId);
    }
  }

  if (Object.keys(checks).length === 0) {
    checks.default = true;
  }
  return checks;
}

function buildWhyString(id: EvolutionId, hero: Hero, defeatedRaids: BossId[]): string {
  const p = hero.personality;
  switch (id) {
    case "berserker":
      return `You lived for dangerous combat (Combat Style: ${p.combatStyle}, Ambition: ${p.ambition}, Strength: ${hero.coreStats.strength}).`;
    case "merchant":
      return `You prioritized wealth and influence (Economic Focus: ${p.economicFocus}, Charisma: ${hero.coreStats.charismaInfluence}, Gold: ${hero.gold}g).`;
    case "scholar":
      return `You invested deeply in preparation and study (Preparation: ${p.preparation}, Intelligence: ${hero.coreStats.intelligence}, Molten Fury readiness: ${Math.round(getBossReadiness(hero, "molten_fury"))}%).`;
    case "raid_legend":
      return `You combined high combat and preparation with a raid victory${defeatedRaids.includes("molten_fury") ? " over Molten Fury" : ""}.`;
  }
  return "Your hero's combined choices forged a new legacy.";
}

type CheckMap = Record<string, boolean>;

function buildAlmostReason(
  id: EvolutionId,
  checks: CheckMap,
  prereqsMet: boolean,
  cond: EvolutionUnlockCondition,
  hero: Hero,
  defeatedRaids: BossId[],
): string {
  if (!prereqsMet) {
    const evo = EVOLUTIONS[id];
    return `Unlock prerequisites first: ${evo.prerequisites.join(" + ")}.`;
  }
  const parts: string[] = [];

  if (cond.minCoreStats !== undefined) {
    for (const [key, value] of Object.entries(cond.minCoreStats)) {
      const need = value;
      const current = hero.coreStats[key as keyof Hero["coreStats"]];
      if (current < need) {
        parts.push(`${need - current} more ${key} needed`);
      }
    }
  }
  if (cond.minPersonality !== undefined) {
    for (const [key, value] of Object.entries(cond.minPersonality)) {
      const need = value;
      const current = hero.personality[key as keyof Hero["personality"]];
      if (current < need) {
        parts.push(`${need - current} more ${key} needed`);
      }
    }
  }
  if (checks.gold === false && cond.minGoldAtDeath !== undefined) {
    parts.push(`${cond.minGoldAtDeath - hero.gold}g more gold needed`);
  }
  if (cond.minBossKnowledge !== undefined) {
    for (const [key, value] of Object.entries(cond.minBossKnowledge)) {
      const need = value;
      const current = getBossReadiness(hero, key as BossId);
      if (current < need) {
        parts.push(`${need - Math.round(current)}% more ${key} knowledge needed`);
      }
    }
  }
  if (cond.mustDefeatRaids !== undefined) {
    for (const raidId of cond.mustDefeatRaids) {
      if (!defeatedRaids.includes(raidId)) {
        parts.push(`must defeat ${raidId}`);
      }
    }
  }
  return parts.length > 0 ? parts.join(", ") + "." : "Almost there!";
}

export function stackEvolutionBonuses(unlockedIds: EvolutionId[]) {
  let energyBonus = 0;
  let startGold = 0;
  let combatBonus = 0;
  let bossKnowledgeBonus = 0;
  let knowledgeTransferMultiplier = 1;
  let vendorDiscountPct = 0;
  let recipeDiscountPct = 0;
  let purpleCraftBonusPct = 0;
  let brokerTierStart: 1 | 2 | 3 = 1;
  let raidProvisionerUnlocked = false;

  for (const id of unlockedIds) {
    const evo = EVOLUTIONS[id];
    energyBonus += evo.bonuses.energyBonus;
    startGold += evo.bonuses.startGold ?? 0;
    combatBonus += evo.bonuses.combatBonus ?? 0;
    bossKnowledgeBonus += evo.bonuses.bossKnowledgeBonus ?? 0;
    vendorDiscountPct += evo.bonuses.vendorDiscountPct ?? 0;
    recipeDiscountPct += evo.bonuses.recipeDiscountPct ?? 0;
    purpleCraftBonusPct += evo.bonuses.purpleCraftBonusPct ?? 0;
    const candidate = evo.bonuses.brokerTierStart ?? 1;
    const merged = Math.max(brokerTierStart, candidate);
    brokerTierStart = merged >= 3 ? 3 : merged >= 2 ? 2 : 1;
    raidProvisionerUnlocked = raidProvisionerUnlocked || (evo.bonuses.raidProvisionerUnlocked ?? false);
    if ((evo.bonuses.knowledgeTransferMultiplier ?? 1) > knowledgeTransferMultiplier) {
      knowledgeTransferMultiplier = evo.bonuses.knowledgeTransferMultiplier ?? 1;
    }
  }

  return {
    energyBonus,
    startGold,
    combatBonus,
    bossKnowledgeBonus,
    knowledgeTransferMultiplier,
    vendorDiscountPct,
    recipeDiscountPct,
    purpleCraftBonusPct,
    brokerTierStart,
    raidProvisionerUnlocked,
  };
}
