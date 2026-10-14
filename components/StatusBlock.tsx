"use client";

type StatusKind = "empty" | "loading" | "error";

type StatusBlockProps = {
  kind: StatusKind;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  /** 방어자(흰 배경) 등 — 검정 글자 */
  light?: boolean;
};

/** Pure B&W · 카드 없이 짧은 상태 문구 + 선택 액션 */
export function StatusBlock({
  kind,
  message,
  actionLabel,
  onAction,
  className = "",
  light = false,
}: StatusBlockProps) {
  const body = light ? "text-black/70" : "text-white/75";
  const load = light ? "text-neutral-500" : "text-muted";
  const action = light
    ? "border-black/35 text-black active:bg-black/5"
    : "border-white/35 text-white active:bg-white/10";

  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}
      role={kind === "error" ? "alert" : "status"}
      aria-live="polite"
      data-status={kind}
    >
      {kind === "loading" ? (
        <p className={`text-[13px] tracking-[0.06em] ${load}`}>
          <span className="status-pulse inline-block">{message}</span>
        </p>
      ) : (
        <p className={`max-w-[20rem] text-[14px] leading-[1.55] ${body}`}>
          {message}
        </p>
      )}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={`mt-5 border px-4 py-2 text-[12px] font-medium tracking-[0.1em] ${action}`}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
