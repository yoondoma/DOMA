/**
 * 지난 판결 오프라인 저장 목업 — 유튜브 오프라인식.
 * localStorage · SDK/백엔드 없음. 스펙: project-context H
 */

import type { BattleDay } from "@/lib/types";

const VERDICT_KEY = "doma.offlineVerdicts.v1";
const SIM_KEY = "doma.offlineSim.v1";
export const OFFLINE_VERDICT_EVENT = "doma:offline-verdicts";
export const OFFLINE_SIM_EVENT = "doma:offline-sim";

export type SavedVerdict = BattleDay & {
  savedAtUtc: string;
};

function readMap(): Record<string, SavedVerdict> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(VERDICT_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, SavedVerdict>;
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, SavedVerdict>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VERDICT_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent(OFFLINE_VERDICT_EVENT));
  } catch {
    /* ignore */
  }
}

export function listSavedVerdicts(): SavedVerdict[] {
  return Object.values(readMap()).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function isVerdictSaved(date: string): boolean {
  return Boolean(readMap()[date]);
}

export function getSavedVerdict(date: string): SavedVerdict | null {
  return readMap()[date] ?? null;
}

export function saveVerdict(battle: BattleDay): SavedVerdict {
  const map = readMap();
  const next: SavedVerdict = {
    ...battle,
    savedAtUtc: new Date().toISOString(),
  };
  map[battle.date] = next;
  writeMap(map);
  return next;
}

export function removeVerdict(date: string): void {
  const map = readMap();
  delete map[date];
  writeMap(map);
}

export function toggleVerdictSaved(battle: BattleDay): boolean {
  if (isVerdictSaved(battle.date)) {
    removeVerdict(battle.date);
    return false;
  }
  saveVerdict(battle);
  return true;
}

/** 오프라인 시뮬레이션 — 저장된 판결만 상세 열기 */
export function loadOfflineSim(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SIM_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveOfflineSim(enabled: boolean): boolean {
  if (typeof window === "undefined") return enabled;
  try {
    window.localStorage.setItem(SIM_KEY, enabled ? "1" : "0");
    window.dispatchEvent(
      new CustomEvent(OFFLINE_SIM_EVENT, { detail: { enabled } }),
    );
  } catch {
    /* ignore */
  }
  return enabled;
}
