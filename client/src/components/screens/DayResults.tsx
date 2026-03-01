import { useGameStore } from "../../store/gameStore";
import { ACTIVITIES } from "../../data/activities";

const RARITY_COLOR: Record<string, string> = {
  gray: "text-gray-400",
  green: "text-green-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
};

export function DayResults() {
  const { hero, lastDayResults, goTo } = useGameStore();

  if (lastDayResults === null || hero === null) {
    goTo("planning");
    return null;
  }

  const results = lastDayResults;

  return (
    <div className="min-h-screen p-4 space-y-4 max-w-xl mx-auto">
      <div className="text-center">
        <h2 className="text-yellow-400 font-bold text-xl">Day {results.day} Complete</h2>
        <p className="text-gray-400 text-sm">Day {hero.inGameDay - 1} → Day {hero.inGameDay}</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-blue-400 font-bold text-xl">+{results.totalXp}</div>
          <div className="text-gray-400 text-xs">XP</div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-yellow-400 font-bold text-xl">+{results.totalGold}g</div>
          <div className="text-gray-400 text-xs">Gold</div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-purple-400 font-bold text-xl">{results.lootObtained.length}</div>
          <div className="text-gray-400 text-xs">Items</div>
        </div>
      </div>

      {/* Loot */}
      {results.lootObtained.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
          <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest">Loot Obtained</h3>
          {results.lootObtained.map((item, i) => (
            <div className="flex items-center justify-between" key={`${item.id}-${i}`}>
              <span className={`font-bold text-sm ${RARITY_COLOR[item.rarity] ?? "text-gray-400"}`}>{item.name}</span>
              <span className="text-gray-500 text-xs capitalize">{item.slot} · {item.itemPower} IP</span>
            </div>
          ))}
        </div>
      )}

      {/* Activity breakdown */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
        <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest">Activity Log</h3>
        {results.activitiesResolved.map((r, i) => {
          const def = ACTIVITIES[r.activityId];
          return (
            <div className="flex items-center justify-between text-sm" key={i}>
              <span className="text-gray-300">{def?.name ?? r.activityId}</span>
              <div className="flex gap-3 text-xs">
                {r.xpGained > 0 && <span className="text-blue-400">+{r.xpGained} XP</span>}
                {r.goldGained > 0 && <span className="text-yellow-400">+{r.goldGained}g</span>}
                {r.lootDropped.length > 0 && (
                  <span className="text-purple-400">+{r.lootDropped.length} item{r.lootDropped.length !== 1 ? "s" : ""}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Personality hint */}
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-center">
        <PersonalityHint personality={results.personalitySnapshot} />
      </div>

      <button
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg text-lg transition-colors"
        onClick={() => { goTo("planning"); }}
      >
        Plan Day {hero.inGameDay} →
      </button>
    </div>
  );
}

function PersonalityHint({ personality }: { personality: { aggression: number; wisdom: number; greed: number; patience: number; recklessness: number } }) {
  const dominant = Object.entries(personality).sort(([, a], [, b]) => b - a)[0];
  if (dominant === undefined || dominant[1] === 0) {
    return <p className="text-gray-500 text-xs italic">Your hero is still finding their path…</p>;
  }

  const hints: Record<string, string> = {
    aggression: "Your hero seems increasingly drawn to combat…",
    wisdom: "Your hero's thirst for knowledge grows stronger…",
    greed: "Your hero has a merchant's eye for opportunity…",
    patience: "Your hero prefers careful, methodical planning…",
    recklessness: "Your hero grows bolder, fearless in the face of danger…",
    cunning: "Your hero is developing a sharp tactical mind…",
  };

  return <p className="text-gray-400 text-xs italic">{hints[dominant[0]] ?? "Your hero is evolving…"}</p>;
}
