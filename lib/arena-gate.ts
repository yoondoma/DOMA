import type { TimelineClock, TimeState } from "@/lib/types/domain";

/**
 * 전장 셧다운 — 23:00~08:00 KST
 * TimeState LOCKED / COOLDOWN 과 동일. 목업 `?shutdown=1`
 */
export function isShutdownState(state: TimeState): boolean {
  return state === "LOCKED" || state === "COOLDOWN";
}

export function isArenaShutdown(
  clock: Pick<TimelineClock, "state">,
  forceQuery?: boolean | null,
): boolean {
  if (forceQuery) return true;
  return isShutdownState(clock.state);
}

export const SHUTDOWN_TOAST = "전장 셧다운 (23:00–08:00)";
