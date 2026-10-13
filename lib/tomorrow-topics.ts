export type TomorrowCandidate = {
  id: string;
  title: string;
  votes: number;
  /** 필드 점검용 한 줄 */
  note: string;
  /** 이 주제를 이끄는 수(목) */
  stewards: number;
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
];
