"use client";

import { useEffect, useState } from "react";

type HeaderProps = {
  endsAt: string;
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

/** 원 안 아래로 향한 창=언론의 펜/붓 촉 */
function PenSpearMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="24" cy="24" r="18.5" stroke="#ffffff" strokeWidth="1.4" />
      <path
        d="M22.2 12.5h3.6v8.2h-3.6V12.5Z"
        stroke="#ffffff"
        strokeWidth="1.35"
        strokeLinejoin="miter"
      />
      <path
        d="M20.4 20.7 24 33.2 27.6 20.7H20.4Z"
        stroke="#ffffff"
        strokeWidth="1.35"
        strokeLinejoin="miter"
      />
      <path d="M24 27.2 25.35 28.9 24 30.6 22.65 28.9Z" fill="#e10600" />
      <path
        d="M17.5 35.6h13M18.5 37.8h11"
        stroke="#ffffff"
        strokeWidth="1.15"
        strokeLinecap="square"
      />
    </svg>
  );
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

export function Header({ endsAt, onOpenHistory, onOpenSearch }: HeaderProps) {
  const [remaining, setRemaining] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      setRemaining(formatCountdown(new Date(endsAt).getTime() - Date.now()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/12 bg-black/92 backdrop-blur-md">
      <div className="relative mx-auto max-w-[560px] px-3 pb-2 pt-2.5">
        <div className="absolute inset-x-3 top-2.5 flex items-start justify-between">
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex size-10 items-center justify-center text-white"
            aria-label="이전 대결 기록"
          >
            <CalendarIcon />
          </button>
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex size-10 items-center justify-center text-white"
            aria-label="검색"
          >
            <SearchIcon />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <PenSpearMark />

          <h1 className="mt-1 flex items-baseline justify-center font-[family-name:var(--font-brand)] text-[32px] font-semibold leading-none tracking-[0.22em] text-white">
            <span>DOMA</span>
            <span
              className="ml-[0.12em] translate-y-[-1px] font-[family-name:var(--font-space-grotesk)] text-[12px] font-semibold tracking-[0.04em] text-muted"
              title="Korea server"
            >
              .kr
            </span>
          </h1>

          <time
            dateTime={endsAt}
            className="mt-1 font-mono text-[12px] font-medium tabular-nums tracking-[0.12em] text-timer"
            aria-label={`남은 시간 ${remaining}`}
          >
            {remaining}
          </time>
        </div>
      </div>
    </header>
  );
}
