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

/** `?top=defender|challenger` — 셸 톤 증명용 TOP 진영 강제 */
export function useForcedTopSide(): Side | null {
  const [forced, setForced] = useState<Side | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("top");
    if (q === "defender" || q === "aegis" || q === "AEGIS") {
      setForced("AEGIS");
    } else if (q === "challenger" || q === "nexus" || q === "NEXUS") {
      setForced("NEXUS");
    } else {
      setForced(null);
    }
  }, []);
  return forced;
}

/** 그날 TOP 의견 진영 — 좋아요 최다 (강제 쿼리 우선) */
export function dayTopSide(
  opinions: Opinion[],
  forced: Side | null,
): Side | null {
  if (forced) return forced;
  if (opinions.length === 0) return null;
  return [...opinions].sort((a, b) => b.likes - a.likes)[0]?.side ?? null;
}

export function dayTopOpinion(
  opinions: Opinion[],
  forced: Side | null,
): Opinion | null {
  if (opinions.length === 0) return null;
  if (forced) {
    const sideList = opinions
      .filter((o) => o.side === forced)
      .sort((a, b) => b.likes - a.likes);
    return sideList[0] ?? [...opinions].sort((a, b) => b.likes - a.likes)[0];
  }
  return [...opinions].sort((a, b) => b.likes - a.likes)[0] ?? null;
}

