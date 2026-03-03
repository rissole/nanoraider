import type { CoreStats, GearRarity, GearSlot } from "../data/types";

/** Base core stats for newly created heroes. */
export const BASE_CORE_STATS: CoreStats = {
  strength: 5,
  agility: 5,
  intelligence: 5,
  stamina: 5,
  charismaInfluence: 5,
};

/** Spec for starting gear — used by createHero and baseline risk calculation. */
export const STARTING_GEAR_SPEC = {
  slots: ["head", "chest", "legs", "mainhand", "offhand"] as const satisfies readonly GearSlot[],
  rarity: "gray" as GearRarity,
  level: 1,
} as const;
