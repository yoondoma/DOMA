"use client";

import { useEffect, useState } from "react";

type HeaderProps = {
  endsAt: string;
};

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/** 성 토마스 상징 — 삼각자(set square) 라인 아이콘 */
function SetSquareMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-white"
      aria-hidden
    >
      <path
        d="M4.5 3.5v17h17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M4.5 3.5 21.5 20.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="square"
      />
      {/* 눈금 */}
      <path
        d="M4.5 8h2M4.5 12.5h2M4.5 17h2M9 20.5v-2M13.5 20.5v-2M18 20.5v-2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Header({ endsAt }: HeaderProps) {
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
      <div className="mx-auto flex max-w-[560px] flex-col items-center px-4 pb-1.5 pt-2.5">
        <div className="flex items-center gap-2.5">
          <SetSquareMark />
          <h1 className="flex items-baseline gap-1.5 font-[family-name:var(--font-syne)] text-[28px] font-extrabold leading-none tracking-[0.18em] text-white">
            <span>DOMA</span>
            <span
              className="translate-y-[-2px] text-[11px] font-semibold tracking-[0.14em] text-muted"
              title="Korea server"
            >
              kr
            </span>
          </h1>
        </div>

        <time
          dateTime={endsAt}
          className="mt-1 font-mono text-[13px] font-semibold tabular-nums tracking-[0.14em] text-timer"
          aria-label={`남은 시간 ${remaining}`}
        >
          {remaining}
        </time>
      </div>
    </header>
  );
}
