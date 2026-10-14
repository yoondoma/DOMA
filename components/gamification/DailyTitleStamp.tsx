import { GirdleMark } from "@/components/SideMarks";
import type { DailyTitle } from "@/lib/types/gamification";

type DailyTitleStampProps = {
  badge: DailyTitle;
  className?: string;
};

/**
 * 일일 핫토픽 칭호 스탬프 — Pure B&W
 * 예: "10.24의 도마의 손가락", "10.14의 제안자"
 */
export function DailyTitleStamp({
  badge,
  className = "",
}: DailyTitleStampProps) {
  const isProposer = badge.type === "PROPOSER";
  return (
    <span
      className={[
        "inline-flex max-w-full items-center gap-1.5 border border-dashed border-neutral-200",
        "bg-black px-2 py-1 text-[10px] font-semibold tracking-[0.06em] text-white",
        className,
      ].join(" ")}
      title={badge.label}
      aria-label={`일일 칭호 ${badge.label}`}
      data-title-type={badge.type}
    >
      {isProposer ? <GirdleMark size={11} className="text-white" /> : null}
      <span className="truncate">{badge.label}</span>
    </span>
  );
}
