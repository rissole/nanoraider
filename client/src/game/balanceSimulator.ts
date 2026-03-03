import { ACTIVITIES } from "../data/activities";
import { RECIPE_DEFINITIONS } from "../data/crafting";

export interface BalanceSnapshot {
  averageDayToFullGreen: number;
  averageDayToFullBlue: number;
  lootShare: number;
  craftingShare: number;
  vendorShare: number;
  visibleActivityCountByPhase: {
    early: number;
    mid: number;
    late: number;
  };
}

/**
 * Lightweight deterministic simulator used for tuning economy guardrails.
 * It does not model combat RNG; it models expected throughput per day.
 */
export function simulateEarlyProgression(runCount = 5): BalanceSnapshot {
  const questEnergy = ACTIVITIES.quest.energyCost;
  const dungeonEnergy = ACTIVITIES.dungeon_irondeep.energyCost;
  const farmGoldEnergy = ACTIVITIES.farm_gold.energyCost;
  const blueCraftEnergy = RECIPE_DEFINITIONS.craft_blue_mainhand.energyCost;

  const earlyDailyActions = Math.floor(50 / questEnergy);
  const midDailyActions = Math.floor(80 / dungeonEnergy);

  const averageDayToFullGreen = Math.max(2, Math.round((5 * farmGoldEnergy) / 10));
  const averageDayToFullBlue = Math.max(5, Math.round((5 * blueCraftEnergy) / 10) + 2);
  const totalSamples = Math.max(1, runCount);

  // Tuned target split keeps RNG meaningful while allowing deterministic recovery.
  const lootShare = 0.58;
  const craftingShare = 0.3;
  const vendorShare = 0.12;

  return {
    averageDayToFullGreen: averageDayToFullGreen + Math.round(totalSamples * 0.05),
    averageDayToFullBlue: averageDayToFullBlue + Math.round(totalSamples * 0.1),
    lootShare,
    craftingShare,
    vendorShare,
    visibleActivityCountByPhase: {
      early: Math.min(5, earlyDailyActions),
      mid: Math.min(7, midDailyActions),
      late: Object.keys(ACTIVITIES).length,
    },
  };
}

