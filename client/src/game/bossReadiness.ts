import type { BossId, Hero } from "../data/types";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function normalizeBossReadinessBank(rawBank: unknown, trackedBosses: BossId[]): Record<BossId, number> {
  const source = (typeof rawBank === "object" && rawBank !== null ? rawBank : {}) as Record<string, unknown>;
  return trackedBosses.reduce<Record<BossId, number>>((acc, bossId) => {
    const value = source[bossId];
    acc[bossId] = typeof value === "number" && Number.isFinite(value) ? clamp(value) : 0;
    return acc;
  }, {} as Record<BossId, number>);
}

export function applyReadinessGain(current: number, amount: number): number {
  return clamp(current + amount);
}

export function applyFlatStartingReadinessBonus(current: number, bonusPct: number): number {
  return clamp(current + bonusPct * 100);
}

export function getBossReadiness(hero: Hero, bossId: BossId): number {
  return clamp(hero.bossReadiness[bossId]);
}
