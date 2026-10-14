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

/** Thumb Zone 높이 — ArenaBar·토스트 오프셋과 동기 */
export const SUPPORT_BAR_HEIGHT_PX = 56;

/**
 * 하단 sticky Thumb Zone — [흑 지지] / [백 지지]
 * 상단 TENSION 게이지는 flex-basis transition-all duration-500
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
      className="relative z-[45] w-full shrink-0 border-t border-edge bg-ink"
      aria-label="진영 지지"
      data-support-bar
      data-thumb-zone
      data-slim="true"
    >
      {/* TENSION — 크림슨 힌트는 접점만 */}
      <div
        className="mx-auto flex h-1.5 max-w-[560px] overflow-hidden"
        aria-hidden
        data-tension-gauge
      >
        <div
          className="tension-fill h-full bg-crimson/90"
          style={{ flexBasis: `${nexusPercent}%`, flexGrow: 0, flexShrink: 0 }}
        />
        <div
          className="tension-fill h-full bg-paper/80"
          style={{ flexBasis: `${aegisPercent}%`, flexGrow: 0, flexShrink: 0 }}
        />
      </div>

      <div
        className="relative mx-auto flex max-w-[560px]"
        style={{ height: SUPPORT_BAR_HEIGHT_PX - 6 }}
      >
        <button
          type="button"
          onClick={() => strike("NEXUS")}
          aria-label={`흑 지지 ${nexusPercent}% ${nexusVotes.toLocaleString("ko-KR")}명`}
          data-support-side="NEXUS"
          aria-pressed={joined === "NEXUS"}
          className={`thumb-press relative flex h-full flex-1 items-center justify-center gap-2 bg-ink px-3 text-paper ${
            joined === "NEXUS" ? "opacity-100" : "opacity-90"
          } ${flash === "NEXUS" ? "support-strike-nexus" : ""}`}
          style={{
            flexBasis: `${nexusPercent}%`,
            transition: "flex-basis 500ms ease, opacity 150ms ease",
          }}
        >
          <SpearMark size={14} />
          <span className="text-[13px] font-semibold tracking-[0.06em]">
            흑 지지
          </span>
          <span className="text-[12px] font-bold tabular-nums text-crimson">
            {nexusPercent}%
          </span>
        </button>
        <button
          type="button"
          onClick={() => strike("AEGIS")}
          aria-label={`백 지지 ${aegisPercent}% ${aegisVotes.toLocaleString("ko-KR")}명`}
          data-support-side="AEGIS"
          aria-pressed={joined === "AEGIS"}
          className={`thumb-press relative flex h-full flex-1 items-center justify-center gap-2 bg-paper px-3 text-ink ${
            joined === "AEGIS" ? "opacity-100" : "opacity-90"
          } ${flash === "AEGIS" ? "support-strike-aegis" : ""}`}
          style={{
            flexBasis: `${aegisPercent}%`,
            transition: "flex-basis 500ms ease, opacity 150ms ease",
          }}
        >
          <span className="text-[12px] font-bold tabular-nums">{aegisPercent}%</span>
          <span className="text-[13px] font-semibold tracking-[0.06em]">
            백 지지
          </span>
          <ShieldMark size={14} />
        </button>
      </div>
    </div>
  );
}
