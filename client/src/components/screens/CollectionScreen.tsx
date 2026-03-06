import { useEffect, useState } from "react";
import { EVOLUTION_LIST, EVOLUTION_TIER_LABELS, EVOLUTIONS } from "../../data/evolutions";
import type { EvolutionBonuses, EvolutionId } from "../../data/types";
import { AP_UPGRADES } from "../../data/evolutions";
import { useGameStore } from "../../store/gameStore";

const META_EXPANDED_STORAGE_KEY = "nanoraider-collection-meta-expanded";

const EVOLUTION_ICONS: Record<EvolutionId, string> = {
  berserker: "⚔",
  merchant: "💰",
  scholar: "📚",
  raid_legend: "🏆",
  guardian: "🛡",
  theorycrafter: "📜",
  socialite: "💬",
  warlord: "⚔👑",
  dungeon_master: "🚪",
  guildmaster: "🏴",
  treasure_hunter: "📦",
  raid_leader: "👑",
};

const EVOLUTION_LOCKED_LORE: Record<EvolutionId, string> = {
  berserker: "Legends speak of warriors who lived only for the thrill of battle...",
  merchant: "Whispers tell of those who understood that gold is power...",
  scholar: "Stories recount souls who believed preparation was everything...",
  raid_legend: "They came so close to ultimate victory. Their near-triumph echoes...",
  guardian: "Legends tell of one who never fell, who stood firm when all others fled...",
  theorycrafter: "Some say they calculated every variable before stepping inside...",
  socialite: "They knew everyone worth knowing. Friends in every tavern...",
  warlord: "Strength alone isn't enough. Command it. Lead from the front...",
  dungeon_master: "They cleared a thousand dungeons. Every trash pack, every pull...",
  guildmaster: "They built an empire of loyal allies. The guild endures...",
  treasure_hunter: "Every chest might hold fortune. They found what others missed...",
  raid_leader: "Only one has ever commanded armies against gods and won...",
};

function formatBonusTeaser(bonuses: EvolutionBonuses): string[] {
  const parts: string[] = [];
  parts.push("Max energy");
  if ((bonuses.startGold ?? 0) > 0) {
    parts.push("Starting gold");
  }
  if ((bonuses.combatBonus ?? 0) > 0) {
    parts.push("Combat bonus");
  }
  if ((bonuses.knowledgeTransferMultiplier ?? 1) > 1) {
    parts.push("Study multiplier");
  }
  if ((bonuses.bossReadinessBonus ?? 0) > 0) {
    parts.push("Boss readiness bonus");
  }
  if ((bonuses.vendorDiscountPct ?? 0) > 0) {
    parts.push("Vendor discount");
  }
  if ((bonuses.recipeDiscountPct ?? 0) > 0) {
    parts.push("Recipe discount");
  }
  if ((bonuses.purpleCraftStatBonusPct ?? 0) > 0) {
    parts.push("Purple craft bonus");
  }
  if ((bonuses.brokerTierStart ?? 0) > 1) {
    parts.push("Broker access");
  }
  if (bonuses.raidProvisionerUnlocked === true) {
    parts.push("Raid provisioner");
  }
  return parts;
}

const TIER_COLORS: Record<number, string> = {
  1: "border-green-500 bg-green-900/80",
  2: "border-blue-500 bg-blue-900/80",
  3: "border-purple-500 bg-purple-900/80",
};

