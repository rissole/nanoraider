import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ActivityId,
  BossId,
  DayResult,
  DungeonActivityId,
  EvolutionId,
  GameScreen,
  Hero,
  MetaProgression,
  PendingDailyEvent,
  RiskBand,
  ResolvedActivity,
  ResolvedDailyEvent,
} from "../data/types";
import { DAILY_EVENTS, DAILY_EVENT_LIST } from "../data/nurture";
import { getActivityUnlockGaps as getUnlockGapsForActivity, isActivityUnlocked, resolveActivity } from "../game/activityResolver";
import { checkEvolutionOnDeath, stackEvolutionBonuses } from "../game/evolutionChecker";
import { applyXp, createHero } from "../game/heroFactory";
import { AP_UPGRADES } from "../data/evolutions";
import { ACTIVITIES } from "../data/activities";
import { randomHeroName } from "../data/nurture";
import { applyKnowledgeGain, normalizeBossKnowledgeBank } from "../game/bossKnowledge";

const BASE_ENERGY = 50;
const ENERGY_PER_DEATH = 5;
const AP_PER_RUN = 25;
const OLD_AGE_START_DAY = 16;
const OLD_AGE_DEATH_CHANCE_PER_DAY = 0.05;
const TRACKED_BOSSES: BossId[] = ["molten_fury"];
const TRACKED_DUNGEONS: DungeonActivityId[] = [
  "dungeon_irondeep",
  "dungeon_whispering_crypts",
  "dungeon_scholomance",
  "dungeon_blackrock",
];

function normalizeDungeonFamiliarityBank(
  source: MetaProgression["dungeonFamiliarityBank"],
  tracked: DungeonActivityId[],
): Record<DungeonActivityId, number> {
  return tracked.reduce<Record<DungeonActivityId, number>>((acc, dungeonId) => {
    const raw = source[dungeonId];
    acc[dungeonId] = typeof raw === "number" && Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0;
    return acc;
  }, {
    dungeon_irondeep: 0,
    dungeon_whispering_crypts: 0,
    dungeon_scholomance: 0,
    dungeon_blackrock: 0,
  });
}

export interface DeathSummary {
  heroName: string;
  level: number;
  inGameDay: number;
  gold: number;
  cause: "combat" | "old_age";
  totalXpGained: number;
  evolutionUnlocked: EvolutionId | null;
  whyUnlocked: string | null;
  almostUnlocked: EvolutionId | null;
  almostReason: string | null;
  energyBonusGranted: number;
  apGranted: number;
  personalitySnapshot: Hero["personality"];
  coreStatsSnapshot: Hero["coreStats"];
  bossKnowledgeSnapshot: Hero["secondary"]["bossKnowledge"];
  defeatedRaids: BossId[];
  fatalActivityId: ActivityId | null;
  fatalActivityRisk: number | null;
  fatalRiskBand: RiskBand | null;
  fatalRiskHints: string[];
}

interface GameState {
  screen: GameScreen;
  hero: Hero | null;
  meta: MetaProgression;
  energyUsedToday: number;
  plannedActivities: ActivityId[];
  currentDayActivities: ResolvedActivity[];
  currentDayEvents: ResolvedDailyEvent[];
  pendingEvent: PendingDailyEvent | null;
  lastDayResults: DayResult | null;
  deathSummary: DeathSummary | null;
  runXpTotal: number;
  defeatedRaidsThisRun: BossId[];

  // Navigation
  goTo: (screen: GameScreen) => void;

  // Hero creation
  startHeroCreation: () => void;
  createHero: (name: string) => void;
  renameHero: (name: string) => void;

  // Day loop
  planActivity: (activityId: ActivityId) => void;
  unplanActivity: (index: number) => void;
  clearPlan: () => void;
  resolvePendingEvent: (choiceId: string) => void;
  endDay: () => void;
  dismissPendingEvent: () => void;

  // Helpers
  getActivityUnlockGaps: (activityId: ActivityId) => string[];

