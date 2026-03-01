import type { ActivityDefinition, ActivityId } from "./types";

export const ACTIVITIES: Record<ActivityId, ActivityDefinition> = {
  quest: {
    id: "quest",
    name: "Quest",
    description: "Complete quests in the world. Balanced XP and gold gains.",
    energyCost: 10,
    durationHours: 4,
    category: "general",
    effects: {
      coreStats: { stamina: 1 },
      personality: { preparation: 2, exploration: 1 },
      reputation: { adventurers_guild: 2 },
    },
    unlockConditions: { minLevel: 1 },
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
    description: "Dark academy dungeon. High drop rates. Core Scholar legacy path.",
    energyCost: 15,
    durationHours: 2,
    category: "combat",
    effects: {
      coreStats: { strength: 2, stamina: 1, intelligence: 1 },
      personality: { combatStyle: 5, ambition: 3 },
      reputation: { scholomance_order: 2 },
    },
    unlockConditions: { minLevel: 3 },
    deathRisk: 0.15,
    riskProfile: {
      coreStats: { strength: 0.25, stamina: 0.35, intelligence: 0.2, agility: 0.15, charismaInfluence: 0.05 },
      gearFactor: 0.12,
      prepFactor: 0.0018,
      minRisk: 0.03,
      maxRisk: 0.85,
    },
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
    effects: {
      coreStats: { strength: 3, agility: 1, stamina: 2 },
      personality: { combatStyle: 8, ambition: 4, preparation: -2 },
      reputation: { adventurers_guild: 1 },
    },
    unlockConditions: { minLevel: 6 },
    deathRisk: 0.25,
    riskProfile: {
      coreStats: { strength: 0.32, stamina: 0.34, agility: 0.2, intelligence: 0.08, charismaInfluence: 0.06 },
      gearFactor: 0.16,
      prepFactor: 0.0013,
      minRisk: 0.06,
      maxRisk: 0.9,
    },
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
    description: "Grind gold in safe areas. Core Merchant legacy path activity.",
    energyCost: 8,
    durationHours: 3,
    category: "economic",
    effects: {
      coreStats: { stamina: 1, charismaInfluence: 1 },
      personality: { economicFocus: 8, preparation: 3 },
      reputation: { adventurers_guild: -1 },
    },
    unlockConditions: { minLevel: 1 },
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
    effects: {
      coreStats: { intelligence: 3 },
      personality: { preparation: 9, combatStyle: -2 },
      bossKnowledge: { molten_fury: 5 },
      reputation: { scholomance_order: 3 },
    },
    unlockConditions: { minLevel: 1 },
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
    description: "Attempt the Molten Fury raid boss. Required for the Raid Legend legacy path.",
    energyCost: 30,
    durationHours: 6,
    category: "combat",
    effects: {
      coreStats: { strength: 4, agility: 2, stamina: 2 },
      personality: { combatStyle: 9, ambition: 10, preparation: -1 },
      reputation: { adventurers_guild: 4 },
    },
    unlockConditions: {
      minLevel: 12,
      minBossKnowledge: { molten_fury: 15 },
    },
    deathRisk: 0.4,
    riskProfile: {
      coreStats: { strength: 0.3, stamina: 0.35, agility: 0.2, intelligence: 0.1, charismaInfluence: 0.05 },
      gearFactor: 0.2,
      prepFactor: 0.0022,
      knowledgeFactor: 0.04,
      minRisk: 0.1,
      maxRisk: 0.95,
    },
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
  host_guild_meeting: {
    id: "host_guild_meeting",
    name: "Host Guild Meeting",
    description: "Lead planning for a guild push. Strong social and influence gains.",
    energyCost: 9,
    durationHours: 2,
    category: "social",
    effects: {
      coreStats: { charismaInfluence: 3, intelligence: 1 },
      personality: { socialStyle: 8, preparation: 2, ambition: 2 },
      reputation: { adventurers_guild: 6 },
    },
    unlockConditions: {
      minLevel: 4,
      minCoreStats: { charismaInfluence: 8 },
      minPersonality: { socialStyle: 8 },
    },
    deathRisk: 0,
    outcomes: {
      xpMin: 120,
      xpMax: 220,
      goldMin: 20,
      goldMax: 45,
      lootTable: [],
    },
  },
  black_market_trading: {
    id: "black_market_trading",
    name: "Black Market Trading",
    description: "High-risk trading opportunity with volatile outcomes.",
    energyCost: 11,
    durationHours: 3,
    category: "economic",
    effects: {
      coreStats: { charismaInfluence: 2, agility: 1 },
      personality: { economicFocus: 9, combatStyle: 4, preparation: -3 },
      reputation: { adventurers_guild: -4 },
    },
    unlockConditions: {
      minLevel: 6,
      minPersonality: { economicFocus: 12, combatStyle: 10 },
    },
    deathRisk: 0.08,
    riskProfile: {
      coreStats: { strength: 0.1, stamina: 0.15, agility: 0.25, intelligence: 0.2, charismaInfluence: 0.3 },
      gearFactor: 0.06,
      prepFactor: 0.0018,
      minRisk: 0.02,
      maxRisk: 0.55,
    },
    outcomes: {
      xpMin: 80,
      xpMax: 160,
      goldMin: 65,
      goldMax: 120,
      lootTable: [],
    },
  },
} satisfies Record<ActivityId, ActivityDefinition>;

export const ACTIVITY_LIST = Object.values(ACTIVITIES);
