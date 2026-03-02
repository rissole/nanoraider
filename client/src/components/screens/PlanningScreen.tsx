import { ACTIVITIES, ACTIVITY_LIST } from "../../data/activities";
import type { ActivityDefinition, RiskBand } from "../../data/types";
import { useGameStore } from "../../store/gameStore";
import { computeActivityRisk, isActivityUnlocked } from "../../game/activityResolver";
import { HeroStatus } from "../HeroStatus";
import { useMemo } from "react";

const CATEGORY_COLORS: Record<ActivityDefinition["category"], string> = {
  combat: "border-red-800 bg-red-950",
  economic: "border-yellow-800 bg-yellow-950",
  knowledge: "border-blue-800 bg-blue-950",
  social: "border-indigo-800 bg-indigo-950",
  general: "border-gray-700 bg-gray-900",
};

const CATEGORY_BADGE: Record<ActivityDefinition["category"], string> = {
  combat: "bg-red-800 text-red-200",
  economic: "bg-yellow-800 text-yellow-200",
  knowledge: "bg-blue-800 text-blue-200",
  social: "bg-indigo-800 text-indigo-200",
  general: "bg-gray-700 text-gray-300",
};

const RISK_LABELS: Record<RiskBand, string> = {
  safe: "Safe",
  manageable: "Manageable",
  dangerous: "Dangerous",
  lethal: "Lethal",
};

const RISK_STYLES: Record<RiskBand, string> = {
  safe: "text-green-400",
  manageable: "text-yellow-400",
  dangerous: "text-orange-400",
  lethal: "text-red-400",
};

function formatDetailTooltip(def: ActivityDefinition, includeCoreStats: boolean): string | null {
  const detailLines: string[] = [];
  if (includeCoreStats && def.effects.coreStats !== undefined) {
    for (const [k, v] of Object.entries(def.effects.coreStats)) {
      if (v !== 0) {
        detailLines.push(`${v > 0 ? "+" : ""}${v} ${k}`);
      }
    }
  }
  if (def.effects.personality !== undefined) {
    for (const [k, v] of Object.entries(def.effects.personality)) {
      if (v !== 0) {
        detailLines.push(`${k} ${v > 0 ? "+" : ""}${String(v)}`);
      }
    }
  }
  if (def.effects.bossKnowledgeIntel !== undefined) {
    for (const [k, v] of Object.entries(def.effects.bossKnowledgeIntel)) {
      if (v !== 0) {
        detailLines.push(`${k} intel ${v > 0 ? "+" : ""}${String(v)}%`);
      }
    }
  }
  if (def.effects.bossKnowledgeDrills !== undefined) {
    for (const [k, v] of Object.entries(def.effects.bossKnowledgeDrills)) {
      if (v !== 0) {
        detailLines.push(`${k} drills ${v > 0 ? "+" : ""}${String(v)}%`);
      }
    }
  }
  if (def.effects.bossKnowledgeExecution !== undefined) {
    for (const [k, v] of Object.entries(def.effects.bossKnowledgeExecution)) {
      if (v !== 0) {
        detailLines.push(`${k} execution ${v > 0 ? "+" : ""}${String(v)}%`);
      }
    }
  }
  return detailLines.length > 0 ? detailLines.join("\n") : null;
}

