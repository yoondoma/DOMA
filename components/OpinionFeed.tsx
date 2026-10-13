"use client";

import type { Opinion, Side } from "@/lib/types";

export type FeedTab = "ALL" | "TOP" | "NEXUS" | "AEGIS";

type OpinionFeedProps = {
  opinions: Opinion[];
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
};

const TABS: { id: FeedTab; label: string }[] = [
  { id: "ALL", label: "전체" },
  { id: "TOP", label: "Top 소수의견" },
  { id: "NEXUS", label: "NEXUS" },
  { id: "AEGIS", label: "AEGIS" },
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

function SideBadge({ side }: { side: Side }) {
  const isNexus = side === "NEXUS";
  return (
    <span
      className={`inline-flex border px-1.5 py-0.5 text-[10px] font-bold tracking-[0.16em] ${
        isNexus
          ? "border-white bg-black text-white"
          : "border-white bg-white text-black"
      }`}
    >
      {side}
    </span>
  );
}

export function OpinionFeed({
  opinions,
  activeTab,
  onTabChange,
}: OpinionFeedProps) {
  const visible = filterOpinions(opinions, activeTab);

  return (
    <section className="mx-auto max-w-3xl px-3 pb-28 pt-3 sm:px-4 sm:pt-4">
      <div
        className="flex gap-0 overflow-x-auto border-b border-white/20"
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
              onClick={() => onTabChange(tab.id)}
              className={`shrink-0 border-b-2 px-2.5 py-2 text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors sm:px-3 sm:text-xs ${
                selected
                  ? "border-white text-white"
                  : "border-transparent text-muted hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
        {visible.length === 0 ? (
          <li className="border border-dashed border-white/30 px-3 py-8 text-center text-sm text-muted">
            이 탭에 표시할 진술이 없습니다.
          </li>
        ) : (
          visible.map((op, index) => (
            <li
              key={op.id}
              className={`feed-item border bg-surface px-3 py-2.5 sm:px-3.5 sm:py-3 ${
                op.isTopMinority
                  ? "border-white shadow-[inset_0_0_0_1px_#fff]"
                  : "border-white/25"
              }`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <SideBadge side={op.side} />
                  <span className="truncate text-xs text-muted">
                    @{op.author}
                  </span>
                  {op.isTopMinority ? (
                    <span className="shrink-0 text-[10px] font-bold tracking-[0.12em] text-white">
                      TOP 소수
                    </span>
                  ) : null}
                </div>
                <span className="shrink-0 text-[11px] tabular-nums text-dim">
                  ♥ {op.likes}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-white sm:text-sm">
                {op.text}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
