"use client";

import { WAR_TICKER_ITEMS } from "@/lib/war-ticker-mock";

type WarTickerProps = {
  light?: boolean;
  className?: string;
};

/**
 * 얇은 전황 티커 — 스포츠 자막 밀도.
 * 주제를 압도하지 않음 · glow/파티클 없음.
 */
export function WarTicker({ light = false, className = "" }: WarTickerProps) {
  const ink = light ? "text-black/70" : "text-white/70";
  const warn = light ? "text-timer" : "text-timer";
  const border = light ? "border-black/12" : "border-white/12";
  const bg = light ? "bg-black/[0.03]" : "bg-white/[0.04]";

  const loop = [...WAR_TICKER_ITEMS, ...WAR_TICKER_ITEMS];

  return (
    <div
      className={`war-ticker border-y ${border} ${bg} ${className}`}
      aria-label="전황 티커"
      data-war-ticker
    >
      <div className="war-ticker-track flex items-center gap-8 whitespace-nowrap py-1.5 pl-3">
        {loop.map((item, i) => (
          <span
            key={`${item.id}-${i}`}
            className={`text-[11px] tracking-[0.04em] ${
              item.kind === "warn" ? warn : ink
            }`}
            data-ticker-kind={item.kind}
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
