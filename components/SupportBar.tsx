"use client";

import { useState } from "react";
import { ShieldMark, SpearMark } from "@/components/SideMarks";
import type { Side } from "@/lib/types";

type SupportBarProps = {
  nexusPercent: number;
  aegisPercent: number;
  nexusVotes: number;
  aegisVotes: number;
  joined: Side | null;
  onJoin: (side: Side) => void;
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

/** 셸 하단 독 — 지지 · 돌격/방어 보조 카피 · 짧은 충격 피드백 */
export function SupportBar({
  nexusPercent,
  aegisPercent,
  nexusVotes,
  aegisVotes,
  joined,
  onJoin,
}: SupportBarProps) {
  const [flash, setFlash] = useState<Side | null>(null);

  const strike = (side: Side) => {
    setFlash(side);
    window.setTimeout(() => setFlash(null), 280);
    onJoin(side);
  };

  return (
    <div
      className="relative z-[45] w-full shrink-0 border-t border-white/20"
      aria-label="진영 지지"
      data-support-bar
    >
      <div className="relative mx-auto flex min-h-[84px] max-w-[560px] overflow-hidden">
        <CrackDivider />
        <button
          type="button"
          onClick={() => strike("NEXUS")}
          aria-label="도전자 진영 지지"
          data-support-side="NEXUS"
          className={`relative flex flex-1 flex-col items-start justify-center gap-0.5 bg-black px-3 py-2.5 text-left text-white ${
            joined === "NEXUS" ? "opacity-100" : "active:opacity-80"
          } ${flash === "NEXUS" ? "support-strike-nexus" : ""}`}
          style={{ flexBasis: `${nexusPercent}%` }}
        >
          <span className="inline-flex items-center gap-1.5">
            <SpearMark size={15} />
            <span className="text-[15px] font-bold tabular-nums">
              {nexusPercent}%
            </span>
          </span>
          <span className="text-[11px] font-medium tracking-[0.04em]">
            지지 · 돌격
          </span>
          <span className="text-[10px] text-muted">
            {joined === "NEXUS" ? "참전 중 · " : ""}
            {nexusVotes.toLocaleString("ko-KR")}명
          </span>
        </button>
        <button
          type="button"
          onClick={() => strike("AEGIS")}
          aria-label="방어자 진영 지지"
          data-support-side="AEGIS"
          className={`relative flex flex-1 flex-col items-end justify-center gap-0.5 bg-white px-3 py-2.5 text-right text-black ${
            joined === "AEGIS" ? "opacity-100" : "active:opacity-80"
          } ${flash === "AEGIS" ? "support-strike-aegis" : ""}`}
          style={{ flexBasis: `${aegisPercent}%` }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[15px] font-bold tabular-nums">
              {aegisPercent}%
            </span>
            <ShieldMark size={15} />
          </span>
          <span className="text-[11px] font-medium tracking-[0.04em]">
            지지 · 방어
          </span>
          <span className="text-[10px] text-neutral-500">
            {joined === "AEGIS" ? "참전 중 · " : ""}
            {aegisVotes.toLocaleString("ko-KR")}명
          </span>
        </button>
      </div>
    </div>
  );
}
