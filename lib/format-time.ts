/**
 * 글·댓글·제안 올린 시각 — KST 상대/절대.
 * 스펙: content-rules.md
 */

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const WEEKDAYS = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
] as const;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function kstParts(d: Date) {
  const kst = new Date(d.getTime() + KST_OFFSET_MS);
  return {
    y: kst.getUTCFullYear(),
    m: kst.getUTCMonth() + 1,
    day: kst.getUTCDate(),
    h: kst.getUTCHours(),
    min: kst.getUTCMinutes(),
    weekday: kst.getUTCDay(),
  };
}

/** 전장 몰입용 — 「N회 전투」위. 실제 오늘(KST) */
export function formatKstTodayImmersion(now: Date = new Date()): string {
  const p = kstParts(now);
  return `${p.m}월 ${p.day}일 ${WEEKDAYS[p.weekday]}`;
}

function formatClockKst(h: number, min: number): string {
  const period = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${period} ${h12}:${pad2(min)}`;
}

/**
 * 상대 → 당일 절대 → 지난날 절대.
 * 예: 방금 · 3분 전 · 오후 2:31 · 10.14 14:31
 */
export function formatPostTimeKst(
  createdAtUtc: string | Date | null | undefined,
  now: Date = new Date(),
): string {
  if (!createdAtUtc) return "";
  const created =
    typeof createdAtUtc === "string"
      ? new Date(createdAtUtc)
      : createdAtUtc;
  if (Number.isNaN(created.getTime())) return "";

  const diffMs = now.getTime() - created.getTime();
  if (diffMs < 0) {
    const p = kstParts(created);
    return `${p.m}.${p.day} ${pad2(p.h)}:${pad2(p.min)}`;
  }
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "방금";
  if (diffMin < 60) return `${diffMin}분 전`;

  const nowP = kstParts(now);
  const cP = kstParts(created);
  const sameDay =
    nowP.y === cP.y && nowP.m === cP.m && nowP.day === cP.day;

  if (sameDay) {
    return formatClockKst(cP.h, cP.min);
  }

  /** 같은 해면 M.D, 아니면 YY.M.D */
  if (nowP.y === cP.y) {
    return `${cP.m}.${cP.day} ${pad2(cP.h)}:${pad2(cP.min)}`;
  }
  return `${String(cP.y).slice(2)}.${cP.m}.${cP.day} ${pad2(cP.h)}:${pad2(cP.min)}`;
}
