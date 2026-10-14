"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { GirdleMark, ShieldMark, SpearMark } from "@/components/SideMarks";
import {
  battleByDate,
  battleMonth,
  getBattleHistory,
} from "@/lib/battle-history";
import {
  dayArchive,
  type ArchiveOpinion,
  type DayArchive,
} from "@/lib/day-archive";
import { kstCalendarDayId } from "@/lib/kst";
import {
  OFFLINE_SIM_EVENT,
  OFFLINE_VERDICT_EVENT,
  isVerdictSaved,
  listSavedVerdicts,
  loadOfflineSim,
  toggleVerdictSaved,
  type SavedVerdict,
} from "@/lib/offline-verdicts";
import { DAILY_TITLE_SHORT } from "@/lib/types/gamification";
import type { BattleDay } from "@/lib/types";

type BattleCalendarProps = {
  open: boolean;
  onClose: () => void;
  onToast?: (message: string) => void;
  /** 핸들·프로필 사진만 */
  onOpenProfile?: (handle: string) => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function startWeekday(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

function OfflineBadge({ light }: { light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center border px-1 py-px text-[9px] font-bold tracking-[0.1em] ${
        light
          ? "border-black/40 text-black"
          : "border-white/50 text-white"
      }`}
      aria-label="오프라인 저장됨"
      data-offline-badge
    >
      저장
    </span>
  );
}

/** 작은 아바타 — 탭 시만 프로필 */
function ProfileAvatar({
  handle,
  light,
  onOpen,
}: {
  handle: string;
  light?: boolean;
  onOpen?: (handle: string) => void;
}) {
  const body = (
    <span
      className={`inline-flex size-7 shrink-0 items-center justify-center border text-[10px] font-bold ${
        light
          ? "border-black/25 text-black"
          : "border-white/30 text-white"
      }`}
      aria-hidden
    >
      {handle.slice(0, 1).toUpperCase()}
    </span>
  );
  if (!onOpen) return body;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen(handle);
      }}
      className="shrink-0"
      aria-label={`@${handle} 프로필 사진`}
      data-profile-avatar
    >
      {body}
    </button>
  );
}

/** 핸들만 프로필 — 부모 행 클릭과 분리 */
function HandleButton({
  handle,
  className = "",
  light,
  onOpen,
}: {
  handle: string;
  className?: string;
  light?: boolean;
  onOpen?: (handle: string) => void;
}) {
  if (!onOpen) {
    return <span className={className}>@{handle}</span>;
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen(handle);
      }}
      className={`${className} underline-offset-2 hover:underline`}
      aria-label={`@${handle} 프로필`}
      data-profile-handle
    >
      @{handle}
    </button>
  );
}

function PanelChrome({
  title,
  onBack,
  backLabel,
  light,
  children,
}: {
  title: string;
  onBack?: () => void;
  backLabel?: string;
  light?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex h-full min-h-0 w-full shrink-0 flex-col ${
        light ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <div
        className={`flex shrink-0 items-center gap-2 border-b px-3 py-3 ${
          light ? "border-black/15" : "border-white/15"
        }`}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className={`px-2 py-1 text-[13px] ${
              light ? "text-neutral-500" : "text-muted"
            }`}
            aria-label={backLabel ?? "뒤로"}
          >
            ← {backLabel ?? "뒤로"}
          </button>
        ) : (
          <span className="w-14" aria-hidden />
        )}
        <p
          className={`mx-auto pr-10 text-[11px] font-bold tracking-[0.14em] ${
            light ? "text-black/60" : "text-white/70"
          }`}
        >
          {title}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

/** 챔피언 스레드 — 댓글 전부 · 좌슬라이드로 진입 */
function ChampionThread({
  opinion,
  topic,
  round,
  onBack,
  onOpenProfile,
  onToast,
}: {
  opinion: ArchiveOpinion;
  topic: string;
  round: number;
  onBack: () => void;
  onOpenProfile?: (handle: string) => void;
  onToast?: (message: string) => void;
}) {
  const dark = opinion.side === "NEXUS";
  return (
    <PanelChrome
      title="기록"
      onBack={onBack}
      backLabel="하루"
      light={!dark}
    >
      <div
        className="px-4 py-4"
        data-champion-thread
        data-champion-side={opinion.side}
      >
        <p
          className={`text-[10px] tracking-[0.14em] ${
            dark ? "text-muted" : "text-neutral-500"
          }`}
        >
          제 {round}회 · {topic}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ProfileAvatar
            handle={opinion.author}
            light={!dark}
            onOpen={onOpenProfile}
          />
          {opinion.side === "NEXUS" ? (
            <SpearMark size={16} />
          ) : (
            <ShieldMark size={16} />
          )}
          <HandleButton
            handle={opinion.author}
            light={!dark}
            onOpen={onOpenProfile}
            className="text-[14px] font-semibold"
          />
          {opinion.adoptedLabel ? (
            <span
              className={`border px-1.5 py-0.5 text-[10px] font-bold tracking-[0.1em] ${
                dark
                  ? "border-white bg-white text-black"
                  : "border-black bg-black text-white"
              }`}
            >
              {opinion.adoptedLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-4 text-[15px] leading-[1.65]">“{opinion.body}”</p>
        <p
          className={`mt-3 text-[12px] tabular-nums ${
            dark ? "text-white/55" : "text-black/50"
          }`}
        >
          지지 {opinion.supports.toLocaleString("ko-KR")} · 좋아요{" "}
          {opinion.likes.toLocaleString("ko-KR")}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onToast?.("기록에서 스크랩했습니다 (본인만)")}
            className={`flex-1 border py-2 text-[11px] font-bold tracking-[0.1em] ${
              dark
                ? "border-white/40 text-white"
                : "border-black/30 text-black"
            }`}
          >
            스크랩
          </button>
          <button
            type="button"
            onClick={() => onToast?.("챔피언 기록 카드를 준비했습니다")}
            className={`flex-1 border py-2 text-[11px] font-bold tracking-[0.1em] ${
              dark
                ? "border-white bg-white text-black"
                : "border-black bg-black text-white"
            }`}
          >
            공유
          </button>
        </div>

        <div
          className={`mt-6 border-t pt-4 ${
            dark ? "border-white/15" : "border-black/12"
          }`}
        >
          <p
            className={`text-[10px] font-bold tracking-[0.16em] ${
              dark ? "text-muted" : "text-neutral-500"
            }`}
          >
            그날 댓글 · {opinion.comments.length}
          </p>
          <ul className="mt-3" aria-label="그날 댓글 전체">
            {opinion.comments.map((c) => (
              <li
                key={c.id}
                className={`border-b py-3 ${
                  dark ? "border-white/10" : "border-black/10"
                }`}
                data-archive-comment={c.id}
              >
                <div className="flex items-center gap-2">
                  <ProfileAvatar
                    handle={c.author}
                    light={!dark}
                    onOpen={onOpenProfile}
                  />
                  <HandleButton
                    handle={c.author}
                    light={!dark}
                    onOpen={onOpenProfile}
                    className="text-[13px] font-semibold"
                  />
                  <span
                    className={`text-[11px] tabular-nums ${
                      dark ? "text-white/40" : "text-black/40"
                    }`}
                  >
                    {c.timeLabel}
                  </span>
                  <span
                    className={`ml-auto text-[11px] tabular-nums ${
                      dark ? "text-white/45" : "text-black/45"
                    }`}
                  >
                    ♥ {c.likes}
                  </span>
                </div>
                <p className="mt-1.5 pl-9 text-[13px] leading-[1.5]">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PanelChrome>
  );
}

/** 하루 콜로세움 — 탐험 지도 */
function DayChronicle({
  battle,
  archive,
  saved,
  offlineSim,
  onBack,
  onToggleSave,
  onOpenChampion,
  onOpenProfile,
}: {
  battle: BattleDay;
  archive: DayArchive;
  saved: boolean;
  offlineSim: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onOpenChampion: (kind: "champion" | "rival") => void;
  onOpenProfile?: (handle: string) => void;
}) {
  const joint = battle.winner === "JOINT";
  const challengerWin = battle.winner === "NEXUS";
  const dateLabel = battle.date.split("-").join(".");
  const [proposerOpen, setProposerOpen] = useState(false);

  return (
    <PanelChrome title={dateLabel} onBack={onBack} backLabel="달력">
      <div className="px-4 py-4" data-day-chronicle={battle.date}>
        <p
          className="mb-3 text-center text-[11px] tracking-[0.12em] text-white/55"
          data-colosseum-gate
        >
          제 {battle.round}회
        </p>

        {offlineSim ? (
          <p
            className="mb-3 border border-white/20 px-2 py-1 text-[10px] tracking-[0.08em] text-neutral-200"
            data-offline-sim-banner
          >
            오프라인 · 저장분
          </p>
        ) : null}

        <h3 className="font-[family-name:var(--font-syne)] text-[18px] font-bold leading-snug">
          {battle.topic}
        </h3>

        <div
          className={`mt-5 border px-3 py-3 ${
            joint
              ? "border-white/30 bg-[linear-gradient(90deg,#000_50%,#fff_50%)] text-white"
              : challengerWin
                ? "border-white/25 bg-black"
                : "border-black/10 bg-white text-black"
          }`}
        >
          <p
            className={`text-[10px] font-bold tracking-[0.16em] ${
              joint
                ? "text-white/70"
                : challengerWin
                  ? "text-muted"
                  : "text-neutral-500"
            }`}
          >
            {joint ? "공동 승리" : "판결"}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {joint ? (
              <>
                <SpearMark size={18} className="winner-crimson" />
                <ShieldMark size={18} className="winner-crimson" />
              </>
            ) : challengerWin ? (
              <SpearMark size={18} className="winner-crimson" />
            ) : (
              <ShieldMark size={18} className="winner-crimson" />
            )}
            <span
              className={`text-[15px] font-bold tracking-[0.12em] ${
                joint ? "mix-blend-difference text-white" : ""
              }`}
            >
              {joint ? "도전자 · 방어자" : challengerWin ? "도전자" : "방어자"}
            </span>
            <span className="ml-auto text-[18px] font-bold tabular-nums text-crimson">
              {joint ? "50%" : `${battle.winnerPercent}%`}
            </span>
          </div>
        </div>

        {/* 제안자 — 맥락 토글 vs 핸들 프로필 분리 */}
        {battle.proposerHandle ? (
          <div className="mt-5 border-t border-white/12 pt-4">
            <p className="text-[10px] font-bold tracking-[0.16em] text-muted">
              제안자
            </p>
            <div className="mt-2 flex items-center gap-2">
              <ProfileAvatar
                handle={battle.proposerHandle}
                onOpen={onOpenProfile}
              />
              {battle.hasGirdle !== false ? (
                <GirdleMark size={14} className="text-white" />
              ) : null}
              <HandleButton
                handle={battle.proposerHandle}
                onOpen={onOpenProfile}
                className="text-[13px] font-semibold"
              />
              <span className="text-[11px] tracking-[0.08em] text-muted">
                {DAILY_TITLE_SHORT.PROPOSER}
              </span>
              <button
                type="button"
                onClick={() => setProposerOpen((v) => !v)}
                className="ml-auto text-[11px] text-muted underline-offset-2 hover:underline"
                aria-expanded={proposerOpen}
                data-proposer-toggle
              >
                {proposerOpen ? "접기" : "맥락"}
              </button>
            </div>
            {proposerOpen ? (
              <p className="mt-2 text-[13px] leading-[1.5] text-white/75">
                {archive.proposerNote}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* 양 진영 — 보드 칸 */}
        <div className="camp-pair mt-5 grid grid-cols-2 gap-0 border border-white/15">
          <div className="border-r border-white/15 bg-black px-3 py-3">
            <div className="flex items-center gap-1.5">
              <SpearMark size={14} />
              <p className="text-[10px] font-bold tracking-[0.12em] text-muted">
                도전자
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <ProfileAvatar
                handle={archive.challenger.author}
                onOpen={onOpenProfile}
              />
              <HandleButton
                handle={archive.challenger.author}
                onOpen={onOpenProfile}
                className="text-[13px] font-semibold"
              />
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-white/55">
              {archive.challenger.mood}
            </p>
          </div>
          <div className="bg-white px-3 py-3 text-black">
            <div className="flex items-center gap-1.5">
              <ShieldMark size={14} />
              <p className="text-[10px] font-bold tracking-[0.12em] text-neutral-500">
                방어자
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <ProfileAvatar
                handle={archive.defender.author}
                light
                onOpen={onOpenProfile}
              />
              <HandleButton
                handle={archive.defender.author}
                light
                onOpen={onOpenProfile}
                className="text-[13px] font-semibold"
              />
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-black/55">
              {archive.defender.mood}
            </p>
          </div>
        </div>

        {/* 챔피언 카드 — 탭 = 슬라이드(기록), 핸들 = 프로필 */}
        <div className="mt-5 border-t border-white/12 pt-4">
          <p className="text-[10px] font-bold tracking-[0.16em] text-muted">
            챔피언
          </p>
          <div className="r-md mt-2 border border-white/20">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <ProfileAvatar
                handle={archive.champion.author}
                onOpen={onOpenProfile}
              />
              {archive.champion.side === "NEXUS" ? (
                <SpearMark size={14} />
              ) : (
                <ShieldMark size={14} />
              )}
              <HandleButton
                handle={archive.champion.author}
                onOpen={onOpenProfile}
                className="text-[13px] font-semibold"
              />
              {archive.champion.adoptedLabel ? (
                <span className="border border-white/40 px-1 py-px text-[10px] font-bold tracking-[0.1em]">
                  {archive.champion.adoptedLabel}
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onOpenChampion("champion")}
              className="w-full px-3 py-3 text-left active:bg-white/[0.04]"
              data-open-champion
              aria-label="챔피언 글·댓글 펼치기"
            >
              <p className="line-clamp-3 text-[14px] leading-[1.5] text-white/90">
                “{archive.champion.body}”
              </p>
              <p className="mt-2 text-[11px] tabular-nums text-muted">
                지지 {archive.champion.supports.toLocaleString("ko-KR")} · 댓글{" "}
                {archive.champion.comments.length}
              </p>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-bold tracking-[0.16em] text-muted">
            상대
          </p>
          <div className="r-md mt-2 border border-white/12">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <ProfileAvatar
                handle={archive.rival.author}
                onOpen={onOpenProfile}
              />
              {archive.rival.side === "NEXUS" ? (
                <SpearMark size={14} />
              ) : (
                <ShieldMark size={14} />
              )}
              <HandleButton
                handle={archive.rival.author}
                onOpen={onOpenProfile}
                className="text-[13px] font-semibold"
              />
              <span className="ml-auto text-[12px] tabular-nums text-muted">
                {battle.loserPercent}%
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenChampion("rival")}
              className="w-full px-3 py-3 text-left active:bg-white/[0.04]"
              data-open-rival
              aria-label="상대 글·댓글 펼치기"
            >
              <p className="line-clamp-2 text-[13px] leading-[1.45] text-white/75">
                “{archive.rival.body}”
              </p>
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-white/12 pt-4" data-offline-save>
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 text-[13px] text-white">오프라인</p>
            <button
              type="button"
              role="switch"
              aria-checked={saved}
              aria-label="오프라인 저장"
              onClick={onToggleSave}
              className={`relative h-7 w-12 shrink-0 border transition-colors ${
                saved
                  ? "border-white bg-white"
                  : "border-neutral-600 bg-neutral-900"
              }`}
              data-offline-save-toggle
            >
              <span
                className={`absolute top-0.5 size-5 border border-neutral-800 bg-black transition-[left] ${
                  saved ? "left-[1.35rem]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </PanelChrome>
  );
}

/** 전투 기록 달력 = 카드북 · 좌좌좌 슬라이드 */
export function BattleCalendar({
  open,
  onClose,
  onToast,
  onOpenProfile,
}: BattleCalendarProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [thread, setThread] = useState<"champion" | "rival" | null>(null);
  const [savedDates, setSavedDates] = useState<Set<string>>(new Set());
  const [archiveList, setArchiveList] = useState<SavedVerdict[]>([]);
  const [offlineSim, setOfflineSim] = useState(false);
  const [view, setView] = useState<"calendar" | "archive">("calendar");
  const [now] = useState(() => new Date());

  const history = useMemo(() => getBattleHistory(now), [now]);
  const { year, month } = useMemo(() => battleMonth(now), [now]);
  const todayKst = useMemo(() => kstCalendarDayId(now), [now]);

  /** 0=달력 1=하루 2=챔피언 */
  const slide =
    selected && thread ? 2 : selected ? 1 : 0;

  const syncSaved = () => {
    const list = listSavedVerdicts();
    setArchiveList(list);
    setSavedDates(new Set(list.map((v) => v.date)));
    setOfflineSim(loadOfflineSim());
  };

  useEffect(() => {
    if (open) {
      setSelected(null);
      setThread(null);
      setView("calendar");
      syncSaved();
    }
  }, [open]);

  useEffect(() => {
    const onChange = () => syncSaved();
    window.addEventListener(OFFLINE_VERDICT_EVENT, onChange);
    window.addEventListener(OFFLINE_SIM_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(OFFLINE_VERDICT_EVENT, onChange);
      window.removeEventListener(OFFLINE_SIM_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const byDate = useMemo(() => {
    const map = new Map<string, BattleDay>();
    for (const b of history) map.set(b.date, b);
    return map;
  }, [history]);

  const totalDays = daysInMonth(year, month);
  const pad = startWeekday(year, month);
  const cells: (number | null)[] = [
    ...Array.from({ length: pad }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  if (!open) return null;

  const selectedBattle = selected
    ? battleByDate(selected, now) ??
      archiveList.find((a) => a.date === selected) ??
      null
    : null;

  const selectedArchive =
    selected && selectedBattle ? dayArchive(selected, now) : null;

  const openDay = (date: string) => {
    const online = battleByDate(date, now);
    const saved = isVerdictSaved(date);
    if (offlineSim && !saved) {
      onToast?.("오프라인 · 저장된 판결만 읽을 수 있습니다");
      return;
    }
    if (!online && !saved) {
      onToast?.("아직 기록이 없는 날입니다");
      return;
    }
    setThread(null);
    setSelected(date);
  };

  const goProfile = (handle: string) => {
    onClose();
    onOpenProfile?.(handle);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 sm:items-center"
      role="dialog"
      aria-modal
      aria-label="전투 기록"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="sheet-up r-sheet relative z-10 flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden border border-white/15 bg-ink text-paper sm:max-h-[85dvh]">
        <div className="flex shrink-0 items-center justify-between border-b border-white/15 px-4 py-3">
          <p className="text-[12px] font-bold tracking-[0.18em]">전투 기록</p>
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] text-muted"
            aria-label="닫기"
          >
            닫기
          </button>
        </div>

        {/* 좌←좌←좌 슬라이드 스택 */}
        <div
          className="relative min-h-0 flex-1 overflow-hidden"
          data-calendar-slider
          data-slide={slide}
        >
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              width: "300%",
              transform: `translateX(-${(slide * 100) / 3}%)`,
            }}
          >
            {/* 0 · 달력 보드 */}
            <div className="flex h-full w-1/3 shrink-0 flex-col">
              <div
                className="flex shrink-0 border-b border-white/10"
                role="tablist"
                aria-label="달력과 보관함"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === "calendar"}
                  onClick={() => setView("calendar")}
                  className={`flex-1 py-2.5 text-[12px] font-bold tracking-[0.12em] ${
                    view === "calendar"
                      ? "bg-white text-black"
                      : "text-muted"
                  }`}
                >
                  달력
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === "archive"}
                  onClick={() => setView("archive")}
                  className={`flex-1 py-2.5 text-[12px] font-bold tracking-[0.12em] ${
                    view === "archive"
                      ? "bg-white text-black"
                      : "text-muted"
                  }`}
                >
                  보관함
                </button>
              </div>

              {view === "calendar" ? (
                <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6 pt-3">
                  <p className="px-1 text-center text-[13px] font-semibold tracking-[0.06em]">
                    {year}년 {month}월
                  </p>
                  <div className="mt-3 grid grid-cols-7 gap-px text-center text-[10px] text-muted">
                    {WEEKDAYS.map((w) => (
                      <div key={w} className="py-1">
                        {w}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-px">
                    {cells.map((day, i) => {
                      if (day == null) {
                        return (
                          <div key={`e-${i}`} className="aspect-square" />
                        );
                      }
                      const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const battle = byDate.get(key);
                      const saved = savedDates.has(key);
                      const isToday = key === todayKst;
                      const isFuture = key > todayKst;
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={!battle && !saved}
                          onClick={() => (battle || saved) && openDay(key)}
                          className={`relative flex aspect-square flex-col items-center justify-center text-[12px] tabular-nums ${
                            isToday ? "ring-1 ring-inset ring-timer" : ""
                          } ${
                            battle
                              ? battle.winner === "NEXUS"
                                ? "bg-black text-white"
                                : battle.winner === "AEGIS"
                                  ? "bg-white text-black"
                                  : "bg-[linear-gradient(135deg,#000_50%,#fff_50%)] text-white"
                              : isFuture
                                ? "text-white/20"
                                : "text-white/35"
                          } disabled:cursor-default`}
                          aria-label={
                            battle
                              ? `${key} 제 ${battle.round}회`
                              : `${key}${isFuture ? " · 미래" : ""}`
                          }
                          data-cal-day={key}
                        >
                          <span
                            className={
                              battle?.winner === "JOINT"
                                ? "mix-blend-difference"
                                : ""
                            }
                          >
                            {day}
                          </span>
                          {battle && battle.winner !== "JOINT" ? (
                            <span
                              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 winner-crimson"
                              aria-hidden
                              data-winner-mark={battle.winner}
                            >
                              {battle.winner === "NEXUS" ? (
                                <SpearMark size={8} />
                              ) : (
                                <ShieldMark size={8} />
                              )}
                            </span>
                          ) : null}
                          {saved ? (
                            <span className="absolute bottom-0.5 right-0.5">
                              <OfflineBadge
                                light={battle?.winner === "AEGIS"}
                              />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                  <ul className="mt-4 space-y-0 border-t border-white/10 pt-2">
                    {history
                      .slice()
                      .reverse()
                      .slice(0, 5)
                      .map((b) => (
                        <li key={b.date} className="border-b border-white/10">
                          <button
                            type="button"
                            onClick={() => openDay(b.date)}
                            className="flex w-full items-baseline gap-2 px-1 py-2.5 text-left text-[12px] active:bg-white/[0.04]"
                          >
                            <span className="tabular-nums text-muted">
                              {b.date.slice(5)}
                            </span>
                            <span className="min-w-0 flex-1 truncate">
                              {b.topic}
                            </span>
                            <span className="shrink-0 text-muted">
                              #{b.round}
                            </span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                  {archiveList.length === 0 ? (
                    <p className="py-10 text-center text-[13px] text-muted">
                      저장한 판결이 없습니다.
                    </p>
                  ) : (
                    <ul>
                      {archiveList.map((v) => (
                        <li key={v.date} className="border-b border-white/10">
                          <button
                            type="button"
                            onClick={() => openDay(v.date)}
                            className="w-full px-1 py-3 text-left"
                          >
                            <p className="text-[12px] tabular-nums text-muted">
                              {v.date}
                            </p>
                            <p className="mt-1 text-[14px] font-semibold">
                              {v.topic}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* 1 · 하루 연대기 */}
            <div className="h-full w-1/3 shrink-0">
              {selectedBattle && selectedArchive ? (
                <DayChronicle
                  battle={selectedBattle}
                  archive={selectedArchive}
                  saved={savedDates.has(selectedBattle.date)}
                  offlineSim={offlineSim}
                  onBack={() => {
                    setSelected(null);
                    setThread(null);
                  }}
                  onToggleSave={() => {
                    const r = toggleVerdictSaved(selectedBattle);
                    onToast?.(
                      r
                        ? "판결을 오프라인 저장했습니다"
                        : "오프라인 저장을 해제했습니다",
                    );
                    syncSaved();
                  }}
                  onOpenChampion={setThread}
                  onOpenProfile={onOpenProfile ? goProfile : undefined}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[13px] text-muted">
                  날짜를 열어 주세요
                </div>
              )}
            </div>

            {/* 2 · 챔피언 스레드 */}
            <div className="h-full w-1/3 shrink-0">
              {selectedBattle && selectedArchive && thread ? (
                <ChampionThread
                  opinion={
                    thread === "champion"
                      ? selectedArchive.champion
                      : selectedArchive.rival
                  }
                  topic={selectedBattle.topic}
                  round={selectedBattle.round}
                  onBack={() => setThread(null)}
                  onOpenProfile={onOpenProfile ? goProfile : undefined}
                  onToast={onToast}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[13px] text-muted">
                  챔피언 글을 열어 주세요
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
