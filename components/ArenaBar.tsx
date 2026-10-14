"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from "react";
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
  focusOpinionId?: string | null;
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

function SmallAvatar({ name }: { name: string }) {
  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center border border-white/30 text-[10px] font-bold text-muted"
      aria-hidden
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

function OpinionRow({
  op,
  index,
  focused,
}: {
  op: Opinion;
  index: number;
  focused?: boolean;
}) {
  return (
    <li
      data-opinion-id={op.id}
      className={`feed-item border-b border-white/10 px-4 py-2.5 ${
        focused ? "bg-white/[0.08] ring-1 ring-inset ring-white/50" : ""
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="mb-0.5 flex items-center gap-2">
        <SmallAvatar name={op.author} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[13px] font-semibold text-white">
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
          />
        ) : null}
      </div>
      <p className="line-clamp-2 pl-10 text-[13px] leading-[1.4] text-white/95">
        {op.text}
      </p>
      <OpinionSocial
        opinionId={op.id}
        likes={op.likes}
        replies={op.replies ?? 0}
        likedByMe={op.likedByMe}
      />
    </li>
  );
}

function CampFeedPage({
  side,
  label,
  Mark,
  opinions,
  uiDemo,
  onRetry,
  onCompose,
  focusOpinionId,
}: {
  side: Side;
  label: string;
  Mark: typeof SpearMark;
  opinions: Opinion[];
  uiDemo: UiDemo;
  onRetry?: () => void;
  onCompose?: () => void;
  focusOpinionId?: string | null;
}) {
  const top = useMemo(
    () => topOpinionForSide(opinions, side),
    [opinions, side],
  );
  const rising = useMemo(() => {
    if (!top) return [];
    return opinions
      .filter((o) => o.side === side && o.id !== top.id)
      .sort((a, b) => b.likes - a.likes);
  }, [opinions, side, top]);

  return (
    <div
      className="h-full w-full min-w-full shrink-0 snap-center snap-always overflow-y-auto"
      data-camp-page={side}
      aria-label={`${label} 의견 영역`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <Mark size={16} className="text-white" />
        <p className="text-[10px] font-bold tracking-[0.16em] text-muted">
          TOP 의견 · {label}
        </p>
      </div>

      <div className="px-4 py-3">
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
            data-opinion-id={focusOpinionId === top.id ? top.id : undefined}
            className={
              focusOpinionId === top.id
                ? "rounded-sm bg-white/[0.08] p-2 ring-1 ring-white/50"
                : undefined
            }
          >
            <div className="mb-1.5 flex items-center gap-2">
              <SmallAvatar name={top.author} />
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-white">
                @{top.author}
              </span>
              <SideBadge side={top.side} />
              {top.authorId ? (
                <SafetyMenu
                  userId={top.authorId}
                  reportKind="opinion"
                  reportTargetId={top.id}
                />
              ) : null}
            </div>
            <p className="line-clamp-3 font-[family-name:var(--font-syne)] text-[14px] leading-[1.45] text-white">
              “{top.text}”
            </p>
            <OpinionSocial
              opinionId={top.id}
              likes={top.likes}
              replies={top.replies ?? 0}
              likedByMe={top.likedByMe}
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

      <div className="border-t border-white/10 px-4 py-2">
        <p className="text-[10px] font-bold tracking-[0.18em] text-muted">
          {label} 올라오는 글
        </p>
      </div>
      <ul aria-label={`${label} 올라오는 글`}>
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
              index={i}
              focused={focusOpinionId === op.id}
            />
          ))
        )}
      </ul>
    </div>
  );
}

/**
 * 오늘 전장 — 상단(회차·타이머·주제·시놉시스) 고정,
 * 아래 가로 스와이프: 좌=도전자 · 우=방어자.
 * 진영 전환 시 화면 전체 톤 반전 없음 (항상 B&W 검정 셸).
 */
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
  const remaining = useCountdown(arena.endsAt);
  const closingSoon = useClosingSoon();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ignoreScroll = useRef(false);

  const activeSide: Side = view === "AEGIS" ? "AEGIS" : "NEXUS";

  const ticker = useMemo(() => {
    return BATTLE_HISTORY.slice(-2)
      .reverse()
      .map((b) => {
        const side = b.winner === "NEXUS" ? "흑" : "백";
        return `제${b.round}회 · ${side} 승리 ${b.winnerPercent}%`;
      })
      .join("  ◆  ");
  }, []);

  const scrollToSide = useCallback(
    (side: Side, behavior: ScrollBehavior = "smooth") => {
      const el = scrollerRef.current;
      if (!el) return;
      const page = side === "AEGIS" ? 1 : 0;
      ignoreScroll.current = true;
      el.scrollTo({ left: page * el.clientWidth, behavior });
      window.setTimeout(() => {
        ignoreScroll.current = false;
      }, behavior === "smooth" ? 380 : 0);
      onChangeView(side);
    },
    [onChangeView],
  );

  /** 외부 view / 알림 딥링크와 스크롤 동기화 */
  useEffect(() => {
    if (view !== "NEXUS" && view !== "AEGIS") return;
    const el = scrollerRef.current;
    if (!el) return;
    const page = view === "AEGIS" ? 1 : 0;
    const target = page * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) < 4) return;
    ignoreScroll.current = true;
    el.scrollTo({ left: target, behavior: "auto" });
    window.setTimeout(() => {
      ignoreScroll.current = false;
    }, 50);
  }, [view]);

  useEffect(() => {
    if (!focusOpinionId) return;
    const side =
      opinions.find((o) => o.id === focusOpinionId)?.side ?? activeSide;
    scrollToSide(side, "auto");
    window.requestAnimationFrame(() => {
      const node = document.querySelector<HTMLElement>(
        `[data-opinion-id="${focusOpinionId}"]`,
      );
      node?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [focusOpinionId, opinions, activeSide, scrollToSide]);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    if (ignoreScroll.current) return;
    const el = e.currentTarget;
    const page = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    const side: Side = page >= 1 ? "AEGIS" : "NEXUS";
    if (side !== activeSide || view === "intro") {
      onChangeView(side);
    }
  };

  return (
    <section aria-label="아레나 기본창" className="bg-black text-white">
      <div className="mx-auto max-w-[560px]">
        {/* 상단 맥락 — 스와이프와 무관하게 항상 검정 위 흰 글자 */}
        <div
          className="sticky top-[5.75rem] z-30 border-b border-white/12 bg-black/96 px-5 pb-3 pt-3 backdrop-blur-md"
          aria-label="오늘 주제 영역"
        >
          <div className="battlefield-rise text-center">
            <p className="text-[11px] font-medium tracking-[0.22em] text-white/45">
              제 {arena.round} 도마
            </p>
            <p className="mt-2 text-[11px] tracking-[0.18em] text-white/55">
              {closingSoon ? "판결 임박" : "최후의 판결까지"}
            </p>
            <p
              className={`mt-1.5 font-mono text-[28px] font-semibold leading-none tracking-[0.06em] text-timer tabular-nums sm:text-[32px] ${
                closingSoon ? "timer-closing-pulse" : ""
              }`}
              aria-label={`남은 시간 ${remaining}`}
              data-closing={closingSoon ? "soon" : undefined}
            >
              {remaining}
              <span className="ml-2 align-middle text-[12px] font-medium tracking-[0.14em] text-timer/90">
                남음
              </span>
            </p>
            {ticker ? (
              <p
                className="mt-2 truncate text-[10px] tracking-[0.04em] text-white/35"
                aria-label="최근 판결"
              >
                {ticker}
              </p>
            ) : null}
          </div>
          <h2 className="battlefield-rise battlefield-rise-delay mt-3 font-[family-name:var(--font-syne)] text-[18px] font-bold leading-[1.4] tracking-[-0.01em] text-white sm:text-[19px]">
            {arena.topic}
          </h2>
          <p className="mt-2 line-clamp-2 text-[12px] leading-[1.55] text-white/55">
            {arena.description}
          </p>
        </div>

        {/* 진영 레일 — 창/방패 심볼 + 라벨 (탭 = 스와이프 동기) */}
        <div
          className="grid grid-cols-2 border-b border-white/15"
          role="tablist"
          aria-label="진영 선택"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeSide === "NEXUS"}
            aria-label="도전자"
            onClick={() => scrollToSide("NEXUS")}
            className={`camp-press flex min-h-[56px] flex-col items-center justify-center gap-1 border-r border-white/15 bg-black text-white ${
              activeSide === "NEXUS"
                ? "opacity-100"
                : "opacity-45"
            }`}
          >
            <SpearMark size={22} />
            <span className="text-[11px] font-bold tracking-[0.16em]">
              도전자
            </span>
            <span
              className={`mt-0.5 h-0.5 w-8 ${
                activeSide === "NEXUS" ? "bg-white" : "bg-transparent"
              }`}
              aria-hidden
            />
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSide === "AEGIS"}
            aria-label="방어자"
            onClick={() => scrollToSide("AEGIS")}
            className={`camp-press flex min-h-[56px] flex-col items-center justify-center gap-1 bg-black text-white ${
              activeSide === "AEGIS"
                ? "opacity-100"
                : "opacity-45"
            }`}
          >
            <ShieldMark size={22} />
            <span className="text-[11px] font-bold tracking-[0.16em]">
              방어자
            </span>
            <span
              className={`mt-0.5 h-0.5 w-8 ${
                activeSide === "AEGIS" ? "bg-white" : "bg-transparent"
              }`}
              aria-hidden
            />
          </button>
        </div>

        <p className="px-4 py-1.5 text-[10px] tracking-[0.12em] text-muted">
          좌우로 밀면 진영 피드 ·{" "}
          {activeSide === "NEXUS" ? "도전자" : "방어자"}
        </p>

        {/* 가로 스냅 페이지 */}
        <div
          ref={scrollerRef}
          className="camp-swipe flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          style={{
            height:
              "calc(100dvh - 3.5rem - 5.75rem - 11.5rem - 84px - 3.5rem - env(safe-area-inset-bottom, 0px))",
            maxHeight: "52dvh",
            WebkitOverflowScrolling: "touch",
          }}
          onScroll={onScroll}
          aria-label="진영 피드 스와이프"
        >
          <CampFeedPage
            side="NEXUS"
            label="도전자"
            Mark={SpearMark}
            opinions={opinions}
            uiDemo={uiDemo}
            onRetry={onRetry}
            onCompose={onCompose}
            focusOpinionId={focusOpinionId}
          />
          <CampFeedPage
            side="AEGIS"
            label="방어자"
            Mark={ShieldMark}
            opinions={opinions}
            uiDemo={uiDemo}
            onRetry={onRetry}
            onCompose={onCompose}
            focusOpinionId={focusOpinionId}
          />
        </div>
      </div>
    </section>
  );
}
