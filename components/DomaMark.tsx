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
 * 삼각이 원을 가리는 구간: 마스크로 원 선 제거
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

  // 삼각 path (원과 겹침)
  const tri = "M6 18h28L20 48Z";

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
        {/* 흰색=보임, 검정=가림 — 삼각 영역에서 원 숨김 */}
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="40"
          height="56"
        >
          <rect width="40" height="56" fill="#ffffff" />
          <path d={tri} fill="#000000" />
        </mask>
      </defs>

      {/* 원 — 삼각과 겹친 선은 마스크로 제거 */}
      <circle
        cx="20"
        cy="44"
        r="10"
        stroke={stroke}
        strokeWidth="1.7"
        mask={`url(#${maskId})`}
      />
      {/* 아래 향 삼각 */}
      <path
        d={tri}
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="miter"
      />
      {/* 직사각 */}
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
