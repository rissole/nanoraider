import { AP_UPGRADES } from "../../data/evolutions";
import { useGameStore } from "../../store/gameStore";

export function UpgradesScreen() {
  const { meta, spendAP, goTo } = useGameStore();

  return (
    <div className="min-h-screen p-4 max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-yellow-400 font-bold text-xl">Upgrades</h2>
          <p className="text-gray-400 text-sm">Spend Achievement Points on permanent bonuses</p>
        </div>
        <button
          className="text-gray-400 hover:text-gray-200 text-sm"
          onClick={() => { goTo("main_menu"); }}
        >
          ← Back
        </button>
      </div>

      {/* AP balance */}
      <div className="bg-gray-900 border border-blue-800 rounded-lg p-4 text-center">
        <div className="text-blue-400 font-bold text-3xl">{meta.achievementPoints}</div>
        <div className="text-gray-400 text-sm">Achievement Points Available</div>
        <div className="text-gray-500 text-xs mt-1">Earned by completing runs and unlocking legacy paths</div>
      </div>

      {/* Current max energy */}
      <div className="bg-gray-900 border border-yellow-800 rounded-lg p-4 text-center">
        <div className="text-yellow-400 font-bold text-3xl">⚡ {meta.maxEnergy}</div>
        <div className="text-gray-400 text-sm">Current Max Energy</div>
        <div className="text-gray-500 text-xs mt-1">Base 50 + {meta.totalRuns * 5} run bonuses + legacy path bonuses + AP upgrades</div>
      </div>

      {/* Upgrades list */}
      <div className="space-y-3">
        {AP_UPGRADES.map((upgrade) => {
          const purchaseCount = meta.apUpgrades.filter((id) => id === upgrade.id).length;
          const canBuy = meta.achievementPoints >= upgrade.cost && purchaseCount < upgrade.maxPurchases;
          const maxedOut = purchaseCount >= upgrade.maxPurchases;

          return (
            <div
              className={`bg-gray-900 border rounded-lg p-4 space-y-3 ${maxedOut ? "border-gray-800 opacity-60" : "border-gray-700"}`}
              key={upgrade.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold">{upgrade.name}</h3>
                    {purchaseCount > 0 && (
                      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">
                        {purchaseCount}/{upgrade.maxPurchases}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{upgrade.description}</p>
                </div>
                <button
                  className="bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold text-sm px-4 py-2 rounded transition-colors shrink-0"
                  disabled={!canBuy}
                  onClick={() => { spendAP(upgrade.id); }}
                >
                  {maxedOut ? "Max" : `${upgrade.cost} AP`}
                </button>
              </div>
              {!maxedOut && (
                <div className="h-1.5 bg-gray-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${(purchaseCount / upgrade.maxPurchases) * 100}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
