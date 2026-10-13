export type SearchKind = "user" | "keyword" | "topic";

export type SearchItem = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
};

export const SEARCH_KIND_LABEL: Record<SearchKind, string> = {
  user: "이용자",
  keyword: "키워드",
  topic: "전투 주제",
};

export const SEARCH_INDEX: SearchItem[] = [
  {
    id: "u1",
    kind: "user",
    title: "@zero.nexus",
    subtitle: "도전자 · 최근 TOP 3회",
  },
  {
    id: "u2",
    kind: "user",
    title: "@mira.k",
    subtitle: "방어자 · 소수의견 기록",
  },
  {
    id: "u3",
    kind: "user",
    title: "@pulse",
    subtitle: "도전자 · 참전 128회",
  },
  {
    id: "u4",
    kind: "user",
    title: "@han.aegis",
    subtitle: "방어자 · 승률 54%",
  },
  {
    id: "k1",
    kind: "keyword",
    title: "인공지능",
    subtitle: "키워드 · 관련 전투 12",
  },
  {
    id: "k2",
    kind: "keyword",
    title: "표현의 자유",
    subtitle: "키워드 · 관련 전투 7",
  },
  {
    id: "k3",
    kind: "keyword",
    title: "기본소득",
    subtitle: "키워드 · 관련 전투 4",
  },
  {
    id: "t1",
    kind: "topic",
    title: "인공지능은 인간의 지성을 완전히 대체할 것인가?",
    subtitle: "제 412 도마 · 진행 중",
  },
  {
    id: "t2",
    kind: "topic",
    title: "표현의 자유는 혐오 발언까지 포함하는가?",
    subtitle: "제 401 도마 · 도전자 승 54%",
  },
  {
    id: "t3",
    kind: "topic",
    title: "현금 없는 사회는 자유를 줄이는가?",
    subtitle: "제 409 도마 · 도전자 승 58%",
  },
  {
    id: "t4",
    kind: "topic",
    title: "동물원 제도는 폐지되어야 하는가?",
    subtitle: "제 412 도마 · 방어자 승 54%",
  },
];

export function searchAll(query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_INDEX;
  return SEARCH_INDEX.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      SEARCH_KIND_LABEL[item.kind].includes(q),
  );
}
