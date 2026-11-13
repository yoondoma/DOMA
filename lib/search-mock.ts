/**
 * 검색 인덱스 — 실공유: 오늘 주제만 (전투 글·필러 제안 없음).
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
    id: "t1",
    kind: "proposal",
    title: "의대 정원 확대는 필요하다",
    subtitle: "오늘 전장 · 제 1회 진행 중",
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
