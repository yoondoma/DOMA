"use client";

import { TierBadge } from "@/components/gamification/TierBadge";
import {
  POINT_RULES,
  SCORE_TIERS,
  neighboringTiers,
  type ScoreEvent,
  type UserProfileType,
} from "@/lib/types/gamification";

type TierDetailScreenProps = {
  open: boolean;
  user: UserProfileType;
  history: ScoreEvent[];
  onClose: () => void;
  onOpenEvent?: (ev: ScoreEvent) => void;
};

/** 티어 상세 — 위·아래 수준 + 승패·포인트 히스토리 */
export function TierDetailScreen({
  open,
  user,
  history,
  onClose,
  onOpenEvent,
}: TierDetailScreenProps) {
  if (!open) return null;

  const t = user.currentTier;
  const neigh = neighboringTiers(t.code);
  const curIdx = SCORE_TIERS.findIndex((x) => x.code === t.code);

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-center bg-black text-white"
      role="dialog"
      aria-modal
      aria-label="티어 상세"
    >
      <div className="flex h-dvh w-full max-w-[560px] flex-col border-x border-neutral-800">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-800 bg-black px-3 py-3">
          <button
            type="button"
            onClick={onClose}
            className="px-1 py-1 text-[14px] text-neutral-200"
            aria-label="뒤로"
          >
            ← 뒤로
          </button>
          <p className="flex-1 text-center text-[12px] font-bold tracking-[0.18em]">
            티어
          </p>
          <span className="w-12" aria-hidden />
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
          <div className="flex flex-wrap items-baseline gap-2">
            <TierBadge tier={t.code} subTier={t.subtier} />
            <span className="text-[16px] font-semibold">{t.displayKo}</span>
          </div>
          <p className="mt-2 text-[13px] tabular-nums text-neutral-200">
            score {user.score} · 승 {user.wins} · 패 {user.losses}
          </p>
          <p className="mt-1 text-[11px] tracking-[0.06em] text-neutral-200">
            규칙: 승 +{POINT_RULES.WIN} · 패 {POINT_RULES.LOSS}
          </p>

          <p className="mt-8 text-[11px] font-bold tracking-[0.16em] text-neutral-200">
            수준
          </p>
          <ul className="mt-2 border-y border-neutral-800">
            {SCORE_TIERS.map((row, i) => {
              const isCur = row.code === t.code;
              const relation =
                i > curIdx ? "위" : i < curIdx ? "아래" : "현재";
              return (
                <li
                  key={row.code}
                  className={`flex items-baseline justify-between gap-3 border-b border-neutral-800 py-2.5 text-[13px] last:border-b-0 ${
                    isCur ? "text-white" : "text-neutral-200"
                  }`}
                >
                  <span>
                    {row.label}
                    {isCur ? ` ${t.subtier}` : ""}
                  </span>
                  <span className="tabular-nums text-[12px]">
                    {relation} · {row.minScore}pt~
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[12px] text-neutral-200">
            {neigh.above
              ? `다음 ${neigh.above.label} ${neigh.above.minScore}pt`
              : "최상위 ARCHITECT"}
            {neigh.below ? ` · 아래 ${neigh.below.label}` : ""}
          </p>

          <p className="mt-8 text-[11px] font-bold tracking-[0.16em] text-neutral-200">
            올라온 기록
          </p>
          <ul className="mt-2" aria-label="포인트 히스토리">
            {history.map((ev) => (
              <li key={ev.id} className="border-b border-neutral-800">
                <button
                  type="button"
                  onClick={() => onOpenEvent?.(ev)}
                  className="flex w-full flex-col gap-0.5 py-3 text-left"
                >
                  <div className="flex items-baseline justify-between gap-2 text-[12px] text-neutral-200">
                    <span>
                      {ev.date.slice(5).replace("-", "/")} · 제 {ev.round} 도마
                    </span>
                    <span className="tabular-nums text-white">
                      {ev.result === "win" ? "승" : "패"} {ev.delta > 0 ? "+" : ""}
                      {ev.delta} → {ev.scoreAfter}
                    </span>
                  </div>
                  <p className="text-[13px] leading-snug text-white">
                    {ev.topic}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
