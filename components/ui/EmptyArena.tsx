"use client";

type EmptyArenaProps = {
  message?: string;
  /** @deprecated 카피 「터치하여 증명」 자체가 CTA — 별도 라벨 쓰지 않음 */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

/** Empty — 모노크롬 그래픽 + 「터치하여 증명」만 (탭하면 작성) */
export function EmptyArena({
  message = "터치하여 증명",
  onAction,
  className = "",
}: EmptyArenaProps) {
  const graphic = (
    <>
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
      <p className="max-w-[18rem] font-[family-name:var(--font-display)] text-[18px] leading-snug tracking-[-0.02em] text-paper/85">
        {message}
      </p>
    </>
  );

  const shell =
    `flex flex-col items-center justify-center px-6 py-16 text-center ${className}`;

  if (onAction) {
    return (
      <button
        type="button"
        onClick={onAction}
        className={`thumb-press ${shell}`}
        aria-label={message}
        data-status="empty"
        data-empty-arena
        data-empty-cta
      >
        {graphic}
      </button>
    );
  }

  return (
    <div
      className={shell}
      role="status"
      aria-live="polite"
      data-status="empty"
      data-empty-arena
    >
      {graphic}
    </div>
  );
}
