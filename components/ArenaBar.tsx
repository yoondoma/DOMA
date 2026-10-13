"use client";

import { ShieldMark, SwordMark } from "@/components/SideMarks";
import type { Side } from "@/lib/types";

type ArenaBarProps = {
  topic: string;
  nexusPercent: number;
  aegisPercent: number;
  onJoin: (side: Side) => void;
  joined: Side | null;
  compact?: boolean;
};

export function ArenaBar({
  topic,
  nexusPercent,
  aegisPercent,
  onJoin,
  joined,
  compact = false,
}: ArenaBarProps) {
  return (
    <section className="border-b border-white/12 bg-black">
      <div
        className={`mx-auto max-w-[560px] px-4 ${compact ? "py-2.5" : "py-3"}`}
      >
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          오늘의 논제
        </p>
        <h2
          className={`font-[family-name:var(--font-syne)] font-bold leading-snug tracking-tight text-white ${
            compact ? "text-[15px]" : "text-[17px]"
          }`}
        >
          {topic}
        </h2>

        <div className={compact ? "mt-2" : "mt-2.5"}>
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold tracking-wide">
            <span className="inline-flex items-center gap-1 text-white">
              <SwordMark size={13} />
              NEXUS
              <span className="text-muted">공격</span>
              <span className="tabular-nums">{nexusPercent}%</span>
            </span>
            <span className="text-muted">vs</span>
            <span className="inline-flex items-center gap-1 text-white">
              <span className="tabular-nums">{aegisPercent}%</span>
              <span className="text-muted">방어</span>
              AEGIS
              <ShieldMark size={13} />
            </span>
          </div>

          <div
            className="relative flex h-7 w-full overflow-hidden border border-white"
            role="img"
            aria-label={`NEXUS 검·공격 ${nexusPercent}퍼센트, AEGIS 방패·방어 ${aegisPercent}퍼센트`}
          >
            <div
              className="gauge-animate flex h-full items-center justify-start gap-1 bg-black pl-1.5 text-white"
              style={{ width: `${nexusPercent}%` }}
            >
              <SwordMark size={12} />
              <span className="truncate text-[9px] font-bold tracking-wider">
                검
              </span>
            </div>
            <div
              className="flex h-full items-center justify-end gap-1 bg-white pr-1.5 text-black"
              style={{ width: `${aegisPercent}%` }}
            >
              <span className="truncate text-[9px] font-bold tracking-wider">
                방패
              </span>
              <ShieldMark size={12} />
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-2 ${compact ? "mt-2" : "mt-2.5"}`}>
          <button
            type="button"
            onClick={() => onJoin("NEXUS")}
            className={`flex h-10 items-center justify-center gap-1.5 border text-[11px] font-bold tracking-[0.1em] transition-colors ${
              joined === "NEXUS"
                ? "border-white bg-white text-black"
                : "border-white bg-black text-white active:bg-white active:text-black"
            }`}
          >
            <SwordMark size={13} />
            NEXUS 참전
          </button>
          <button
            type="button"
            onClick={() => onJoin("AEGIS")}
            className={`flex h-10 items-center justify-center gap-1.5 border text-[11px] font-bold tracking-[0.1em] transition-colors ${
              joined === "AEGIS"
                ? "border-white bg-white text-black"
                : "border-white/50 bg-transparent text-white active:border-white active:bg-white active:text-black"
            }`}
          >
            <ShieldMark size={13} />
            AEGIS 참전
          </button>
        </div>
      </div>
    </section>
  );
}
