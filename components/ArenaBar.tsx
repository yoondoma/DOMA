"use client";

import { ShieldMark, SpearMark } from "@/components/SideMarks";
import type { ArenaState, Side } from "@/lib/types";

type ArenaBarProps = {
  arena: ArenaState;
  nexusPercent: number;
  aegisPercent: number;
  focus: Side;
  onFocusChange: (side: Side) => void;
  onJoin: (side: Side) => void;
  joined: Side | null;
};

function CrackDivider() {
  return (
    <svg
      className="pointer-events-none absolute inset-y-0 left-1/2 z-10 h-full w-5 -translate-x-1/2"
      viewBox="0 0 20 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M10 0 7 12 12 22 6 38 13 52 8 68 14 82 10 100"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M10 0 8 12 13 22 7 38 14 52 9 68 15 82 10 100"
        fill="none"
        stroke="#a3a3a3"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        opacity="0.7"
      />
    </svg>
  );
}

/** 스크롤 전 첫 화면: 주제 · 검투사(창/방패) · 비율만 */
export function ArenaBar({
  arena,
  nexusPercent,
  aegisPercent,
  focus,
  onFocusChange,
  onJoin,
  joined,
}: ArenaBarProps) {
  const isNexus = focus === "NEXUS";

  return (
    <section
      className="flex min-h-[calc(100dvh-9.5rem)] flex-col bg-black"
      aria-label="아레나 기본창"
    >
      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col">
        <div className="px-4 pb-2 pt-4 text-center">
          <p className="text-[11px] tracking-[0.18em] text-muted">
            제 {arena.round} 도마
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-syne)] text-[20px] font-bold leading-snug tracking-tight text-white sm:text-[22px]">
            {arena.topic}
          </h2>
        </div>

        <div
          className="flex flex-1 items-center"
          role="tablist"
          aria-label="검투사 진영"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isNexus}
            aria-label="창 검투사"
            onClick={() => onFocusChange("NEXUS")}
            className={`flex h-full min-h-[200px] flex-1 flex-col items-center justify-center gap-3 border-y transition-colors ${
              isNexus
                ? "border-white bg-white/[0.04] text-white"
                : "border-white/15 text-muted"
            }`}
          >
            <SpearMark size={48} />
            <span className="text-[11px] font-bold tracking-[0.2em]">창</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isNexus}
            aria-label="방패 검투사"
            onClick={() => onFocusChange("AEGIS")}
            className={`flex h-full min-h-[200px] flex-1 flex-col items-center justify-center gap-3 border-y transition-colors ${
              !isNexus
                ? "border-white bg-white text-black"
                : "border-white/15 text-muted"
            }`}
          >
            <ShieldMark size={48} />
            <span className="text-[11px] font-bold tracking-[0.2em]">방패</span>
          </button>
        </div>

        <div className="relative mt-auto flex min-h-[100px] w-full overflow-hidden border-t border-white/20">
          <CrackDivider />
          <button
            type="button"
            onClick={() => {
              onFocusChange("NEXUS");
              onJoin("NEXUS");
            }}
            aria-label="창 진영 지지"
            className={`relative flex flex-1 flex-col items-start justify-center gap-1 bg-black px-3 py-4 text-left text-white transition-opacity ${
              joined === "NEXUS" ? "opacity-100" : "active:opacity-80"
            }`}
            style={{ flexBasis: `${nexusPercent}%` }}
          >
            <span className="inline-flex items-center gap-1.5">
              <SpearMark size={18} />
              <span className="text-[15px] font-bold tabular-nums tracking-wide">
                {nexusPercent}%
              </span>
            </span>
            <span className="text-[10px] text-muted">
              {joined === "NEXUS" ? "참전 중" : "지지"} ·{" "}
              {arena.nexusVotes.toLocaleString("ko-KR")}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              onFocusChange("AEGIS");
              onJoin("AEGIS");
            }}
            aria-label="방패 진영 지지"
            className={`relative flex flex-1 flex-col items-end justify-center gap-1 bg-white px-3 py-4 text-right text-black transition-opacity ${
              joined === "AEGIS" ? "opacity-100" : "active:opacity-80"
            }`}
            style={{ flexBasis: `${aegisPercent}%` }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[15px] font-bold tabular-nums tracking-wide">
                {aegisPercent}%
              </span>
              <ShieldMark size={18} />
            </span>
            <span className="text-[10px] text-neutral-500">
              {joined === "AEGIS" ? "참전 중" : "지지"} ·{" "}
              {arena.aegisVotes.toLocaleString("ko-KR")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
