import { BATTLE_HISTORY } from "./battle-history";
import {
  createDailyTitle,
  withResolvedTier,
  type UserProfileType,
} from "./types/gamification";
import type { Side } from "./types";

export type ProfilePost = {
  id: string;
  text: string;
  side: Side;
  likes: number;
  timeLabel: string;
};

export type AffinityStats = {
  challengerJoined: number;
  defenderJoined: number;
  challengerWins: number;
  defenderWins: number;
  challengerSupportPct: number;
  defenderSupportPct: number;
};

export const PROFILE_USER = {
  name: "수한",
  handle: "soohan",
  bio: "판결을 겨루는 사람. 증거 없으면 말하지 않는다.",
  joinedLabel: "2026년 3월부터",
  following: 128,
  followers: 940,
};

/** 게이미피케이션 목 — DIAMOND II 근처 + 일일 칭호 */
export const PROFILE_GAMER: UserProfileType = withResolvedTier({
  id: "user-soohan",
  username: PROFILE_USER.name,
  totalWins: 145,
  dailyTitles: [
    createDailyTitle("10.24", "FINGER"),
    createDailyTitle("10.12", "SPEAR"),
    createDailyTitle("09.30", "VICTOR"),
  ],
});

/** 성향 — 흑(도전자)·백(방어자) 참여·승패·지지 비율 목 */
export const PROFILE_AFFINITY: AffinityStats = {
  challengerJoined: 14,
  defenderJoined: 9,
  challengerWins: 8,
  defenderWins: 5,
  challengerSupportPct: 61,
  defenderSupportPct: 39,
};

export const PROFILE_POSTS: ProfilePost[] = [
  {
    id: "pp-1",
    side: "NEXUS",
    text: "지성의 핵심이 패턴 인식이라면, ‘완전히’의 기준을 감정으로 낮추지 말자.",
    likes: 42,
    timeLabel: "2시간",
  },
  {
    id: "pp-2",
    side: "AEGIS",
    text: "모델은 답을 만들지만 질문을 발명하지 못한다. 그 자리는 아직 인간이다.",
    likes: 31,
    timeLabel: "어제",
  },
  {
    id: "pp-3",
    side: "NEXUS",
    text: "대체는 한 번에 오지 않는다. 위임의 곡선이 이미 시작됐다.",
    likes: 18,
    timeLabel: "3일",
  },
];

/** 프로필용 최근 전투 요약 (목 — 이용자 관점 승/패) */
export const PROFILE_RECENT_BATTLES = BATTLE_HISTORY.slice(-5)
  .reverse()
  .map((b, i) => ({
    date: b.date,
    round: b.round,
    topic: b.topic,
    /** 짝수 인덱스는 도전자로 참전했다고 가정 */
    joinedAs: (i % 2 === 0 ? "NEXUS" : "AEGIS") as Side,
    result: (b.winner === (i % 2 === 0 ? "NEXUS" : "AEGIS")
      ? "win"
      : "loss") as "win" | "loss",
    winnerPercent: b.winnerPercent,
  }));
