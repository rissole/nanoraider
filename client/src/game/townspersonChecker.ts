import { TOWNSPEOPLE, TOWNSPERSON_LIST } from "../data/townspeople";
import type {
  BossId,
  FilledTownsperson,
  Hero,
  MetaProgression,
  RaidGate,
  TownspersonRoleId,
  TownspersonUnlockCondition,
  TriangleKey,
} from "../data/types";
import { getBossReadiness } from "./bossKnowledge";

export interface TownspersonCheckResult {
  unlocked: TownspersonRoleId | null;
  almostUnlocked: TownspersonRoleId | null;
  almostReason: string | null;
  whyUnlocked: string | null;
}

function gateRank(gate: RaidGate): number {
  switch (gate) {
    case "none":
      return 0;
    case "molten_fury":
      return 1;
    case "eternal_throne":
      return 2;
  }
}

export function checkTownspersonOnDeath(
  hero: Hero,
  meta: MetaProgression,
  defeatedRaids: BossId[],
): TownspersonCheckResult {
  const filledRoles = new Set(meta.townspeople.map((t) => t.roleId));

  let bestMatch: TownspersonRoleId | null = null;
  let bestGateRank = -1;
  let bestCheckScore = 0;
  let whyUnlocked: string | null = null;

  let almostUnlocked: TownspersonRoleId | null = null;
  let almostReason: string | null = null;
  let bestNearMissScore = 0;

  for (const role of TOWNSPERSON_LIST) {
    if (filledRoles.has(role.id)) {
      continue;
    }

    const cond = role.unlockCondition;
    const checks = evaluateChecks(hero, cond, defeatedRaids);
    const allPassed = Object.values(checks).every(Boolean);
    const passedCount = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.values(checks).length;
    const checkScore = passedCount / totalChecks;
    const rank = gateRank(role.raidGate);

    if (allPassed) {
      if (rank > bestGateRank || (rank === bestGateRank && checkScore > bestCheckScore)) {
        bestMatch = role.id;
        bestGateRank = rank;
        bestCheckScore = checkScore;
        whyUnlocked = buildWhyString(role.id, hero, defeatedRaids);
      }
    } else {
      const score = passedCount / totalChecks;
      if (score > bestNearMissScore && score >= 0.5) {
        bestNearMissScore = score;
        almostUnlocked = role.id;
        almostReason = buildAlmostReason(role.id, checks, cond, hero, defeatedRaids);
      }
    }
  }

  return { unlocked: bestMatch, almostUnlocked, almostReason, whyUnlocked };
}

