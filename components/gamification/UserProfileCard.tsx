import { GirdleMark } from "@/components/SideMarks";
import { TierBadge } from "@/components/gamification/TierBadge";
import { resolveCosmetics } from "@/lib/types/cosmetics";
import type {
  DailyTitle,
  UserProfileType,
} from "@/lib/types/gamification";

type UserProfileCardProps = {
  user: UserProfileType;
  className?: string;
  /** 티어 뱃지/표기 탭 */
  onOpenTier?: () => void;
  /** 일일 칭호 탭 → 상세 */
  onOpenTitle?: (title: DailyTitle) => void;
  /** 전파 카드 (선택) */
  onPropagateTitle?: (title: DailyTitle) => void;
};

/**
 * 프로필용 칭호 블록 — 텍스트만 · score 표기
 * Pure B&W
 */
export function UserProfileCard({
  user,
  className = "",
  onOpenTier,
  onOpenTitle,
  onPropagateTitle,
}: UserProfileCardProps) {
  const { currentTier: t, score, dailyTitles, username } = user;
  const primary = dailyTitles[0];
  const cosmetics = resolveCosmetics(user.cosmetics);

  return (
    <div
      className={["text-white", className].join(" ")}
      aria-label={`${username} 칭호`}
      data-cosmetic-frame={cosmetics.frame ?? "bw"}
      data-cosmetic-handle={cosmetics.handleEffect ?? "bw"}
    >
      <button
        type="button"
        onClick={onOpenTier}
        className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-left"
        aria-label={`티어 ${t.display}`}
        data-profile-tier
      >
        <TierBadge tier={t.code} />
        <span className="text-[13px] tracking-[0.04em] text-neutral-200">
          {t.displayKo}
        </span>
        <span className="text-[12px] tabular-nums text-neutral-200">
          · 시즌 승 {user.winsSeason ?? score}
        </span>
        {user.tierPeakSeason ? (
          <span className="text-[11px] text-neutral-500">
            · 최고 {user.tierPeakSeason}
          </span>
        ) : null}
      </button>

      {dailyTitles.length > 0 ? (
        <ul className="mt-3 space-y-1.5" aria-label="일일 칭호">
          {dailyTitles.map((badge) => (
            <li key={`${badge.date}-${badge.type}`}>
              <button
                type="button"
                onClick={() => {
                  if (onOpenTitle) onOpenTitle(badge);
                  else onPropagateTitle?.(badge);
                }}
                className="inline-flex items-center gap-1.5 text-left text-[13px] tracking-[0.02em] text-white transition-opacity active:opacity-60"
                aria-label={`${badge.label} 상세`}
              >
                {badge.type === "PROPOSER" ? (
                  <GirdleMark size={12} className="text-white" />
                ) : null}
                {badge.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {onPropagateTitle && primary ? (
        <button
          type="button"
          onClick={() => onPropagateTitle(primary)}
          className="mt-3 text-[11px] tracking-[0.14em] text-neutral-200 underline underline-offset-4"
        >
          전파 카드
        </button>
      ) : null}
    </div>
  );
}
