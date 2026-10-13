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
      className={`feed-item border-b px-4 py-2.5 ${
        light ? "border-black/10" : "border-white/10"
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="mb-0.5 flex items-center gap-2">
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
        className={`line-clamp-2 pl-10 text-[13px] leading-[1.4] ${
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
  const sideLabel = selected === "NEXUS" ? "도전자" : "방어자";

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

  // 현재 올라오는 의견 — 전체(양측)가 계속 보이게
  const live = useMemo(() => {
    return [...opinions].reverse();
  }, [opinions]);

  const selectSide = (side: Side) => {
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
        {/*
          위: 주제·설명 — sticky로 자리 고정 (헤더 아래).
          아래: 진영·펼침·피드가 그 아래 영역을 씀.
        */}
        <div
          className={`sticky top-[3.5rem] z-30 border-b px-5 ${
            selected ? "pb-3 pt-3" : "pb-5 pt-5"
          } ${
            light
              ? "border-black/12 bg-white/96 backdrop-blur-md"
              : "border-white/12 bg-black/96 backdrop-blur-md"
          }`}
          aria-label="오늘 주제 영역"
        >
          <p
            className={`text-[11px] tracking-[0.18em] ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            제 {arena.round} 도마
          </p>
          <h2
            className={`mt-2 font-[family-name:var(--font-syne)] font-bold tracking-tight ${
              selected
                ? "text-[18px] leading-[1.35] sm:text-[19px]"
                : "text-[24px] leading-[1.32] sm:text-[26px]"
            } ${light ? "text-black" : "text-white"}`}
          >
            {arena.topic}
          </h2>
          {!selected ? (
            <p
              className={`mt-3 max-w-[40em] text-[14px] leading-[1.65] ${
                light ? "text-black/72" : "text-white/78"
              }`}
            >
              {arena.description}
            </p>
          ) : (
            <p
              className={`mt-1.5 line-clamp-2 text-[12px] leading-[1.45] ${
                light ? "text-black/55" : "text-white/55"
              }`}
            >
              {arena.description}
            </p>
          )}
        </div>

        {/* 아래: 진영 선택 + (펼침 시) 의견 */}
        <div aria-label="진영과 의견 영역">
          <div
            className="grid grid-cols-2"
            role="tablist"
            aria-label="진영 선택"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selected === "NEXUS"}
              aria-label="도전자"
              onClick={() => selectSide("NEXUS")}
              className={`flex flex-col items-center justify-center gap-1.5 border-0 bg-black p-0 text-white shadow-none outline-none ring-0 focus:outline-none focus-visible:outline-none ${
                selected ? "min-h-[64px]" : "min-h-[88px]"
              } ${
                selected && selected !== "NEXUS" ? "opacity-50" : "opacity-100"
              }`}
            >
              <SpearMark size={selected ? 26 : 32} />
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
              className={`flex flex-col items-center justify-center gap-1.5 border-0 bg-white p-0 text-black shadow-none outline-none ring-0 focus:outline-none focus-visible:outline-none ${
                selected ? "min-h-[64px]" : "min-h-[88px]"
              } ${
                selected && selected !== "AEGIS" ? "opacity-50" : "opacity-100"
              }`}
            >
              <ShieldMark size={selected ? 26 : 32} />
              <span className="text-[12px] font-bold tracking-[0.18em]">
                방어자
              </span>
            </button>
          </div>

          {!selected ? (
            <p className="bg-black px-5 py-3 text-center text-[11px] tracking-[0.14em] text-muted">
              진영을 누르면 TOP 의견이 펼쳐집니다 · 다시 누르면 닫힙니다
            </p>
          ) : null}

        {selected ? (
          <>
            {/* 닫기 — 본래 화면으로 (재탭도 동일) */}
            <div
              className={`flex items-center justify-between border-t px-3 py-1.5 ${
                light ? "border-black/12 bg-white" : "border-white/12 bg-black"
              }`}
            >
              <p
                className={`text-[10px] font-bold tracking-[0.16em] ${
                  light ? "text-neutral-500" : "text-muted"
                }`}
              >
                {sideLabel} · 펼침
              </p>
              <button
                type="button"
                onClick={() => onChangeView("intro")}
                aria-label="기본 화면으로"
                className={`px-2 py-1 text-[12px] ${
                  light ? "text-neutral-600" : "text-muted"
                }`}
              >
                닫기 · 기본 화면
              </button>
            </div>

            {/*
              남은 뷰포트(헤더·주제·탭·하단바 제외)를 약 2/3 · 1/3로 분할.
              의견만 풀스크린 금지 — 아래 실시간 칸이 항상 보이게.
            */}
            <div
              className="flex flex-col"
              style={{
                height:
                  "calc(100dvh - 3.5rem - 7.5rem - 64px - 2.25rem - 84px - 3.5rem - env(safe-area-inset-bottom, 0px))",
                maxHeight: "58dvh",
              }}
            >
              {/* ~2/3: TOP + 해당 진영 글 */}
              <div
                className={`min-h-0 flex-[2] overflow-y-auto border-t ${
                  light ? "border-black/12" : "border-white/12"
                }`}
                aria-label={`${sideLabel} 의견 영역`}
              >
                <div className="px-4 py-3">
                  <p
                    className={`mb-2 text-[10px] font-bold tracking-[0.18em] ${
                      light ? "text-neutral-500" : "text-muted"
                    }`}
                  >
                    TOP 의견 · {sideLabel}
                  </p>
                  {top ? (
                    <article>
                      <div className="mb-1.5 flex items-center gap-2">
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
                            className={
                              light ? "text-neutral-500" : "text-muted"
                            }
                          />
                          {top.likes}
                        </span>
                      </div>
                      <p
                        className={`line-clamp-3 font-[family-name:var(--font-syne)] text-[14px] leading-[1.45] ${
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
                    {sideLabel} 올라오는 글
                  </p>
                </div>
                <ul aria-label={`${sideLabel} 올라오는 글`}>
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
              </div>

              {/* ~1/3 남은 영역: 현재 올라오는 의견이 계속 보임 */}
              <div
                className={`min-h-0 flex-[1] overflow-y-auto border-t ${
                  light
                    ? "border-black/15 bg-neutral-50"
                    : "border-white/15 bg-neutral-950"
                }`}
              >
                <div className="sticky top-0 z-10 px-4 py-2 backdrop-blur-sm">
                  <p
                    className={`text-[10px] font-bold tracking-[0.18em] ${
                      light ? "text-neutral-500" : "text-muted"
                    }`}
                  >
                    현재 올라오는 의견
                  </p>
                </div>
                <ul aria-label="현재 올라오는 의견">
                  {live.slice(0, 6).map((op, i) => (
                    <OpinionRow
                      key={`live-${op.id}`}
                      op={op}
                      light={light}
                      index={i}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : null}
        </div>
      </div>
    </section>
  );
}
