import type { DailyTitle } from "@/lib/types/gamification";

type DailyTitleStampProps = {
  badge: DailyTitle;
  className?: string;
};

/**
 * 일일 핫토픽 칭호 스탬프 — Pure B&W
 * 예: "10.24의 도마의 손가락"
 */
export function DailyTitleStamp({
  badge,
  className = "",
}: DailyTitleStampProps) {
  return (
    <span
      className={[
        "inline-flex max-w-full items-center border border-dashed border-neutral-200",
        "bg-black px-2 py-1 text-[10px] font-semibold tracking-[0.06em] text-white",
        className,
      ].join(" ")}
      title={badge.label}
      aria-label={`일일 칭호 ${badge.label}`}
      data-title-type={badge.type}
    >
      <span className="truncate">{badge.label}</span>
    </span>
  );
}
