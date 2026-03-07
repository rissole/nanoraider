import { useState } from "react";
import { TOWNSPERSON_LIST, TOWNSPEOPLE } from "../../data/townspeople";
import type { TownspersonBonuses } from "../../data/types";
import { ACTIVITIES } from "../../data/activities";
import { useGameStore } from "../../store/gameStore";

const CAUSE_LABELS = {
  combat: { label: "Fell in Battle", icon: "⚔", color: "text-red-400" },
  old_age: { label: "Died of Old Age", icon: "🕯", color: "text-gray-400" },
};

export function DeathScreen() {
  const { deathSummary, meta, goTo, startHeroCreation } = useGameStore();
  const [phase, setPhase] = useState<"stats" | "outpost" | "bonuses">("stats");

  if (deathSummary === null) {
    goTo("main_menu");
    return null;
  }

  const summary = deathSummary;
  const causeInfo = CAUSE_LABELS[summary.cause];
  const fatalActivityName = summary.fatalActivityId !== null ? ACTIVITIES[summary.fatalActivityId].name : null;
  const moltenReadiness = summary.bossReadinessSnapshot["molten_fury"];

  const townspersonDef = summary.townspersonUnlocked !== null ? TOWNSPEOPLE[summary.townspersonUnlocked] : null;
  const almostDef = summary.almostUnlocked !== null ? TOWNSPEOPLE[summary.almostUnlocked] : null;

  return (
    <div className="min-h-screen p-4 max-w-xl mx-auto space-y-4">
      {/* Death / Survival header */}
      <div className="text-center py-6 space-y-2">
        {summary.heroSurvived ? (
          <>
            <div className="text-4xl text-yellow-400">🏠</div>
            <h2 className="text-3xl font-bold text-yellow-300">{summary.heroName} survived!</h2>
            <div className="text-yellow-400 font-bold">Joins the Outpost as {townspersonDef?.name ?? "a resident"}</div>
          </>
        ) : (
          <>
            <div className={`text-4xl ${causeInfo.color}`}>{causeInfo.icon}</div>
            <h2 className="text-3xl font-bold text-white">{summary.heroName} has fallen</h2>
            <div className={`font-bold ${causeInfo.color}`}>{causeInfo.label} · Day {summary.inGameDay}</div>
          </>
        )}
      </div>

      {/* Phase tabs */}
      <div className="flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
        {(["stats", "outpost", "bonuses"] as const).map((p) => (
          <button
            className={`flex-1 py-2 text-sm font-bold transition-colors ${phase === p ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}
            key={p}
            onClick={() => { setPhase(p); }}
          >
            {p === "stats" ? "Legacy" : p === "outpost" ? "Outpost" : "Rewards"}
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
              <Stat label="In-Game Days" value={`${summary.inGameDay} / 12`} />
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

          {/* Daring reveal */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
            <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest">Daring Revealed</h3>
            <p className="text-gray-400 text-xs">Hidden during your run — your risk tendency is now revealed.</p>
            <PersonalityBar stat="daring" value={summary.daringSnapshot} />
            <div className="text-xs text-gray-300">
              Triangle at death: War {summary.triangleSnapshot.war}% · Wit {summary.triangleSnapshot.wit}% · Wealth {summary.triangleSnapshot.wealth}% · Renown {summary.renownSnapshot}
            </div>
          </div>
        </div>
      )}

      {/* Phase: Outpost */}
      {phase === "outpost" && (
        <div className="space-y-3">
          {townspersonDef !== null ? (
            <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-5 space-y-4">
              <div className="text-center space-y-1">
                <div className="text-xs text-yellow-400 uppercase tracking-widest font-bold">Hero Survived!</div>
                <div className="text-3xl font-bold text-white">{summary.heroName}</div>
                <div className="text-yellow-300 text-lg font-bold">{townspersonDef.name}</div>
                <div className="text-yellow-400 text-sm capitalize">{townspersonDef.raidGate === "none" ? "Outpost Resident" : `${townspersonDef.raidGate.replace(/_/g, " ")} Veteran`}</div>
              </div>
              <p className="text-gray-300 text-sm text-center italic">{townspersonDef.lore}</p>
              {summary.whyUnlocked !== null && (
                <div className="bg-gray-800 rounded p-3 text-sm text-gray-300">
                  <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">Why they survived</span>
                  {summary.whyUnlocked}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-5 space-y-3 text-center">
              <div className="text-gray-400 text-4xl">⚰</div>
              <div className="text-gray-300 font-bold">Your Hero Falls to the Graveyard</div>
              <p className="text-gray-500 text-sm">
                Not every hero survives to tell their tale. Each run still shapes future adventurers.
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

          {/* Outpost progress */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Outpost Residents</span>
              <span className="text-yellow-400 font-bold">{meta.townspeople.length} / {TOWNSPERSON_LIST.length}</span>
            </div>
            <div className="mt-2 h-2 bg-gray-800 rounded overflow-hidden">
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${(meta.townspeople.length / TOWNSPERSON_LIST.length) * 100}%` }}
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
              {summary.energyBonusGranted > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Max Energy</span>
                  <span className="text-yellow-400 font-bold">+{summary.energyBonusGranted} → {meta.maxEnergy} total</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Achievement Points</span>
                <span className="text-blue-400 font-bold">+{summary.apGranted} → {meta.achievementPoints} total</span>
              </div>
              {summary.townspersonUnlocked !== null && townspersonDef !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{townspersonDef.name} Bonus Energy</span>
                  <span className="text-yellow-400 font-bold">+{townspersonDef.bonuses.energyBonus}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
            <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest">All Active Bonuses</h3>
            {meta.townspeople.length === 0 ? (
              <p className="text-gray-600 text-sm">Recruit townspeople to gain permanent bonuses.</p>
            ) : (
              meta.townspeople.map((filled) => {
                const role = TOWNSPEOPLE[filled.roleId];
                return (
                  <div className="text-sm" key={filled.roleId}>
                    <span className="text-yellow-400 font-bold">{role.name}</span>
                    <span className="text-gray-500 text-xs"> ({filled.hero.heroName})</span>
                    {": "}
                    <span className="text-gray-400">{formatBonuses(role.bonuses)}</span>
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
          🏠 Outpost
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
    daring: "bg-purple-500",
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

function formatBonuses(bonuses: TownspersonBonuses): string {
  const parts: string[] = [];
  if (bonuses.energyBonus > 0) {
    parts.push(`+${bonuses.energyBonus} max energy`);
  }
  if ((bonuses.startGold ?? 0) > 0) {
    parts.push(`+${bonuses.startGold ?? 0}g start gold`);
  }
  if ((bonuses.combatBonus ?? 0) > 0) {
    parts.push(`+${Math.round((bonuses.combatBonus ?? 0) * 100)}% combat`);
  }
  if ((bonuses.bossReadinessBonus ?? 0) > 0) {
    parts.push(`+${Math.round((bonuses.bossReadinessBonus ?? 0) * 100)}% boss readiness`);
  }
  if ((bonuses.knowledgeTransferMultiplier ?? 1) > 1) {
    parts.push(`${bonuses.knowledgeTransferMultiplier ?? 1}x study gains`);
  }
  if ((bonuses.vendorDiscountPct ?? 0) > 0) {
    parts.push(`${Math.round((bonuses.vendorDiscountPct ?? 0) * 100)}% vendor discount`);
  }
  if ((bonuses.recipeDiscountPct ?? 0) > 0) {
    parts.push(`${Math.round((bonuses.recipeDiscountPct ?? 0) * 100)}% recipe discount`);
  }
  if ((bonuses.purpleCraftStatBonusPct ?? 0) > 0) {
    parts.push(`${Math.round((bonuses.purpleCraftStatBonusPct ?? 0) * 100)}% purple craft`);
  }
  if ((bonuses.brokerTierStart ?? 1) > 1) {
    parts.push(`broker tier ${bonuses.brokerTierStart ?? 1}`);
  }
  if (bonuses.raidProvisionerUnlocked === true) {
    parts.push("raid provisioner");
  }
  return parts.join(", ");
}
