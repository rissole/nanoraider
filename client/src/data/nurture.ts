import type { DailyEventDefinition, DailyEventId } from "./types";

export const DAILY_EVENTS: Record<DailyEventId, DailyEventDefinition> = {
  militia_training: {
    id: "militia_training",
    title: "Militia Drills in Town Square",
    description: "A local militia invites you to join their drills for the afternoon.",
    minDay: 1,
    maxDay: 6,
    weight: 3,
    choices: [
      {
        id: "sparring",
        label: "Join Full-Contact Sparring",
        description: "Gain combat instincts quickly, but embrace risk.",
        effects: {
          coreStats: { strength: 2, stamina: 1 },
          personality: { combatStyle: 6, ambition: 3, preparation: -2 },
        },
        xpGain: 70,
      },
      {
        id: "observe",
        label: "Observe and Analyze Their Tactics",
        description: "Slower pace, but stronger strategic growth.",
        effects: {
          coreStats: { intelligence: 2 },
          personality: { preparation: 5, combatStyle: -2 },
          bossKnowledge: { molten_fury: 3 },
        },
        xpGain: 45,
      },
      {
        id: "broker_supplies",
        label: "Broker Supply Contracts",
        description: "Build social leverage while earning early gold.",
        effects: {
          coreStats: { charismaInfluence: 2 },
          personality: { socialStyle: 4, economicFocus: 4 },
          reputation: { adventurers_guild: 3 },
        },
        xpGain: 20,
        goldGain: 35,
      },
    ],
  },
  traveling_merchant: {
    id: "traveling_merchant",
    title: "Traveling Merchant Caravan",
    description: "A caravan arrives with a one-day opportunity to trade or assist.",
    minDay: 1,
    maxDay: 10,
    weight: 2,
    choices: [
      {
        id: "haggle",
        label: "Haggle for Better Margins",
        description: "Push hard for profit and influence.",
        effects: {
          coreStats: { charismaInfluence: 2 },
          personality: { economicFocus: 6, socialStyle: 2 },
          reputation: { adventurers_guild: -1 },
        },
        goldGain: 45,
      },
      {
        id: "escort",
        label: "Escort the Caravan Safely",
        description: "Steady gains and stronger guild reputation.",
        effects: {
          coreStats: { stamina: 1, agility: 1 },
          personality: { preparation: 3, exploration: 2 },
          reputation: { adventurers_guild: 4 },
        },
        xpGain: 50,
        goldGain: 20,
      },
    ],
  },
  scholar_lecture: {
    id: "scholar_lecture",
    title: "Forbidden Lecture at Scholomance",
    description: "A reclusive scholar offers one seat to a private lecture.",
    minDay: 2,
    maxDay: 12,
    weight: 2,
    choices: [
      {
        id: "attend",
        label: "Attend and Take Notes",
        description: "Methodical growth and meaningful knowledge gains.",
        effects: {
          coreStats: { intelligence: 2 },
          personality: { preparation: 6, exploration: -2 },
          bossKnowledge: { molten_fury: 5 },
          reputation: { scholomance_order: 3 },
        },
        xpGain: 55,
      },
      {
        id: "skip_for_contract",
        label: "Skip It for a Paid Contract",
        description: "Prioritize immediate value over long-term learning.",
        effects: {
          coreStats: { charismaInfluence: 1 },
          personality: { economicFocus: 4, preparation: -3 },
        },
        goldGain: 60,
      },
    ],
  },
  guild_conflict: {
    id: "guild_conflict",
    title: "Guild Council Conflict",
    description: "Two guild leaders ask you to publicly back one side.",
    minDay: 3,
    maxDay: 18,
    weight: 1,
    choices: [
      {
        id: "mediate",
        label: "Mediate and Keep the Peace",
        description: "Build social capital with lower immediate gain.",
        effects: {
          coreStats: { charismaInfluence: 2, intelligence: 1 },
          personality: { socialStyle: 5, preparation: 2, ambition: -1 },
          reputation: { adventurers_guild: 5 },
        },
        xpGain: 40,
      },
      {
        id: "take_risky_side",
        label: "Take a Risky Side for Personal Gain",
        description: "Bolder path with higher upside and politics backlash.",
        effects: {
          coreStats: { charismaInfluence: 2 },
          personality: { ambition: 5, combatStyle: 2, socialStyle: -2 },
          reputation: { adventurers_guild: -3 },
        },
        xpGain: 30,
        goldGain: 50,
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
