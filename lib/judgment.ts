/**
 * 판결 타이브레이크 — 스펙: battle-rules (얇은 구현)
 * 1) 지지 다수 2) 동점이면 총 좋아요 3) 둘 다 동점이면 공동 승리
 */

import type { Side } from "@/lib/types";

export type CampTotals = {
  supports: number;
  likes: number;
};

export type CampVerdict =
  | { kind: "win"; winner: Side }
  | { kind: "joint" };

export function resolveCampVerdict(
  challenger: CampTotals,
  defender: CampTotals,
): CampVerdict {
  if (challenger.supports !== defender.supports) {
    return {
      kind: "win",
      winner:
        challenger.supports > defender.supports ? "NEXUS" : "AEGIS",
    };
  }
  if (challenger.likes !== defender.likes) {
    return {
      kind: "win",
      winner: challenger.likes > defender.likes ? "NEXUS" : "AEGIS",
    };
  }
  return { kind: "joint" };
}

/** 의견 정렬 — 지지 → 좋아요 */
export function compareByJudgmentAuthority<
  T extends { supports?: number; likes?: number },
>(a: T, b: T): number {
  const ds = (b.supports ?? 0) - (a.supports ?? 0);
  if (ds !== 0) return ds;
  return (b.likes ?? 0) - (a.likes ?? 0);
}
