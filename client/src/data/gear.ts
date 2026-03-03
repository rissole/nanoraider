import type { GearItem } from "./types";

export const GEAR_ITEMS: Record<string, GearItem> = {
  // Raid drops (purple)
  eternal_helm: {
    id: "eternal_helm",
    name: "Eternal Helm",
    slot: "head",
    rarity: "purple",
    stats: { strength: 50, stamina: 50 },
  },
  infernal_greatblade: {
    id: "infernal_greatblade",
    name: "Infernal Greatblade",
    slot: "mainhand",
    rarity: "purple",
    stats: { strength: 85, stamina: 15 },
  },
  ember_aegis: {
    id: "ember_aegis",
    name: "Ember Aegis",
    slot: "offhand",
    rarity: "purple",
    stats: { stamina: 85, strength: 15 },
  },
  pyrebound_legs: {
    id: "pyrebound_legs",
    name: "Pyrebound Legguards",
    slot: "legs",
    rarity: "purple",
    stats: { strength: 50, stamina: 50 },
  },
  throneguard_chest: {
    id: "throneguard_chest",
    name: "Throneguard Chestplate",
    slot: "chest",
    rarity: "purple",
    stats: { strength: 50, stamina: 50 },
  },
  crown_of_ashes: {
    id: "crown_of_ashes",
    name: "Crown of Ashes",
    slot: "head",
    rarity: "purple",
    stats: { intelligence: 50, stamina: 50 },
  },

  // Commissioned upgrades (gold sinks)
  enchanters_focus: {
    id: "enchanters_focus",
    name: "Enchanter's Focus",
    slot: "offhand",
    rarity: "blue",
    stats: { intelligence: 36, stamina: 24 },
  },
  runed_warblade: {
    id: "runed_warblade",
    name: "Runed Warblade",
    slot: "mainhand",
    rarity: "blue",
    stats: { strength: 51, stamina: 9 },
  },
  gilded_bulwark: {
    id: "gilded_bulwark",
    name: "Gilded Bulwark",
    slot: "offhand",
    rarity: "blue",
    stats: { stamina: 51, strength: 9 },
  },
} satisfies Record<string, GearItem>;
