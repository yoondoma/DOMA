/** 트로이의 목마 — B&W 라인 말 심볼 + 숫자. 부차적·작은 마크 */

type TrojanMarkProps = {
  count: number;
  light?: boolean;
  className?: string;
  /** 프로필 등에서 0이어도 숨기지 않을 때 */
  showZero?: boolean;
};

export function TrojanMark({
  count,
  light,
  className = "",
  showZero = false,
}: TrojanMarkProps) {
  if (!showZero && count <= 0) return null;
  const tone = light ? "text-black/50" : "text-white/50";
  const num = light ? "text-black/70" : "text-white/70";
  return (
    <span
      className={`inline-flex items-center gap-0.5 tabular-nums ${tone} ${className}`}
      title="다른 진영에서 이 의견을 지지하며 넘어온 수"
      aria-label={`목마 ${count}`}
      data-trojan={count}
    >
      {/* 말(목마) 라인 심볼 */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0"
        aria-hidden
      >
        <path
          d="M2.5 10.5h3.2l.8-2.2h3.4l1.2 2.2H14"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M5.8 8.3 5.2 5.2l2.1-1.7h2.4l1.4 1.4.6 3.4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M6.2 10.5v2.8M10.6 10.5v2.8"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="square"
        />
        <path
          d="M9.8 3.6c.9.1 1.6.7 1.9 1.5"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="square"
        />
      </svg>
      <span className={`text-[11px] font-medium leading-none ${num}`}>
        {count}
      </span>
    </span>
  );
}
