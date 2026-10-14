import type { Subtier, TierCode } from "@/lib/types/gamification";
import { TIER_CODES } from "@/lib/types/gamification";

type TierBadgeProps = {
  tier: TierCode;
  subTier: Subtier;
  /** 기본 compact — 글 작성자 옆 */
  className?: string;
};

/** MASTER 이상 = 백색 반전 + 묵직한 보더 아우라 */
const INVERTED_FROM = TIER_CODES.indexOf("MASTER");

export function isInvertedTier(tier: TierCode): boolean {
  return TIER_CODES.indexOf(tier) >= INVERTED_FROM;
}

/**
 * Pure B&W 티어 뱃지 — 예: [DIAMOND II]
 * 상위(MASTER~): 흰 바탕·검정 글·2px 보더
 */
export function TierBadge({ tier, subTier, className = "" }: TierBadgeProps) {
  const inverted = isInvertedTier(tier);
  const label = `${tier} ${subTier}`;

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center px-1.5 py-0.5",
        "font-[family-name:var(--font-syne)] text-[9px] font-bold leading-none tracking-[0.08em]",
        inverted
          ? "border-2 border-black bg-white text-black ring-1 ring-white"
          : "border border-neutral-200 bg-black text-white",
        className,
      ].join(" ")}
      title={label}
      aria-label={`티어 ${label}`}
    >
      [{label}]
    </span>
  );
}