function ActivityCard({
  def,
  canUse,
  blockedReasons,
  effectiveDeathRisk,
  riskBand,
  riskHints,
  onExecute,
}: {
  def: ActivityDefinition;
  canUse: boolean;
  blockedReasons: string[];
  effectiveDeathRisk: number;
  riskBand: RiskBand;
  riskHints: string[];
  onExecute: () => void;
}) {
  const colorBorder = CATEGORY_COLORS[def.category];
  const badge = CATEGORY_BADGE[def.category];
  const isDungeon = def.id.startsWith("dungeon_");
  const detailTooltip = formatDetailTooltip(def, true);

  return (
    <div className={`border rounded-lg p-3 flex flex-col gap-2 ${colorBorder} ${!canUse ? "opacity-55" : ""}`}>
      <div className="flex items-start justify-between gap-1">
        <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${badge}`}>{def.category}</span>
        {def.deathRisk > 0 ? (
          <span className={`text-xs ${RISK_STYLES[riskBand]}`}>☠ {Math.round(effectiveDeathRisk * 100)}% · {RISK_LABELS[riskBand]}</span>
        ) : (
          <span className="text-green-400 text-xs">No death risk</span>
        )}
      </div>
      <div className="flex-1">
        <div className="text-white font-bold text-sm leading-tight">{def.name}</div>
        <p className="text-gray-500 text-xs mt-0.5 leading-tight mb-4">{def.description} {detailTooltip !== null && (
            <span
              className="text-[10px] py-0.5 rounded border border-gray-700 text-gray-400 cursor-help"
              title={detailTooltip}
            >
              (i)
            </span>
          )}</p>
        {isDungeon && def.levelRange !== undefined ? (
          <p className="text-[10px] text-gray-400 mt-1">Lv {def.levelRange.min}-{def.levelRange.max}</p>
        ) : null}
        {!canUse && blockedReasons.length > 0 && (
          <p className="text-red-300 text-[10px] mt-2">Needs: {blockedReasons.join(", ")}</p>
        )}
        {def.deathRisk > 0 && riskHints.length > 0 && (
          <p className="text-gray-400 text-[10px] mt-2">{riskHints.join(" · ")}</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 text-xs text-gray-400">
          <span className="text-yellow-400 font-bold">⚡{def.energyCost}</span>
          {(def.goldCost ?? 0) > 0 && <span className="text-red-300 font-bold">-◈{def.goldCost}g</span>}
          <span>⏱{def.durationHours}h</span>
        </div>
        <button
          className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold text-xs px-2.5 py-1 rounded transition-colors shrink-0"
          disabled={!canUse}
          onClick={onExecute}
        >
          + Plan
        </button>
      </div>
    </div>
  );
}

export function PlanningScreen() {
  const {
    hero,
    meta,
    energyUsedToday,
    plannedActivities,
    planActivity,
    unplanActivity,
    clearPlan,
    endDay,
    getActivityUnlockGaps,
    goTo,
    renameHero,
  } = useGameStore();
  const availableActivities = useMemo(() => hero !== null ? ACTIVITY_LIST.filter((def) => isActivityUnlocked(hero, def)) : null, [hero]);

  if (availableActivities === null || hero === null) {
    return null;
  }

  const plannedGoldSpend = plannedActivities.reduce((sum, id) => sum + (ACTIVITIES[id].goldCost ?? 0), 0);
  const goldRemaining = hero.gold - plannedGoldSpend;
  const energyRemaining = meta.maxEnergy - energyUsedToday;

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
      <HeroStatus energyUsedToday={energyUsedToday} hero={hero} maxEnergy={meta.maxEnergy} onRename={renameHero} />

      {/* Available activities */}
      <div className="space-y-2">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Available Activities</h3>
        <p className="text-gray-500 text-xs">Build your full day plan, then resolve everything at once.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {availableActivities.map((def) => {
            const previewRisk = computeActivityRisk(hero, def.id, meta);
            return (
            <ActivityCard
              blockedReasons={[
                ...(energyRemaining < def.energyCost ? [`energy ${energyRemaining}/${def.energyCost}`] : []),
                ...(goldRemaining < (def.goldCost ?? 0) ? [`gold ${goldRemaining}/${def.goldCost ?? 0}`] : []),
                ...getActivityUnlockGaps(def.id),
              ]}
              canUse={energyRemaining >= def.energyCost && goldRemaining >= (def.goldCost ?? 0) && isActivityUnlocked(hero, def)}
              def={def}
              effectiveDeathRisk={previewRisk.finalRisk}
              key={def.id}
              onExecute={() => { planActivity(def.id); }}
              riskBand={previewRisk.riskBand}
              riskHints={[
                ...(previewRisk.readinessLabel !== null ? [previewRisk.readinessLabel] : []),
                ...(previewRisk.levelPenalty > 0.005 ? [`Level pressure +${Math.round(previewRisk.levelPenalty * 100)}%`] : []),
                ...(previewRisk.levelMitigation > 0.005 ? [`Overlevel advantage -${Math.round(previewRisk.levelMitigation * 100)}%`] : []),
                ...(previewRisk.gearMitigation > 0.005 ? [`Gear -${Math.round(previewRisk.gearMitigation * 100)}%`] : []),
                ...(previewRisk.knowledgeMitigation > 0.005 ? [`Knowledge -${Math.round(previewRisk.knowledgeMitigation * 100)}%`] : []),
                ...(previewRisk.coreStatMitigation > 0.005 ? [`Stats -${Math.round(previewRisk.coreStatMitigation * 100)}%`] : []),
                ...(previewRisk.agePenalty > 0.005 ? [`Age +${Math.round(previewRisk.agePenalty * 100)}%`] : []),
                ...(previewRisk.recklessPressure > 0.005 ? [`Reckless +${Math.round(previewRisk.recklessPressure * 100)}%`] : []),
              ].slice(0, 3)}
            />
            );
          })}
        </div>
      </div>

      {/* Planned queue */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest">Planned Activities</h3>
          {plannedActivities.length > 0 && (
            <button
              className="text-xs text-gray-400 hover:text-gray-200"
              onClick={clearPlan}
            >
              Clear plan
            </button>
          )}
        </div>
        {plannedActivities.length === 0 ? (
          <p className="text-gray-500 text-sm">No activities planned yet.</p>
        ) : (
          <div className="space-y-2">
            {plannedActivities.map((activityId, index) => {
              const def = ACTIVITIES[activityId];
              return (
                <div className="flex items-center justify-between bg-gray-800 rounded p-2" key={`${activityId}-${index}`}>
                  <div>
                    <div className="text-sm text-gray-200">{index + 1}. {def.name}</div>
                    <div className="text-[11px] text-gray-400">
                      ⚡{def.energyCost}{" "}
                      {(def.goldCost ?? 0) > 0 ? <span className="text-red-300">· -◈{def.goldCost}g</span> : ""}
                    </div>
                  </div>
                  <button
                    className="text-xs text-red-300 hover:text-red-200"
                    onClick={() => { unplanActivity(index); }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Day controls */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest">Current Day</h3>
          <span className={`font-bold text-sm ${energyRemaining > 0 ? "text-yellow-400" : "text-red-400"}`}>
            ⚡ {energyRemaining} remaining
          </span>
        </div>
        <div className="text-gray-400 text-sm">
          Planned actions: {plannedActivities.length}
        </div>

        {hero.inGameDay >= 16 && (
          <div className="text-orange-400 text-xs text-center">
            ⚠ Day {hero.inGameDay}: Old age approaches. Death risk rises each day.
          </div>
        )}

        <div className="border-t border-gray-700 pt-3 flex gap-2">
          <button
            className="flex-1 bg-green-700 hover:bg-green-600 text-white font-bold py-2 rounded transition-colors"
            onClick={endDay}
          >
            End Day / Resolve Plan
          </button>
        </div>
      </div>
    </div>
  );
}
