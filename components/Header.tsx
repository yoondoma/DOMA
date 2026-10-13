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

function ScaleMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-white"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 5.5v13M7 9.5h10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
      <path
        d="M7 9.5 5 13.5h4L7 9.5ZM17 9.5l-2 4h4l-2-4Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="miter"
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
      <div className="mx-auto flex max-w-[560px] flex-col items-center px-4 pb-2 pt-2.5">
        <div className="flex items-center gap-2">
          <ScaleMark />
          <h1 className="flex items-baseline gap-1.5 font-[family-name:var(--font-syne)] text-[20px] font-extrabold leading-none tracking-[0.22em] text-white">
            <span>DOMA</span>
            <span
              className="translate-y-[-1px] text-[10px] font-semibold tracking-[0.14em] text-muted"
              title="Korea server"
            >
              kr
            </span>
          </h1>
        </div>

        <p className="mt-1.5 text-[10px] font-medium tracking-[0.35em] text-muted">
          판결까지
        </p>
        <time
          dateTime={endsAt}
          className="mt-0.5 font-mono text-[22px] font-semibold tabular-nums tracking-[0.12em] text-timer"
          aria-label={`판결까지 ${remaining}`}
        >
          {remaining}
        </time>
      </div>
    </header>
  );
}
