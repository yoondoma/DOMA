/**
 * 판결 타이머 압박 단계 — 스펙: battle-rules
 * 3h / 1h / 30m / 10m / 5m / 1m
 */

export type UrgencyStage = "3h" | "1h" | "30m" | "10m" | "5m" | "1m";

/** 남은 시간 ≤ 임계 → 해당 단계 (짧은 쪽 우선) */
const STAGES: { id: UrgencyStage; ms: number; label: string }[] = [
  { id: "1m", ms: 60_000, label: "최후 1분" },
  { id: "5m", ms: 5 * 60_000, label: "최후 5분" },
  { id: "10m", ms: 10 * 60_000, label: "판결 임박" },
  { id: "30m", ms: 30 * 60_000, label: "판결 임박" },
  { id: "1h", ms: 60 * 60_000, label: "한 시간 전" },
  { id: "3h", ms: 3 * 60 * 60_000, label: "세 시간 전" },
];

/** `?closing=` 목업 — 단계 키 또는 초 단위 숫자 */
const MOCK_REMAINING_MS: Record<string, number> = {
  "1m": 48_000,
  "5m": 3 * 60_000 + 20_000,
  "10m": 7 * 60_000 + 30_000,
  "30m": 22 * 60_000,
  "1h": 48 * 60_000,
  "3h": 2 * 60 * 60_000 + 15 * 60_000,
  "1": 7 * 60_000 + 30_000,
  soon: 7 * 60_000 + 30_000,
};

export function urgencyFromRemainingMs(ms: number): UrgencyStage | null {
  if (ms <= 0) return "1m";
  for (const s of STAGES) {
    if (ms <= s.ms) return s.id;
  }
  return null;
}

export function urgencyLabel(stage: UrgencyStage | null, calm = "최후의 판결까지"): string {
  if (!stage) return calm;
  return STAGES.find((s) => s.id === stage)?.label ?? calm;
}

/**
 * URL `?closing=` 파싱.
 * - `3h` / `1h` / `30m` / `10m` / `5m` / `1m` / `1` / `soon`
 * - 숫자만: 초 단위 remaining (`?closing=90`)
 */
export function parseClosingQuery(
  raw: string | null,
): { remainingMs: number; stage: UrgencyStage | null } | null {
  if (raw == null || raw === "") return null;
  const key = raw.trim().toLowerCase();
  if (key in MOCK_REMAINING_MS) {
    const remainingMs = MOCK_REMAINING_MS[key]!;
    return { remainingMs, stage: urgencyFromRemainingMs(remainingMs) };
  }
  if (/^\d+$/.test(key)) {
    const remainingMs = Number(key) * 1000;
    return { remainingMs, stage: urgencyFromRemainingMs(remainingMs) };
  }
  return null;
}

export function formatCountdownMs(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/** intro(대) · sticky(소) 타이포 클래스 */
export function timerUrgencyClass(
  stage: UrgencyStage | null,
  size: "hero" | "sticky",
): string {
  if (!stage) {
    return size === "hero"
      ? "text-[32px] sm:text-[36px] tracking-[0.06em]"
      : "text-[22px] tracking-[0.04em]";
  }
  const map: Record<UrgencyStage, { hero: string; sticky: string }> = {
    "3h": {
      hero: "text-[34px] sm:text-[38px] tracking-[0.05em] timer-urgency-3h",
      sticky: "text-[23px] tracking-[0.04em] timer-urgency-3h",
    },
    "1h": {
      hero: "text-[36px] sm:text-[40px] tracking-[0.04em] timer-urgency-1h",
      sticky: "text-[24px] tracking-[0.03em] timer-urgency-1h",
    },
    "30m": {
      hero: "text-[38px] sm:text-[42px] tracking-[0.03em] timer-urgency-30m",
      sticky: "text-[26px] tracking-[0.02em] timer-urgency-30m",
    },
    "10m": {
      hero: "text-[40px] sm:text-[44px] tracking-[0.02em] timer-urgency-10m",
      sticky: "text-[28px] tracking-[0.02em] timer-urgency-10m",
    },
    "5m": {
      hero: "text-[44px] sm:text-[48px] tracking-[0.01em] timer-urgency-5m",
      sticky: "text-[30px] tracking-[0.01em] timer-urgency-5m",
    },
    "1m": {
      hero: "text-[48px] sm:text-[52px] tracking-tight timer-urgency-1m",
      sticky: "text-[34px] tracking-tight timer-urgency-1m",
    },
  };
  return map[stage][size];
}
