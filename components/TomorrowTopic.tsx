"use client";

import { useMemo, useState } from "react";
import {
  INITIAL_TOMORROW_TOPICS,
  type TomorrowCandidate,
} from "@/lib/tomorrow-topics";

type TomorrowTopicProps = {
  onVoted?: (title: string) => void;
  /** 달력 시트 안 임베드 — 항상 후보 목록 */
  embedded?: boolean;
};

/** 내일의 주제 후보·투표 (목). 본문 큰 카드가 아니라 달력「미래」탭에서 사용 */
export function TomorrowTopic({ onVoted, embedded = false }: TomorrowTopicProps) {
  const [candidates, setCandidates] = useState<TomorrowCandidate[]>(
    INITIAL_TOMORROW_TOPICS,
  );
  const [picked, setPicked] = useState<string | null>(null);
  const [votedId, setVotedId] = useState<string | null>(null);

  const total = useMemo(
    () => candidates.reduce((sum, c) => sum + c.votes, 0),
    [candidates],
  );

  const ranked = useMemo(
    () => [...candidates].sort((a, b) => b.votes - a.votes),
    [candidates],
  );

  const handleVote = () => {
    if (!picked || votedId) return;
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === picked ? { ...c, votes: c.votes + 1 } : c,
      ),
    );
    setVotedId(picked);
    const title = candidates.find((c) => c.id === picked)?.title ?? "";
    onVoted?.(title);
  };

  return (
    <section
      aria-label="내일의 주제 정하기"
      className={
        embedded
          ? "bg-black text-white"
          : "mx-auto max-w-[560px] border-t border-white/12 bg-black text-white"
      }
    >
      <div className={embedded ? "px-4 py-4" : "px-5 py-5"}>
        <p className="text-[10px] font-bold tracking-[0.18em] text-muted">
          다음 도마 · 미래
        </p>
        <h3 className="mt-1.5 font-[family-name:var(--font-syne)] text-[17px] font-bold tracking-tight">
          내일의 주제 정하기
        </h3>
        <p className="mt-1.5 text-[13px] leading-[1.45] text-white/70">
          후보에 한 표를 던져 내일 아레나 주제를 고릅니다.
        </p>

        <ul className="mt-4 space-y-2" aria-label="내일 주제 후보">
          {ranked.map((c, i) => {
            const pct = total > 0 ? Math.round((c.votes / total) * 100) : 0;
            const selected = picked === c.id;
            const locked = votedId != null;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setPicked(c.id)}
                  aria-pressed={selected}
                  className={`relative w-full overflow-hidden border px-3 py-3 text-left transition-colors ${
                    selected
                      ? "border-white bg-white/10"
                      : "border-white/20 bg-transparent"
                  } ${locked && votedId !== c.id ? "opacity-55" : ""}`}
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-white/10"
                    style={{ width: `${pct}%` }}
                    aria-hidden
                  />
                  <span className="relative flex items-start gap-2">
                    <span className="mt-0.5 w-5 shrink-0 text-[11px] tabular-nums text-muted">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium leading-snug">
                        {c.title}
                      </span>
                      <span className="mt-1 block text-[11px] tabular-nums text-muted">
                        {c.votes.toLocaleString("ko-KR")}표 · {pct}%
                        {votedId === c.id ? " · 내 표" : ""}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={handleVote}
          disabled={!picked || votedId != null}
          className="mt-3 w-full border border-white bg-white px-3 py-2.5 text-[13px] font-bold tracking-[0.1em] text-black disabled:border-white/25 disabled:bg-transparent disabled:text-muted"
        >
          {votedId ? "투표 완료" : "이 주제로 투표"}
        </button>
      </div>
    </section>
  );
}
