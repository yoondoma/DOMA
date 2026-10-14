"use client";

type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * 삼각이 위 레이어.
 * 원은 삼각과 겹치는 상단 호를 패스에서 끊음 → 가려지는 구간 스트로크 0.
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const bg = light ? "#ffffff" : "#000000";
  const width = Math.round(size * (48 / 72));

  const tri = "M6 23.2h36L24 52Z";

  /**
   * 타원 cx=24 cy=56.5 rx=20.5 ry=12
   * 교차 ≈ (-103°, -77°)보다 넓게 끊음 — 스트로크 두께가
   * 삼각 안으로 번지지 않게 (-125° ~ -55°).
   */
  const ellipseOpen =
    "M12.24 46.64 A20.5 12 0 1 0 35.76 46.64";

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
      {/* 원 — 상단 겹침 구간은 패스에 없음 */}
      <path
        d={ellipseOpen}
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinecap="butt"
        fill="none"
      />

      {/* 삼각 위 레이어 */}
      <path d={tri} fill={bg} stroke="none" />
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
      <path d="M14.5 21h19v4.5h-19Z" fill={bg} />
      <path
        d="M6 23.2h36"
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinecap="square"
      />
    </svg>
  );
}