  // Meta
  spendAP: (upgradeId: string) => void;
  resetRun: () => void;
}

function buildInitialMeta(): MetaProgression {
  return {
    totalRuns: 0,
    maxEnergy: BASE_ENERGY,
    achievementPoints: 0,
    unlockedEvolutions: [],
    evolutionBonuses: {
      energyBonus: 0,
      startGold: 0,
      combatBonus: 0,
      bossKnowledgeBonus: 0,
      knowledgeTransferMultiplier: 1,
    },
    bossKnowledgeBank: {},
    dungeonFamiliarityBank: {},
    apUpgrades: [],
  };
}

function applyEventEffects(hero: Hero, effects: NonNullable<ResolvedDailyEvent["appliedEffects"]>): Hero {
  const updated: Hero = {
    ...hero,
    coreStats: { ...hero.coreStats },
    personality: { ...hero.personality },
    secondary: {
      reputation: { ...hero.secondary.reputation },
      bossKnowledge: { ...hero.secondary.bossKnowledge },
      dungeonFamiliarity: { ...hero.secondary.dungeonFamiliarity },
    },
  };

  if (effects.coreStats !== undefined) {
    for (const [key, value] of Object.entries(effects.coreStats)) {
      updated.coreStats[key as keyof Hero["coreStats"]] += value;
    }
  }
  if (effects.personality !== undefined) {
    for (const [key, value] of Object.entries(effects.personality)) {
      updated.personality[key as keyof Hero["personality"]] += value;
    }
  }
  if (effects.reputation !== undefined) {
    for (const [key, value] of Object.entries(effects.reputation)) {
      updated.secondary.reputation[key as keyof Hero["secondary"]["reputation"]] += value;
    }
  }
  if (effects.bossKnowledgeIntel !== undefined) {
    for (const [key, value] of Object.entries(effects.bossKnowledgeIntel)) {
      const boss = key as BossId;
      const current = updated.secondary.bossKnowledge[boss];
      updated.secondary.bossKnowledge[boss] = applyKnowledgeGain(current, "intel", value);
    }
  }
  if (effects.bossKnowledgeDrills !== undefined) {
    for (const [key, value] of Object.entries(effects.bossKnowledgeDrills)) {
      const boss = key as BossId;
      const current = updated.secondary.bossKnowledge[boss];
      updated.secondary.bossKnowledge[boss] = applyKnowledgeGain(current, "drills", value);
    }
  }
  if (effects.bossKnowledgeExecution !== undefined) {
    for (const [key, value] of Object.entries(effects.bossKnowledgeExecution)) {
      const boss = key as BossId;
      const current = updated.secondary.bossKnowledge[boss];
      updated.secondary.bossKnowledge[boss] = applyKnowledgeGain(current, "execution", value);
    }
  }

  return updated;
}

function shouldTriggerEvent(energySpent: number, maxEnergy: number): boolean {
  const energyRatio = maxEnergy > 0 ? Math.min(1, energySpent / maxEnergy) : 0;
  const chance = 0.05 + 0.15 * energyRatio;
  return Math.random() < chance;
}

