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

    let dead = false;

    const place = () => {
      if (dead) return;
      const range = document.createRange();
      range.selectNodeContents(aEl);
      const a = range.getBoundingClientRect();
      const parent = wrap.getBoundingClientRect();
      const fs = parseFloat(getComputedStyle(aEl).fontSize) || 16;
      /**
       * A는 아래 세리프가 glyph.right. 위첨자 밴드(상단)의
       * 오른쪽 대각 잉크를 캔버스로 샘플링해 붙인다.
       */
      const band = Math.min(a.height * 0.32, fs * 0.36);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      // fallback: 세리프·대각을 감안해 강하게 당김
      let inkRight = a.right - fs * 0.34;
      if (ctx) {
        const pad = 4;
        const w = Math.ceil(a.width) + pad * 2;
        const h = Math.ceil(a.height) + pad * 2;
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#ffffff";
        const computed = getComputedStyle(aEl);
        ctx.font = `${computed.fontWeight} ${fs}px ${computed.fontFamily}`;
        ctx.textBaseline = "alphabetic";
        // DOM 글리프와 같은 베이스라인 비율로 그림
        const baseline = pad + (a.height * 0.8);
        ctx.fillText("A", pad, baseline);
        const sampleTop = pad;
        const sampleBot = Math.max(sampleTop + 1, Math.floor(pad + band));
        const data = ctx.getImageData(0, sampleTop, w, sampleBot - sampleTop).data;
        let maxX = 0;
        for (let y = 0; y < sampleBot - sampleTop; y++) {
          for (let x = w - 1; x >= 0; x--) {
            if (data[(y * w + x) * 4 + 3] > 16) {
              if (x > maxX) maxX = x;
              break;
            }
          }
        }
        if (maxX > 0) {
          inkRight = a.left - pad + maxX;
        }
      }
      const gap = 3;
      setPos({
        top: a.top - parent.top,
        left: inkRight - parent.left + gap,
      });
    };

    const run = () => {
      void document.fonts.ready.then(() => {
        place();
        requestAnimationFrame(place);
      });
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(wrap);
    return () => {
      dead = true;
      ro.disconnect();
    };
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
