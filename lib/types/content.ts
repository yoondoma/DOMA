/**
 * 글·미디어 한도 — 스펙: content-rules
 */

export const CONTENT_LIMITS = {
  /** 내일 주제 제안 */
  proposal: 500,
  /** 댓글 */
  reply: 280,
  /** 오늘 의견 — 잠정 500 */
  opinion: 500,
  /** 이미지 최대 장수 */
  images: 3,
  /** 연속 작성 쿨다운 (ms) */
  composeCooldownMs: 3 * 60_000,
} as const;

export type ComposeMedia = {
  imageNames?: string[];
  link?: string;
};

export function formatComposeMediaSuffix(media?: ComposeMedia): string {
  if (!media) return "";
  const parts: string[] = [];
  const n = media.imageNames?.length ?? 0;
  if (n > 0) parts.push(n === 1 ? "[이미지]" : `[이미지 ${n}]`);
  if (media.link?.trim()) parts.push(`[링크]`);
  return parts.length ? ` · ${parts.join(" ")}` : "";
}

export function cooldownRemainingMs(
  lastComposeAtUtc: string | undefined,
  nowMs = Date.now(),
): number {
  if (!lastComposeAtUtc) return 0;
  const elapsed = nowMs - new Date(lastComposeAtUtc).getTime();
  return Math.max(0, CONTENT_LIMITS.composeCooldownMs - elapsed);
}

export function formatCooldownToast(remainingMs: number): string {
  const sec = Math.ceil(remainingMs / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m > 0) return `작성 쿨다운 ${m}분 ${s}초 남음`;
  return `작성 쿨다운 ${s}초 남음`;
}
