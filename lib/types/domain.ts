/**
 * DOMA 도메인 엔티티 (API 교체 전제).
 * UI 뷰 모델(`lib/types.ts`의 Side/Opinion 등)과 분리한다.
 * 티어·스코어·DailyTitle → `lib/types/gamification.ts`
 * TimeState·dayId 규칙 → `docs/24h-timeline` (스토어 메모)
 */

/** KST 전장 날짜 키 — OPEN된 날. 형식 `YYYY-MM-DD` */
export type DayId = string;

/**
 * 진영 — 고정 필드명.
 * UI 레거시: challenger↔NEXUS(흑), defender↔AEGIS(백)
 */
export type Camp = "challenger" | "defender";

/** 24h 순환 — `docs/24h-timeline` 과 동일 */
export type TimeState =
  | "OPEN"
  | "CLOSING_SOON"
  | "LOCKED"
  | "COOLDOWN";

export type User = {
  id: string;
  handle: string;
  displayName: string;
  bio: string;
  /** gamification UserProfileType.id 와 맞출 때 사용 */
  createdAtUtc: string;
};

/** 당일 참전 세션 (유저 × dayId) */
export type Session = {
  id: string;
  userId: string;
  dayId: DayId;
  joinedCamp: Camp | null;
  createdAtUtc: string;
};

/** 오늘 전장 글 */
export type Opinion = {
  id: string;
  dayId: DayId;
  authorId: string;
  camp: Camp;
  body: string;
  likeCount: number;
  replyCount: number;
  createdAtUtc: string;
  isTopMinority?: boolean;
};

/** 내일 주제 후보 */
export type TopicCandidate = {
  id: string;
  /** 후보가 향하는 다음 OPEN dayId */
  targetDayId: DayId;
  title: string;
  body: string;
  supportCount: number;
  stewardCount: number;
  proposerId: string;
  createdAtUtc: string;
};

export type Follow = {
  id: string;
  followerId: string;
  followeeId: string;
  createdAtUtc: string;
};

export type LikeTargetKind = "opinion" | "reply" | "topic";

export type Like = {
  id: string;
  userId: string;
  targetKind: LikeTargetKind;
  targetId: string;
  createdAtUtc: string;
};

export type Reply = {
  id: string;
  opinionId: string;
  authorId: string;
  body: string;
  likeCount: number;
  createdAtUtc: string;
};

/** 종료·확정된 하루 전장 (달력/전과) */
export type BattleDay = {
  dayId: DayId;
  round: number;
  topicTitle: string;
  winnerCamp: Camp;
  winnerShare: number;
  loserShare: number;
  winnerAuthorId: string;
  winnerOpinionBody: string;
  opponentAuthorId: string;
  opponentOpinionBody: string;
  resolvedAtUtc: string | null;
};

/** 권위 시계 스냅샷 (목: 클라 시각으로 근사) */
export type TimelineClock = {
  serverNowUtc: string;
  timezone: "Asia/Seoul";
  dayId: DayId;
  state: TimeState;
  evaluating: boolean;
  segmentEndsAtUtc: string;
  lockAtUtc: string;
  nextOpenAtUtc: string;
  msUntilLock: number;
  goldenHour: boolean;
};
