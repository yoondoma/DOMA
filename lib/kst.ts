import type { DayId, TimeState, TimelineClock } from "@/lib/types/domain";

/** KST = UTC+9 */
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** KST 달력 부품 (UTC 메서드로 오프셋 보정) */
function kstParts(now: Date = new Date()) {
  const kst = new Date(now.getTime() + KST_OFFSET_MS);
  return {
    y: kst.getUTCFullYear(),
    m: kst.getUTCMonth(),
    d: kst.getUTCDate(),
    h: kst.getUTCHours(),
    min: kst.getUTCMinutes(),
    sec: kst.getUTCSeconds(),
  };
}

function kstWallToUtcIso(
  y: number,
  m: number,
  d: number,
  h: number,
  min = 0,
  sec = 0,
): string {
  const utcMs = Date.UTC(y, m, d, h, min, sec, 0) - KST_OFFSET_MS;
  return new Date(utcMs).toISOString();
}

function formatDayId(y: number, m: number, d: number): DayId {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}

/**
 * 전장 dayId = OPEN된 KST 날짜.
 * 00:00~07:59(COOLDOWN)에는 어제 전장을 가리킨다.
 */
export function arenaDayId(now: Date = new Date()): DayId {
  const { y, m, d, h } = kstParts(now);
  if (h < 8) {
    const prev = new Date(Date.UTC(y, m, d - 1));
    return formatDayId(
      prev.getUTCFullYear(),
      prev.getUTCMonth(),
      prev.getUTCDate(),
    );
  }
  return formatDayId(y, m, d);
}

/** dayId의 다음 달력일 (후보 targetDayId 등) */
export function nextDayId(dayId: DayId): DayId {
  const [ys, ms, ds] = dayId.split("-").map(Number);
  const next = new Date(Date.UTC(ys, ms - 1, ds + 1));
  return formatDayId(
    next.getUTCFullYear(),
    next.getUTCMonth(),
    next.getUTCDate(),
  );
}

/** 당일 23:00:00 KST (마감) — dayId 기준 */
export function lockAtUtcForDay(dayId: DayId): string {
  const [ys, ms, ds] = dayId.split("-").map(Number);
  return kstWallToUtcIso(ys, ms - 1, ds, 23, 0, 0);
}

/**
 * 다음 안건 OPEN / 내일 주제 확정 시각 = 다음(또는 당일) 08:00:00 KST.
 * 08:00 이전이면 오늘 08:00, 이후면 내일 08:00.
 */
export function nextOpenAtKstIso(now: Date = new Date()): string {
  const { y, m, d, h } = kstParts(now);
  if (h >= 8) {
    const next = new Date(Date.UTC(y, m, d + 1));
    return kstWallToUtcIso(
      next.getUTCFullYear(),
      next.getUTCMonth(),
      next.getUTCDate(),
      8,
      0,
      0,
    );
  }
  return kstWallToUtcIso(y, m, d, 8, 0, 0);
}

/** 목 시계 — 서버 권위 흉내 (클라 now로 근사) */
export function resolveTimelineClock(now: Date = new Date()): TimelineClock {
  const dayId = arenaDayId(now);
  const { y, m, d, h, min } = kstParts(now);
  const minuteOfDay = h * 60 + min;
  const lockAtUtc = lockAtUtcForDay(dayId);
  const nextOpenAtUtc = nextOpenAtKstIso(now);
  const serverNowUtc = now.toISOString();
  const msUntilLock = Math.max(0, new Date(lockAtUtc).getTime() - now.getTime());

  let state: TimeState;
  let evaluating = false;
  let segmentEndsAtUtc: string;
  let goldenHour = false;

  if (h < 8) {
    state = "COOLDOWN";
    segmentEndsAtUtc = nextOpenAtUtc;
  } else if (minuteOfDay < 22 * 60 + 50) {
    state = "OPEN";
    segmentEndsAtUtc = kstWallToUtcIso(y, m, d, 22, 50, 0);
  } else if (minuteOfDay < 23 * 60) {
    state = "CLOSING_SOON";
    goldenHour = true;
    segmentEndsAtUtc = lockAtUtc;
  } else {
    state = "LOCKED";
    evaluating = minuteOfDay < 23 * 60 + 30;
    segmentEndsAtUtc = kstWallToUtcIso(
      new Date(Date.UTC(y, m, d + 1)).getUTCFullYear(),
      new Date(Date.UTC(y, m, d + 1)).getUTCMonth(),
      new Date(Date.UTC(y, m, d + 1)).getUTCDate(),
      0,
      0,
      0,
    );
  }

  return {
    serverNowUtc,
    timezone: "Asia/Seoul",
    dayId,
    state,
    evaluating,
    segmentEndsAtUtc,
    lockAtUtc,
    nextOpenAtUtc,
    msUntilLock,
    goldenHour,
  };
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
