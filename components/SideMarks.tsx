import type { Side } from "@/lib/types";

type MarkProps = {
  className?: string;
  size?: number;
};

/** NEXUS — 검 / 공격 / 검사 */
export function SwordMark({ className = "", size = 14 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M14.5 3.5 20.5 9.5 12 18l-2.2-.3L9.5 15.5 3.5 9.5l1.8-1.8L11 13.4 14.5 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 15.8 5 20.5M15.8 8.2 20.5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** AEGIS — 방패 / 방어 / 변호 */
export function ShieldMark({ className = "", size = 14 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M12 3.5 19 6.5v5.2c0 4.4-2.9 7.6-7 9.3-4.1-1.7-7-4.9-7-9.3V6.5L12 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M12 8v7.5M9.2 11.2h5.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
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
