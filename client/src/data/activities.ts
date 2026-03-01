import type { ActivityDefinition } from "./types";

export const ACTIVITIES: Record<string, ActivityDefinition> = {
  quest: {
    id: "quest",
    name: "Quest",
    description: "Complete quests in the world. Balanced XP and gold gains.",
    energyCost: 10,
    durationHours: 4,
    category: "general",
    personalityDeltas: { patience: 2 },
    minLevel: 1,
    deathRisk: 0.02,
    outcomes: {
      xpMin: 200,
      xpMax: 350,
      goldMin: 15,
      goldMax: 35,
      lootTable: [],
    },
  },

  dungeon_scholomance: {
    id: "dungeon_scholomance",
    name: "Scholomance",
    // Level 3 — accessible after ~2 quests on day 1
    description: "Dark academy dungeon. High drop rates. Core Scholar evolution path.",
    energyCost: 15,
    durationHours: 2,
    category: "combat",
    personalityDeltas: { aggression: 4, wisdom: 2 },
    minLevel: 3,
    deathRisk: 0.15,
    outcomes: {
      xpMin: 300,
      xpMax: 500,
      goldMin: 25,
      goldMax: 55,
      lootTable: [
        { itemId: "shadowforged_helm", chance: 0.35 },
        { itemId: "scholar_gloves", chance: 0.35 },
        { itemId: "dark_rune_staff", chance: 0.3 },
      ],
    },
  },

  dungeon_blackrock: {
    id: "dungeon_blackrock",
    name: "Blackrock Depths",
    // Level 6 — accessible by day 2-3
    description: "Brutal underground fortress. Highest risk, highest reward. Core Berserker path.",
    energyCost: 15,
    durationHours: 2,
    category: "combat",
    personalityDeltas: { aggression: 8, recklessness: 5 },
    minLevel: 6,
    deathRisk: 0.25,
    outcomes: {
      xpMin: 400,
      xpMax: 600,
      goldMin: 40,
      goldMax: 80,
      lootTable: [
        { itemId: "darksteel_chest", chance: 0.25 },
        { itemId: "ironclad_boots", chance: 0.25 },
        { itemId: "crusher_axe", chance: 0.25 },
        { itemId: "berserker_ring", chance: 0.25 },
      ],
    },
  },

  farm_gold: {
    id: "farm_gold",
    name: "Farm Gold",
    description: "Grind gold in safe areas. Core Merchant evolution activity.",
    energyCost: 8,
    durationHours: 3,
    category: "economic",
    personalityDeltas: { greed: 8, patience: 3 },
    minLevel: 1,
    deathRisk: 0,
    outcomes: {
      xpMin: 10,
      xpMax: 30,
      goldMin: 40,
      goldMax: 65,
      lootTable: [],
    },
  },

  study_boss: {
    id: "study_boss",
    name: "Study Boss",
    description: "Research Molten Fury tactics. +5% boss knowledge. Core Scholar activity.",
    energyCost: 12,
    durationHours: 2,
    category: "knowledge",
    personalityDeltas: { wisdom: 10, patience: 5 },
    minLevel: 1,
    deathRisk: 0,
    outcomes: {
      xpMin: 20,
      xpMax: 50,
      goldMin: 0,
      goldMax: 0,
      lootTable: [],
    },
  },

  raid_molten_fury: {
    id: "raid_molten_fury",
    name: "Raid: Molten Fury",
    // Level 12 — accessible around day 5-7 with dungeon grinding
    description: "Attempt the Molten Fury raid boss. Required for Raid Legend evolution.",
    energyCost: 30,
    durationHours: 6,
    category: "combat",
    personalityDeltas: { aggression: 10, recklessness: 8, cunning: 3 },
    minLevel: 12,
    deathRisk: 0.4,
    outcomes: {
      xpMin: 500,
      xpMax: 800,
      goldMin: 50,
      goldMax: 100,
      lootTable: [
        { itemId: "eternal_helm", chance: 0.5 },
        { itemId: "molten_boots", chance: 0.5 },
      ],
    },
  },
} satisfies Record<string, ActivityDefinition>;

export const ACTIVITY_LIST = Object.values(ACTIVITIES);
