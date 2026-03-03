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
    case "guardian":
      return `You stood firm when others fled (Stamina: ${hero.coreStats.stamina}, Preparation: ${p.preparation}).`;
    case "theorycrafter":
      return `You calculated every variable before stepping inside (Preparation: ${p.preparation}, Molten Fury readiness: ${Math.round(getBossReadiness(hero, "molten_fury"))}%).`;
    case "socialite":
      return `You knew everyone worth knowing (Social Style: ${p.socialStyle}, Charisma: ${hero.coreStats.charismaInfluence}).`;
    case "warlord":
      return `You led from the front, blade in hand (Strength: ${hero.coreStats.strength}, Combat Style: ${p.combatStyle}).`;
    case "dungeon_master":
      return `You cleared a thousand dungeons and knew every trash pack (Strength: ${hero.coreStats.strength}, Preparation: ${p.preparation}).`;
    case "guildmaster":
      return `You built an empire of loyal allies (Social Style: ${p.socialStyle}, Charisma: ${hero.coreStats.charismaInfluence}, Gold: ${hero.gold}g).`;
    case "treasure_hunter":
      return `You found riches others missed (Economic Focus: ${p.economicFocus}, Intelligence: ${hero.coreStats.intelligence}, Gold: ${hero.gold}g).`;
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
  const locked = Object.values(EVOLUTIONS).filter((e) => !alreadyUnlocked.has(e.id));
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
