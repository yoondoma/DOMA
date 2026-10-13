"use client";

import { useEffect, useState } from "react";

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

/** 메인: 마크 없음 · DOMA 텍스트만 절제 · 탭/pull 새로고침 */
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
      <div className="relative mx-auto flex max-w-[560px] items-center px-3 py-2">
        <button
          type="button"
          onClick={onOpenHistory}
          className={`flex size-10 shrink-0 items-center justify-center ${
            light ? "text-black" : "text-white"
          }`}
            aria-label="시간 축 — 전투 기록과 내일의 주제"
          >
            <CalendarIcon />
          </button>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="새로고침"
            aria-busy={refreshing || undefined}
            className={refreshing ? "logo-refresh" : undefined}
          >
            <h1
              className={`font-[family-name:var(--font-brand)] text-[15px] font-semibold leading-none tracking-[0.28em] ${
                light ? "text-black/70" : "text-white/75"
              }`}
            >
              DOMA
            </h1>
          </button>
          {refreshing ? (
            <span
              className={`mt-1 text-[10px] tracking-[0.14em] ${
                light ? "text-neutral-500" : "text-muted"
              }`}
            >
              업데이트 중
            </span>
          ) : (
            <time
              dateTime={endsAt}
              className="mt-1 font-mono text-[12px] font-medium tabular-nums tracking-[0.12em] text-timer"
              aria-label={`남은 시간 ${remaining}`}
            >
              {remaining}
            </time>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenSearch}
          className={`flex size-10 shrink-0 items-center justify-center ${
            light ? "text-black" : "text-white"
          }`}
          aria-label="검색"
        >
          <SearchIcon />
        </button>
      </div>
    </header>
  );
}
