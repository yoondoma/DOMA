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

export function Header({ endsAt }: HeaderProps) {
  const [remaining, setRemaining] = useState(() =>
    formatCountdown(new Date(endsAt).getTime() - Date.now()),
  );

  useEffect(() => {
    const tick = () => {
      setRemaining(formatCountdown(new Date(endsAt).getTime() - Date.now()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/12 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-11 max-w-[560px] items-center justify-between px-4">
        <h1 className="font-[family-name:var(--font-syne)] text-[22px] font-extrabold tracking-[0.14em] text-white">
          DOMA
        </h1>
        <div className="flex items-center gap-2">
          <time
            dateTime={endsAt}
            className="font-mono text-[12px] tabular-nums tracking-wider text-white/90"
            aria-label={`남은 시간 ${remaining}`}
          >
            {remaining}
          </time>
          <span className="inline-flex items-center gap-1 px-1 py-0.5 text-[9px] font-bold tracking-[0.2em] text-white">
            <span
              className="live-dot inline-block size-1.5 rounded-full bg-white"
              aria-hidden
            />
            LIVE
          </span>
        </div>
      </div>
    </header>
  );
}
