"use client";

type FeedSkeletonProps = {
  count?: number;
  className?: string;
};

/** 로딩 — 회색 스켈레톤 카드열 */
export function FeedSkeleton({ count = 3, className = "" }: FeedSkeletonProps) {
  return (
    <div
      className={`feed-list ${className}`}
      role="status"
      aria-live="polite"
      aria-label="불러오는 중"
      data-skeleton
      data-status="loading"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="post-card pointer-events-none" aria-hidden>
          <div className="flex gap-3">
            <div className="skeleton-block size-9 shrink-0 rounded-[8px]" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="skeleton-block h-3 w-28" />
              <div className="skeleton-block h-3 w-full" />
              <div className="skeleton-block h-3 w-[88%]" />
              <div className="skeleton-block h-3 w-[62%]" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">불러오는 중</span>
    </div>
  );
}
