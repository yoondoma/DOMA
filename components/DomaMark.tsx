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
 * 균형 마크: 직사각 → (짧은 간격) → 하향 삼각 → 타원
 * 삼각이 타원을 가려 겹침 선이 보이지 않음
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const uid = useId().replace(/:/g, "");
  const maskId = `doma-mark-mask-${uid}`;
  // viewBox 48×68 — 직사각·삼각·타원 무게 균형
  const width = Math.round(size * (48 / 68));

  // 삼각 본체 / 마스크(삼각보다 살짝 넓어 타원 겹침 선 제거)
  const tri = "M9 21h30L24 54Z";
  const triMask = "M7.2 19.6h33.6L24 56.4Z";

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 48 68"
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
          height="68"
        >
          <rect width="48" height="68" fill="#ffffff" />
          <path d={triMask} fill="#000000" />
        </mask>
      </defs>

      {/* 타원 — 삼각 밑과 폭·무게 맞춤 */}
      <ellipse
        cx="24"
        cy="55"
        rx="15.5"
        ry="9.5"
        stroke={stroke}
        strokeWidth="1.5"
        mask={`url(#${maskId})`}
      />
      {/* 하향 삼각 */}
      <path
        d={tri}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
      {/* 직사각 — 삼각과 짧은 간격, 과도하게 길지 않게 */}
      <rect
        x="18.25"
        y="2.5"
        width="11.5"
        height="15"
        stroke={stroke}
        strokeWidth="1.5"
      />
    </svg>
  );
}
