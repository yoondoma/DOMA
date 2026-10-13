"use client";

import { useMemo } from "react";
import { ShieldMark, SideBadge, SpearMark } from "@/components/SideMarks";
import type { ArenaState, Opinion, Side } from "@/lib/types";

type ArenaBarProps = {
  arena: ArenaState;
  opinions: Opinion[];
  nexusPercent: number;
  aegisPercent: number;
  focus: Side;
  onFocusChange: (side: Side) => void;
  onJoin: (side: Side) => void;
  joined: Side | null;
};

function CrackDivider() {
  return (
    <svg
      className="pointer-events-none absolute inset-y-0 left-1/2 z-10 h-full w-5 -translate-x-1/2"
      viewBox="0 0 20 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M10 0 7 12 12 22 6 38 13 52 8 68 14 82 10 100"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M10 0 8 12 13 22 7 38 14 52 9 68 15 82 10 100"
        fill="none"
        stroke="#a3a3a3"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        opacity="0.7"
      />
    </svg>
  );
}

function topOpinionForSide(opinions: Opinion[], side: Side): Opinion | null {
  const list = opinions.filter((o) => o.side === side);
  if (list.length === 0) return null;
  return [...list].sort((a, b) => b.likes - a.likes)[0] ?? null;
}

function HeartMark({ className }: { className: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <path
        d="M8 13.2S2.8 9.8 2.8 5.9A2.7 2.7 0 0 1 8 4.4 2.7 2.7 0 0 1 13.2 5.9C13.2 9.8 8 13.2 8 13.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 주제 · 검투사 · 비율 · (탭 시) Top 의견 즉시 */
export function ArenaBar({
  arena,
  opinions,
  nexusPercent,
  aegisPercent,
  focus,
  onFocusChange,
  onJoin,
  joined,
}: ArenaBarProps) {
  const isNexus = focus === "NEXUS";
  const light = focus === "AEGIS";
  const top = useMemo(
    () => topOpinionForSide(opinions, focus),
    [opinions, focus],
  );

  return (
    <section aria-label="아레나 기본창">
      <div className="bg-black">
        <div className="mx-auto max-w-[560px]">
          <div className="px-4 pb-2 pt-3 text-center">
            <p className="text-[11px] tracking-[0.18em] text-muted">
              제 {arena.round} 도마
            </p>
            <h2 className="mt-1.5 font-[family-name:var(--font-syne)] text-[18px] font-bold leading-snug tracking-tight text-white sm:text-[20px]">
              {arena.topic}
            </h2>
          </div>

          <div
            className="grid grid-cols-2 border-y border-white/20"
            role="tablist"
            aria-label="검투사 진영"
          >
            <button
              type="button"
              role="tab"
              aria-selected={isNexus}
              aria-label="창 검투사"
              onClick={() => onFocusChange("NEXUS")}
              className={`flex min-h-[96px] flex-col items-center justify-center gap-2 transition-colors ${
                isNexus
                  ? "bg-white/[0.06] text-white"
                  : "text-muted"
              }`}
            >
              <SpearMark size={36} />
              <span className="text-[11px] font-bold tracking-[0.2em]">창</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isNexus}
              aria-label="방패 검투사"
              onClick={() => onFocusChange("AEGIS")}
              className={`flex min-h-[96px] flex-col items-center justify-center gap-2 transition-colors ${
                !isNexus
                  ? "bg-white text-black"
                  : "text-muted"
              }`}
            >
              <ShieldMark size={36} />
              <span className="text-[11px] font-bold tracking-[0.2em]">방패</span>
            </button>
          </div>

          <div className="relative flex min-h-[88px] w-full overflow-hidden border-b border-white/20">
            <CrackDivider />
            <button
              type="button"
              onClick={() => {
                onFocusChange("NEXUS");
                onJoin("NEXUS");
              }}
              aria-label="창 진영 지지"
              className={`relative flex flex-1 flex-col items-start justify-center gap-1 bg-black px-3 py-3 text-left text-white ${
                joined === "NEXUS" ? "opacity-100" : "active:opacity-80"
              }`}
              style={{ flexBasis: `${nexusPercent}%` }}
            >
              <span className="inline-flex items-center gap-1.5">
                <SpearMark size={16} />
                <span className="text-[14px] font-bold tabular-nums">
                  {nexusPercent}%
                </span>
              </span>
              <span className="text-[10px] text-muted">
                {joined === "NEXUS" ? "참전 중" : "지지"} ·{" "}
                {arena.nexusVotes.toLocaleString("ko-KR")}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                onFocusChange("AEGIS");
                onJoin("AEGIS");
              }}
              aria-label="방패 진영 지지"
              className={`relative flex flex-1 flex-col items-end justify-center gap-1 bg-white px-3 py-3 text-right text-black ${
                joined === "AEGIS" ? "opacity-100" : "active:opacity-80"
              }`}
              style={{ flexBasis: `${aegisPercent}%` }}
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[14px] font-bold tabular-nums">
                  {aegisPercent}%
                </span>
                <ShieldMark size={16} />
              </span>
              <span className="text-[10px] text-neutral-500">
                {joined === "AEGIS" ? "참전 중" : "지지"} ·{" "}
                {arena.aegisVotes.toLocaleString("ko-KR")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 탭 바로 아래 Top — 스크롤 없이 즉시 */}
      <div
        className={`mx-auto max-w-[560px] px-4 py-3 ${
          light ? "bg-white text-black" : "bg-black text-white"
        }`}
        aria-live="polite"
      >
        <p
          className={`mb-2 text-[10px] font-bold tracking-[0.18em] ${
            light ? "text-neutral-500" : "text-muted"
          }`}
        >
          {isNexus ? "창 · TOP 의견" : "방패 · TOP 의견"}
        </p>
        {top ? (
          <article
            className={`border px-3 py-3 ${
              light
                ? "border-black/20 bg-neutral-50"
                : "border-white/20 bg-white/[0.03]"
            }`}
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className={`text-[10px] font-bold tracking-[0.16em] ${
                  light ? "text-neutral-500" : "text-muted"
                }`}
              >
                TOP
              </span>
              <SideBadge side={top.side} />
              <span
                className={`truncate text-[13px] font-semibold ${
                  light ? "text-black" : "text-white"
                }`}
              >
                @{top.author}
              </span>
              <span
                className={`ml-auto inline-flex items-center gap-1 text-[11px] tabular-nums ${
                  light ? "text-neutral-500" : "text-muted"
                }`}
              >
                <HeartMark
                  className={light ? "text-neutral-500" : "text-muted"}
                />
                {top.likes}
              </span>
            </div>
            <p
              className={`text-[14px] leading-[1.45] ${
                light ? "text-black/90" : "text-white/95"
              }`}
            >
              “{top.text}”
            </p>
          </article>
        ) : (
          <p
            className={`py-4 text-center text-sm ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            이 진영의 인기 의견이 아직 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}
