import type { Hero } from "../data/types";
import { EnergyBar } from "./EnergyBar";

interface HeroStatusProps {
  hero: Hero;
  maxEnergy: number;
  energyUsedToday: number;
}

const RARITY_COLOR: Record<string, string> = {
  gray: "text-gray-400",
  green: "text-green-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
};

const SLOT_LABELS: Record<string, string> = {
  helmet: "Head",
  chest: "Chest",
  gloves: "Hands",
  boots: "Feet",
  weapon: "Weapon",
  offhand: "Off-hand",
  legs: "Legs",
  accessory: "Trinket",
};

export function HeroStatus({ hero, maxEnergy, energyUsedToday }: HeroStatusProps) {
  const energyRemaining = maxEnergy - energyUsedToday;

  const agePhase = (() => {
    if (hero.inGameDay <= 5) return { label: "Young", color: "text-green-400" };
    if (hero.inGameDay <= 9) return { label: "Prime", color: "text-blue-400" };
    if (hero.inGameDay <= 12) return { label: "Experienced", color: "text-yellow-400" };
    if (hero.inGameDay <= 15) return { label: "Aging", color: "text-orange-400" };
    return { label: "Elderly", color: "text-red-400" };
  })();

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">{hero.name}</h2>
          <span className="text-gray-400 text-xs capitalize">{hero.heroClass} · Lv.{hero.level}</span>
        </div>
        <div className="text-right">
          <div className={`font-bold text-sm ${agePhase.color}`}>{agePhase.label}</div>
          <div className="text-gray-400 text-xs">Day {hero.inGameDay} / 18</div>
        </div>
      </div>

      {/* Energy */}
      <EnergyBar current={energyRemaining} max={maxEnergy} />

      {/* XP Bar */}
      <div className="flex items-center gap-3">
        <span className="text-blue-400 font-bold text-sm tracking-widest">✦ XP</span>
        <div className="flex-1 h-2 bg-gray-800 rounded border border-gray-700 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${Math.min(1, hero.xp / hero.xpToNextLevel) * 100}%` }}
          />
        </div>
        <span className="text-gray-400 text-xs w-24 text-right">{hero.xp} / {hero.xpToNextLevel}</span>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">◈</span>
          <span className="text-white font-bold">{hero.gold}g</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-cyan-400">◉</span>
          <span className="text-gray-300">
            Boss Knowledge: <span className="text-cyan-400 font-bold">{Math.round(hero.bossKnowledge["molten_fury"] ?? 0)}%</span>
          </span>
        </div>
      </div>

      {/* Gear slots */}
      <div className="grid grid-cols-4 gap-1">
        {(Object.entries(SLOT_LABELS) as [keyof typeof SLOT_LABELS, string][]).map(([slot, label]) => {
          const item = hero.gear[slot as keyof typeof hero.gear];
          return (
            <div
              key={slot}
              className="bg-gray-800 border border-gray-700 rounded p-1 text-center"
              title={item !== null ? item.name : "Empty"}
            >
              <div className="text-gray-500 text-xs">{label}</div>
              {item !== null ? (
                <div className={`text-xs font-bold truncate ${RARITY_COLOR[item.rarity] ?? "text-gray-400"}`}>
                  {item.name}
                </div>
              ) : (
                <div className="text-gray-700 text-xs">—</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
