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

/** Thumb Zone — 네비 바로 위 · 얇고 묵직 */
export const SUPPORT_BAR_HEIGHT_PX = 44;

/**
 * sticky `[흑 지지]` `[백 지지]` — intro + 진영 피드
 * Tension 게이지만 크림슨. 탭 scale(0.96)
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
      <div
        className="mx-auto flex h-1 max-w-[560px] overflow-hidden"
        aria-hidden
        data-tension-gauge
      >
        <div
          className="tension-fill h-full bg-crimson"
          style={{ flexBasis: `${nexusPercent}%`, flexGrow: 0, flexShrink: 0 }}
        />
        <div
          className="tension-fill h-full bg-defend"
          style={{ flexBasis: `${aegisPercent}%`, flexGrow: 0, flexShrink: 0 }}
        />
      </div>

      <div
        className="relative mx-auto flex max-w-[560px]"
        style={{ height: SUPPORT_BAR_HEIGHT_PX - 4 }}
      >
        <button
          type="button"
          onClick={() => strike("NEXUS")}
          aria-label={`흑 지지 ${nexusPercent}% ${nexusVotes.toLocaleString("ko-KR")}명`}
          data-support-side="NEXUS"
          aria-pressed={joined === "NEXUS"}
          className={`thumb-press relative flex h-full flex-1 items-center justify-center gap-1.5 bg-ink px-2 text-paper ${
            joined === "NEXUS" ? "opacity-100" : "opacity-88"
          } ${flash === "NEXUS" ? "support-strike-nexus" : ""}`}
          style={{
            flexBasis: `${nexusPercent}%`,
            transition: "flex-basis 500ms ease, opacity 150ms ease",
          }}
        >
          <SpearMark size={12} />
          <span className="text-[12px] font-semibold tracking-[0.08em]">
            흑 지지
          </span>
          <span className="text-[11px] font-bold tabular-nums text-paper/70">
            {nexusPercent}%
          </span>
        </button>
        <button
          type="button"
          onClick={() => strike("AEGIS")}
          aria-label={`백 지지 ${aegisPercent}% ${aegisVotes.toLocaleString("ko-KR")}명`}
          data-support-side="AEGIS"
          aria-pressed={joined === "AEGIS"}
          className={`thumb-press relative flex h-full flex-1 items-center justify-center gap-1.5 bg-defend px-2 text-ink ${
            joined === "AEGIS" ? "opacity-100" : "opacity-88"
          } ${flash === "AEGIS" ? "support-strike-aegis" : ""}`}
          style={{
            flexBasis: `${aegisPercent}%`,
            transition: "flex-basis 500ms ease, opacity 150ms ease",
          }}
        >
          <span className="text-[11px] font-bold tabular-nums text-ink/65">
            {aegisPercent}%
          </span>
          <span className="text-[12px] font-semibold tracking-[0.08em]">
            백 지지
          </span>
          <ShieldMark size={12} />
        </button>
      </div>
    </div>
  );
}
