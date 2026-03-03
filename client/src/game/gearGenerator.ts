import type {
  ArmorSlot,
  ArmorWeight,
  CoreStatKey,
  CoreStats,
  GearItem,
  GearRarity,
  GearSlot,
  GearSlots,
  Hero,
  HeroClass,
  WeaponSlot,
} from "../data/types";

const CLASS_ARMOR_WEIGHT: Record<HeroClass, ArmorWeight> = {
  warrior: "plate",
  rogue: "leather",
  mage: "cloth",
  guardian: "plate",
  bard: "leather",
};

const CLASS_ADJECTIVES: Record<HeroClass, Record<GearRarity, string[]>> = {
  warrior: {
    gray: ["Rusty", "Worn", "Rough", "Battered", "Plain", "Dented", "Sturdy", "Drilled"],
    green: ["Ironforged", "Tempered", "Steadfast", "Stonebound", "Battleworn", "Steelbound", "Relentless", "Warborn"],
    blue: ["Vanguard", "Bulwark", "Stormforged", "Champion's", "Valorbound", "Lionguard", "Siegeborn", "Unbroken"],
    purple: ["Doomforged", "Kingsguard", "Titanic", "Warlord's", "Imperious", "Godsteel", "Worldbreaker", "Eternal"],
  },
  rogue: {
    gray: ["Dull", "Worn", "Patchwork", "Smudged", "Muted", "Frayed", "Scuffed", "Crooked"],
    green: ["Shadow", "Silent", "Nightwoven", "Quickstep", "Whispered", "Sly", "Duskbound", "Veiled"],
    blue: ["Phantom", "Venomtipped", "Moonshade", "Backstabber's", "Mistbound", "Umbral", "Ghoststep", "Nocturne"],
    purple: ["Deathwhisper", "Voidfang", "Nightlord's", "Soulshade", "Eclipsed", "Assassin's", "Endless Dusk", "Abyssal"],
  },
  mage: {
    gray: ["Faded", "Torn", "Worn", "Dusty", "Frayed", "Humble", "Simple", "Dull"],
    green: ["Arcane", "Runed", "Shimmering", "Leybound", "Mystic", "Spellwoven", "Whispering", "Sparking"],
    blue: ["Astral", "Aetheric", "Starbound", "Frostsigil", "Stormsigil", "Voidtouched", "Moonlit", "Sage's"],
    purple: ["Ethereal", "Cosmic", "Archmage's", "Netherbound", "Realitytorn", "Celestial", "Infinite", "Mythic"],
  },
  guardian: {
    gray: ["Dented", "Worn", "Heavy", "Reinforced", "Plain", "Scuffed", "Thick", "Rugged"],
    green: ["Ironclad", "Stalwart", "Bulwark", "Enduring", "Steadfast", "Bastion", "Resolute", "Immovable"],
    blue: ["Aegis", "Fortress", "Unwavering", "Adamant", "Sentinel", "Wardbound", "Tower", "Indomitable"],
    purple: ["Titanwall", "Sovereign Guard", "Eternal Bulwark", "Worldward", "Impervious", "Divineshield", "Unbreakable", "Invincible"],
  },
  bard: {
    gray: ["Tattered", "Worn", "Faded", "Patched", "Plain", "Muted", "Dusty", "Humble"],
    green: ["Singsong", "Merriment", "Lively", "Charming", "Silver-tongued", "Alluring", "Enchanting", "Melodic"],
    blue: ["Resonant", "Harmonic", "Serenade", "Spellbinding", "Enrapturing", "Captivating", "Inspiring", "Legendbound"],
    purple: ["Symphonic", "Eternal Ballad", "Mythweaver", "Worldsinger", "Oracle's Lyre", "Voidchant", "Celestial Song", "Transcendent"],
  },
};

