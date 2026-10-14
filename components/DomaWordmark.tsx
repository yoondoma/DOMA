type DomaWordmarkProps = {
  /** lg = 게이트, md = 헤더 */
  size?: "lg" | "md" | "sm";
  /** light 배경 → 검정 워드마크 */
  light?: boolean;
  className?: string;
};

const sizeClass = {
  lg: {
    brand: "text-[36px] tracking-[0.28em]",
    kr: "text-[11px] tracking-[0.06em]",
  },
  md: {
    brand: "text-[15px] tracking-[0.28em]",
    kr: "text-[8px] tracking-[0.06em]",
  },
  sm: {
    brand: "text-[13px] tracking-[0.28em]",
    kr: "text-[7px] tracking-[0.06em]",
  },
} as const;

/**
 * DOMA + 위첨자 KR (점 없음). YouTube KR 참고 — 작은 대문자, 어깨에 붙임.
 */
export function DomaWordmark({
  size = "md",
  light = false,
  className = "",
}: DomaWordmarkProps) {
  const s = sizeClass[size];
  return (
    <span
      className={`relative inline-block pr-[1.4em] font-[family-name:var(--font-brand)] font-semibold leading-none ${s.brand} ${
        light ? "text-black/80" : "text-white"
      } ${className}`}
    >
      DOMA
      <span
        aria-hidden
        className={`absolute left-[calc(100%-1.3em)] top-0 font-[family-name:var(--font-brand)] font-semibold leading-none ${s.kr} ${
          light ? "text-black/45" : "text-white/55"
        }`}
      >
        KR
      </span>
      <span className="sr-only"> KR</span>
    </span>
  );
}