function evaluateChecks(
  hero: Hero,
  cond: TownspersonUnlockCondition,
  defeatedRaids: BossId[],
): Record<string, boolean> {
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

function buildWhyString(id: TownspersonRoleId, hero: Hero, defeatedRaids: BossId[]): string {
  const t = hero.triangle;
  switch (id) {
    case "battlemaster":
      return `You became a war-focused hero (War ${t.war}%) with high daring (${hero.daring}).`;
    case "lorekeeper":
      return `You invested in wit and boss preparation (Wit ${t.wit}%, MF readiness ${Math.round(getBossReadiness(hero, "molten_fury"))}%).`;
    case "quartermaster":
      return `You prioritized economic growth (Wealth ${t.wealth}%) and held ${hero.gold}g at death.`;
    case "trailblazer":
      return `You lived dangerously — high daring (${hero.daring}) with war focus (War ${t.war}%).`;
    case "herald":
      return `You built strong social standing (Renown ${hero.renown}) with wealth backing (Wealth ${t.wealth}%).`;
    case "forgemaster":
      return `You defeated Molten Fury${defeatedRaids.includes("molten_fury") ? "" : ""} with deep readiness and balanced wit/war (Wit ${t.wit}%, War ${t.war}%).`;
    case "warchief":
      return `You conquered Molten Fury with overwhelming war (${t.war}%), daring (${hero.daring}), and renown (${hero.renown}).`;
    case "siegebreaker":
      return `You conquered the Eternal Throne across all dimensions — War ${t.war}%, Wit ${t.wit}%, Wealth ${t.wealth}%, Daring ${hero.daring}.`;
  }
}

type CheckMap = Record<string, boolean>;

function buildAlmostReason(
  id: TownspersonRoleId,
  checks: CheckMap,
  cond: TownspersonUnlockCondition,
  hero: Hero,
  defeatedRaids: BossId[],
): string {
  const parts: string[] = [];

  if (cond.minTriangle !== undefined) {
    for (const [key, value] of Object.entries(cond.minTriangle)) {
      const current = hero.triangle[key as TriangleKey];
      if (current < value) {
        parts.push(`${value - current} more ${key} needed`);
      }
    }
  }
  if (cond.maxTriangle !== undefined) {
    for (const [key, value] of Object.entries(cond.maxTriangle)) {
      const current = hero.triangle[key as TriangleKey];
      if (current > value) {
        parts.push(`${current - value} less ${key} needed`);
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
      const current = getBossReadiness(hero, key as BossId);
      if (current < value) {
        parts.push(`${value - Math.round(current)}% more ${key} readiness needed`);
      }
    }
  }
  if (cond.mustDefeatRaids !== undefined) {
    for (const raidId of cond.mustDefeatRaids) {
      if (!defeatedRaids.includes(raidId)) {
        parts.push(`must defeat ${raidId.replace(/_/g, " ")}`);
      }
    }
  }

  if (parts.length > 0) {
    return parts.join(", ") + ".";
  }

  // Fallback using the role hint
  return TOWNSPEOPLE[id].hint;
}

export interface TownspersonRecommendation {
  roleId: TownspersonRoleId;
  gapSummary: string;
  hint: string;
}

/** Returns top 1–3 townsperson recommendations for the Planning screen. */
export function getTopTownspersonRecommendations(
  hero: Hero,
  meta: MetaProgression,
  defeatedRaids: BossId[] = [],
  maxCount = 3,
): TownspersonRecommendation[] {
  const filledRoles = new Set(meta.townspeople.map((t) => t.roleId));
  const available = TOWNSPERSON_LIST.filter((r) => !filledRoles.has(r.id));
  if (available.length === 0) {
    return [];
  }

  type Scored = {
    role: (typeof TOWNSPEOPLE)[TownspersonRoleId];
    checkScore: number;
    gateRankValue: number;
    gapSummary: string;
  };

  const scored: Scored[] = available.map((role) => {
    const cond = role.unlockCondition;
    const checks = evaluateChecks(hero, cond, defeatedRaids);
    const passedCount = Object.values(checks).filter(Boolean).length;
    const totalChecks = Math.max(1, Object.keys(checks).length);
    const checkScore = passedCount / totalChecks;
    const gapSummary = buildAlmostReason(role.id, checks, cond, hero, defeatedRaids);

    return {
      role,
      checkScore,
      gateRankValue: gateRank(role.raidGate),
      gapSummary,
    };
  });

  const picked: TownspersonRoleId[] = [];
  const pickedSet = new Set<TownspersonRoleId>();

  // Priority 1: best check score (closest to unlocking)
  const byCheckScore = [...scored].sort((a, b) => b.checkScore - a.checkScore);
  const bestCheck = byCheckScore[0];
  if (bestCheck !== undefined && !pickedSet.has(bestCheck.role.id)) {
    picked.push(bestCheck.role.id);
    pickedSet.add(bestCheck.role.id);
  }

  // Priority 2: highest gate rank among remaining (aspiration pick)
  const remainingForGate = scored.filter((s) => !pickedSet.has(s.role.id));
  const byGate = [...remainingForGate].sort((a, b) => b.gateRankValue - a.gateRankValue);
  const bestGate = byGate[0];
  if (bestGate !== undefined && !pickedSet.has(bestGate.role.id)) {
    picked.push(bestGate.role.id);
    pickedSet.add(bestGate.role.id);
  }

  // Priority 3: next best check score among remaining
  const remainingForThird = scored.filter((s) => !pickedSet.has(s.role.id));
  const bySecondCheck = [...remainingForThird].sort((a, b) => b.checkScore - a.checkScore);
  const thirdPick = bySecondCheck[0];
  if (thirdPick !== undefined && !pickedSet.has(thirdPick.role.id)) {
    picked.push(thirdPick.role.id);
    pickedSet.add(thirdPick.role.id);
  }

  const pickedScored = picked
    .slice(0, maxCount)
    .map((id) => scored.find((s) => s.role.id === id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  return pickedScored.map((s) => ({
    roleId: s.role.id,
    gapSummary: s.gapSummary,
    hint: TOWNSPEOPLE[s.role.id].hint,
  }));
}

export function stackTownspersonBonuses(townspeople: FilledTownsperson[]) {
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

  for (const filled of townspeople) {
    const bonuses = TOWNSPEOPLE[filled.roleId].bonuses;
    energyBonus += bonuses.energyBonus;
    startGold += bonuses.startGold ?? 0;
    combatBonus += bonuses.combatBonus ?? 0;
    bossReadinessBonus += bonuses.bossReadinessBonus ?? 0;
    vendorDiscountPct += bonuses.vendorDiscountPct ?? 0;
    recipeDiscountPct += bonuses.recipeDiscountPct ?? 0;
    purpleCraftStatBonusPct += bonuses.purpleCraftStatBonusPct ?? 0;
    const candidate = bonuses.brokerTierStart ?? 1;
    const merged = Math.max(brokerTierStart, candidate);
    brokerTierStart = merged >= 3 ? 3 : merged >= 2 ? 2 : 1;
    raidProvisionerUnlocked = raidProvisionerUnlocked || (bonuses.raidProvisionerUnlocked ?? false);
    if ((bonuses.knowledgeTransferMultiplier ?? 1) > knowledgeTransferMultiplier) {
      knowledgeTransferMultiplier = bonuses.knowledgeTransferMultiplier ?? 1;
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