const ARMOR_TYPES: Record<HeroClass, Record<ArmorSlot, Record<GearRarity, string[]>>> = {
  warrior: {
    head: { gray: ["Cap", "Coif"], green: ["Helm", "Sallet"], blue: ["Helm", "Faceguard"], purple: ["Warhelm", "Battlecrown"] },
    chest: { gray: ["Vest", "Jerkin"], green: ["Hauberk", "Cuirass"], blue: ["Breastplate", "Chestguard"], purple: ["Warplate", "Aegisplate"] },
    legs: { gray: ["Breeches", "Leggings"], green: ["Greaves", "Tassets"], blue: ["Legplates", "Legguards"], purple: ["Warlegs", "Grandgreaves"] },
  },
  rogue: {
    head: { gray: ["Mask", "Hood"], green: ["Cowl", "Headwrap"], blue: ["Visor", "Shadowmask"], purple: ["Nightmask", "Phantom Hood"] },
    chest: { gray: ["Jerkin", "Vest"], green: ["Leathercoat", "Brigandine"], blue: ["Shadowvest", "Nightguard"], purple: ["Duskhide", "Silent Harness"] },
    legs: { gray: ["Pants", "Breeches"], green: ["Leggings", "Striders"], blue: ["Nightpants", "Slipguards"], purple: ["Ghoststriders", "Phantom Treads"] },
  },
  mage: {
    head: { gray: ["Hood", "Cowl"], green: ["Circlet", "Diadem"], blue: ["Tiara", "Crest"], purple: ["Coronet", "Mindcrown"] },
    chest: { gray: ["Tunic", "Wrap"], green: ["Robe", "Vestments"], blue: ["Regalia", "Spellrobe"], purple: ["Raiment", "Arcanerobe"] },
    legs: { gray: ["Pants", "Breeches"], green: ["Leggings", "Trousers"], blue: ["Legwraps", "Kilt"], purple: ["Spellweave", "Silkguards"] },
  },
  guardian: {
    head: { gray: ["Cap", "Coif"], green: ["Great Helm", "Bascinet"], blue: ["Faceguard", "Guard Helm"], purple: ["Bastion Helm", "Immortal Crown"] },
    chest: { gray: ["Vest", "Hauberk"], green: ["Cuirass", "Brigandine"], blue: ["Chestguard", "Fortress Plate"], purple: ["Aegisplate", "Sovereign Guard"] },
    legs: { gray: ["Breeches", "Leggings"], green: ["Greaves", "Tassets"], blue: ["Legguards", "Tower Legs"], purple: ["Grandgreaves", "Unbreakable Striders"] },
  },
  bard: {
    head: { gray: ["Cap", "Band"], green: ["Circlet", "Feather Crown"], blue: ["Diadem", "Enchanter's Crest"], purple: ["Mythweave Crown", "Celestial Lyre Crown"] },
    chest: { gray: ["Tunic", "Vest"], green: ["Doublet", "Performance Robe"], blue: ["Enchanter's Vest", "Harmonic Tunic"], purple: ["Symphonic Raiment", "Legend's Attire"] },
    legs: { gray: ["Pants", "Breeches"], green: ["Leggings", "Striders"], blue: ["Performance Breeches", "Charming Legwraps"], purple: ["Ballad Striders", "Eternal Song Leggings"] },
  },
};

const WEAPON_NAMES: Record<HeroClass, Record<WeaponSlot, Record<GearRarity, string[]>>> = {
  warrior: {
    mainhand: { gray: ["Rusty Blade"], green: ["Iron Cleaver", "Mercenary Axe"], blue: ["Warbringer", "Molten Edge"], purple: ["Worldsplitter", "Doomblade"] },
    offhand: { gray: ["Dented Buckler"], green: ["Ironwall Shield", "Riveted Bulwark"], blue: ["Bastion Wall", "Tower Shield"], purple: ["Aegis of Fury", "Stormwark"] },
  },
  rogue: {
    mainhand: { gray: ["Dull Dagger"], green: ["Quickfang", "Backalley Shiv"], blue: ["Nightfang", "Ghostblade"], purple: ["Silencer", "Phantom Fang"] },
    offhand: { gray: ["Rusty Shiv"], green: ["Sidefang", "Hidden Dirk"], blue: ["Whisper Knife", "Duskslice"], purple: ["Shadowbite", "Second Silence"] },
  },
  mage: {
    mainhand: { gray: ["Cracked Staff"], green: ["Runewood Staff", "Spellbranch"], blue: ["Astral Scepter", "Leyfire Staff"], purple: ["Starcall Staff", "Arcanum Spire"] },
    offhand: { gray: ["Faded Orb"], green: ["Glass Orb", "Minor Grimoire"], blue: ["Aether Orb", "Spellbound Tome"], purple: ["Cosmic Relic", "Codex of Embers"] },
  },
  guardian: {
    mainhand: { gray: ["Rusty Mace"], green: ["Iron Mace", "Guard Hammer"], blue: ["Bastion Mace", "Tower Hammer"], purple: ["Aegis Mace", "Impervious Maul"] },
    offhand: { gray: ["Dented Buckler"], green: ["Ironwall Shield", "Riveted Bulwark"], blue: ["Bastion Wall", "Tower Shield"], purple: ["Aegis of the Guardian", "Unbreakable Wall"] },
  },
  bard: {
    mainhand: { gray: ["Worn Lute"], green: ["Silverstring Lute", "Traveler's Lyre"], blue: ["Resonant Lute", "Enchanter's Harp"], purple: ["Symphonic Lyre", "Eternal Ballad"] },
    offhand: { gray: ["Tin Whistle"], green: ["Hand Drum", "Pocket Flute"], blue: ["Harmonic Bell", "Spellbound Tambourine"], purple: ["Mythweaver's Instrument", "Celestial Chime"] },
  },
};

