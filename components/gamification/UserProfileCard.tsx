import type {
  DailyTitle,
  UserProfileType,
} from "@/lib/types/gamification";
import { TierBadge } from "@/components/gamification/TierBadge";

type UserProfileCardProps = {
  user: UserProfileType;
  className?: string;
  /** 일일 칭호 전파 카드 열기 */
  onPropagateTitle?: (title: DailyTitle) => void;
};

/**
 * 프로필용 칭호 블록 — 보더/프로그레스 없이 텍스트만
 * Pure B&W
 */
export function UserProfileCard({
  user,
  className = "",
  onPropagateTitle,
}: UserProfileCardProps) {
  const { currentTier: t, totalWins, dailyTitles, username } = user;
  const primary = dailyTitles[0];

  return (
    <div
      className={["text-white", className].join(" ")}
      aria-label={`${username} 칭호`}
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <TierBadge tier={t.code} subTier={t.subtier} />
        <span className="text-[13px] tracking-[0.04em] text-neutral-200">
          {t.displayKo}
        </span>
        <span className="text-[12px] tabular-nums text-neutral-200">
          · {totalWins}승
        </span>
      </div>

      {dailyTitles.length > 0 ? (
        <ul className="mt-3 space-y-1.5" aria-label="일일 칭호">
          {dailyTitles.map((badge) => (
            <li key={`${badge.date}-${badge.type}`}>
              {onPropagateTitle ? (
                <button
                  type="button"
                  onClick={() => onPropagateTitle(badge)}
                  className="text-left text-[13px] tracking-[0.02em] text-white transition-opacity active:opacity-60"
                  aria-label={`${badge.label} 전파 카드`}
                >
                  {badge.label}
                </button>
              ) : (
                <span className="text-[13px] tracking-[0.02em] text-white">
                  {badge.label}
                </span>
              )}
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
