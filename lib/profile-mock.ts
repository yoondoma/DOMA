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
  name: "수한",
  handle: "soohan",
  bio: "판결을 겨루는 사람. 증거 없으면 말하지 않는다.",
  joinedLabel: "2026년 3월부터",
  following: 128,
  followers: 940,
};

/**
 * 게이미피케이션 목
 * score 규칙: 승 +1 / 패 -0.5 → 예) 160승 30패 = 160 - 15 = 145
 */
export const PROFILE_GAMER: UserProfileType = withResolvedTier({
  id: "user-soohan",
  username: PROFILE_USER.name,
  score: 145,
  wins: 160,
  losses: 30,
  dailyTitles: [
    createDailyTitle("10.14", "PROPOSER"),
    createDailyTitle("10.13", "AGENDA"),
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

/** 티어 상승 기록 — 최신 순 (승 +1 / 패 -0.5) */
export const PROFILE_SCORE_HISTORY: ScoreEvent[] = (() => {
  let score = 145;
  const rows: ScoreEvent[] = [];
  const seed = [
    { date: "2026-10-13", result: "win" as const, round: 412, topic: "인공지능은 인간의 지성을 완전히 대체할 것인가?" },
    { date: "2026-10-12", result: "win" as const, round: 411, topic: "표현의 자유는 혐오를 포함해야 하는가?" },
    { date: "2026-10-11", result: "loss" as const, round: 410, topic: "원격 근무는 생산성을 올리는가?" },
    { date: "2026-10-10", result: "win" as const, round: 409, topic: "기본소득은 노동 의력을 약화시키는가?" },
    { date: "2026-10-09", result: "loss" as const, round: 408, topic: "대학 서열은 능력주의의 증명인가?" },
    { date: "2026-10-08", result: "win" as const, round: 407, topic: "핵발전은 기후 위기의 해법인가?" },
    { date: "2026-10-07", result: "win" as const, round: 406, topic: "플랫폼 노동은 고용인가?" },
    { date: "2026-10-06", result: "loss" as const, round: 405, topic: "검열 없는 인터넷은 가능한가?" },
  ];
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

const FOLLOW_NAMES = [
  ["김도마", "doma_kim", "판결문만 남긴다."],
  ["이창", "spear_lee", "흑으로 증명."],
  ["박방패", "aegis_park", "백의 자리."],
  ["최증거", "evidence_c", "각주가 곧 주장."],
  ["정논객", "jung_debate", "한 줄로 끝내기."],
  ["한결", "hangyeol", "매일 한 판."],
  ["윤침묵", "silent_y", "말하지 않을 자유."],
  ["서판결", "seo_verdict", "24시간 안에."],
];

export const PROFILE_FOLLOWING: FollowUser[] = FOLLOW_NAMES.map((n, i) => ({
  id: `fg-${i}`,
  name: n[0],
  handle: n[1],
  bio: n[2],
}));

export const PROFILE_FOLLOWERS: FollowUser[] = [
  ...FOLLOW_NAMES.slice().reverse().map((n, i) => ({
    id: `fr-${i}`,
    name: n[0],
    handle: `${n[1]}_f`,
    bio: n[2],
  })),
  {
    id: "fr-x",
    name: "오독자",
    handle: "reader_oh",
    bio: "지켜보는 사람.",
  },
  {
    id: "fr-y",
    name: "유증인",
    handle: "witness_yoo",
    bio: "기록만 한다.",
  },
];

export type TitleDetail = DailyTitle & {
  round: number;
  topic: string;
  note: string;
};

export const PROFILE_TITLE_DETAILS: TitleDetail[] = [
  {
    ...createDailyTitle("10.14", "PROPOSER"),
    round: 412,
    topic: "인공지능은 인간의 지성을 완전히 대체할 것인가?",
    note: "그날의 전장 주제를 제시한 제안자. 성 토마스의 허리띠 — 만져서 증명.",
  },
  {
    ...createDailyTitle("10.13", "AGENDA"),
    round: 0,
    topic: "원격 근무는 도시의 중심을 끝낼 것인가?",
    note: "내일 후보 TOP5 안건자. 확정 제안자와 별도 · 부차 포인트.",
  },
  {
    ...createDailyTitle("10.24", "FINGER"),
    round: 412,
    topic: "인공지능은 인간의 지성을 완전히 대체할 것인가?",
    note: "당일 최다 채택·인용으로 도마의 손가락.",
  },
  {
    ...createDailyTitle("10.12", "SPEAR"),
    round: 400,
    topic: "표현의 자유는 혐오를 포함해야 하는가?",
    note: "도전자 진영 대표 진술.",
  },
  {
    ...createDailyTitle("09.30", "VICTOR"),
    round: 388,
    topic: "기본소득은 노동 동력을 약화시키는가?",
    note: "당일 승자 진영 확정.",
  },
];
