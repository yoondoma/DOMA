"use client";

import { useEffect, useState } from "react";
import { DomaMark } from "@/components/DomaMark";

type HeaderProps = {
  endsAt: string;
  /** 방어자 탭일 때 흰 톤 */
  tone?: "dark" | "light";
  refreshing?: boolean;
  onRefresh?: () => void;
  onOpenHistory?: () => void;
  onOpenSearch?: () => void;
};

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.75"
        y="5.5"
        width="16.5"
        height="14.75"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.75 9.75h16.5M8 3.75v3.5M16 3.75v3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
      <path
        d="M8.2 13.2h2.2M13.6 13.2h2.2M8.2 16.4h2.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M15.8 15.8 20 20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Header({
  endsAt,
  tone = "dark",
  refreshing,
  onRefresh,
  onOpenHistory,
  onOpenSearch,
}: HeaderProps) {
  const [remaining, setRemaining] = useState("--:--:--");
  const light = tone === "light";

  useEffect(() => {
    const tick = () => {
      setRemaining(formatCountdown(new Date(endsAt).getTime() - Date.now()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        light
          ? "border-black/10 bg-white/95"
          : "border-white/12 bg-black/92"
      }`}
    >
      <div className="relative mx-auto max-w-[560px] px-3 pb-2 pt-2.5">
        <div className="absolute inset-x-3 top-2.5 flex items-start justify-between">
          <button
            type="button"
            onClick={onOpenHistory}
            className={`flex size-10 items-center justify-center ${
              light ? "text-black" : "text-white"
            }`}
            aria-label="이전 대결 기록"
          >
            <CalendarIcon />
          </button>
          <button
            type="button"
            onClick={onOpenSearch}
            className={`flex size-10 items-center justify-center ${
              light ? "text-black" : "text-white"
            }`}
            aria-label="검색"
          >
            <SearchIcon />
          </button>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="새로고침"
          aria-busy={refreshing || undefined}
          className={`mx-auto flex flex-col items-center ${
            refreshing ? "logo-refresh" : ""
          }`}
        >
          {/* Threads형: [마크] DOMA .kr */}
          <span className="flex items-center gap-2.5">
            <DomaMark size={34} light={light} />
            <h1
              className={`flex items-baseline font-[family-name:var(--font-brand)] text-[28px] font-semibold leading-none tracking-[0.2em] ${
                light ? "text-black" : "text-white"
              }`}
            >
              <span>DOMA</span>
              <span
                className={`ml-[0.1em] translate-y-[-1px] font-[family-name:var(--font-space-grotesk)] text-[11px] font-semibold tracking-[0.04em] ${
                  light ? "text-neutral-500" : "text-muted"
                }`}
                title="Korea server"
              >
                .kr
              </span>
            </h1>
          </span>

          {refreshing ? (
            <span
              className={`mt-1.5 text-[10px] tracking-[0.14em] ${
                light ? "text-neutral-500" : "text-muted"
              }`}
            >
              업데이트 중
            </span>
          ) : (
            <time
              dateTime={endsAt}
              className="mt-1.5 font-mono text-[12px] font-medium tabular-nums tracking-[0.12em] text-timer"
              aria-label={`남은 시간 ${remaining}`}
            >
              {remaining}
            </time>
          )}
        </button>
      </div>
    </header>
  );
}
