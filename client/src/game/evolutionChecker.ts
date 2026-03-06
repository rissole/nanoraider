import { EVOLUTIONS } from "../data/evolutions";
import type { BossId, EvolutionId, EvolutionUnlockCondition, Hero, MetaProgression, TriangleKey } from "../data/types";
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

  if (cond.minTriangle !== undefined) {
    for (const [key, value] of Object.entries(cond.minTriangle)) {
      checks[`tri_min_${key}`] = hero.triangle[key as TriangleKey] >= value;
    }
  }
  if (cond.maxTriangle !== undefined) {
    for (const [key, value] of Object.entries(cond.maxTriangle)) {
      checks[`tri_max_${key}`] = hero.triangle[key as TriangleKey] <= value;
    }
  }
  if (cond.minBossReadiness !== undefined) {
    for (const [key, value] of Object.entries(cond.minBossReadiness)) {
      checks[`readiness_${key}`] = getBossReadiness(hero, key as BossId) >= value;
    }
  }
  if (cond.minRenown !== undefined) {
    checks.renown = hero.renown >= cond.minRenown;
  }
  if (cond.minDaring !== undefined) {
    checks.minDaring = hero.daring >= cond.minDaring;
  }
  if (cond.maxDaring !== undefined) {
    checks.maxDaring = hero.daring <= cond.maxDaring;
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
  const t = hero.triangle;
  switch (id) {
    case "berserker":
      return `You became a war-focused hero (War ${t.war} / Wit ${t.wit} / Wealth ${t.wealth}) with daring ${hero.daring}.`;
    case "merchant":
      return `You prioritized economic growth (Wealth ${t.wealth}) and accumulated ${hero.gold}g.`;
    case "scholar":
      return `You invested heavily in wit and preparation (Wit ${t.wit}, Molten Fury readiness ${Math.round(getBossReadiness(hero, "molten_fury"))}%).`;
    case "raid_legend":
      return `You blended War + Wit with raid execution${defeatedRaids.includes("molten_fury") ? " over Molten Fury" : ""}.`;
    case "guardian":
      return `You survived through discipline (War ${t.war}, Daring ${hero.daring}).`;
    case "theorycrafter":
      return `You solved encounters through preparation and readiness (${Math.round(getBossReadiness(hero, "molten_fury"))}% readiness).`;
    case "socialite":
      return `You invested deeply in social standing (Renown ${hero.renown}).`;
    case "warlord":
      return `You led from the front with overwhelming war focus (War ${t.war}) and high daring (${hero.daring}).`;
    case "dungeon_master":
      return `You mastered dungeon pacing through balanced war and wit (War ${t.war}, Wit ${t.wit}).`;
    case "guildmaster":
      return `You built an empire of allies and wealth (Renown ${hero.renown}, Wealth ${t.wealth}, Gold ${hero.gold}g).`;
    case "treasure_hunter":
      return `You found riches others missed (Wealth ${t.wealth}, Daring ${hero.daring}, Gold ${hero.gold}g).`;
    case "raid_leader":
      return `You led armies against gods and won${defeatedRaids.includes("eternal_throne") ? " over the Eternal Throne" : ""}.`;
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

  if (cond.minTriangle !== undefined) {
    for (const [key, value] of Object.entries(cond.minTriangle)) {
      const need = value;
      const current = hero.triangle[key as TriangleKey];
      if (current < need) {
        parts.push(`${need - current} more ${key} needed`);
      }
    }
  }
  if (cond.maxTriangle !== undefined) {
    for (const [key, value] of Object.entries(cond.maxTriangle)) {
      const need = value;
      const current = hero.triangle[key as TriangleKey];
      if (current > need) {
        parts.push(`${current - need} less ${key} needed`);
      }
    }
  }
  if (cond.minRenown !== undefined && hero.renown < cond.minRenown) {
    parts.push(`${cond.minRenown - hero.renown} more renown needed`);
  }
  if (cond.minDaring !== undefined && hero.daring < cond.minDaring) {
    parts.push(`${cond.minDaring - hero.daring} more daring needed`);
  }
  if (cond.maxDaring !== undefined && hero.daring > cond.maxDaring) {
    parts.push(`${hero.daring - cond.maxDaring} less daring needed`);
  }
  if (checks.gold === false && cond.minGoldAtDeath !== undefined) {
    parts.push(`${cond.minGoldAtDeath - hero.gold}g more gold needed`);
  }
  if (cond.minBossReadiness !== undefined) {
    for (const [key, value] of Object.entries(cond.minBossReadiness)) {
      const need = value;
      const current = getBossReadiness(hero, key as BossId);
      if (current < need) {
        parts.push(`${need - Math.round(current)}% more ${key} readiness needed`);
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

export interface EvolutionRecommendation {
  evolutionId: EvolutionId;
  gapSummary: string;
  hint: string;
}

/** Returns top 1–3 evolution recommendations for Planning screen. Priority: 1) path match, 2) unlocks breadth, 3) lowest tier. */
export function getTopEvolutionRecommendations(
  hero: Hero,
  meta: MetaProgression,
  defeatedRaids: BossId[] = [],
  maxCount = 3,
): EvolutionRecommendation[] {
  const alreadyUnlocked = new Set(meta.unlockedEvolutions);
  const locked = Object.values(EVOLUTIONS).filter((e) => {
    if (alreadyUnlocked.has(e.id)) {
      return false;
    }

    return e.prerequisites.every((p) => alreadyUnlocked.has(p));
  });
  if (locked.length === 0) {
    return [];
  }

  type Scored = {
    evo: (typeof EVOLUTIONS)[EvolutionId];
    checkScore: number;
    prereqPathScore: number;
    unlocksBreadth: number;
    gapSummary: string;
  };

  const scored: Scored[] = locked.map((evo) => {
    const prereqsMet = evo.prerequisites.every((p) => alreadyUnlocked.has(p));
    const prereqPathScore =
      evo.prerequisites.length === 0
        ? 1
        : evo.prerequisites.filter((p) => alreadyUnlocked.has(p)).length / evo.prerequisites.length;

    const cond = evo.unlockCondition;
    const checks = evaluateChecks(hero, cond, defeatedRaids);
    const passedCount = Object.values(checks).filter(Boolean).length;
    const totalChecks = Math.max(1, Object.keys(checks).length);
    const checkScore = passedCount / totalChecks;

    const gapSummary = buildAlmostReason(evo.id, checks, prereqsMet, cond, hero, defeatedRaids);

    return {
      evo,
      checkScore,
      prereqPathScore,
      unlocksBreadth: evo.unlocksPath.length,
      gapSummary,
    };
  });

  const picked: EvolutionId[] = [];
  const pickedSet = new Set<EvolutionId>();

  // Priority 1: best path match (checkScore first, prereqPathScore tiebreaker)
  const byPathMatch = [...scored].sort((a, b) => {
    if (b.checkScore !== a.checkScore) {
      return b.checkScore - a.checkScore;
    }
    return b.prereqPathScore - a.prereqPathScore;
  });
  const bestPath = byPathMatch[0];
  if (bestPath && !pickedSet.has(bestPath.evo.id)) {
    picked.push(bestPath.evo.id);
    pickedSet.add(bestPath.evo.id);
  }

  // Priority 2: best unlocks breadth among remaining
  const remainingForBreadth = scored.filter((s) => !pickedSet.has(s.evo.id));
  const byBreadth = [...remainingForBreadth].sort((a, b) => b.unlocksBreadth - a.unlocksBreadth);
  const bestBreadth = byBreadth[0];
  if (bestBreadth && !pickedSet.has(bestBreadth.evo.id)) {
    picked.push(bestBreadth.evo.id);
    pickedSet.add(bestBreadth.evo.id);
  }

  // Priority 3: lowest tier among remaining
  const remainingForTier = scored.filter((s) => !pickedSet.has(s.evo.id));
  const byTier = [...remainingForTier].sort((a, b) => {
    if (a.evo.tier !== b.evo.tier) {
      return a.evo.tier - b.evo.tier;
    }
    return b.checkScore - a.checkScore;
  });
  const bestTier = byTier[0];
  if (bestTier && !pickedSet.has(bestTier.evo.id)) {
    picked.push(bestTier.evo.id);
    pickedSet.add(bestTier.evo.id);
  }

  const pickedScored = picked
    .slice(0, maxCount)
    .map((id) => scored.find((x) => x.evo.id === id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);
  return pickedScored.map((s) => ({
    evolutionId: s.evo.id,
    gapSummary: s.gapSummary,
    hint: EVOLUTIONS[s.evo.id].hint,
  }));
}

export function stackEvolutionBonuses(unlockedIds: EvolutionId[]) {
  let energyBonus = 0;
  let startGold = 0;
  let combatBonus = 0;
  let bossReadinessBonus = 0;
  let knowledgeTransferMultiplier = 1;
  let vendorDiscountPct = 0;
  let recipeDiscountPct = 0;
  let purpleCraftStatBonusPct = 0;
  let brokerTierStart: 1 | 2 | 3 = 1;
  let raidProvisionerUnlocked = false;

  for (const id of unlockedIds) {
    const evo = EVOLUTIONS[id];
    energyBonus += evo.bonuses.energyBonus;
    startGold += evo.bonuses.startGold ?? 0;
    combatBonus += evo.bonuses.combatBonus ?? 0;
    bossReadinessBonus += evo.bonuses.bossReadinessBonus ?? 0;
    vendorDiscountPct += evo.bonuses.vendorDiscountPct ?? 0;
    recipeDiscountPct += evo.bonuses.recipeDiscountPct ?? 0;
    purpleCraftStatBonusPct += evo.bonuses.purpleCraftStatBonusPct ?? 0;
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
    bossReadinessBonus,
    knowledgeTransferMultiplier,
    vendorDiscountPct,
    recipeDiscountPct,
    purpleCraftStatBonusPct,
    brokerTierStart,
    raidProvisionerUnlocked,
  };
}
