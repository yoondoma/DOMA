"use client";

import { useEffect, useMemo, useState } from "react";
import { OpinionSocial } from "@/components/OpinionSocial";
import { SafetyMenu } from "@/components/SafetyMenu";
import { StatusBlock } from "@/components/StatusBlock";
import { ShieldMark, SideBadge, SpearMark } from "@/components/SideMarks";
import { BATTLE_HISTORY } from "@/lib/battle-history";
import { useDomaStore } from "@/lib/store";
import type { UiDemo } from "@/lib/ui-demo";
import type { ArenaState, ArenaView, Opinion, Side } from "@/lib/types";

/** CLOSING_SOON · 목업 `?closing=1` */
function useClosingSoon(): boolean {
  const clock = useDomaStore().clock;
  const [force, setForce] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("closing");
    setForce(q === "1" || q === "soon");
  }, []);
  return force || clock.state === "CLOSING_SOON" || clock.goldenHour;
}

type ArenaBarProps = {
  arena: ArenaState;
  opinions: Opinion[];
  view: ArenaView;
  onChangeView: (view: ArenaView) => void;
  /** 알림 등에서 연 글 — 하이라이트·스크롤 */
  focusOpinionId?: string | null;
  /** 목업 강제 상태 */
  uiDemo?: UiDemo;
  onRetry?: () => void;
  onCompose?: () => void;
};

