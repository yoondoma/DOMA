/**
 * DOMA 유저 티어·일일 칭호 (광물 랭크 + 핫토픽 타이틀)
 *
 * ## 티어 포인트 규칙
 * - 1승 = **+1** 포인트
 * - 1패 = **-0.5** 포인트
 * - 티어·서브티어는 누적 **score**(포인트)로 결정한다.
 * - score는 음수가 될 수 있으나, 티어 해석 시 0 하한으로 클램프한다.
 */

/** 매치 결과 → 포인트 가감 */
export const POINT_RULES = {
  WIN: 1,
  LOSS: -0.5,
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

/** 누적 포인트 티어 (낮음 → 높음). ARCHITECT = 최상위 */
export const TIER_CODES = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "ARCHITECT",
] as const;

export type TierCode = (typeof TIER_CODES)[number];

/** 티어 내 4단계 — IV(최저) → I(최고) */
export const SUBTIERS = ["IV", "III", "II", "I"] as const;
export type Subtier = (typeof SUBTIERS)[number];

export type ScoreTierDef = {
  code: TierCode;
  /** 한글 표기 */
  label: string;
  /** 이 티어 진입에 필요한 누적 score (이상) */
  minScore: number;
};

/**
 * 누적 score → 티어 경계.
 * 다음 티어 minScore 직전까지가 현재 티어 구간이며, 구간을 4등분해 IV~I에 배정.
 */
export const SCORE_TIERS: readonly ScoreTierDef[] = [
  { code: "IRON", label: "아이언", minScore: 0 },
  { code: "BRONZE", label: "브론즈", minScore: 5 },
  { code: "SILVER", label: "실버", minScore: 15 },
  { code: "GOLD", label: "골드", minScore: 35 },
  { code: "PLATINUM", label: "플래티넘", minScore: 70 },
  { code: "DIAMOND", label: "다이아몬드", minScore: 120 },
  { code: "MASTER", label: "마스터", minScore: 200 },
  { code: "GRANDMASTER", label: "그랜드마스터", minScore: 320 },
  { code: "ARCHITECT", label: "아키텍트", minScore: 500 },
] as const;

/** @deprecated SCORE_TIERS 사용 */
export const WIN_TIERS = SCORE_TIERS;

/** 최상위(ARCHITECT) 구간 — 다음 티어가 없을 때 서브티어 밴드 폭 */
const ARCHITECT_BAND = 40;

export type TierPlacement = {
  code: TierCode;
  label: string;
  subtier: Subtier;
  /** 예: "GOLD III" */
  display: string;
  /** 예: "골드 III" */
  displayKo: string;
  minScore: number;
  /** 다음 티어 진입 score. 최상위면 null */
  nextTierAt: number | null;
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

/** 누적 score → 티어 + 로마 서브티어 */
export function resolveTierFromScore(score: number): TierPlacement {
  const idx = tierIndexForScore(score);
  const def = SCORE_TIERS[idx];
  const next = SCORE_TIERS[idx + 1] ?? null;
  const s = clampScore(score);

  const span = next
    ? next.minScore - def.minScore
    : ARCHITECT_BAND * SUBTIERS.length;
  const band = Math.max(1, span / SUBTIERS.length);
  const progress = s - def.minScore;
  const subIdx = Math.min(SUBTIERS.length - 1, Math.floor(progress / band));
  const subtier = SUBTIERS[subIdx];

  return {
    code: def.code,
    label: def.label,
    subtier,
    display: `${def.code} ${subtier}`,
    displayKo: `${def.label} ${subtier}`,
    minScore: def.minScore,
    nextTierAt: next?.minScore ?? null,
  };
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
] as const;

export type DailyTitleType = (typeof DAILY_TITLE_TYPES)[number];

/** 타입별 한글 접미 (date와 결합) */
export const DAILY_TITLE_SUFFIX: Record<DailyTitleType, string> = {
  SPEAR: "의 창",
  SHIELD: "의 방패",
  VICTOR: "의 승자",
  FINGER: "의 도마의 손가락",
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
  /** +1 / -0.5 */
  delta: number;
  /** 반영 후 누적 score */
  scoreAfter: number;
  /** 예: 제 412 도마 */
  topic: string;
  round: number;
};

// ─── 유저 프로필 (게이미피케이션 필드) ───────────────────────────

export type UserProfileType = {
  id: string;
  username: string;
  /** 현재 티어 배치 (score에서 유도하거나 스냅샷) */
  currentTier: TierPlacement;
  /** 누적 티어 포인트 (1승=+1, 1패=-0.5) */
  score: number;
  /** 참고용 승·패 횟수 */
  wins: number;
  losses: number;
  dailyTitles: DailyTitle[];
};

/** score 기준으로 currentTier를 맞춘 프로필 스냅샷 */
export function withResolvedTier(
  profile: Omit<UserProfileType, "currentTier"> & {
    currentTier?: TierPlacement;
  },
): UserProfileType {
  return {
    ...profile,
    currentTier: resolveTierFromScore(profile.score),
    dailyTitles: profile.dailyTitles ?? [],
  };
}
