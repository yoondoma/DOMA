"use client";

import { useMemo } from "react";
import { ShieldMark, SideBadge, SpearMark } from "@/components/SideMarks";
import type { ArenaState, ArenaView, Opinion, Side } from "@/lib/types";

type ArenaBarProps = {
  arena: ArenaState;
  opinions: Opinion[];
  view: ArenaView;
  onChangeView: (view: ArenaView) => void;
};

function topOpinionForSide(opinions: Opinion[], side: Side): Opinion | null {
  const list = opinions.filter((o) => o.side === side);
  if (list.length === 0) return null;
  return [...list].sort((a, b) => b.likes - a.likes)[0] ?? null;
}

function HeartMark({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 ${className ?? ""}`}
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

function SmallAvatar({
  name,
  light,
}: {
  name: string;
  light?: boolean;
}) {
  return (
    <div
      className={`flex size-8 shrink-0 items-center justify-center border text-[10px] font-bold ${
        light
          ? "border-black/25 bg-neutral-100 text-black"
          : "border-white/30 bg-white/[0.06] text-muted"
      }`}
      aria-hidden
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

/** 첫 화면: 주제·설명·상징만 (Top·피드 없음). %는 하단 고정 바. */
function ArenaIntro({
  arena,
  onChangeView,
}: {
  arena: ArenaState;
  onChangeView: (view: ArenaView) => void;
}) {
  return (
    <section aria-label="아레나 기본창" className="bg-black text-white">
      <div className="mx-auto max-w-[560px] px-5 pb-6 pt-6">
        <p className="text-center text-[11px] tracking-[0.18em] text-muted">
          제 {arena.round} 도마
        </p>
        <h2 className="mt-3 text-center font-[family-name:var(--font-syne)] text-[22px] font-bold leading-snug tracking-tight text-white sm:text-[24px]">
          {arena.topic}
        </h2>
        <p className="mx-auto mt-4 max-w-[34em] text-center text-[14px] leading-[1.55] text-white/75">
          {arena.description}
        </p>

        <div
          className="mt-10 grid grid-cols-2 gap-3"
          role="navigation"
          aria-label="진영 선택"
        >
          <button
            type="button"
            aria-label="도전자 탭 열기"
            onClick={() => onChangeView("NEXUS")}
            className="flex min-h-[140px] flex-col items-center justify-center gap-3 border border-white/25 bg-white/[0.03] text-white transition-colors active:bg-white/[0.08]"
          >
            <SpearMark size={44} />
            <span className="text-[12px] font-bold tracking-[0.18em]">
              도전자
            </span>
          </button>
          <button
            type="button"
            aria-label="방어자 탭 열기"
            onClick={() => onChangeView("AEGIS")}
            className="flex min-h-[140px] flex-col items-center justify-center gap-3 border border-white/20 bg-white text-black transition-colors active:bg-neutral-100"
          >
            <ShieldMark size={44} />
            <span className="text-[12px] font-bold tracking-[0.18em]">
              방어자
            </span>
          </button>
        </div>

        <p className="mt-8 text-center text-[11px] tracking-[0.14em] text-muted">
          아래 퍼센티지로 현재 지지 비율을 확인하세요
        </p>
      </div>
    </section>
  );
}

function OpinionRow({
  op,
  light,
  index,
}: {
  op: Opinion;
  light: boolean;
  index: number;
}) {
  return (
    <li
      className={`feed-item border-b px-4 py-3 ${
        light ? "border-black/10" : "border-white/10"
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="mb-1 flex items-center gap-2">
        <SmallAvatar name={op.author} light={light} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`truncate text-[13px] font-semibold ${
                light ? "text-black" : "text-white"
              }`}
            >
              @{op.author}
            </span>
            <SideBadge side={op.side} />
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 text-[11px] tabular-nums ${
            light ? "text-neutral-500" : "text-muted"
          }`}
        >
          <HeartMark className={light ? "text-neutral-500" : "text-muted"} />
          {op.likes}
        </span>
      </div>
      <p
        className={`pl-10 text-[14px] leading-[1.45] ${
          light ? "text-black/90" : "text-white/95"
        }`}
      >
        {op.text}
      </p>
    </li>
  );
}

/** 도전자=흑 / 방어자=백 — TOP → 글들 → 현재 올라오는 의견 */
function SideView({
  side,
  opinions,
  onBack,
}: {
  side: Side;
  opinions: Opinion[];
  onBack: () => void;
}) {
  const light = side === "AEGIS";
  const label = side === "NEXUS" ? "도전자" : "방어자";

  const top = useMemo(
    () => topOpinionForSide(opinions, side),
    [opinions, side],
  );

  const rising = useMemo(() => {
    const rest = opinions
      .filter((o) => o.side === side && o.id !== top?.id)
      .sort((a, b) => b.likes - a.likes);
    return rest;
  }, [opinions, side, top?.id]);

  const live = useMemo(() => {
    return [...opinions]
      .filter((o) => o.side === side)
      .reverse();
  }, [opinions, side]);

  return (
    <section
      aria-label={`${label} 탭`}
      className={light ? "bg-white text-black" : "bg-black text-white"}
    >
      <div className="mx-auto max-w-[560px]">
        <div
          className={`flex items-center gap-2 border-b px-3 py-2.5 ${
            light ? "border-black/12" : "border-white/15"
          }`}
        >
          <button
            type="button"
            onClick={onBack}
            className={`px-2 py-1 text-[12px] ${
              light ? "text-neutral-500" : "text-muted"
            }`}
            aria-label="아레나 첫 화면으로"
          >
            ← 아레나
          </button>
          <div className="mx-auto flex items-center gap-2 pr-10">
            {side === "NEXUS" ? <SpearMark size={20} /> : <ShieldMark size={20} />}
            <span className="text-[12px] font-bold tracking-[0.16em]">
              {label}
            </span>
          </div>
        </div>

        {/* TOP */}
        <div
          className={`border-b px-4 py-4 ${
            light ? "border-black/12" : "border-white/12"
          }`}
        >
          <p
            className={`mb-2 text-[10px] font-bold tracking-[0.18em] ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            TOP 의견
          </p>
          {top ? (
            <article
              className={`border px-3 py-3 ${
                light
                  ? "border-black/15 bg-neutral-50"
                  : "border-white/20 bg-white/[0.03]"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <SmallAvatar name={top.author} light={light} />
                <span
                  className={`truncate text-[13px] font-semibold ${
                    light ? "text-black" : "text-white"
                  }`}
                >
                  @{top.author}
                </span>
                <SideBadge side={top.side} />
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
                className={`font-[family-name:var(--font-syne)] text-[15px] leading-[1.5] ${
                  light ? "text-black" : "text-white"
                }`}
              >
                “{top.text}”
              </p>
            </article>
          ) : (
            <p
              className={`text-sm ${light ? "text-neutral-500" : "text-muted"}`}
            >
              TOP 의견이 아직 없습니다.
            </p>
          )}
        </div>

        {/* 올라오는 글들 */}
        <div
          className={`border-b px-4 py-2 ${
            light ? "border-black/12" : "border-white/12"
          }`}
        >
          <p
            className={`text-[10px] font-bold tracking-[0.18em] ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            올라오는 글
          </p>
        </div>
        <ul aria-label={`${label} 올라오는 글`}>
          {rising.length === 0 ? (
            <li
              className={`px-4 py-6 text-center text-sm ${
                light ? "text-neutral-500" : "text-muted"
              }`}
            >
              아직 글이 없습니다.
            </li>
          ) : (
            rising.map((op, i) => (
              <OpinionRow key={op.id} op={op} light={light} index={i} />
            ))
          )}
        </ul>

        {/* 현재 올라오는 의견 */}
        <div
          className={`border-y px-4 py-2 ${
            light ? "border-black/12" : "border-white/12"
          }`}
        >
          <p
            className={`text-[10px] font-bold tracking-[0.18em] ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            현재 올라오는 의견
          </p>
        </div>
        <ul aria-label="현재 올라오는 의견">
          {live.map((op, i) => (
            <OpinionRow key={`live-${op.id}`} op={op} light={light} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ArenaBar({
  arena,
  opinions,
  view,
  onChangeView,
}: ArenaBarProps) {
  if (view === "intro") {
    return <ArenaIntro arena={arena} onChangeView={onChangeView} />;
  }

  return (
    <SideView
      side={view}
      opinions={opinions}
      onBack={() => onChangeView("intro")}
    />
  );
}
