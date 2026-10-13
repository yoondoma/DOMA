"use client";

import { useId } from "react";

type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * 세로 스케치 로고: 직사각 → 아래 향 삼각 → 원
 * 삼각이 원을 가리는 구간: 마스크로 원 선 완전 제거
 */
export function DomaMark({
  size = 40,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const uid = useId().replace(/:/g, "");
  const maskId = `doma-mark-mask-${uid}`;
  const width = Math.round(size * (40 / 56));

  const tri = "M6 18h28L20 48Z";
  // 마스크용: 스트로크 두께까지 덮도록 살짝 확대
  const triMask = "M4.5 17h31L20 50Z";

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 40 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="40"
          height="56"
        >
          <rect width="40" height="56" fill="#ffffff" />
          <path d={triMask} fill="#000000" />
        </mask>
      </defs>

      <circle
        cx="20"
        cy="44"
        r="10"
        stroke={stroke}
        strokeWidth="1.7"
        mask={`url(#${maskId})`}
      />
      <path
        d={tri}
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="miter"
      />
      <rect
        x="14"
        y="2"
        width="12"
        height="16"
        stroke={stroke}
        strokeWidth="1.7"
      />
    </svg>
  );
}
