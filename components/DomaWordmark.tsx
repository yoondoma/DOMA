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
 * left-full + 2px — YouTube KR처럼 어깨에 딱 붙임.
 */
export function DomaWordmark({
  size = "md",
  light = false,
  className = "",
}: DomaWordmarkProps) {
  const s = sizeClass[size];
  return (
    <span
      className={`relative inline-block font-[family-name:var(--font-brand)] font-semibold leading-none tracking-[0.28em] ${s.brand} ${
        light ? "text-black/80" : "text-white"
      } ${className}`}
    >
      DOMA
      <span
        aria-hidden
        className={`absolute left-full top-0 ml-[2px] font-[family-name:var(--font-brand)] font-semibold leading-none ${s.kr} ${
          light ? "text-black/45" : "text-white/55"
        }`}
        style={{ letterSpacing: "0.04em" }}
      >
        KR
      </span>
      <span className="sr-only"> KR</span>
    </span>
  );
}
