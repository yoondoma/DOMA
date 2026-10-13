"use client";

import { useState } from "react";
import { DomaMark } from "@/components/DomaMark";

type TouchGateProps = {
  onEnter: () => void;
};

/** 실증주의 진입 — 로고를 직접 터치해야 메인으로 */
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
    <div
      className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 text-white"
      aria-label="진입"
    >
      <button
        type="button"
        onClick={handleEnter}
        aria-label="DOMA 로고를 터치하여 입장"
        className={`flex flex-col items-center gap-5 border-0 bg-transparent p-4 outline-none transition-transform duration-200 focus-visible:outline-none ${
          pressing ? "touch-press" : "active:scale-[0.96]"
        }`}
      >
        <DomaMark size={112} />
        <span className="font-[family-name:var(--font-brand)] text-[36px] font-semibold tracking-[0.22em]">
          DOMA
          <span className="ml-[0.1em] align-top font-[family-name:var(--font-space-grotesk)] text-[12px] tracking-[0.04em] text-muted">
            .kr
          </span>
        </span>
        <span
          className={`mt-2 text-[11px] tracking-[0.18em] text-muted ${
            pressing ? "opacity-40" : "opacity-100"
          }`}
        >
          {pressing ? "확인됨" : "로고를 터치하여 입장"}
        </span>
      </button>
    </div>
  );
}
