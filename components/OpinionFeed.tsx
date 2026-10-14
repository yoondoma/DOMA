"use client";

import { useMemo } from "react";
import { SideBadge } from "@/components/SideMarks";
import { formatPostTimeKst } from "@/lib/format-time";
import { useUiOpinions } from "@/lib/store";
import type { Opinion } from "@/lib/types";

type OpinionFeedProps = {
  /** 생략 시 목 스토어 오늘 글 */
  opinions?: Opinion[];
};

function HeartMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-muted"
      aria-hidden
    >
      <path
        d="M8 13.2S2.8 9.8 2.8 5.9A2.7 2.7 0 0 1 8 4.4 2.7 2.7 0 0 1 13.2 5.9C13.2 9.8 8 13.2 8 13.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OpinionRow({ op, index }: { op: Opinion; index: number }) {
  return (
    <li
      className={`feed-item feed-post ${
        op.isTopMinority ? "bg-paper/[0.03]" : ""
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex gap-3">
        <div
          className="r-md flex size-9 shrink-0 items-center justify-center border border-edge text-[11px] font-bold text-muted"
          aria-hidden
        >
          {op.author.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="feed-meta flex flex-wrap items-center gap-1.5">
            <span className="truncate font-semibold text-paper">
              @{op.author}
            </span>
            <SideBadge side={op.side} />
            {op.createdAtUtc ? (
              <time
                className="text-[12px] tabular-nums text-muted"
                dateTime={op.createdAtUtc}
              >
                {formatPostTimeKst(op.createdAtUtc)}
              </time>
            ) : null}
            <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-[13px] tabular-nums text-muted">
              <HeartMark />
              {op.likes}
            </span>
          </div>
          <p className="feed-body mt-1 line-clamp-4 text-paper/95">{op.text}</p>
        </div>
      </div>
    </li>
  );
}

/** 실시간 올라오는 의견 + HOT 글 */
export function OpinionFeed({ opinions: opinionsProp }: OpinionFeedProps) {
  const fromStore = useUiOpinions();
  const opinions = opinionsProp ?? fromStore;
  const live = useMemo(() => {
    // 목: id 역순 ≈ 최근 · 첫 화면 peek는 2개
    return [...opinions].reverse().slice(0, 2);
  }, [opinions]);

  const hot = useMemo(() => {
    return [...opinions].sort((a, b) => b.likes - a.likes).slice(0, 4);
  }, [opinions]);

  return (
    <section
      className="mx-auto max-w-[560px] border-t border-edge bg-ink text-paper"
      aria-label="의견 피드"
    >
      <div className="border-b border-edge px-4 py-2.5">
        <p className="text-[10px] font-bold tracking-[0.18em] text-muted">
          현재 올라오는 의견
        </p>
      </div>
      <ul aria-label="실시간 의견">
        {live.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-muted">
            아직 올라온 글이 없습니다.
          </li>
        ) : (
          live.map((op, index) => (
            <OpinionRow key={`live-${op.id}`} op={op} index={index} />
          ))
        )}
      </ul>

      <div className="border-y border-edge px-4 py-2">
        <p className="text-[10px] font-bold tracking-[0.18em] text-muted">
          HOT 글
        </p>
      </div>
      <ul aria-label="HOT 글">
        {hot.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-muted">
            HOT 글이 아직 없습니다.
          </li>
        ) : (
          hot.map((op, index) => (
            <OpinionRow key={`hot-${op.id}`} op={op} index={index} />
          ))
        )}
      </ul>
    </section>
  );
}
