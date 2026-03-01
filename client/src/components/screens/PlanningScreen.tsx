import { ACTIVITIES, ACTIVITY_LIST } from "../../data/activities";
import type { ActivityDefinition, ActivityId } from "../../data/types";
import { useGameStore } from "../../store/gameStore";
import { totalEnergyCost } from "../../game/activityResolver";
import { HeroStatus } from "../HeroStatus";

const CATEGORY_COLORS: Record<string, string> = {
  combat: "border-red-800 bg-red-950",
  economic: "border-yellow-800 bg-yellow-950",
  knowledge: "border-blue-800 bg-blue-950",
  general: "border-gray-700 bg-gray-900",
};

const CATEGORY_BADGE: Record<string, string> = {
  combat: "bg-red-800 text-red-200",
  economic: "bg-yellow-800 text-yellow-200",
  knowledge: "bg-blue-800 text-blue-200",
  general: "bg-gray-700 text-gray-300",
};

function ActivityCard({ def, canAfford, onAdd }: { def: ActivityDefinition; canAfford: boolean; onAdd: () => void }) {
  const colorBorder = CATEGORY_COLORS[def.category] ?? CATEGORY_COLORS["general"];
  const badge = CATEGORY_BADGE[def.category] ?? CATEGORY_BADGE["general"];

  return (
    <div className={`border rounded-lg p-3 flex flex-col gap-2 ${colorBorder} ${!canAfford ? "opacity-40" : ""}`}>
      <div className="flex items-start justify-between gap-1">
        <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${badge}`}>{def.category}</span>
        {def.deathRisk > 0 && (
          <span className="text-red-400 text-xs">☠ {Math.round(def.deathRisk * 100)}%</span>
        )}
      </div>
      <div className="flex-1">
        <div className="text-white font-bold text-sm leading-tight">{def.name}</div>
        <p className="text-gray-500 text-xs mt-0.5 leading-tight">{def.description}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 text-xs text-gray-400">
          <span className="text-yellow-400 font-bold">⚡{def.energyCost}</span>
          <span>⏱{def.durationHours}h</span>
        </div>
        <button
          className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold text-xs px-2.5 py-1 rounded transition-colors shrink-0"
          disabled={!canAfford}
          onClick={onAdd}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export function PlanningScreen() {
  const { hero, meta, plannedActivities, addActivity, removeActivity, reorderActivity, executeDay, goTo } = useGameStore();

  if (hero === null) {
    return null;
  }

  const energyUsedInPlan = totalEnergyCost(plannedActivities.map((a) => a.activityId));
  const energyRemaining = meta.maxEnergy - energyUsedInPlan;

  const availableActivities = ACTIVITY_LIST.filter((def) => def.minLevel <= hero.level);

  const canAddActivity = (def: ActivityDefinition) => energyRemaining >= def.energyCost;

  const canExecute = plannedActivities.length > 0;

  return (
    <div className="min-h-screen p-4 space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-yellow-400 font-bold text-lg">Day {hero.inGameDay} Planning</h2>
        <button
          className="text-gray-400 hover:text-gray-200 text-sm"
          onClick={() => { goTo("collection"); }}
        >
          ◈ Collection
        </button>
      </div>

      {/* Hero status */}
      <HeroStatus energyUsedToday={energyUsedInPlan} hero={hero} maxEnergy={meta.maxEnergy} />

      {/* Available activities — above the plan so Add buttons don't shift */}
      <div className="space-y-2">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Available Activities</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {availableActivities.map((def) => (
            <ActivityCard
              canAfford={canAddActivity(def)}
              def={def}
              key={def.id}
              onAdd={() => { addActivity(def.id as ActivityId); }}
            />
          ))}
        </div>
      </div>

      {/* Today's plan */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest">Today's Plan</h3>
          <span className={`font-bold text-sm ${energyRemaining > 0 ? "text-yellow-400" : "text-red-400"}`}>
            ⚡ {energyRemaining} remaining
          </span>
        </div>

        {plannedActivities.length === 0 ? (
          <p className="text-gray-600 text-sm italic text-center py-3">
            No activities planned. Add some above.
          </p>
        ) : (
          <div className="space-y-2">
            {plannedActivities.map((pa, i) => {
              const def = ACTIVITIES[pa.activityId];
              if (def === undefined) {
                return null;
              }
              return (
                <div
                  key={pa.slot}
                  className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded p-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <button
                      className="text-gray-600 hover:text-gray-300 text-xs leading-none disabled:opacity-30"
                      disabled={i === 0}
                      onClick={() => { reorderActivity(i, i - 1); }}
                    >
                      ▲
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-300 text-xs leading-none disabled:opacity-30"
                      disabled={i === plannedActivities.length - 1}
                      onClick={() => { reorderActivity(i, i + 1); }}
                    >
                      ▼
                    </button>
                  </div>
                  <div className="flex-1">
                    <span className="text-white text-sm font-bold">{def.name}</span>
                    <span className="text-yellow-400 text-xs ml-2">⚡{def.energyCost}</span>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-400 text-xs px-2"
                    onClick={() => { removeActivity(pa.slot); }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {hero.inGameDay >= 16 && (
          <div className="text-orange-400 text-xs text-center">
            ⚠ Day {hero.inGameDay}: Old age approaches. Death risk rises each day.
          </div>
        )}

        <div className="border-t border-gray-700 pt-3 flex gap-2">
          <button
            className="flex-1 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-2 rounded transition-colors"
            disabled={!canExecute}
            onClick={executeDay}
          >
            ▶ Execute Day
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm px-4 py-2 rounded transition-colors"
            onClick={() => { useGameStore.getState().clearPlan(); }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
