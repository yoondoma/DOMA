/**
 * 전황 티커 — 실공유: 채터 없음 (빈 트랙).
 */

export type WarTickerKind = "status" | "warn";

export type WarTickerItem = {
  id: string;
  kind: WarTickerKind;
  text: string;
};

export const WAR_TICKER_ITEMS: WarTickerItem[] = [];
