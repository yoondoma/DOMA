/**
 * DOMA 유저 티어·일일 칭호
 * 스펙: title-points-draft · locked-decisions
 *
 * 티어 = 시즌 승수 **비율 순위** (목업은 승수 임계로 사다리 표시)
 * 사다리: ARCHITECT → I → II → III → IV → BRONZE
 * 승 +1 / 패 0
 */

import type { Cosmetics } from "@/lib/types/cosmetics";

/** 매치 결과 → 시즌 승수 가감 */
export const POINT_RULES = {
  WIN: 1,
  LOSS: 0,
} as const;

export type MatchResult = "win" | "loss";

/** 승/패 한 판의 포인트 델타 */
export function pointDelta(result: MatchResult): number {
  return result === "win" ? POINT_RULES.WIN : POINT_RULES.LOSS;
}

/** 누적 score에 한 판 반영 */
export function applyMatchPoints(score: number, result: MatchResult): number {
  return score + pointDelta(result);
}

/**
 * 시즌 티어 (낮음 → 높음).
 * 로마 I~IV는 티어 코드 자체 (I가 IV보다 위).
 */
export const TIER_CODES = [
  "BRONZE",
  "IV",
  "III",
  "II",
  "I",
  "ARCHITECT",
] as const;

export type TierCode = (typeof TIER_CODES)[number];

/** @deprecated 로마가 티어 코드로 승격 — 뱃지 호환용 */
export const SUBTIERS = ["IV", "III", "II", "I"] as const;
export type Subtier = (typeof SUBTIERS)[number];

export type ScoreTierDef = {
  code: TierCode;
  /** 화면 라벨 */
  label: string;
  /** 목업: 시즌 승수 하한 (실서비스는 퍼센타일) */
  minScore: number;
  /** 정원 안내 */
  cut: string;
};

/** 목업 사다리 — 실서버는 퍼센타일 컷 */
export const SCORE_TIERS: readonly ScoreTierDef[] = [
  { code: "BRONZE", label: "BRONZE", minScore: 0, cut: "나머지" },
  { code: "IV", label: "IV", minScore: 8, cut: "상위 ~60%" },
  { code: "III", label: "III", minScore: 20, cut: "상위 ~35%" },
  { code: "II", label: "II", minScore: 40, cut: "상위 ~15%" },
  { code: "I", label: "I", minScore: 70, cut: "상위 ~5%" },
  { code: "ARCHITECT", label: "ARCHITECT", minScore: 100, cut: "상위 1%" },
] as const;

/** @deprecated SCORE_TIERS 사용 */
export const WIN_TIERS = SCORE_TIERS;

export type TierPlacement = {
  code: TierCode;
  label: string;
  /** 호환 — 새 사다리에서는 코드와 동일하거나 무시 */
  subtier: Subtier;
  /** 예: "II" · "ARCHITECT" */
  display: string;
  displayKo: string;
  minScore: number;
  nextTierAt: number | null;
  cut: string;
};

/** 시즌별 티어 기록 — 최종 + 최고 */
export type SeasonTierRecord = {
  seasonId: string;
  /** 예: 2026 Q4 */
  label: string;
  tierFinal: TierCode;
  tierPeak: TierCode;
  wins: number;
};

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, score);
}

function tierIndexForScore(score: number): number {
  const s = clampScore(score);
  let idx = 0;
  for (let i = 0; i < SCORE_TIERS.length; i++) {
    if (s >= SCORE_TIERS[i].minScore) idx = i;
  }
  return idx;
}

function placementFromDef(
  def: ScoreTierDef,
  next: ScoreTierDef | null,
): TierPlacement {
  const roman = def.code === "I" || def.code === "II" || def.code === "III" || def.code === "IV";
  return {
    code: def.code,
    label: def.label,
    subtier: roman ? (def.code as Subtier) : "I",
    display: def.code,
    displayKo: def.label,
    minScore: def.minScore,
    nextTierAt: next?.minScore ?? null,
    cut: def.cut,
  };
}

/** 시즌 승수(목) → 티어 사다리 */
export function resolveTierFromScore(score: number): TierPlacement {
  const idx = tierIndexForScore(score);
  const def = SCORE_TIERS[idx];
  const next = SCORE_TIERS[idx + 1] ?? null;
  return placementFromDef(def, next);
}

export function placementForCode(code: TierCode): TierPlacement {
  const idx = SCORE_TIERS.findIndex((t) => t.code === code);
  const def = SCORE_TIERS[Math.max(0, idx)];
  const next = SCORE_TIERS[idx + 1] ?? null;
  return placementFromDef(def, next);
}

/** @deprecated resolveTierFromScore 사용 */
export const resolveTierFromWins = resolveTierFromScore;

/** 티어 코드로 정의 조회 */
export function getScoreTier(code: TierCode): ScoreTierDef {
  const found = SCORE_TIERS.find((t) => t.code === code);
  if (!found) throw new Error(`Unknown tier: ${code}`);
  return found;
}

