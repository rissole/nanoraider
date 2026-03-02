import type { MaterialId, RecipeDefinition, RecipeId, VendorId, VendorOffer, VendorTier } from "./types";

const SLOT_ORDER = ["head", "chest", "legs", "mainhand", "offhand"] as const;

const GREEN_REFORGE_BASE: Omit<RecipeDefinition, "id" | "slot" | "rarity"> = {
  energyCost: 6,
  goldCost: 20,
  materialsCost: { iron_shards: 3 },
  requiresKnownRecipe: false,
};

const BLUE_CRAFT_BASE: Omit<RecipeDefinition, "id" | "slot" | "rarity"> = {
  energyCost: 10,
  goldCost: 70,
  materialsCost: { iron_shards: 4, arcane_essence: 2 },
  requiresKnownRecipe: true,
};

const PURPLE_UPGRADE_BASE: Omit<RecipeDefinition, "id" | "slot" | "rarity"> = {
  energyCost: 14,
  goldCost: 140,
  materialsCost: { arcane_essence: 4, ember_core: 2, vault_relic: 1 },
  requiresKnownRecipe: true,
};

export const MATERIAL_LABELS: Record<MaterialId, string> = {
  iron_shards: "Iron Shards",
  arcane_essence: "Arcane Essence",
  ember_core: "Ember Core",
  vault_relic: "Vault Relic",
};

export const RECIPE_DEFINITIONS: Record<RecipeId, RecipeDefinition> = {
  reforge_green_head: { id: "reforge_green_head", slot: "head", rarity: "green", ...GREEN_REFORGE_BASE },
  reforge_green_chest: { id: "reforge_green_chest", slot: "chest", rarity: "green", ...GREEN_REFORGE_BASE },
  reforge_green_legs: { id: "reforge_green_legs", slot: "legs", rarity: "green", ...GREEN_REFORGE_BASE },
  reforge_green_mainhand: { id: "reforge_green_mainhand", slot: "mainhand", rarity: "green", ...GREEN_REFORGE_BASE },
  reforge_green_offhand: { id: "reforge_green_offhand", slot: "offhand", rarity: "green", ...GREEN_REFORGE_BASE },
  craft_blue_head: { id: "craft_blue_head", slot: "head", rarity: "blue", ...BLUE_CRAFT_BASE },
  craft_blue_chest: { id: "craft_blue_chest", slot: "chest", rarity: "blue", ...BLUE_CRAFT_BASE },
  craft_blue_legs: { id: "craft_blue_legs", slot: "legs", rarity: "blue", ...BLUE_CRAFT_BASE },
  craft_blue_mainhand: { id: "craft_blue_mainhand", slot: "mainhand", rarity: "blue", ...BLUE_CRAFT_BASE },
  craft_blue_offhand: { id: "craft_blue_offhand", slot: "offhand", rarity: "blue", ...BLUE_CRAFT_BASE },
  upgrade_purple_head: { id: "upgrade_purple_head", slot: "head", rarity: "purple", ...PURPLE_UPGRADE_BASE },
  upgrade_purple_chest: { id: "upgrade_purple_chest", slot: "chest", rarity: "purple", ...PURPLE_UPGRADE_BASE },
  upgrade_purple_legs: { id: "upgrade_purple_legs", slot: "legs", rarity: "purple", ...PURPLE_UPGRADE_BASE },
  upgrade_purple_mainhand: { id: "upgrade_purple_mainhand", slot: "mainhand", rarity: "purple", ...PURPLE_UPGRADE_BASE },
  upgrade_purple_offhand: { id: "upgrade_purple_offhand", slot: "offhand", rarity: "purple", ...PURPLE_UPGRADE_BASE },
};

