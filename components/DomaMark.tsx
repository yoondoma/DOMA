"use client";

type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * 사각+삼각+원 = 하나의 마크 (preferred 비율).
 * - 사각·삼각: 단일 외곽 (seam 가로선 없음 → 이중 선/떠 있는 밑변 금지)
 * - tip이 원 상단에 밀착·살짝 진입, 가려진 원 호는 그리지 않음
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
  /** tip ≈ 원 상단 + 살짝 진입 */
  const tipY = 46.5;

  /** 사각 좌·우 → 삼각 빗변으로 이어지는 단일 외곽 (내부 seam 선 없음) */
  const body = `M15.75 1H32.25V${seamY}H42L24 ${tipY}L6 ${seamY}H15.75Z`;

  /**
   * 원: 하단을 경유하는 두 호 — tip 아래 상단은 그리지 않음
   * 끝점 = tipY=46.5 기준 교차 근처
   */
  const ellipseOpen =
    "M23.37 44.51A20.5 12 0 0 1 24 68.5A20.5 12 0 0 1 24.63 44.51";

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
      <path d={body} fill={bg} stroke="none" />
      <path
        d={body}
        fill="none"
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  );
}
