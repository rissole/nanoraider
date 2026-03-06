import type { GearRarity, GearSlot } from "../data/types";

/** Spec for starting gear — used by createHero and baseline risk calculation. */
export const STARTING_GEAR_SPEC = {
  slots: ["head", "chest", "legs", "mainhand", "offhand"] as const satisfies readonly GearSlot[],
  rarity: "gray" as GearRarity,
  level: 1,
} as const;

export const getAgePhase = (inGameDay: number): "healthy" | "aging" | "elderly" => {
  if (inGameDay <= 9) {return "healthy";}
  if (inGameDay <= 12) {return "aging";}
  return "elderly";
}