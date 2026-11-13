import type { BattleDay } from "./types";

/** 체험판 — 오늘 제 1회부터. 과거 대형 회차 목 데이터 없음 */
export const BATTLE_HISTORY: BattleDay[] = [];

export const BATTLE_YEAR = 2026;
export const BATTLE_MONTH = 11;

export function battleByDate(
  date: string,
  _now?: Date,
): BattleDay | undefined {
  return BATTLE_HISTORY.find((b) => b.date === date);
}

/** 달력용 히스토리 (목) */
export function getBattleHistory(_now?: Date): BattleDay[] {
  return BATTLE_HISTORY;
}

/** 달력 표시 연·월 — KST 기준 현재 월 */
export function battleMonth(now: Date = new Date()): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
  }).formatToParts(now);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return { year: Number(map.year), month: Number(map.month) };
}
