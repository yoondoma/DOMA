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

/** 슬림 게이지 높이 — ArenaBar·토스트 오프셋과 동기 */
export const SUPPORT_BAR_HEIGHT_PX = 32;

function CrackDivider() {
  return (
    <svg
      className="pointer-events-none absolute inset-y-0 left-1/2 z-10 h-full w-3 -translate-x-1/2"
      viewBox="0 0 12 32"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M6 0 4 6 7 12 3 18 8 24 5 28 6 32"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M6 0 5 6 8 12 4 18 9 24 6 28 6 32"
        fill="none"
        stroke="#a3a3a3"
        strokeWidth="0.6"
        vectorEffect="non-scaling-stroke"
        opacity="0.65"
      />
    </svg>
  );
}

/**
 * 하단 슬림 게이지 — 심볼 + % + 명수만.
 * 두꺼운 독·「지지 · 돌격/방어」라벨 없음.
 */
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
      className="relative z-[45] w-full shrink-0 border-t border-white/15"
      aria-label="진영 지지"
      data-support-bar
      data-slim="true"
    >
      <div
        className="relative mx-auto flex max-w-[560px] overflow-hidden"
        style={{ height: SUPPORT_BAR_HEIGHT_PX }}
      >
        <CrackDivider />
        <button
          type="button"
          onClick={() => strike("NEXUS")}
          aria-label={`도전자 ${nexusPercent}% ${nexusVotes.toLocaleString("ko-KR")}명`}
          data-support-side="NEXUS"
          aria-pressed={joined === "NEXUS"}
          className={`relative flex h-full flex-1 items-center gap-1.5 bg-ink px-2.5 text-paper ${
            joined === "NEXUS" ? "opacity-100" : "opacity-90 active:opacity-100"
          } ${flash === "NEXUS" ? "support-strike-nexus" : ""}`}
          style={{ flexBasis: `${nexusPercent}%` }}
        >
          <SpearMark size={12} />
          <span className="text-[12px] font-bold tabular-nums leading-none">
            {nexusPercent}%
          </span>
          <span className="truncate text-[10px] tabular-nums leading-none text-paper/55">
            {nexusVotes.toLocaleString("ko-KR")}
          </span>
        </button>
        <button
          type="button"
          onClick={() => strike("AEGIS")}
          aria-label={`방어자 ${aegisPercent}% ${aegisVotes.toLocaleString("ko-KR")}명`}
          data-support-side="AEGIS"
          aria-pressed={joined === "AEGIS"}
          className={`relative flex h-full flex-1 items-center justify-end gap-1.5 bg-paper px-2.5 text-ink ${
            joined === "AEGIS" ? "opacity-100" : "opacity-90 active:opacity-100"
          } ${flash === "AEGIS" ? "support-strike-aegis" : ""}`}
          style={{ flexBasis: `${aegisPercent}%` }}
        >
          <span className="truncate text-[10px] tabular-nums leading-none text-ink/45">
            {aegisVotes.toLocaleString("ko-KR")}
          </span>
          <span className="text-[12px] font-bold tabular-nums leading-none">
            {aegisPercent}%
          </span>
          <ShieldMark size={12} />
        </button>
      </div>
    </div>
  );
}
