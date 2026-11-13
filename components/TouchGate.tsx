"use client";

import { useState } from "react";
import { DomaMark } from "@/components/DomaMark";
import { DomaWordmark } from "@/components/DomaWordmark";
import { FeedbackInvite } from "@/components/FeedbackCraft";
import { playDomaSting, unlockDomaSound } from "@/lib/sound/doma-sound";

type TouchGateProps = {
  onEnter: () => void;
};

/** 문 갈라짐 — 짧고 묵직 (SF 과장 없음) */
const ENTER_MS = 780;

function GateBrand({ pressing }: { pressing: boolean }) {
  return (
    <span
      className="pointer-events-none flex flex-col items-center px-6"
      aria-hidden
    >
      <DomaMark size={88} />
      <span
        className={`mt-6 transition-opacity duration-300 ${
          pressing ? "opacity-55" : "opacity-100"
        }`}
      >
        <DomaWordmark size="lg" />
      </span>
      <span
        className={`mt-6 text-[11px] tracking-[0.18em] text-muted transition-opacity duration-300 ${
          pressing ? "opacity-35" : "opacity-100"
        }`}
      >
        {pressing ? "증명됨" : "터치하여 증명"}
      </span>
    </span>
  );
}

/**
 * 진입 — 가운데 기준 좌·우로 갈라지는 문.
 * 터치 → 문 열림 → 전장. pierce 대체.
 */
export function TouchGate({ onEnter }: TouchGateProps) {
  const [opening, setOpening] = useState(false);

  const handleEnter = () => {
    if (opening) return;
    setOpening(true);
    unlockDomaSound();
    playDomaSting();
    window.setTimeout(() => {
      onEnter();
    }, ENTER_MS);
  };

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-ink text-paper"
      data-touch-gate
      data-door-entry={opening ? "1" : undefined}
    >
      {/* 문 너머 — 다른 세계(전장). 문과 톤을 살짝 달리해 틈이 읽히게 */}
      <div className="door-beyond absolute inset-0" aria-hidden />

      <button
        type="button"
        onClick={handleEnter}
        aria-label="터치하여 증명"
        className="absolute inset-0 z-10 border-0 bg-transparent outline-none focus-visible:outline-none"
        disabled={opening}
      />

      {/* 왼쪽 문짝 — 닫힌 채엔 이음선 없음(1px 겹침). 터치 후에만 갈라짐 */}
      <div
        className={`door-leaf door-leaf-left pointer-events-none absolute inset-y-0 left-0 z-20 overflow-hidden bg-ink ${
          opening ? "door-open" : ""
        }`}
        aria-hidden
      >
        <div className="flex h-full w-[200%] items-center justify-center">
          <GateBrand pressing={opening} />
        </div>
      </div>

      {/* 오른쪽 문짝 */}
      <div
        className={`door-leaf door-leaf-right pointer-events-none absolute inset-y-0 right-0 z-20 overflow-hidden bg-ink ${
          opening ? "door-open" : ""
        }`}
        aria-hidden
      >
        <div className="ml-[-100%] flex h-full w-[200%] items-center justify-center">
          <GateBrand pressing={opening} />
        </div>
      </div>

      {/* 피드백 — 문 위 하단, 열릴 때 같이 사라짐 */}
      <div
        className={`pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex justify-center pb-[max(1.75rem,env(safe-area-inset-bottom))] transition-opacity duration-300 ${
          opening ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <FeedbackInvite tone="gate" />
      </div>
    </div>
  );
}
