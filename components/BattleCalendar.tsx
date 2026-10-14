"use client";

import { useEffect, useMemo, useState } from "react";
import { GirdleMark, ShieldMark, SpearMark } from "@/components/SideMarks";
import {
  BATTLE_HISTORY,
  BATTLE_MONTH,
  BATTLE_YEAR,
  battleByDate,
} from "@/lib/battle-history";
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

function DayDetail({
  battle,
  saved,
  offlineSim,
  onBack,
  onToggleSave,
}: {
  battle: BattleDay;
  saved: boolean;
  offlineSim: boolean;
  onBack: () => void;
  onToggleSave: () => void;
}) {
  const joint = battle.winner === "JOINT";
  const challengerWin = battle.winner === "NEXUS";
  const dateLabel = battle.date.split("-").join(".");

  return (
    <div className="flex flex-col bg-black text-white" aria-label="전투 상세">
      <div className="flex items-center gap-2 border-b border-white/15 px-3 py-3">
        <button
          type="button"
          onClick={onBack}
          className="px-2 py-1 text-[13px] text-muted"
          aria-label="달력으로"
        >
          ← 달력
        </button>
        <p className="mx-auto pr-10 text-[12px] font-bold tracking-[0.16em]">
          {dateLabel}
        </p>
      </div>

      <div className="px-4 py-4">
        {offlineSim ? (
          <p
            className="mb-3 border border-white/20 px-2 py-1.5 text-[11px] tracking-[0.08em] text-neutral-200"
            data-offline-sim-banner
          >
            오프라인 시뮬레이션 · 저장된 판결
          </p>
        ) : null}

        <p className="text-[11px] tracking-[0.16em] text-muted">
          제 {battle.round}회 전투
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-syne)] text-[18px] font-bold leading-snug">
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
            {joint ? "공동 승리" : "승리자"}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {joint ? (
              <>
                <SpearMark size={18} />
                <ShieldMark size={18} className="text-black" />
              </>
            ) : challengerWin ? (
              <SpearMark size={18} />
            ) : (
              <ShieldMark size={18} />
            )}
            <span
              className={`text-[15px] font-bold tracking-[0.12em] ${
                joint ? "mix-blend-difference text-white" : ""
              }`}
            >
              {joint ? "도전자 · 방어자" : challengerWin ? "도전자" : "방어자"}
            </span>
            <span
              className={`ml-auto text-[18px] font-bold tabular-nums ${
                joint
                  ? "mix-blend-difference text-white"
                  : challengerWin
                    ? "text-white"
                    : "text-black"
              }`}
            >
              {joint ? "50%" : `${battle.winnerPercent}%`}
            </span>
          </div>
          <p
            className={`mt-1 text-[11px] ${
              joint
                ? "text-white/70 mix-blend-difference"
                : challengerWin
                  ? "text-muted"
                  : "text-neutral-500"
            }`}
          >
            {joint
              ? "지지·좋아요 동점 · 창+방패"
              : `상대 ${100 - battle.winnerPercent}% · @${battle.opponentAuthor}`}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-bold tracking-[0.16em] text-muted">
            승리 의견
          </p>
          <p className="mt-2 font-[family-name:var(--font-syne)] text-[15px] leading-[1.5]">
            “{battle.winnerOpinion}”
          </p>
          <p className="mt-1.5 text-[12px] text-muted">@{battle.winnerAuthor}</p>
        </div>

        {battle.proposerHandle ? (
          <div className="mt-6 border-t border-white/12 pt-4">
            <p className="text-[10px] font-bold tracking-[0.16em] text-muted">
              그날의 제안자
            </p>
            <div className="mt-2 flex items-center gap-2">
              {battle.hasGirdle !== false ? (
                <GirdleMark size={14} className="text-white" />
              ) : null}
              <span className="text-[13px] font-semibold">
                @{battle.proposerHandle}
              </span>
              <span className="text-[11px] tracking-[0.08em] text-muted">
                {DAILY_TITLE_SHORT.PROPOSER} · 허리띠
              </span>
            </div>
          </div>
        ) : null}

        <div className="mt-6 border-t border-white/12 pt-4">
          <p className="text-[10px] font-bold tracking-[0.16em] text-muted">
            맞붙었던 상대
          </p>
          <div className="mt-2 flex items-center gap-2">
            {challengerWin ? <ShieldMark size={16} /> : <SpearMark size={16} />}
            <span className="text-[13px] font-semibold">
              @{battle.opponentAuthor}
            </span>
            <span className="ml-auto text-[13px] tabular-nums text-muted">
              {battle.loserPercent}%
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-[1.45] text-white/80">
            “{battle.opponentOpinion}”
          </p>
        </div>

        {/* 유튜브 오프라인식 — 판결 텍스트·결과 로컬 저장 */}
        <div
          className="mt-8 border-t border-white/12 pt-4"
          data-offline-save
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] text-white">오프라인 저장</p>
              <p className="mt-0.5 text-[12px] text-neutral-200">
                기기에 판결 텍스트·결과를 보관합니다
              </p>
            </div>
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
          {saved ? (
            <p className="mt-2 text-[11px] text-neutral-200">
              보관함에 있음 · 달력에 저장 배지
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** 전투 기록 달력 — 과거 흑/백 전적 + 오프라인 보관 */
export function BattleCalendar({
  open,
  onClose,
  onToast,
}: BattleCalendarProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [savedDates, setSavedDates] = useState<Set<string>>(new Set());
  const [archive, setArchive] = useState<SavedVerdict[]>([]);
  const [offlineSim, setOfflineSim] = useState(false);
  const [view, setView] = useState<"calendar" | "archive">("calendar");

  const syncSaved = () => {
    const list = listSavedVerdicts();
    setArchive(list);
    setSavedDates(new Set(list.map((v) => v.date)));
    setOfflineSim(loadOfflineSim());
  };

  useEffect(() => {
    if (open) {
      setSelected(null);
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
    for (const b of BATTLE_HISTORY) map.set(b.date, b);
    return map;
  }, []);

  const totalDays = daysInMonth(BATTLE_YEAR, BATTLE_MONTH);
  const pad = startWeekday(BATTLE_YEAR, BATTLE_MONTH);
  const cells: (number | null)[] = [
    ...Array.from({ length: pad }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  if (!open) return null;

  const selectedBattle = selected
    ? battleByDate(selected) ??
      archive.find((a) => a.date === selected) ??
      null
    : null;

  const openDay = (date: string) => {
    const online = battleByDate(date);
    const saved = isVerdictSaved(date);
    if (offlineSim && !saved) {
      onToast?.("오프라인 · 저장된 판결만 읽을 수 있습니다");
      return;
    }
    if (!online && !saved) {
      onToast?.("판결을 찾을 수 없습니다");
      return;
    }
    setSelected(date);
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
      <div className="sheet-up relative z-10 flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden border border-white/15 bg-black text-white sm:max-h-[85dvh]">
        <div className="flex items-center justify-between border-b border-white/15 px-4 py-3">
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

        {!selectedBattle ? (
          <div
            className="flex border-b border-white/10"
            role="tablist"
            aria-label="달력과 보관함"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === "calendar"}
              onClick={() => setView("calendar")}
              className={`flex-1 py-2.5 text-[12px] tracking-[0.1em] ${
                view === "calendar"
                  ? "border-b border-white text-white"
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
              className={`flex-1 py-2.5 text-[12px] tracking-[0.1em] ${
                view === "archive"
                  ? "border-b border-white text-white"
                  : "text-muted"
              }`}
              data-archive-tab
            >
              보관함{archive.length ? ` · ${archive.length}` : ""}
            </button>
          </div>
        ) : null}

        {offlineSim && !selectedBattle ? (
          <p
            className="border-b border-white/10 px-4 py-2 text-[11px] tracking-[0.08em] text-neutral-200"
            data-offline-sim-banner
          >
            오프라인 시뮬레이션 ON · 저장 배지만 열림
          </p>
        ) : null}

        <div className="overflow-y-auto">
          {selectedBattle ? (
            <DayDetail
              battle={selectedBattle}
              saved={savedDates.has(selectedBattle.date)}
              offlineSim={offlineSim}
              onBack={() => setSelected(null)}
              onToggleSave={() => {
                const next = toggleVerdictSaved(selectedBattle);
                syncSaved();
                onToast?.(
                  next
                    ? "판결을 오프라인 저장했습니다"
                    : "오프라인 저장을 해제했습니다",
                );
              }}
            />
          ) : view === "archive" ? (
            <ul
              className="px-3 py-4"
              aria-label="오프라인 보관함"
              data-offline-archive
            >
              {archive.length === 0 ? (
                <li className="px-1 py-10 text-center text-[13px] text-muted">
                  저장한 판결이 없습니다.
                  <br />
                  달력에서 지난 전투를 열고 저장하세요.
                </li>
              ) : (
                archive.map((b) => (
                  <li key={b.date} className="border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => openDay(b.date)}
                      className="flex w-full items-center gap-2 px-1 py-3 text-left"
                    >
                      <OfflineBadge />
                      <span className="min-w-0 flex-1 truncate text-[13px]">
                        {b.date.slice(5).replace("-", "/")} · {b.topic}
                      </span>
                      <span className="text-[12px] tabular-nums text-muted">
                        {b.winner === "JOINT" ? "공동" : `${b.winnerPercent}%`}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <div className="px-3 pb-6 pt-4" aria-label="전투 기록 달력">
              <p className="text-center text-[13px] font-semibold tracking-wide">
                {BATTLE_YEAR}년 {BATTLE_MONTH}월
              </p>
              <p className="mt-1 text-center text-[10px] tracking-[0.14em] text-muted">
                흑=도전 · 백=방어 · 반반=공동 · 띠=제안자 · 저장=오프라인
              </p>

              <div className="mt-4 grid grid-cols-7 gap-px bg-white/15">
                {WEEKDAYS.map((w) => (
                  <div
                    key={w}
                    className="bg-black py-1.5 text-center text-[10px] text-muted"
                  >
                    {w}
                  </div>
                ))}
                {cells.map((day, idx) => {
                  if (day == null) {
                    return (
                      <div key={`e-${idx}`} className="aspect-square bg-black" />
                    );
                  }
                  const key = `2026-10-${String(day).padStart(2, "0")}`;
                  const battle = byDate.get(key);
                  const joint = battle?.winner === "JOINT";
                  const challengerWin = battle?.winner === "NEXUS";
                  const saved = savedDates.has(key);

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!battle && !saved}
                      onClick={() => (battle || saved) && openDay(key)}
                      aria-label={
                        battle
                          ? `${day}일, ${
                              joint
                                ? "공동 승리"
                                : challengerWin
                                  ? "도전자 승리"
                                  : "방어자 승리"
                            }${battle.hasGirdle ? ", 제안자 허리띠" : ""}${
                              saved ? ", 오프라인 저장" : ""
                            }`
                          : `${day}일`
                      }
                      className={`relative aspect-square border-0 p-0 text-[12px] font-semibold tabular-nums outline-none ${
                        !battle
                          ? "bg-neutral-950 text-neutral-600"
                          : joint
                            ? "bg-[linear-gradient(90deg,#000_50%,#fff_50%)] text-white"
                            : challengerWin
                              ? "bg-black text-white"
                              : "bg-white text-black"
                      } ${battle ? "active:opacity-80" : ""}`}
                    >
                      {saved ? (
                        <span
                          className={`absolute right-0.5 top-0.5 size-1.5 ${
                            challengerWin || joint || !battle
                              ? "bg-white"
                              : "bg-black"
                          }`}
                          data-offline-dot
                          aria-hidden
                        />
                      ) : null}
                      <span className="flex h-full flex-col items-center justify-center gap-0.5">
                        <span
                          className={
                            joint ? "mix-blend-difference text-white" : undefined
                          }
                        >
                          {day}
                        </span>
                        {battle ? (
                          <span className="flex scale-90 items-center gap-0.5">
                            {joint ? (
                              <>
                                <SpearMark size={10} />
                                <ShieldMark size={10} className="text-black" />
                              </>
                            ) : challengerWin ? (
                              <SpearMark size={10} />
                            ) : (
                              <ShieldMark size={10} />
                            )}
                            {battle.hasGirdle ? (
                              <GirdleMark
                                size={9}
                                className={
                                  joint
                                    ? "text-white mix-blend-difference"
                                    : challengerWin
                                      ? "text-white"
                                      : "text-black"
                                }
                              />
                            ) : null}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>

              <ul className="mt-5 space-y-2 px-1" aria-label="최근 전투">
                {BATTLE_HISTORY.slice()
                  .reverse()
                  .slice(0, 4)
                  .map((b) => {
                    const saved = savedDates.has(b.date);
                    return (
                      <li key={b.date}>
                        <button
                          type="button"
                          onClick={() => openDay(b.date)}
                          className={`flex w-full items-center gap-2 border px-3 py-2.5 text-left text-[12px] ${
                            b.winner === "JOINT"
                              ? "border-white/25 bg-[linear-gradient(90deg,#000_50%,#fff_50%)] text-white"
                              : b.winner === "NEXUS"
                                ? "border-white/20 bg-black"
                                : "border-white/30 bg-white text-black"
                          }`}
                        >
                          {b.winner === "JOINT" ? (
                            <>
                              <SpearMark size={14} />
                              <ShieldMark size={14} className="text-black" />
                            </>
                          ) : b.winner === "NEXUS" ? (
                            <SpearMark size={14} />
                          ) : (
                            <ShieldMark size={14} />
                          )}
                          <span
                            className={`min-w-0 flex-1 truncate ${
                              b.winner === "JOINT"
                                ? "mix-blend-difference text-white"
                                : ""
                            }`}
                          >
                            {b.date.slice(5).replace("-", "/")} · {b.topic}
                          </span>
                          {saved ? (
                            <OfflineBadge light={b.winner === "AEGIS"} />
                          ) : null}
                          <span
                            className={`tabular-nums ${
                              b.winner === "JOINT"
                                ? "mix-blend-difference text-white"
                                : ""
                            }`}
                          >
                            {b.winner === "JOINT"
                              ? "공동"
                              : `${b.winnerPercent}%`}
                          </span>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
