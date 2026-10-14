/**
 * 전황 티커 목 — 지지 횟수·진영 % 중심.
 * 가짜 “지지력 점수” 암시 금지.
 */

export type WarTickerKind = "status" | "warn";

export type WarTickerItem = {
  id: string;
  kind: WarTickerKind;
  text: string;
};

export const WAR_TICKER_ITEMS: WarTickerItem[] = [
  {
    id: "wt-1",
    kind: "status",
    text: "[전황] @pulse 님이 도전자 진영에 지지를 더했습니다",
  },
  {
    id: "wt-2",
    kind: "warn",
    text: "[경고] 방어자 측 지지 격차가 벌어지고 있습니다",
  },
  {
    id: "wt-3",
    kind: "status",
    text: "[전황] 도전자 58% · 방어자 42% · 판결까지 진행 중",
  },
  {
    id: "wt-4",
    kind: "status",
    text: "[전황] @mira.k 님이 방어자 진영에 지지를 더했습니다",
  },
  {
    id: "wt-5",
    kind: "warn",
    text: "[경고] 지지 격차 16%p · 전세가 흔들리고 있습니다",
  },
];
