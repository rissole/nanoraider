import { useState } from "react";
import type { HeroClass } from "../../data/types";
import { NURTURE_CHOICES, randomHeroName } from "../../data/nurture";
import { useGameStore } from "../../store/gameStore";

type Step = "nurture" | "summary";

function resolveClass(choices: ("A" | "B")[]): HeroClass {
  const warriorVotes = choices.filter((c) => c === "A").length;
  const mageVotes = choices.filter((c) => c === "B").length;
  if (warriorVotes >= 2) {
    return "warrior";
  }
  if (mageVotes >= 2) {
    return "mage";
  }
  return "healer";
}

const CLASS_DESCRIPTIONS: Record<HeroClass, { label: string; icon: string; description: string; color: string }> = {
  warrior: {
    label: "Warrior",
    icon: "⚔",
    description: "High survivability. Thrives in dangerous dungeons.",
    color: "text-red-400",
  },
  mage: {
    label: "Mage",
    icon: "✦",
    description: "High burst damage. Great for boss fights and raids.",
    color: "text-blue-400",
  },
  healer: {
    label: "Healer",
    icon: "✚",
    description: "Balanced and versatile. Strong in all content.",
    color: "text-green-400",
  },
};

export function HeroCreation() {
  const { createHero, goTo } = useGameStore();
  const [step, setStep] = useState<Step>("nurture");
  const [nurtureChoices, setNurtureChoices] = useState<("A" | "B")[]>([]);
  const [currentNurture, setCurrentNurture] = useState(0);
  const [name, setName] = useState(() => randomHeroName());

  const chooseNurture = (choice: "A" | "B") => {
    const updated = [...nurtureChoices, choice];
    setNurtureChoices(updated);
    if (currentNurture + 1 < NURTURE_CHOICES.length) {
      setCurrentNurture(currentNurture + 1);
    } else {
      setStep("summary");
    }
  };

  const resolvedClass = resolveClass(nurtureChoices);
  const classInfo = CLASS_DESCRIPTIONS[resolvedClass];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-400">Origin Story</h2>
          {step === "nurture" && (
            <p className="text-gray-500 text-sm mt-1">
              {currentNurture + 1} of {NURTURE_CHOICES.length}
            </p>
          )}
        </div>

        {/* Nurture choices */}
        {step === "nurture" && (() => {
          const choice = NURTURE_CHOICES[currentNurture];
          if (choice === undefined) {
            return null;
          }
          return (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-5">
              <p className="text-white text-base leading-relaxed">{choice.question}</p>
              <div className="space-y-3">
                <button
                  className="w-full bg-gray-800 hover:bg-gray-750 border border-gray-600 hover:border-yellow-500 rounded-lg p-4 text-left transition-colors group"
                  onClick={() => { chooseNurture("A"); }}
                >
                  <span className="text-yellow-500 font-bold text-xs uppercase tracking-widest block mb-1 group-hover:text-yellow-400">
                    →
                  </span>
                  <span className="text-gray-200 text-sm leading-relaxed">{choice.optionA}</span>
                </button>
                <button
                  className="w-full bg-gray-800 hover:bg-gray-750 border border-gray-600 hover:border-yellow-500 rounded-lg p-4 text-left transition-colors group"
                  onClick={() => { chooseNurture("B"); }}
                >
                  <span className="text-yellow-500 font-bold text-xs uppercase tracking-widest block mb-1 group-hover:text-yellow-400">
                    →
                  </span>
                  <span className="text-gray-200 text-sm leading-relaxed">{choice.optionB}</span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* Summary */}
        {step === "summary" && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className={`text-5xl ${classInfo.color}`}>{classInfo.icon}</div>
              <div className="flex-1">
                <div className={`font-bold text-lg ${classInfo.color}`}>{classInfo.label}</div>
                <div className="text-gray-400 text-sm">{classInfo.description}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 text-xs uppercase tracking-widest block">Hero Name</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  maxLength={20}
                  onChange={(e) => { setName(e.target.value); }}
                  type="text"
                  value={name}
                />
                <button
                  className="text-gray-500 hover:text-gray-300 text-xs px-3 py-2 border border-gray-700 rounded transition-colors"
                  onClick={() => { setName(randomHeroName()); }}
                  title="Randomise name"
                >
                  ↻
                </button>
              </div>
            </div>

            <div className="text-gray-500 text-xs border-t border-gray-800 pt-3">
              Your playstyle shapes your evolution. Every choice tracks hidden personality stats —
              revealed only when your hero dies.
            </div>

            <button
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-3 rounded-lg transition-colors text-base"
              disabled={name.trim().length === 0}
              onClick={() => { createHero(name.trim(), resolvedClass); }}
            >
              Begin Adventure
            </button>
          </div>
        )}

        <button
          className="w-full text-gray-600 hover:text-gray-400 text-sm transition-colors"
          onClick={() => { goTo("main_menu"); }}
        >
          ← Back to menu
        </button>
      </div>
    </div>
  );
}
