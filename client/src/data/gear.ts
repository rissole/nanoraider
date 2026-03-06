import type { GearItem } from "./types";

export const GEAR_ITEMS: Record<string, GearItem> = {
  // Raid drops (purple)
  eternal_helm: {
    id: "eternal_helm",
    name: "Eternal Helm",
    slot: "head",
    rarity: "purple",
    power: 100,
  },
  infernal_greatblade: {
    id: "infernal_greatblade",
    name: "Infernal Greatblade",
    slot: "mainhand",
    rarity: "purple",
    power: 100,
  },
  ember_aegis: {
    id: "ember_aegis",
    name: "Ember Aegis",
    slot: "offhand",
    rarity: "purple",
    power: 100,
  },
  pyrebound_legs: {
    id: "pyrebound_legs",
    name: "Pyrebound Legguards",
    slot: "legs",
    rarity: "purple",
    power: 100,
  },
  throneguard_chest: {
    id: "throneguard_chest",
    name: "Throneguard Chestplate",
    slot: "chest",
    rarity: "purple",
    power: 100,
  },
  crown_of_ashes: {
    id: "crown_of_ashes",
    name: "Crown of Ashes",
    slot: "head",
    rarity: "purple",
    power: 100,
  },

  // Commissioned upgrades (gold sinks)
  enchanters_focus: {
    id: "enchanters_focus",
    name: "Enchanter's Focus",
    slot: "offhand",
    rarity: "blue",
    power: 60,
  },
  runed_warblade: {
    id: "runed_warblade",
    name: "Runed Warblade",
    slot: "mainhand",
    rarity: "blue",
    power: 60,
  },
  gilded_bulwark: {
    id: "gilded_bulwark",
    name: "Gilded Bulwark",
    slot: "offhand",
    rarity: "blue",
    power: 60,
  },
} satisfies Record<string, GearItem>;
