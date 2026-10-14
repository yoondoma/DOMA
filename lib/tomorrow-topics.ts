export type TomorrowCandidate = {
  id: string;
  title: string;
  votes: number;
  /** 필드 점검용 한 줄 */
  note: string;
  /** 이 주제를 이끄는 수(목) */
  stewards: number;
};

export type FieldOpinion = {
  id: string;
  topicId: string;
  author: string;
  text: string;
  likes: number;
  stance: "support" | "lead" | "question";
};

/** 내일의 주제 — 필드 후보 목 */
export const INITIAL_TOMORROW_TOPICS: TomorrowCandidate[] = [
  {
    id: "tm-1",
    title: "원격 근무는 도시의 중심을 끝낼 것인가?",
    votes: 842,
    stewards: 36,
    note: "출퇴근·상업·우연한 만남의 밀도가 화면으로 대체되는지 묻는다.",
  },
  {
    id: "tm-2",
    title: "기본소득은 노동 의욕을 깎아먹는가?",
    votes: 691,
    stewards: 28,
    note: "생존 보장과 노력의 신호가 충돌하는 지점을 판결한다.",
  },
  {
    id: "tm-3",
    title: "SNS 실명제는 표현의 자유를 지키는가?",
    votes: 518,
    stewards: 21,
    note: "익명과 책임 사이, 공론장의 조건을 다시 긋는다.",
  },
  {
    id: "tm-4",
    title: "핵발전 확대 없이 탄소중립은 가능한가?",
    votes: 457,
    stewards: 19,
    note: "기저부하·폐기물·시간을 같은 저울에 올린다.",
  },
  {
    id: "tm-5",
    title: "대학 서열은 능력주의의 증명인가?",
    votes: 402,
    stewards: 17,
    note: "선발의 공정과 기회의 독점이 같은 말인지 가른다.",
  },
  {
    id: "tm-6",
    title: "플랫폼 노동자는 노동자인가?",
    votes: 361,
    stewards: 15,
    note: "자율과 보호 사이, 계약의 이름을 다시 쓴다.",
  },
  {
    id: "tm-7",
    title: "사형은 정의를 완성하는가?",
    votes: 298,
    stewards: 12,
    note: "응보와 국가 폭력의 경계를 판결한다.",
  },
];

/** 후보별 필드 의견·지지 글 (목) — 스크롤 탐색용 */
export const FIELD_OPINIONS: FieldOpinion[] = [
  {
    id: "fo-1",
    topicId: "tm-1",
    author: "mira.k",
    stance: "lead",
    likes: 128,
    text: "도심이 끝나는 게 아니라 ‘우연한 밀도의 도시’가 끝난다. 주제를 여기로 이끌자.",
  },
  {
    id: "fo-2",
    topicId: "tm-1",
    author: "zero.nexus",
    stance: "support",
    likes: 96,
    text: "원격이 도시를 죽인 게 아니라, 도시가 이미 비싸서 밀어낸 것이다.",
  },
  {
    id: "fo-3",
    topicId: "tm-1",
    author: "han.aegis",
    stance: "question",
    likes: 54,
    text: "‘중심’의 정의가 상업인가, 사람인가. 그걸 먼저 박아야 한다.",
  },
  {
    id: "fo-4",
    topicId: "tm-1",
    author: "loom",
    stance: "support",
    likes: 41,
    text: "교외의 부활은 해방이 아니라 이동 비용의 전가다.",
  },
  {
    id: "fo-5",
    topicId: "tm-1",
    author: "pulse",
    stance: "lead",
    likes: 33,
    text: "사무실이 사라지면 점심 경제가 먼저 죽는다. 그 연쇄를 주제로.",
  },
  {
    id: "fo-6",
    topicId: "tm-2",
    author: "orbit",
    stance: "lead",
    likes: 88,
    text: "의욕이 아니라 ‘강제된 생존 노동’을 줄이는 장치로 읽어야 한다.",
  },
  {
    id: "fo-7",
    topicId: "tm-2",
    author: "reed",
    stance: "support",
    likes: 62,
    text: "기본소득 반대론은 종종 게으름의 공포를 능력주의로 포장한다.",
  },
  {
    id: "fo-8",
    topicId: "tm-2",
    author: "kite",
    stance: "question",
    likes: 39,
    text: "재원은 어디서? 질문 없이 도덕만 남은 토론은 빈약하다.",
  },
  {
    id: "fo-9",
    topicId: "tm-2",
    author: "nova",
    stance: "support",
    likes: 27,
    text: "노동 의욕이 아니라 협상력이 바뀌는 쪽이 핵심이다.",
  },
  {
    id: "fo-10",
    topicId: "tm-3",
    author: "veil",
    stance: "lead",
    likes: 71,
    text: "실명제는 자유를 지키는 게 아니라 감시 비용을 낮춘다.",
  },
  {
    id: "fo-11",
    topicId: "tm-3",
    author: "ash",
    stance: "support",
    likes: 44,
    text: "혐오에 맞서는 도구와 국가의 명부를 같은 저울에 올리지 말자.",
  },
  {
    id: "fo-12",
    topicId: "tm-3",
    author: "glen",
    stance: "question",
    likes: 22,
    text: "익명 없이는 말하기 어려운 증언은 어디에 남나.",
  },
  {
    id: "fo-13",
    topicId: "tm-4",
    author: "volt",
    stance: "lead",
    likes: 59,
    text: "시간 스케일을 숨긴 탄소중립은 슬로건이다. 기저부하를 정면으로.",
  },
  {
    id: "fo-14",
    topicId: "tm-4",
    author: "iris",
    stance: "support",
    likes: 35,
    text: "폐기물을 ‘나중’으로 미루는 낙관이 가장 비싼 리스크다.",
  },
  {
    id: "fo-15",
    topicId: "tm-5",
    author: "quill",
    stance: "lead",
    likes: 48,
    text: "서열이 능력을 재는 게 아니라 능력을 서열의 언어로 다시 쓴다.",
  },
  {
    id: "fo-16",
    topicId: "tm-5",
    author: "moss",
    stance: "support",
    likes: 29,
    text: "공정한 시험이 불공정한 출발선을 지울 수는 없다.",
  },
  {
    id: "fo-17",
    topicId: "tm-6",
    author: "axle",
    stance: "lead",
    likes: 52,
    text: "알고리즘이 배정하는 일을 ‘사업’이라 부르는 순간 보호가 증발한다.",
  },
  {
    id: "fo-18",
    topicId: "tm-6",
    author: "fern",
    stance: "question",
    likes: 18,
    text: "유연함이 권리인지 위험 전가인지, 계약서 한 줄로 갈라야 한다.",
  },
  {
    id: "fo-19",
    topicId: "tm-7",
    author: "cinder",
    stance: "lead",
    likes: 61,
    text: "정의의 완성이 아니라 국가가 죽음을 집행할 자격의 문제다.",
  },
  {
    id: "fo-20",
    topicId: "tm-7",
    author: "dale",
    stance: "support",
    likes: 24,
    text: "오판의 비가역성을 외면한 응보는 복수에 가깝다.",
  },
];

export function opinionsForTopic(topicId: string): FieldOpinion[] {
  return FIELD_OPINIONS.filter((o) => o.topicId === topicId).sort(
    (a, b) => b.likes - a.likes,
  );
}
