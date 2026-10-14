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

/** 볼드·라운드 스트로크 (viewBox 48×72 기준) */
const STROKE = 2.35;

/**
 * preferred 한 심볼:
 * - 사각 밑변 없음 + 삼각 윗변(seam) 한 줄
 * - tip이 원 안쪽으로 진입, 원 호는 삼각 빗변 교차점에서만 시작
 * - 선 두껍게·볼드 + stroke join/cap 라운드로 살짝 부드러운 맛
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
  /** 사각 — 윗모서리만 살짝 라운드 (형태 유지) */
  const rect = `M15.75 ${seamY}V4.2Q15.75 1 18.95 1H29.05Q32.25 1 32.25 4.2V${seamY}`;
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
      data-mark-bold="1"
    >
      {/* 원(방패/방어) — 삼각 아래에서 press */}
      <g className="mark-pierce-shield">
        <path
          d={ellipseOpen}
          stroke={stroke}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* 사각+삼각(창) — tip이 원 안으로 · fill로 교차 호 가림 */}
      <g className="mark-pierce-spear">
        <path d={tri} fill={bg} stroke="none" />
        <path
          d={tri}
          fill="none"
          stroke={stroke}
          strokeWidth={STROKE}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={rect}
          fill="none"
          stroke={stroke}
          strokeWidth={STROKE}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
