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
import {
  GirdleMark,
  ShieldMark,
  SideBadge,
  SpearMark,
} from "@/components/SideMarks";
import { useDomaStore } from "@/lib/store";
import { DAILY_TITLE_SHORT } from "@/lib/types/gamification";
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
  /** 셸 톤 = 지금 보고 있는 진영 (도전=블랙 · 방어=화이트) */
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
        parentKind="opinion"
        targetId={op.id}
        likes={op.likes}
        replies={op.replies ?? 0}
        likedByMe={op.likedByMe}
        previewText={op.text}
        authorHandle={op.author}
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
        scrollSnapAlign: "start",
        scrollSnapStop: "normal",
        overflowY: "auto",
        overscrollBehaviorY: "contain",
        minWidth: 0,
      }}
      data-camp-page={side}
      aria-label={`${label} 의견 영역`}
    >
      <div
        className={`flex items-center justify-center gap-2 border-b px-4 py-2.5 ${border}`}
      >
        <Mark size={16} className={ink} />
        <p className={`text-[10px] font-bold tracking-[0.16em] ${muted}`}>
          TOP 의견 · {label}
        </p>
      </div>

      <div className="px-4 py-3 text-center">
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
            <div className="mb-1.5 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <SmallAvatar name={top.author} light={light} />
                <span className={`text-[13px] font-semibold ${ink}`}>
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
            </div>
            <p
              className={`mx-auto line-clamp-3 max-w-[36em] font-[family-name:var(--font-syne)] text-[14px] leading-[1.45] ${ink}`}
            >
              “{top.text}”
            </p>
            <div className="mt-2 flex justify-center">
              <OpinionSocial
                parentKind="opinion"
                targetId={top.id}
                likes={top.likes}
                replies={top.replies ?? 0}
                likedByMe={top.likedByMe}
                previewText={top.text}
                authorHandle={top.author}
                light={light}
                indent={false}
              />
            </div>
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
        className={`battlefield-rise border-b px-5 pb-4 pt-5 text-center ${border}`}
      >
        <p className={`text-[11px] font-medium tracking-[0.22em] ${faint}`}>
          제 {arena.round}회 전투
        </p>
        <p className={`mt-3 text-[11px] tracking-[0.18em] ${soft}`}>
          {closingSoon ? "판결 임박" : "최후의 판결까지"}
        </p>
        <p
          className={`mt-2 font-mono text-[32px] font-semibold leading-none tracking-[0.06em] text-timer tabular-nums sm:text-[36px] ${
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
      </div>

      {/* 오늘의 전장 — 여유 패딩·타이포로 주제가 숨 쉬게 */}
      <div
        className="battlefield-rise battlefield-rise-delay px-6 pb-10 pt-10 text-center sm:px-8 sm:pb-12 sm:pt-12"
        aria-label="오늘 주제 영역"
      >
        <p
          className={`text-[12px] font-bold tracking-[0.22em] ${
            light ? "text-black/50" : "text-white/50"
          }`}
        >
          오늘의 전장
        </p>
        <h2
          className={`mx-auto mt-5 max-w-[18em] font-[family-name:var(--font-display)] text-[26px] font-bold leading-[1.4] tracking-[-0.01em] sm:mt-6 sm:text-[30px] sm:leading-[1.38] ${ink}`}
        >
          {arena.topic}
        </h2>
        {arena.proposerHandle ? (
          <p
            className={`mx-auto mt-5 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium tracking-[0.08em] sm:mt-6 ${
              light ? "text-black/55" : "text-white/55"
            }`}
            aria-label={`제안자 ${arena.proposerHandle}`}
          >
            <GirdleMark size={13} className="opacity-90" />
            <span className={ink}>@{arena.proposerHandle}</span>
            <span aria-hidden>·</span>
            <span>{DAILY_TITLE_SHORT.PROPOSER}</span>
          </p>
        ) : null}
        <p
          className={`mx-auto mt-6 max-w-[28em] text-[15px] leading-[1.85] sm:mt-7 sm:text-[16px] sm:leading-[1.8] ${
            light ? "text-black/68" : "text-white/68"
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
          className="camp-press flex min-h-[88px] flex-col items-center justify-center gap-1.5 border-r border-white/15 bg-black px-3 py-4 text-white active:bg-white/[0.04]"
        >
          <SpearMark size={24} />
          <span className="text-[13px] font-bold tracking-[0.16em]">도전자</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={false}
          aria-label="방어자"
          onClick={() => onPickSide("AEGIS")}
          className="camp-press flex min-h-[88px] flex-col items-center justify-center gap-1.5 bg-white px-3 py-4 text-black active:bg-neutral-100"
        >
          <ShieldMark size={24} />
          <span className="text-[13px] font-bold tracking-[0.16em]">방어자</span>
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
          <div className="px-5 py-6 text-center">
            <p
              className={`text-[10px] font-bold tracking-[0.2em] ${faint}`}
            >
              TOP 의견 ·{" "}
              {champion.side === "NEXUS" ? "도전자" : "방어자"}
            </p>
            <div className={`mt-3 border-t pt-4 ${border}`}>
              <div className="flex flex-col items-center gap-2">
                <SmallAvatar name={champion.author} light={light} />
                <div className="flex items-center justify-center gap-1.5">
                  <span className={`text-[14px] font-semibold ${ink}`}>
                    @{champion.author}
                  </span>
                  <SideBadge side={champion.side} />
                  {champion.side === "NEXUS" ? (
                    <SpearMark
                      size={12}
                      className={light ? "text-black/50" : "text-white/50"}
                    />
                  ) : (
                    <ShieldMark
                      size={12}
                      className={light ? "text-black/50" : "text-white/50"}
                    />
                  )}
                </div>
              </div>
              <p
                className={`mx-auto mt-2.5 max-w-[36em] line-clamp-3 text-[13px] leading-[1.5] ${
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
 * - 셸 톤 = 보고 있는 진영 (도전=블랙 · 방어=화이트)
 * - intro: 주제·진영·TOP (중앙)
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
  /** 버튼·포커스 등 프로그래매틱 스크롤 중 — 스크롤→view 반영 무시 */
  const programmaticScroll = useRef(false);
  /** view 변경이 스크롤에서 왔으면 강제 snap 금지 (瞬跳 방지) */
  const viewFromScroll = useRef(false);
  const light = shellLight;

  const selected: Side | null =
    view === "NEXUS" || view === "AEGIS" ? view : null;

  const sideFromScroll = (el: HTMLDivElement): Side => {
    const w = Math.max(1, el.clientWidth);
    return el.scrollLeft / w >= 0.5 ? "AEGIS" : "NEXUS";
  };

  const scrollToSide = useCallback(
    (side: Side, behavior: ScrollBehavior = "smooth") => {
      const el = scrollerRef.current;
      viewFromScroll.current = false;
      if (!el) {
        onChangeView(side);
        return;
      }
      const page = side === "AEGIS" ? 1 : 0;
      programmaticScroll.current = true;
      el.scrollTo({ left: page * el.clientWidth, behavior });
      onChangeView(side);
      window.setTimeout(
        () => {
          programmaticScroll.current = false;
        },
        behavior === "smooth" ? 420 : 80,
      );
    },
    [onChangeView],
  );

  /** 탭/외부에서 view만 바뀐 경우 위치 맞춤 — 스와이프 도중엔 건드리지 않음 */
  useEffect(() => {
    if (view !== "NEXUS" && view !== "AEGIS") return;
    if (viewFromScroll.current) {
      viewFromScroll.current = false;
      return;
    }
    const el = scrollerRef.current;
    if (!el) return;
    const page = view === "AEGIS" ? 1 : 0;
    const target = page * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) < 12) return;
    programmaticScroll.current = true;
    el.scrollTo({ left: target, behavior: "smooth" });
    window.setTimeout(() => {
      programmaticScroll.current = false;
    }, 420);
  }, [view]);

  useEffect(() => {
    if (!focusOpinionId) return;
    const side = opinions.find((o) => o.id === focusOpinionId)?.side;
    if (!side) return;
    if (view === "intro") onChangeView(side);
    else scrollToSide(side, "smooth");
    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(`[data-opinion-id="${focusOpinionId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [focusOpinionId, opinions, view, onChangeView, scrollToSide]);

  const commitSideFromScroll = useCallback(
    (el: HTMLDivElement) => {
      if (programmaticScroll.current) return;
      const side = sideFromScroll(el);
      if (side === selected) return;
      viewFromScroll.current = true;
      onChangeView(side);
    },
    [onChangeView, selected],
  );

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    if (programmaticScroll.current) return;
    const el = e.currentTarget;
    const w = Math.max(1, el.clientWidth);
    const progress = el.scrollLeft / w;
    /** 중간 구간에서는 셸을 바꾸지 않아 깜빡임·강제 snap을 줄임 */
    if (progress > 0.38 && progress < 0.62) return;
    commitSideFromScroll(el);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !selected) return;
    const onScrollEnd = () => commitSideFromScroll(el);
    el.addEventListener("scrollend", onScrollEnd);
    return () => el.removeEventListener("scrollend", onScrollEnd);
  }, [selected, commitSideFromScroll]);

  const ink = light ? "text-black" : "text-white";
  const soft = light ? "text-black/55" : "text-white/55";
  const faint = light ? "text-neutral-500" : "text-white/45";
  const border = light ? "border-black/12" : "border-white/12";
  const shellBg = light ? "bg-white text-black" : "bg-black text-white";

  if (!selected) {
    return (
      <section
        aria-label="아레나 기본창"
        className={`shell-tone ${shellBg}`}
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
      className={`shell-tone ${shellBg}`}
      data-shell={light ? "light" : "dark"}
      data-top-side={champion?.side ?? "none"}
    >
      <div className="mx-auto max-w-[560px]">
        <div
          className={`shell-tone sticky top-[5.75rem] z-30 border-b px-5 pb-3 pt-3 text-center backdrop-blur-md ${border} ${
            light ? "bg-white/96" : "bg-black/96"
          }`}
          aria-label="오늘 주제 영역"
        >
          <p className={`text-[11px] font-medium tracking-[0.2em] ${faint}`}>
            제 {arena.round}회 전투
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
          <p
            className={`mx-auto mt-2 max-w-[36em] line-clamp-2 text-[12px] leading-[1.55] ${soft}`}
          >
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
            scrollBehavior: "auto",
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
