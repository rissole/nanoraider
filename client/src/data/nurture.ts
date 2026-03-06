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
          triangle: { war: 10, wit: -2, wealth: -1 },
          daring: 8,
        },
        xpGain: 240,
      },
      {
        id: "observe",
        label: "Observe and Analyze Their Tactics",
        description: "Study every mistake and redesign their battle plan around disciplined execution.",
        effects: {
          triangle: { wit: 8, war: -2 },
          bossReadiness: { molten_fury: 10 },
          daring: -2,
        },
        xpGain: 210,
      },
      {
        id: "broker_supplies",
        label: "Broker Supply Contracts",
        description: "Negotiate emergency war contracts that decide who gets steel and food before dawn.",
        effects: {
          triangle: { wealth: 8, wit: 2 },
          renown: 10,
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
          triangle: { wealth: 10, wit: 1 },
          renown: 2,
          daring: 3,
        },
        xpGain: 160,
        goldGain: 200,
      },
      {
        id: "escort",
        label: "Escort the Caravan Safely",
        description: "Guard the route through ambush country and earn trust from every guild on the road.",
        effects: {
          triangle: { war: 5, wit: 1, wealth: 1 },
          renown: 8,
          daring: 2,
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
          triangle: { wit: 10, war: -2 },
          bossReadiness: { molten_fury: 20 },
          renown: 4,
          daring: -2,
        },
        xpGain: 280,
      },
      {
        id: "skip_for_contract",
        label: "Skip It for a Paid Contract",
        description: "Walk out to sign a lucrative private contract and convert your influence into cash now.",
        effects: {
          triangle: { wealth: 9, wit: -2 },
          renown: 2,
          daring: 4,
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
          triangle: { wit: 4, wealth: 3 },
          renown: 12,
          daring: -1,
        },
        xpGain: 220,
        goldGain: 90,
      },
      {
        id: "take_risky_side",
        label: "Take a Risky Side for Personal Gain",
        description: "Back one warlord openly, collect immediate favors, and accept the political fallout.",
        effects: {
          triangle: { war: 6, wealth: 3, wit: -2 },
          renown: -4,
          daring: 10,
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
