import type { BossId, BossKnowledgeProgress, Hero } from "../data/types";

export const BOSS_KNOWLEDGE_WEIGHTS = {
  intel: 0.4,
  drills: 0.3,
  execution: 0.3,
} as const;

function clampToKnowledgeRange(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function emptyBossKnowledge(): BossKnowledgeProgress {
  return { intel: 0, drills: 0, execution: 0 };
}

export function normalizeBossKnowledgeProgress(raw: unknown): BossKnowledgeProgress {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    // Save migration: old flat value is treated as inherited intel.
    return { intel: clampToKnowledgeRange(raw), drills: 0, execution: 0 };
  }
  if (typeof raw === "object" && raw !== null) {
    const value = raw as Partial<Record<keyof BossKnowledgeProgress, unknown>>;
    return {
      intel: clampToKnowledgeRange(typeof value.intel === "number" ? value.intel : 0),
      drills: clampToKnowledgeRange(typeof value.drills === "number" ? value.drills : 0),
      execution: clampToKnowledgeRange(typeof value.execution === "number" ? value.execution : 0),
    };
  }
  return emptyBossKnowledge();
}

export function normalizeBossKnowledgeBank(
  rawBank: unknown,
  trackedBosses: BossId[],
): Record<BossId, BossKnowledgeProgress> {
  const source = (typeof rawBank === "object" && rawBank !== null ? rawBank : {}) as Record<string, unknown>;
  return trackedBosses.reduce<Record<BossId, BossKnowledgeProgress>>((acc, bossId) => {
    acc[bossId] = normalizeBossKnowledgeProgress(source[bossId]);
    return acc;
  }, {} as Record<BossId, BossKnowledgeProgress>);
}

export function applyKnowledgeGain(
  current: BossKnowledgeProgress,
  channel: keyof BossKnowledgeProgress,
  amount: number,
): BossKnowledgeProgress {
  return { ...current, [channel]: clampToKnowledgeRange(current[channel] + amount) };
}

export function applyFlatStartingKnowledgeBonus(current: BossKnowledgeProgress, bonusPct: number): BossKnowledgeProgress {
  const bonus = bonusPct * 100;
  return {
    intel: clampToKnowledgeRange(current.intel + bonus),
    drills: clampToKnowledgeRange(current.drills + bonus),
    execution: clampToKnowledgeRange(current.execution + bonus),
  };
}

export function getBossReadinessFromProgress(progress: BossKnowledgeProgress): number {
  return clampToKnowledgeRange(
    progress.intel * BOSS_KNOWLEDGE_WEIGHTS.intel
      + progress.drills * BOSS_KNOWLEDGE_WEIGHTS.drills
      + progress.execution * BOSS_KNOWLEDGE_WEIGHTS.execution,
  );
}

export function getBossReadiness(hero: Hero, bossId: BossId): number {
  return getBossReadinessFromProgress(hero.secondary.bossKnowledge[bossId]);
}
