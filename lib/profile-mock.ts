import { BATTLE_HISTORY } from "./battle-history";
import {
  createDailyTitle,
  pointDelta,
  withResolvedTier,
  type DailyTitle,
  type ScoreEvent,
  type UserProfileType,
} from "./types/gamification";
import type { Side } from "./types";

export type ProfilePost = {
  id: string;
  text: string;
  side: Side;
  likes: number;
  timeLabel: string;
  /** 전장 의견 id (있으면 탭 시 이동) */
  opinionId?: string;
};

export type AffinityStats = {
  challengerJoined: number;
  defenderJoined: number;
  challengerWins: number;
  defenderWins: number;
  challengerSupportPct: number;
  defenderSupportPct: number;
};

export type FollowUser = {
  id: string;
  name: string;
  handle: string;
  bio: string;
};

export const PROFILE_USER = {
  name: "게스트",
  handle: "doma.guest",
  bio: "판결을 겨루는 사람. 증거 없으면 말하지 않는다.",
  joinedLabel: "2026년 11월부터",
  following: 0,
  followers: 0,
};

/**
 * 게이미피케이션 — 실공유 제 1회 시작 상태
 */
export const PROFILE_GAMER: UserProfileType = withResolvedTier({
  id: "user-doma-guest",
  username: PROFILE_USER.name,
  score: 0,
  winsSeason: 0,
  wins: 0,
  losses: 0,
  tierPeakSeason: "BRONZE",
  seasonHistory: [],
  dailyTitles: [createDailyTitle("11.13", "PROPOSER")],
  /** 기본 B&W — 스킨 UI 없음 */
  cosmetics: {},
});

/** 성향 — 제 1회 전, 참여 기록 없음 */
export const PROFILE_AFFINITY: AffinityStats = {
  challengerJoined: 0,
  defenderJoined: 0,
  challengerWins: 0,
  defenderWins: 0,
  challengerSupportPct: 50,
  defenderSupportPct: 50,
};

/** 실공유 — 프로필 예시 글 없음 */
export const PROFILE_POSTS: ProfilePost[] = [];

/** 프로필용 최근 전투 요약 (목 — 이용자 관점 승/패) */
export const PROFILE_RECENT_BATTLES = BATTLE_HISTORY.slice(-5)
  .reverse()
  .map((b, i) => {
    const joinedAs = (i % 2 === 0 ? "NEXUS" : "AEGIS") as Side;
    const result =
      b.winner === "JOINT"
        ? ("win" as const)
        : b.winner === joinedAs
          ? ("win" as const)
          : ("loss" as const);
    return {
      id: `battle-${b.round}`,
      date: b.date,
      round: b.round,
      topic: b.topic,
      joinedAs,
      result,
      winnerPercent: b.winnerPercent,
      delta: pointDelta(result),
    };
  });

/** 시즌 승수 기록 — 최신 순 (승 +1 / 패 0) */
export const PROFILE_SCORE_HISTORY: ScoreEvent[] = (() => {
  let score = 48;
  const rows: ScoreEvent[] = [];
  const seed = [
    /* 체험판 제 1회 이전 기록 없음 — 빈 시드 */
  ] as Array<{
    date: string;
    result: "win" | "loss";
    round: number;
    topic: string;
  }>;
  for (const s of seed) {
    const delta = pointDelta(s.result);
    rows.push({
      id: `ev-${s.round}`,
      date: s.date,
      result: s.result,
      delta,
      scoreAfter: score,
      topic: s.topic,
      round: s.round,
    });
    score -= delta; // reverse walk
  }
  return rows;
})();

/** 실공유 — 팔로 네트워크 데모 없음 */
export const PROFILE_FOLLOWING: FollowUser[] = [];

export const PROFILE_FOLLOWERS: FollowUser[] = [];

export type TitleDetail = DailyTitle & {
  round: number;
  topic: string;
  note: string;
};

export const PROFILE_TITLE_DETAILS: TitleDetail[] = [
  {
    ...createDailyTitle("11.13", "PROPOSER"),
    round: 1,
    topic: "의대 정원 확대는 필요하다",
    note: "제 1회 전장 주제 제안자. 성 토마스의 허리띠 — 만져서 증명.",
  },
];
