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
 * - 사각·삼각: seamY에서 맞닿아 합체 (사각 밑변 없음 → 삼각 윗변이 공유 선)
 * - 삼각 tip·원: tip이 원 상단을 살짝 침범. 원은 전체 스트로크, 삼각 fill이 가림.
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
  /** 원 상단 44.5 · tip이 더 아래(침범) → 시각적 gap=0 */
  const ellipseTop = 44.5;
  const tipY = 47.2;

  const tri = `M6 ${seamY}h36L24 ${tipY}Z`;
  const rectOpen = `M15.75 ${seamY}V1h16.5V${seamY}`;

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
      <ellipse
        cx="24"
        cy="56.5"
        rx="20.5"
        ry="12"
        stroke={stroke}
        strokeWidth="1.45"
        fill="none"
      />

      {/* tip이 원 상단을 덮음 → 겹친 원 선 제거 */}
      <path d={tri} fill={bg} stroke="none" />
      <path
        d={tri}
        fill="none"
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinejoin="miter"
      />

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
