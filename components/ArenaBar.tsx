"use client";

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
            <span className="text-white">
              NEXUS <span className="tabular-nums">{nexusPercent}%</span>
            </span>
            <span className="text-muted">vs</span>
            <span className="text-white">
              AEGIS <span className="tabular-nums">{aegisPercent}%</span>
            </span>
          </div>

          <div
            className="relative flex h-6 w-full overflow-hidden border border-white"
            role="img"
            aria-label={`NEXUS ${nexusPercent}퍼센트, AEGIS ${aegisPercent}퍼센트`}
          >
            <div
              className="gauge-animate flex h-full items-center justify-start bg-black pl-1.5 text-[9px] font-bold tracking-wider text-white"
              style={{ width: `${nexusPercent}%` }}
            >
              <span className="truncate">검</span>
            </div>
            <div
              className="flex h-full items-center justify-end bg-white pr-1.5 text-[9px] font-bold tracking-wider text-black"
              style={{ width: `${aegisPercent}%` }}
            >
              <span className="truncate">흰</span>
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-2 ${compact ? "mt-2" : "mt-2.5"}`}>
          <button
            type="button"
            onClick={() => onJoin("NEXUS")}
            className={`h-10 border text-[11px] font-bold tracking-[0.12em] transition-colors ${
              joined === "NEXUS"
                ? "border-white bg-white text-black"
                : "border-white bg-black text-white active:bg-white active:text-black"
            }`}
          >
            NEXUS 참전
          </button>
          <button
            type="button"
            onClick={() => onJoin("AEGIS")}
            className={`h-10 border text-[11px] font-bold tracking-[0.12em] transition-colors ${
              joined === "AEGIS"
                ? "border-white bg-white text-black"
                : "border-white/50 bg-transparent text-white active:border-white active:bg-white active:text-black"
            }`}
          >
            AEGIS 참전
          </button>
        </div>
      </div>
    </section>
  );
}
