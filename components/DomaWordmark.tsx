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
        const actualLeft = m.actualBoundingBoxLeft ?? 0;
        const actualRight = m.actualBoundingBoxRight ?? fs * 0.7;

        const emH = fontAscent + fontDescent || a.height;
        const baseline = a.top + (fontAscent / emH) * a.height;
        inkTop = baseline - actualAscent;

        /**
         * actualBoundingBoxRight = 아래 세리프(최대폭).
         * 위첨자 밴드의 대각 잉크를 캔버스로 다시 샘플링.
         */
        const scale = 4;
        const pad = 4;
        const cw = Math.ceil((fs * 1.3 + pad) * scale);
        const ch = Math.ceil((emH + pad) * scale);
        canvas.width = cw;
        canvas.height = ch;
        // width reset clears context state
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cw, ch);
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.fillStyle = "#ffffff";
        ctx.font = `${computed.fontWeight} ${fs}px ${computed.fontFamily}`;
        ctx.textBaseline = "alphabetic";
        const originX = pad - actualLeft;
        ctx.fillText("A", originX, fontAscent + pad / scale);

        const inkTopLocal = pad / scale + fontAscent - actualAscent;
        const bandBot = inkTopLocal + Math.max(fs * 0.24, actualAscent * 0.3);
        const y0 = Math.max(0, Math.floor(inkTopLocal * scale));
        const y1 = Math.min(ch, Math.ceil(bandBot * scale));
        const img = ctx.getImageData(0, y0, cw, Math.max(1, y1 - y0));
        let maxX = 0;
        const rows = Math.max(1, y1 - y0);
        for (let y = 0; y < rows; y++) {
          for (let x = cw - 1; x >= 0; x--) {
            if (img.data[(y * cw + x) * 4 + 3] > 24) {
              if (x > maxX) maxX = x;
              break;
            }
          }
        }
        if (maxX > 0) {
          const localRight = maxX / scale;
          // localRight는 originX 기준 캔버스 x → 글리프 로컬
          inkRight = a.left + (localRight - originX);
        } else {
          inkRight = a.left - actualLeft + actualRight * 0.55;
        }
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
