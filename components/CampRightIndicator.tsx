"use client";

import { ShieldMark, SpearMark } from "@/components/SideMarks";
import type { Side } from "@/lib/types";

type CampRightIndicatorProps = {
  joined: Side | null;
  /** 미선택 시 하단 지지바 쪽으로 유도 */
  onPickHint?: () => void;
  className?: string;
};

/**
 * 오늘 전장 — 화면 오른쪽 현재 진영.
 * 심볼(창/방패) 우선. 미선택이면 짧은 선택 유도만.
 */
export function CampRightIndicator({
  joined,
  onPickHint,
  className = "",
}: CampRightIndicatorProps) {
  const isChallenger = joined === "NEXUS";
  const isDefender = joined === "AEGIS";
  const empty = joined == null;

  return (
    <aside
      className={`pointer-events-auto fixed right-2 z-[42] flex flex-col items-center sm:right-[max(0.5rem,calc(50%-280px+0.5rem))] ${className}`}
      style={{
        top: "50%",
        transform: "translateY(-50%)",
      }}
      aria-label={
        isChallenger
          ? "현재 진영 도전자"
          : isDefender
            ? "현재 진영 방어자"
            : "진영 미선택"
      }
      data-camp-right
      data-camp={joined ?? "none"}
    >
      {empty ? (
        <button
          type="button"
          onClick={onPickHint}
          className="thumb-press r-md flex size-11 flex-col items-center justify-center gap-0.5 border border-edge bg-card/95 text-meta backdrop-blur-sm"
          aria-label="하단에서 진영 선택"
          title="하단에서 선택"
          data-camp-empty
        >
          <span className="relative flex size-5 items-center justify-center opacity-50">
            <SpearMark size={11} className="absolute -translate-x-1" />
            <ShieldMark size={11} className="absolute translate-x-1" />
          </span>
          <span className="text-[8px] font-medium tracking-[0.06em]">선택</span>
        </button>
      ) : (
        <div
          className={`r-md flex size-11 items-center justify-center border backdrop-blur-sm ${
            isChallenger
              ? "border-edge bg-ink text-paper"
              : "border-[rgba(5,5,5,0.12)] bg-defend text-ink"
          }`}
          data-camp-joined={joined}
        >
          {isChallenger ? (
            <SpearMark size={20} />
          ) : (
            <ShieldMark size={20} />
          )}
        </div>
      )}
    </aside>
  );
}
