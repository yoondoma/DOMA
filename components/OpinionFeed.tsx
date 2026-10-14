"use client";

import { Fragment, useMemo } from "react";
import { AdSlot } from "@/components/AdSlot";
import { SideBadge } from "@/components/SideMarks";
import { useUiOpinions } from "@/lib/store";
import type { Opinion } from "@/lib/types";

type OpinionFeedProps = {
  /** 생략 시 목 스토어 오늘 글 */
  opinions?: Opinion[];
};

function HeartMark() {
  return (
    <svg
      width="12"
      height="12"
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
      className={`feed-item border-b border-white/10 px-4 py-2.5 ${
        op.isTopMinority ? "border-l-2 border-l-white bg-white/[0.03]" : ""
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="mb-0.5 flex items-center gap-2">
        <div
          className="flex size-7 shrink-0 items-center justify-center border border-white/30 text-[10px] font-bold text-muted"
          aria-hidden
        >
          {op.author.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[13px] font-semibold text-white">
              @{op.author}
            </span>
            <SideBadge side={op.side} />
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] tabular-nums text-muted">
          <HeartMark />
          {op.likes}
        </span>
      </div>
      <p className="line-clamp-2 pl-9 text-[13px] leading-[1.4] text-white/95">
        {op.text}
      </p>
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
      className="mx-auto max-w-[560px] border-t border-white/12 bg-black text-white"
      aria-label="의견 피드"
    >
      <div className="border-b border-white/12 px-4 py-2.5">
        <p className="text-[10px] font-bold tracking-[0.18em] text-muted">
          현재 올라오는 의견
        </p>
        <p className="mt-0.5 text-[11px] text-white/45">
          주제 아래 · 실시간 대화
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

      <div className="border-y border-white/12 px-4 py-2">
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
            <Fragment key={`hot-${op.id}`}>
              <OpinionRow op={op} index={index} />
              {(index + 1) % 3 === 0 ? (
                <li>
                  <AdSlot id="feed_native" />
                </li>
              ) : null}
            </Fragment>
          ))
        )}
      </ul>
    </section>
  );
}
