"use client";

import { useMemo } from "react";
import { ShieldMark, SideBadge, SpearMark } from "@/components/SideMarks";
import type { Opinion, Side } from "@/lib/types";

export type FeedTab = "ALL" | "TOP" | "NEXUS" | "AEGIS";

type OpinionFeedProps = {
  opinions: Opinion[];
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  focusSide: Side;
  /** 첫 화면에 보이는 실시간 글 개수 */
  peekCount?: number;
};

const TABS: { id: FeedTab; label: string; icon?: "spear" | "shield" }[] = [
  { id: "ALL", label: "전체" },
  { id: "TOP", label: "Top 소수" },
  { id: "NEXUS", label: "창", icon: "spear" },
  { id: "AEGIS", label: "방패", icon: "shield" },
];

function filterOpinions(opinions: Opinion[], tab: FeedTab): Opinion[] {
  if (tab === "ALL") {
    const top = opinions.filter((o) => o.isTopMinority);
    const rest = opinions.filter((o) => !o.isTopMinority);
    return [...top, ...rest];
  }
  if (tab === "TOP") {
    return opinions.filter((o) => o.isTopMinority);
  }
  return opinions.filter((o) => o.side === (tab as Side));
}

function HeartMark({ className }: { className: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 ${className}`}
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

function OpinionRow({
  op,
  light,
  index,
}: {
  op: Opinion;
  light: boolean;
  index: number;
}) {
  return (
    <li
      className={`feed-item border-b px-4 py-3 ${
        light
          ? op.isTopMinority
            ? "border-l-2 border-l-black border-b-black/10 bg-neutral-50"
            : "border-black/10"
          : op.isTopMinority
            ? "border-l-2 border-l-white border-b-white/12 bg-white/[0.03]"
            : "border-white/10"
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="mb-1 flex items-center gap-2">
        <div
          className={`flex size-8 shrink-0 items-center justify-center border text-[10px] font-bold ${
            light
              ? "border-black/30 text-neutral-500"
              : "border-white/30 text-muted"
          }`}
          aria-hidden
        >
          {op.author.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`truncate text-[13px] font-semibold ${
                light ? "text-black" : "text-white"
              }`}
            >
              @{op.author}
            </span>
            <SideBadge side={op.side} />
            {op.isTopMinority ? (
              <span
                className={`shrink-0 text-[10px] font-bold tracking-wide ${
                  light ? "text-neutral-600" : "text-white/80"
                }`}
              >
                · TOP 소수
              </span>
            ) : null}
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 text-[11px] tabular-nums ${
            light ? "text-neutral-500" : "text-muted"
          }`}
        >
          <HeartMark className={light ? "text-neutral-500" : "text-muted"} />
          {op.likes}
        </span>
      </div>
      <p
        className={`pl-10 text-[14px] leading-[1.45] ${
          light ? "text-black/90" : "text-white/95"
        }`}
      >
        {op.text}
      </p>
    </li>
  );
}

/** Top 아래: 실시간 글 peek + 스크롤 시 전체 피드 */
export function OpinionFeed({
  opinions,
  activeTab,
  onTabChange,
  focusSide,
  peekCount = 2,
}: OpinionFeedProps) {
  const light = focusSide === "AEGIS";
  const visible = useMemo(
    () => filterOpinions(opinions, activeTab),
    [opinions, activeTab],
  );
  const peek = visible.slice(0, peekCount);
  const rest = visible.slice(peekCount);

  return (
    <section
      className={`mx-auto max-w-[560px] border-t ${
        light
          ? "border-black/10 bg-white text-black"
          : "border-white/12 bg-black text-white"
      }`}
      aria-label="의견 피드"
    >
      <div
        className={`flex border-b ${
          light ? "border-black/10 bg-white" : "border-white/12 bg-black"
        }`}
        role="tablist"
        aria-label="의견 필터"
      >
        {TABS.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={tab.label}
              onClick={() => onTabChange(tab.id)}
              className={`flex min-h-9 flex-1 items-center justify-center gap-1 px-1 text-[12px] font-semibold tracking-wide ${
                selected
                  ? light
                    ? "border-b-2 border-black text-black"
                    : "border-b-2 border-white text-white"
                  : light
                    ? "border-b-2 border-transparent text-neutral-400"
                    : "border-b-2 border-transparent text-muted"
              }`}
            >
              {tab.icon === "spear" ? <SpearMark size={14} /> : null}
              {tab.icon === "shield" ? <ShieldMark size={14} /> : null}
              {tab.icon ? null : tab.label}
            </button>
          );
        })}
      </div>

      <p
        className={`px-4 py-2 text-[10px] font-bold tracking-[0.16em] ${
          light ? "text-neutral-500" : "text-muted"
        }`}
      >
        실시간
      </p>

      <ul aria-label="실시간 미리보기">
        {peek.length === 0 ? (
          <li
            className={`px-4 py-8 text-center text-sm ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            아직 올라온 글이 없습니다.
          </li>
        ) : (
          peek.map((op, index) => (
            <OpinionRow key={op.id} op={op} light={light} index={index} />
          ))
        )}
      </ul>

      {rest.length > 0 ? (
        <>
          <p
            className={`border-t px-4 py-2 text-center text-[11px] tracking-wide ${
              light
                ? "border-black/10 text-neutral-400"
                : "border-white/10 text-dim"
            }`}
          >
            ↓ 더 스크롤하면 이어집니다
          </p>
          <ul aria-label="전체 피드">
            {rest.map((op, index) => (
              <OpinionRow
                key={op.id}
                op={op}
                light={light}
                index={index + peekCount}
              />
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
