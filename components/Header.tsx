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

/** 원 안 아래로 향한 창=언론의 펜/붓 촉 (펜이 칼보다 강하다) */
function PenSpearMark() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="24" cy="24" r="18.5" stroke="#ffffff" strokeWidth="1.4" />
      {/* 펜/창 몸통(위) */}
      <path
        d="M22.2 12.5h3.6v8.2h-3.6V12.5Z"
        stroke="#ffffff"
        strokeWidth="1.35"
        strokeLinejoin="miter"
      />
      {/* 아래로 향한 촉 */}
      <path
        d="M20.4 20.7 24 33.2 27.6 20.7H20.4Z"
        stroke="#ffffff"
        strokeWidth="1.35"
        strokeLinejoin="miter"
      />
      {/* 촉 안 작은 빨간 다이아 */}
      <path d="M24 27.2 25.35 28.9 24 30.6 22.65 28.9Z" fill="#e10600" />
      {/* 아래 얇은 가로선 2줄 */}
      <path
        d="M17.5 35.6h13M18.5 37.8h11"
        stroke="#ffffff"
        strokeWidth="1.15"
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
      <div className="mx-auto flex max-w-[560px] flex-col items-center px-4 pb-2 pt-3">
        <PenSpearMark />

        <h1 className="mt-1.5 flex items-baseline justify-center gap-2 font-[family-name:var(--font-brand)] text-[34px] font-semibold leading-none tracking-[0.42em] text-white">
          <span className="pl-[0.42em]">D O M A</span>
          <span
            className="translate-y-[-1px] font-[family-name:var(--font-space-grotesk)] text-[11px] font-semibold tracking-[0.14em] text-muted"
            title="Korea server"
          >
            kr
          </span>
        </h1>

        <time
          dateTime={endsAt}
          className="mt-1.5 font-mono text-[14px] font-medium tabular-nums tracking-[0.16em] text-timer"
          aria-label={`남은 시간 ${remaining}`}
        >
          {remaining}
        </time>
      </div>
    </header>
  );
}
