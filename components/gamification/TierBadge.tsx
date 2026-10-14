import { TierEmblem } from "@/components/gamification/TierEmblem";
import type { Subtier, TierCode } from "@/lib/types/gamification";
import { TIER_CODES } from "@/lib/types/gamification";

type TierBadgeProps = {
  tier: TierCode;
  /** @deprecated 로마가 티어 코드 — 무시해도 됨 */
  subTier?: Subtier;
  className?: string;
  /** 문양만 (라벨 숨김) */
  emblemOnly?: boolean;
};

/** ARCHITECT · I = 반전 뱃지 */
const INVERTED_FROM = TIER_CODES.indexOf("I");

export function isInvertedTier(tier: TierCode): boolean {
  return TIER_CODES.indexOf(tier) >= INVERTED_FROM;
}

/**
 * Pure B&W 티어 뱃지 — 기하 엠블럼 + [ARCHITECT]·[II]·[BRONZE]
 * glow 없음 · 선·대비만
 */
export function TierBadge({
  tier,
  className = "",
  emblemOnly = false,
}: TierBadgeProps) {
  const inverted = isInvertedTier(tier);
  const label = tier;

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1 px-1.5 py-0.5",
        "font-[family-name:var(--font-syne)] text-[9px] font-bold leading-none tracking-[0.08em]",
        inverted
          ? "border-2 border-black bg-white text-black ring-1 ring-white"
          : "border border-neutral-200 bg-black text-white",
        className,
      ].join(" ")}
      title={label}
      aria-label={`티어 ${label}`}
      data-tier={tier}
      data-tier-emblem
    >
      <TierEmblem tier={tier} size={11} />
      {emblemOnly ? null : <span>[{label}]</span>}
    </span>
  );
}
