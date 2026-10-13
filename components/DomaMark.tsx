type DomaMarkProps = {
  /** 세로 기준 높이 */
  size?: number;
  /** light 배경 위 → 검정 스트로크, 흰 면으로 원 가림 */
  light?: boolean;
  className?: string;
};

/**
 * 세로 스케치 로고: 직사각 → 아래 향 삼각 → 원
 * 삼각이 원을 가리는 구간에서는 원 선이 안 보이도록 fill로 마스킹
 */
export function DomaMark({
  size = 40,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  const erase = light ? "#ffffff" : "#000000";
  // viewBox 40×56
  const width = Math.round(size * (40 / 56));

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 40 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      {/* 원(방패) — 먼저 그림 */}
      <circle
        cx="20"
        cy="44"
        r="10"
        stroke={stroke}
        strokeWidth="1.7"
      />
      {/* 아래 향 삼각 — 배경색 fill로 겹친 원 선 지움 */}
      <path
        d="M6 18h28L20 48Z"
        fill={erase}
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="miter"
      />
      {/* 직사각 */}
      <rect
        x="14"
        y="2"
        width="12"
        height="16"
        fill={erase}
        stroke={stroke}
        strokeWidth="1.7"
      />
    </svg>
  );
}
