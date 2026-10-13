type DomaMarkProps = {
  /** 가로 기준 너비 */
  size?: number;
  /** light 배경 위 → 검정 스트로크 */
  light?: boolean;
  className?: string;
};

/**
 * 스케치 로고(가로): 직사각형 → 오른쪽을 가리키는 삼각형 → 끝을 막는 원/방패
 * Strict B&W 라인
 */
export function DomaMark({
  size = 72,
  light = false,
  className = "",
}: DomaMarkProps) {
  const stroke = light ? "#000000" : "#ffffff";
  // viewBox 72×36 → height = size/2
  const height = Math.round(size / 2);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 72 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      {/* 왼쪽 직사각형 */}
      <rect
        x="2"
        y="10"
        width="16"
        height="16"
        stroke={stroke}
        strokeWidth="1.7"
      />
      {/* 오른쪽을 가리키는 삼각형 — 끝이 원 안으로 */}
      <path
        d="M20 6v24L52 18Z"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="miter"
      />
      {/* 막는 원/방패 */}
      <circle
        cx="56"
        cy="18"
        r="12"
        stroke={stroke}
        strokeWidth="1.7"
      />
    </svg>
  );
}