const STAT_BUDGET_TABLE: Record<GearRarity, { base: number; perLevel: number }> = {
  gray: { base: 5, perLevel: 2 },
  green: { base: 10, perLevel: 3 },
  blue: { base: 15, perLevel: 5 },
  purple: { base: 25, perLevel: 7 },
};

// Weights per class/slot: primary stat dominant, secondary stats thematically weighted.
// Primary: warrior=STR, rogue=AGI, mage=INT, guardian=STA, bard=CHA
// Each slot's weights sum to 1.
type StatWeights = Partial<Record<CoreStatKey, number>>;
const STAT_WEIGHTS: Record<HeroClass, Record<GearSlot, StatWeights>> = {
  warrior: {
    head: { strength: 0.55, stamina: 0.35, agility: 0.1 },
    chest: { strength: 0.5, stamina: 0.45, agility: 0.05 },
    legs: { strength: 0.45, stamina: 0.45, agility: 0.1 },
    mainhand: { strength: 0.8, stamina: 0.15, agility: 0.05 },
    offhand: { strength: 0.35, stamina: 0.6, agility: 0.05 },
  },
  rogue: {
    head: { agility: 0.55, strength: 0.25, charismaInfluence: 0.2 },
    chest: { agility: 0.5, strength: 0.3, stamina: 0.2 },
    legs: { agility: 0.6, strength: 0.25, stamina: 0.15 },
    mainhand: { agility: 0.75, strength: 0.2, charismaInfluence: 0.05 },
    offhand: { agility: 0.7, strength: 0.25, stamina: 0.05 },
  },
  mage: {
    head: { intelligence: 0.6, stamina: 0.3, charismaInfluence: 0.1 },
    chest: { intelligence: 0.55, stamina: 0.35, charismaInfluence: 0.1 },
    legs: { intelligence: 0.5, stamina: 0.4, charismaInfluence: 0.1 },
    mainhand: { intelligence: 0.8, stamina: 0.15, charismaInfluence: 0.05 },
    offhand: { intelligence: 0.6, stamina: 0.35, charismaInfluence: 0.05 },
  },
  guardian: {
    head: { stamina: 0.55, strength: 0.35, agility: 0.1 },
    chest: { stamina: 0.6, strength: 0.3, agility: 0.1 },
    legs: { stamina: 0.55, strength: 0.35, agility: 0.1 },
    mainhand: { stamina: 0.5, strength: 0.45, agility: 0.05 },
    offhand: { stamina: 0.75, strength: 0.2, agility: 0.05 },
  },
  bard: {
    head: { charismaInfluence: 0.55, intelligence: 0.3, agility: 0.15 },
    chest: { charismaInfluence: 0.5, intelligence: 0.3, stamina: 0.2 },
    legs: { charismaInfluence: 0.5, agility: 0.3, stamina: 0.2 },
    mainhand: { charismaInfluence: 0.7, intelligence: 0.2, agility: 0.1 },
    offhand: { charismaInfluence: 0.65, intelligence: 0.25, stamina: 0.1 },
  },
};

const GEAR_SLOTS: GearSlot[] = ["head", "chest", "legs", "mainhand", "offhand"];
const ARMOR_SLOTS: ArmorSlot[] = ["head", "chest", "legs"];

function randomFrom<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T;
}

function adjectiveFromName(name: string): string | null {
  const [adjective] = name.split(" ");
  return adjective ?? null;
}

function statBudgetForLevel(rarity: GearRarity, level: number): number {
  const { base, perLevel } = STAT_BUDGET_TABLE[rarity];
  return base + level * perLevel;
}

export function sumGearStats(item: GearItem): number {
  return Object.values(item.stats).reduce((sum, v) => sum + (typeof v === "number" ? v : 0), 0);
}

