"use client";

import { useMemo, useState } from "react";
import {
  INITIAL_TOMORROW_TOPICS,
  type TomorrowCandidate,
} from "@/lib/tomorrow-topics";

type TomorrowTopicProps = {
  onVoted?: (title: string) => void;
};

/** 1번 안: 오늘 아레나 아래 · 실시간 의견 근처 — 내일의 주제 정하기 */
export function TomorrowTopic({ onVoted }: TomorrowTopicProps) {
  const [open, setOpen] = useState(false);
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
      className="mx-auto max-w-[560px] border-t border-white/12 bg-black text-white"
    >
      <div className="px-5 py-5">
        <p className="text-[10px] font-bold tracking-[0.18em] text-muted">
          다음 도마
        </p>
        <h3 className="mt-1.5 font-[family-name:var(--font-syne)] text-[17px] font-bold tracking-tight">
          내일의 주제 정하기
        </h3>
        <p className="mt-1.5 text-[13px] leading-[1.45] text-white/70">
          후보에 한 표를 던져 내일 아레나 주제를 고릅니다.
        </p>

        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 w-full border border-white bg-white px-4 py-3 text-[13px] font-bold tracking-[0.12em] text-black"
            aria-expanded={false}
          >
            후보 보고 투표하기
          </button>
        ) : (
          <div className="mt-4">
            <ul className="space-y-2" aria-label="내일 주제 후보">
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

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleVote}
                disabled={!picked || votedId != null}
                className="flex-1 border border-white bg-white px-3 py-2.5 text-[13px] font-bold tracking-[0.1em] text-black disabled:border-white/25 disabled:bg-transparent disabled:text-muted"
              >
                {votedId ? "투표 완료" : "이 주제로 투표"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-white/25 px-3 py-2.5 text-[13px] text-muted"
                aria-label="내일 주제 접기"
              >
                접기
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
