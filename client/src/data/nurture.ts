import type { DailyEventDefinition, DailyEventId } from "./types";

export const DAILY_EVENTS: Record<DailyEventId, DailyEventDefinition> = {
  militia_training: {
    id: "militia_training",
    title: "Militia Drills in Town Square",
    description: "A local militia prepares for a looming siege and asks you to lead one decisive drill.",
    minDay: 1,
    maxDay: 6,
    weight: 3,
    choices: [
      {
        id: "sparring",
        label: "Join Full-Contact Sparring",
        description: "Take command in brutal live-fire drills and harden your edge for future raids.",
        effects: {
          coreStats: { strength: 5, stamina: 4 },
          personality: { combatStyle: 11, ambition: 9, preparation: -4 },
        },
        xpGain: 240,
      },
      {
        id: "observe",
        label: "Observe and Analyze Their Tactics",
        description: "Study every mistake and redesign their battle plan around disciplined execution.",
        effects: {
          coreStats: { intelligence: 5, stamina: 2 },
          personality: { preparation: 12, combatStyle: -3 },
          bossKnowledgeIntel: { molten_fury: 10 },
        },
        xpGain: 210,
      },
      {
        id: "broker_supplies",
        label: "Broker Supply Contracts",
        description: "Negotiate emergency war contracts that decide who gets steel and food before dawn.",
        effects: {
          coreStats: { charismaInfluence: 5, intelligence: 2 },
          personality: { socialStyle: 10, economicFocus: 11 },
          reputation: { adventurers_guild: 8 },
        },
        xpGain: 170,
        goldGain: 130,
      },
    ],
  },
  traveling_merchant: {
    id: "traveling_merchant",
    title: "Traveling Merchant Caravan",
    description: "A heavily guarded caravan arrives with relic cargo and offers one make-or-break deal.",
    minDay: 1,
    maxDay: 10,
    weight: 2,
    choices: [
      {
        id: "haggle",
        label: "Haggle for Better Margins",
        description: "Drive a ruthless negotiation that could fund your run for days if it lands.",
        effects: {
          coreStats: { charismaInfluence: 4, intelligence: 3 },
          personality: { economicFocus: 12, socialStyle: 5, ambition: 4 },
          reputation: { adventurers_guild: -3 },
        },
        xpGain: 160,
        goldGain: 200,
      },
      {
        id: "escort",
        label: "Escort the Caravan Safely",
        description: "Guard the route through ambush country and earn trust from every guild on the road.",
        effects: {
          coreStats: { stamina: 4, agility: 4, strength: 2 },
          personality: { preparation: 8, exploration: 9, socialStyle: 4 },
          reputation: { adventurers_guild: 10 },
        },
        xpGain: 250,
        goldGain: 100,
      },
    ],
  },
  scholar_lecture: {
    id: "scholar_lecture",
    title: "Forbidden Lecture at Scholomance",
    description: "A reclusive scholar unveils forbidden raid doctrine to one trusted listener.",
    minDay: 2,
    maxDay: 12,
    weight: 2,
    choices: [
      {
        id: "attend",
        label: "Attend and Take Notes",
        description: "Commit to the full lecture and leave with dangerous knowledge most heroes never see.",
        effects: {
          coreStats: { intelligence: 5, charismaInfluence: 2 },
          personality: { preparation: 12, exploration: -4 },
          bossKnowledgeIntel: { molten_fury: 12 },
          bossKnowledgeDrills: { molten_fury: 8 },
          reputation: { scholomance_order: 9 },
        },
        xpGain: 280,
      },
      {
        id: "skip_for_contract",
        label: "Skip It for a Paid Contract",
        description: "Walk out to sign a lucrative private contract and convert your influence into cash now.",
        effects: {
          coreStats: { charismaInfluence: 4, stamina: 2 },
          personality: { economicFocus: 10, preparation: -5, ambition: 6 },
        },
        xpGain: 130,
        goldGain: 180,
      },
    ],
  },
  guild_conflict: {
    id: "guild_conflict",
    title: "Guild Council Conflict",
    description: "A high-stakes guild schism erupts and both sides demand your public allegiance.",
    minDay: 3,
    maxDay: 18,
    weight: 1,
    choices: [
      {
        id: "mediate",
        label: "Mediate and Keep the Peace",
        description: "Broker a fragile truce and become the figure both factions now rely on.",
        effects: {
          coreStats: { charismaInfluence: 5, intelligence: 4 },
          personality: { socialStyle: 12, preparation: 8, ambition: -2 },
          reputation: { adventurers_guild: 12, scholomance_order: 5 },
        },
        xpGain: 220,
        goldGain: 90,
      },
      {
        id: "take_risky_side",
        label: "Take a Risky Side for Personal Gain",
        description: "Back one warlord openly, collect immediate favors, and accept the political fallout.",
        effects: {
          coreStats: { charismaInfluence: 4, strength: 3 },
          personality: { ambition: 12, combatStyle: 7, socialStyle: -5 },
          reputation: { adventurers_guild: -8, scholomance_order: -3 },
        },
        xpGain: 180,
        goldGain: 190,
      },
    ],
  },
};

export const DAILY_EVENT_LIST = Object.values(DAILY_EVENTS);

const RANDOM_NAMES = [
  "Aldric", "Brynn", "Caelum", "Daven", "Elara", "Fenwick", "Gwen", "Holt",
  "Isolde", "Jaryn", "Kessa", "Lorn", "Mira", "Neven", "Oryn", "Petra",
  "Quinn", "Rael", "Sova", "Thorn", "Ulric", "Vesper", "Wren", "Xander",
  "Yael", "Zora", "Asha", "Bowen", "Corra", "Darke", "Ebon", "Fyra",
  "Gaunt", "Hessa", "Idris", "Jorik", "Kova", "Lysa", "Maren", "Nix",
];

export function randomHeroName(): string {
  const i = Math.floor(Math.random() * RANDOM_NAMES.length);
  return RANDOM_NAMES[i] ?? "Aldric";
}
