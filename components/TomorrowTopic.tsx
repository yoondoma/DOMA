"use client";

import { useMemo, useState } from "react";
import {
  INITIAL_TOMORROW_TOPICS,
  type TomorrowCandidate,
} from "@/lib/tomorrow-topics";

type TomorrowTopicProps = {
  onVoted?: (title: string) => void;
  embedded?: boolean;
  /** 상위(필드)와 공유하는 후보 */
  candidates?: TomorrowCandidate[];
  onSupport?: (id: string) => void;
  supportedId?: string | null;
};

/** 달력「미래」탭용 압축 목록 — 본 필드는 TomorrowField */
export function TomorrowTopic({
  onVoted,
  embedded = false,
  candidates: controlled,
  onSupport,
  supportedId = null,
}: TomorrowTopicProps) {
  const [local, setLocal] = useState<TomorrowCandidate[]>(INITIAL_TOMORROW_TOPICS);
  const [picked, setPicked] = useState<string | null>(null);

  const candidates = controlled ?? local;

  const total = useMemo(
    () => candidates.reduce((sum, c) => sum + c.votes, 0),
    [candidates],
  );

  const ranked = useMemo(
    () => [...candidates].sort((a, b) => b.votes - a.votes),
    [candidates],
  );

  const handleVote = () => {
    if (!picked || supportedId === picked) return;
    if (onSupport) {
      onSupport(picked);
    } else {
      setLocal((prev) =>
        prev.map((c) =>
          c.id === picked ? { ...c, votes: c.votes + 1 } : c,
        ),
      );
    }
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
          메인 「내일」 필드와 같은 후보입니다. 여기서도 지지할 수 있습니다.
        </p>

        <ul className="mt-4 space-y-2" aria-label="내일 주제 후보">
          {ranked.map((c, i) => {
            const pct = total > 0 ? Math.round((c.votes / total) * 100) : 0;
            const selected = picked === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setPicked(c.id)}
                  aria-pressed={selected}
                  className={`relative w-full overflow-hidden border px-3 py-3 text-left transition-colors ${
                    selected
                      ? "border-white bg-white/10"
                      : "border-white/20 bg-transparent"
                  }`}
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
                        {supportedId === c.id ? " · 내 지지" : ""}
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
          disabled={!picked || supportedId === picked}
          className="mt-3 w-full border border-white bg-white px-3 py-2.5 text-[13px] font-bold tracking-[0.1em] text-black disabled:border-white/25 disabled:bg-transparent disabled:text-muted"
        >
          {supportedId && picked === supportedId ? "지지함" : "이 주제 지지"}
        </button>
      </div>
    </section>
  );
}
