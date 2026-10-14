/**
 * DOMA 유저 티어·일일 칭호 (광물 랭크 + 핫토픽 타이틀)
 * UI와 분리된 순수 타입/상수 — 승수 테이블은 이후 밸런스만 조정하면 됨.
 */

/** 누적 승수 티어 (낮음 → 높음). ARCHITECT = 최상위 */
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

export type WinTierDef = {
  code: TierCode;
  /** 한글 표기 */
  label: string;
  /** 이 티어 진입에 필요한 누적 승수 (이상) */
  minWins: number;
};

/**
 * 누적 승수 → 티어 경계.
 * 다음 티어 minWins 직전까지가 현재 티어 구간이며, 구간을 4등분해 IV~I에 배정.
 */
export const WIN_TIERS: readonly WinTierDef[] = [
  { code: "IRON", label: "아이언", minWins: 0 },
  { code: "BRONZE", label: "브론즈", minWins: 5 },
  { code: "SILVER", label: "실버", minWins: 15 },
  { code: "GOLD", label: "골드", minWins: 35 },
  { code: "PLATINUM", label: "플래티넘", minWins: 70 },
  { code: "DIAMOND", label: "다이아몬드", minWins: 120 },
  { code: "MASTER", label: "마스터", minWins: 200 },
  { code: "GRANDMASTER", label: "그랜드마스터", minWins: 320 },
  { code: "ARCHITECT", label: "아키텍트", minWins: 500 },
] as const;

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
  minWins: number;
  /** 다음 티어 진입 승수. 최상위면 null */
  nextTierAt: number | null;
};

function tierIndexForWins(totalWins: number): number {
  const wins = Math.max(0, Math.floor(totalWins));
  let idx = 0;
  for (let i = 0; i < WIN_TIERS.length; i++) {
    if (wins >= WIN_TIERS[i].minWins) idx = i;
  }
  return idx;
}

/** 누적 승수 → 티어 + 로마 서브티어 */
export function resolveTierFromWins(totalWins: number): TierPlacement {
  const idx = tierIndexForWins(totalWins);
  const def = WIN_TIERS[idx];
  const next = WIN_TIERS[idx + 1] ?? null;
  const wins = Math.max(0, Math.floor(totalWins));

  const span = next
    ? next.minWins - def.minWins
    : ARCHITECT_BAND * SUBTIERS.length;
  const band = Math.max(1, Math.floor(span / SUBTIERS.length));
  const progress = wins - def.minWins;
  const subIdx = Math.min(SUBTIERS.length - 1, Math.floor(progress / band));
  const subtier = SUBTIERS[subIdx];

  return {
    code: def.code,
    label: def.label,
    subtier,
    display: `${def.code} ${subtier}`,
    displayKo: `${def.label} ${subtier}`,
    minWins: def.minWins,
    nextTierAt: next?.minWins ?? null,
  };
}

/** 티어 코드로 정의 조회 */
export function getWinTier(code: TierCode): WinTierDef {
  const found = WIN_TIERS.find((t) => t.code === code);
  if (!found) throw new Error(`Unknown tier: ${code}`);
  return found;
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

// ─── 유저 프로필 (게이미피케이션 필드) ───────────────────────────

export type UserProfileType = {
  id: string;
  username: string;
  /** 현재 티어 배치 (승수에서 유도하거나 스냅샷) */
  currentTier: TierPlacement;
  totalWins: number;
  dailyTitles: DailyTitle[];
};

/** totalWins 기준으로 currentTier를 맞춘 프로필 스냅샷 */
export function withResolvedTier(
  profile: Omit<UserProfileType, "currentTier"> & {
    currentTier?: TierPlacement;
  },
): UserProfileType {
  return {
    ...profile,
    currentTier: resolveTierFromWins(profile.totalWins),
    dailyTitles: profile.dailyTitles ?? [],
  };
}
