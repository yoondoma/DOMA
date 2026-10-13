"use client";

import type { Side } from "@/lib/types";

type ArenaBarProps = {
  topic: string;
  nexusPercent: number;
  aegisPercent: number;
  onJoin: (side: Side) => void;
  joined: Side | null;
};

export function ArenaBar({
  topic,
  nexusPercent,
  aegisPercent,
  onJoin,
  joined,
}: ArenaBarProps) {
  return (
    <section className="border-b border-white/20 bg-black">
      <div className="mx-auto max-w-3xl px-3 py-3 sm:px-4 sm:py-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          오늘의 논제
        </p>
        <h2 className="font-[family-name:var(--font-syne)] text-lg font-bold leading-snug tracking-tight text-white sm:text-2xl">
          {topic}
        </h2>

        <div className="mt-3 sm:mt-4">
          <div className="mb-1.5 flex items-end justify-between text-xs font-semibold tracking-wide sm:text-sm">
            <span className="text-white">
              NEXUS <span className="tabular-nums">{nexusPercent}%</span>
            </span>
            <span className="text-muted">vs</span>
            <span className="text-white">
              AEGIS <span className="tabular-nums">{aegisPercent}%</span>
            </span>
          </div>

          <div
            className="relative flex h-8 w-full overflow-hidden border border-white sm:h-9"
            role="img"
            aria-label={`NEXUS ${nexusPercent}퍼센트, AEGIS ${aegisPercent}퍼센트`}
          >
            <div
              className="gauge-animate flex h-full items-center justify-start bg-black pl-2 text-[10px] font-bold tracking-wider text-white sm:text-xs"
              style={{ width: `${nexusPercent}%` }}
            >
              <span className="truncate">검</span>
            </div>
            <div
              className="flex h-full items-center justify-end bg-white pr-2 text-[10px] font-bold tracking-wider text-black sm:text-xs"
              style={{ width: `${aegisPercent}%` }}
            >
              <span className="truncate">흰</span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
          <button
            type="button"
            onClick={() => onJoin("NEXUS")}
            className={`h-10 border text-xs font-bold tracking-[0.14em] transition-colors sm:h-11 sm:text-sm ${
              joined === "NEXUS"
                ? "border-white bg-white text-black"
                : "border-white bg-black text-white hover:bg-white hover:text-black"
            }`}
          >
            NEXUS 참전
          </button>
          <button
            type="button"
            onClick={() => onJoin("AEGIS")}
            className={`h-10 border text-xs font-bold tracking-[0.14em] transition-colors sm:h-11 sm:text-sm ${
              joined === "AEGIS"
                ? "border-white bg-white text-black"
                : "border-white/60 bg-transparent text-white hover:border-white hover:bg-white hover:text-black"
            }`}
          >
            AEGIS 참전
          </button>
        </div>
      </div>
    </section>
  );
}
