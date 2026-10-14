"use client";

import { useMemo, useState } from "react";
import { AdSlot } from "@/components/AdSlot";
import { StatusBlock } from "@/components/StatusBlock";
import {
  SEARCH_KIND_LABEL,
  searchAll,
  type SearchKind,
} from "@/lib/search-mock";
import type { UiDemo } from "@/lib/ui-demo";

type SearchSheetProps = {
  open: boolean;
  onClose: () => void;
  uiDemo?: UiDemo;
  onRetry?: () => void;
};

const FILTERS: Array<SearchKind | "all"> = [
  "all",
  "user",
  "keyword",
  "topic",
];

export function SearchSheet({
  open,
  onClose,
  uiDemo = "normal",
  onRetry,
}: SearchSheetProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SearchKind | "all">("all");

  const results = useMemo(() => {
    if (uiDemo === "empty") return [];
    const list = searchAll(query);
    if (filter === "all") return list;
    return list.filter((item) => item.kind === filter);
  }, [query, filter, uiDemo]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 sm:items-center"
      role="dialog"
      aria-modal
      aria-label="검색"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="sheet-up relative z-10 flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden border border-white/15 bg-black text-white sm:max-h-[85dvh]">
        <div className="flex items-center gap-2 border-b border-white/15 px-3 py-3">
          <p className="text-[12px] font-bold tracking-[0.18em]">검색</p>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-[13px] text-muted"
            aria-label="닫기"
          >
            닫기
          </button>
        </div>

        <div className="border-b border-white/12 px-3 py-3">
          <label className="sr-only" htmlFor="doma-search">
            검색어
          </label>
          <input
            id="doma-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이용자 · 키워드 · 전투 주제"
            autoFocus
            className="w-full border border-white/25 bg-black px-3 py-2.5 text-[14px] text-white outline-none placeholder:text-neutral-500 focus:border-white/50"
          />
          <div className="mt-2.5 flex flex-wrap gap-1.5" role="tablist">
            {FILTERS.map((f) => {
              const label = f === "all" ? "전체" : SEARCH_KIND_LABEL[f];
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 text-[11px] tracking-[0.08em] ${
                    active
                      ? "bg-white text-black"
                      : "border border-white/20 text-muted"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <AdSlot id="discover_row" />

        {uiDemo === "loading" ? (
          <StatusBlock kind="loading" message="불러오는 중" />
        ) : uiDemo === "error" ? (
          <StatusBlock
            kind="error"
            message="검색 결과를 불러오지 못했습니다."
            actionLabel="다시 시도"
            onAction={onRetry}
          />
        ) : (
          <ul className="overflow-y-auto" aria-label="검색 결과">
            {results.length === 0 ? (
              <li>
                <StatusBlock
                  kind="empty"
                  message={
                    query.trim()
                      ? "검색 결과가 없습니다."
                      : "검색어를 입력해 보세요."
                  }
                />
              </li>
            ) : (
              results.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-white/10 px-4 py-3"
                >
                  <p className="text-[10px] font-bold tracking-[0.14em] text-muted">
                    {SEARCH_KIND_LABEL[item.kind]}
                  </p>
                  <p className="mt-1 text-[14px] font-semibold leading-snug">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted">
                    {item.subtitle}
                  </p>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
