import { DailyTitleStamp } from "@/components/gamification/DailyTitleStamp";
import { TierBadge } from "@/components/gamification/TierBadge";
import type {
  DailyTitle,
  UserProfileType,
} from "@/lib/types/gamification";
import { WIN_TIERS } from "@/lib/types/gamification";

type UserProfileCardProps = {
  user: UserProfileType;
  className?: string;
  /** 일일 칭호 전파 카드 열기 */
  onPropagateTitle?: (title: DailyTitle) => void;
};

function tierProgress(totalWins: number, minWins: number, nextAt: number | null) {
  if (nextAt == null) {
    // ARCHITECT — 만랩 구간 표시
    const last = WIN_TIERS[WIN_TIERS.length - 1];
    const span = 160;
    const p = Math.min(1, (totalWins - last.minWins) / span);
    return { pct: Math.round(p * 100), label: "최상위" };
  }
  const span = Math.max(1, nextAt - minWins);
  const p = Math.min(1, Math.max(0, (totalWins - minWins) / span));
  return {
    pct: Math.round(p * 100),
    label: `다음 ${nextAt}승`,
  };
}

/**
 * 프로필 모달/페이지용 카드 — 티어·승수 바·일일 칭호
 * Pure B&W only
 */
export function UserProfileCard({
  user,
  className = "",
  onPropagateTitle,
}: UserProfileCardProps) {
  const { currentTier: t, totalWins, dailyTitles, username } = user;
  const progress = tierProgress(totalWins, t.minWins, t.nextTierAt);

  return (
    <article
      className={[
        "border border-neutral-200 bg-black text-white",
        className,
      ].join(" ")}
      aria-label={`${username} 티어 카드`}
    >
      <div className="flex items-start justify-between gap-3 px-3 py-3">
        <div className="min-w-0">
          <p className="truncate font-[family-name:var(--font-syne)] text-[16px] font-bold tracking-tight">
            {username}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <TierBadge tier={t.code} subTier={t.subtier} />
            <span className="text-[11px] tracking-[0.08em] text-neutral-200">
              {t.displayKo}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] tracking-[0.14em] text-neutral-200">
            누적 승
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-syne)] text-[22px] font-bold tabular-nums leading-none">
            {totalWins}
          </p>
        </div>
      </div>

      <div className="border-t border-neutral-800 px-3 py-3">
        <div className="mb-1.5 flex items-center justify-between text-[10px] tracking-[0.1em] text-neutral-200">
          <span>
            {t.code} → {t.nextTierAt != null ? "NEXT" : "MAX"}
          </span>
          <span className="tabular-nums">
            {progress.pct}% · {progress.label}
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden border border-neutral-200 bg-neutral-800"
          role="progressbar"
          aria-valuenow={progress.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="티어 진행"
        >
          <div
            className="h-full bg-white transition-[width] duration-300"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </div>

      {dailyTitles.length > 0 ? (
        <div className="border-t border-neutral-800 px-3 py-3">
          <p className="mb-2 text-[10px] font-bold tracking-[0.16em] text-neutral-200">
            일일 칭호
          </p>
          <ul className="flex flex-wrap gap-1.5" aria-label="보유 일일 칭호">
            {dailyTitles.map((badge) => (
              <li key={`${badge.date}-${badge.type}`}>
                {onPropagateTitle ? (
                  <button
                    type="button"
                    onClick={() => onPropagateTitle(badge)}
                    className="text-left transition-opacity active:opacity-70"
                    aria-label={`${badge.label} 전파 카드`}
                  >
                    <DailyTitleStamp badge={badge} />
                  </button>
                ) : (
                  <DailyTitleStamp badge={badge} />
                )}
              </li>
            ))}
          </ul>
          {onPropagateTitle && dailyTitles[0] ? (
            <button
              type="button"
              onClick={() => onPropagateTitle(dailyTitles[0])}
              className="mt-3 w-full border border-neutral-200 py-2 text-[11px] font-bold tracking-[0.14em] text-white"
            >
              칭호 전파 카드
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
