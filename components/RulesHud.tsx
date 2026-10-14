"use client";

import { useDomaStore } from "@/lib/store";
import { QUOTA_LIMITS, remainingOf } from "@/lib/types/quota";

type RulesHudProps = {
  light?: boolean;
  className?: string;
};

/**
 * 초소형 잔여 HUD — 주제 옆·오른쪽. 주제를 가리거나 맞먹지 않음.
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
      aria-label="남은 참여 횟수"
      data-rules-hud
      data-hud-align="right"
    >
      <span className={`text-[9px] leading-none tracking-[0.02em] ${ink}`}>
        <span className={faint}>♥</span> {likes.remaining}/{likes.max}
      </span>
      <span className={`text-[9px] leading-none tracking-[0.02em] ${ink}`}>
        <span className={faint}>이동</span> {moves.remaining}/{moves.max}
      </span>
    </div>
  );
}
