import { useCallback, useEffect, useRef, useState } from "react";
import type { GearSlot, Hero, HeroClass, MaterialId } from "../data/types";
import { EnergyBar } from "./EnergyBar";
import { MATERIAL_LABELS } from "../data/crafting";
import { RARITY_LABELS } from "../data/rarity";
import { formatGearStats, getEffectiveCoreStats } from "../game/gearGenerator";

const HERO_CLASSES: HeroClass[] = ["warrior", "rogue", "mage", "guardian", "bard"];

interface HeroStatusProps {
  hero: Hero;
  maxEnergy: number;
  energyUsedToday: number;
  onRename?: (name: string) => void;
  onChangeClass?: (heroClass: HeroClass) => void;
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

export function HeroStatus({ hero, maxEnergy, energyUsedToday, onRename, onChangeClass }: HeroStatusProps) {
  const canChangeCharacter = hero.inGameDay === 1;
  const [selectedSlot, setSelectedSlot] = useState<GearSlot>();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(hero.name);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const toggleSelectedSlot = useCallback((slot: GearSlot) => {
    setSelectedSlot((prev) => prev !== slot ? slot : undefined);
  }, []);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const startEditName = useCallback(() => {
    if (!canChangeCharacter || onRename === undefined) {
      return;
    }
    setEditNameValue(hero.name);
    setIsEditingName(true);
  }, [canChangeCharacter, hero.name, onRename]);

  const commitNameEdit = useCallback(() => {
    if (!onRename) {
      return;
    }
    const trimmed = editNameValue.trim();
    if (trimmed.length > 0) {
      onRename(trimmed);
    }
    setIsEditingName(false);
  }, [editNameValue, onRename]);

  const cancelNameEdit = useCallback(() => {
    setEditNameValue(hero.name);
    setIsEditingName(false);
  }, [hero.name]);

  const energyRemaining = maxEnergy - energyUsedToday;
  const selectedItem = selectedSlot !== undefined ? hero.gear[selectedSlot] : null;
  const effectiveStats = getEffectiveCoreStats(hero);

  const agePhase = (() => {
    if (hero.inGameDay <= 3) {return { label: "Young", color: "text-green-400" };}
    if (hero.inGameDay <= 6) {return { label: "Prime", color: "text-blue-400" };}
    if (hero.inGameDay <= 9) {return { label: "Experienced", color: "text-yellow-400" };}
    if (hero.inGameDay <= 12) {return { label: "Aging", color: "text-orange-400" };}
    return { label: "Elderly", color: "text-red-400" };
  })();

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {canChangeCharacter && onRename !== undefined ? (
            isEditingName ? (
              <input
                className="bg-gray-800 border border-yellow-500 rounded px-1 text-white font-bold text-lg w-40 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                onBlur={commitNameEdit}
                onChange={(e) => setEditNameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitNameEdit();
                  }
                  if (e.key === "Escape") {
                    cancelNameEdit();
                  }
                }}
                ref={nameInputRef}
                type="text"
                value={editNameValue}
              />
            ) : (
              <button
                className="text-white font-bold text-lg hover:text-yellow-300 transition-colors text-left"
                onClick={startEditName}
                type="button"
              >
                {hero.name}
              </button>
            )
          ) : (
            <span className="text-white font-bold text-lg">{hero.name}</span>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            {canChangeCharacter && onChangeClass !== undefined ? (
              <select
                className="bg-gray-800 border border-gray-600 rounded text-gray-200 text-xs px-2 py-0.5 capitalize"
                onChange={(e) => { onChangeClass(e.target.value as HeroClass); }}
                value={hero.heroClass}
              >
                {HERO_CLASSES.map((c) => (
                  <option key={c} value={c}>{formatClassLabel(c)}</option>
                ))}
              </select>
            ) : (
              <span className="text-gray-400 text-xs capitalize">{formatClassLabel(hero.heroClass)}</span>
            )}
            <span className="text-gray-500 text-xs">· Lv.{hero.level}</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-bold text-sm ${agePhase.color}`}>{agePhase.label}</div>
          <div className="text-gray-400 text-xs">Day {hero.inGameDay} / 12</div>
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

      {/* Stats row (includes gear bonuses) */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-yellow-400 text-sm">◈</span>
          <span className="text-white font-bold text-sm">{hero.gold}g</span>
          <span className="text-gray-500">|</span>
          <span className="text-amber-400 font-bold text-sm">STR {effectiveStats.strength}</span>
          <span className="text-emerald-400 font-bold text-sm">AGI {effectiveStats.agility}</span>
          <span className="text-blue-400 font-bold text-sm">INT {effectiveStats.intelligence}</span>
          <span className="text-violet-400 font-bold text-sm">STA {effectiveStats.stamina}</span>
          <span className="text-pink-400 font-bold text-sm">CHR {effectiveStats.charismaInfluence}</span>
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
              title={item !== null ? `${item.name} (${RARITY_LABELS[item.rarity]}) · ${formatGearStats(item.stats) || "—"}` : "Empty"}
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
              {RARITY_LABELS[selectedItem.rarity]}
              {formatGearStats(selectedItem.stats) ? ` · ${formatGearStats(selectedItem.stats)}` : ""}
            </div>
          </div>
        ) : (
          <div className="mt-1 text-gray-500 text-xs">No item equipped.</div>
        )}
      </div> : null}
    </div>
  );
}
