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
    kr: "text-[11px] tracking-[0.04em]",
  },
  md: {
    brand: "text-[15px]",
    kr: "text-[7.5px] tracking-[0.04em]",
  },
  sm: {
    brand: "text-[13px]",
    kr: "text-[7px] tracking-[0.04em]",
  },
} as const;

/**
 * DOMA + 위첨자 KR (점 없음).
 * letter-spacing 꼬리 여백을 상쇄해 YouTube KR처럼 어깨에 딱 붙임.
 */
export function DomaWordmark({
  size = "md",
  light = false,
  className = "",
}: DomaWordmarkProps) {
  const s = sizeClass[size];
  return (
    <span
      className={`inline-flex items-start font-[family-name:var(--font-brand)] font-semibold leading-none ${className}`}
    >
      <span
        className={`${s.brand} tracking-[0.28em] ${
          light ? "text-black/80" : "text-white"
        }`}
        style={{ marginRight: "-0.28em" }}
      >
        DOMA
      </span>
      <span
        aria-hidden
        className={`${s.kr} ml-[0.14em] mt-[0.06em] ${
          light ? "text-black/45" : "text-white/55"
        }`}
      >
        KR
      </span>
      <span className="sr-only"> KR</span>
    </span>
  );
}