function rollDailyEvent(day: number): PendingDailyEvent | null {
  const candidates = DAILY_EVENT_LIST.filter((event) => day >= event.minDay && (event.maxDay === undefined || day <= event.maxDay));
  if (candidates[0] === undefined) {
    return null;
  }
  const totalWeight = candidates.reduce((sum, event) => sum + event.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const event of candidates) {
    roll -= event.weight;
    if (roll <= 0) {
      return { eventId: event.id };
    }
  }
  return { eventId: candidates[0].id };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: "main_menu",
      hero: null,
      meta: buildInitialMeta(),
      energyUsedToday: 0,
      plannedActivities: [],
      currentDayActivities: [],
      currentDayEvents: [],
      pendingEvent: null,
      lastDayResults: null,
      deathSummary: null,
      runXpTotal: 0,
      defeatedRaidsThisRun: [],

      goTo: (screen) => set({ screen }),

      startHeroCreation: () => {
        const { meta } = get();
        const hero = createHero(randomHeroName(), meta);
        set({
          hero,
          screen: "planning",
          energyUsedToday: 0,
          plannedActivities: [],
          currentDayActivities: [],
          currentDayEvents: [],
          pendingEvent: null,
          runXpTotal: 0,
          defeatedRaidsThisRun: [],
        });
      },

      createHero: (name) => {
        const { meta } = get();
        const hero = createHero(name, meta);
        set({
          hero,
          screen: "planning",
          energyUsedToday: 0,
          plannedActivities: [],
          currentDayActivities: [],
          currentDayEvents: [],
          pendingEvent: null,
          runXpTotal: 0,
          defeatedRaidsThisRun: [],
        });
      },

      renameHero: (name) => {
        const { hero } = get();
        if (hero === null || name.trim().length === 0) {
          return;
        }
        set({ hero: { ...hero, name: name.trim() } });
      },

      planActivity: (activityId) => {
        const { hero, meta, plannedActivities } = get();
        if (hero === null) {
          return;
        }

        const def = ACTIVITIES[activityId];
        if (!isActivityUnlocked(hero, def)) {
          return;
        }
        const plannedEnergy = plannedActivities.reduce((sum, id) => sum + ACTIVITIES[id].energyCost, 0);
        if (plannedEnergy + def.energyCost > meta.maxEnergy) {
          return;
        }

        const plannedGoldSpend = plannedActivities.reduce((sum, id) => sum + (ACTIVITIES[id].goldCost ?? 0), 0);
        if (plannedGoldSpend + (def.goldCost ?? 0) > hero.gold) {
          return;
        }

        const nextPlan = [...plannedActivities, activityId];
        const nextEnergy = nextPlan.reduce((sum, id) => sum + ACTIVITIES[id].energyCost, 0);
        set({
          plannedActivities: nextPlan,
          energyUsedToday: nextEnergy,
        });
      },

      unplanActivity: (index) => {
        const { plannedActivities } = get();
        if (index < 0 || index >= plannedActivities.length) {
          return;
        }

        const nextPlan = plannedActivities.filter((_, i) => i !== index);
        const nextEnergy = nextPlan.reduce((sum, id) => sum + ACTIVITIES[id].energyCost, 0);
        set({
          plannedActivities: nextPlan,
          energyUsedToday: nextEnergy,
        });
      },

      clearPlan: () => set({ plannedActivities: [], energyUsedToday: 0 }),

      resolvePendingEvent: (choiceId) => {
        const { hero, pendingEvent, currentDayEvents, runXpTotal, lastDayResults } = get();
        if (hero === null || pendingEvent === null) {
          return;
        }

        const def = DAILY_EVENTS[pendingEvent.eventId];
        const choice = def.choices.find((item) => item.id === choiceId);
        if (choice === undefined) {
          return;
        }

        const heroAfterEffects = applyEventEffects(hero, choice.effects);
        const xpGained = choice.xpGain ?? 0;
        const goldGained = choice.goldGain ?? 0;
        const heroAfterXp = applyXp(
          {
            ...heroAfterEffects,
            gold: heroAfterEffects.gold + goldGained,
          },
          xpGained,
        );

        const resolvedEvent: ResolvedDailyEvent = {
          eventId: pendingEvent.eventId,
          choiceId: choice.id,
          xpGained,
          goldGained,
          appliedEffects: choice.effects,
        };

        const updatedDayResult = lastDayResults !== null
          ? {
              ...lastDayResults,
              eventsResolved: [...lastDayResults.eventsResolved, resolvedEvent],
              totalXp: lastDayResults.totalXp + xpGained,
              totalGold: lastDayResults.totalGold + goldGained,
            }
          : null;

        set({
          hero: heroAfterXp,
          pendingEvent: null,
          currentDayEvents: [...currentDayEvents, resolvedEvent],
          lastDayResults: updatedDayResult,
          runXpTotal: runXpTotal + xpGained,
          screen: "day_results",
        });
      },

      dismissPendingEvent: () => {
        set({ pendingEvent: null, screen: "day_results" });
      },

      endDay: () => {
        const { hero, meta, plannedActivities, runXpTotal, defeatedRaidsThisRun } = get();
        if (hero === null) {
          return;
        }

        let currentHero = hero;
        let nextRunXp = runXpTotal;
        let nextDefeatedRaids = defeatedRaidsThisRun;
        const resolvedActivities: ResolvedActivity[] = [];

        for (const activityId of plannedActivities) {
          const def = ACTIVITIES[activityId];
          if (!isActivityUnlocked(currentHero, def)) {
            continue;
          }
          if (currentHero.gold < (def.goldCost ?? 0)) {
            continue;
          }

          const { resolved, updatedHero } = resolveActivity(currentHero, activityId, meta);
          const leveledHero = applyXp(updatedHero, resolved.xpGained);
          resolvedActivities.push(resolved);
          nextRunXp += resolved.xpGained;
          if (activityId === "raid_molten_fury" && !resolved.died && !nextDefeatedRaids.includes("molten_fury")) {
            nextDefeatedRaids = [...nextDefeatedRaids, "molten_fury"];
          }

          if (resolved.died) {
            const dayResult: DayResult = {
              day: hero.inGameDay,
              activitiesResolved: resolvedActivities,
              eventsResolved: [],
              totalXp: resolvedActivities.reduce((sum, item) => sum + item.xpGained, 0),
              totalGold: resolvedActivities.reduce((sum, item) => sum + item.goldGained - item.goldSpent, 0),
              totalGoldSpent: resolvedActivities.reduce((sum, item) => sum + item.goldSpent, 0),
              lootObtained: resolvedActivities.flatMap((item) => item.lootDropped),
              heroSurvived: false,
              deathCause: "combat",
              personalitySnapshot: leveledHero.personality,
              coreStatsSnapshot: leveledHero.coreStats,
            };
            finalizeDeath("combat", leveledHero, nextRunXp, nextDefeatedRaids, dayResult, set, get, resolved);
            return;
          }

          currentHero = {
            ...leveledHero,
            completedActivitiesToday: [...currentHero.completedActivitiesToday, activityId],
          };
        }

        let deathCause: "combat" | "old_age" | null = null;
        if (currentHero.inGameDay >= OLD_AGE_START_DAY) {
          const oldAgeChance = OLD_AGE_DEATH_CHANCE_PER_DAY * (currentHero.inGameDay - OLD_AGE_START_DAY + 1);
          if (Math.random() < oldAgeChance) {
            deathCause = "old_age";
          }
        }

        const dayResult: DayResult = {
          day: currentHero.inGameDay,
          activitiesResolved: resolvedActivities,
          eventsResolved: [],
          totalXp: resolvedActivities.reduce((sum, item) => sum + item.xpGained, 0),
          totalGold: resolvedActivities.reduce((sum, item) => sum + item.goldGained - item.goldSpent, 0),
          totalGoldSpent: resolvedActivities.reduce((sum, item) => sum + item.goldSpent, 0),
          lootObtained: resolvedActivities.flatMap((item) => item.lootDropped),
          heroSurvived: deathCause === null,
          ...(deathCause !== null ? { deathCause } : {}),
          personalitySnapshot: currentHero.personality,
          coreStatsSnapshot: currentHero.coreStats,
        };

        if (deathCause !== null) {
          finalizeDeath(deathCause, currentHero, nextRunXp, nextDefeatedRaids, dayResult, set, get);
          return;
        }

        const totalEnergySpent = plannedActivities.reduce((sum, id) => sum + ACTIVITIES[id].energyCost, 0);
        const eventTriggered = shouldTriggerEvent(totalEnergySpent, meta.maxEnergy);
        const pendingEvent = eventTriggered ? rollDailyEvent(currentHero.inGameDay) : null;

        set({
          hero: {
            ...currentHero,
            inGameDay: currentHero.inGameDay + 1,
            completedActivitiesToday: [],
          },
          lastDayResults: dayResult,
          screen: pendingEvent !== null ? "daily_event" : "day_results",
          energyUsedToday: 0,
          plannedActivities: [],
          currentDayActivities: pendingEvent !== null ? resolvedActivities : [],
          currentDayEvents: [],
          pendingEvent,
          runXpTotal: nextRunXp,
          defeatedRaidsThisRun: nextDefeatedRaids,
        });
      },

      getActivityUnlockGaps: (activityId) => {
        const { hero } = get();
        const def = ACTIVITIES[activityId];
        if (hero === null || isActivityUnlocked(hero, def)) {
          return [];
        }
        return getUnlockGapsForActivity(hero, def);
      },

      spendAP: (upgradeId) => {
        const { meta } = get();
        const upgrade = AP_UPGRADES.find((u) => u.id === upgradeId);
        if (upgrade === undefined) {
          return;
        }
        const purchaseCount = meta.apUpgrades.filter((id) => id === upgradeId).length;
        if (purchaseCount >= upgrade.maxPurchases) {
          return;
        }
        if (meta.achievementPoints < upgrade.cost) {
          return;
        }

        const newUpgrades = [...meta.apUpgrades, upgradeId as MetaProgression["apUpgrades"][number]];
        const energyBonus = newUpgrades.filter((id) => id === "energy_10").length * 10;
        const stackedBonuses = stackEvolutionBonuses(meta.unlockedEvolutions);
        const newMaxEnergy = BASE_ENERGY + ENERGY_PER_DEATH * meta.totalRuns + stackedBonuses.energyBonus + energyBonus;

        set({
          meta: {
            ...meta,
            achievementPoints: meta.achievementPoints - upgrade.cost,
            apUpgrades: newUpgrades,
            maxEnergy: newMaxEnergy,
          },
        });
      },

      resetRun: () => {
        set({
          screen: "main_menu",
          hero: null,
          energyUsedToday: 0,
          plannedActivities: [],
          currentDayActivities: [],
          currentDayEvents: [],
          pendingEvent: null,
          lastDayResults: null,
          deathSummary: null,
          defeatedRaidsThisRun: [],
        });
      },
    }),
    {
      name: "nanoraider-save",
      version: 2,
      partialize: (state) => ({ meta: state.meta }),
      migrate: (persistedState, version) => {
        if (version < 2) {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("nanoraider-save");
          }
          return { meta: buildInitialMeta() };
        }
        const state = persistedState as { meta?: MetaProgression };
        if (state.meta === undefined) {
          return state;
        }
        const normalizedBank = normalizeBossKnowledgeBank(state.meta.bossKnowledgeBank, TRACKED_BOSSES);
        const normalizedDungeonBank = normalizeDungeonFamiliarityBank(state.meta.dungeonFamiliarityBank, TRACKED_DUNGEONS);
        return {
          ...state,
          meta: {
            ...state.meta,
            bossKnowledgeBank: normalizedBank,
            dungeonFamiliarityBank: normalizedDungeonBank,
          },
        };
      },
    },
  ),
);

