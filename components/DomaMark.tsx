"use client";

type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * preferred 한 심볼:
 * - 사각 밑변 없음 + 삼각 윗변(seam) 한 줄
 * - tip이 원 안쪽으로 진입, 원 호는 삼각 빗변 교차점에서만 시작 (tip 밑 통과 금지)
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
  const ellipseTop = 44.5;
  /** tip을 원에 미묘하게만 더 넣음 (과겹침 금지) */
  const tipY = 50.8;

  /** 삼각 닫힘: 윗변(seam) 한 줄 + 빗변. 사각 밑변은 그리지 않음 */
  const tri = `M6 ${seamY}H42L24 ${tipY}Z`;
  /** 열린 ㄷ: 좌·우·윗변만 — 끝점이 seam에 butt로 닿아 이중 밑변 없음 */
  const rect = `M15.75 ${seamY}V1H32.25V${seamY}`;
  /**
   * tipY=50.8 교차 ≈ (20.07,44.72)-(27.93,44.72)
   * 끝점 살짝 안쪽 → tip 밑 호 미작성, 삼각이 원 위 레이어
   */
  const ellipseOpen = "M20.35 44.75A20.5 12 0 1 0 27.65 44.75";

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
        strokeLinecap="butt"
      />
    </svg>
  );
}
