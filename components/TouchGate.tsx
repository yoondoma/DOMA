"use client";

import { useState } from "react";
import { DomaMark } from "@/components/DomaMark";
import { DomaWordmark } from "@/components/DomaWordmark";
import { FeedbackInvite } from "@/components/FeedbackCraft";
import { playDomaSting, unlockDomaSound } from "@/lib/sound/doma-sound";

type TouchGateProps = {
  onEnter: () => void;
};

/** pierce 정착 후 fade 진입 — 과한 튕김 없이 한 동작 */
const ENTER_MS = 520;

/** 진입 — 만져서 증명. 마크 pierce + 하단 베타 의견 초대 */
export function TouchGate({ onEnter }: TouchGateProps) {
  const [pressing, setPressing] = useState(false);

  const handleEnter = () => {
    if (pressing) return;
    setPressing(true);
    unlockDomaSound();
    playDomaSting();
    window.setTimeout(() => {
      onEnter();
    }, ENTER_MS);
  };

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-ink text-paper">
      <button
        type="button"
        onClick={handleEnter}
        aria-label="터치하여 증명"
        className={`flex min-h-0 flex-1 flex-col items-center justify-center border-0 bg-transparent px-6 outline-none focus-visible:outline-none ${
          pressing ? "touch-press opacity-90" : "active:opacity-90"
        }`}
      >
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
        </span>
      </button>

      <div
        className={`flex justify-center pb-[max(1.75rem,env(safe-area-inset-bottom))] transition-opacity duration-300 ${
          pressing ? "pointer-events-none opacity-20" : "opacity-100"
        }`}
      >
        <FeedbackInvite tone="gate" />
      </div>
    </div>
  );
}
