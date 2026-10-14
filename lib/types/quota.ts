/**
 * 일일 투표·진영 한도 — 세션 유저 기준 목 카운터
 * 발언(글·제안·댓글)은 제한 없음. 스펙: battle-rules
 */

export const QUOTA_LIMITS = {
  likes: 5,
  campMoves: 3,
} as const;

/** 사용량 (남은 횟수 = max - used) */
export type SessionQuota = {
  likesUsed: number;
  campMovesUsed: number;
  /** @deprecated 발언 제한 해제 — 호환용 유지 */
  postsUsed?: number;
  /** @deprecated 발언 제한 해제 — 호환용 유지 */
  proposalsUsed?: number;
};

export function emptyQuota(): SessionQuota {
  return {
    likesUsed: 0,
    campMovesUsed: 0,
  };
}

export function remainingOf(
  used: number,
  max: number,
): { remaining: number; max: number } {
  return { remaining: Math.max(0, max - used), max };
}
