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
  joinedLabel: "2026년 3월부터",
  following: 128,
  followers: 940,
};

/**
 * 게이미피케이션 목
 * 시즌 승수 → 사다리 (ARCHITECT→I–IV→BRONZE) · 패 0
 */
export const PROFILE_GAMER: UserProfileType = withResolvedTier({
  id: "user-doma-guest",
  username: PROFILE_USER.name,
  /** 이번 시즌 승수 → II */
  score: 48,
  winsSeason: 48,
  wins: 160,
  losses: 30,
  tierPeakSeason: "I",
  seasonHistory: [
    {
      seasonId: "2026-Q3",
      label: "2026 Q3",
      tierFinal: "III",
      tierPeak: "II",
      wins: 36,
    },
    {
      seasonId: "2026-Q2",
      label: "2026 Q2",
      tierFinal: "IV",
      tierPeak: "III",
      wins: 22,
    },
  ],
  dailyTitles: [
    createDailyTitle("10.14", "PROPOSER"),
    createDailyTitle("10.24", "FINGER"),
    createDailyTitle("10.12", "SPEAR"),
    createDailyTitle("10.11", "SHIELD"),
    createDailyTitle("09.30", "VICTOR"),
  ],
  /** 기본 B&W — 스킨 UI 없음 */
  cosmetics: {},
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
    opinionId: "op-guest-1",
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
  {
    id: "pp-4",
    side: "AEGIS",
    text: "증거가 쌓이기 전에 ‘완전 대체’를 말하면, 그건 판결이 아니라 구호다.",
    likes: 27,
    timeLabel: "4일",
  },
  {
    id: "pp-5",
    side: "NEXUS",
    text: "벤치마크가 흔들려도 질문은 남는다. 그 질문을 누가 붙드느냐가 전장이다.",
    likes: 15,
    timeLabel: "6일",
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

/** 시즌 승수 기록 — 최신 순 (승 +1 / 패 0) */
export const PROFILE_SCORE_HISTORY: ScoreEvent[] = (() => {
  let score = 48;
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
  ["아레나", "arena.one", "판결문만 남긴다."],
  ["창끝", "spear.tip", "흑으로 증명."],
  ["방패선", "aegis.line", "백의 자리."],
  ["각주", "evidence.note", "각주가 곧 주장."],
  ["한줄", "one.line", "한 줄로 끝내기."],
  ["데일리", "daily.round", "매일 한 판."],
  ["침묵", "silent.pulse", "말하지 않을 자유."],
  ["판결", "verdict.now", "24시간 안에."],
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
    name: "관전",
    handle: "watcher.one",
    bio: "지켜보는 사람.",
  },
  {
    id: "fr-y",
    name: "증인",
    handle: "witness.arc",
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
    ...createDailyTitle("10.24", "FINGER"),
    round: 412,
    topic: "인공지능은 인간의 지성을 완전히 대체할 것인가?",
    note: "당일 승리 TOP 의견 · 도마의 손가락(반지). XP 0.",
  },
  {
    ...createDailyTitle("10.12", "SPEAR"),
    round: 400,
    topic: "표현의 자유는 혐오를 포함해야 하는가?",
    note: "도전자 진영 대표 진술.",
  },
  {
    ...createDailyTitle("10.11", "SHIELD"),
    round: 399,
    topic: "현금 없는 사회는 자유를 줄이는가?",
    note: "방어자 진영 대표 진술.",
  },
  {
    ...createDailyTitle("09.30", "VICTOR"),
    round: 388,
    topic: "기본소득은 노동 동력을 약화시키는가?",
    note: "당일 승자 진영 확정.",
  },
];
