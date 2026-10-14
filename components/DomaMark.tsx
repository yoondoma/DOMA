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
 * 삼각이 위 레이어. 원은 evenodd 클립으로 삼각(확장) 구간 스트로크 0.
 * 그 위 삼각 fill(bg)+stroke로 겹침을 다시 막는다.
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const bg = light ? "#ffffff" : "#000000";
  const uid = useId().replace(/:/g, "");
  const clipId = `doma-ell-clip-${uid}`;
  const width = Math.round(size * (48 / 72));

  const tri = "M6 23.2h36L24 52Z";
  // 스트로크 두께 포함해 원을 잘라낼 구멍
  const triHole = "M0.8 18.8h46.4L24 60.2Z";

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
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          {/* 전체 − 삼각 구멍 → 겹침 구간 원 페인트 0 */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={`M0 0H48V72H0Z ${triHole}`}
          />
        </clipPath>
      </defs>

      <ellipse
        cx="24"
        cy="56.5"
        rx="20.5"
        ry="12"
        stroke={stroke}
        strokeWidth="1.45"
        clipPath={`url(#${clipId})`}
      />

      {/* 삼각 위 레이어: 내부 bg로 잔여 픽셀까지 덮고 스트로크 */}
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
      {/* 사각 하단이 삼각에 가려지게 */}
      <path d="M14.5 21h19v4.5h-19Z" fill={bg} />
      <path
        d="M6 23.2h36"
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinecap="square"
      />
    </svg>
  );
}
