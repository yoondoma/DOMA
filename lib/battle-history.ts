import type { BattleDay } from "./types";

/** 2026년 10월 목 전투 기록 — 도전자승=흑 / 방어자승=백 교차 */
export const BATTLE_HISTORY: BattleDay[] = [
  {
    date: "2026-10-01",
    round: 401,
    topic: "표현의 자유는 혐오 발언까지 포함하는가?",
    winner: "NEXUS",
    winnerPercent: 54,
    loserPercent: 46,
    winnerAuthor: "zero.nexus",
    winnerOpinion:
      "경계는 법이 긋는다. 감정의 불쾌함으로 말을 묶으면 공론은 죽는다.",
    opponentAuthor: "mira.k",
    opponentOpinion: "해악이 명백한 말은 자유가 아니라 폭력이다.",
    proposerHandle: "zero.nexus",
    hasGirdle: true,
  },
  {
    date: "2026-10-02",
    round: 402,
    topic: "원격 근무가 도시의 미래를 대체하는가?",
    winner: "AEGIS",
    winnerPercent: 57,
    loserPercent: 43,
    winnerAuthor: "han.aegis",
    winnerOpinion:
      "도시는 우연한 만남의 인프라다. 화면은 그 밀도를 복제하지 못한다.",
    opponentAuthor: "pulse",
    opponentOpinion: "출퇴근 비용이 사라지면 도시는 선택이 된다.",
    proposerHandle: "mira.k",
    hasGirdle: true,
  },
  {
    date: "2026-10-03",
    round: 403,
    topic: "기본소득은 노동 의욕을 떨어뜨리는가?",
    winner: "JOINT",
    winnerPercent: 50,
    loserPercent: 50,
    winnerAuthor: "nova",
    winnerOpinion:
      "생존이 보장될 때 비로소 위험한 일을 고른다. 의욕은 형태만 바뀐다.",
    opponentAuthor: "reed",
    opponentOpinion: "대가 없는 소득은 노력의 신호를 흐린다.",
    proposerHandle: "nova",
    hasGirdle: true,
  },
  {
    date: "2026-10-04",
    round: 404,
    topic: "핵에너지는 기후 위기의 필수 해법인가?",
    winner: "AEGIS",
    winnerPercent: 53,
    loserPercent: 47,
    winnerAuthor: "slate",
    winnerOpinion: "폐기물과 리스크를 후대에 미루는 해법은 해법이 아니다.",
    opponentAuthor: "kiln",
    opponentOpinion: "간헐성 재생만으로 기저부하를 메울 수 없다.",
    proposerHandle: "kiln",
    hasGirdle: true,
  },
  {
    date: "2026-10-05",
    round: 405,
    topic: "SNS 실명제는 공론장을 살리는가?",
    winner: "NEXUS",
    winnerPercent: 56,
    loserPercent: 44,
    winnerAuthor: "orbit",
    winnerOpinion: "익명은 약자의 방패다. 실명은 권력의 추적만 쉽게 한다.",
    opponentAuthor: "loom",
    opponentOpinion: "책임 없는 말은 공론이 아니라 소음이다.",
    proposerHandle: "orbit",
    hasGirdle: true,
  },
  {
    date: "2026-10-06",
    round: 406,
    topic: "유전자 편집 아기는 허용되어야 하는가?",
    winner: "AEGIS",
    winnerPercent: 59,
    loserPercent: 41,
    winnerAuthor: "mira.k",
    winnerOpinion:
      "치료와 강화의 경계가 무너지면 불평등은 피부 아래로 내려간다.",
    opponentAuthor: "zero.nexus",
    opponentOpinion: "고통 가능한 질병을 막지 않는 금지는 잔인하다.",
    proposerHandle: "mira.k",
    hasGirdle: true,
  },
  {
    date: "2026-10-07",
    round: 407,
    topic: "대학 입시는 추첨으로 대체되어야 하는가?",
    winner: "NEXUS",
    winnerPercent: 52,
    loserPercent: 48,
    winnerAuthor: "pulse",
    winnerOpinion: "점수 경쟁은 스펙 인플레이션만 키운다. 추첨이 더 정직하다.",
    opponentAuthor: "han.aegis",
    opponentOpinion: "노력의 차등을 지우면 공정이 아니라 포기다.",
    proposerHandle: "pulse",
    hasGirdle: true,
  },
  {
    date: "2026-10-08",
    round: 408,
    topic: "우주 식민지는 지구 문제의 도피인가?",
    winner: "AEGIS",
    winnerPercent: 55,
    loserPercent: 45,
    winnerAuthor: "reed",
    winnerOpinion: "지구를 버리는 서사는 책임을 궤도에 올려보낸다.",
    opponentAuthor: "nova",
    opponentOpinion: "다행성 생존은 보험이다. 도피가 아니라 확장이다.",
    proposerHandle: "reed",
    hasGirdle: true,
  },
  {
    date: "2026-10-09",
    round: 409,
    topic: "현금 없는 사회는 자유를 줄이는가?",
    winner: "NEXUS",
    winnerPercent: 58,
    loserPercent: 42,
    winnerAuthor: "kiln",
    winnerOpinion: "모든 거래가 기록되면 거부는 권한이 된다.",
    opponentAuthor: "slate",
    opponentOpinion: "현금의 익명은 범죄의 산소이기도 하다.",
    proposerHandle: "kiln",
    hasGirdle: true,
  },
  {
    date: "2026-10-10",
    round: 410,
    topic: "AI 창작물은 저작권을 가져야 하는가?",
    winner: "AEGIS",
    winnerPercent: 61,
    loserPercent: 39,
    winnerAuthor: "loom",
    winnerOpinion: "권리의 주체는 의도하는 인간이다. 모델은 도구다.",
    opponentAuthor: "orbit",
    opponentOpinion: "창작의 결과물에 인격이 필수라는 전제는 낡은다.",
    proposerHandle: "loom",
    hasGirdle: true,
  },
  {
    date: "2026-10-11",
    round: 411,
    topic: "투표 연령을 16세로 낮춰야 하는가?",
    winner: "NEXUS",
    winnerPercent: 53,
    loserPercent: 47,
    winnerAuthor: "zero.nexus",
    winnerOpinion: "미래에 가장 오래 살 사람이 결정에서 배제되어 있다.",
    opponentAuthor: "mira.k",
    opponentOpinion: "권리에는 판단의 성숙이 전제된다.",
    proposerHandle: "soohan",
    hasGirdle: true,
  },
  {
    date: "2026-10-12",
    round: 412,
    topic: "동물원 제도는 폐지되어야 하는가?",
    winner: "AEGIS",
    winnerPercent: 54,
    loserPercent: 46,
    winnerAuthor: "han.aegis",
    winnerOpinion: "구경을 위한 감금은 교육이 아니라 전시 폭력이다.",
    opponentAuthor: "pulse",
    opponentOpinion: "보전과 교육의 현장 없이 야생만 외치면 공허하다.",
    proposerHandle: "han.aegis",
    hasGirdle: true,
  },
];

export const BATTLE_YEAR = 2026;
export const BATTLE_MONTH = 10;

export function battleByDate(
  date: string,
  _now?: Date,
): BattleDay | undefined {
  return BATTLE_HISTORY.find((b) => b.date === date);
}

/** 달력용 히스토리 (목) */
export function getBattleHistory(_now?: Date): BattleDay[] {
  return BATTLE_HISTORY;
}

/** 달력 표시 연·월 */
export function battleMonth(_now?: Date): { year: number; month: number } {
  return { year: BATTLE_YEAR, month: BATTLE_MONTH };
}
