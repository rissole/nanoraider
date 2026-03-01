import type { HeroNurtureChoice } from "./types";

export const NURTURE_CHOICES: HeroNurtureChoice[] = [
  {
    question:
      "Mid-dungeon, your group is overwhelmed. One tunnel leads to the exit. The other leads straight to the boss room.",
    optionA: "Push for the boss — you didn't come this far to retreat.",
    optionB: "Fall back — a live hero fights another day.",
    choiceAClass: "warrior",
    choiceBClass: "mage",
  },
  {
    question:
      "After your first raid wipe, the guild veteran pulls you aside. He offers to teach you one thing.",
    optionA: "\"Forget tactics — hit harder, die less. Brute force wins raids.\"",
    optionB: "\"Study the boss. Every death has a pattern. Learn it.\"",
    choiceAClass: "warrior",
    choiceBClass: "healer",
  },
  {
    question:
      "You find 300 gold on a fallen adventurer — enough for a weapon upgrade or six months of consumables.",
    optionA: "Buy the weapon. One big spike beats sustained attrition.",
    optionB: "Stock consumables. Consistency compounds over a full run.",
    choiceAClass: "warrior",
    choiceBClass: "mage",
  },
];

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
