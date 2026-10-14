"use client";

import { useState } from "react";
import { DomaMark } from "@/components/DomaMark";
import { DomaWordmark } from "@/components/DomaWordmark";

type TouchGateProps = {
  onEnter: () => void;
};

/** 진입 — 만져서 증명(도마/토마스). 화면 어디든 터치. 로고 형태 유지 */
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
      aria-label="터치하여 증명"
      className={`flex min-h-dvh w-full flex-col items-center justify-center border-0 bg-black px-6 text-white outline-none transition-opacity duration-200 focus-visible:outline-none ${
        pressing ? "touch-press" : "active:opacity-90"
      }`}
    >
      {/* 시각 중심: 마크 + DOMAᴷᴿ — hit target은 전체 화면 */}
      <span className="pointer-events-none flex flex-col items-center" aria-hidden>
        <DomaMark size={88} />
        <span className="mt-6">
          <DomaWordmark size="lg" />
        </span>
        <span
          className={`mt-6 text-[11px] tracking-[0.18em] text-muted ${
            pressing ? "opacity-40" : "opacity-100"
          }`}
        >
          {pressing ? "증명됨" : "터치하여 증명"}
        </span>
      </span>
    </button>
  );
}
