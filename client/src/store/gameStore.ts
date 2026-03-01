import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ActivityId, DayResult, EvolutionId, GameScreen, Hero, HeroClass, MetaProgression, PlannedActivity } from "../data/types";
import { resolveActivity, totalEnergyCost } from "../game/activityResolver";
import { checkEvolutionOnDeath, stackEvolutionBonuses } from "../game/evolutionChecker";
import { applyXp, createHero } from "../game/heroFactory";
import { AP_UPGRADES } from "../data/evolutions";

const BASE_ENERGY = 50;
const ENERGY_PER_DEATH = 5;
const AP_PER_RUN = 25;
const OLD_AGE_START_DAY = 16;
const OLD_AGE_DEATH_CHANCE_PER_DAY = 0.05;

export interface DeathSummary {
  heroName: string;
  heroClass: HeroClass;
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
  bossKnowledgeSnapshot: Record<string, number>;
  raidDefeated: boolean;
}

interface GameState {
  screen: GameScreen;
  hero: Hero | null;
  meta: MetaProgression;
  plannedActivities: PlannedActivity[];
  energyUsedToday: number;
  lastDayResults: DayResult | null;
  deathSummary: DeathSummary | null;
  runXpTotal: number;
  raidDefeatedThisRun: boolean;

  // Navigation
  goTo: (screen: GameScreen) => void;

  // Hero creation
  startHeroCreation: () => void;
  createHero: (name: string, heroClass: HeroClass) => void;

  // Planning
  addActivity: (activityId: ActivityId) => void;
  removeActivity: (slot: number) => void;
  reorderActivity: (from: number, to: number) => void;
  clearPlan: () => void;

  // Execution
  executeDay: () => void;

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

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: "main_menu",
      hero: null,
      meta: buildInitialMeta(),
      plannedActivities: [],
      energyUsedToday: 0,
      lastDayResults: null,
      deathSummary: null,
      runXpTotal: 0,
      raidDefeatedThisRun: false,

      goTo: (screen) => set({ screen }),

      startHeroCreation: () => set({ screen: "hero_creation" }),

      createHero: (name, heroClass) => {
        const { meta } = get();
        const hero = createHero(name, heroClass, meta);
        set({ hero, screen: "planning", energyUsedToday: 0, plannedActivities: [], runXpTotal: 0, raidDefeatedThisRun: false });
      },

      addActivity: (activityId) => {
        const { plannedActivities, meta, energyUsedToday } = get();
        const { totalEnergyCost: calc } = { totalEnergyCost };
        const incoming = calc([...plannedActivities.map((a) => a.activityId), activityId]);
        if (incoming > meta.maxEnergy - energyUsedToday) {
          return; // not enough energy — silently ignore (UI should disable button)
        }
        set({
          plannedActivities: [...plannedActivities, { activityId, slot: plannedActivities.length }],
        });
      },

      removeActivity: (slot) => {
        const { plannedActivities } = get();
        const updated = plannedActivities.filter((a) => a.slot !== slot).map((a, i) => ({ ...a, slot: i }));
        set({ plannedActivities: updated });
      },

      reorderActivity: (from, to) => {
        const { plannedActivities } = get();
        const arr = [...plannedActivities];
        const [item] = arr.splice(from, 1);
        if (item === undefined) {
          return;
        }
        arr.splice(to, 0, item);
        set({ plannedActivities: arr.map((a, i) => ({ ...a, slot: i })) });
      },

      clearPlan: () => set({ plannedActivities: [] }),

