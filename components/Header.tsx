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

/** 성 토마스 상징 — 목수 삼각자 / 트라이스퀘어(L자 자) */
function SetSquareMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-white"
      aria-hidden
    >
      {/* L자 몸통(두께감) — 긴 세로 날 + 짧은 가로 혀 */}
      <path
        d="M5 2.5h4.2v13.3H21.5V20H5V2.5Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="miter"
      />
      {/* 안쪽 단으로 자(tool) 형태 강조 */}
      <path
        d="M7.6 5v12.4H18.8"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* 눈금 — 수직 날 */}
      <path
        d="M5 6.5h1.6M5 9.5h1.6M5 12.5h1.6M5 15.5h1.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      {/* 눈금 — 수평 혀 */}
      <path
        d="M11 20v-1.6M14.5 20v-1.6M18 20v-1.6"
        stroke="currentColor"
        strokeWidth="1.2"
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
