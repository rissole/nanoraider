import { useGameStore } from "../../store/gameStore";
import { ACTIVITIES } from "../../data/activities";

const RARITY_COLOR: Record<string, string> = {
  gray: "text-gray-400",
  green: "text-green-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
};

function formatSignedGold(value: number): string {
  return `${value >= 0 ? "+" : ""}${value}g`;
}

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
      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-blue-400 font-bold text-xl">+{results.totalXp}</div>
          <div className="text-gray-400 text-xs">XP</div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className={`font-bold text-xl ${results.totalGold >= 0 ? "text-yellow-400" : "text-red-300"}`}>
            {formatSignedGold(results.totalGold)}
          </div>
          <div className="text-gray-400 text-xs">Gold (Net)</div>
          {results.totalGoldSpent > 0 && <div className="text-red-300 text-[10px] mt-1">-{results.totalGoldSpent}g spent</div>}
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-purple-400 font-bold text-xl">{results.lootObtained.length}</div>
          <div className="text-gray-400 text-xs">Items</div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-indigo-400 font-bold text-xl">{results.eventsResolved.length}</div>
          <div className="text-gray-400 text-xs">Events</div>
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
        <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest">Action Log</h3>
        {results.activitiesResolved.map((r, i) => {
          const def = ACTIVITIES[r.activityId];
          return (
            <div className="flex items-center justify-between text-sm" key={i}>
              <span className="text-gray-300">{def.name}</span>
              <div className="flex gap-3 text-xs">
                {def.deathRisk > 0 && <span className="text-red-300">Risk {Math.round(r.effectiveDeathRisk * 100)}%</span>}
                {r.xpGained > 0 && <span className="text-blue-400">+{r.xpGained} XP</span>}
                {r.goldGained > 0 && <span className="text-yellow-400">+{r.goldGained}g</span>}
                {r.goldSpent > 0 && <span className="text-red-300">-{r.goldSpent}g</span>}
                {r.lootDropped.length > 0 && (
                  <span className="text-purple-400">+{r.lootDropped.length} item{r.lootDropped.length !== 1 ? "s" : ""}</span>
                )}
              </div>
            </div>
          );
        })}
        {results.eventsResolved.map((event, i) => (
          <div className="flex items-center justify-between text-sm border-t border-gray-800 pt-2" key={`${event.eventId}-${i}`}>
            <span className="text-indigo-300">Event: {event.eventId}</span>
            <div className="flex gap-3 text-xs">
              {event.xpGained > 0 && <span className="text-blue-400">+{event.xpGained} XP</span>}
              {event.goldGained > 0 && <span className="text-yellow-400">+{event.goldGained}g</span>}
            </div>
          </div>
        ))}
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

function PersonalityHint({
  personality,
}: {
  personality: {
    combatStyle: number;
    socialStyle: number;
    economicFocus: number;
    exploration: number;
    preparation: number;
    ambition: number;
  };
}) {
  const dominant = Object.entries(personality).sort(([, a], [, b]) => b - a)[0];
  if (dominant === undefined || dominant[1] === 0) {
    return <p className="text-gray-500 text-xs italic">Your hero is still finding their path…</p>;
  }

  const hints: Record<string, string> = {
    combatStyle: "Your hero leans into high-risk combat decisions…",
    socialStyle: "Your hero is becoming increasingly social and influential…",
    economicFocus: "Your hero has a strong instinct for profit and trade…",
    exploration: "Your hero is drawn toward wandering and discovery…",
    preparation: "Your hero prefers methodical preparation before action…",
    ambition: "Your hero is chasing bigger glory and harder challenges…",
  };

  return <p className="text-gray-400 text-xs italic">{hints[dominant[0]] ?? "Your hero is evolving…"}</p>;
}
