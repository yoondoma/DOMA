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
 * 직사각 → 하향 삼각 → 타원. 삼각이 위 레이어.
 * 겹침 구간의 원 스트로크는 마스크로 제거(삼각 아래로 비치지 않음).
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const bg = light ? "#ffffff" : "#000000";
  const uid = useId().replace(/:/g, "");
  const maskId = `doma-mark-mask-${uid}`;
  const width = Math.round(size * (48 / 72));

  // tip y≈52 · ellipse top≈44.5 — 팁이 원 안으로
  const tri = "M6 23.2h36L24 52Z";
  // 스트로크 두께까지 덮도록 마스크를 넉넉히 (원이 삼각 위로 비치지 않게)
  const triMask = "M1.5 19.5h45L24 59.5Z";

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

      {/* 1) 원 — 삼각 영역은 마스크로 스트로크 제거 */}
      <ellipse
        cx="24"
        cy="56.5"
        rx="20.5"
        ry="12"
        stroke={stroke}
        strokeWidth="1.45"
        mask={`url(#${maskId})`}
      />

      {/* 2) 삼각 위 레이어 — 내부를 bg로 채워 잔여 원 선 차단 후 스트로크 */}
      <path d={tri} fill={bg} stroke="none" />
      <path
        d={tri}
        fill="none"
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