const TIER_BADGE: Record<number, string> = {
  1: "bg-green-600 text-green-100",
  2: "bg-blue-600 text-blue-100",
  3: "bg-purple-600 text-purple-100",
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
    const isTier1 = evo.tier === 1;
    const displayName = isTier1 ? evo.name : "???";
    const displayHint = isTier1 ? evo.hint : EVOLUTION_LOCKED_LORE[evolutionId];
    return (
      <div className={`border-2 rounded-lg p-4 space-y-2 ${tierBorder} opacity-75`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded font-bold ${tierBadge}`}>{EVOLUTION_TIER_LABELS[evo.tier as 1 | 2 | 3]}</span>
          <span className="text-gray-400 text-xs font-medium">LOCKED</span>
        </div>
        <div className="text-center py-2">
          <div className="text-4xl text-gray-400">{EVOLUTION_ICONS[evolutionId]}</div>
          <div className="text-white font-bold mt-1">{displayName}</div>
        </div>
        <p className="text-gray-300 text-sm italic">{displayHint}</p>
        <div className="text-amber-400 text-sm">
          <div className="text-amber-300/80 text-xs font-bold uppercase tracking-widest mb-1">Grants</div>
          <ul className="list-disc list-inside space-y-0.5">
            {formatBonusTeaser(evo.bonuses).map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
        {evo.prerequisites.length > 0 && (
          <div className="text-sm">
            <span className={prereqsMet ? "text-green-400" : "text-sky-400"}>
              {prereqsMet ? "✓" : "?"} Requires:{" "}
            </span>
            <span className="text-gray-300">
              {evo.prerequisites.map((p) => (collectionUnlocked.includes(p) ? EVOLUTIONS[p].name : "???")).join(" + ")}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-lg p-4 space-y-2 ${tierBorder}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded font-bold ${tierBadge}`}>{EVOLUTION_TIER_LABELS[evo.tier as 1 | 2 | 3]}</span>
        <span className="text-green-300 text-xs font-bold">✓ UNLOCKED</span>
      </div>
      <div>
        <h3 className="text-white font-bold text-lg">{evo.name}</h3>
        <p className="text-gray-200 text-sm">{evo.description}</p>
      </div>
      <p className="text-gray-300 text-sm italic border-t border-gray-600 pt-2">{evo.lore}</p>
      <div className="space-y-1 text-sm">
        <div className="text-gray-400 uppercase tracking-widest font-bold">Bonuses</div>
        <div className="text-green-300">+{evo.bonuses.energyBonus} max energy</div>
        {(evo.bonuses.startGold ?? 0) > 0 && <div className="text-yellow-300">+{evo.bonuses.startGold}g start gold</div>}
        {(evo.bonuses.combatBonus ?? 0) > 0 && <div className="text-red-300">+{Math.round((evo.bonuses.combatBonus ?? 0) * 100)}% combat</div>}
        {(evo.bonuses.knowledgeTransferMultiplier ?? 1) > 1 && <div className="text-cyan-300">{evo.bonuses.knowledgeTransferMultiplier}x study gains</div>}
        {(evo.bonuses.bossReadinessBonus ?? 0) > 0 && <div className="text-blue-300">+{Math.round((evo.bonuses.bossReadinessBonus ?? 0) * 100)}% boss readiness</div>}
        {(evo.bonuses.vendorDiscountPct ?? 0) > 0 && <div className="text-amber-300">+{Math.round((evo.bonuses.vendorDiscountPct ?? 0) * 100)}% vendor discount</div>}
        {(evo.bonuses.recipeDiscountPct ?? 0) > 0 && <div className="text-orange-300">+{Math.round((evo.bonuses.recipeDiscountPct ?? 0) * 100)}% recipe discount</div>}
        {(evo.bonuses.purpleCraftStatBonusPct ?? 0) > 0 && <div className="text-purple-300">+{Math.round((evo.bonuses.purpleCraftStatBonusPct ?? 0) * 100)}% purple craft</div>}
        {(evo.bonuses.brokerTierStart ?? 1) > 1 && <div className="text-sky-300">Broker tier {evo.bonuses.brokerTierStart} start</div>}
        {evo.bonuses.raidProvisionerUnlocked === true ? <div className="text-violet-300">Raid Provisioner unlocked</div> : null}
      </div>
      {evo.unlocksPath.length > 0 && (
        <div className="text-sm text-gray-300 border-t border-gray-600 pt-2">
          <span className="font-bold text-gray-200">Unlocks path to:</span>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
            {evo.unlocksPath.map((id) => (
              <span className="text-cyan-300" key={id}>
                → {EVOLUTIONS[id].name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getStoredMetaExpanded(): boolean {
  const stored = localStorage.getItem(META_EXPANDED_STORAGE_KEY);
  return stored === null ? false : stored === "true";
}

export function CollectionScreen() {
  const { meta, hero, goTo } = useGameStore();
  const [metaExpanded, setMetaExpanded] = useState(getStoredMetaExpanded);
  const unlockedSet = new Set(meta.unlockedEvolutions);

  useEffect(() => {
    localStorage.setItem(META_EXPANDED_STORAGE_KEY, String(metaExpanded));
  }, [metaExpanded]);

  const toggleMeta = () => {
    setMetaExpanded((prev) => !prev);
  };
  const unlockedCount = meta.unlockedEvolutions.length;
  const totalCount = EVOLUTION_LIST.length;
  const apUpgradeCounts = AP_UPGRADES.map((upgrade) => ({
    name: upgrade.name,
    purchased: meta.apUpgrades.filter((id) => id === upgrade.id).length,
    maxPurchases: upgrade.maxPurchases,
  }));
  const bossReadinessRows = Object.entries(meta.bossReadinessBank);

  const tier1 = EVOLUTION_LIST.filter((e) => e.tier === 1);
  const tier2 = EVOLUTION_LIST.filter((e) => e.tier === 2);
  const tier3 = EVOLUTION_LIST.filter((e) => e.tier === 3);

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-yellow-300 font-bold text-xl">Legacy Paths</h2>
          <p className="text-gray-300 text-sm">Discover your hero&apos;s legacy</p>
        </div>
        <button
          className="text-gray-300 hover:text-white text-sm transition-colors"
          onClick={() => { goTo(hero !== null ? "planning" : "main_menu"); }}
        >
          ← Back
        </button>
      </div>

      {/* Progress */}
      <div className="bg-gray-800/80 border border-gray-600 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-200 font-bold">Collection Progress</span>
          <span className="text-purple-300 font-bold">{unlockedCount} / {totalCount} Paths</span>
        </div>
        <div className="h-3 bg-gray-700 rounded overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-yellow-400" style={{ width: `${(unlockedCount / totalCount) * 100}%` }} />
        </div>
        <div className="flex gap-4 text-sm text-gray-300">
          <span className="text-green-300">{EVOLUTION_LIST.filter((e) => e.tier === 1 && unlockedSet.has(e.id)).length}/{tier1.length} Foundation</span>
          <span className="text-blue-300">{EVOLUTION_LIST.filter((e) => e.tier === 2 && unlockedSet.has(e.id)).length}/{tier2.length} Specialist</span>
          <span className="text-purple-300">{EVOLUTION_LIST.filter((e) => e.tier === 3 && unlockedSet.has(e.id)).length}/{tier3.length} Mastery</span>
        </div>
      </div>

      {/* Meta progression */}
      <div className="bg-gray-800/80 border border-cyan-600 rounded-lg overflow-hidden">
        <button
          className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-700/50 transition-colors"
          onClick={toggleMeta}
          type="button"
        >
          <h3 className="text-cyan-200 text-sm font-bold uppercase tracking-widest">Meta Progression</h3>
          <span className="text-cyan-300 text-lg">{metaExpanded ? "−" : "+"}</span>
        </button>
        {metaExpanded ? (
        <div className="px-4 pb-4 space-y-4 border-t border-cyan-700/50 pt-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-800 border border-gray-600 rounded p-2">
            <div className="text-gray-400 text-xs">Total Runs</div>
            <div className="text-blue-200 font-bold">{meta.totalRuns}</div>
          </div>
          <div className="bg-gray-800 border border-gray-600 rounded p-2">
            <div className="text-gray-400 text-xs">Achievement Points</div>
            <div className="text-yellow-200 font-bold">{meta.achievementPoints}</div>
          </div>
          <div className="bg-gray-800 border border-gray-600 rounded p-2">
            <div className="text-gray-400 text-xs">Max Energy</div>
            <div className="text-emerald-200 font-bold">{meta.maxEnergy}</div>
          </div>
          <div className="bg-gray-800 border border-gray-600 rounded p-2">
            <div className="text-gray-400 text-xs">Unlocked Evolutions</div>
            <div className="text-purple-200 font-bold">{meta.unlockedEvolutions.length}</div>
          </div>
        </div>

        <div className="space-y-1 text-sm border-t border-gray-600 pt-3">
          <div className="text-gray-400 uppercase tracking-widest font-bold">Stacked Legacy Bonuses</div>
          <div className="text-green-200">Energy Bonus: +{meta.evolutionBonuses.energyBonus}</div>
          <div className="text-yellow-200">Start Gold: +{meta.evolutionBonuses.startGold ?? 0}g</div>
          <div className="text-red-200">Combat Bonus: +{Math.round((meta.evolutionBonuses.combatBonus ?? 0) * 100)}%</div>
          <div className="text-cyan-200">Knowledge Transfer: {meta.evolutionBonuses.knowledgeTransferMultiplier ?? 1}x</div>
          <div className="text-blue-200">Boss Readiness Bonus: +{Math.round((meta.evolutionBonuses.bossReadinessBonus ?? 0) * 100)}%</div>
        </div>

        <div className="space-y-1 text-sm border-t border-gray-600 pt-3">
          <div className="text-gray-400 uppercase tracking-widest font-bold">AP Upgrades</div>
          {apUpgradeCounts.map((upgrade) => (
            <div className="flex justify-between" key={upgrade.name}>
              <span className="text-gray-300">{upgrade.name}</span>
              <span className="text-blue-200">{upgrade.purchased}/{upgrade.maxPurchases}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-sm border-t border-gray-600 pt-3">
          <div className="text-gray-400 uppercase tracking-widest font-bold">Boss Readiness Bank</div>
          {bossReadinessRows.length === 0 && <div className="text-gray-400">No stored boss readiness yet.</div>}
          {bossReadinessRows.map(([bossId, readiness]) => (
            <div className="bg-gray-800 border border-gray-600 rounded p-2" key={bossId}>
              <div className="flex justify-between">
                <span className="text-gray-200 capitalize">{bossId.replace(/_/g, " ")}</span>
                <span className="text-cyan-200">Readiness {Math.round(readiness)}</span>
              </div>
            </div>
          ))}
        </div>
        </div>
        ) : null}
      </div>

      {/* Foundation */}
      <div className="space-y-3">
        <h3 className="text-green-300 text-sm font-bold uppercase tracking-widest">Foundation Paths</h3>
        <p className="text-gray-300 text-sm">Where every legend begins</p>
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

      <div className="flex items-center justify-center gap-2 text-gray-400">
        <div className="flex-1 border-t border-dashed border-gray-500" />
        <span className="text-sm">paths combine into</span>
        <div className="flex-1 border-t border-dashed border-gray-500" />
      </div>

      {/* Specialist */}
      <div className="space-y-3">
        <h3 className="text-blue-300 text-sm font-bold uppercase tracking-widest">Specialist Paths</h3>
        <p className="text-gray-300 text-sm">Forge your identity</p>
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

      <div className="flex items-center justify-center gap-2 text-gray-400">
        <div className="flex-1 border-t border-dashed border-gray-500" />
        <span className="text-sm">paths combine into</span>
        <div className="flex-1 border-t border-dashed border-gray-500" />
      </div>

      {/* Mastery */}
      <div className="space-y-3">
        <h3 className="text-purple-300 text-sm font-bold uppercase tracking-widest">Mastery Paths</h3>
        <p className="text-gray-300 text-sm">Become the legend</p>
        <div className="grid grid-cols-1 gap-3">
          {tier3.map((evo) => (
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
