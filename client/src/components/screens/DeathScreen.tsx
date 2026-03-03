import { useState } from "react";
import { EVOLUTION_LIST, EVOLUTION_TIER_LABELS, EVOLUTIONS } from "../../data/evolutions";
import { ACTIVITIES } from "../../data/activities";
import { useGameStore } from "../../store/gameStore";
import { getBossReadinessFromProgress } from "../../game/bossKnowledge";

const CAUSE_LABELS = {
  combat: { label: "Fell in Battle", icon: "⚔", color: "text-red-400" },
  old_age: { label: "Died of Old Age", icon: "🕯", color: "text-gray-400" },
};

export function DeathScreen() {
  const { deathSummary, meta, goTo, startHeroCreation } = useGameStore();
  const [phase, setPhase] = useState<"stats" | "evolution" | "bonuses">("stats");

  if (deathSummary === null) {
    goTo("main_menu");
    return null;
  }

  const summary = deathSummary;
  const causeInfo = CAUSE_LABELS[summary.cause];
  const fatalActivityName = summary.fatalActivityId !== null ? ACTIVITIES[summary.fatalActivityId].name : null;
  const moltenReadiness = getBossReadinessFromProgress(summary.bossKnowledgeSnapshot["molten_fury"]);

  const evolutionDef = summary.evolutionUnlocked !== null ? EVOLUTIONS[summary.evolutionUnlocked] : null;
  const almostDef = summary.almostUnlocked !== null ? EVOLUTIONS[summary.almostUnlocked] : null;

  return (
    <div className="min-h-screen p-4 max-w-xl mx-auto space-y-4">
      {/* Death header */}
      <div className="text-center py-6 space-y-2">
        <div className={`text-4xl ${causeInfo.color}`}>{causeInfo.icon}</div>
        <h2 className="text-3xl font-bold text-white">{summary.heroName} has fallen</h2>
        <div className={`font-bold ${causeInfo.color}`}>{causeInfo.label} · Day {summary.inGameDay}</div>
      </div>

      {/* Phase tabs */}
      <div className="flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
        {(["stats", "evolution", "bonuses"] as const).map((p) => (
          <button
            className={`flex-1 py-2 text-sm font-bold transition-colors ${phase === p ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}
            key={p}
            onClick={() => { setPhase(p); }}
          >
            {p === "stats" ? "Legacy" : p === "evolution" ? "Path" : "Rewards"}
          </button>
        ))}
      </div>

      {/* Phase: Stats */}
      {phase === "stats" && (
        <div className="space-y-3">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
            <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest">Run Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Level Reached" value={`${summary.level}`} />
              <Stat label="In-Game Days" value={`${summary.inGameDay} / 18`} />
              <Stat label="Gold at Death" value={`${summary.gold}g`} />
              <Stat label="Total XP Earned" value={`${summary.totalXpGained}`} />
              <Stat label="Raid Defeated" value={summary.defeatedRaids.length > 0 ? "Yes ✓" : "No"} />
              <Stat label="Boss Readiness" value={`${Math.round(moltenReadiness)}%`} />
            </div>
          </div>

          {summary.cause === "combat" && summary.fatalActivityRisk !== null && summary.fatalRiskBand !== null && (
            <div className="bg-gray-900 border border-red-900 rounded-lg p-4 space-y-2">
              <h3 className="text-red-300 text-xs font-bold uppercase tracking-widest">Final Encounter</h3>
              <p className="text-sm text-gray-300">
                {fatalActivityName ?? "Combat activity"} had a{" "}
                <span className="text-red-400 font-bold">{Math.round(summary.fatalActivityRisk * 100)}%</span> death risk ({summary.fatalRiskBand}).
              </p>
              {summary.fatalRiskHints.length > 0 && (
                <ul className="text-xs text-gray-400 space-y-1">
                  {summary.fatalRiskHints.map((hint) => (
                    <li key={hint}>• {hint}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Personality reveal */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
            <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest">Personality Revealed</h3>
            <p className="text-gray-400 text-xs">Hidden during your run — this is who your hero became.</p>
            {(Object.entries(summary.personalitySnapshot) as [string, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([stat, value]) => (
                <PersonalityBar key={stat} stat={stat} value={value} />
              ))}
          </div>
        </div>
      )}

      {/* Phase: Legacy Path */}
      {phase === "evolution" && (
        <div className="space-y-3">
          {evolutionDef !== null ? (
            <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-5 space-y-4">
              <div className="text-center space-y-1">
                <div className="text-xs text-yellow-400 uppercase tracking-widest font-bold">Legacy Path Unlocked!</div>
                <div className="text-3xl font-bold text-white">{evolutionDef.name}</div>
                <div className="text-yellow-400 text-sm">{EVOLUTION_TIER_LABELS[evolutionDef.tier]}</div>
              </div>
              <p className="text-gray-300 text-sm text-center italic">{evolutionDef.lore}</p>
              {summary.whyUnlocked !== null && (
                <div className="bg-gray-800 rounded p-3 text-sm text-gray-300">
                  <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">Why you unlocked it</span>
                  {summary.whyUnlocked}
                </div>
              )}
              {evolutionDef.unlocksPath.length > 0 && (
                <div className="text-xs text-gray-400">
                  <span className="font-bold text-gray-300">Opens paths to:</span>{" "}
                  {evolutionDef.unlocksPath.map((id) => EVOLUTIONS[id].name).join(", ")}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-5 space-y-3 text-center">
              <div className="text-gray-400 text-4xl">?</div>
              <div className="text-gray-300 font-bold">No Legacy Path This Run</div>
              <p className="text-gray-500 text-sm">
                You didn&apos;t meet the threshold for any legacy path. Each run still builds your legacy.
              </p>
            </div>
          )}

          {/* Almost unlocked hint */}
          {almostDef !== null && summary.almostReason !== null && (
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 space-y-2">
              <div className="text-orange-400 text-xs uppercase tracking-widest font-bold">You Were Close!</div>
              <div className="text-white font-bold">{almostDef.name}</div>
              <p className="text-gray-400 text-sm">{summary.almostReason}</p>
            </div>
          )}

          {/* Collection progress */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Legacy Path Collection</span>
              <span className="text-purple-400 font-bold">{meta.unlockedEvolutions.length} / {EVOLUTION_LIST.length}</span>
            </div>
            <div className="mt-2 h-2 bg-gray-800 rounded overflow-hidden">
              <div
                className="h-full bg-purple-500"
                style={{ width: `${(meta.unlockedEvolutions.length / EVOLUTION_LIST.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Phase: Rewards */}
      {phase === "bonuses" && (
        <div className="space-y-3">
          <div className="bg-gray-900 border border-green-800 rounded-lg p-4 space-y-3">
            <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest">Permanent Rewards</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Max Energy</span>
                <span className="text-yellow-400 font-bold">+{summary.energyBonusGranted} → {meta.maxEnergy} total</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Achievement Points</span>
                <span className="text-blue-400 font-bold">+{summary.apGranted} → {meta.achievementPoints} total</span>
              </div>
              {summary.evolutionUnlocked !== null && evolutionDef !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{evolutionDef.name} Bonus Energy</span>
                  <span className="text-purple-400 font-bold">+{evolutionDef.bonuses.energyBonus}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
            <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest">All Active Bonuses</h3>
            {meta.unlockedEvolutions.length === 0 ? (
              <p className="text-gray-600 text-sm">Unlock legacy paths to gain legacy bonuses.</p>
            ) : (
              meta.unlockedEvolutions.map((id) => {
                const evo = EVOLUTIONS[id];
                return (
                  <div className="text-sm" key={id}>
                    <span className="text-purple-400 font-bold">{evo.name}:</span>{" "}
                    <span className="text-gray-400">{formatBonuses(evo)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CTA buttons */}
      <div className="flex gap-3 pt-2">
        <button
          className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors"
          onClick={startHeroCreation}
        >
          ↺ New Hero
        </button>
        <button
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-3 rounded-lg border border-gray-600 transition-colors"
          onClick={() => { goTo("collection"); }}
        >
          ◈ Collection
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800 rounded p-2">
      <div className="text-gray-500 text-xs">{label}</div>
      <div className="text-white font-bold">{value}</div>
    </div>
  );
}

function PersonalityBar({ stat, value }: { stat: string; value: number }) {
  const MAX = 80;
  const pct = Math.min(1, value / MAX);
  const colors: Record<string, string> = {
    combatStyle: "bg-red-500",
    socialStyle: "bg-cyan-500",
    economicFocus: "bg-yellow-500",
    exploration: "bg-green-500",
    preparation: "bg-blue-500",
    ambition: "bg-purple-500",
  };
  const barColor = colors[stat] ?? "bg-gray-500";

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-400 capitalize w-24 shrink-0">{stat}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${pct * 100}%` }} />
      </div>
      <span className="text-white text-xs w-8 text-right">{value}</span>
    </div>
  );
}

function formatBonuses(evo: {
  bonuses: {
    energyBonus: number;
    startGold?: number;
    combatBonus?: number;
    bossKnowledgeBonus?: number;
    knowledgeTransferMultiplier?: number;
    vendorDiscountPct?: number;
    recipeDiscountPct?: number;
    purpleCraftStatBonusPct?: number;
    brokerTierStart?: number;
    raidProvisionerUnlocked?: boolean;
  };
}): string {
  const parts: string[] = [];
  const b = evo.bonuses;
  if (b.energyBonus > 0) {
    parts.push(`+${b.energyBonus} max energy`);
  }
  const startGold = b.startGold ?? 0;
  if (startGold > 0) {
    parts.push(`+${startGold}g start gold`);
  }
  const combatBonus = b.combatBonus ?? 0;
  if (combatBonus > 0) {
    parts.push(`+${Math.round(combatBonus * 100)}% combat`);
  }
  const bossKnowledgeBonus = b.bossKnowledgeBonus ?? 0;
  if (bossKnowledgeBonus > 0) {
    parts.push(`+${Math.round(bossKnowledgeBonus * 100)}% boss knowledge`);
  }
  const knowledgeTransferMultiplier = b.knowledgeTransferMultiplier ?? 1;
  if (knowledgeTransferMultiplier > 1) {
    parts.push(`${knowledgeTransferMultiplier}x study gains`);
  }
  const vendorDiscountPct = b.vendorDiscountPct ?? 0;
  if (vendorDiscountPct > 0) {
    parts.push(`${Math.round(vendorDiscountPct * 100)}% vendor discount`);
  }
  const recipeDiscountPct = b.recipeDiscountPct ?? 0;
  if (recipeDiscountPct > 0) {
    parts.push(`${Math.round(recipeDiscountPct * 100)}% recipe discount`);
  }
  const purpleCraftStatBonusPct = b.purpleCraftStatBonusPct ?? 0;
  if (purpleCraftStatBonusPct > 0) {
    parts.push(`${Math.round(purpleCraftStatBonusPct * 100)}% purple craft`);
  }
  const brokerTierStart = b.brokerTierStart ?? 1;
  if (brokerTierStart > 1) {
    parts.push(`broker tier ${brokerTierStart}`);
  }
  if (b.raidProvisionerUnlocked === true) {
    parts.push("raid provisioner");
  }
  return parts.join(", ");
}
