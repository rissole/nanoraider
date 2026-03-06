import type { BossId, Hero, MetaProgression } from "../data/types";
import { defaultKnownRecipes } from "../data/crafting";
import { STARTING_GEAR_SPEC } from "./character";
import { applyFlatStartingReadinessBonus, normalizeBossReadinessBank } from "./bossReadiness";
import { generateGear, randomHeroClass } from "./gearGenerator";

const TRACKED_BOSSES: BossId[] = ["molten_fury", "eternal_throne"];

export function createHero(name: string, meta: MetaProgression): Hero {
  const startGold = (meta.evolutionBonuses.startGold ?? 0) + (meta.apUpgrades.includes("start_gold_100") ? 100 : 0);
  const bossReadinessStart = meta.evolutionBonuses.bossReadinessBonus ?? 0;
  const normalizedBank = normalizeBossReadinessBank(meta.bossReadinessBank, TRACKED_BOSSES);
  const inheritedReadiness = TRACKED_BOSSES.reduce<Record<BossId, number>>((acc, bossId) => {
    const base = normalizedBank[bossId];
    acc[bossId] = applyFlatStartingReadinessBonus(base, bossReadinessStart);
    return acc;
  }, {} as Record<BossId, number>);

  const heroClass = randomHeroClass();
  const emptyGear = {
    head: null,
    chest: null,
    legs: null,
    mainhand: null,
    offhand: null,
  };

  const startingGear: Hero["gear"] = {
    head: null,
    chest: null,
    legs: null,
    mainhand: null,
    offhand: null,
  };
  for (const slot of STARTING_GEAR_SPEC.slots) {
    startingGear[slot] = generateGear(heroClass, slot, STARTING_GEAR_SPEC.rarity, STARTING_GEAR_SPEC.level, emptyGear);
  }

  return {
    name,
    heroClass,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    inGameDay: 1,
    gold: startGold,
    gear: startingGear,
    triangle: { war: 33, wit: 33, wealth: 34 },
    renown: 0,
    daring: 0,
    bossReadiness: inheritedReadiness,
    materials: {},
    knownRecipes: [...new Set([...defaultKnownRecipes(), ...meta.knownRecipes])],
    completedActivitiesToday: [],
    raidLockouts: {},
  };
}

// Flatter curve (1.3 base) so level 12 is reachable in ~5-6 days — matches design intent
export const XP_PER_LEVEL = Array.from({ length: 30 }, (_, i) => Math.floor(100 * Math.pow(1.3, i)));

export function applyXp(hero: Hero, xp: number): Hero {
  let { level, xp: currentXp } = hero;
  currentXp += xp;

  while (level < 30) {
    const threshold = XP_PER_LEVEL[level - 1] ?? 9999999;
    if (currentXp >= threshold) {
      currentXp -= threshold;
      level++;
    } else {
      break;
    }
  }

  return {
    ...hero,
    level,
    xp: currentXp,
    xpToNextLevel: XP_PER_LEVEL[level - 1] ?? 9999999,
  };
}
