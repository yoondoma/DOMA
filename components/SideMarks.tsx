import type { Side } from "@/lib/types";

type MarkProps = {
  className?: string;
  size?: number;
};

/** NEXUS — 검 (라인 아이콘, 이모지 아님) */
export function SwordMark({ className = "", size = 14 }: MarkProps) {
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
      {/* blade */}
      <path
        d="M8 1.5v9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      {/* tip */}
      <path
        d="M8 1.5 6.2 3.4M8 1.5l1.8 1.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      {/* crossguard */}
      <path
        d="M4.5 10.5h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      {/* grip + pommel */}
      <path
        d="M8 10.5v3.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M6.5 14.2h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** AEGIS — 방패 (라인 아이콘, 이모지 아님) */
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
  { role: string; Mark: typeof SwordMark }
> = {
  NEXUS: { role: "공격", Mark: SwordMark },
  AEGIS: { role: "방어", Mark: ShieldMark },
};

export function SideBadge({ side }: { side: Side }) {
  const { role, Mark } = SIDE_META[side];
  const isNexus = side === "NEXUS";
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1 py-px text-[10px] font-bold tracking-[0.08em] ${
        isNexus
          ? "border border-white/80 text-white"
          : "bg-white text-black"
      }`}
      title={`${side} · ${role}`}
    >
      <Mark size={11} />
      <span>{side}</span>
    </span>
  );
}
