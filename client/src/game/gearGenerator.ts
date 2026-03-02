import type { ArmorSlot, ArmorWeight, GearItem, GearRarity, GearSlot, GearSlots, HeroClass, WeaponSlot } from "../data/types";

const CLASS_ARMOR_WEIGHT: Record<HeroClass, ArmorWeight> = {
  warrior: "plate",
  mage: "cloth",
  priest: "cloth",
  rogue: "leather",
  hunter: "leather",
};

const CLASS_ADJECTIVES: Record<HeroClass, Record<GearRarity, string[]>> = {
  warrior: {
    gray: ["Rusty", "Worn", "Rough", "Battered", "Plain", "Dented", "Sturdy", "Drilled"],
    green: ["Ironforged", "Tempered", "Steadfast", "Stonebound", "Battleworn", "Steelbound", "Relentless", "Warborn"],
    blue: ["Vanguard", "Bulwark", "Stormforged", "Champion's", "Valorbound", "Lionguard", "Siegeborn", "Unbroken"],
    purple: ["Doomforged", "Kingsguard", "Titanic", "Warlord's", "Imperious", "Godsteel", "Worldbreaker", "Eternal"],
  },
  mage: {
    gray: ["Faded", "Torn", "Worn", "Dusty", "Frayed", "Humble", "Simple", "Dull"],
    green: ["Arcane", "Runed", "Shimmering", "Leybound", "Mystic", "Spellwoven", "Whispering", "Sparking"],
    blue: ["Astral", "Aetheric", "Starbound", "Frostsigil", "Stormsigil", "Voidtouched", "Moonlit", "Sage's"],
    purple: ["Ethereal", "Cosmic", "Archmage's", "Netherbound", "Realitytorn", "Celestial", "Infinite", "Mythic"],
  },
  priest: {
    gray: ["Plain", "Worn", "Frugal", "Tattered", "Simple", "Muted", "Dawnfaded", "Pale"],
    green: ["Hallowed", "Blessed", "Serene", "Devout", "Radiant", "Sacred", "Penitent", "Dawnlit"],
    blue: ["Sanctified", "Luminous", "Vigilant", "Hymnbound", "Graceforged", "Beaconed", "Purified", "Reverent"],
    purple: ["Divine", "Ascended", "Exalted", "Oracle's", "Saintly", "Heavenbound", "Eternal Grace", "Transcendent"],
  },
  rogue: {
    gray: ["Dull", "Worn", "Patchwork", "Smudged", "Muted", "Frayed", "Scuffed", "Crooked"],
    green: ["Shadow", "Silent", "Nightwoven", "Quickstep", "Whispered", "Sly", "Duskbound", "Veiled"],
    blue: ["Phantom", "Venomtipped", "Moonshade", "Backstabber's", "Mistbound", "Umbral", "Ghoststep", "Nocturne"],
    purple: ["Deathwhisper", "Voidfang", "Nightlord's", "Soulshade", "Eclipsed", "Assassin's", "Endless Dusk", "Abyssal"],
  },
  hunter: {
    gray: ["Worn", "Rough", "Weathered", "Plain", "Dusty", "Scuffed", "Old", "Trailworn"],
    green: ["Wildthorn", "Windswept", "Beastmarked", "Trailborn", "Feral", "Verdant", "Thornbound", "Hawkeye"],
    blue: ["Stormchaser", "Moonstalker", "Packleader's", "Skyrider", "Oakbound", "Frosttrail", "Longshot", "Grimtrack"],
    purple: ["Beastbane", "Worldstalker", "Dragonhunt", "Mythtrail", "Skyreaver", "Apex Predator", "Primeval", "Everwild"],
  },
};

const ARMOR_TYPES: Record<HeroClass, Record<ArmorSlot, Record<GearRarity, string[]>>> = {
  warrior: {
    head: { gray: ["Cap", "Coif"], green: ["Helm", "Sallet"], blue: ["Helm", "Faceguard"], purple: ["Warhelm", "Battlecrown"] },
    chest: { gray: ["Vest", "Jerkin"], green: ["Hauberk", "Cuirass"], blue: ["Breastplate", "Chestguard"], purple: ["Warplate", "Aegisplate"] },
    legs: { gray: ["Breeches", "Leggings"], green: ["Greaves", "Tassets"], blue: ["Legplates", "Legguards"], purple: ["Warlegs", "Grandgreaves"] },
  },
  mage: {
    head: { gray: ["Hood", "Cowl"], green: ["Circlet", "Diadem"], blue: ["Tiara", "Crest"], purple: ["Coronet", "Mindcrown"] },
    chest: { gray: ["Tunic", "Wrap"], green: ["Robe", "Vestments"], blue: ["Regalia", "Spellrobe"], purple: ["Raiment", "Arcanerobe"] },
    legs: { gray: ["Pants", "Breeches"], green: ["Leggings", "Trousers"], blue: ["Legwraps", "Kilt"], purple: ["Spellweave", "Silkguards"] },
  },
  priest: {
    head: { gray: ["Hood", "Cowl"], green: ["Veil", "Circlet"], blue: ["Halo", "Headdress"], purple: ["Halo", "Reliquary Crown"] },
    chest: { gray: ["Tunic", "Vest"], green: ["Robe", "Vestments"], blue: ["Vestments", "Chasuble"], purple: ["Raiment", "Sacrarium"] },
    legs: { gray: ["Slacks", "Trousers"], green: ["Legwraps", "Leggings"], blue: ["Gaiters", "Legbinds"], purple: ["Faithweave", "Sanctified Legwraps"] },
  },
  rogue: {
    head: { gray: ["Mask", "Hood"], green: ["Cowl", "Headwrap"], blue: ["Visor", "Shadowmask"], purple: ["Nightmask", "Phantom Hood"] },
    chest: { gray: ["Jerkin", "Vest"], green: ["Leathercoat", "Brigandine"], blue: ["Shadowvest", "Nightguard"], purple: ["Duskhide", "Silent Harness"] },
    legs: { gray: ["Pants", "Breeches"], green: ["Leggings", "Striders"], blue: ["Nightpants", "Slipguards"], purple: ["Ghoststriders", "Phantom Treads"] },
  },
  hunter: {
    head: { gray: ["Cap", "Hood"], green: ["Coif", "Tracker Hood"], blue: ["Skullcap", "Visor"], purple: ["Huntsman's Crest", "Wildcrown"] },
    chest: { gray: ["Vest", "Jerkin"], green: ["Leathercoat", "Hunter's Vest"], blue: ["Trailguard", "Beastmail"], purple: ["Rangerskin", "Wildmantle"] },
    legs: { gray: ["Pants", "Leggings"], green: ["Striders", "Legguards"], blue: ["Traillegs", "Scoutguards"], purple: ["Wildstriders", "Beaststep Legguards"] },
  },
};

