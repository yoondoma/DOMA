"use client";

type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
  /**
   * 입장 게이트 — 사각+삼각(창)이 원(방패)을 살짝 찌르는 한 동작.
   * 호 가림 규칙 유지: 삼각 fill이 원 위, tip 밑 호 없음.
   */
  pierce?: boolean;
};

/**
 * preferred 한 심볼:
 * - 사각 밑변 없음 + 삼각 윗변(seam) 한 줄
 * - tip이 원 안쪽으로 진입, 원 호는 삼각 빗변 교차점에서만 시작 (tip 밑 통과 금지)
 * - 원을 살짝 키워 존재감, tip은 과겹침 없이 한 단계 더 밀착
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
  pierce = false,
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const bg = light ? "#ffffff" : "#000000";
  const width = Math.round(size * (48 / 72));

  const seamY = 23;
  /** 타원: rx 22 · ry 13.2 · cy 56.8 → top ≈ 43.6 */
  const ellipseTop = 43.6;
  /** tip을 원에 한 단계 더 넣음 */
  const tipY = 51.8;

  const tri = `M6 ${seamY}H42L24 ${tipY}Z`;
  const rect = `M15.75 ${seamY}V1H32.25V${seamY}`;
  /**
   * tipY=51.8 · 교차 ≈ (19.38,43.93)-(28.62,43.93)
   * 끝점 살짝 안쪽 → tip 밑 호 미작성
   */
  const ellipseOpen = "M19.7 44A22 13.2 0 1 0 28.3 44";

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 48 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${pierce ? "mark-pierce" : ""} ${className}`}
      aria-hidden
      data-mark-seam={seamY}
      data-mark-tip={tipY}
      data-mark-ellipse-top={ellipseTop}
      data-mark-overlap={+(tipY - ellipseTop).toFixed(2)}
      data-mark-pierce={pierce ? "1" : undefined}
    >
      {/* 원(방패/방어) — 삼각 아래에서 press */}
      <g className="mark-pierce-shield">
        <path
          d={ellipseOpen}
          stroke={stroke}
          strokeWidth="1.45"
          strokeLinecap="butt"
          fill="none"
        />
      </g>
      {/* 사각+삼각(창) — tip이 원 안으로 더 들어감 · fill로 교차 호 가림 */}
      <g className="mark-pierce-spear">
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
      </g>
    </svg>
  );
}
