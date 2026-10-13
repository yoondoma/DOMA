"use client";

import { useMemo } from "react";
import { ShieldMark, SideBadge, SpearMark } from "@/components/SideMarks";
import type { ArenaState, Opinion, Side } from "@/lib/types";

type ArenaBarProps = {
  arena: ArenaState;
  opinions: Opinion[];
  nexusPercent: number;
  aegisPercent: number;
  openChallenger: boolean;
  openDefender: boolean;
  onToggleChallenger: () => void;
  onToggleDefender: () => void;
  onJoin: (side: Side) => void;
  joined: Side | null;
};

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

function TopOpinionCard({
  opinion,
  label,
  light,
}: {
  opinion: Opinion;
  label: string;
  light: boolean;
}) {
  return (
    <div
      className={`px-4 py-2.5 ${light ? "bg-white text-black" : "bg-black text-white"}`}
      aria-live="polite"
    >
      <p
        className={`mb-1.5 text-[10px] font-bold tracking-[0.18em] ${
          light ? "text-neutral-500" : "text-muted"
        }`}
      >
        {label}
      </p>
      <article
        className={`border px-3 py-2.5 ${
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
          <SideBadge side={opinion.side} />
          <span
            className={`truncate text-[13px] font-semibold ${
              light ? "text-black" : "text-white"
            }`}
          >
            @{opinion.author}
          </span>
          <span
            className={`ml-auto inline-flex items-center gap-1 text-[11px] tabular-nums ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            <HeartMark className={light ? "text-neutral-500" : "text-muted"} />
            {opinion.likes}
          </span>
        </div>
        <p
          className={`line-clamp-3 text-[14px] leading-[1.45] ${
            light ? "text-black/90" : "text-white/95"
          }`}
        >
          “{opinion.text}”
        </p>
      </article>
    </div>
  );
}

/** 진영별 퍼센티지 — 의견 바로 아래 */
function SidePercent({
  side,
  percent,
  votes,
  joined,
  onJoin,
  light,
}: {
  side: Side;
  percent: number;
  votes: number;
  joined: Side | null;
  onJoin: (side: Side) => void;
  light: boolean;
}) {
  const isJoined = joined === side;
  const label = side === "NEXUS" ? "도전자 진영 지지" : "방어자 진영 지지";

  return (
    <button
      type="button"
      onClick={() => onJoin(side)}
      aria-label={label}
      className={`relative w-full overflow-hidden border-b px-4 py-3 text-left transition-opacity ${
        light
          ? "border-black/15 bg-white text-black"
          : "border-white/20 bg-black text-white"
      } ${isJoined ? "opacity-100" : "active:opacity-80"}`}
    >
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 ${
          light ? "bg-black/8" : "bg-white/10"
        }`}
        style={{ width: `${percent}%` }}
        aria-hidden
      />
      <div className="relative flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5">
          {side === "NEXUS" ? <SpearMark size={16} /> : <ShieldMark size={16} />}
          <span className="text-[18px] font-bold tabular-nums tracking-tight">
            {percent}%
          </span>
        </span>
        <span
          className={`text-[11px] ${light ? "text-neutral-500" : "text-muted"}`}
        >
          {isJoined ? "참전 중" : "지지"} · {votes.toLocaleString("ko-KR")}
        </span>
      </div>
    </button>
  );
}

export function ArenaBar({
  arena,
  opinions,
  nexusPercent,
  aegisPercent,
  openChallenger,
  openDefender,
  onToggleChallenger,
  onToggleDefender,
  onJoin,
  joined,
}: ArenaBarProps) {
  const challengerTop = useMemo(
    () => topOpinionForSide(opinions, "NEXUS"),
    [opinions],
  );
  const defenderTop = useMemo(
    () => topOpinionForSide(opinions, "AEGIS"),
    [opinions],
  );

  return (
    <section aria-label="아레나 기본창" className="bg-black">
      <div className="mx-auto max-w-[560px]">
        <div className="px-4 pb-2 pt-3 text-center">
          <p className="text-[11px] tracking-[0.18em] text-muted">
            제 {arena.round} 도마
          </p>
          <h2 className="mt-1.5 font-[family-name:var(--font-syne)] text-[18px] font-bold leading-snug tracking-tight text-white sm:text-[20px]">
            {arena.topic}
          </h2>
        </div>

        {/* 도전자: 선택 → 의견 → % */}
        <div className="border-t border-white/20">
          <button
            type="button"
            aria-expanded={openChallenger}
            aria-label="도전자"
            onClick={onToggleChallenger}
            className={`flex w-full min-h-[88px] flex-col items-center justify-center gap-2 transition-colors ${
              openChallenger
                ? "bg-white/[0.06] text-white"
                : "text-muted"
            }`}
          >
            <SpearMark size={36} />
            <span className="text-[11px] font-bold tracking-[0.16em]">
              도전자
            </span>
          </button>

          {openChallenger ? (
            <>
              {challengerTop ? (
                <TopOpinionCard
                  opinion={challengerTop}
                  label="도전자 · TOP 의견"
                  light={false}
                />
              ) : (
                <p className="bg-black px-4 py-4 text-center text-sm text-muted">
                  도전자 의견이 아직 없습니다.
                </p>
              )}
              <SidePercent
                side="NEXUS"
                percent={nexusPercent}
                votes={arena.nexusVotes}
                joined={joined}
                onJoin={onJoin}
                light={false}
              />
            </>
          ) : null}
        </div>

        {/* 방어자: 선택 → 의견(흰) → % */}
        <div className="border-t border-white/20">
          <button
            type="button"
            aria-expanded={openDefender}
            aria-label="방어자"
            onClick={onToggleDefender}
            className={`flex w-full min-h-[88px] flex-col items-center justify-center gap-2 transition-colors ${
              openDefender ? "bg-white text-black" : "bg-black text-muted"
            }`}
          >
            <ShieldMark size={36} />
            <span className="text-[11px] font-bold tracking-[0.16em]">
              방어자
            </span>
          </button>

          {openDefender ? (
            <>
              {defenderTop ? (
                <TopOpinionCard
                  opinion={defenderTop}
                  label="방어자 · TOP 의견"
                  light
                />
              ) : (
                <p className="bg-white px-4 py-4 text-center text-sm text-neutral-500">
                  방어자 의견이 아직 없습니다.
                </p>
              )}
              <SidePercent
                side="AEGIS"
                percent={aegisPercent}
                votes={arena.aegisVotes}
                joined={joined}
                onJoin={onJoin}
                light
              />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
