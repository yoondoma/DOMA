"use client";

import { useMemo, useState } from "react";
import { ShieldMark, SpearMark } from "@/components/SideMarks";
import {
  BATTLE_HISTORY,
  BATTLE_MONTH,
  BATTLE_YEAR,
  battleByDate,
} from "@/lib/battle-history";
import type { BattleDay } from "@/lib/types";

type BattleCalendarProps = {
  open: boolean;
  onClose: () => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function startWeekday(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

function DayDetail({
  battle,
  onBack,
}: {
  battle: BattleDay;
  onBack: () => void;
}) {
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
        <p className="text-[11px] tracking-[0.16em] text-muted">
          제 {battle.round} 도마
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-syne)] text-[18px] font-bold leading-snug">
          {battle.topic}
        </h3>

        <div
          className={`mt-5 border px-3 py-3 ${
            challengerWin
              ? "border-white/25 bg-black"
              : "border-black/10 bg-white text-black"
          }`}
        >
          <p
            className={`text-[10px] font-bold tracking-[0.16em] ${
              challengerWin ? "text-muted" : "text-neutral-500"
            }`}
          >
            승리자
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {challengerWin ? <SpearMark size={18} /> : <ShieldMark size={18} />}
            <span className="text-[15px] font-bold tracking-[0.12em]">
              {challengerWin ? "도전자" : "방어자"}
            </span>
            <span
              className={`ml-auto text-[18px] font-bold tabular-nums ${
                challengerWin ? "text-white" : "text-black"
              }`}
            >
              {battle.winnerPercent}%
            </span>
          </div>
          <p
            className={`mt-1 text-[11px] ${
              challengerWin ? "text-muted" : "text-neutral-500"
            }`}
          >
            상대 {100 - battle.winnerPercent}% · @
            {battle.opponentAuthor}
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
      </div>
    </div>
  );
}

export function BattleCalendar({ open, onClose }: BattleCalendarProps) {
  const [selected, setSelected] = useState<string | null>(null);

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

  const selectedBattle = selected ? battleByDate(selected) : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 sm:items-center"
      role="dialog"
      aria-modal
      aria-label="전투 기록 달력"
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

        <div className="overflow-y-auto">
          {selectedBattle ? (
            <DayDetail
              battle={selectedBattle}
              onBack={() => setSelected(null)}
            />
          ) : (
            <div className="px-3 pb-6 pt-4">
              <p className="text-center text-[13px] font-semibold tracking-wide">
                {BATTLE_YEAR}년 {BATTLE_MONTH}월
              </p>
              <p className="mt-1 text-center text-[10px] tracking-[0.14em] text-muted">
                흑=도전자 승 · 백=방어자 승
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
                  const challengerWin = battle?.winner === "NEXUS";

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!battle}
                      onClick={() => battle && setSelected(key)}
                      aria-label={
                        battle
                          ? `${day}일, ${challengerWin ? "도전자" : "방어자"} 승리`
                          : `${day}일`
                      }
                      className={`aspect-square border-0 p-0 text-[12px] font-semibold tabular-nums outline-none ${
                        !battle
                          ? "bg-neutral-950 text-neutral-600"
                          : challengerWin
                            ? "bg-black text-white"
                            : "bg-white text-black"
                      } ${battle ? "active:opacity-80" : ""}`}
                    >
                      <span className="flex h-full flex-col items-center justify-center gap-0.5">
                        {day}
                        {battle ? (
                          <span className="scale-90">
                            {challengerWin ? (
                              <SpearMark size={10} />
                            ) : (
                              <ShieldMark size={10} />
                            )}
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
                  .map((b) => (
                    <li key={b.date}>
                      <button
                        type="button"
                        onClick={() => setSelected(b.date)}
                        className={`flex w-full items-center gap-2 border px-3 py-2.5 text-left text-[12px] ${
                          b.winner === "NEXUS"
                            ? "border-white/20 bg-black"
                            : "border-white/30 bg-white text-black"
                        }`}
                      >
                        {b.winner === "NEXUS" ? (
                          <SpearMark size={14} />
                        ) : (
                          <ShieldMark size={14} />
                        )}
                        <span className="min-w-0 flex-1 truncate">
                          {b.date.slice(5).replace("-", "/")} · {b.topic}
                        </span>
                        <span className="tabular-nums">{b.winnerPercent}%</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
