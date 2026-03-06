import type { ActivityId, BossId } from "../data/types";

const RAID_ACTIVITY_TO_BOSS: Partial<Record<ActivityId, BossId>> = {
  raid_molten_fury: "molten_fury",
  raid_eternal_throne: "eternal_throne",
};

export function bossForRaidActivity(activityId: ActivityId): BossId | null {
  return RAID_ACTIVITY_TO_BOSS[activityId] ?? null;
}

export function isLethalActivity(activityId: ActivityId): boolean {
  return bossForRaidActivity(activityId) !== null;
}
