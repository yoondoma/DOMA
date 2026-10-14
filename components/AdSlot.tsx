"use client";

import { useEffect, useState } from "react";
import {
  AD_PREVIEW_EVENT,
  defaultAdPreviewPrefs,
  loadAdPreviewPrefs,
  type AdSlotId,
} from "@/lib/ad-preview";

type AdSlotProps = {
  id: AdSlotId;
  /** 라이트 셸 */
  light?: boolean;
  className?: string;
  /** gate_splash 등에서 스킵 */
  onSkip?: () => void;
};

function useAdPreview(): boolean {
  const [on, setOn] = useState(() =>
    typeof window !== "undefined"
      ? loadAdPreviewPrefs().enabled
      : defaultAdPreviewPrefs().enabled,
  );
  useEffect(() => {
    setOn(loadAdPreviewPrefs().enabled);
    const sync = () => setOn(loadAdPreviewPrefs().enabled);
    window.addEventListener(AD_PREVIEW_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AD_PREVIEW_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return on;
}

/**
 * 콜로세움 주변 광고 슬롯 훅.
 * 기본 ON · 빈 Sponsored「광고 자리」플레이스홀더 (SDK/실광고 없음).
 * 지지/%/타이머/TOP 본문에 두지 말 것. 스펙: product-ops
 */
export function AdSlot({ id, light, className = "", onSkip }: AdSlotProps) {
  const preview = useAdPreview();
  if (!preview) return null;

  const ink = light ? "text-black/55" : "text-white/55";
  const border = light ? "border-black/20" : "border-white/20";
  const bg = light ? "bg-black/[0.03]" : "bg-white/[0.04]";

  if (id === "gate_splash") {
    return (
      <aside
        data-ad-slot={id}
        aria-label="광고 자리"
        className={`fixed inset-0 z-[75] flex flex-col items-center justify-center bg-black text-white ${className}`}
        role="dialog"
        aria-modal
      >
        <p className="text-[10px] font-bold tracking-[0.22em] text-white/45">
          Sponsored
        </p>
        <p className="mt-3 text-[12px] tracking-[0.1em] text-white/55">
          광고 자리
        </p>
        <button
          type="button"
          onClick={onSkip}
          className="mt-10 border border-white/40 px-6 py-2.5 text-[12px] tracking-[0.14em] text-white"
        >
          건너뛰기
        </button>
      </aside>
    );
  }

  const tall =
    id === "calendar_banner" ||
    id === "shutdown_idle" ||
    id === "discover_row";

  return (
    <aside
      data-ad-slot={id}
      aria-label="광고 자리"
      className={`flex items-center justify-between gap-2 border-y px-3 ${
        tall ? "py-3" : "py-1.5"
      } ${border} ${bg} ${className}`}
    >
      <p
        className={`text-[10px] font-bold tracking-[0.18em] ${ink}`}
      >
        Sponsored
      </p>
      <p className={`truncate text-[10px] tracking-[0.06em] ${ink}`}>
        광고 자리
      </p>
    </aside>
  );
}
