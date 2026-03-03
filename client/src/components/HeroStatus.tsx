import { useCallback, useState } from "react";
import type { GearSlot, Hero, MaterialId } from "../data/types";
import { EnergyBar } from "./EnergyBar";
import { getBossReadiness } from "../game/bossKnowledge";
import { MATERIAL_LABELS } from "../data/crafting";
import { RARITY_LABELS } from "../data/rarity";

interface HeroStatusProps {
  hero: Hero;
  maxEnergy: number;
  energyUsedToday: number;
  onRename?: (name: string) => void;
}

const RARITY_COLOR: Record<string, string> = {
  gray: "text-white",
  green: "text-green-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
};

const SLOT_LABELS: Record<GearSlot, string> = {
  head: "Head",
  chest: "Chest",
  legs: "Legs",
  mainhand: "Main Hand",
  offhand: "Off-hand",
};

function formatClassLabel(heroClass: Hero["heroClass"]): string {
  return `${heroClass.charAt(0).toUpperCase()}${heroClass.slice(1)}`;
}

export function HeroStatus({ hero, maxEnergy, energyUsedToday, onRename }: HeroStatusProps) {
  const [selectedSlot, setSelectedSlot] = useState<GearSlot>();
  const toggleSelectedSlot = useCallback((slot: GearSlot) => {
    setSelectedSlot((prev) => prev !== slot ? slot : undefined);
  }, []);
  const energyRemaining = maxEnergy - energyUsedToday;
  const moltenReadiness = getBossReadiness(hero, "molten_fury");
  const selectedItem = selectedSlot !== undefined ? hero.gear[selectedSlot] : null;

  const agePhase = (() => {
    if (hero.inGameDay <= 5) {return { label: "Young", color: "text-green-400" };}
    if (hero.inGameDay <= 9) {return { label: "Prime", color: "text-blue-400" };}
    if (hero.inGameDay <= 12) {return { label: "Experienced", color: "text-yellow-400" };}
    if (hero.inGameDay <= 15) {return { label: "Aging", color: "text-orange-400" };}
    return { label: "Elderly", color: "text-red-400" };
  })();

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            className="text-white font-bold text-lg hover:text-yellow-300 transition-colors"
            onClick={() => {
              if (onRename === undefined) {
                return;
              }
              const next = window.prompt("Rename hero", hero.name);
              if (next !== null) {
                onRename(next);
              }
            }}
            type="button"
          >
            {hero.name}
          </button>
          <span className="block mt-1 text-gray-400 text-xs capitalize">{formatClassLabel(hero.heroClass)} · Lv.{hero.level}</span>
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
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">◈</span>
          <span className="text-white font-bold">{hero.gold}g</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-cyan-400">◉</span>
          <span className="text-gray-300">
            Boss Readiness: <span className="text-cyan-400 font-bold">{Math.round(moltenReadiness)}%</span>
          </span>
        </div>
        <div className="text-gray-400 text-xs">
          STR {hero.coreStats.strength} · AGI {hero.coreStats.agility} · INT {hero.coreStats.intelligence} · STA {hero.coreStats.stamina} · CHR {hero.coreStats.charismaInfluence}
        </div>
        <div className="text-gray-500 text-xs">
          {Object.keys(hero.materials).length === 0
            ? "No crafting materials"
            : (Object.keys(hero.materials) as MaterialId[])
              .map((id) => {
                const amt = hero.materials[id];
                return `${MATERIAL_LABELS[id]}: ${String(typeof amt === "number" ? amt : 0)}`;
              })
              .join(" · ")}
        </div>
      </div>

      {/* Gear slots */}
      <div className="grid grid-cols-5 gap-1">
        {(Object.entries(SLOT_LABELS) as [GearSlot, string][]).map(([slot, label]) => {
          const item = hero.gear[slot];
          const isSelected = slot === selectedSlot;
          return (
            <button
              className={`bg-gray-800 border rounded p-1 text-center transition-colors ${
                isSelected ? "border-yellow-500" : "border-gray-700 hover:border-gray-500"
              }`}
              key={slot}
              onClick={() => toggleSelectedSlot(slot)}
              title={item !== null ? `${item.name} (${RARITY_LABELS[item.rarity]}) · ${item.itemPower} IP` : "Empty"}
              type="button"
            >
              <div className="text-gray-500 text-xs">{label}</div>
              {item !== null ? (
                <div className={`text-xs font-bold truncate ${RARITY_COLOR[item.rarity] ?? "text-gray-400"}`}>
                  {item.name}
                </div>
              ) : (
                <div className="text-gray-700 text-xs">—</div>
              )}
            </button>
          );
        })}
      </div>

      {selectedSlot != null ? <div className="bg-gray-800 border border-gray-700 rounded p-2">
        {selectedItem !== null ? (
          <div className="mt-1 space-y-1">
            <div className={`text-sm font-bold ${RARITY_COLOR[selectedItem.rarity] ?? "text-gray-400"}`}>
              {selectedItem.name}
            </div>
            <div className="text-gray-300 text-xs">
              {RARITY_LABELS[selectedItem.rarity]} · {selectedItem.itemPower} Item Power
            </div>
          </div>
        ) : (
          <div className="mt-1 text-gray-500 text-xs">No item equipped.</div>
        )}
      </div> : null}
    </div>
  );
}
