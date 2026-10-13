import type { Side } from "@/lib/types";

type MarkProps = {
  className?: string;
  size?: number;
};

/** NEXUS — 창 (라인 아이콘) */
export function SpearMark({ className = "", size = 14 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      {/* tip */}
      <path
        d="M8 1.4 5.8 5.2h4.4L8 1.4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="miter"
      />
      {/* shaft */}
      <path
        d="M8 5.2v9.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      {/* collar */}
      <path
        d="M5.5 5.8h5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** @deprecated 검 → 창으로 교체. SpearMark 사용 */
export const SwordMark = SpearMark;

/** AEGIS — 방패 (라인 아이콘) */
export function ShieldMark({ className = "", size = 14 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <path
        d="M8 1.75 13.25 4v3.6c0 3.15-2.2 5.55-5.25 6.65C4.95 13.15 2.75 10.75 2.75 7.6V4L8 1.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
      <path
        d="M8 5.1v5.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export const SIDE_META: Record<
  Side,
  { label: string; Mark: typeof SpearMark }
> = {
  NEXUS: { label: "창", Mark: SpearMark },
  AEGIS: { label: "방패", Mark: ShieldMark },
};

/** 피드 뱃지 — 창/방패 심볼 위주 */
export function SideBadge({ side }: { side: Side }) {
  const { label, Mark } = SIDE_META[side];
  const isNexus = side === "NEXUS";
  return (
    <span
      className={`inline-flex items-center justify-center p-0.5 ${
        isNexus
          ? "border border-white/80 text-white"
          : "bg-white text-black"
      }`}
      title={side}
      aria-label={`${side} ${label}`}
    >
      <Mark size={12} />
    </span>
  );
}
