import { DAILY_EVENTS } from "../../data/nurture";
import { useGameStore } from "../../store/gameStore";

function formatEffects(choiceEffects: NonNullable<(typeof DAILY_EVENTS)[keyof typeof DAILY_EVENTS]["choices"][number]["effects"]>): string[] {
  const parts: string[] = [];
  if (choiceEffects.triangle !== undefined) {
    for (const [k, v] of Object.entries(choiceEffects.triangle)) {
      if (v !== 0) {
        parts.push(`${v > 0 ? "+" : ""}${v} ${k}`);
      }
    }
  }
  if (choiceEffects.renown !== undefined && choiceEffects.renown !== 0) {
    parts.push(`renown ${choiceEffects.renown > 0 ? "+" : ""}${choiceEffects.renown}`);
  }
  if (choiceEffects.daring !== undefined && choiceEffects.daring !== 0) {
    parts.push(`daring ${choiceEffects.daring > 0 ? "+" : ""}${choiceEffects.daring}`);
  }
  if (choiceEffects.bossReadiness !== undefined) {
    for (const [k, v] of Object.entries(choiceEffects.bossReadiness)) {
      if (v !== 0) {
        parts.push(`${k} readiness ${v > 0 ? "+" : ""}${v}%`);
      }
    }
  }
  return parts;
}

export function DailyEventScreen() {
  const { pendingEvent, resolvePendingEvent } = useGameStore();
  if (pendingEvent === null) {
    return null;
  }

  const eventDef = DAILY_EVENTS[pendingEvent.eventId];

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
        <div>
          <p className="text-xs text-yellow-400 font-bold uppercase tracking-widest">Random Event</p>
          <h2 className="text-2xl font-bold text-white mt-1">{eventDef.title}</h2>
          <p className="text-gray-400 text-sm mt-2">{eventDef.description}</p>
        </div>

        <div className="space-y-3">
          {eventDef.choices.map((choice) => {
            const effects = formatEffects(choice.effects);
            return (
              <button
                className="w-full text-left bg-gray-800 border border-gray-700 hover:border-yellow-500 rounded-lg p-4 transition-colors"
                key={choice.id}
                onClick={() => { resolvePendingEvent(choice.id); }}
              >
                <div className="text-white font-bold">{choice.label}</div>
                <div className="text-gray-400 text-sm mt-1">{choice.description}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {effects.map((effect) => (
                    <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-200" key={effect}>
                      {effect}
                    </span>
                  ))}
                  {(choice.xpGain ?? 0) > 0 && (
                    <span className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-200">+{choice.xpGain} XP</span>
                  )}
                  {(choice.goldGain ?? 0) > 0 && (
                    <span className="text-xs px-2 py-1 rounded bg-yellow-900 text-yellow-200">+{choice.goldGain}g</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
