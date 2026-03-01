import { useGameStore } from "../../store/gameStore";
import { EVOLUTION_LIST } from "../../data/evolutions";

export function MainMenu() {
  const { meta, hero, goTo, startHeroCreation } = useGameStore();
  const unlockedCount = meta.unlockedEvolutions.length;
  const totalEvolutions = EVOLUTION_LIST.length;
  const resetGame = () => {
    const confirmed = window.confirm("Reset all progress? This will clear all local save data.");
    if (!confirmed) {
      return;
    }
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-yellow-400 tracking-widest">NANO RAIDER</h1>
        <p className="text-gray-400 text-sm">Forge your legacy path. Collect them all.</p>
      </div>

      {/* Meta stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-yellow-400 font-bold text-2xl">{meta.maxEnergy}</div>
          <div className="text-gray-400 text-xs">Max Energy</div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-purple-400 font-bold text-2xl">{unlockedCount}/{totalEvolutions}</div>
          <div className="text-gray-400 text-xs">Legacy Paths</div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-blue-400 font-bold text-2xl">{meta.totalRuns}</div>
          <div className="text-gray-400 text-xs">Total Runs</div>
        </div>
      </div>

      {/* Active bonuses */}
      {unlockedCount > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-full max-w-md">
          <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-2">Active Legacy Bonuses</h3>
          <div className="space-y-1 text-sm">
            {(meta.evolutionBonuses.combatBonus ?? 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Combat Bonus</span>
                <span className="text-green-400 font-bold">+{Math.round((meta.evolutionBonuses.combatBonus ?? 0) * 100)}%</span>
              </div>
            )}
            {(meta.evolutionBonuses.startGold ?? 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Starting Gold</span>
                <span className="text-yellow-400 font-bold">+{meta.evolutionBonuses.startGold}g</span>
              </div>
            )}
            {(meta.evolutionBonuses.knowledgeTransferMultiplier ?? 1) > 1 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Study Multiplier</span>
                <span className="text-cyan-400 font-bold">{meta.evolutionBonuses.knowledgeTransferMultiplier}x</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {hero !== null && (
          <button
            className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors border border-green-500"
            onClick={() => { goTo("planning"); }}
          >
            ▶ Continue — {hero.name} (Day {hero.inGameDay})
          </button>
        )}
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          onClick={startHeroCreation}
        >
          ⚔ New Hero
        </button>
        <button
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-3 px-6 rounded-lg transition-colors border border-gray-600"
          onClick={() => { goTo("collection"); }}
        >
          ◈ Legacy Paths ({unlockedCount}/{totalEvolutions})
        </button>
        <button
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-3 px-6 rounded-lg transition-colors border border-gray-600"
          onClick={() => { goTo("upgrades"); }}
        >
          ✦ Upgrades · {meta.achievementPoints} AP
        </button>
        <button
          className="bg-red-900 hover:bg-red-800 text-red-100 font-bold py-3 px-6 rounded-lg transition-colors border border-red-700"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>

      <p className="text-gray-600 text-xs text-center">
        Progress saves automatically in your browser.
      </p>
    </div>
  );
}
