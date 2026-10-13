"use client";

import { useState } from "react";
import { DomaMark } from "@/components/DomaMark";

type TouchGateProps = {
  onEnter: () => void;
};

/** 진입 — 화면 어디든 터치하면 입장. 로고 형태/비율 유지 */
export function TouchGate({ onEnter }: TouchGateProps) {
  const [pressing, setPressing] = useState(false);

  const handleEnter = () => {
    if (pressing) return;
    setPressing(true);
    window.setTimeout(() => {
      onEnter();
    }, 320);
  };

  return (
    <button
      type="button"
      onClick={handleEnter}
      aria-label="터치하여 입장"
      className={`flex min-h-dvh w-full flex-col items-center justify-center border-0 bg-black px-6 text-white outline-none transition-opacity duration-200 focus-visible:outline-none ${
        pressing ? "touch-press" : "active:opacity-90"
      }`}
    >
      {/* 시각 중심: 마크+DOMA+.kr — hit target은 전체 화면 */}
      <span className="pointer-events-none flex flex-col items-center" aria-hidden>
        <DomaMark size={88} />
        <span className="mt-6 flex items-baseline justify-center font-[family-name:var(--font-brand)] text-[36px] font-semibold leading-none tracking-[0.28em]">
          DOMA
          <span className="ml-[0.08em] translate-y-[-3px] font-[family-name:var(--font-brand)] text-[12px] font-semibold tracking-[0.04em] text-white/70">
            .kr
          </span>
        </span>
        <span
          className={`mt-6 text-[11px] tracking-[0.18em] text-muted ${
            pressing ? "opacity-40" : "opacity-100"
          }`}
        >
          {pressing ? "확인됨" : "터치하여 입장"}
        </span>
      </span>
    </button>
  );
}
