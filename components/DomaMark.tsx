"use client";

type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * 사각 + 삼각 + 원 = 하나의 마크.
 * - 사각 밑변 ↔ 삼각 윗변: 같은 seamY에서 맞닿아 합체 (사각은 아래 선 없음)
 * - 삼각 tip ↔ 원 상단: 살짝 겹침, 가려진 원 선만 끊음
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const bg = light ? "#ffffff" : "#000000";
  const width = Math.round(size * (48 / 72));

  /** 사각·삼각 공유 접합선 */
  const seamY = 23;
  /** 타원 상단 44.5 · tip 45.6 → overlap 1.1 (gap=0) */
  const ellipseTop = 44.5;
  const tipY = 45.6;

  const tri = `M6 ${seamY}h36L24 ${tipY}Z`;
  /** 사각: 좌·상·우만 — 밑변은 삼각 윗변이 담당 */
  const rectOpen = `M15.75 ${seamY}V1h16.5V${seamY}`;
  /**
   * 원: tip 아래 가려진 상단만 절단 (−94°~−86° 근처)
   * 끝점은 삼각 안쪽 → 붙인 채 가려진 선만 제거
   */
  const ellipseOpen = "M22.55 44.51 A20.5 12 0 1 0 25.45 44.51";

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

      {/* 삼각 — 윗변이 사각과의 합체 선 */}
      <path d={tri} fill={bg} stroke="none" />
      <path
        d={tri}
        fill="none"
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinejoin="miter"
      />

      {/* 사각 — 열린 아래, seam에서 삼각과 합체 */}
      <path
        d={rectOpen}
        fill="none"
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  );
}
