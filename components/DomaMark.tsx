"use client";

type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * preferred 마크: 사각·삼각·원 = 한 심볼
 * - 삼각 윗변(seam) 한 줄 + 사각은 밑변 없이 그 위에 앉음 (이중 선 없음)
 * - tip이 원 상단에 살짝 진입, 가려진 원 호는 그리지 않음
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
  const tipY = 46.5;

  /** 삼각 전체(윗변=seam 포함) */
  const tri = `M6 ${seamY}H42L24 ${tipY}Z`;
  /** 사각: 좌·상·우만 — 밑변은 seam이 담당 */
  const rect = `M15.75 ${seamY}V1H32.25V${seamY}`;
  /** tip 아래 상단 호 제외 · 하단 경유 */
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
