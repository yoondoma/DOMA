"use client";

import { useMemo } from "react";
import { ShieldMark, SpearMark } from "@/components/SideMarks";
import type { ArenaState, Opinion, Side } from "@/lib/types";

type ArenaBarProps = {
  arena: ArenaState;
  opinions: Opinion[];
  nexusPercent: number;
  aegisPercent: number;
  selectedSide: Side;
  onSelectSide: (side: Side) => void;
  onJoin: (side: Side) => void;
  joined: Side | null;
};

function topOpinionForSide(opinions: Opinion[], side: Side): Opinion | null {
  const list = opinions.filter((o) => o.side === side);
  if (list.length === 0) return null;
  return [...list].sort((a, b) => b.likes - a.likes)[0] ?? null;
}

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

function SmallAvatar({
  name,
  light,
}: {
  name: string;
  light?: boolean;
}) {
  const initial = (name.slice(0, 1) || "?").toUpperCase();
  return (
    <div
      className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold ${
        light
          ? "border-black/30 bg-neutral-100 text-black"
          : "border-white/35 bg-white/[0.06] text-white"
      }`}
      aria-hidden
    >
      {initial}
    </div>
  );
}

function SideOpinionPane({
  opinion,
  side,
  selected,
  onSelect,
}: {
  opinion: Opinion | null;
  side: Side;
  selected: boolean;
  onSelect: () => void;
}) {
  const light = side === "AEGIS";
  const label = side === "NEXUS" ? "도전자" : "방어자";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${label} 의견`}
      className={`flex min-h-[200px] flex-col gap-2.5 px-3 py-3 text-left transition-colors ${
        light ? "bg-white text-black" : "bg-black text-white"
      } ${
        selected
          ? light
            ? "ring-1 ring-inset ring-black"
            : "ring-1 ring-inset ring-white"
          : "opacity-85"
      }`}
    >
      <div className="flex items-center gap-2">
        <SmallAvatar name={opinion?.author ?? label} light={light} />
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-[12px] font-semibold ${
              light ? "text-black" : "text-white"
            }`}
          >
            {opinion ? `@${opinion.author}` : "—"}
          </p>
          <p
            className={`text-[10px] tracking-[0.12em] ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            TOP · {label}
          </p>
        </div>
        {side === "NEXUS" ? <SpearMark size={14} /> : <ShieldMark size={14} />}
      </div>

      <div
        className={`mx-auto h-px w-10 ${light ? "bg-black/20" : "bg-white/20"}`}
        aria-hidden
      />

      {opinion ? (
        <p
          className={`line-clamp-6 font-[family-name:var(--font-syne)] text-[13px] leading-[1.45] ${
            light ? "text-black/90" : "text-white/95"
          }`}
        >
          {opinion.text}
        </p>
      ) : (
        <p
          className={`text-[12px] ${light ? "text-neutral-500" : "text-muted"}`}
        >
          아직 의견이 없습니다.
        </p>
      )}
    </button>
  );
}

export function ArenaBar({
  arena,
  opinions,
  nexusPercent,
  aegisPercent,
  selectedSide,
  onSelectSide,
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
        <div className="px-4 pb-3 pt-3 text-center">
          <p className="text-[11px] tracking-[0.18em] text-muted">
            제 {arena.round} 도마
          </p>
          <h2 className="mt-1.5 font-[family-name:var(--font-syne)] text-[18px] font-bold leading-snug tracking-tight text-white sm:text-[20px]">
            {arena.topic}
          </h2>
        </div>

        {/* 도전자 | 방어자 */}
        <div
          className="grid grid-cols-2 border-y border-white/20"
          role="tablist"
          aria-label="진영"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedSide === "NEXUS"}
            aria-label="도전자"
            onClick={() => onSelectSide("NEXUS")}
            className={`flex min-h-[72px] flex-col items-center justify-center gap-1.5 transition-colors ${
              selectedSide === "NEXUS"
                ? "bg-white/[0.06] text-white ring-1 ring-inset ring-white"
                : "text-muted"
            }`}
          >
            <SpearMark size={28} />
            <span className="text-[11px] font-bold tracking-[0.16em]">
              도전자
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedSide === "AEGIS"}
            aria-label="방어자"
            onClick={() => onSelectSide("AEGIS")}
            className={`flex min-h-[72px] flex-col items-center justify-center gap-1.5 transition-colors ${
              selectedSide === "AEGIS"
                ? "bg-white text-black"
                : "text-muted"
            }`}
          >
            <ShieldMark size={28} />
            <span className="text-[11px] font-bold tracking-[0.16em]">
              방어자
            </span>
          </button>
        </div>

        {/* 의견 좌우 동시 */}
        <div
          className="grid grid-cols-2 border-b border-white/20"
          aria-label="양측 의견"
        >
          <SideOpinionPane
            opinion={challengerTop}
            side="NEXUS"
            selected={selectedSide === "NEXUS"}
            onSelect={() => onSelectSide("NEXUS")}
          />
          <SideOpinionPane
            opinion={defenderTop}
            side="AEGIS"
            selected={selectedSide === "AEGIS"}
            onSelect={() => onSelectSide("AEGIS")}
          />
        </div>

        {/* 흑/백 % 스플릿 */}
        <div className="relative flex min-h-[92px] w-full overflow-hidden border-b border-white/20">
          <CrackDivider />
          <button
            type="button"
            onClick={() => onJoin("NEXUS")}
            aria-label="도전자 진영 지지"
            className={`relative flex flex-1 flex-col items-start justify-center gap-1 bg-black px-3 py-3 text-left text-white ${
              joined === "NEXUS" ? "opacity-100" : "active:opacity-80"
            }`}
            style={{ flexBasis: `${nexusPercent}%` }}
          >
            <span className="inline-flex items-center gap-1.5">
              <SpearMark size={16} />
              <span className="text-[15px] font-bold tabular-nums">
                {nexusPercent}%
              </span>
            </span>
            <span className="text-[11px] font-medium">도전자 진영 지지</span>
            <span className="text-[10px] text-muted">
              {joined === "NEXUS" ? "참전 중 · " : ""}
              {arena.nexusVotes.toLocaleString("ko-KR")}명
            </span>
          </button>
          <button
            type="button"
            onClick={() => onJoin("AEGIS")}
            aria-label="방어자 진영 지지"
            className={`relative flex flex-1 flex-col items-end justify-center gap-1 bg-white px-3 py-3 text-right text-black ${
              joined === "AEGIS" ? "opacity-100" : "active:opacity-80"
            }`}
            style={{ flexBasis: `${aegisPercent}%` }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[15px] font-bold tabular-nums">
                {aegisPercent}%
              </span>
              <ShieldMark size={16} />
            </span>
            <span className="text-[11px] font-medium">방어자 진영 지지</span>
            <span className="text-[10px] text-neutral-500">
              {joined === "AEGIS" ? "참전 중 · " : ""}
              {arena.aegisVotes.toLocaleString("ko-KR")}명
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
