"use client";

import { useMemo } from "react";
import { ShieldMark, SideBadge, SpearMark } from "@/components/SideMarks";
import type { Opinion, Side } from "@/lib/types";

export type FeedTab = "ALL" | "TOP" | "NEXUS" | "AEGIS";

type OpinionFeedProps = {
  opinions: Opinion[];
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  /** 아레나에서 고른 진영 — 방패면 흰 톤 */
  focusSide: Side;
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

function topOpinionForSide(opinions: Opinion[], side: Side): Opinion | null {
  const list = opinions.filter((o) => o.side === side);
  if (list.length === 0) return null;
  return [...list].sort((a, b) => b.likes - a.likes)[0] ?? null;
}

function HeartMark({ className = "text-muted" }: { className?: string }) {
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

/** 스크롤 아래: Top 하이라이트 + 피드 (첫 화면에는 없음) */
export function OpinionFeed({
  opinions,
  activeTab,
  onTabChange,
  focusSide,
}: OpinionFeedProps) {
  const light = focusSide === "AEGIS";
  const top = useMemo(
    () => topOpinionForSide(opinions, focusSide),
    [opinions, focusSide],
  );
  const visible = filterOpinions(opinions, activeTab);

  return (
    <section
      className={`mx-auto max-w-[560px] border-t ${
        light
          ? "border-black/10 bg-white text-black"
          : "border-white/12 bg-black text-white"
      }`}
      aria-label="의견 피드"
    >
      <div className="px-4 py-3">
        <p
          className={`mb-2 text-[10px] font-bold tracking-[0.18em] ${
            light ? "text-neutral-500" : "text-muted"
          }`}
        >
          {focusSide === "NEXUS" ? "창 · TOP 의견" : "방패 · TOP 의견"}
        </p>
        {top ? (
          <article
            className={`border px-3 py-3 ${
              light
                ? "border-black/20 bg-neutral-50"
                : "border-white/20 bg-white/[0.02]"
            }`}
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className={`text-[10px] font-bold tracking-[0.16em] ${
                  light ? "text-neutral-500" : "text-muted"
                }`}
              >
                TOP
              </span>
              <SideBadge side={top.side} />
              <span
                className={`truncate text-[13px] font-semibold ${
                  light ? "text-black" : "text-white"
                }`}
              >
                @{top.author}
              </span>
              <span
                className={`ml-auto inline-flex items-center gap-1 text-[11px] tabular-nums ${
                  light ? "text-neutral-500" : "text-muted"
                }`}
              >
                <HeartMark className={light ? "text-neutral-500" : "text-muted"} />
                {top.likes}
              </span>
            </div>
            <p
              className={`text-[14px] leading-[1.45] ${
                light ? "text-black/90" : "text-white/95"
              }`}
            >
              “{top.text}”
            </p>
          </article>
        ) : (
          <p
            className={`py-4 text-center text-sm ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            이 진영의 인기 의견이 아직 없습니다.
          </p>
        )}
      </div>

      <div
        className={`flex border-y ${
          light
            ? "sticky top-[124px] z-30 border-black/10 bg-white/95"
            : "sticky top-[124px] z-30 border-white/12 bg-black/90"
        } backdrop-blur-md`}
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
              className={`flex min-h-10 flex-1 items-center justify-center gap-1 px-1 text-[12px] font-semibold tracking-wide transition-colors ${
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

      <ul>
        {visible.length === 0 ? (
          <li
            className={`px-4 py-12 text-center text-sm ${
              light ? "text-neutral-500" : "text-muted"
            }`}
          >
            이 탭에 표시할 진술이 없습니다.
          </li>
        ) : (
          visible.map((op, index) => (
            <li
              key={op.id}
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
          ))
        )}
      </ul>
    </section>
  );
}