const WEAPON_NAMES: Record<HeroClass, Record<WeaponSlot, Record<GearRarity, string[]>>> = {
  warrior: {
    mainhand: { gray: ["Rusty Blade"], green: ["Iron Cleaver", "Mercenary Axe"], blue: ["Warbringer", "Molten Edge"], purple: ["Worldsplitter", "Doomblade"] },
    offhand: { gray: ["Dented Buckler"], green: ["Ironwall Shield", "Riveted Bulwark"], blue: ["Bastion Wall", "Tower Shield"], purple: ["Aegis of Fury", "Stormwark"] },
  },
  mage: {
    mainhand: { gray: ["Cracked Staff"], green: ["Runewood Staff", "Spellbranch"], blue: ["Astral Scepter", "Leyfire Staff"], purple: ["Starcall Staff", "Arcanum Spire"] },
    offhand: { gray: ["Faded Orb"], green: ["Glass Orb", "Minor Grimoire"], blue: ["Aether Orb", "Spellbound Tome"], purple: ["Cosmic Relic", "Codex of Embers"] },
  },
  priest: {
    mainhand: { gray: ["Worn Wand"], green: ["Prayer Wand", "Chanter's Rod"], blue: ["Sanctum Wand", "Litany Focus"], purple: ["Beacon Wand", "Scepter of Grace"] },
    offhand: { gray: ["Frayed Tome"], green: ["Psalter Tome", "Blessed Sigil"], blue: ["Book of Vows", "Aegis Scripture"], purple: ["Scripture of Dawn", "Sanctified Reliquary"] },
  },
  rogue: {
    mainhand: { gray: ["Dull Dagger"], green: ["Quickfang", "Backalley Shiv"], blue: ["Nightfang", "Ghostblade"], purple: ["Silencer", "Phantom Fang"] },
    offhand: { gray: ["Rusty Shiv"], green: ["Sidefang", "Hidden Dirk"], blue: ["Whisper Knife", "Duskslice"], purple: ["Shadowbite", "Second Silence"] },
  },
  hunter: {
    mainhand: { gray: ["Worn Bow"], green: ["Ranger Bow", "Boarshot Rifle"], blue: ["Hawkeye Longbow", "Trailblazer Rifle"], purple: ["Windpiercer", "Beastbane Carbine"] },
    offhand: { gray: ["Basic Quiver"], green: ["Tracker Quiver", "Field Knife"], blue: ["Storm Quiver", "Ranger Skinner"], purple: ["Quiver of the Wild", "Predator Fang"] },
  },
};

const ITEM_POWER_TABLE: Record<GearRarity, { base: number; perLevel: number }> = {
  gray: { base: 5, perLevel: 2 },
  green: { base: 10, perLevel: 3 },
  blue: { base: 15, perLevel: 5 },
  purple: { base: 25, perLevel: 7 },
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

function maybeMatchExistingAdjective(heroClass: HeroClass, rarity: GearRarity, level: number, existingGear: GearSlots): string | null {
  const allowedAdjectives = new Set(CLASS_ADJECTIVES[heroClass][rarity]);
  const candidates = Object.values(existingGear).filter((item): item is GearItem => item !== null)
    .filter((item) => item.rarity === rarity && Math.abs(item.itemPower - itemPowerForLevel(rarity, level)) <= 20)
    .map((item) => adjectiveFromName(item.name))
    .filter((adj): adj is string => adj !== null && allowedAdjectives.has(adj));

  if (candidates.length === 0 || Math.random() > 0.7) {
    return null;
  }
  return randomFrom(candidates);
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

export function itemPowerForLevel(rarity: GearRarity, level: number): number {
  const { base, perLevel } = ITEM_POWER_TABLE[rarity];
  return base + level * perLevel;
}

export function getArmorWeightForClass(heroClass: HeroClass): ArmorWeight {
  return CLASS_ARMOR_WEIGHT[heroClass];
}

export function randomHeroClass(): HeroClass {
  return randomFrom(["warrior", "mage", "priest", "rogue", "hunter"] as const);
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

  return {
    id: buildGeneratedItemId(heroClass, slot, rarity),
    name,
    slot,
    rarity,
    itemPower: itemPowerForLevel(rarity, level),
  };
}