function maybeMatchExistingAdjective(heroClass: HeroClass, rarity: GearRarity, level: number, existingGear: GearSlots): string | null {
  const allowedAdjectives = new Set(CLASS_ADJECTIVES[heroClass][rarity]);
  const expectedBudget = statBudgetForLevel(rarity, level);
  const candidates = Object.values(existingGear).filter((item): item is GearItem => item !== null)
    .filter((item) => item.rarity === rarity && Math.abs(sumGearStats(item) - expectedBudget) <= 20)
    .map((item) => adjectiveFromName(item.name))
    .filter((adj): adj is string => adj !== null && allowedAdjectives.has(adj));

  if (candidates.length === 0 || Math.random() > 0.7) {
    return null;
  }
  return randomFrom(candidates);
}

function distributeStatsToItem(heroClass: HeroClass, slot: GearSlot, budget: number): Partial<Record<CoreStatKey, number>> {
  const weights = STAT_WEIGHTS[heroClass][slot];
  const stats: Partial<Record<CoreStatKey, number>> = {};
  for (const [key, weight] of Object.entries(weights)) {
    const value = Math.round(budget * weight);
    if (value > 0) {
      stats[key as CoreStatKey] = value;
    }
  }
  // Ensure we use the full budget (rounding can leave 1-2 points)
  const currentSum = Object.values(stats).reduce((a, b) => a + b, 0);
  if (currentSum < budget && Object.keys(stats).length > 0) {
    const primaryKey = Object.keys(weights)[0] as CoreStatKey;
    stats[primaryKey] = (stats[primaryKey] ?? 0) + (budget - currentSum);
  }
  return stats;
}

function armorNameFor(heroClass: HeroClass, slot: ArmorSlot, rarity: GearRarity, level: number, existingGear: GearSlots): string {
  const preferred = maybeMatchExistingAdjective(heroClass, rarity, level, existingGear);
  const adjective = preferred ?? randomFrom(CLASS_ADJECTIVES[heroClass][rarity]);
  const clothingType = randomFrom(ARMOR_TYPES[heroClass][slot][rarity]);
  return `${adjective} ${clothingType}`;
}

function weaponNameFor(heroClass: HeroClass, slot: WeaponSlot, rarity: GearRarity): string {
  return randomFrom(WEAPON_NAMES[heroClass][slot][rarity]);
}

function buildGeneratedItemId(heroClass: HeroClass, slot: GearSlot, rarity: GearRarity): string {
  const nonce = Math.random().toString(36).slice(2, 8);
  return `generated_${heroClass}_${slot}_${rarity}_${Date.now()}_${nonce}`;
}

export function getEffectiveCoreStats(hero: Hero): CoreStats {
  const base: CoreStats = { ...hero.coreStats };
  for (const item of Object.values(hero.gear)) {
    if (item === null) {
      continue;
    }
    for (const [key, value] of Object.entries(item.stats)) {
      base[key as CoreStatKey] += typeof value === "number" ? value : 0;
    }
  }
  return base;
}

export const STAT_SHORT_LABELS: Record<CoreStatKey, string> = {
  strength: "STR",
  agility: "AGI",
  intelligence: "INT",
  stamina: "STA",
  charismaInfluence: "CHR",
};

export function formatGearStats(stats: Partial<Record<CoreStatKey, number>>): string {
  return Object.entries(stats)
    .filter(([, v]) => typeof v === "number" && v > 0)
    .map(([k, v]) => `+${v} ${STAT_SHORT_LABELS[k as CoreStatKey]}`)
    .join(" ");
}

export function getArmorWeightForClass(heroClass: HeroClass): ArmorWeight {
  return CLASS_ARMOR_WEIGHT[heroClass];
}

export function randomHeroClass(): HeroClass {
  return randomFrom(["warrior", "rogue", "mage", "guardian", "bard"] as const);
}

export function randomGearSlot(): GearSlot {
  return randomFrom(GEAR_SLOTS);
}

export function generateGear(
  heroClass: HeroClass,
  slot: GearSlot,
  rarity: GearRarity,
  level: number,
  existingGear: GearSlots,
): GearItem {
  const name = ARMOR_SLOTS.includes(slot as ArmorSlot)
    ? armorNameFor(heroClass, slot as ArmorSlot, rarity, level, existingGear)
    : weaponNameFor(heroClass, slot as WeaponSlot, rarity);

  const budget = statBudgetForLevel(rarity, level);
  const stats = distributeStatsToItem(heroClass, slot, budget);

  return {
    id: buildGeneratedItemId(heroClass, slot, rarity),
    name,
    slot,
    rarity,
    stats,
  };
}
