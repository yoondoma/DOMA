import type { ArenaState, Opinion } from "./types";

/** 데모용: 자정까지 카운트다운 */
function endOfTodayIso(): string {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

export const INITIAL_ARENA: ArenaState = {
  round: 412,
  topic: "인공지능은 인간의 지성을 완전히 대체할 것인가?",
  endsAt: endOfTodayIso(),
  nexusPercent: 58,
  aegisPercent: 42,
  nexusVotes: 4821,
  aegisVotes: 4519,
};

export const INITIAL_OPINIONS: Opinion[] = [
  {
    id: "op-1",
    side: "AEGIS",
    author: "mira.k",
    text: "대체는 '완전'이 아니라 '재배치'다. AI는 계산과 검색을 삼키지만, 책임·맥락·가치 판단은 인간에게 남는다. 도구가 손을 대신해도 손은 사라지지 않는다.",
    likes: 214,
    isTopMinority: true,
  },
  {
    id: "op-2",
    side: "NEXUS",
    author: "zero.nexus",
    text: "지성의 핵심이 패턴 인식과 예측이라면, 이미 많은 영역에서 인간은 뒤처졌다. '완전히'의 기준을 감정으로 낮추지 말자. 증거는 벤치마크에 있다.",
    likes: 481,
  },
  {
    id: "op-3",
    side: "AEGIS",
    author: "han.aegis",
    text: "모델은 답을 만들지만 질문을 발명하지 못한다. 토론·윤리·정치의 장은 불확실성을 견디는 주체가 필요하다. 그 주체는 아직 인간이다.",
    likes: 156,
  },
  {
    id: "op-4",
    side: "NEXUS",
    author: "pulse",
    text: "대체는 한 번에 오지 않는다. 업무·학습·창작이 조금씩 위임되고, 어느 날 '인간만의 영역'이 좁아져 있을 것이다. 그 곡선이 이미 시작됐다.",
    likes: 329,
  },
  {
    id: "op-5",
    side: "NEXUS",
    author: "nova",
    text: "지금 이 순간에도 판단이 위임되고 있다. 실시간으로 올라오는 증거만 보라.",
    likes: 88,
  },
  {
    id: "op-6",
    side: "AEGIS",
    author: "reed",
    text: "속도가 정당성을 대신하지 않는다. HOT한 글일수록 더 천천히 읽어야 한다.",
    likes: 120,
  },
];
