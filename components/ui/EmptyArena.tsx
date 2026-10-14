"use client";

type EmptyArenaProps = {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

/** Empty — 모노크롬 콜로세움 링 + 짧은 안내 */
export function EmptyArena({
  message = "아직 글이 없습니다.",
  actionLabel,
  onAction,
  className = "",
}: EmptyArenaProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}
      role="status"
      aria-live="polite"
      data-status="empty"
      data-empty-arena
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        className="mb-5 text-white/25"
        aria-hidden
      >
        <ellipse
          cx="36"
          cy="38"
          rx="26"
          ry="10"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <ellipse
          cx="36"
          cy="34"
          rx="20"
          ry="7"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.7"
        />
        <path
          d="M14 38 V22 C14 16 22 12 36 12 S58 16 58 22 V38"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M36 12 V8 M28 14 L24 10 M44 14 L48 10"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="36" cy="34" r="2.2" fill="currentColor" opacity="0.55" />
      </svg>
      <p className="max-w-[18rem] font-[family-name:var(--font-display)] text-[17px] leading-snug tracking-[-0.02em] text-paper/80">
        {message}
      </p>
      <p className="mt-2 text-[12px] tracking-[0.08em] text-meta">
        펜은 칼보다 강하다
      </p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="thumb-press r-md mt-6 border border-edge bg-card px-4 py-2.5 text-[12px] font-medium tracking-[0.12em] text-paper"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
