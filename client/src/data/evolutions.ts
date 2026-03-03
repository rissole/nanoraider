import type { EvolutionDefinition, EvolutionId } from "./types";

export const EVOLUTION_TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: "Foundation",
  2: "Specialist",
  3: "Mastery",
};

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
    unlocksPath: ["raid_legend", "warlord", "dungeon_master"],
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
    unlocksPath: ["raid_legend", "guildmaster", "treasure_hunter"],
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
    unlocksPath: ["raid_legend", "treasure_hunter"],
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
    unlocksPath: ["raid_leader"],
  },

  guardian: {
    id: "guardian",
    name: "Guardian",
    tier: 1,
    description: "A steadfast protector who endured what others could not.",
    lore: "They stood firm when all others fled. Their resilience shields future heroes.",
    prerequisites: [],
    unlockCondition: {
      minCoreStats: { stamina: 26, strength: 18 },
      minPersonality: { preparation: 22, combatStyle: 12 },
    },
    bonuses: {
      energyBonus: 10,
      combatBonus: 0.08,
    },
    hint: "Endure what others cannot. The best offense is not dying.",
    unlocksPath: ["warlord", "dungeon_master"],
  },

  theorycrafter: {
    id: "theorycrafter",
    name: "Theorycrafter",
    tier: 1,
    description: "A spreadsheet warrior who calculated every variable before stepping inside.",
    lore: "They calculated every variable. Their theorycrafting perfects future strategies.",
    prerequisites: [],
    unlockCondition: {
      minCoreStats: { intelligence: 24 },
      minPersonality: { preparation: 36 },
      minBossKnowledge: { molten_fury: 25 },
    },
    bonuses: {
      energyBonus: 10,
      bossKnowledgeBonus: 0.06,
      knowledgeTransferMultiplier: 1.5,
    },
    hint: "Theory before practice. Data before action. Prepare for everything.",
    unlocksPath: ["dungeon_master"],
  },

  socialite: {
    id: "socialite",
    name: "Socialite",
    tier: 1,
    description: "A community builder who knew everyone worth knowing.",
    lore: "They knew everyone worth knowing. Their connections benefit future heroes.",
    prerequisites: [],
    unlockCondition: {
      minCoreStats: { charismaInfluence: 22 },
      minPersonality: { socialStyle: 24, ambition: 12 },
    },
    bonuses: {
      energyBonus: 10,
      startGold: 35,
      vendorDiscountPct: 0.05,
    },
    hint: "Friends in every tavern. Allies in every guild hall.",
    unlocksPath: ["guildmaster"],
  },

  warlord: {
    id: "warlord",
    name: "Warlord",
    tier: 2,
    description: "A combat commander who led from the front, blade in hand.",
    lore: "They led from the front, blade in hand. Their command echoes through future battles.",
    prerequisites: ["berserker", "guardian"],
    unlockCondition: {
      minCoreStats: { strength: 32, stamina: 26 },
      minPersonality: { combatStyle: 28, ambition: 25 },
    },
    bonuses: {
      energyBonus: 15,
      combatBonus: 0.15,
      bossKnowledgeBonus: 0.03,
    },
    hint: "Strength alone isn't enough. Command it.",
    unlocksPath: ["raid_leader"],
  },

  dungeon_master: {
    id: "dungeon_master",
    name: "Dungeon Master",
    tier: 2,
    description: "An instance expert who cleared a thousand dungeons and knows every trash pack.",
    lore: "They cleared a thousand dungeons. Their expertise guides future delvers.",
    prerequisites: ["berserker", "theorycrafter"],
    unlockCondition: {
      minCoreStats: { strength: 26, intelligence: 22, stamina: 22 },
      minPersonality: { combatStyle: 22, preparation: 25 },
    },
    bonuses: {
      energyBonus: 15,
      combatBonus: 0.12,
      recipeDiscountPct: 0.08,
    },
    hint: "Know every mechanic. Clear every instance. Master the five-man.",
    unlocksPath: ["raid_leader"],
  },

  guildmaster: {
    id: "guildmaster",
    name: "Guildmaster",
    tier: 2,
    description: "A people's champion who built an empire of loyal allies.",
    lore: "They built an empire of loyal allies. Their guild endures beyond any single hero.",
    prerequisites: ["socialite", "merchant"],
    unlockCondition: {
      minCoreStats: { charismaInfluence: 26 },
      minPersonality: { socialStyle: 28, economicFocus: 22 },
      minGoldAtDeath: 350,
    },
    bonuses: {
      energyBonus: 15,
      startGold: 65,
      vendorDiscountPct: 0.1,
      brokerTierStart: 3,
    },
    hint: "Manage the bank. Rally the roster. Lead the guild.",
    unlocksPath: ["raid_leader"],
  },

  treasure_hunter: {
    id: "treasure_hunter",
    name: "Treasure Hunter",
    tier: 2,
    description: "A loot goblin who found riches others missed.",
    lore: "They found riches others missed. Their treasure maps guide future seekers.",
    prerequisites: ["merchant", "scholar"],
    unlockCondition: {
      minCoreStats: { intelligence: 20, charismaInfluence: 18 },
      minPersonality: { economicFocus: 22, preparation: 18 },
      minGoldAtDeath: 300,
    },
    bonuses: {
      energyBonus: 15,
      startGold: 50,
      purpleCraftBonusPct: 0.06,
      recipeDiscountPct: 0.06,
    },
    hint: "Every chest might hold fortune. Know where to look.",
    unlocksPath: [],
  },

  raid_leader: {
    id: "raid_leader",
    name: "Raid Leader",
    tier: 3,
    description: "The apex commander who led armies against gods and won.",
    lore: "They led armies against gods and won. The greatest heroes answer to their call.",
    prerequisites: ["raid_legend", "dungeon_master"],
    unlockCondition: {
      mustDefeatRaids: ["eternal_throne"],
      minCoreStats: { strength: 30, intelligence: 26 },
      minPersonality: { combatStyle: 24, preparation: 22, ambition: 28 },
    },
    bonuses: {
      energyBonus: 25,
      combatBonus: 0.25,
      bossKnowledgeBonus: 0.15,
      knowledgeTransferMultiplier: 3,
      purpleCraftBonusPct: 0.1,
      raidProvisionerUnlocked: true,
    },
    hint: "Command the impossible. Conquer the unconquerable. Lead legends.",
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
