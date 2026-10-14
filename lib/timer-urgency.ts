import { kstParts } from "@/lib/kst";

/**
 * 판결 타이머 압박 단계 — 스펙: battle-rules
 * 3h / 1h / 30m / 10m / 5m / 1m
 */

export type UrgencyStage = "3h" | "1h" | "30m" | "10m" | "5m" | "1m";

/** 최종 디렉션 — Pulse는 22:00~ / 22:50–23:00 가속 */
export type TimerPulse = "off" | "breathe" | "rush";

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

/**
 * 압박 단계 보조 라벨 (숫자 스타일용).
 * 타이머 **위** 상시 문구는 `timerPhaseLabel` — 정책: 전투 시작/종료까지.
 */
export function urgencyLabel(
  stage: UrgencyStage | null,
  calm = "전투 종료까지",
): string {
  if (!stage) return calm;
  return STAGES.find((s) => s.id === stage)?.label ?? calm;
}

export type TimerPhase = "before" | "during" | "after";

/** KST TimeState → 타이머 위 상태 문구 */
export function timerPhaseLabel(
  state: "OPEN" | "CLOSING_SOON" | "LOCKED" | "COOLDOWN" | string,
): { phase: TimerPhase; label: string } {
  if (state === "COOLDOWN") {
    return { phase: "before", label: "전투 시작까지" };
  }
  if (state === "LOCKED") {
    return { phase: "after", label: "판결 확정" };
  }
  /** OPEN · CLOSING_SOON */
  return { phase: "during", label: "전투 종료까지" };
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

/**
 * KST 벽시계 Pulse.
 * - 평소: off (크림슨 숫자만)
 * - 22:00–22:49: breathe
 * - 22:50–22:59: rush
 * 목업: `?pulse=breathe|rush|off`
 */
export function timerPulseFromNow(now: Date = new Date()): TimerPulse {
  if (typeof window !== "undefined") {
    const q = new URLSearchParams(window.location.search).get("pulse");
    if (q === "breathe" || q === "1") return "breathe";
    if (q === "rush" || q === "fast") return "rush";
    if (q === "off" || q === "0") return "off";
  }
  const { h, min } = kstParts(now);
  if (h === 22 && min >= 50) return "rush";
  if (h === 22) return "breathe";
  return "off";
}

export function timerPulseClass(pulse: TimerPulse): string {
  if (pulse === "rush") return "timer-pulse-rush";
  if (pulse === "breathe") return "timer-pulse";
  return "";
}

/** intro(대) · sticky(소) — 디스플레이 세리프 · 웅장 · 크림슨 상시 */
export function timerUrgencyClass(
  _stage: UrgencyStage | null,
  size: "hero" | "sticky",
): string {
  return size === "hero"
    ? "timer-display"
    : "font-[family-name:var(--font-display)] text-[26px] font-bold tracking-[0.04em] tabular-nums leading-none sm:text-[28px]";
}
