import { useEffect, useState } from "react";
import { RAID_GATE_LABELS, TOWNSPERSON_LIST, TOWNSPEOPLE, AP_UPGRADES } from "../../data/townspeople";
import type { RaidGate, TownspersonBonuses, TownspersonRoleId } from "../../data/types";
import { useGameStore } from "../../store/gameStore";

const META_EXPANDED_STORAGE_KEY = "nanoraider-collection-meta-expanded";

const RAID_GATE_COLORS: Record<RaidGate, string> = {
  none: "border-green-500 bg-green-900/80",
  molten_fury: "border-orange-500 bg-orange-900/80",
  eternal_throne: "border-purple-500 bg-purple-900/80",
};

const RAID_GATE_BADGE: Record<RaidGate, string> = {
  none: "bg-green-600 text-green-100",
  molten_fury: "bg-orange-600 text-orange-100",
  eternal_throne: "bg-purple-600 text-purple-100",
};

const RAID_GATE_ORDER: RaidGate[] = ["none", "molten_fury", "eternal_throne"];

function formatBonusTeaser(bonuses: TownspersonBonuses): string[] {
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

interface TownspersonCardProps {
  roleId: TownspersonRoleId;
  filledHero: { heroName: string; level: number; dayReached: number } | null;
}

function TownspersonCard({ roleId, filledHero }: TownspersonCardProps) {
  const role = TOWNSPEOPLE[roleId];
  const gateBorder = RAID_GATE_COLORS[role.raidGate];
  const gateBadge = RAID_GATE_BADGE[role.raidGate];
  const gateLabel = RAID_GATE_LABELS[role.raidGate];
  const unlocked = filledHero !== null;

  if (!unlocked) {
    return (
      <div className={`border-2 rounded-lg p-4 space-y-2 ${gateBorder} opacity-75`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded font-bold ${gateBadge}`}>{gateLabel}</span>
          <span className="text-gray-400 text-xs font-medium">VACANT</span>
        </div>
        <div className="text-center py-2">
          <div className="text-4xl text-gray-400">?</div>
          <div className="text-white font-bold mt-1">{role.name}</div>
        </div>
        <p className="text-gray-300 text-sm italic">{role.hint}</p>
        <div className="text-amber-400 text-sm">
          <div className="text-amber-300/80 text-xs font-bold uppercase tracking-widest mb-1">Grants</div>
          <ul className="list-disc list-inside space-y-0.5">
            {formatBonusTeaser(role.bonuses).map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-lg p-4 space-y-2 ${gateBorder}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded font-bold ${gateBadge}`}>{gateLabel}</span>
        <span className="text-green-300 text-xs font-bold">✓ RESIDENT</span>
      </div>
      <div>
        <h3 className="text-white font-bold text-lg">{role.name}</h3>
        <div className="text-yellow-300 text-sm font-bold">{filledHero.heroName}</div>
        <div className="text-gray-400 text-xs">Lv {filledHero.level} · Day {filledHero.dayReached}</div>
        <p className="text-gray-200 text-sm mt-1">{role.description}</p>
      </div>
      <p className="text-gray-300 text-sm italic border-t border-gray-600 pt-2">{role.lore}</p>
      <div className="space-y-1 text-sm">
        <div className="text-gray-400 uppercase tracking-widest font-bold">Bonuses</div>
        <div className="text-green-300">+{role.bonuses.energyBonus} max energy</div>
        {(role.bonuses.startGold ?? 0) > 0 && <div className="text-yellow-300">+{role.bonuses.startGold}g start gold</div>}
        {(role.bonuses.combatBonus ?? 0) > 0 && <div className="text-red-300">+{Math.round((role.bonuses.combatBonus ?? 0) * 100)}% combat</div>}
        {(role.bonuses.knowledgeTransferMultiplier ?? 1) > 1 && <div className="text-cyan-300">{role.bonuses.knowledgeTransferMultiplier}x study gains</div>}
        {(role.bonuses.bossReadinessBonus ?? 0) > 0 && <div className="text-blue-300">+{Math.round((role.bonuses.bossReadinessBonus ?? 0) * 100)}% boss readiness</div>}
        {(role.bonuses.vendorDiscountPct ?? 0) > 0 && <div className="text-amber-300">+{Math.round((role.bonuses.vendorDiscountPct ?? 0) * 100)}% vendor discount</div>}
        {(role.bonuses.recipeDiscountPct ?? 0) > 0 && <div className="text-orange-300">+{Math.round((role.bonuses.recipeDiscountPct ?? 0) * 100)}% recipe discount</div>}
        {(role.bonuses.purpleCraftStatBonusPct ?? 0) > 0 && <div className="text-purple-300">+{Math.round((role.bonuses.purpleCraftStatBonusPct ?? 0) * 100)}% purple craft</div>}
        {(role.bonuses.brokerTierStart ?? 1) > 1 && <div className="text-sky-300">Broker tier {role.bonuses.brokerTierStart} start</div>}
        {role.bonuses.raidProvisionerUnlocked === true ? <div className="text-violet-300">Raid Provisioner unlocked</div> : null}
      </div>
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

  useEffect(() => {
    localStorage.setItem(META_EXPANDED_STORAGE_KEY, String(metaExpanded));
  }, [metaExpanded]);

  const toggleMeta = () => {
    setMetaExpanded((prev) => !prev);
  };

  const filledMap = new Map(meta.townspeople.map((t) => [t.roleId, t.hero]));
  const unlockedCount = meta.townspeople.length;
  const totalCount = TOWNSPERSON_LIST.length;

  const apUpgradeCounts = AP_UPGRADES.map((upgrade) => ({
    name: upgrade.name,
    purchased: meta.apUpgrades.filter((id) => id === upgrade.id).length,
    maxPurchases: upgrade.maxPurchases,
  }));
  const bossReadinessRows = Object.entries(meta.bossReadinessBank);

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-yellow-300 font-bold text-xl">The Outpost</h2>
          <p className="text-gray-300 text-sm">Heroes who survived and joined your cause</p>
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
          <span className="text-gray-200 font-bold">Outpost Progress</span>
          <span className="text-yellow-300 font-bold">{unlockedCount} / {totalCount} Residents</span>
        </div>
        <div className="h-3 bg-gray-700 rounded overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-400" style={{ width: `${(unlockedCount / totalCount) * 100}%` }} />
        </div>
        <div className="flex gap-4 text-sm text-gray-300">
          {RAID_GATE_ORDER.map((gate) => {
            const rolesInGate = TOWNSPERSON_LIST.filter((r) => r.raidGate === gate);
            const filled = rolesInGate.filter((r) => filledMap.has(r.id)).length;
            const colors: Record<RaidGate, string> = {
              none: "text-green-300",
              molten_fury: "text-orange-300",
              eternal_throne: "text-purple-300",
            };
            return (
              <span className={colors[gate]} key={gate}>
                {filled}/{rolesInGate.length} {RAID_GATE_LABELS[gate]}
              </span>
            );
          })}
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
                <div className="text-gray-400 text-xs">Outpost Residents</div>
                <div className="text-yellow-200 font-bold">{meta.townspeople.length}</div>
              </div>
            </div>

            <div className="space-y-1 text-sm border-t border-gray-600 pt-3">
              <div className="text-gray-400 uppercase tracking-widest font-bold">Stacked Bonuses</div>
              <div className="text-green-200">Energy Bonus: +{meta.townspersonBonuses.energyBonus}</div>
              <div className="text-yellow-200">Start Gold: +{meta.townspersonBonuses.startGold ?? 0}g</div>
              <div className="text-red-200">Combat Bonus: +{Math.round((meta.townspersonBonuses.combatBonus ?? 0) * 100)}%</div>
              <div className="text-cyan-200">Knowledge Transfer: {meta.townspersonBonuses.knowledgeTransferMultiplier ?? 1}x</div>
              <div className="text-blue-200">Boss Readiness Bonus: +{Math.round((meta.townspersonBonuses.bossReadinessBonus ?? 0) * 100)}%</div>
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

      {/* Residents grouped by raid gate */}
      {RAID_GATE_ORDER.map((gate) => {
        const rolesInGate = TOWNSPERSON_LIST.filter((r) => r.raidGate === gate);
        const sectionColors: Record<RaidGate, string> = {
          none: "text-green-300",
          molten_fury: "text-orange-300",
          eternal_throne: "text-purple-300",
        };
        const sectionDesc: Record<RaidGate, string> = {
          none: "Earned on any run",
          molten_fury: "Requires defeating Molten Fury",
          eternal_throne: "Requires defeating the Eternal Throne",
        };

        return (
          <div className="space-y-3" key={gate}>
            <div>
              <h3 className={`${sectionColors[gate]} text-sm font-bold uppercase tracking-widest`}>{RAID_GATE_LABELS[gate]}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{sectionDesc[gate]}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rolesInGate.map((role) => {
                const filled = filledMap.get(role.id) ?? null;
                return (
                  <TownspersonCard
                    filledHero={filled}
                    key={role.id}
                    roleId={role.id}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
