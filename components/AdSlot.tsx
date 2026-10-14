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
 * 빈 Sponsored 한 줄 — today_below / tomorrow_below 만.
 * 입장 게이트·피드 남발 없음. SDK/실광고 금지.
 */
export function AdSlot({ id, light, className = "" }: AdSlotProps) {
  const preview = useAdPreview();
  if (!preview) return null;

  const ink = light ? "text-black/55" : "text-white/55";
  const border = light ? "border-black/20" : "border-white/20";
  const bg = light ? "bg-black/[0.03]" : "bg-white/[0.04]";

  return (
    <aside
      data-ad-slot={id}
      aria-label="광고 자리"
      className={`flex items-center justify-between gap-2 border-y px-3 py-1.5 ${border} ${bg} ${className}`}
    >
      <p className={`text-[10px] font-bold tracking-[0.18em] ${ink}`}>
        Sponsored
      </p>
      <p className={`truncate text-[10px] tracking-[0.06em] ${ink}`}>
        광고 자리
      </p>
    </aside>
  );
}
