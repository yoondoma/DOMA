"use client";

import { useEffect, useMemo, useState } from "react";
import { OpinionSocial } from "@/components/OpinionSocial";
import { StatusBlock } from "@/components/StatusBlock";
import { formatCountdown, nextOpenAtKstIso } from "@/lib/kst";
import { domaStore, useDomaStore } from "@/lib/store";
import {
  FIELD_OPINIONS,
  type TomorrowCandidate,
} from "@/lib/tomorrow-topics";
import type { UiDemo } from "@/lib/ui-demo";

type TomorrowFieldProps = {
  candidates: TomorrowCandidate[];
  onSupport: (id: string) => void;
  onPropose?: () => void;
  supportedId: string | null;
  uiDemo?: UiDemo;
  onRetry?: () => void;
  onToast?: (message: string) => void;
  onNeedLogin?: () => void;
};

function stanceLabel(stance: "support" | "lead" | "question") {
  if (stance === "lead") return "이끔";
  if (stance === "support") return "지지";
  return "질문";
}

/** 다음 08:00 KST(주제 확정·OPEN)까지 */
function useTopicConfirmCountdown(): string {
  const [remaining, setRemaining] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const ends = new Date(nextOpenAtKstIso()).getTime();
      setRemaining(formatCountdown(ends - Date.now()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return remaining;
}

/**
 * 내일 필드 — 오늘 아레나와 같은 계층:
 * 위 TOP 토픽 → 아래 현재 올라오는 실시간 의견 (스크롤로 이어짐)
 */
export function TomorrowField({
  candidates,
  onSupport,
  onPropose,
  supportedId,
  uiDemo = "normal",
  onRetry,
  onToast,
  onNeedLogin,
}: TomorrowFieldProps) {
  const snap = useDomaStore();
  const [pickedId, setPickedId] = useState<string | null>(null);
  const confirmRemaining = useTopicConfirmCountdown();

  const replyCountFor = (kind: "topic" | "field", id: string) =>
    snap.replies.filter((r) => r.parentKind === kind && r.parentId === id)
      .length;

  const shown =
    uiDemo === "empty" ? ([] as TomorrowCandidate[]) : candidates;

  const ranked = useMemo(
    () => [...shown].sort((a, b) => b.votes - a.votes),
    [shown],
  );

  const topTopics = ranked.slice(0, 5);
  const total = useMemo(
    () => shown.reduce((s, c) => s + c.votes, 0),
    [shown],
  );

  const titleById = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of shown) m.set(c.id, c.title);
    return m;
  }, [shown]);

  /** 실시간: 최신·좋아요 섞인 피드 (목) */
  const liveFeed = useMemo(() => {
    if (uiDemo === "empty") return [];
    return [...FIELD_OPINIONS].sort((a, b) => b.likes - a.likes);
  }, [uiDemo]);

  return (
    <section
      className="mx-auto max-w-[560px] bg-black text-white"
      aria-label="내일의 주제 필드"
    >
      {/* 주제 확정 카운트다운 — 헤더 타이머 없음, 전장과 같은 빨간 톤 */}
      <div className="border-b border-white/10 px-5 pb-5 pt-6 text-center">
        <p className="text-[11px] font-medium tracking-[0.22em] text-white/45">
          다음 전투 · 필드
        </p>
        <p className="mt-4 text-[11px] tracking-[0.18em] text-white/55">
          내일의 주제 확정까지
        </p>
        <p
          className="mt-2 font-mono text-[34px] font-semibold leading-none tracking-[0.06em] text-timer tabular-nums sm:text-[38px]"
          aria-label={`주제 확정까지 ${confirmRemaining}`}
        >
          {confirmRemaining}
          <span className="ml-2 align-middle text-[13px] font-medium tracking-[0.14em] text-timer/90">
            남음
          </span>
        </p>
        <p className="mt-3 text-[10px] tracking-[0.08em] text-white/35">
          매일 08:00 OPEN · 후보가 오늘 안건으로 확정
        </p>
      </div>

      <div
        className="flex flex-col justify-center px-5 pb-6 pt-7"
        aria-label="내일 필드 안내"
      >
        <h2 className="font-[family-name:var(--font-syne)] text-[26px] font-bold leading-[1.28] tracking-tight sm:text-[28px]">
          내일의 주제 정하기
        </h2>
        <p className="mt-4 max-w-[36em] text-[15px] leading-[1.7] text-white/78">
          지지 1위가 자동으로 확정됩니다. 창/방패로 나뉠 수 있는 주제를
          올리고, 아래 실시간 의견을 관찰합니다.
        </p>
      </div>

      {/* 위: TOP 토픽 */}
      <div aria-label="TOP 토픽" className="border-t border-white/12">
        <div className="flex items-center justify-between px-4 py-2.5">
          <p className="text-[10px] font-bold tracking-[0.16em] text-muted">
            TOP 토픽
          </p>
          <p className="text-[11px] tabular-nums text-muted">
            총 {total.toLocaleString("ko-KR")}표
          </p>
        </div>
        {uiDemo === "loading" ? (
          <StatusBlock kind="loading" message="불러오는 중" />
        ) : uiDemo === "error" ? (
          <StatusBlock
            kind="error"
            message="후보를 불러오지 못했습니다."
            actionLabel="다시 시도"
            onAction={onRetry}
          />
        ) : topTopics.length === 0 ? (
          <StatusBlock
            kind="empty"
            message="아직 올라온 주제가 없습니다."
            actionLabel={onPropose ? "주제 제안" : undefined}
            onAction={onPropose}
          />
        ) : null}
        <ul>
          {topTopics.map((c, i) => {
            const pct = total > 0 ? Math.round((c.votes / total) * 100) : 0;
            const picked = pickedId === c.id;
            return (
              <li key={c.id} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() =>
                    setPickedId((prev) => (prev === c.id ? null : c.id))
                  }
                  aria-pressed={picked}
                  className={`flex w-full items-start gap-3 px-4 py-3.5 text-left active:bg-white/[0.04] ${
                    picked ? "bg-white/[0.06]" : ""
                  }`}
                >
                  <span className="mt-0.5 w-5 shrink-0 text-[12px] font-bold tabular-nums text-muted">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-[family-name:var(--font-syne)] text-[15px] font-bold leading-snug">
                      {c.title}
                    </span>
                    <span className="mt-1.5 block text-[12px] leading-[1.45] text-white/60">
                      {c.note}
                    </span>
                    <span className="mt-1.5 block text-[12px] tabular-nums text-muted">
                      지지 {c.votes.toLocaleString("ko-KR")} · {pct}% · 이끔{" "}
                      {c.stewards}
                      <span className="ml-1.5 tracking-[0.08em] text-white/55">
                        · 안건자
                      </span>
                    </span>
                  </span>
                </button>
                {picked ? (
                  <div className="border-t border-white/10 px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={supportedId === c.id}
                        onClick={() => onSupport(c.id)}
                        className="flex-1 border border-white bg-white py-2 text-[12px] font-bold tracking-[0.1em] text-black disabled:border-white/25 disabled:bg-transparent disabled:text-muted"
                      >
                        {supportedId === c.id ? "지지함" : "이 주제 지지"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onSupport(c.id)}
                        className="flex-1 border border-white/40 py-2 text-[12px] font-bold tracking-[0.1em] text-white"
                      >
                        이끌기
                      </button>
                    </div>
                    <OpinionSocial
                      parentKind="topic"
                      targetId={c.id}
                      likes={
                        snap.likes.filter(
                          (l) =>
                            l.targetKind === "topic" && l.targetId === c.id,
                        ).length
                      }
                      replies={replyCountFor("topic", c.id)}
                      likedByMe={domaStore.hasLiked("topic", c.id)}
                      previewText={c.title}
                      indent={false}
                      onToast={onToast}
                      onNeedLogin={onNeedLogin}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
        {onPropose ? (
          <div className="px-4 py-3">
            <button
              type="button"
              onClick={onPropose}
              className="w-full border border-white/25 py-2.5 text-[12px] font-bold tracking-[0.1em] text-white"
            >
              새 주제 제안하기
            </button>
          </div>
        ) : null}
      </div>

      {/* 아래: 현재 올라오는 실시간 의견 */}
      <div
        className="border-t border-white/15"
        aria-label="현재 올라오는 의견"
      >
        <div className="sticky top-[5.75rem] z-20 flex items-center gap-2 border-b border-white/10 bg-black/96 px-4 py-2.5 backdrop-blur-md">
          <span
            className="size-1.5 animate-pulse rounded-full bg-white"
            aria-hidden
          />
          <p className="text-[10px] font-bold tracking-[0.16em] text-muted">
            현재 올라오는 의견
          </p>
        </div>
        {uiDemo === "loading" ? (
          <StatusBlock kind="loading" message="불러오는 중" />
        ) : uiDemo === "error" ? (
          <StatusBlock
            kind="error"
            message="피드를 불러오지 못했습니다."
            actionLabel="다시 시도"
            onAction={onRetry}
          />
        ) : liveFeed.length === 0 ? (
          <StatusBlock
            kind="empty"
            message="아직 실시간 의견이 없습니다."
            actionLabel={onPropose ? "주제 제안" : undefined}
            onAction={onPropose}
          />
        ) : (
          <>
            <ul>
              {liveFeed.map((op) => {
                const topic = titleById.get(op.topicId) ?? "후보";
                return (
                  <li
                    key={op.id}
                    className="border-b border-white/10 px-4 py-3.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold">
                        @{op.author}
                      </span>
                      <span className="border border-white/25 px-1.5 py-0.5 text-[10px] tracking-[0.08em] text-muted">
                        {stanceLabel(op.stance)}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-[11px] text-muted">
                      {topic}
                    </p>
                    <p className="mt-1.5 text-[14px] leading-[1.55] text-white/90">
                      {op.text}
                    </p>
                    <OpinionSocial
                      parentKind="field"
                      targetId={op.id}
                      likes={
                        op.likes + (domaStore.hasLiked("field", op.id) ? 1 : 0)
                      }
                      replies={replyCountFor("field", op.id)}
                      likedByMe={domaStore.hasLiked("field", op.id)}
                      previewText={op.text}
                      authorHandle={op.author}
                      indent={false}
                      onToast={onToast}
                      onNeedLogin={onNeedLogin}
                    />
                  </li>
                );
              })}
            </ul>
            <p className="px-4 py-6 text-center text-[11px] tracking-[0.12em] text-muted">
              실시간 피드 · 끝
            </p>
          </>
        )}
      </div>
    </section>
  );
}
