import type { BossId, CoreStats, Hero, MetaProgression, PersonalityAxes } from "../data/types";

const BASE_CORE_STATS: CoreStats = {
  strength: 5,
  agility: 5,
  intelligence: 5,
  stamina: 5,
  charismaInfluence: 5,
};

const BASE_PERSONALITY: PersonalityAxes = {
  combatStyle: 0,
  socialStyle: 0,
  economicFocus: 0,
  exploration: 0,
  preparation: 0,
  ambition: 0,
};

const TRACKED_BOSSES: BossId[] = ["molten_fury"];

export function createHero(name: string, meta: MetaProgression): Hero {
  const startGold = (meta.evolutionBonuses.startGold ?? 0) + (meta.apUpgrades.includes("start_gold_100") ? 100 : 0);
  const bossKnowledgeStart = meta.evolutionBonuses.bossKnowledgeBonus ?? 0;
  const inheritedKnowledge = TRACKED_BOSSES.reduce<Record<BossId, number>>((acc, bossId) => {
    const base = meta.bossKnowledgeBank[bossId] ?? 0;
    acc[bossId] = Math.min(100, base + bossKnowledgeStart * 100);
    return acc;
  }, { molten_fury: 0 });

  return {
    name,
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
    coreStats: { ...BASE_CORE_STATS },
    personality: { ...BASE_PERSONALITY },
    secondary: {
      reputation: {
        adventurers_guild: 0,
        scholomance_order: 0,
      },
      bossKnowledge: inheritedKnowledge,
    },
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
