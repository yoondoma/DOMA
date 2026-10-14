"use client";

type StatusKind = "empty" | "loading" | "error";

type StatusBlockProps = {
  kind: StatusKind;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

/** Pure B&W · 카드 없이 짧은 상태 문구 + 선택 액션 */
export function StatusBlock({
  kind,
  message,
  actionLabel,
  onAction,
  className = "",
}: StatusBlockProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}
      role={kind === "error" ? "alert" : "status"}
      aria-live="polite"
      data-status={kind}
    >
      {kind === "loading" ? (
        <p className="text-[13px] tracking-[0.06em] text-muted">
          <span className="status-pulse inline-block">{message}</span>
        </p>
      ) : (
        <p className="max-w-[20rem] text-[14px] leading-[1.55] text-white/75">
          {message}
        </p>
      )}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 border border-white/35 px-4 py-2 text-[12px] font-medium tracking-[0.1em] text-white active:bg-white/10"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
