"use client";

import { useDomaStore } from "@/lib/store";
import { QUOTA_LIMITS, remainingOf } from "@/lib/types/quota";

type RulesHudProps = {
  light?: boolean;
  className?: string;
};

/** 진영이동 — 전환 화살 심볼 */
function CampMoveMark({ className = "" }: { className?: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <path
        d="M3 5.5h8.5M9 2.5l3.5 3-3.5 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 10.5H4.5M7 13.5l-3.5-3 3.5-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 초소형 잔여 HUD — 심볼 + 숫자만. 주제 우측.
 */
export function RulesHud({ light, className = "" }: RulesHudProps) {
  const quota = useDomaStore().quota;
  const likes = remainingOf(quota.likesUsed, QUOTA_LIMITS.likes);
  const moves = remainingOf(quota.campMovesUsed, QUOTA_LIMITS.campMoves);
  const faint = light ? "text-black/40" : "text-white/40";
  const ink = light ? "text-black/70" : "text-white/70";

  return (
    <div
      className={`flex flex-col items-end gap-0.5 tabular-nums ${className}`}
      aria-label={`좋아요 ${likes.remaining}/${likes.max} · 진영이동 ${moves.remaining}/${moves.max}`}
      data-rules-hud
      data-hud-align="right"
      data-hud-symbols
    >
      <span
        className={`inline-flex items-center gap-0.5 text-[9px] leading-none ${ink}`}
        title="좋아요 잔여"
      >
        <span className={faint} aria-hidden>
          ♥
        </span>
        {likes.remaining}/{likes.max}
      </span>
      <span
        className={`inline-flex items-center gap-0.5 text-[9px] leading-none ${ink}`}
        title="진영이동 잔여"
      >
        <CampMoveMark className={faint} />
        {moves.remaining}/{moves.max}
      </span>
    </div>
  );
}
