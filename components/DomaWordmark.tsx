type DomaWordmarkProps = {
  /** lg = 게이트, md = 헤더 */
  size?: "lg" | "md" | "sm";
  /** light 배경 → 검정 워드마크 */
  light?: boolean;
  className?: string;
};

const sizeClass = {
  lg: {
    brand: "text-[36px]",
    kr: "text-[11px]",
  },
  md: {
    brand: "text-[15px]",
    kr: "text-[7.5px]",
  },
  sm: {
    brand: "text-[13px]",
    kr: "text-[7px]",
  },
} as const;

/**
 * DOMA + 위첨자 KR (점 없음).
 * tracking은 `DOM`에만 — 마지막 `A`에는 꼬리 여백이 없어
 * KR이 A 글리프 오른쪽에 2~4px만 띄고 붙는다 (YouTube KR).
 */
export function DomaWordmark({
  size = "md",
  light = false,
  className = "",
}: DomaWordmarkProps) {
  const s = sizeClass[size];
  const brand = light ? "text-black/80" : "text-white";
  const kr = light ? "text-black/45" : "text-white/55";

  return (
    <span
      className={`inline-flex items-start font-[family-name:var(--font-brand)] font-semibold leading-none ${s.brand} ${brand} ${className}`}
    >
      {/* D–O–M 간격만 tracking. 마지막 꼬리는 M–A 간격으로 쓰임 */}
      <span className="tracking-[0.28em]">DOM</span>
      <span className="relative inline-block">
        A
        {/* 세리프 A 사이드베어링을 상쇄해 잉크 가장자리에서 2~4px */}
        <span
          aria-hidden
          className={`absolute top-0 font-[family-name:var(--font-brand)] font-semibold leading-none tracking-[0.04em] ${s.kr} ${kr}`}
          style={{ left: "100%", marginLeft: "calc(3px - 0.18em)" }}
        >
          KR
        </span>
      </span>
      <span className="sr-only"> KR</span>
    </span>
  );
}
