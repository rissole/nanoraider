import type { Hero, HeroClass, MetaProgression } from "../data/types";

export function createHero(name: string, heroClass: HeroClass, meta: MetaProgression): Hero {
  const startGold = (meta.evolutionBonuses.startGold ?? 0) + (meta.apUpgrades.includes("start_gold_100") ? 100 : 0);
  const bossKnowledgeStart = meta.evolutionBonuses.bossKnowledgeBonus ?? 0;
  const inheritedKnowledge = Object.fromEntries(
    Object.entries(meta.bossKnowledgeBank).map(([k, v]) => [k, Math.min(100, v + bossKnowledgeStart * 100)]),
  );

  return {
    name,
    heroClass,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    inGameDay: 1,
    gold: startGold,
    gear: {
      helmet: null,
      chest: null,
      gloves: null,
      boots: null,
      weapon: null,
      offhand: null,
      legs: null,
      accessory: null,
    },
    personality: {
      aggression: 0,
      wisdom: 0,
      greed: 0,
      cunning: 0,
      patience: 0,
      recklessness: 0,
    },
    bossKnowledge: { molten_fury: inheritedKnowledge["molten_fury"] ?? 0 },
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
