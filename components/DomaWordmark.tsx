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
      /**
       * A는 아래 세리프가 glyph.right. 위첨자 밴드(상단 ~30%)의
       * 오른쪽 대각 잉크에 붙이려면 박스 right가 아니라 그 높이의
       * 실측 가장자리로 당겨야 함.
       */
      const band = Math.min(a.height * 0.28, fs * 0.32);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let inkRight = a.right - fs * 0.3; // fallback tuck
      if (ctx) {
        const w = Math.ceil(a.width) + 4;
        const h = Math.ceil(a.height) + 4;
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#fff";
        const computed = getComputedStyle(aEl);
        ctx.font = `${computed.fontWeight} ${fs}px ${computed.fontFamily}`;
        ctx.textBaseline = "top";
        ctx.fillText("A", 2, 2);
        const sampleTop = 2;
        const sampleBot = Math.max(sampleTop + 1, Math.floor(2 + band));
        const data = ctx.getImageData(0, sampleTop, w, sampleBot - sampleTop).data;
        let maxX = 0;
        for (let y = 0; y < sampleBot - sampleTop; y++) {
          for (let x = w - 1; x >= 0; x--) {
            if (data[(y * w + x) * 4 + 3] > 20) {
              if (x > maxX) maxX = x;
              break;
            }
          }
        }
        if (maxX > 0) {
          // canvas 로컬 → 화면: a.left - 2 + maxX
          inkRight = a.left - 2 + maxX;
        }
      }
      const gap = 3; // 시각 2~4px
      setPos({
        // 글리프 박스 상단 = 캡하이트 위첨자
        top: a.top - parent.top,
        left: inkRight - parent.left + gap,
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
