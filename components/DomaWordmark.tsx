"use client";

import { useLayoutEffect, useRef, useState } from "react";

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

type KrPos = { top: number; left: number };

/**
 * DOMA + YouTube형 위첨자 KR.
 * A 글리프 박스를 측정해 캡하이트(위) + 잉크쪽 가로 2~4px 밀착.
 */
export function DomaWordmark({
  size = "md",
  light = false,
  className = "",
}: DomaWordmarkProps) {
  const s = sizeClass[size];
  const brand = light ? "text-black/80" : "text-white";
  const krTone = light ? "text-black/45" : "text-white/55";

  const wrapRef = useRef<HTMLSpanElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<KrPos | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const aEl = aRef.current;
    if (!wrap || !aEl) return;

    const place = () => {
      const range = document.createRange();
      range.selectNodeContents(aEl);
      const a = range.getBoundingClientRect();
      const parent = wrap.getBoundingClientRect();
      const fs = parseFloat(getComputedStyle(aEl).fontSize) || 16;
      // 세리프 A 우측 사이드베어링 ≈ 0.14em — 무시하고 잉크에 붙임
      const sideBearing = fs * 0.14;
      const gap = 3; // 시각 2~4px
      setPos({
        // 글리프 박스 상단 ≈ 캡하이트 (위첨자)
        top: a.top - parent.top,
        left: a.right - parent.left - sideBearing + gap,
      });
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [size, light]);

  return (
    <span
      className={`inline-flex items-start font-[family-name:var(--font-brand)] font-semibold leading-none ${s.brand} ${brand} ${className}`}
    >
      <span className="tracking-[0.28em]">DOM</span>
      <span ref={wrapRef} className="relative inline-block">
        <span ref={aRef}>A</span>
        <span
          aria-hidden
          className={`absolute left-0 top-0 font-[family-name:var(--font-brand)] font-semibold leading-none tracking-[0.04em] ${s.kr} ${krTone} ${
            pos ? "opacity-100" : "opacity-0"
          }`}
          style={
            pos
              ? { top: pos.top, left: pos.left, lineHeight: 1 }
              : { lineHeight: 1 }
          }
        >
          KR
        </span>
      </span>
      <span className="sr-only"> KR</span>
    </span>
  );
}