function topOpinionForSide(opinions: Opinion[], side: Side): Opinion | null {
  const list = opinions.filter((o) => o.side === side);
  if (list.length === 0) return null;
  return [...list].sort((a, b) => b.likes - a.likes)[0] ?? null;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function useCountdown(endsAt: string): string {
  const [remaining, setRemaining] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      setRemaining(formatCountdown(new Date(endsAt).getTime() - Date.now()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);
  return remaining;
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
  focused,
}: {
  op: Opinion;
  light: boolean;
  index: number;
  focused?: boolean;
}) {
  return (
    <li
      data-opinion-id={op.id}
      className={`feed-item border-b px-4 py-2.5 ${
        light ? "border-black/10" : "border-white/10"
      } ${
        focused
          ? light
            ? "bg-black/[0.06] ring-1 ring-inset ring-black/40"
            : "bg-white/[0.08] ring-1 ring-inset ring-white/50"
          : ""
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
        {op.authorId ? (
          <SafetyMenu
            userId={op.authorId}
            reportKind="opinion"
            reportTargetId={op.id}
            light={light}
          />
        ) : null}
      </div>
      <p
        className={`line-clamp-2 pl-10 text-[13px] leading-[1.4] ${
          light ? "text-black/90" : "text-white/95"
        }`}
      >
        {op.text}
      </p>
      <OpinionSocial
        opinionId={op.id}
        likes={op.likes}
        replies={op.replies ?? 0}
        likedByMe={op.likedByMe}
        light={light}
      />
    </li>
  );
}

/** 1단계: 오늘 전장 첫 화면 — 회차·카운트다운·주제·흑/백 선택·챔피언 뉘앙스 */
function BattlefieldIntro({
  arena,
  opinions,
  onPickSide,
  uiDemo = "normal",
  onRetry,
  onCompose,
}: {
  arena: ArenaState;
  opinions: Opinion[];
  onPickSide: (side: Side) => void;
  uiDemo?: UiDemo;
  onRetry?: () => void;
  onCompose?: () => void;
}) {
  const remaining = useCountdown(arena.endsAt);
  const closingSoon = useClosingSoon();
  const champion = useMemo(() => {
    if (opinions.length === 0) return null;
    return [...opinions].sort((a, b) => b.likes - a.likes)[0] ?? null;
  }, [opinions]);
  const ticker = useMemo(() => {
    return BATTLE_HISTORY.slice(-2)
      .reverse()
      .map((b) => {
        const side = b.winner === "NEXUS" ? "흑" : "백";
        return `제${b.round}회 · ${side} 승리 ${b.winnerPercent}%`;
      })
      .join("  ◆  ");
  }, []);

  return (
    <div className="bg-black text-white" aria-label="오늘 전장">
      {/* 판결 카운트다운 — 빨간 타이머만 강조 */}
      <div className="battlefield-rise border-b border-white/10 px-5 pb-5 pt-6 text-center">
        <p className="text-[11px] font-medium tracking-[0.22em] text-white/45">
          제 {arena.round} 도마
        </p>
        <p className="mt-4 text-[11px] tracking-[0.18em] text-white/55">
          {closingSoon ? "판결 임박" : "최후의 판결까지"}
        </p>
        <p
          className={`mt-2 font-mono text-[34px] font-semibold leading-none tracking-[0.06em] text-timer tabular-nums sm:text-[38px] ${
            closingSoon ? "timer-closing-pulse" : ""
          }`}
          aria-label={`남은 시간 ${remaining}`}
          data-closing={closingSoon ? "soon" : undefined}
        >
          {remaining}
          <span className="ml-2 align-middle text-[13px] font-medium tracking-[0.14em] text-timer/90">
            남음
          </span>
        </p>
        {ticker ? (
          <p
            className="mt-4 truncate text-[10px] tracking-[0.04em] text-white/35"
            aria-label="최근 판결"
          >
            {ticker}
          </p>
        ) : null}
      </div>

      {/* 오늘의 전장 주제 */}
      <div
        className="battlefield-rise battlefield-rise-delay px-5 pb-6 pt-7"
        aria-label="오늘 주제 영역"
      >
        <p className="text-[11px] font-bold tracking-[0.2em] text-white/50">
          오늘의 전장
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-syne)] text-[23px] font-bold leading-[1.35] tracking-[-0.01em] text-white sm:text-[25px]">
          {arena.topic}
        </h2>
        <p className="mt-4 text-[14px] leading-[1.7] text-white/70">
          {arena.description}
        </p>
      </div>

      {/* 흑 / 백 진영 선택 면 */}
      <div
        className="grid grid-cols-2 gap-0 border-y border-white/15"
        role="tablist"
        aria-label="진영 선택"
      >
        <button
          type="button"
          role="tab"
          aria-selected={false}
          aria-label="도전자"
          onClick={() => onPickSide("NEXUS")}
          className="camp-press flex min-h-[104px] items-center justify-center border-r border-white/15 bg-black px-3 py-5 text-white active:bg-white/[0.04]"
        >
          <span className="text-[16px] font-bold tracking-[0.16em]">도전자</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={false}
          aria-label="방어자"
          onClick={() => onPickSide("AEGIS")}
          className="camp-press flex min-h-[104px] items-center justify-center bg-white px-3 py-5 text-black active:bg-neutral-100"
        >
          <span className="text-[16px] font-bold tracking-[0.16em]">방어자</span>
        </button>
      </div>

      {/* 챔피언 / 빈·로딩·실패 */}
      <div className="border-t border-white/10" aria-label="현재의 챔피언">
        {uiDemo === "loading" ? (
          <StatusBlock kind="loading" message="불러오는 중" />
        ) : uiDemo === "error" ? (
          <StatusBlock
            kind="error"
            message="의견을 불러오지 못했습니다."
            actionLabel="다시 시도"
            onAction={onRetry}
          />
        ) : !champion ? (
          <StatusBlock
            kind="empty"
            message="아직 올라온 의견이 없습니다."
            actionLabel={onCompose ? "글쓰기" : undefined}
            onAction={onCompose}
          />
        ) : (
          <div className="px-5 py-6">
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/45">
              현재의 챔피언
            </p>
            <div className="mt-3 border-t border-white/15 pt-4">
              <div className="flex items-center gap-2">
                <div
                  className="flex size-9 shrink-0 items-center justify-center border border-white/30 text-[12px] font-bold text-muted"
                  aria-hidden
                >
                  {champion.author.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[14px] font-semibold">
                      @{champion.author}
                    </span>
                    <SideBadge side={champion.side} />
                    {champion.side === "NEXUS" ? (
                      <SpearMark size={12} className="ml-auto text-white/50" />
                    ) : (
                      <ShieldMark size={12} className="ml-auto text-white/50" />
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-2.5 line-clamp-2 text-[13px] leading-[1.5] text-white/85">
                {champion.text}
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] tabular-nums text-muted">
                <HeartMark />
                {champion.likes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** 같은 화면에서 톤 전환 + TOP 인플레이스 펼침 (페이지 이동 없음) */
export function ArenaBar({
  arena,
  opinions,
  view,
  onChangeView,
  focusOpinionId = null,
  uiDemo = "normal",
  onRetry,
  onCompose,
}: ArenaBarProps) {
  const selected: Side | null =
    view === "NEXUS" || view === "AEGIS" ? view : null;
  const light = selected === "AEGIS";
  const sideLabel = selected === "NEXUS" ? "도전자" : "방어자";

  const top = useMemo(
    () => (selected ? topOpinionForSide(opinions, selected) : null),
    [opinions, selected],
  );

  useEffect(() => {
    if (!focusOpinionId || !selected) return;
    const el = document.querySelector<HTMLElement>(
      `[data-opinion-id="${focusOpinionId}"]`,
    );
    if (!el) return;
    window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [focusOpinionId, selected, view]);

  const rising = useMemo(() => {
    if (!selected || !top) return [];
    return opinions
      .filter((o) => o.side === selected && o.id !== top.id)
      .sort((a, b) => b.likes - a.likes);
  }, [opinions, selected, top]);

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

  if (!selected) {
    return (
      <section aria-label="아레나 기본창" className="bg-black text-white">
        <div className="mx-auto max-w-[560px]">
          <BattlefieldIntro
            arena={arena}
            opinions={opinions}
            onPickSide={(side) => onChangeView(side)}
            uiDemo={uiDemo}
            onRetry={onRetry}
            onCompose={onCompose}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="아레나 기본창"
      className={light ? "bg-white text-black" : "bg-black text-white"}
    >
      <div className="mx-auto max-w-[560px]">
        <div
          className={`sticky top-[5.75rem] z-30 border-b px-5 pb-3 pt-3 ${
            light
              ? "border-black/12 bg-white/96 backdrop-blur-md"
              : "border-white/12 bg-black/96 backdrop-blur-md"
          }`}
          aria-label="오늘 주제 영역"
        >
          <p
            className={`text-[11px] font-medium tracking-[0.2em] ${
              light ? "text-neutral-500" : "text-white/45"
            }`}
          >
            제 {arena.round} 도마
          </p>
          <h2
            className={`mt-2 font-[family-name:var(--font-syne)] text-[18px] font-bold leading-[1.4] tracking-[-0.01em] sm:text-[19px] ${
              light ? "text-black" : "text-white"
            }`}
          >
            {arena.topic}
          </h2>
          <p
            className={`mt-2 line-clamp-2 text-[12px] leading-[1.55] ${
              light ? "text-black/55" : "text-white/55"
            }`}
          >
            {arena.description}
          </p>
        </div>

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
              className={`camp-press flex min-h-[64px] flex-col items-center justify-center gap-1.5 border-0 bg-black p-0 text-white ${
                selected !== "NEXUS" ? "opacity-50" : "opacity-100"
              }`}
            >
              <SpearMark size={26} />
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
              className={`camp-press flex min-h-[64px] flex-col items-center justify-center gap-1.5 border-0 bg-white p-0 text-black ${
                selected !== "AEGIS" ? "opacity-50" : "opacity-100"
              }`}
            >
              <ShieldMark size={26} />
              <span className="text-[12px] font-bold tracking-[0.18em]">
                방어자
              </span>
            </button>
          </div>

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
              {sideLabel} · 의견 탐색
            </p>
            <button
              type="button"
              onClick={() => onChangeView("intro")}
              aria-label="기본 화면으로"
              className={`px-2 py-1 text-[12px] ${
                light ? "text-neutral-600" : "text-muted"
              }`}
            >
              닫기 · 전장으로
            </button>
          </div>

          <div
            className="flex flex-col"
            style={{
              height:
                "calc(100dvh - 3.5rem - 7.5rem - 64px - 2.25rem - 84px - 3.5rem - env(safe-area-inset-bottom, 0px))",
              maxHeight: "58dvh",
            }}
          >
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
                {uiDemo === "loading" ? (
                  <StatusBlock kind="loading" message="불러오는 중" />
                ) : uiDemo === "error" ? (
                  <StatusBlock
                    kind="error"
                    message="의견을 불러오지 못했습니다."
                    actionLabel="다시 시도"
                    onAction={onRetry}
                  />
                ) : top ? (
                  <article
                    data-opinion-id={
                      focusOpinionId === top.id ? top.id : undefined
                    }
                    className={
                      focusOpinionId === top.id
                        ? light
                          ? "rounded-sm bg-black/[0.06] p-2 ring-1 ring-black/40"
                          : "rounded-sm bg-white/[0.08] p-2 ring-1 ring-white/50"
                        : undefined
                    }
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <SmallAvatar name={top.author} light={light} />
                      <span
                        className={`min-w-0 flex-1 truncate text-[13px] font-semibold ${
                          light ? "text-black" : "text-white"
                        }`}
                      >
                        @{top.author}
                      </span>
                      <SideBadge side={top.side} />
                      {top.authorId ? (
                        <SafetyMenu
                          userId={top.authorId}
                          reportKind="opinion"
                          reportTargetId={top.id}
                          light={light}
                        />
                      ) : null}
                    </div>
                    <p
                      className={`line-clamp-3 font-[family-name:var(--font-syne)] text-[14px] leading-[1.45] ${
                        light ? "text-black" : "text-white"
                      }`}
                    >
                      “{top.text}”
                    </p>
                    <OpinionSocial
                      opinionId={top.id}
                      likes={top.likes}
                      replies={top.replies ?? 0}
                      likedByMe={top.likedByMe}
                      light={light}
                      indent={false}
                    />
                  </article>
                ) : (
                  <StatusBlock
                    kind="empty"
                    message="TOP 의견이 아직 없습니다."
                    actionLabel={onCompose ? "글쓰기" : undefined}
                    onAction={onCompose}
                  />
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
                {rising.length === 0 &&
                uiDemo !== "loading" &&
                uiDemo !== "error" ? (
                  <li>
                    <StatusBlock kind="empty" message="아직 글이 없습니다." />
                  </li>
                ) : rising.length === 0 ? null : (
                  rising.map((op, i) => (
                    <OpinionRow
                      key={op.id}
                      op={op}
                      light={light}
                      index={i}
                      focused={focusOpinionId === op.id}
                    />
                  ))
                )}
              </ul>
            </div>

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
                    focused={focusOpinionId === op.id && top?.id !== op.id}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
