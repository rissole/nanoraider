import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ActivityId,
  BossId,
  DayResult,
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

const BASE_ENERGY = 50;
const ENERGY_PER_DEATH = 5;
const AP_PER_RUN = 25;
const OLD_AGE_START_DAY = 16;
const OLD_AGE_DEATH_CHANCE_PER_DAY = 0.05;

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
  executeActivity: (activityId: ActivityId) => void;
  resolvePendingEvent: (choiceId: string) => void;
  restDay: () => void;
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
  if (effects.bossKnowledge !== undefined) {
    for (const [key, value] of Object.entries(effects.bossKnowledge)) {
      const boss = key as BossId;
      const current = updated.secondary.bossKnowledge[boss];
      updated.secondary.bossKnowledge[boss] = Math.max(0, Math.min(100, current + value));
    }
  }

  return updated;
}

function shouldTriggerEvent(day: number): boolean {
  const chance = day <= 3 ? 0.65 : 0.25;
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

      executeActivity: (activityId) => {
        const { hero, meta, energyUsedToday, runXpTotal, currentDayActivities, defeatedRaidsThisRun } = get();
        if (hero === null) {
          return;
        }
        const def = ACTIVITIES[activityId];
        if (energyUsedToday + def.energyCost > meta.maxEnergy) {
          return;
        }
        if (!isActivityUnlocked(hero, def)) {
          return;
        }

        const { resolved, updatedHero } = resolveActivity(hero, activityId, meta);
        const leveledHero = applyXp(updatedHero, resolved.xpGained);
        const nextActivities = [...currentDayActivities, resolved];
        const nextRunXp = runXpTotal + resolved.xpGained;
        const nextDefeatedRaids: BossId[] =
          activityId === "raid_molten_fury" && !resolved.died && !defeatedRaidsThisRun.includes("molten_fury")
            ? [...defeatedRaidsThisRun, "molten_fury" as BossId]
            : defeatedRaidsThisRun;

        if (resolved.died) {
          const dayResult: DayResult = {
            day: hero.inGameDay,
            activitiesResolved: nextActivities,
            eventsResolved: get().currentDayEvents,
            totalXp: nextActivities.reduce((sum, item) => sum + item.xpGained, 0),
            totalGold: nextActivities.reduce((sum, item) => sum + item.goldGained, 0),
            lootObtained: nextActivities.flatMap((item) => item.lootDropped),
            heroSurvived: false,
            deathCause: "combat",
            personalitySnapshot: leveledHero.personality,
            coreStatsSnapshot: leveledHero.coreStats,
          };
          finalizeDeath("combat", leveledHero, nextRunXp, nextDefeatedRaids, dayResult, set, get, resolved);
          return;
        }

        const eventTriggered = shouldTriggerEvent(leveledHero.inGameDay);
        const pendingEvent = eventTriggered ? rollDailyEvent(leveledHero.inGameDay) : null;
        set({
          hero: {
            ...leveledHero,
            completedActivitiesToday: [...leveledHero.completedActivitiesToday, activityId],
          },
          energyUsedToday: energyUsedToday + def.energyCost,
          runXpTotal: nextRunXp,
          currentDayActivities: nextActivities,
          pendingEvent,
          defeatedRaidsThisRun: nextDefeatedRaids,
          screen: pendingEvent !== null ? "daily_event" : "planning",
        });
      },

      resolvePendingEvent: (choiceId) => {
        const { hero, pendingEvent, currentDayEvents, runXpTotal } = get();
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

        set({
          hero: heroAfterXp,
          pendingEvent: null,
          currentDayEvents: [...currentDayEvents, resolvedEvent],
          runXpTotal: runXpTotal + xpGained,
          screen: "planning",
        });
      },

      dismissPendingEvent: () => {
        set({ pendingEvent: null, screen: "planning" });
      },

      restDay: () => {
        const { hero, currentDayActivities, currentDayEvents, runXpTotal, defeatedRaidsThisRun } = get();
        if (hero === null) {
          return;
        }

        let deathCause: "combat" | "old_age" | null = null;
        if (hero.inGameDay >= OLD_AGE_START_DAY) {
          const oldAgeChance = OLD_AGE_DEATH_CHANCE_PER_DAY * (hero.inGameDay - OLD_AGE_START_DAY + 1);
          if (Math.random() < oldAgeChance) {
            deathCause = "old_age";
          }
        }

        const dayResult: DayResult = {
          day: hero.inGameDay,
          activitiesResolved: currentDayActivities,
          eventsResolved: currentDayEvents,
          totalXp: currentDayActivities.reduce((sum, item) => sum + item.xpGained, 0) + currentDayEvents.reduce((sum, item) => sum + item.xpGained, 0),
          totalGold: currentDayActivities.reduce((sum, item) => sum + item.goldGained, 0) + currentDayEvents.reduce((sum, item) => sum + item.goldGained, 0),
          lootObtained: currentDayActivities.flatMap((item) => item.lootDropped),
          heroSurvived: deathCause === null,
          ...(deathCause !== null ? { deathCause } : {}),
          personalitySnapshot: hero.personality,
          coreStatsSnapshot: hero.coreStats,
        };

        if (deathCause !== null) {
          finalizeDeath(deathCause, hero, runXpTotal, defeatedRaidsThisRun, dayResult, set, get);
          return;
        }

        set({
          hero: {
            ...hero,
            inGameDay: hero.inGameDay + 1,
            completedActivitiesToday: [],
          },
          lastDayResults: dayResult,
          screen: "day_results",
          energyUsedToday: 0,
          currentDayActivities: [],
          currentDayEvents: [],
          pendingEvent: null,
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
      partialize: (state) => ({ meta: state.meta }),
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

  const updatedKnowledgeBank: MetaProgression["bossKnowledgeBank"] = { ...meta.bossKnowledgeBank };
  for (const [boss, value] of Object.entries(hero.secondary.bossKnowledge)) {
    const bossId = boss as BossId;
    updatedKnowledgeBank[bossId] = Math.max(updatedKnowledgeBank[bossId] ?? 0, value);
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
    currentDayActivities: [],
    currentDayEvents: [],
    pendingEvent: null,
    defeatedRaidsThisRun: defeatedRaids,
  });
}
