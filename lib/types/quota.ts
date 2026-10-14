/**
 * 일일 참여 한도 — 세션 유저 기준 목 카운터
 * 스펙: docs/battle-rules (스토어 메모)
 */

export const QUOTA_LIMITS = {
  likes: 5,
  campMoves: 3,
  posts: 1,
  proposals: 1,
} as const;

/** 사용량 (남은 횟수 = max - used) */
export type SessionQuota = {
  likesUsed: number;
  campMovesUsed: number;
  postsUsed: number;
  proposalsUsed: number;
};

export function emptyQuota(): SessionQuota {
  return {
    likesUsed: 0,
    campMovesUsed: 0,
    postsUsed: 0,
    proposalsUsed: 0,
  };
}

export function remainingOf(
  used: number,
  max: number,
): { remaining: number; max: number } {
  return { remaining: Math.max(0, max - used), max };
}
