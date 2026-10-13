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
  { id: "TOP", label: "Top 소수" },
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
      className={`inline-flex px-1 py-px text-[10px] font-bold tracking-[0.14em] ${
        isNexus
          ? "border border-white/80 text-white"
          : "bg-white text-black"
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
    <section className="mx-auto max-w-[560px]">
      <div
        className="sticky top-11 z-30 flex border-b border-white/12 bg-black/90 backdrop-blur-md"
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
              className={`min-h-10 flex-1 px-1 text-[12px] font-semibold tracking-wide transition-colors ${
                selected
                  ? "border-b-2 border-white text-white"
                  : "border-b-2 border-transparent text-muted hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <ul>
        {visible.length === 0 ? (
          <li className="px-4 py-12 text-center text-sm text-muted">
            이 탭에 표시할 진술이 없습니다.
          </li>
        ) : (
          visible.map((op, index) => (
            <li
              key={op.id}
              className={`feed-item border-b px-4 py-3 ${
                op.isTopMinority
                  ? "border-l-2 border-l-white border-b-white/12 bg-white/[0.03]"
                  : "border-white/10"
              }`}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="mb-1 flex items-center gap-2">
                <div
                  className="flex size-8 shrink-0 items-center justify-center border border-white/30 text-[10px] font-bold text-muted"
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
                    {op.isTopMinority ? (
                      <span className="shrink-0 text-[10px] font-bold tracking-wide text-white/80">
                        · TOP 소수
                      </span>
                    ) : null}
                  </div>
                </div>
                <span className="shrink-0 text-[11px] tabular-nums text-dim">
                  ♥ {op.likes}
                </span>
              </div>
              <p className="pl-10 text-[14px] leading-[1.45] text-white/95">
                {op.text}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
