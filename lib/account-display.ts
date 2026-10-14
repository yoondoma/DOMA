/**
 * 탈퇴 유저 표시 — 스펙: account-trust.md A안
 * 본문은 남기고 표시명만 「탈퇴한 사용자」.
 */

export const LEFT_USER_LABEL = "탈퇴한 사용자";

export type UserLike = {
  handle?: string | null;
  displayName?: string | null;
  leftAtUtc?: string | null;
};

/** 피드·댓글·프로필에 보이는 이름 (핸들 자리) */
export function publicAuthorLabel(user: UserLike | null | undefined): string {
  if (!user) return "user";
  if (user.leftAtUtc) return LEFT_USER_LABEL;
  return (user.handle || user.displayName || "user").replace(/^@/, "");
}

export function isLeftUser(user: UserLike | null | undefined): boolean {
  return Boolean(user?.leftAtUtc);
}