      executeDay: () => {
        const { hero, meta, plannedActivities, runXpTotal, raidDefeatedThisRun } = get();
        if (hero === null) {
          return;
        }

        let currentHero = hero;
        const resolvedActivities = [];
        let totalXp = 0;
        let died = false;
        let deathCause: "combat" | "old_age" = "combat";
        const lootAll = [];
        let raidDefeated = raidDefeatedThisRun;

        for (const planned of plannedActivities) {
          const { resolved, updatedHero } = resolveActivity(currentHero, planned.activityId, meta);
          resolvedActivities.push(resolved);
          currentHero = updatedHero;
          totalXp += resolved.xpGained;
          lootAll.push(...resolved.lootDropped);

          if (planned.activityId === "raid_molten_fury" && !resolved.died) {
            raidDefeated = true;
          }

          if (resolved.died) {
            died = true;
            deathCause = "combat";
            break;
          }
        }

        // Apply XP leveling
        currentHero = applyXp(currentHero, totalXp);

        const dayResult: DayResult = {
          day: currentHero.inGameDay,
          activitiesResolved: resolvedActivities,
          totalXp,
          totalGold: resolvedActivities.reduce((s, r) => s + r.goldGained, 0),
          lootObtained: lootAll,
          heroSurvived: !died,
          ...(died ? { deathCause } : {}),
          personalitySnapshot: currentHero.personality,
        };

        // Check old age death if survived activities
        if (!died && currentHero.inGameDay >= OLD_AGE_START_DAY) {
          const oldAgeChance = OLD_AGE_DEATH_CHANCE_PER_DAY * (currentHero.inGameDay - OLD_AGE_START_DAY + 1);
          if (Math.random() < oldAgeChance) {
            died = true;
            deathCause = "old_age";
            dayResult.heroSurvived = false;
            dayResult.deathCause = "old_age";
          }
        }

        const newRunXp = runXpTotal + totalXp;

        if (died) {
          // Evolution check
          const { unlocked, whyUnlocked, almostUnlocked, almostReason } = checkEvolutionOnDeath(
            currentHero,
            meta,
            raidDefeated,
          );

          // Compute new meta
          const apGained = AP_PER_RUN + Math.floor(currentHero.level / 5) * 10;
          const newUnlocked = unlocked !== null ? [...meta.unlockedEvolutions, unlocked] : meta.unlockedEvolutions;
          const stackedBonuses = stackEvolutionBonuses(newUnlocked);
          const newMaxEnergy = BASE_ENERGY + ENERGY_PER_DEATH * (meta.totalRuns + 1) + stackedBonuses.energyBonus;

          // Persist boss knowledge (merge max values)
          const updatedKnowledgeBank: Record<string, number> = { ...meta.bossKnowledgeBank };
          for (const [boss, val] of Object.entries(currentHero.bossKnowledge)) {
            updatedKnowledgeBank[boss] = Math.max(updatedKnowledgeBank[boss] ?? 0, val);
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
            heroName: currentHero.name,
            heroClass: currentHero.heroClass,
            level: currentHero.level,
            inGameDay: currentHero.inGameDay,
            gold: currentHero.gold,
            cause: deathCause,
            totalXpGained: newRunXp,
            evolutionUnlocked: unlocked,
            whyUnlocked,
            almostUnlocked,
            almostReason,
            energyBonusGranted: ENERGY_PER_DEATH,
            apGranted: apGained,
            personalitySnapshot: currentHero.personality,
            bossKnowledgeSnapshot: currentHero.bossKnowledge,
            raidDefeated,
          };

          set({
            hero: null,
            meta: newMeta,
            lastDayResults: dayResult,
            deathSummary,
            screen: "death",
            plannedActivities: [],
            energyUsedToday: 0,
            runXpTotal: newRunXp,
            raidDefeatedThisRun: raidDefeated,
          });
        } else {
          // Survive the day → advance
          const advancedHero: Hero = {
            ...currentHero,
            inGameDay: currentHero.inGameDay + 1,
            completedActivitiesToday: plannedActivities.map((a) => a.activityId),
          };

          set({
            hero: advancedHero,
            lastDayResults: dayResult,
            screen: "day_results",
            plannedActivities: [],
            energyUsedToday: 0,
            runXpTotal: newRunXp,
            raidDefeatedThisRun: raidDefeated,
          });
        }
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
        set({ screen: "main_menu", hero: null, plannedActivities: [], energyUsedToday: 0, lastDayResults: null, deathSummary: null });
      },
    }),
    {
      name: "nanoraider-save",
      partialize: (state) => ({ meta: state.meta }),
    },
  ),
);
