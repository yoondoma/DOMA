"use client";

import { useDomaStore } from "@/lib/store";
import { QUOTA_LIMITS, remainingOf } from "@/lib/types/quota";

type RulesHudProps = {
  light?: boolean;
  className?: string;
};

/**
 * 남은 횟수 HUD — 게임 피/목숨 톤, 과하지 않게
 * 좋아요 n/5 · 진영이동 n/3 · 글 n/1
 */
export function RulesHud({ light, className = "" }: RulesHudProps) {
  const quota = useDomaStore().quota;
  const likes = remainingOf(quota.likesUsed, QUOTA_LIMITS.likes);
  const moves = remainingOf(quota.campMovesUsed, QUOTA_LIMITS.campMoves);
  const posts = remainingOf(quota.postsUsed, QUOTA_LIMITS.posts);

  const chip = light
    ? "border-black/20 bg-black/[0.04] text-black/75"
    : "border-white/20 bg-white/[0.06] text-white/80";
  const low = light ? "text-black" : "text-white";

  const Cell = ({
    label,
    remaining,
    max,
  }: {
    label: string;
    remaining: number;
    max: number;
  }) => (
    <span
      className={`inline-flex items-baseline gap-1 border px-2 py-1 text-[11px] tracking-[0.04em] tabular-nums ${chip} ${
        remaining === 0 ? low : ""
      }`}
    >
      <span className={light ? "text-black/45" : "text-white/45"}>{label}</span>
      <span className="font-semibold">
        {remaining}/{max}
      </span>
    </span>
  );

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}
      aria-label="남은 참여 횟수"
      data-rules-hud
    >
      <Cell label="좋아요" remaining={likes.remaining} max={likes.max} />
      <Cell label="진영이동" remaining={moves.remaining} max={moves.max} />
      <Cell label="글" remaining={posts.remaining} max={posts.max} />
    </div>
  );
}
