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
  description:
    "계산·언어·창작까지 모델이 밀어붙이는 지금, ‘지성’의 경계는 어디에 남는지 묻는다. 도전자와 방어자가 같은 질문을 두고 판결을 겨룬다.",
  endsAt: endOfTodayIso(),
  nexusPercent: 58,
  aegisPercent: 42,
  nexusVotes: 4821,
  aegisVotes: 4519,
};

export const INITIAL_OPINIONS: Opinion[] = [
  {
    id: "op-you-1",
    side: "NEXUS",
    author: "you",
    text: "지성의 핵심이 패턴 인식이라면, ‘완전히’의 기준을 감정으로 낮추지 말자. 증거 없으면 판결도 없다.",
    likes: 42,
  },
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
    text: "지성의 핵심이 패턴 인식과 예측이라면, 이미 많은 영역에서 인간은 뒤처졌다. '완전히'의 기준을 감정으로 낮추지 말자. 증거는 벤치마크에 있다. @soohan 이 기준을 같이 보자.",
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
  {
    id: "op-7",
    side: "NEXUS",
    author: "kiln",
    text: "전문직의 문턱이 낮아질수록 ‘인간만의 판단’은 신화가 된다. 대체는 이미 진행 중이다.",
    likes: 64,
  },
  {
    id: "op-8",
    side: "AEGIS",
    author: "slate",
    text: "설명 가능한 실패와 책임의 주체가 없으면 시스템은 판단을 대신할 수 없다.",
    likes: 91,
  },
  {
    id: "op-9",
    side: "NEXUS",
    author: "orbit",
    text: "창작물 평가조차 모델이 앞선다. 취향의 독점도 오래가지 않는다.",
    likes: 52,
  },
  {
    id: "op-10",
    side: "AEGIS",
    author: "loom",
    text: "공동체가 합의하는 가치는 데이터셋 밖에 있다. 그 합의를 모델이 대체하진 못한다.",
    likes: 73,
  },
];
