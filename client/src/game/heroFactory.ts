import type { BossId, DungeonActivityId, Hero, MetaProgression, PersonalityAxes } from "../data/types";
import { defaultKnownRecipes } from "../data/crafting";
import { BASE_CORE_STATS, STARTING_GEAR_SPEC } from "./characterCreation";
import { applyFlatStartingKnowledgeBonus, normalizeBossKnowledgeBank } from "./bossKnowledge";
import { generateGear, randomHeroClass } from "./gearGenerator";

const BASE_PERSONALITY: PersonalityAxes = {
  combatStyle: 0,
  socialStyle: 0,
  economicFocus: 0,
  exploration: 0,
  preparation: 0,
  ambition: 0,
};

const TRACKED_BOSSES: BossId[] = ["molten_fury", "eternal_throne"];
const TRACKED_DUNGEONS: DungeonActivityId[] = [
  "dungeon_irondeep",
  "dungeon_whispering_crypts",
  "dungeon_scholomance",
  "dungeon_blackrock",
];

export function createHero(name: string, meta: MetaProgression): Hero {
  const startGold = (meta.evolutionBonuses.startGold ?? 0) + (meta.apUpgrades.includes("start_gold_100") ? 100 : 0);
  const bossKnowledgeStart = meta.evolutionBonuses.bossKnowledgeBonus ?? 0;
  const normalizedBank = normalizeBossKnowledgeBank(meta.bossKnowledgeBank, TRACKED_BOSSES);
  const inheritedKnowledge = TRACKED_BOSSES.reduce<Record<BossId, Hero["secondary"]["bossKnowledge"][BossId]>>((acc, bossId) => {
    const base = normalizedBank[bossId];
    acc[bossId] = applyFlatStartingKnowledgeBonus(base, bossKnowledgeStart);
    return acc;
  }, {} as Record<BossId, Hero["secondary"]["bossKnowledge"][BossId]>);
  const inheritedDungeonFamiliarity = TRACKED_DUNGEONS.reduce<Record<DungeonActivityId, number>>((acc, dungeonId) => {
    acc[dungeonId] = Math.max(0, Math.floor(meta.dungeonFamiliarityBank[dungeonId] ?? 0));
    return acc;
  }, {
    dungeon_irondeep: 0,
    dungeon_whispering_crypts: 0,
    dungeon_scholomance: 0,
    dungeon_blackrock: 0,
  });

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
    coreStats: { ...BASE_CORE_STATS },
    personality: { ...BASE_PERSONALITY },
    secondary: {
      reputation: {
        adventurers_guild: 0,
        scholomance_order: 0,
      },
      bossKnowledge: inheritedKnowledge,
      dungeonFamiliarity: inheritedDungeonFamiliarity,
    },
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