/** @deprecated getScoreTier */
export const getWinTier = getScoreTier;

/** 현재 티어 위·아래 수준 (상세 화면용) */
export function neighboringTiers(code: TierCode): {
  above: ScoreTierDef | null;
  current: ScoreTierDef;
  below: ScoreTierDef | null;
} {
  const idx = SCORE_TIERS.findIndex((t) => t.code === code);
  return {
    above: idx < SCORE_TIERS.length - 1 ? SCORE_TIERS[idx + 1] : null,
    current: SCORE_TIERS[idx],
    below: idx > 0 ? SCORE_TIERS[idx - 1] : null,
  };
}

// ─── 일일 핫토픽 칭호 ───────────────────────────────────────────

export const DAILY_TITLE_TYPES = [
  "SPEAR",
  "SHIELD",
  "VICTOR",
  "FINGER",
  /** 확정 주제 원글 — 성 토마스의 허리띠(영구) */
  "PROPOSER",
  /** 내일 후보 TOP5 — 부차 칭호 */
  "AGENDA",
] as const;

export type DailyTitleType = (typeof DAILY_TITLE_TYPES)[number];

/** 타입별 한글 접미 (date와 결합) */
export const DAILY_TITLE_SUFFIX: Record<DailyTitleType, string> = {
  SPEAR: "의 창",
  SHIELD: "의 방패",
  VICTOR: "의 승자",
  FINGER: "의 도마의 손가락",
  PROPOSER: "의 제안자",
  AGENDA: "의 안건자",
};

/** UI 짧은 표기 — 전장 주제 옆 */
export const DAILY_TITLE_SHORT: Record<DailyTitleType, string> = {
  SPEAR: "창",
  SHIELD: "방패",
  VICTOR: "승자",
  FINGER: "손가락",
  PROPOSER: "제안자",
  AGENDA: "안건자",
};

/**
 * 칭호별 부차 포인트 — 스텁 상수 (테이블 추후)
 * 제안자·일일 칭호 동시 보유 가능
 */
export const TITLE_POINT_BONUS: Record<DailyTitleType, number> = {
  SPEAR: 2,
  SHIELD: 2,
  VICTOR: 5,
  FINGER: 8,
  PROPOSER: 10,
  AGENDA: 3,
};

export type DailyTitle = {
  /** 표시용 날짜 — 예: "10.24" */
  date: string;
  type: DailyTitleType;
  /** 예: "10.24의 창", "10.24의 도마의 손가락" */
  label: string;
};

/** date + type → 표준 라벨 */
export function formatDailyTitleLabel(
  date: string,
  type: DailyTitleType,
): string {
  return `${date}${DAILY_TITLE_SUFFIX[type]}`;
}

export function createDailyTitle(
  date: string,
  type: DailyTitleType,
  label?: string,
): DailyTitle {
  return {
    date,
    type,
    label: label ?? formatDailyTitleLabel(date, type),
  };
}

// ─── 포인트/전과 히스토리 ───────────────────────────────────────

export type ScoreEvent = {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  result: MatchResult;
  /** +1 / 0 */
  delta: number;
  /** 반영 후 시즌 승수(목) */
  scoreAfter: number;
  /** 예: 제 412회 전투 */
  topic: string;
  round: number;
};

// ─── 유저 프로필 (게이미피케이션 필드) ───────────────────────────

export type UserProfileType = {
  id: string;
  username: string;
  /** 현재 시즌 티어 */
  currentTier: TierPlacement;
  /** 시즌 승수 (목 · 티어 배치 입력) */
  score: number;
  /** 시즌 승수 별칭 */
  winsSeason?: number;
  /** 참고용 통산 승·패 */
  wins: number;
  losses: number;
  /** 이번 시즌 최고 티어 */
  tierPeakSeason?: TierCode;
  /** 지난 시즌 최종+최고 */
  seasonHistory?: SeasonTierRecord[];
  dailyTitles: DailyTitle[];
  /** 코스메틱 예약 — 기본 omit = B&W · 티어·승패 무관 */
  cosmetics?: Cosmetics;
};

/** score(시즌 승수 목) 기준으로 currentTier를 맞춘 프로필 스냅샷 */
export function withResolvedTier(
  profile: Omit<UserProfileType, "currentTier"> & {
    currentTier?: TierPlacement;
  },
): UserProfileType {
  const winsSeason = profile.winsSeason ?? profile.score;
  const currentTier =
    profile.currentTier ?? resolveTierFromScore(winsSeason);
  return {
    ...profile,
    score: winsSeason,
    winsSeason,
    currentTier,
    tierPeakSeason: profile.tierPeakSeason ?? currentTier.code,
    seasonHistory: profile.seasonHistory ?? [],
    dailyTitles: profile.dailyTitles ?? [],
  };
}
