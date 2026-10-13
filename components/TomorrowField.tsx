"use client";

import { useMemo, useState } from "react";
import type { TomorrowCandidate } from "@/lib/tomorrow-topics";

type TomorrowFieldProps = {
  candidates: TomorrowCandidate[];
  onSupport: (id: string) => void;
  onPropose?: () => void;
  supportedId: string | null;
};

/**
 * 내일의 주제 전용 필드 — 오늘 아레나와 나란한 1급 서피스.
 * 흐름: 필드 파악 → 후보를 하나하나 점검·지지/이끌기
 */
export function TomorrowField({
  candidates,
  onSupport,
  onPropose,
  supportedId,
}: TomorrowFieldProps) {
  const [focusId, setFocusId] = useState<string | null>(null);

  const ranked = useMemo(
    () => [...candidates].sort((a, b) => b.votes - a.votes),
    [candidates],
  );

  const total = useMemo(
    () => candidates.reduce((s, c) => s + c.votes, 0),
    [candidates],
  );

  const focused = focusId
    ? (ranked.find((c) => c.id === focusId) ?? null)
    : null;

  const select = (id: string) => {
    setFocusId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="mx-auto max-w-[560px] bg-black text-white"
      aria-label="내일의 주제 필드"
    >
      {/* 초기: 필드 파악 (오늘 주제 영역과 같은 무게) */}
      <div
        className={`${
          focused
            ? "sticky top-[5.75rem] z-30 border-b border-white/12 bg-black/96 px-5 pb-3 pt-3 backdrop-blur-md"
            : "flex min-h-[36dvh] flex-col justify-center px-5 pb-6 pt-10"
        }`}
        aria-label="내일 필드 안내"
      >
        <p className="text-[11px] tracking-[0.18em] text-muted">
          다음 도마 · 필드
        </p>
        <h2
          className={`mt-3 font-[family-name:var(--font-syne)] font-bold tracking-tight ${
            focused
              ? "text-[18px] leading-[1.35]"
              : "text-[26px] leading-[1.28] sm:text-[28px]"
          }`}
        >
          내일의 주제 정하기
        </h2>
        {!focused ? (
          <>
            <p className="mt-4 max-w-[36em] text-[15px] leading-[1.7] text-white/78">
              후보를 하나씩 점검하고 지지·이끌어, 내일 아레나 주제를 필드에서
              정합니다. 오늘 판결만큼 중요합니다.
            </p>
            <p className="mt-5 text-center text-[11px] tracking-[0.16em] text-muted">
              다음 · 후보를 골라 하나씩 살펴보세요
            </p>
          </>
        ) : (
          <p className="mt-1.5 text-[12px] leading-[1.45] text-white/55">
            후보 {ranked.length} · 총 {total.toLocaleString("ko-KR")}표
          </p>
        )}
      </div>

      {/* 후보 목록 — 진영 칸처럼 다음 액션 */}
      {!focused ? (
        <ul aria-label="내일 주제 후보" className="border-t border-white/12">
          {ranked.map((c, i) => {
            const pct = total > 0 ? Math.round((c.votes / total) * 100) : 0;
            return (
              <li key={c.id} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => select(c.id)}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left active:bg-white/[0.04]"
                  aria-label={`${c.title} 점검`}
                >
                  <span className="mt-0.5 w-5 shrink-0 text-[12px] tabular-nums text-muted">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-[family-name:var(--font-syne)] text-[15px] font-bold leading-snug">
                      {c.title}
                    </span>
                    <span className="mt-1.5 block text-[12px] tabular-nums text-muted">
                      지지 {c.votes.toLocaleString("ko-KR")} · {pct}% · 이끔{" "}
                      {c.stewards}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {/* 펼침: 한 후보를 깊게 점검 */}
      {focused ? (
        <div aria-label="후보 점검">
          <div className="flex items-center justify-between border-b border-white/12 px-3 py-1.5">
            <p className="text-[10px] font-bold tracking-[0.16em] text-muted">
              후보 점검
            </p>
            <button
              type="button"
              onClick={() => setFocusId(null)}
              className="px-2 py-1 text-[12px] text-muted"
              aria-label="필드 목록으로"
            >
              닫기 · 목록으로
            </button>
          </div>

          <article className="px-5 py-5">
            <p className="text-[11px] tracking-[0.14em] text-muted">
              점검 중
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-syne)] text-[20px] font-bold leading-[1.35]">
              {focused.title}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] text-white/80">
              {focused.note}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 text-[12px]">
              <div className="border border-white/20 px-3 py-2.5">
                <p className="text-[10px] tracking-[0.14em] text-muted">지지</p>
                <p className="mt-1 text-[18px] font-bold tabular-nums">
                  {focused.votes.toLocaleString("ko-KR")}
                </p>
              </div>
              <div className="border border-white/20 px-3 py-2.5">
                <p className="text-[10px] tracking-[0.14em] text-muted">이끔</p>
                <p className="mt-1 text-[18px] font-bold tabular-nums">
                  {focused.stewards}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={supportedId === focused.id}
                onClick={() => onSupport(focused.id)}
                className="flex-1 border border-white bg-white py-2.5 text-[13px] font-bold tracking-[0.1em] text-black disabled:border-white/25 disabled:bg-transparent disabled:text-muted"
              >
                {supportedId === focused.id ? "지지함" : "이 주제 지지"}
              </button>
              <button
                type="button"
                onClick={() => onSupport(focused.id)}
                className="flex-1 border border-white/40 py-2.5 text-[13px] font-bold tracking-[0.1em] text-white"
              >
                이끌기
              </button>
            </div>
          </article>

          {/* 다른 후보로 바로 이동 */}
          <div className="border-t border-white/12 px-4 py-3">
            <p className="mb-2 text-[10px] font-bold tracking-[0.16em] text-muted">
              다른 후보
            </p>
            <ul className="space-y-1" aria-label="다른 후보">
              {ranked
                .filter((c) => c.id !== focused.id)
                .map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setFocusId(c.id)}
                      className="w-full truncate border border-white/15 px-3 py-2.5 text-left text-[13px] active:bg-white/[0.04]"
                    >
                      {c.title}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ) : null}

      {onPropose && !focused ? (
        <div className="px-4 py-4">
          <button
            type="button"
            onClick={onPropose}
            className="w-full border border-white/30 py-3 text-[13px] font-bold tracking-[0.1em] text-white"
          >
            새 주제 제안하기
          </button>
        </div>
      ) : null}
    </section>
  );
}
