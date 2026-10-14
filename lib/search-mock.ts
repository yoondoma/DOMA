/**
 * 검색 인덱스 목 — 전투 글 + 제안만 (social-rules F19).
 * 유저 전용 탭 없음 · 댓글·DM 제외.
 */

export type SearchKind = "battle" | "proposal";

export type SearchItem = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
};

export const SEARCH_KIND_LABEL: Record<SearchKind, string> = {
  battle: "전투 글",
  proposal: "제안",
};

export const SEARCH_INDEX: SearchItem[] = [
  {
    id: "b1",
    kind: "battle",
    title: "지성의 핵심이 패턴 인식이라면, ‘완전히’의 기준을 감정으로 낮추지 말자.",
    subtitle: "제 412회 · 도전자 · @soohan",
  },
  {
    id: "b2",
    kind: "battle",
    title: "대체는 이미 일어났다. 남은 건 인정할 용기뿐이다.",
    subtitle: "제 412회 · 도전자 · @zero.nexus",
  },
  {
    id: "b3",
    kind: "battle",
    title: "판단·책임·고통을 모델에 넘길 수 없다면, 지성은 아직 인간 쪽에 있다.",
    subtitle: "제 412회 · 방어자 · @mira.k",
  },
  {
    id: "b4",
    kind: "battle",
    title: "혐오를 막겠다고 자유를 자르면, 칼자루는 항상 권력 손에 남는다.",
    subtitle: "제 401회 · 도전자 · @pulse",
  },
  {
    id: "b5",
    kind: "battle",
    title: "현금 없는 사회는 추적이 기본값이 된다. 그게 자유인가.",
    subtitle: "제 409회 · 도전자 · @han.aegis",
  },
  {
    id: "p1",
    kind: "proposal",
    title: "원격 근무는 도시의 중심을 끝낼 것인가?",
    subtitle: "내일 후보 · 지지 128",
  },
  {
    id: "p2",
    kind: "proposal",
    title: "기본소득은 노동 동력을 약화시키는가?",
    subtitle: "내일 후보 · 지지 96",
  },
  {
    id: "p3",
    kind: "proposal",
    title: "동물원 제도는 폐지되어야 하는가?",
    subtitle: "내일 후보 · 지지 71",
  },
  {
    id: "p4",
    kind: "proposal",
    title: "표현의 자유는 혐오 발언까지 포함하는가?",
    subtitle: "과거 확정 · 제 401회",
  },
  {
    id: "t1",
    kind: "proposal",
    title: "인공지능은 인간의 지성을 완전히 대체할 것인가?",
    subtitle: "오늘 전장 · 제 412회 진행 중",
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
