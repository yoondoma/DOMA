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
  /** 호응 — 승패·TOP 무관 */
  likeCount: number;
  /** 판결·TOP 유일 권위 (같은 진영만) */
  supportCount: number;
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

export type LikeTargetKind = "opinion" | "reply" | "topic" | "field";

export type Like = {
  id: string;
  userId: string;
  targetKind: LikeTargetKind;
  targetId: string;
  createdAtUtc: string;
};

/**
 * 글 지지 — 판결·TOP 권위.
 * 지지 = 그 의견 진영으로 자동 이동 (진영이 바뀔 때만 이동 횟수 차감).
 */
export type Support = {
  id: string;
  userId: string;
  opinionId: string;
  camp: Camp;
  createdAtUtc: string;
};

/**
 * 진영 전환 기록 — 트로이의 목마(다른 진영에서 넘어온 지지).
 */
export type CampSwitch = {
  id: string;
  userId: string;
  fromCamp: Camp;
  toCamp: Camp;
  opinionId: string;
  createdAtUtc: string;
};

/** 댓글 부모 — 오늘 글 / 내일 주제 / 필드 의견 */
export type ReplyParentKind = "opinion" | "topic" | "field";

export type Reply = {
  id: string;
  parentKind: ReplyParentKind;
  parentId: string;
  authorId: string;
  body: string;
  likeCount: number;
  createdAtUtc: string;
};

/** 스크랩(북마크) 대상 */
export type ScrapTargetKind = "opinion" | "topic" | "field" | "reply";

export type Scrap = {
  id: string;
  userId: string;
  targetKind: ScrapTargetKind;
  targetId: string;
  /** 목록 미리보기 */
  preview: string;
  authorHandle?: string;
  createdAtUtc: string;
};

/** 차단 — blocker가 blocked를 숨김 */
export type Block = {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAtUtc: string;
};

export type ReportTargetKind = "opinion" | "user" | "reply";

export type ReportReason =
  | "spam"
  | "harassment"
  | "misinfo";

/** 신고 (목업 수집) */
export type Report = {
  id: string;
  reporterId: string;
  targetKind: ReportTargetKind;
  targetId: string;
  reason: ReportReason;
  note?: string;
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
