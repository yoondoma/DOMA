"use client";

type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * doma-logo-preferred 비율.
 * 삼각이 위 레이어 — 원과 겹치는 구간의 원 스트로크는
 * 확장 삼각으로 지운 뒤 삼각 스트로크를 올린다.
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const bg = light ? "#ffffff" : "#000000";
  const width = Math.round(size * (48 / 72));

  // tip y≈52 · ellipse top≈44.5
  const tri = "M6 23.2h36L24 52Z";
  // 원 스트로크(1.45)까지 덮는 지우개 — 삼각보다 크게
  const triErase = "M2 20.2h44L24 57.2Z";
  // 사각 하단이 삼각에 가려지도록
  const rectErase = "M14.2 20.4h19.6v5.2H14.2Z";

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
      {/* 원 전체 */}
      <ellipse
        cx="24"
        cy="56.5"
        rx="20.5"
        ry="12"
        stroke={stroke}
        strokeWidth="1.45"
      />

      {/* 겹침 구간의 원·사각 선을 배경색으로 지움 */}
      <path d={triErase} fill={bg} stroke="none" />
      <path d={rectErase} fill={bg} stroke="none" />

      {/* 삼각 위 레이어 */}
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
