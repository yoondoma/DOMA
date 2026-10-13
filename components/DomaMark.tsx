type DomaMarkProps = {
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * 스케치 로고: 직사각형 + 역삼각형 + 막는 원(방패)
 * Strict B&W 라인 — 면 채움 없이 도형이 겹치지 않게 구분
 */
export function DomaMark({
  size = 56,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";

  return (
    <svg
      width={size}
      height={Math.round(size * (64 / 48))}
      viewBox="0 0 48 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      {/* 1. 직사각형 */}
      <rect
        x="18.5"
        y="3"
        width="11"
        height="16"
        stroke={stroke}
        strokeWidth="1.7"
      />
      {/* 2. 역삼각형 — 윗변은 직사각형 아래, 끝은 원 안 */}
      <path
        d="M11 21.5h26L24 46Z"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="miter"
      />
      {/* 3. 막는 원(방패) — 가로 타원, 삼각 끝과 교차 */}
      <ellipse
        cx="24"
        cy="50"
        rx="15.5"
        ry="9.5"
        stroke={stroke}
        strokeWidth="1.7"
      />
    </svg>
  );
}