function finalizeDeath(
  cause: "combat" | "old_age",
  hero: Hero,
  runXpTotal: number,
  defeatedRaids: BossId[],
  dayResult: DayResult,
  set: (state: Partial<GameState>) => void,
  get: () => GameState,
  fatalActivity?: ResolvedActivity,
) {
  const { meta } = get();
  const { unlocked, whyUnlocked, almostUnlocked, almostReason } = checkEvolutionOnDeath(hero, meta, defeatedRaids);

  const apGained = AP_PER_RUN + Math.floor(hero.level / 5) * 10;
  const newUnlocked = unlocked !== null ? [...meta.unlockedEvolutions, unlocked] : meta.unlockedEvolutions;
  const stackedBonuses = stackEvolutionBonuses(newUnlocked);
  const newMaxEnergy = BASE_ENERGY + ENERGY_PER_DEATH * (meta.totalRuns + 1) + stackedBonuses.energyBonus;

  const normalizedKnowledgeBank = normalizeBossKnowledgeBank(meta.bossKnowledgeBank, TRACKED_BOSSES);
  const updatedKnowledgeBank: MetaProgression["bossKnowledgeBank"] = { ...normalizedKnowledgeBank };
  for (const [boss, value] of Object.entries(hero.secondary.bossKnowledge)) {
    const bossId = boss as BossId;
    const previous = updatedKnowledgeBank[bossId] ?? { intel: 0, drills: 0, execution: 0 };
    updatedKnowledgeBank[bossId] = {
      intel: Math.max(previous.intel, value.intel),
      drills: Math.max(previous.drills, value.drills),
      execution: Math.max(previous.execution, value.execution),
    };
  }
  const normalizedDungeonBank = normalizeDungeonFamiliarityBank(meta.dungeonFamiliarityBank, TRACKED_DUNGEONS);
  const updatedDungeonBank: MetaProgression["dungeonFamiliarityBank"] = { ...normalizedDungeonBank };
  for (const [dungeon, survivedRuns] of Object.entries(hero.secondary.dungeonFamiliarity)) {
    const dungeonId = dungeon as DungeonActivityId;
    const previous = updatedDungeonBank[dungeonId] ?? 0;
    updatedDungeonBank[dungeonId] = Math.max(previous, Math.max(0, Math.floor(survivedRuns)));
  }

  const newMeta: MetaProgression = {
    ...meta,
    totalRuns: meta.totalRuns + 1,
    maxEnergy: newMaxEnergy,
    achievementPoints: meta.achievementPoints + apGained,
    unlockedEvolutions: newUnlocked,
    evolutionBonuses: {
      energyBonus: stackedBonuses.energyBonus,
      startGold: stackedBonuses.startGold,
      combatBonus: stackedBonuses.combatBonus,
      bossKnowledgeBonus: stackedBonuses.bossKnowledgeBonus,
      knowledgeTransferMultiplier: stackedBonuses.knowledgeTransferMultiplier,
    },
    bossKnowledgeBank: updatedKnowledgeBank,
    dungeonFamiliarityBank: updatedDungeonBank,
  };

  const deathSummary: DeathSummary = {
    heroName: hero.name,
    level: hero.level,
    inGameDay: hero.inGameDay,
    gold: hero.gold,
    cause,
    totalXpGained: runXpTotal,
    evolutionUnlocked: unlocked,
    whyUnlocked,
    almostUnlocked,
    almostReason,
    energyBonusGranted: ENERGY_PER_DEATH,
    apGranted: apGained,
    personalitySnapshot: hero.personality,
    coreStatsSnapshot: hero.coreStats,
    bossKnowledgeSnapshot: hero.secondary.bossKnowledge,
    defeatedRaids,
    fatalActivityId: cause === "combat" ? (fatalActivity?.activityId ?? null) : null,
    fatalActivityRisk: cause === "combat" ? (fatalActivity?.effectiveDeathRisk ?? null) : null,
    fatalRiskBand: cause === "combat" ? (fatalActivity?.riskBand ?? null) : null,
    fatalRiskHints: cause === "combat" ? (fatalActivity?.riskHints ?? []) : [],
  };

  set({
    hero: null,
    meta: newMeta,
    lastDayResults: dayResult,
    deathSummary,
    screen: "death",
    energyUsedToday: 0,
    plannedActivities: [],
    currentDayActivities: [],
    currentDayEvents: [],
    pendingEvent: null,
    defeatedRaidsThisRun: defeatedRaids,
  });
}
