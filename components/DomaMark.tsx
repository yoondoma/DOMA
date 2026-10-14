"use client";

type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * 사각+삼각+원 = 하나의 마크 (doma-logo-preferred 비율).
 * - 사각·삼각: 단일 외곽 패스 + seam 가로선 (이중 선/떠 있는 밑변 없음)
 * - 삼각 tip이 원 안에 살짝 진입, 가려지는 원 호는 패스에서 제외
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
  /** tip이 원 상단(44.5) 안으로 진입 */
  const tipY = 49;

  /**
   * 사각+삼각 단일 외곽:
   * 사각 좌·우 변이 seam에서 삼각 윗변·빗변으로 이어짐 (갭 0)
   */
  const body = `M15.75 1H32.25V${seamY}H42L24 ${tipY}L6 ${seamY}H15.75Z`;
  /** seam 중앙 — 사각 발 사이 가로선 (preferred의 삼각 윗변) */
  const seamBar = `M15.75 ${seamY}H32.25`;

  /**
   * 원: tipY=49 기준 변–타원 교차 구간만 절단
   * (원 선이 tip 밑으로 통과하지 않음)
   */
  const ellipseOpen = "M21.85 44.57 A20.5 12 0 1 0 26.15 44.57";

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
      <path
        d={seamBar}
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinecap="square"
      />
    </svg>
  );
}
