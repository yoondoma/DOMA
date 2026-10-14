"use client";

import type { TitleDetail } from "@/lib/profile-mock";
import type { ScoreEvent } from "@/lib/types/gamification";

type RecordDetailScreenProps = {
  open: boolean;
  kind: "title" | "score" | "battle";
  title?: TitleDetail | null;
  event?: ScoreEvent | null;
  battle?: {
    date: string;
    round: number;
    topic: string;
    result: "win" | "loss";
    delta: number;
    joinedAs: "NEXUS" | "AEGIS";
    winnerPercent: number;
  } | null;
  onClose: () => void;
};

/** 칭호·전과·점수 이벤트 상세 · Pure B&W 텍스트 */
export function RecordDetailScreen({
  open,
  kind,
  title,
  event,
  battle,
  onClose,
}: RecordDetailScreenProps) {
  if (!open) return null;

  const heading =
    kind === "title" ? "칭호 상세" : kind === "score" ? "포인트 기록" : "전투 상세";

  return (
    <div
      className="fixed inset-0 z-[75] flex justify-center bg-black text-white"
      role="dialog"
      aria-modal
      aria-label={heading}
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
            {heading}
          </p>
          <span className="w-12" aria-hidden />
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
          {kind === "title" && title ? (
            <>
              <p className="font-[family-name:var(--font-syne)] text-[20px] font-bold tracking-tight">
                {title.label}
              </p>
              <p className="mt-2 text-[12px] tracking-[0.12em] text-neutral-200">
                {title.date} · {title.type}
              </p>
              <p className="mt-6 text-[13px] text-neutral-200">
                제 {title.round} 도마
              </p>
              <p className="mt-2 text-[15px] leading-[1.5] text-white">
                {title.topic}
              </p>
              <p className="mt-6 border-t border-neutral-800 pt-4 text-[14px] leading-[1.55] text-neutral-200">
                {title.note}
              </p>
            </>
          ) : null}

          {kind === "score" && event ? (
            <>
              <p className="text-[12px] text-neutral-200">
                {event.date.slice(5).replace("-", "/")} · 제 {event.round} 도마
              </p>
              <p className="mt-3 font-[family-name:var(--font-syne)] text-[28px] font-bold tabular-nums">
                {event.result === "win" ? "승" : "패"}{" "}
                <span className="text-[20px]">
                  {event.delta > 0 ? "+" : ""}
                  {event.delta}
                </span>
              </p>
              <p className="mt-1 text-[13px] tabular-nums text-neutral-200">
                반영 후 score {event.scoreAfter}
              </p>
              <p className="mt-6 text-[15px] leading-[1.5] text-white">
                {event.topic}
              </p>
              <p className="mt-6 text-[12px] tracking-[0.08em] text-neutral-200">
                승 +1 · 패 −0.5
              </p>
            </>
          ) : null}

          {kind === "battle" && battle ? (
            <>
              <p className="text-[12px] text-neutral-200">
                {battle.date.slice(5).replace("-", "/")} · 제 {battle.round} 도마
              </p>
              <p className="mt-3 font-[family-name:var(--font-syne)] text-[28px] font-bold">
                {battle.result === "win" ? "승" : "패"}
              </p>
              <p className="mt-1 text-[13px] tabular-nums text-neutral-200">
                {battle.joinedAs === "NEXUS" ? "도전자" : "방어자"} · 결과{" "}
                {battle.winnerPercent}% ·{" "}
                {battle.delta > 0 ? "+" : ""}
                {battle.delta}pt
              </p>
              <p className="mt-6 text-[15px] leading-[1.5] text-white">
                {battle.topic}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
