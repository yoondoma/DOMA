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
 * tracking은 `DOM`에만 — 마지막 `A`에는 꼬리 여백 없음.
 * 오프셋 em은 브랜드 글자 크기 기준(KR 글자 크기 아님)으로 잡아
 * 세리프 A 잉크 가장자리에서 2~4px 밀착 (YouTube KR).
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
      <span className="tracking-[0.28em]">DOM</span>
      <span className="relative inline-block">
        A
        {/* em = 브랜드 사이즈. KR 폰트는 안쪽 span */}
        <span
          aria-hidden
          className="absolute top-0 left-full"
          style={{ marginLeft: "calc(3px - 0.2em)" }}
        >
          <span
            className={`font-[family-name:var(--font-brand)] font-semibold leading-none tracking-[0.04em] ${s.kr} ${kr}`}
          >
            KR
          </span>
        </span>
      </span>
      <span className="sr-only"> KR</span>
    </span>
  );
}
