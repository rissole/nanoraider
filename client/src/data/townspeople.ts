import type { RaidGate, TownspersonDefinition, TownspersonRoleId } from "./types";

export const RAID_GATE_LABELS: Record<RaidGate, string> = {
  none: "Outpost Residents",
  molten_fury: "Molten Fury Veterans",
  eternal_throne: "Eternal Throne Champions",
};

export const TOWNSPEOPLE: Record<TownspersonRoleId, TownspersonDefinition> = {
  battlemaster: {
    id: "battlemaster",
    name: "Battlemaster",
    raidGate: "none",
    description: "A veteran warrior who mastered the art of combat.",
    lore: "They fought without hesitation, turning every battlefield into a masterclass.",
    unlockCondition: {
      minTriangle: { war: 55 },
      minDaring: 30,
    },
    bonuses: {
      energyBonus: 5,
      combatBonus: 0.08,
    },
    hint: "High war focus and a willingness to take risks. Dangerous dungeons build war fast.",
  },

  lorekeeper: {
    id: "lorekeeper",
    name: "Lorekeeper",
    raidGate: "none",
    description: "A scholar whose preparation bordered on obsession.",
    lore: "Every scroll read, every tactic memorized. Their knowledge outlasts their battles.",
    unlockCondition: {
      minTriangle: { wit: 55 },
      minBossReadiness: { molten_fury: 25 },
    },
    bonuses: {
      energyBonus: 5,
      bossReadinessBonus: 0.05,
      knowledgeTransferMultiplier: 1.5,
    },
    hint: "Study bosses repeatedly and invest heavily in wit.",
  },

  quartermaster: {
    id: "quartermaster",
    name: "Quartermaster",
    raidGate: "none",
    description: "A merchant who turned coin into power.",
    lore: "Gold flows to those who know where to spend it. Their wealth funds every future run.",
    unlockCondition: {
      minTriangle: { wealth: 55 },
      minGoldAtDeath: 400,
    },
    bonuses: {
      energyBonus: 5,
      startGold: 40,
      vendorDiscountPct: 0.06,
    },
    hint: "Pile up wealth and hold onto your gold at death.",
  },

  trailblazer: {
    id: "trailblazer",
    name: "Trailblazer",
    raidGate: "none",
    description: "A reckless pioneer who found glory where others saw only risk.",
    lore: "They ran toward danger. Every scar told a story worth telling.",
    unlockCondition: {
      minDaring: 55,
      minTriangle: { war: 25 },
    },
    bonuses: {
      energyBonus: 5,
      combatBonus: 0.05,
      recipeDiscountPct: 0.06,
    },
    hint: "Live dangerously. High daring comes from choosing risky paths.",
  },

  herald: {
    id: "herald",
    name: "Herald",
    raidGate: "none",
    description: "A social titan whose reputation opened every door.",
    lore: "Fame is its own currency. Their name alone commanded respect.",
    unlockCondition: {
      minRenown: 50,
      minTriangle: { wealth: 15 },
    },
    bonuses: {
      energyBonus: 5,
      startGold: 25,
      vendorDiscountPct: 0.04,
    },
    hint: "Build renown through social activities and hosting guild meetings.",
  },

  forgemaster: {
    id: "forgemaster",
    name: "Forgemaster",
    raidGate: "molten_fury",
    description: "A raid veteran who forged the mightiest equipment.",
    lore: "They walked through fire and came out with blueprints for perfection.",
    unlockCondition: {
      mustDefeatRaids: ["molten_fury"],
      minBossReadiness: { molten_fury: 60 },
      minTriangle: { wit: 25, war: 25 },
    },
    bonuses: {
      energyBonus: 8,
      purpleCraftStatBonusPct: 0.08,
      recipeDiscountPct: 0.06,
      brokerTierStart: 2,
    },
    hint: "Defeat Molten Fury with deep readiness and balanced wit/war.",
  },

  warchief: {
    id: "warchief",
    name: "Warchief",
    raidGate: "molten_fury",
    description: "A post-raid warlord who turned combat mastery into legend.",
    lore: "After defeating the Molten Fury, they were unstoppable.",
    unlockCondition: {
      mustDefeatRaids: ["molten_fury"],
      minTriangle: { war: 45 },
      minDaring: 45,
      minRenown: 25,
    },
    bonuses: {
      energyBonus: 8,
      combatBonus: 0.12,
      bossReadinessBonus: 0.05,
    },
    hint: "Defeat Molten Fury with high war, daring, and renown.",
  },

  siegebreaker: {
    id: "siegebreaker",
    name: "Siegebreaker",
    raidGate: "eternal_throne",
    description: "The apex hero who conquered the Eternal Throne itself.",
    lore: "No enemy, no fortress, no god could stop them. Their legend echoes forever.",
    unlockCondition: {
      mustDefeatRaids: ["eternal_throne"],
      minTriangle: { war: 20, wit: 20, wealth: 15 },
      minDaring: 50,
      minRenown: 30,
      minBossReadiness: { eternal_throne: 70 },
    },
    bonuses: {
      energyBonus: 12,
      combatBonus: 0.1,
      bossReadinessBonus: 0.08,
      knowledgeTransferMultiplier: 2.5,
      purpleCraftStatBonusPct: 0.06,
      raidProvisionerUnlocked: true,
    },
    hint: "Defeat the Eternal Throne with mastery across all dimensions.",
  },
};

export const TOWNSPERSON_LIST = Object.values(TOWNSPEOPLE);

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
