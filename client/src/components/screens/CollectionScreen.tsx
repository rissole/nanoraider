import { EVOLUTION_LIST, EVOLUTIONS } from "../../data/evolutions";
import type { EvolutionId } from "../../data/types";
import { AP_UPGRADES } from "../../data/evolutions";
import { getBossReadinessFromProgress } from "../../game/bossKnowledge";
import { useGameStore } from "../../store/gameStore";

const TIER_COLORS: Record<number, string> = {
  1: "border-green-700 bg-green-950",
  2: "border-blue-700 bg-blue-950",
  3: "border-purple-700 bg-purple-950",
};

const TIER_BADGE: Record<number, string> = {
  1: "bg-green-800 text-green-200",
  2: "bg-blue-800 text-blue-200",
  3: "bg-purple-800 text-purple-200",
};

interface EvolutionCardProps {
  evolutionId: EvolutionId;
  unlocked: boolean;
  collectionUnlocked: EvolutionId[];
}

function EvolutionCard({ evolutionId, unlocked, collectionUnlocked }: EvolutionCardProps) {
  const evo = EVOLUTIONS[evolutionId];
  const tierBorder = TIER_COLORS[evo.tier] ?? "border-gray-700";
  const tierBadge = TIER_BADGE[evo.tier] ?? "bg-gray-700 text-gray-200";
  const prereqsMet = evo.prerequisites.every((p) => collectionUnlocked.includes(p));

  if (!unlocked) {
    return (
      <div className={`border rounded-lg p-4 space-y-2 ${tierBorder} opacity-60`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded font-bold ${tierBadge}`}>Tier {evo.tier}</span>
          <span className="text-gray-600 text-xs">LOCKED</span>
        </div>
        <div className="text-center py-2">
          <div className="text-4xl text-gray-700">?</div>
          <div className="text-gray-500 font-bold mt-1">???</div>
        </div>
        <p className="text-gray-600 text-xs">{evo.hint}</p>
        {evo.prerequisites.length > 0 && (
          <div className="text-xs">
            <span className={prereqsMet ? "text-green-500" : "text-red-500"}>
              {prereqsMet ? "✓" : "✗"} Requires:{" "}
            </span>
            <span className="text-gray-500">
              {evo.prerequisites.map((p) => EVOLUTIONS[p].name).join(" + ")}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-lg p-4 space-y-2 ${tierBorder}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded font-bold ${tierBadge}`}>Tier {evo.tier}</span>
        <span className="text-green-400 text-xs font-bold">✓ UNLOCKED</span>
      </div>
      <div>
        <h3 className="text-white font-bold text-lg">{evo.name}</h3>
        <p className="text-gray-300 text-sm">{evo.description}</p>
      </div>
      <p className="text-gray-400 text-xs italic border-t border-gray-700 pt-2">{evo.lore}</p>
      <div className="space-y-1 text-xs">
        <div className="text-gray-500 uppercase tracking-widest font-bold">Bonuses</div>
        <div className="text-green-400">+{evo.bonuses.energyBonus} max energy</div>
        {(evo.bonuses.startGold ?? 0) > 0 && <div className="text-yellow-400">+{evo.bonuses.startGold}g start gold</div>}
        {(evo.bonuses.combatBonus ?? 0) > 0 && <div className="text-red-400">+{Math.round((evo.bonuses.combatBonus ?? 0) * 100)}% combat</div>}
        {(evo.bonuses.knowledgeTransferMultiplier ?? 1) > 1 && <div className="text-cyan-400">{evo.bonuses.knowledgeTransferMultiplier}x study gains</div>}
        {(evo.bonuses.bossKnowledgeBonus ?? 0) > 0 && <div className="text-blue-400">+{Math.round((evo.bonuses.bossKnowledgeBonus ?? 0) * 100)}% boss knowledge</div>}
      </div>
      {evo.unlocksPath.length > 0 && (
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
          <span className="font-bold text-gray-400">Unlocks path to:</span>{" "}
          {evo.unlocksPath.map((id) => EVOLUTIONS[id].name).join(", ")}
        </div>
      )}
    </div>
  );
}

export function CollectionScreen() {
  const { meta, hero, goTo } = useGameStore();
  const unlockedSet = new Set(meta.unlockedEvolutions);
  const unlockedCount = meta.unlockedEvolutions.length;
  const totalCount = EVOLUTION_LIST.length;
  const apUpgradeCounts = AP_UPGRADES.map((upgrade) => ({
    name: upgrade.name,
    purchased: meta.apUpgrades.filter((id) => id === upgrade.id).length,
    maxPurchases: upgrade.maxPurchases,
  }));
  const bossKnowledgeRows = Object.entries(meta.bossKnowledgeBank);
  const dungeonFamiliarityRows = Object.entries(meta.dungeonFamiliarityBank);

  const tier1 = EVOLUTION_LIST.filter((e) => e.tier === 1);
  const tier2 = EVOLUTION_LIST.filter((e) => e.tier === 2);

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-yellow-400 font-bold text-xl">Legacy Paths</h2>
          <p className="text-gray-400 text-sm">Discover your hero&apos;s legacy</p>
        </div>
        <button
          className="text-gray-400 hover:text-gray-200 text-sm"
          onClick={() => { goTo(hero !== null ? "planning" : "main_menu"); }}
        >
          ← Back
        </button>
      </div>

      {/* Progress */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300 font-bold">Collection Progress</span>
          <span className="text-purple-400 font-bold">{unlockedCount} / {totalCount} Paths</span>
        </div>
        <div className="h-3 bg-gray-800 rounded overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-yellow-500" style={{ width: `${(unlockedCount / totalCount) * 100}%` }} />
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <span className="text-green-400">{EVOLUTION_LIST.filter((e) => e.tier === 1 && unlockedSet.has(e.id)).length}/{tier1.length} Tier 1</span>
          <span className="text-blue-400">{EVOLUTION_LIST.filter((e) => e.tier === 2 && unlockedSet.has(e.id)).length}/{tier2.length} Tier 2</span>
        </div>
      </div>

      {/* Meta progression */}
      <div className="bg-gray-900 border border-cyan-800 rounded-lg p-4 space-y-4">
        <h3 className="text-cyan-300 text-xs font-bold uppercase tracking-widest">Meta Progression</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-950 border border-gray-800 rounded p-2">
            <div className="text-gray-500 text-xs">Total Runs</div>
            <div className="text-blue-300 font-bold">{meta.totalRuns}</div>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded p-2">
            <div className="text-gray-500 text-xs">Achievement Points</div>
            <div className="text-yellow-300 font-bold">{meta.achievementPoints}</div>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded p-2">
            <div className="text-gray-500 text-xs">Max Energy</div>
            <div className="text-emerald-300 font-bold">{meta.maxEnergy}</div>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded p-2">
            <div className="text-gray-500 text-xs">Unlocked Evolutions</div>
            <div className="text-purple-300 font-bold">{meta.unlockedEvolutions.length}</div>
          </div>
        </div>

        <div className="space-y-1 text-xs border-t border-gray-800 pt-3">
          <div className="text-gray-500 uppercase tracking-widest font-bold">Stacked Legacy Bonuses</div>
          <div className="text-green-300">Energy Bonus: +{meta.evolutionBonuses.energyBonus}</div>
          <div className="text-yellow-300">Start Gold: +{meta.evolutionBonuses.startGold ?? 0}g</div>
          <div className="text-red-300">Combat Bonus: +{Math.round((meta.evolutionBonuses.combatBonus ?? 0) * 100)}%</div>
          <div className="text-cyan-300">Knowledge Transfer: {meta.evolutionBonuses.knowledgeTransferMultiplier ?? 1}x</div>
          <div className="text-blue-300">Boss Knowledge Bonus: +{Math.round((meta.evolutionBonuses.bossKnowledgeBonus ?? 0) * 100)}%</div>
        </div>

        <div className="space-y-1 text-xs border-t border-gray-800 pt-3">
          <div className="text-gray-500 uppercase tracking-widest font-bold">AP Upgrades</div>
          {apUpgradeCounts.map((upgrade) => (
            <div className="flex justify-between" key={upgrade.name}>
              <span className="text-gray-400">{upgrade.name}</span>
              <span className="text-blue-300">{upgrade.purchased}/{upgrade.maxPurchases}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-xs border-t border-gray-800 pt-3">
          <div className="text-gray-500 uppercase tracking-widest font-bold">Boss Knowledge Bank</div>
          {bossKnowledgeRows.length === 0 && <div className="text-gray-500">No stored boss knowledge yet.</div>}
          {bossKnowledgeRows.map(([bossId, progress]) => (
            <div className="bg-gray-950 border border-gray-800 rounded p-2 space-y-1" key={bossId}>
              <div className="flex justify-between">
                <span className="text-gray-300 capitalize">{bossId.replace(/_/g, " ")}</span>
                <span className="text-cyan-300">Readiness {Math.round(getBossReadinessFromProgress(progress))}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-400">
                <span>Intel {Math.round(progress.intel)}</span>
                <span>Drills {Math.round(progress.drills)}</span>
                <span>Execution {Math.round(progress.execution)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-xs border-t border-gray-800 pt-3">
          <div className="text-gray-500 uppercase tracking-widest font-bold">Dungeon Familiarity Bank</div>
          {dungeonFamiliarityRows.length === 0 && <div className="text-gray-500">No stored dungeon familiarity yet.</div>}
          {dungeonFamiliarityRows.map(([dungeonId, clears]) => (
            <div className="flex justify-between bg-gray-950 border border-gray-800 rounded p-2" key={dungeonId}>
              <span className="text-gray-300 capitalize">{dungeonId.replace("dungeon_", "").replace(/_/g, " ")}</span>
              <span className="text-emerald-300">Survived clears {clears}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tier 1 */}
      <div className="space-y-3">
        <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest">Tier 1 — Foundation Paths</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tier1.map((evo) => (
            <EvolutionCard
              collectionUnlocked={meta.unlockedEvolutions}
              evolutionId={evo.id}
              key={evo.id}
              unlocked={unlockedSet.has(evo.id)}
            />
          ))}
        </div>
      </div>

      {/* Tier 2 */}
      <div className="space-y-3">
        <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest">Tier 2 — Specialist Paths</h3>
        <div className="grid grid-cols-1 gap-3">
          {tier2.map((evo) => (
            <EvolutionCard
              collectionUnlocked={meta.unlockedEvolutions}
              evolutionId={evo.id}
              key={evo.id}
              unlocked={unlockedSet.has(evo.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