const VENDOR_OFFERS: VendorOffer[] = [
  {
    id: "quartermaster_iron_bundle",
    vendorId: "quartermaster",
    name: "Starter Scrap Bundle",
    description: "Reliable early crafting fuel.",
    tier: 1,
    costs: { gold: 45 },
    rewards: { materials: { iron_shards: 5 } },
  },
  {
    id: "quartermaster_supply_kit",
    vendorId: "quartermaster",
    name: "Raid Supply Crate",
    description: "Mixed prep materials for risky days.",
    tier: 1,
    costs: { gold: 90 },
    rewards: { materials: { iron_shards: 3, arcane_essence: 1 } },
  },
  {
    id: "artisan_arcane_pack",
    vendorId: "artisan",
    name: "Arcane Components",
    description: "Core reagent for rare crafts.",
    tier: 1,
    costs: { gold: 80, materials: { iron_shards: 2 } },
    rewards: { materials: { arcane_essence: 2 } },
  },
  {
    id: "artisan_head_blueprint",
    vendorId: "artisan",
    name: "Head Rare Blueprint",
    description: "Unlock targeted head-slot blue crafting.",
    tier: 1,
    costs: { gold: 120 },
    rewards: { recipeUnlocks: ["craft_blue_head"] },
  },
  {
    id: "artisan_chest_blueprint",
    vendorId: "artisan",
    name: "Chest Rare Blueprint",
    description: "Unlock targeted chest-slot blue crafting.",
    tier: 1,
    costs: { gold: 120 },
    rewards: { recipeUnlocks: ["craft_blue_chest"] },
  },
  {
    id: "artisan_legs_blueprint",
    vendorId: "artisan",
    name: "Legs Rare Blueprint",
    description: "Unlock targeted legs-slot blue crafting.",
    tier: 1,
    costs: { gold: 120 },
    rewards: { recipeUnlocks: ["craft_blue_legs"] },
  },
  {
    id: "artisan_mainhand_blueprint",
    vendorId: "artisan",
    name: "Mainhand Rare Blueprint",
    description: "Unlock targeted mainhand blue crafting.",
    tier: 2,
    costs: { gold: 180, materials: { arcane_essence: 2 } },
    rewards: { recipeUnlocks: ["craft_blue_mainhand"] },
  },
  {
    id: "artisan_offhand_blueprint",
    vendorId: "artisan",
    name: "Offhand Rare Blueprint",
    description: "Unlock targeted offhand blue crafting.",
    tier: 2,
    costs: { gold: 180, materials: { arcane_essence: 2 } },
    rewards: { recipeUnlocks: ["craft_blue_offhand"] },
  },
  {
    id: "broker_relic_cache",
    vendorId: "broker",
    name: "Suspicious Relic Cache",
    description: "Expensive, swingy relic stash.",
    tier: 2,
    costs: { gold: 220 },
    rewards: { materials: { arcane_essence: 3, ember_core: 1 } },
    rotating: true,
  },
  {
    id: "broker_discounted_focus",
    vendorId: "broker",
    name: "Discounted Enchanter Focus",
    description: "A known strong offhand, below market price.",
    tier: 2,
    costs: { gold: 150 },
    rewards: { fixedItemId: "enchanters_focus" },
    rotating: true,
  },
  {
    id: "raid_provisioner_ember_pack",
    vendorId: "raid_provisioner",
    name: "Ember Pack",
    description: "Required for purple upgrades.",
    tier: 1,
    costs: { gold: 180, materials: { arcane_essence: 2 } },
    rewards: { materials: { ember_core: 2 } },
  },
  {
    id: "raid_provisioner_vault_relic",
    vendorId: "raid_provisioner",
    name: "Vault Relic",
    description: "Capstone-grade forging catalyst.",
    tier: 2,
    costs: { gold: 260, materials: { ember_core: 2 } },
    rewards: { materials: { vault_relic: 1 } },
  },
];

export function listVendorOffers(vendorId: VendorId, day: number): VendorOffer[] {
  const allOffers = VENDOR_OFFERS.filter((offer) => offer.vendorId === vendorId);
  const anchors = allOffers.filter((offer) => offer.rotating !== true);
  const rotating = allOffers.filter((offer) => offer.rotating === true);
  if (rotating.length === 0) {
    return anchors;
  }
  const rotatingOffer = rotating[day % rotating.length];
  if (rotatingOffer === undefined) {
    return anchors;
  }
  return [...anchors, rotatingOffer];
}

export function baseVendorTierUnlocks(): Partial<Record<VendorId, VendorTier>> {
  return {
    quartermaster: 1,
    artisan: 1,
    broker: 1,
  };
}

export function defaultKnownRecipes(): RecipeId[] {
  return SLOT_ORDER.map((slot) => `reforge_green_${slot}` as RecipeId);
}

