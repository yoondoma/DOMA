"use client";

import { useState } from "react";
import { DomaMark } from "@/components/DomaMark";
import { DomaWordmark } from "@/components/DomaWordmark";
import { playDomaSting, unlockDomaSound } from "@/lib/sound/doma-sound";

type TouchGateProps = {
  onEnter: () => void;
};

/** pierce 정착 후 fade 진입 — 과한 튕김 없이 한 동작 */
const ENTER_MS = 520;

/** 진입 — 만져서 증명. 마크 pierce(창→원) + 기존 touch-press fade */
export function TouchGate({ onEnter }: TouchGateProps) {
  const [pressing, setPressing] = useState(false);

  const handleEnter = () => {
    if (pressing) return;
    setPressing(true);
    /** 유저 제스처 — 웹 Audio unlock + 시그니처 스팅 (입장) */
    unlockDomaSound();
    playDomaSting();
    window.setTimeout(() => {
      onEnter();
    }, ENTER_MS);
  };

  return (
    <button
      type="button"
      onClick={handleEnter}
      aria-label="터치하여 증명"
      className={`flex min-h-dvh w-full flex-col items-center justify-center border-0 bg-black px-6 text-white outline-none focus-visible:outline-none ${
        pressing ? "touch-press opacity-90" : "active:opacity-90"
      }`}
    >
      {/* 시각 중심: 마크 + DOMA KR — hit target은 전체 화면 */}
      <span
        className="pointer-events-none flex flex-col items-center"
        aria-hidden
      >
        <DomaMark size={88} pierce={pressing} />
        <span
          className={`mt-6 transition-opacity duration-300 ${
            pressing ? "opacity-70" : "opacity-100"
          }`}
        >
          <DomaWordmark size="lg" />
        </span>
        <span
          className={`mt-6 text-[11px] tracking-[0.18em] text-muted transition-opacity duration-300 ${
            pressing ? "opacity-40" : "opacity-100"
          }`}
        >
          {pressing ? "증명됨" : "터치하여 증명"}
        </span>
        {/* 베타 — 피드백 안내 (polish 아님 · 한 줄만) */}
        <span
          className={`mt-10 max-w-[18em] text-center text-[11px] leading-relaxed tracking-[0.04em] text-white/45 transition-opacity duration-300 ${
            pressing ? "opacity-20" : "opacity-100"
          }`}
          data-beta-feedback
        >
          베타 의견 →{" "}
          <span className="text-white/70 underline underline-offset-2">
            feedback@doma.kr
          </span>
        </span>
      </span>
    </button>
  );
}
