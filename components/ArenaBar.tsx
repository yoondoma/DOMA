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
      className={`flex size-8 shrink-0 items-center justify-center text-[10px] font-bold ${
        light ? "text-neutral-500" : "text-muted"
      }`}
      aria-hidden
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
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

/** 같은 화면에서 톤 전환 + TOP 인플레이스 펼침 (페이지 이동 없음) */
export function ArenaBar({
  arena,
  opinions,
  view,
  onChangeView,
}: ArenaBarProps) {
  const selected: Side | null =
    view === "NEXUS" || view === "AEGIS" ? view : null;
  const light = selected === "AEGIS";

  const top = useMemo(
    () => (selected ? topOpinionForSide(opinions, selected) : null),
    [opinions, selected],
  );

  const rising = useMemo(() => {
    if (!selected || !top) return [];
    return opinions
      .filter((o) => o.side === selected && o.id !== top.id)
      .sort((a, b) => b.likes - a.likes);
  }, [opinions, selected, top]);

  const live = useMemo(() => {
    if (!selected) return [];
    return [...opinions].filter((o) => o.side === selected).reverse();
  }, [opinions, selected]);

  const selectSide = (side: Side) => {
    // 같은 탭 다시 누르면 접기
    if (view === side) {
      onChangeView("intro");
      return;
    }
    onChangeView(side);
  };

  return (
    <section
      aria-label="아레나 기본창"
      className={light ? "bg-white text-black" : "bg-black text-white"}
    >
      <div className="mx-auto max-w-[560px]">
        <div className="px-5 pb-4 pt-6">
          <p
            className={`text-center text-[11px] tracking-[0.18em] ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            제 {arena.round} 도마
          </p>
          <h2
            className={`mt-3 text-center font-[family-name:var(--font-syne)] text-[22px] font-bold leading-snug tracking-tight sm:text-[24px] ${
              light ? "text-black" : "text-white"
            }`}
          >
            {arena.topic}
          </h2>
          <p
            className={`mx-auto mt-4 max-w-[34em] text-center text-[14px] leading-[1.55] ${
              light ? "text-black/70" : "text-white/75"
            }`}
          >
            {arena.description}
          </p>
        </div>

        {/* 박스 없는 상징 + 라벨 */}
        <div
          className="grid grid-cols-2 px-2 pb-2"
          role="tablist"
          aria-label="진영 선택"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selected === "NEXUS"}
            aria-label="도전자"
            onClick={() => selectSide("NEXUS")}
            className={`flex min-h-[112px] flex-col items-center justify-center gap-2.5 border-0 bg-transparent p-0 shadow-none outline-none ring-0 transition-opacity focus:outline-none focus-visible:outline-none ${
              light ? "text-neutral-400" : "text-white"
            } ${selected && selected !== "NEXUS" ? "opacity-45" : "opacity-100"}`}
          >
            <SpearMark size={40} />
            <span className="text-[12px] font-bold tracking-[0.18em]">
              도전자
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selected === "AEGIS"}
            aria-label="방어자"
            onClick={() => selectSide("AEGIS")}
            className={`flex min-h-[112px] flex-col items-center justify-center gap-2.5 border-0 bg-transparent p-0 shadow-none outline-none ring-0 transition-opacity focus:outline-none focus-visible:outline-none ${
              light ? "text-black" : "text-white"
            } ${selected && selected !== "AEGIS" ? "opacity-45" : "opacity-100"}`}
          >
            <ShieldMark size={40} />
            <span className="text-[12px] font-bold tracking-[0.18em]">
              방어자
            </span>
          </button>
        </div>

        {!selected ? (
          <p
            className={`px-5 pb-6 text-center text-[11px] tracking-[0.14em] ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            진영을 누르면 TOP 의견이 펼쳐집니다
          </p>
        ) : null}

        {/* 인플레이스: TOP + 피드 */}
        {selected ? (
          <div className="feed-item">
            <div
              className={`border-t px-4 py-4 ${
                light ? "border-black/12" : "border-white/12"
              }`}
            >
              <p
                className={`mb-2 text-[10px] font-bold tracking-[0.18em] ${
                  light ? "text-neutral-500" : "text-muted"
                }`}
              >
                TOP 의견 · {selected === "NEXUS" ? "도전자" : "방어자"}
              </p>
              {top ? (
                <article>
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
                  className={`text-sm ${
                    light ? "text-neutral-500" : "text-muted"
                  }`}
                >
                  TOP 의견이 아직 없습니다.
                </p>
              )}
            </div>

            <div
              className={`border-t px-4 py-2 ${
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
            <ul aria-label="올라오는 글">
              {rising.map((op, i) => (
                <OpinionRow key={op.id} op={op} light={light} index={i} />
              ))}
            </ul>

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
                <OpinionRow
                  key={`live-${op.id}`}
                  op={op}
                  light={light}
                  index={i}
                />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
