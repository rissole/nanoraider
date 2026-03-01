import { EVOLUTIONS } from "../data/evolutions";
import type { EvolutionId, Hero, MetaProgression } from "../data/types";

export interface EvolutionCheckResult {
  unlocked: EvolutionId | null;
  almostUnlocked: EvolutionId | null;
  almostReason: string | null;
  whyUnlocked: string | null;
}

export function checkEvolutionOnDeath(hero: Hero, meta: MetaProgression, raidDefeated: boolean): EvolutionCheckResult {
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
    const p = hero.personality;
    const knowledge = hero.bossKnowledge["molten_fury"] ?? 0;

    const checks = {
      aggression: cond.minAggression === undefined || p.aggression >= cond.minAggression,
      wisdom: cond.minWisdom === undefined || p.wisdom >= cond.minWisdom,
      greed: cond.minGreed === undefined || p.greed >= cond.minGreed,
      recklessness: cond.minRecklessness === undefined || p.recklessness >= cond.minRecklessness,
      gold: cond.minGoldAtDeath === undefined || hero.gold >= cond.minGoldAtDeath,
      knowledge: cond.minBossKnowledge === undefined || knowledge >= cond.minBossKnowledge,
      raid: cond.mustDefeatRaid !== true || raidDefeated,
    };

    const allPassed = Object.values(checks).every(Boolean);
    const passedCount = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.values(checks).length;

    if (allPassed && prereqsMet && evo.tier > bestTier) {
      bestMatch = evo.id;
      bestTier = evo.tier;
      whyUnlocked = buildWhyString(evo.id, hero, raidDefeated);
    } else if (!allPassed || !prereqsMet) {
      // Near-miss: passed most conditions
      const score = passedCount / totalChecks;
      if (score > bestNearMissScore && score >= 0.5) {
        bestNearMissScore = score;
        almostUnlocked = evo.id;
        almostReason = buildAlmostReason(evo.id, checks, prereqsMet, cond, p, hero.gold, knowledge, raidDefeated);
      }
    }
  }

  return { unlocked: bestMatch, almostUnlocked, almostReason, whyUnlocked };
}

function buildWhyString(id: EvolutionId, hero: Hero, raidDefeated: boolean): string {
  const p = hero.personality;
  switch (id) {
    case "berserker":
      return `You spent most of your time in dangerous combat (Aggression: ${p.aggression}, Recklessness: ${p.recklessness}).`;
    case "merchant":
      return `You accumulated wealth above all else (Greed: ${p.greed}, Gold at death: ${hero.gold}g).`;
    case "scholar":
      return `You prioritised knowledge and preparation (Wisdom: ${p.wisdom}, Boss knowledge: ${Math.round(hero.bossKnowledge["molten_fury"] ?? 0)}%).`;
    case "raid_legend":
      return `You combined combat mastery with deep boss knowledge ${raidDefeated ? "and defeated Molten Fury" : ""}.`;
  }
}

type CheckMap = Record<string, boolean>;

function buildAlmostReason(
  id: EvolutionId,
  checks: CheckMap,
  prereqsMet: boolean,
  cond: { minAggression?: number; minWisdom?: number; minGreed?: number; minBossKnowledge?: number; mustDefeatRaid?: boolean; minGoldAtDeath?: number },
  p: { aggression: number; wisdom: number; greed: number },
  gold: number,
  knowledge: number,
  raidDefeated: boolean,
): string {
  if (!prereqsMet) {
    const evo = EVOLUTIONS[id];
    return `Unlock prerequisites first: ${evo.prerequisites.join(" + ")}.`;
  }
  const parts: string[] = [];
  if (checks["aggression"] === false && cond.minAggression !== undefined) {
    parts.push(`${cond.minAggression - p.aggression} more Aggression needed`);
  }
  if (checks["wisdom"] === false && cond.minWisdom !== undefined) {
    parts.push(`${cond.minWisdom - p.wisdom} more Wisdom needed`);
  }
  if (checks["greed"] === false && cond.minGreed !== undefined) {
    parts.push(`${cond.minGreed - p.greed} more Greed needed`);
  }
  if (checks["gold"] === false && cond.minGoldAtDeath !== undefined) {
    parts.push(`${cond.minGoldAtDeath - gold}g more gold needed`);
  }
  if (checks["knowledge"] === false && cond.minBossKnowledge !== undefined) {
    parts.push(`${cond.minBossKnowledge - Math.round(knowledge)}% more boss knowledge needed`);
  }
  if (checks["raid"] === false && cond.mustDefeatRaid === true && !raidDefeated) {
    parts.push("must defeat Molten Fury");
  }
  return parts.length > 0 ? parts.join(", ") + "." : "Almost there!";
}

export function stackEvolutionBonuses(unlockedIds: EvolutionId[]) {
  let energyBonus = 0;
  let startGold = 0;
  let combatBonus = 0;
  let bossKnowledgeBonus = 0;
  let knowledgeTransferMultiplier = 1;

  for (const id of unlockedIds) {
    const evo = EVOLUTIONS[id];
    energyBonus += evo.bonuses.energyBonus;
    startGold += evo.bonuses.startGold ?? 0;
    combatBonus += evo.bonuses.combatBonus ?? 0;
    bossKnowledgeBonus += evo.bonuses.bossKnowledgeBonus ?? 0;
    if ((evo.bonuses.knowledgeTransferMultiplier ?? 1) > knowledgeTransferMultiplier) {
      knowledgeTransferMultiplier = evo.bonuses.knowledgeTransferMultiplier ?? 1;
    }
  }

  return { energyBonus, startGold, combatBonus, bossKnowledgeBonus, knowledgeTransferMultiplier };
}
