import type { EvolutionDefinition, EvolutionId } from "./types";

export const EVOLUTIONS: Record<EvolutionId, EvolutionDefinition> = {
  berserker: {
    id: "berserker",
    name: "Berserker",
    tier: 1,
    description: "A warrior who lives for battle, rushing headfirst into danger.",
    lore: "They lived for the thrill of battle. Their legacy inspires future warriors.",
    prerequisites: [],
    unlockCondition: {
      minCoreStats: { strength: 28, stamina: 20 },
      minPersonality: { combatStyle: 30, ambition: 20 },
    },
    bonuses: {
      energyBonus: 10,
      combatBonus: 0.1,
    },
    hint: "Requires high combat focus — spend energy on dangerous dungeons.",
    unlocksPath: ["raid_legend"],
  },

  merchant: {
    id: "merchant",
    name: "Merchant",
    tier: 1,
    description: "A shrewd gold-hoarder who understands that wealth is power.",
    lore: "They understood that gold is power. Their fortune funds future heroes.",
    prerequisites: [],
    unlockCondition: {
      minCoreStats: { charismaInfluence: 20 },
      minPersonality: { economicFocus: 32 },
      minGoldAtDeath: 500,
    },
    bonuses: {
      energyBonus: 10,
      startGold: 50,
      vendorDiscountPct: 0.08,
      brokerTierStart: 2,
    },
    hint: "Requires high gold focus — farm gold and keep it.",
    unlocksPath: ["raid_legend"],
  },

  scholar: {
    id: "scholar",
    name: "Scholar",
    tier: 1,
    description: "A knowledge-seeker who believes preparation is everything.",
    lore: "They believed preparation was everything. Their research guides future heroes.",
    prerequisites: [],
    unlockCondition: {
      minCoreStats: { intelligence: 26 },
      minPersonality: { preparation: 30 },
      minBossKnowledge: { molten_fury: 30 },
    },
    bonuses: {
      energyBonus: 10,
      bossKnowledgeBonus: 0.05,
      knowledgeTransferMultiplier: 2,
      recipeDiscountPct: 0.1,
    },
    hint: "Requires high wisdom — study bosses frequently.",
    unlocksPath: ["raid_legend"],
  },

  raid_legend: {
    id: "raid_legend",
    name: "Raid Legend",
    tier: 2,
    description: "An elite raider who combined mastery of combat and knowledge.",
    lore: "They came so close to ultimate victory. Their near-triumph inspires legends.",
    prerequisites: ["berserker", "scholar"],
    unlockCondition: {
      mustDefeatRaids: ["molten_fury"],
      minCoreStats: { strength: 32, intelligence: 24 },
      minPersonality: { combatStyle: 24, preparation: 20, ambition: 24 },
    },
    bonuses: {
      energyBonus: 15,
      combatBonus: 0.2,
      bossKnowledgeBonus: 0.1,
      purpleCraftBonusPct: 0.08,
      raidProvisionerUnlocked: true,
    },
    hint: "Requires Berserker + Scholar unlocked first, then defeat Molten Fury.",
    unlocksPath: [],
  },
};

export const EVOLUTION_LIST = Object.values(EVOLUTIONS);

export const AP_UPGRADES = [
  {
    id: "energy_10" as const,
    name: "+10 Max Energy",
    description: "Permanently increase your daily energy cap by 10.",
    cost: 50,
    maxPurchases: 5,
  },
  {
    id: "start_gold_100" as const,
    name: "Start with 100 Gold",
    description: "Each new hero begins their journey with 100 gold.",
    cost: 500,
    maxPurchases: 1,
  },
  {
    id: "vendor_reroll_1" as const,
    name: "Daily Vendor Reroll",
    description: "Gain one manual vendor reroll each in-game day.",
    cost: 350,
    maxPurchases: 1,
  },
];
