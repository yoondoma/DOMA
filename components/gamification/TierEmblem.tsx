import type { ReactNode } from "react";
import type { TierCode } from "@/lib/types/gamification";
import { TIER_CODES } from "@/lib/types/gamification";

type TierEmblemProps = {
  tier: TierCode;
  size?: number;
  className?: string;
};

/**
 * 티어 기하 문양 — 선·대비만 · glow/네온 없음.
 * ARCHITECT → I–IV → BRONZE (밀도가 권력감).
 */
export function TierEmblem({
  tier,
  size = 18,
  className = "",
}: TierEmblemProps) {
  const stroke = "currentColor";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    "aria-hidden": true as const,
    className,
  };

  switch (tier) {
    case "ARCHITECT":
      return (
        <svg {...common}>
          <path
            d="M12 2.5 21 8.2v7.6L12 21.5 3 15.8V8.2L12 2.5Z"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinejoin="miter"
          />
          <path
            d="M12 6.2 17.2 9.3v5.4L12 17.8 6.8 14.7V9.3L12 6.2Z"
            stroke={stroke}
            strokeWidth="1.35"
            strokeLinejoin="miter"
          />
          <path d="M12 9.5v5M9.5 12h5" stroke={stroke} strokeWidth="1.35" />
        </svg>
      );
    case "I":
      return (
        <svg {...common}>
          <path
            d="M12 3.2 20.2 12 12 20.8 3.8 12 12 3.2Z"
            stroke={stroke}
            strokeWidth="1.7"
            strokeLinejoin="miter"
          />
          <path
            d="M12 7.2 16.5 12 12 16.8 7.5 12 12 7.2Z"
            stroke={stroke}
            strokeWidth="1.35"
          />
        </svg>
      );
    case "II":
      return (
        <svg {...common}>
          <path
            d="M12 3.5 19.2 7.7v8.6L12 20.5 4.8 16.3V7.7L12 3.5Z"
            stroke={stroke}
            strokeWidth="1.55"
            strokeLinejoin="miter"
          />
          <path d="M12 8v8M8.8 12h6.4" stroke={stroke} strokeWidth="1.35" />
        </svg>
      );
    case "III":
      return (
        <svg {...common}>
          <rect
            x="4.2"
            y="4.2"
            width="15.6"
            height="15.6"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <rect
            x="7.2"
            y="7.2"
            width="9.6"
            height="9.6"
            stroke={stroke}
            strokeWidth="1.25"
          />
        </svg>
      );
    case "IV":
      return (
        <svg {...common}>
          <rect
            x="5"
            y="5"
            width="14"
            height="14"
            stroke={stroke}
            strokeWidth="1.4"
          />
          <path d="M12 8.2v7.6" stroke={stroke} strokeWidth="1.35" />
        </svg>
      );
    case "BRONZE":
    default:
      return (
        <svg {...common}>
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            stroke={stroke}
            strokeWidth="1.25"
          />
        </svg>
      );
  }
}

type TierAvatarFrameProps = {
  tier: TierCode;
  children: ReactNode;
  className?: string;
  sizeClass?: string;
};

/**
 * 아바타 테두리 — 티어별 선 굵기·이중 링·각진 프레임.
 * 후광/글로우 대신 구조적 존재감.
 */
export function TierAvatarFrame({
  tier,
  children,
  className = "",
  sizeClass = "size-14",
}: TierAvatarFrameProps) {
  const rank = TIER_CODES.indexOf(tier);
  const high = rank >= TIER_CODES.indexOf("II");
  const top = rank >= TIER_CODES.indexOf("I");

  const frame =
    tier === "ARCHITECT"
      ? "border-[3px] border-white ring-2 ring-inset ring-black"
      : top
        ? "border-2 border-white ring-1 ring-white/80"
        : high
          ? "border-2 border-neutral-200"
          : tier === "IV"
            ? "border border-neutral-300"
            : "border border-neutral-500";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${sizeClass} ${frame} ${className}`}
      data-tier-frame={tier}
      aria-hidden
    >
      <span className="pointer-events-none absolute -right-1 -top-1 text-white">
        <TierEmblem tier={tier} size={12} />
      </span>
      {children}
    </div>
  );
}
