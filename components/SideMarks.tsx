import type { Side } from "@/lib/types";

type MarkProps = {
  className?: string;
  size?: number;
};

/** NEXUS — 창날+자루 (↑ 화살표로 읽히지 않게) */
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
      {/* 잎형 창날 — 중앙이 넓고 끝이 뾰족 */}
      <path
        d="M8 1.2C8 1.2 5.4 3.6 5.4 5.6c0 1.15.9 1.9 2.6 1.9s2.6-.75 2.6-1.9C10.6 3.6 8 1.2 8 1.2Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      {/* 창날 중앙 선(midrib) */}
      <path
        d="M8 1.6v5.6"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="square"
      />
      {/* 소켓/칼라 */}
      <path
        d="M6.2 7.5h3.6"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="square"
      />
      {/* 자루 */}
      <path
        d="M8 7.5v6.2"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="square"
      />
      {/* 자루 끝 */}
      <path
        d="M6.6 14.2h2.8"
        stroke="currentColor"
        strokeWidth="1.35"
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
