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

/** 티어 상세 — 로마 사다리 · 시즌 최종+최고 · 승패 기록 */
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
  const peak = user.tierPeakSeason ?? t.code;
  const seasons = user.seasonHistory ?? [];
  const winsSeason = user.winsSeason ?? user.score;

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-center bg-black text-white"
      role="dialog"
      aria-modal
      aria-label="티어 상세"
      data-tier-detail
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
            <TierBadge tier={t.code} />
            <span className="text-[16px] font-semibold">{t.displayKo}</span>
          </div>
          <p className="mt-2 text-[13px] tabular-nums text-neutral-200">
            이번 시즌 승 {winsSeason} · 통산 승 {user.wins} · 패 {user.losses}
          </p>
          <p className="mt-1 text-[11px] tracking-[0.06em] text-neutral-200">
            승 +{POINT_RULES.WIN} · 패 {POINT_RULES.LOSS} · 비율 순위(목)
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-neutral-200">
            <span>시즌 최고</span>
            <TierBadge tier={peak} />
            <span className="text-neutral-500">·</span>
            <span>현재</span>
            <TierBadge tier={t.code} />
          </p>

          <p className="mt-8 text-[11px] font-bold tracking-[0.16em] text-neutral-200">
            사다리
          </p>
          <p className="mt-1 text-[11px] text-neutral-200">
            ARCHITECT → I → II → III → IV → BRONZE
          </p>
          <ul className="mt-2 border-y border-neutral-800" data-tier-ladder>
            {[...SCORE_TIERS].reverse().map((row) => {
              const i = SCORE_TIERS.findIndex((x) => x.code === row.code);
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
                  <span className="inline-flex items-center gap-2">
                    <TierBadge tier={row.code} />
                    {row.label}
                  </span>
                  <span className="tabular-nums text-[11px]">
                    {relation} · {row.cut}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[12px] text-neutral-200">
            {neigh.above
              ? `다음 ${neigh.above.label}`
              : "최상위 ARCHITECT"}
            {neigh.below ? ` · 아래 ${neigh.below.label}` : ""}
          </p>

          <p className="mt-8 text-[11px] font-bold tracking-[0.16em] text-neutral-200">
            시즌 기록
          </p>
          {seasons.length === 0 ? (
            <p className="mt-2 text-[13px] text-neutral-200">
              지난 시즌 기록이 없습니다.
            </p>
          ) : (
            <ul className="mt-2 border-y border-neutral-800" data-season-history>
              {seasons.map((s) => (
                <li
                  key={s.seasonId}
                  className="flex flex-col gap-1.5 border-b border-neutral-800 py-3 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[13px] font-semibold text-white">
                      {s.label}
                    </span>
                    <span className="text-[11px] tabular-nums text-neutral-200">
                      승 {s.wins}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[12px] text-neutral-200">
                    <span>최종</span>
                    <TierBadge tier={s.tierFinal} />
                    <span className="text-neutral-600">·</span>
                    <span>최고</span>
                    <TierBadge tier={s.tierPeak} />
                  </div>
                </li>
              ))}
            </ul>
          )}

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
                      {ev.date.slice(5).replace("-", "/")} · 제 {ev.round}회 전투
                    </span>
                    <span className="tabular-nums text-white">
                      {ev.result === "win" ? "승" : "패"}{" "}
                      {ev.delta > 0 ? `+${ev.delta}` : ev.delta} → {ev.scoreAfter}
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