type ArenaBarProps = {
  arena: ArenaState;
  opinions: Opinion[];
  view: ArenaView;
  onChangeView: (view: ArenaView) => void;
  /** 셸 톤 = 그날 TOP 진영 (탭/스와이프와 무관) */
  shellLight: boolean;
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

function SmallAvatar({ name, light }: { name: string; light?: boolean }) {
  return (
    <div
      className={`flex size-8 shrink-0 items-center justify-center border text-[10px] font-bold ${
        light
          ? "border-black/25 text-neutral-600"
          : "border-white/30 text-muted"
      }`}
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
  light,
}: {
  op: Opinion;
  index: number;
  focused?: boolean;
  light: boolean;
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

function CampFeedPage({
  side,
  label,
  Mark,
  opinions,
  uiDemo,
  onRetry,
  onCompose,
  focusOpinionId,
  light,
}: {
  side: Side;
  label: string;
  Mark: typeof SpearMark;
  opinions: Opinion[];
  uiDemo: UiDemo;
  onRetry?: () => void;
  onCompose?: () => void;
  focusOpinionId?: string | null;
  light: boolean;
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

  const ink = light ? "text-black" : "text-white";
  const muted = light ? "text-neutral-500" : "text-muted";
  const border = light ? "border-black/10" : "border-white/10";

  return (
    <div
      className="camp-swipe-page h-full"
      style={{
        scrollSnapAlign: "center",
        scrollSnapStop: "always",
        overflowY: "auto",
        overscrollBehaviorY: "contain",
        minWidth: 0,
      }}
      data-camp-page={side}
      aria-label={`${label} 의견 영역`}
    >
      <div className={`flex items-center gap-2 border-b px-4 py-2.5 ${border}`}>
        <Mark size={16} className={ink} />
        <p className={`text-[10px] font-bold tracking-[0.16em] ${muted}`}>
          TOP 의견 · {label}
        </p>
      </div>

      <div className="px-4 py-3">
        {uiDemo === "loading" ? (
          <StatusBlock kind="loading" message="불러오는 중" light={light} />
        ) : uiDemo === "error" ? (
          <StatusBlock
            kind="error"
            message="의견을 불러오지 못했습니다."
            actionLabel="다시 시도"
            onAction={onRetry}
            light={light}
          />
        ) : top ? (
          <article
            data-opinion-id={focusOpinionId === top.id ? top.id : undefined}
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
                className={`min-w-0 flex-1 truncate text-[13px] font-semibold ${ink}`}
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
              className={`line-clamp-3 font-[family-name:var(--font-syne)] text-[14px] leading-[1.45] ${ink}`}
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
            light={light}
          />
        )}
      </div>

      <div className={`border-t px-4 py-2 ${border}`}>
        <p className={`text-[10px] font-bold tracking-[0.18em] ${muted}`}>
          {label} 올라오는 글
        </p>
      </div>
      <ul aria-label={`${label} 올라오는 글`}>
        {rising.length === 0 &&
        uiDemo !== "loading" &&
        uiDemo !== "error" ? (
          <li>
            <StatusBlock
              kind="empty"
              message="아직 글이 없습니다."
              light={light}
            />
          </li>
        ) : rising.length === 0 ? null : (
          rising.map((op, i) => (
            <OpinionRow
              key={op.id}
              op={op}
              index={i}
              focused={focusOpinionId === op.id}
              light={light}
            />
          ))
        )}
      </ul>
    </div>
  );
}

/** 첫 화면 — 주제·시놉시스·진영(창/방패)·그날 TOP */
function BattlefieldIntro({
  arena,
  champion,
  onPickSide,
  uiDemo,
  onRetry,
  onCompose,
  light,
}: {
  arena: ArenaState;
  champion: Opinion | null;
  onPickSide: (side: Side) => void;
  uiDemo: UiDemo;
  onRetry?: () => void;
  onCompose?: () => void;
  light: boolean;
}) {
  const remaining = useCountdown(arena.endsAt);
  const closingSoon = useClosingSoon();
  const ticker = useMemo(() => {
    return BATTLE_HISTORY.slice(-2)
      .reverse()
      .map((b) => {
        const side = b.winner === "NEXUS" ? "흑" : "백";
        return `제${b.round}회 · ${side} 승리 ${b.winnerPercent}%`;
      })
      .join("  ◆  ");
  }, []);

  const ink = light ? "text-black" : "text-white";
  const soft = light ? "text-black/55" : "text-white/55";
  const faint = light ? "text-black/40" : "text-white/45";
  const border = light ? "border-black/12" : "border-white/10";

  return (
    <div
      className={light ? "bg-white text-black" : "bg-black text-white"}
      aria-label="오늘 전장"
      data-shell={light ? "light" : "dark"}
    >
      <div
        className={`battlefield-rise border-b px-5 pb-5 pt-6 text-center ${border}`}
      >
        <p className={`text-[11px] font-medium tracking-[0.22em] ${faint}`}>
          제 {arena.round} 도마
        </p>
        <p className={`mt-4 text-[11px] tracking-[0.18em] ${soft}`}>
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
            className={`mt-4 truncate text-[10px] tracking-[0.04em] ${
              light ? "text-black/35" : "text-white/35"
            }`}
            aria-label="최근 판결"
          >
            {ticker}
          </p>
        ) : null}
      </div>

      <div
        className="battlefield-rise battlefield-rise-delay px-5 pb-6 pt-7"
        aria-label="오늘 주제 영역"
      >
        <p
          className={`text-[11px] font-bold tracking-[0.2em] ${
            light ? "text-black/50" : "text-white/50"
          }`}
        >
          오늘의 전장
        </p>
        <h2
          className={`mt-3 font-[family-name:var(--font-syne)] text-[23px] font-bold leading-[1.35] tracking-[-0.01em] sm:text-[25px] ${ink}`}
        >
          {arena.topic}
        </h2>
        <p
          className={`mt-4 text-[14px] leading-[1.7] ${
            light ? "text-black/70" : "text-white/70"
          }`}
        >
          {arena.description}
        </p>
      </div>

      {/* 진영 — 창/방패 (셸과 별개로 흑|백 정체성) */}
      <div
        className={`grid grid-cols-2 gap-0 border-y ${
          light ? "border-black/15" : "border-white/15"
        }`}
        role="tablist"
        aria-label="진영 선택"
      >
        <button
          type="button"
          role="tab"
          aria-selected={false}
          aria-label="도전자"
          onClick={() => onPickSide("NEXUS")}
          className="camp-press flex min-h-[104px] flex-col items-center justify-center gap-2 border-r border-white/15 bg-black px-3 py-5 text-white active:bg-white/[0.04]"
        >
          <SpearMark size={28} />
          <span className="text-[15px] font-bold tracking-[0.16em]">도전자</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={false}
          aria-label="방어자"
          onClick={() => onPickSide("AEGIS")}
          className="camp-press flex min-h-[104px] flex-col items-center justify-center gap-2 bg-white px-3 py-5 text-black active:bg-neutral-100"
        >
          <ShieldMark size={28} />
          <span className="text-[15px] font-bold tracking-[0.16em]">방어자</span>
        </button>
      </div>

      <div className={`border-t ${border}`} aria-label="현재의 챔피언">
        {uiDemo === "loading" ? (
          <StatusBlock kind="loading" message="불러오는 중" light={light} />
        ) : uiDemo === "error" ? (
          <StatusBlock
            kind="error"
            message="의견을 불러오지 못했습니다."
            actionLabel="다시 시도"
            onAction={onRetry}
            light={light}
          />
        ) : !champion ? (
          <StatusBlock
            kind="empty"
            message="아직 올라온 의견이 없습니다."
            actionLabel={onCompose ? "글쓰기" : undefined}
            onAction={onCompose}
            light={light}
          />
        ) : (
          <div className="px-5 py-6">
            <p
              className={`text-[10px] font-bold tracking-[0.2em] ${faint}`}
            >
              TOP 의견 ·{" "}
              {champion.side === "NEXUS" ? "도전자" : "방어자"}
            </p>
            <div className={`mt-3 border-t pt-4 ${border}`}>
              <div className="flex items-center gap-2">
                <SmallAvatar name={champion.author} light={light} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`truncate text-[14px] font-semibold ${ink}`}>
                      @{champion.author}
                    </span>
                    <SideBadge side={champion.side} />
                    {champion.side === "NEXUS" ? (
                      <SpearMark
                        size={12}
                        className={`ml-auto ${light ? "text-black/50" : "text-white/50"}`}
                      />
                    ) : (
                      <ShieldMark
                        size={12}
                        className={`ml-auto ${light ? "text-black/50" : "text-white/50"}`}
                      />
                    )}
                  </div>
                </div>
              </div>
              <p
                className={`mt-2.5 line-clamp-3 text-[13px] leading-[1.5] ${
                  light ? "text-black/85" : "text-white/85"
                }`}
              >
                {champion.text}
              </p>
              <p
                className={`mt-2 text-[11px] tabular-nums ${
                  light ? "text-neutral-500" : "text-muted"
                }`}
              >
                ♥ {champion.likes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 오늘 전장
 * - 셸 톤 = 그날 TOP 진영 (탭/스와이프와 무관)
 * - intro: 주제·진영·TOP
 * - 스와이프: 좌 도전자 / 우 방어자 피드
 */
export function ArenaBar({
  arena,
  opinions,
  view,
  onChangeView,
  shellLight,
  focusOpinionId = null,
  uiDemo = "normal",
  onRetry,
  onCompose,
}: ArenaBarProps) {
  const forcedTop = useForcedTopSide();
  const champion = useMemo(
    () => dayTopOpinion(opinions, forcedTop),
    [opinions, forcedTop],
  );
  const remaining = useCountdown(arena.endsAt);
  const closingSoon = useClosingSoon();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ignoreScroll = useRef(false);
  const light = shellLight;

  const selected: Side | null =
    view === "NEXUS" || view === "AEGIS" ? view : null;

  const scrollToSide = useCallback(
    (side: Side, behavior: ScrollBehavior = "smooth") => {
      const el = scrollerRef.current;
      if (!el) {
        onChangeView(side);
        return;
      }
      const page = side === "AEGIS" ? 1 : 0;
      ignoreScroll.current = true;
      const w = el.clientWidth;
      el.scrollTo({ left: page * w, behavior });
      window.setTimeout(
        () => {
          ignoreScroll.current = false;
        },
        behavior === "smooth" ? 400 : 0,
      );
      onChangeView(side);
    },
    [onChangeView],
  );

  useEffect(() => {
    if (view !== "NEXUS" && view !== "AEGIS") return;
    const el = scrollerRef.current;
    if (!el) return;
    const page = view === "AEGIS" ? 1 : 0;
    const target = page * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) < 8) return;
    ignoreScroll.current = true;
    el.scrollTo({ left: target, behavior: "auto" });
    window.setTimeout(() => {
      ignoreScroll.current = false;
    }, 60);
  }, [view]);

  useEffect(() => {
    if (!focusOpinionId) return;
    const side = opinions.find((o) => o.id === focusOpinionId)?.side;
    if (!side) return;
    if (view === "intro") onChangeView(side);
    else scrollToSide(side, "auto");
    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(`[data-opinion-id="${focusOpinionId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [focusOpinionId, opinions, view, onChangeView, scrollToSide]);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    if (ignoreScroll.current) return;
    const el = e.currentTarget;
    const w = Math.max(1, el.clientWidth);
    const page = Math.round(el.scrollLeft / w);
    const side: Side = page >= 1 ? "AEGIS" : "NEXUS";
    if (side !== selected) onChangeView(side);
  };

  const ink = light ? "text-black" : "text-white";
  const soft = light ? "text-black/55" : "text-white/55";
  const faint = light ? "text-neutral-500" : "text-white/45";
  const border = light ? "border-black/12" : "border-white/12";
  const shellBg = light ? "bg-white text-black" : "bg-black text-white";

  if (!selected) {
    return (
      <section
        aria-label="아레나 기본창"
        className={shellBg}
        data-shell={light ? "light" : "dark"}
        data-top-side={champion?.side ?? "none"}
      >
        <div className="mx-auto max-w-[560px]">
          <BattlefieldIntro
            arena={arena}
            champion={champion}
            onPickSide={(side) => onChangeView(side)}
            uiDemo={uiDemo}
            onRetry={onRetry}
            onCompose={onCompose}
            light={light}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="아레나 기본창"
      className={shellBg}
      data-shell={light ? "light" : "dark"}
      data-top-side={champion?.side ?? "none"}
    >
      <div className="mx-auto max-w-[560px]">
        <div
          className={`sticky top-[5.75rem] z-30 border-b px-5 pb-3 pt-3 backdrop-blur-md ${border} ${
            light ? "bg-white/96" : "bg-black/96"
          }`}
          aria-label="오늘 주제 영역"
        >
          <p className={`text-[11px] font-medium tracking-[0.2em] ${faint}`}>
            제 {arena.round} 도마
          </p>
          <p
            className={`mt-1 font-mono text-[22px] font-semibold tabular-nums text-timer ${
              closingSoon ? "timer-closing-pulse" : ""
            }`}
            aria-label={`남은 시간 ${remaining}`}
            data-closing={closingSoon ? "soon" : undefined}
          >
            {remaining}
          </p>
          <h2
            className={`mt-2 font-[family-name:var(--font-syne)] text-[18px] font-bold leading-[1.4] tracking-[-0.01em] sm:text-[19px] ${ink}`}
          >
            {arena.topic}
          </h2>
          <p className={`mt-2 line-clamp-2 text-[12px] leading-[1.55] ${soft}`}>
            {arena.description}
          </p>
        </div>

        <div
          className={`grid grid-cols-2 border-b ${
            light ? "border-black/15" : "border-white/15"
          }`}
          role="tablist"
          aria-label="진영 선택"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selected === "NEXUS"}
            aria-label="도전자"
            onClick={() => scrollToSide("NEXUS")}
            className={`camp-press flex min-h-[56px] flex-col items-center justify-center gap-1 border-r border-white/15 bg-black text-white ${
              selected === "NEXUS" ? "opacity-100" : "opacity-45"
            }`}
          >
            <SpearMark size={22} />
            <span className="text-[11px] font-bold tracking-[0.16em]">
              도전자
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selected === "AEGIS"}
            aria-label="방어자"
            onClick={() => scrollToSide("AEGIS")}
            className={`camp-press flex min-h-[56px] flex-col items-center justify-center gap-1 bg-white text-black ${
              selected === "AEGIS" ? "opacity-100" : "opacity-45"
            }`}
          >
            <ShieldMark size={22} />
            <span className="text-[11px] font-bold tracking-[0.16em]">
              방어자
            </span>
          </button>
        </div>

        <div
          className={`flex items-center justify-between border-b px-3 py-1.5 ${border}`}
        >
          <p className={`text-[10px] tracking-[0.12em] ${faint}`}>
            좌우로 밀면 진영 피드 ·{" "}
            {selected === "NEXUS" ? "도전자" : "방어자"}
          </p>
          <button
            type="button"
            onClick={() => onChangeView("intro")}
            className={`px-2 py-1 text-[12px] ${faint}`}
            aria-label="기본 화면으로"
          >
            전장으로
          </button>
        </div>

        <div
          ref={scrollerRef}
          className="camp-swipe w-full"
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "100%",
            overflowX: "auto",
            overscrollBehaviorX: "contain",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x pan-y",
            height:
              "calc(100dvh - 3.5rem - 5.75rem - 10rem - 84px - 3.5rem - env(safe-area-inset-bottom, 0px))",
            maxHeight: "50dvh",
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
            light={light}
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
            light={light}
          />
        </div>
      </div>
    </section>
  );
}
