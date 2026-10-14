"use client";

type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * preferred 마크 — 한 심볼
 * - 삼각 윗변(seam) 한 줄 + 사각은 밑변 없이 안착
 * - tip이 원 상단 스트로크에 밀착(살짝 진입). 가려진 호만 미표기
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const bg = light ? "#ffffff" : "#000000";
  const width = Math.round(size * (48 / 72));

  const seamY = 23;
  /** 타원 상단 */
  const ellipseTop = 44.5;
  /**
   * tip을 원 상단 선에 맞춤(+스트로크 반 정도 진입).
   * tip을 깊게 넣으면 속이 빈 간격처럼 보임 → 테두리에 안착.
   */
  const tipY = 45.3;

  const tri = `M6 ${seamY}H42L24 ${tipY}Z`;
  const rect = `M15.75 ${seamY}V1H32.25V${seamY}`;
  /** tip 폭만큼만 상단 절단 · 하단 경유 */
  const ellipseOpen =
    "M22.9 44.5A20.5 12 0 0 1 24 68.5A20.5 12 0 0 1 25.1 44.5";

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 48 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden
      data-mark-seam={seamY}
      data-mark-tip={tipY}
      data-mark-ellipse-top={ellipseTop}
      data-mark-overlap={+(tipY - ellipseTop).toFixed(2)}
    >
      <path
        d={ellipseOpen}
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinecap="butt"
        fill="none"
      />
      <path d={tri} fill={bg} stroke="none" />
      <path
        d={tri}
        fill="none"
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinejoin="miter"
      />
      <path
        d={rect}
        fill="none"
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  );
}
