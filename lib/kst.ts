/** KST = UTC+9 */
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * 다음 안건 OPEN / 내일 주제 확정 시각 = 다음(또는 당일) 08:00:00 KST.
 * 08:00 이전이면 오늘 08:00, 이후면 내일 08:00.
 */
export function nextOpenAtKstIso(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + KST_OFFSET_MS);
  let y = kst.getUTCFullYear();
  let m = kst.getUTCMonth();
  let d = kst.getUTCDate();
  const h = kst.getUTCHours();
  if (h >= 8) {
    const next = new Date(Date.UTC(y, m, d + 1));
    y = next.getUTCFullYear();
    m = next.getUTCMonth();
    d = next.getUTCDate();
  }
  const utcMs = Date.UTC(y, m, d, 8, 0, 0, 0) - KST_OFFSET_MS;
  return new Date(utcMs).toISOString();
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
