import { ACTIVITIES } from "../data/activities";
import { GEAR_ITEMS } from "../data/gear";
import type { ActivityId, GearItem, Hero, MetaProgression, PersonalityStats, ResolvedActivity } from "../data/types";

function roll(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mergePersonality(base: PersonalityStats, deltas: Partial<PersonalityStats>): PersonalityStats {
  return {
    aggression: base.aggression + (deltas.aggression ?? 0),
    wisdom: base.wisdom + (deltas.wisdom ?? 0),
    greed: base.greed + (deltas.greed ?? 0),
    cunning: base.cunning + (deltas.cunning ?? 0),
    patience: base.patience + (deltas.patience ?? 0),
    recklessness: base.recklessness + (deltas.recklessness ?? 0),
  };
}

export function resolveActivity(hero: Hero, activityId: ActivityId, meta: MetaProgression): { resolved: ResolvedActivity; updatedHero: Hero } {
  const def = ACTIVITIES[activityId];
  if (def === undefined) {
    throw new Error(`Unknown activity: ${activityId}`);
  }

  const combatBonus = meta.evolutionBonuses.combatBonus ?? 0;
  const adjustedDeathRisk = Math.max(0, def.deathRisk - combatBonus * 0.5);

  // Boss knowledge reduces raid death risk
  let finalDeathRisk = adjustedDeathRisk;
  if (activityId === "raid_molten_fury") {
    const knowledge = hero.bossKnowledge["molten_fury"] ?? 0;
    finalDeathRisk = Math.max(0.05, adjustedDeathRisk - knowledge / 200);
  }

  const died = finalDeathRisk > 0 && Math.random() < finalDeathRisk;

  // Loot drops
  const lootDropped: GearItem[] = [];
  if (!died) {
    for (const drop of def.outcomes.lootTable) {
      if (Math.random() < drop.chance) {
        const item = GEAR_ITEMS[drop.itemId];
        if (item !== undefined) {
          lootDropped.push(item);
        }
      }
    }
  }

  const xpGained = died ? 0 : roll(def.outcomes.xpMin, def.outcomes.xpMax);
  const goldGained = died ? 0 : roll(def.outcomes.goldMin, def.outcomes.goldMax);

  const resolved: ResolvedActivity = {
    activityId,
    xpGained,
    goldGained,
    lootDropped,
    died,
    personalityDeltas: def.personalityDeltas,
  };

  // Update hero personality, gold, xp, boss knowledge
  let updatedHero: Hero = {
    ...hero,
    personality: mergePersonality(hero.personality, def.personalityDeltas),
    gold: hero.gold + goldGained,
  };

  // Study boss updates knowledge
  if (activityId === "study_boss") {
    const multiplier = meta.evolutionBonuses.knowledgeTransferMultiplier ?? 1;
    const gain = 5 * multiplier;
    updatedHero = {
      ...updatedHero,
      bossKnowledge: {
        ...updatedHero.bossKnowledge,
        molten_fury: Math.min(100, (updatedHero.bossKnowledge["molten_fury"] ?? 0) + gain),
      },
    };
  }

  // Raid defeat tracking
  if (activityId === "raid_molten_fury" && !died) {
    updatedHero = {
      ...updatedHero,
      raidLockouts: { ...updatedHero.raidLockouts, molten_fury: hero.inGameDay },
    };
  }

  // Equip better loot automatically
  for (const item of lootDropped) {
    const currentInSlot = updatedHero.gear[item.slot];
    if (currentInSlot === null || item.itemPower > currentInSlot.itemPower) {
      updatedHero = {
        ...updatedHero,
        gear: { ...updatedHero.gear, [item.slot]: item },
      };
    }
  }

  return { resolved, updatedHero };
}

export function canAffordActivities(activities: ActivityId[], maxEnergy: number): boolean {
  const total = activities.reduce((sum, id) => {
    const def = ACTIVITIES[id];
    return sum + (def?.energyCost ?? 0);
  }, 0);
  return total <= maxEnergy;
}

export function totalEnergyCost(activities: ActivityId[]): number {
  return activities.reduce((sum, id) => {
    const def = ACTIVITIES[id];
    return sum + (def?.energyCost ?? 0);
  }, 0);
}
