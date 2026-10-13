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
 * 선호 비율 세로 마크: 직사각 → (간격) → 하향 삼각 → 타원
 * 삼각이 타원을 가려 겹침 선 없음
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const uid = useId().replace(/:/g, "");
  const maskId = `doma-mark-mask-${uid}`;
  // viewBox 48×72 — 세로로 긴 마크
  const width = Math.round(size * (48 / 72));

  const tri = "M8 24h32L24 58Z";
  const triMask = "M6 22.5h36L24 60.5Z";

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 48 72"
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
          width="48"
          height="72"
        >
          <rect width="48" height="72" fill="#ffffff" />
          <path d={triMask} fill="#000000" />
        </mask>
      </defs>

      {/* 타원(방패) — 삼각 겹침 구간 선 제거 */}
      <ellipse
        cx="24"
        cy="58"
        rx="16"
        ry="10"
        stroke={stroke}
        strokeWidth="1.55"
        mask={`url(#${maskId})`}
      />
      {/* 하향 삼각 */}
      <path
        d={tri}
        stroke={stroke}
        strokeWidth="1.55"
        strokeLinejoin="miter"
      />
      {/* 직사각 — 삼각과 간격 */}
      <rect
        x="18.5"
        y="2"
        width="11"
        height="18"
        stroke={stroke}
        strokeWidth="1.55"
      />
    </svg>
  );
}
