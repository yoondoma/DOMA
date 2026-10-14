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
 * measureText actualBoundingBox로 A 잉크(캡하이트·우측)를 재어
 * 위첨자 정렬 + 가로 2~4px 밀착.
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
      const computed = getComputedStyle(aEl);
      const fs = parseFloat(computed.fontSize) || 16;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let inkTop = a.top + fs * 0.2;
      let inkRight = a.right - fs * 0.28;

      if (ctx) {
        ctx.font = `${computed.fontWeight} ${fs}px ${computed.fontFamily}`;
        const m = ctx.measureText("A");
        const fontAscent =
          m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent ?? fs * 0.8;
        const fontDescent =
          m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent ?? fs * 0.2;
        const actualAscent = m.actualBoundingBoxAscent ?? fontAscent * 0.75;
        const actualRight = m.actualBoundingBoxRight ?? fs * 0.7;
        const actualLeft = m.actualBoundingBoxLeft ?? 0;

        // em 박스 안 베이스라인 ≈ fontAscent (line-height:1 가정)
        const emH = fontAscent + fontDescent || a.height;
        const baseline = a.top + (fontAscent / emH) * a.height;
        inkTop = baseline - actualAscent;
        // 원점 ≈ a.left - actualLeft (음수 좌측 베어링 보정)
        inkRight = a.left - actualLeft + actualRight;
      }

      const gap = 3;
      setPos({
        top: Math.max(0, inkTop - parent.top),
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
          className={`absolute font-[family-name:var(--font-brand)] font-semibold leading-none tracking-[0.04em] ${s.kr} ${krTone} ${
            pos ? "opacity-100" : "opacity-0"
          }`}
          style={
            pos
              ? { top: pos.top, left: pos.left, lineHeight: 1 }
              : { top: 0, left: "100%", lineHeight: 1 }
          }
        >
          KR
        </span>
      </span>
      <span className="sr-only"> KR</span>
    </span>
  );
}
