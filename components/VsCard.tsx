"use client";

import { ShieldMark, SpearMark } from "@/components/SideMarks";

type VsCardProps = {
  nexusPercent: number;
  aegisPercent: number;
  /** compact = 상세 sticky 아래 얇은 바 */
  compact?: boolean;
  light?: boolean;
  className?: string;
};

function VsMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <path d="M6 4h6L16 14 20 4h6L18.5 16 26 28h-6l-4-10-4 10H6l7.5-12L6 4Z" fill="currentColor" />
    </svg>
  );
}

/**
 * VS 대립 카드 — CHALLENGER | DEFENDER · % · 흑/백 분할 게이지.
 * 그라데이션·글로우 금지.
 */
export function VsCard({
  nexusPercent,
  aegisPercent,
  compact = false,
  light = false,
  className = ""
}: VsCardProps) {
  const nexus = Math.max(0, Math.min(100, Math.round(nexusPercent)));
  const aegis = Math.max(0, Math.min(100, Math.round(aegisPercent)));
  const border = light ? "border-black/15" : "border-white/15";
  const ink = light ? "text-black" : "text-white";
  const soft = light ? "text-black/50" : "text-white/50";

  if (compact) {
    return (
      <div
        className={`border-b px-4 py-2 ${border} ${className}`}
        aria-label="지지율 대립"
        data-vs-card="compact"
      >
        <div className="flex items-center justify-between gap-2 text-[11px] font-bold tracking-[0.12em]">
          <span className="inline-flex items-center gap-1 text-white">
            <SpearMark size={12} />
            <span className="bg-black px-1.5 py-0.5 tabular-nums">{nexus}%</span>
          </span>
          <span className={soft}>VS</span>
          <span className="inline-flex items-center gap-1 text-black">
            <span className="bg-white px-1.5 py-0.5 tabular-nums ring-1 ring-black/20">
              {aegis}%
            </span>
            <ShieldMark size={12} />
          </span>
        </div>
        <div
          className="mt-1.5 flex h-1.5 w-full overflow-hidden border border-white/25"
          aria-hidden
        >
          <div className="bg-black" style={{ width: `${nexus}%` }} />
          <div className="bg-white" style={{ width: `${aegis}%` }} />
        </div>
      </div>
    );
  }

  return (
    <section
      className={`border-y ${border} ${className}`}
      aria-label="도전자 대 방어자"
      data-vs-card="full"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
        <div className="flex flex-col items-center justify-center gap-1.5 bg-black px-3 py-4 text-white">
          <SpearMark size={22} />
          <p className="text-[10px] font-bold tracking-[0.18em]">CHALLENGER</p>
          <p className="text-[13px] font-bold tracking-[0.12em]">도전자</p>
          <p className="mt-0.5 font-mono text-[22px] font-bold tabular-nums leading-none">
            {nexus}%
          </p>
        </div>

        <div
          className={`flex flex-col items-center justify-center gap-1 border-x px-2.5 ${border} ${ink}`}
          aria-hidden
        >
          <span className={soft}>
            <VsMark size={22} />
          </span>
          <span className={`text-[10px] font-bold tracking-[0.2em] ${soft}`}>
            VS
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-1.5 bg-white px-3 py-4 text-black">
          <ShieldMark size={22} />
          <p className="text-[10px] font-bold tracking-[0.18em]">DEFENDER</p>
          <p className="text-[13px] font-bold tracking-[0.12em]">방어자</p>
          <p className="mt-0.5 font-mono text-[22px] font-bold tabular-nums leading-none">
            {aegis}%
          </p>
        </div>
      </div>

      <div
        className="flex h-2.5 w-full overflow-hidden border-t border-white/25"
        role="meter"
        aria-label={`도전자 ${nexus}퍼센트, 방어자 ${aegis}퍼센트`}
        aria-valuenow={nexus}
        aria-valuemin={0}
        aria-valuemax={100}
        data-vs-gauge
      >
        <div
          className="gauge-animate bg-black"
          style={{ width: `${nexus}%` }}
        />
        <div className="bg-white" style={{ width: `${aegis}%` }} />
      </div>
    </section>
  );
}
