export type TomorrowCandidate = {
  id: string;
  title: string;
  votes: number;
};

/** 내일의 주제 — 목 후보 */
export const INITIAL_TOMORROW_TOPICS: TomorrowCandidate[] = [
  {
    id: "tm-1",
    title: "원격 근무는 도시의 중심을 끝낼 것인가?",
    votes: 842,
  },
  {
    id: "tm-2",
    title: "기본소득은 노동 의욕을 깎아먹는가?",
    votes: 691,
  },
  {
    id: "tm-3",
    title: "SNS 실명제는 표현의 자유를 지키는가?",
    votes: 518,
  },
  {
    id: "tm-4",
    title: "핵발전 확대 없이 탄소중립은 가능한가?",
    votes: 457,
  },
];
