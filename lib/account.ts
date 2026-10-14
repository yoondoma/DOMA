/**
 * 가입·탈퇴 목업 — 스펙: account-trust.md
 * 오픈 가입 · 만 14+ · 탈퇴 후 7일 재가입 쿨다운
 */

export const LEAVE_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

const LEAVE_KEY = "doma.leave.v1";

export type LeaveMap = Record<string, string>; // socialId → leftAtUtc

export function socialIdForHandle(handle: string): string {
  return `kakao:${handle.replace(/^@/, "").toLowerCase()}`;
}

export function loadLeaveMap(): LeaveMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LEAVE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as LeaveMap;
  } catch {
    return {};
  }
}

export function recordLeave(socialId: string, at: Date = new Date()): void {
  if (typeof window === "undefined") return;
  const map = loadLeaveMap();
  map[socialId] = at.toISOString();
  try {
    window.localStorage.setItem(LEAVE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function clearLeave(socialId: string): void {
  if (typeof window === "undefined") return;
  const map = loadLeaveMap();
  delete map[socialId];
  try {
    window.localStorage.setItem(LEAVE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export type RejoinCheck =
  | { ok: true }
  | { ok: false; leftAtUtc: string; untilUtc: string; message: string };

/** 탈퇴 후 7일 이내 재가입 불가 */
export function checkRejoin(
  socialId: string,
  now: Date = new Date(),
): RejoinCheck {
  const leftAtUtc = loadLeaveMap()[socialId];
  if (!leftAtUtc) return { ok: true };
  const left = new Date(leftAtUtc).getTime();
  const until = left + LEAVE_COOLDOWN_MS;
  if (now.getTime() >= until) return { ok: true };
  return {
    ok: false,
    leftAtUtc,
    untilUtc: new Date(until).toISOString(),
    message: "일주일 후 재가입 가능",
  };
}

/** 만 14세 이상 — 생년 기준 (연말 단순화) */
export function isAge14Plus(
  birthYear: number,
  now: Date = new Date(),
): boolean {
  if (!Number.isFinite(birthYear) || birthYear < 1900) return false;
  const age = now.getFullYear() - birthYear;
  return age >= 14;
}

export function normalizeHandle(raw: string): string {
  return raw
    .trim()
    .replace(/^@/, "")
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, 24);
}
