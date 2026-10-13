"use client";

import { useState } from "react";
import { ShieldMark, SpearMark } from "@/components/SideMarks";
import type { ArenaState, Side } from "@/lib/types";

type ArenaBarProps = {
  arena: ArenaState;
  nexusPercent: number;
  aegisPercent: number;
  onJoin: (side: Side) => void;
  joined: Side | null;
  compact?: boolean;
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

export function ArenaBar({
  arena,
  nexusPercent,
  aegisPercent,
  onJoin,
  joined,
  compact = false,
}: ArenaBarProps) {
  const [focus, setFocus] = useState<Side>("NEXUS");
  const rep = arena.representatives[focus];
  const isNexus = focus === "NEXUS";

  return (
    <section className="border-b border-white/12 bg-black">
      <div className={`mx-auto max-w-[560px] ${compact ? "pt-3" : "pt-4"}`}>
        <div className="px-4 text-center">
          <p className="text-[11px] tracking-[0.18em] text-muted">
            제 {arena.round} 도마
          </p>
          <h2
            className={`mt-1 font-[family-name:var(--font-syne)] font-bold leading-snug tracking-tight text-white ${
              compact ? "text-[17px]" : "text-[19px]"
            }`}
          >
            {arena.topic}
          </h2>
        </div>

        <div
          className="mt-3 grid grid-cols-2 border-y border-white/20"
          role="tablist"
          aria-label="진영 선택"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isNexus}
            aria-label="창 진영"
            onClick={() => setFocus("NEXUS")}
            className={`flex min-h-11 items-center justify-center ${
              isNexus
                ? "border-b-2 border-white bg-white/[0.04] text-white"
                : "border-b-2 border-transparent text-muted"
            }`}
          >
            <SpearMark size={20} />
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isNexus}
            aria-label="방패 진영"
            onClick={() => setFocus("AEGIS")}
            className={`flex min-h-11 items-center justify-center ${
              !isNexus
                ? "border-b-2 border-white bg-white/[0.04] text-white"
                : "border-b-2 border-transparent text-muted"
            }`}
          >
            <ShieldMark size={20} />
          </button>
        </div>

        <div className="px-4 py-4 text-center">
          <div
            className={`mx-auto flex size-[72px] items-center justify-center rounded-full border text-[22px] font-bold tracking-wide ${
              isNexus
                ? "border-white bg-black text-white"
                : "border-white bg-white text-black"
            }`}
            aria-hidden
          >
            {rep.monogram}
          </div>
          <p className="mt-2.5 font-[family-name:var(--font-syne)] text-[16px] font-bold tracking-wide text-white">
            {rep.name}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">{rep.role}</p>

          <div className="mx-auto my-3 flex max-w-[220px] items-center gap-2">
            <span className="h-px flex-1 bg-white/25" />
            <span className="size-1 rotate-45 bg-white/70" />
            <span className="h-px flex-1 bg-white/25" />
          </div>

          <blockquote className="px-1 font-[family-name:var(--font-syne)] text-[15px] font-semibold leading-relaxed tracking-tight text-white">
            “{rep.quote}”
          </blockquote>
        </div>

        <div className="relative flex min-h-[88px] w-full overflow-hidden border-t border-white/20">
          <CrackDivider />
          <button
            type="button"
            onClick={() => onJoin("NEXUS")}
            aria-label="창 진영 지지"
            className={`relative flex flex-1 flex-col items-start justify-center gap-1 bg-black px-3 py-3 text-left text-white transition-opacity ${
              joined === "NEXUS" ? "opacity-100" : "active:opacity-80"
            }`}
            style={{ width: `${nexusPercent}%`, flexBasis: `${nexusPercent}%` }}
          >
            <span className="inline-flex items-center gap-1.5">
              <SpearMark size={16} />
              <span className="text-[13px] font-bold tabular-nums tracking-wide">
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
            onClick={() => onJoin("AEGIS")}
            aria-label="방패 진영 지지"
            className={`relative flex flex-1 flex-col items-end justify-center gap-1 bg-white px-3 py-3 text-right text-black transition-opacity ${
              joined === "AEGIS" ? "opacity-100" : "active:opacity-80"
            }`}
            style={{ width: `${aegisPercent}%`, flexBasis: `${aegisPercent}%` }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[13px] font-bold tabular-nums tracking-wide">
                {aegisPercent}%
              </span>
              <ShieldMark size={16} />
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
