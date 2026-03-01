import type { GearItem } from "./types";

export const GEAR_ITEMS: Record<string, GearItem> = {
  // Starting gear (gray)
  worn_helm: { id: "worn_helm", name: "Worn Helm", slot: "helmet", rarity: "gray", itemPower: 10, description: "A battered helmet." },
  worn_chest: { id: "worn_chest", name: "Worn Chestplate", slot: "chest", rarity: "gray", itemPower: 10, description: "Dented armor." },

  // Scholomance drops (blue)
  shadowforged_helm: { id: "shadowforged_helm", name: "Shadowforged Helm", slot: "helmet", rarity: "blue", itemPower: 50, description: "Imbued with dark magic from the academy." },
  scholar_gloves: { id: "scholar_gloves", name: "Scholar's Gloves", slot: "gloves", rarity: "blue", itemPower: 50, description: "Enchanted gloves for arcane precision." },
  dark_rune_staff: { id: "dark_rune_staff", name: "Dark Rune Staff", slot: "weapon", rarity: "blue", itemPower: 50, description: "Carved from ancient bone." },

  // Blackrock Depths drops (blue)
  darksteel_chest: { id: "darksteel_chest", name: "Darksteel Chestplate", slot: "chest", rarity: "blue", itemPower: 50, description: "Forged in the fires of Blackrock." },
  ironclad_boots: { id: "ironclad_boots", name: "Ironclad Boots", slot: "boots", rarity: "blue", itemPower: 50, description: "Nearly indestructible." },
  crusher_axe: { id: "crusher_axe", name: "Crusher Axe", slot: "weapon", rarity: "blue", itemPower: 50, description: "Favoured by berserkers." },
  berserker_ring: { id: "berserker_ring", name: "Berserker's Ring", slot: "accessory", rarity: "blue", itemPower: 50, description: "Pulses with battle rage." },

  // Raid drops (purple)
  eternal_helm: { id: "eternal_helm", name: "Eternal Helm", slot: "helmet", rarity: "purple", itemPower: 100, description: "Molten Fury's crown, now yours." },
  molten_boots: { id: "molten_boots", name: "Molten Boots", slot: "boots", rarity: "purple", itemPower: 100, description: "Still warm with elemental fire." },
} satisfies Record<string, GearItem>;
