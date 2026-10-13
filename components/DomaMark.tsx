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
 * doma-logo-preferred.png 실측 비율
 * 직사각(좁고 중간 키) → 짧은 간격 → 하향 삼각(높이≈밑변×0.67) → 타원(삼각보다 살짝 넓음)
 * 삼각 팁이 타원 상단을 가려 겹침 선 없음
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const uid = useId().replace(/:/g, "");
  const maskId = `doma-mark-mask-${uid}`;
  // viewBox 48×72 — preferred 마크 박스에 맞춤
  const width = Math.round(size * (48 / 72));

  // preferred: rect≈16.5×22.3 · gap≈0.7 · tri base≈36 h≈24 · ellipse rx≈20.5 ry≈12
  const tri = "M6 23.2h36L24 47Z";
  const triMask = "M4.5 21.8h39L24 49.2Z";

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

      <ellipse
        cx="24"
        cy="58.5"
        rx="20.5"
        ry="12"
        stroke={stroke}
        strokeWidth="1.45"
        mask={`url(#${maskId})`}
      />
      <path
        d={tri}
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinejoin="miter"
      />
      <rect
        x="15.75"
        y="1"
        width="16.5"
        height="22"
        stroke={stroke}
        strokeWidth="1.45"
      />
    </svg>
  );
}
