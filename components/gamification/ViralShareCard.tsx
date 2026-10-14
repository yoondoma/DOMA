"use client";

import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import { DomaMark } from "@/components/DomaMark";
import { DomaWordmark } from "@/components/DomaWordmark";
import { TierBadge } from "@/components/gamification/TierBadge";
import type {
  DailyTitle,
  DailyTitleType,
  TierPlacement,
} from "@/lib/types/gamification";

type CardRatio = "square" | "story";

export type ViralSharePayload = {
  username: string;
  /** 누적 티어 포인트 (승+1 / 패-0.5) */
  score: number;
  tier: TierPlacement;
  title: DailyTitle;
};

type ViralShareCardProps = {
  open: boolean;
  payload: ViralSharePayload;
  onClose: () => void;
  onToast?: (message: string) => void;
};

/** 칭호 타입 → 각인 — FINGER 전용 / 그 외 VERIFIED OUTLIER */
function stampForTitle(type: DailyTitleType): string {
  return type === "FINGER" ? "[DOMA'S FINGER]" : "[VERIFIED OUTLIER]";
}

/** 창+방패가 수직으로 겹쳐 펜 실루엣 */
function PenEmblem({ size = 72 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 48 64"
      fill="none"
      aria-hidden
      className="text-white"
    >
      {/* 펜촉 = 창날 */}
      <path
        d="M24 2C24 2 16.5 10 16.5 16.5c0 3.2 2.5 5.2 7.5 5.2s7.5-2 7.5-5.2C31.5 10 24 2 24 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M24 3.2v17.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="square"
      />
      {/* 칼라 */}
      <path
        d="M18 22.2h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
      {/* 자루 / 펜대 */}
      <path
        d="M24 22.2v18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="square"
      />
      {/* 방패 본체 — 자루 아래 */}
      <path
        d="M24 38.5 36 42.2v8.2c0 5.4-4 9.4-12 11.2-8-1.8-12-5.8-12-11.2v-8.2L24 38.5Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="miter"
      />
      <path
        d="M24 40.2v19.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

/**
 * 일일 칭호·티어 전과용 모노크롬 전파 카드
 * 1:1 / 9:16 · html2canvas 저장·공유 (ShareResultCard 패턴)
 */
export function ViralShareCard({
  open,
  payload,
  onClose,
  onToast,
}: ViralShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<CardRatio>("square");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const stamp = stampForTitle(payload.title.type);
  const fileBase = `doma-viral-${payload.title.date.replace(".", "")}-${ratio}`;

  const capture = async (mode: "download" | "copy" | "share") => {
    if (!cardRef.current || busy) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#000000",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("blob");

      const file = new File([blob], `${fileBase}.png`, { type: "image/png" });

      if (mode === "copy" && navigator.clipboard?.write) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          onToast?.("카드를 클립보드에 복사했습니다");
          return;
        } catch {
          /* fall through */
        }
      }

      if (mode === "share" && typeof navigator.share === "function") {
        try {
          await navigator.share({
            files: [file],
            title: `DOMA · ${payload.title.label}`,
            text: `${payload.username} · ${payload.title.label}`,
          });
          onToast?.("공유 시트를 열었습니다");
          return;
        } catch {
          /* fall through */
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      onToast?.(
        mode === "copy"
          ? "이미지로 저장했습니다 (복사 대용)"
          : "전파 카드를 PNG로 저장했습니다",
      );
    } catch {
      onToast?.("캡처에 실패했습니다. 다시 시도해 주세요");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-black/92"
      role="dialog"
      aria-modal
      aria-label="칭호 전파 카드"
    >
      <div className="mx-auto flex w-full max-w-[560px] items-center justify-between px-3 py-3">
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-1 text-[13px] text-neutral-200"
        >
          닫기
        </button>
        <p className="text-[11px] font-bold tracking-[0.18em] text-neutral-200">
          전파 카드
        </p>
        <span className="w-10" aria-hidden />
      </div>

      <div className="mx-auto flex w-full max-w-[560px] gap-2 px-4 pb-3">
        <button
          type="button"
          onClick={() => setRatio("square")}
          className={`flex-1 border py-2 text-[12px] font-bold tracking-[0.12em] ${
            ratio === "square"
              ? "border-white bg-white text-black"
              : "border-neutral-200 text-neutral-200"
          }`}
        >
          정사각 1:1
        </button>
        <button
          type="button"
          onClick={() => setRatio("story")}
          className={`flex-1 border py-2 text-[12px] font-bold tracking-[0.12em] ${
            ratio === "story"
              ? "border-white bg-white text-black"
              : "border-neutral-200 text-neutral-200"
          }`}
        >
          스토리 9:16
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto px-4 pb-4">
        <div
          ref={cardRef}
          className={`relative w-full max-w-[340px] overflow-hidden border border-neutral-200 bg-black text-white ${
            ratio === "square" ? "aspect-square" : "aspect-[9/16] max-h-[72dvh]"
          }`}
        >
          <div
            className={`flex h-full flex-col ${
              ratio === "square" ? "px-5 py-5" : "px-6 py-7"
            }`}
          >
            {/* 상단: 로고 + 각인 */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <DomaMark size={ratio === "square" ? 28 : 32} />
                <DomaWordmark size="sm" />
              </div>
              <p className="shrink-0 pt-1 font-[family-name:var(--font-syne)] text-[9px] font-bold tracking-[0.1em] text-white">
                {stamp}
              </p>
            </div>

            {/* 중앙 */}
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <PenEmblem size={ratio === "square" ? 56 : 68} />
              <p
                className={`mt-4 font-[family-name:var(--font-syne)] font-bold tracking-tight ${
                  ratio === "square" ? "text-[20px]" : "text-[24px]"
                }`}
              >
                {payload.username}
              </p>
              <p
                className={`mt-2 max-w-[90%] font-semibold leading-snug tracking-[0.04em] ${
                  ratio === "square" ? "text-[13px]" : "text-[15px]"
                }`}
              >
                {payload.title.label}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <TierBadge
                  tier={payload.tier.code}
                  subTier={payload.tier.subtier}
                />
                <span className="text-[11px] tabular-nums tracking-[0.12em] text-neutral-200">
                  {payload.score} PT
                </span>
              </div>
            </div>

            {/* 하단 */}
            <div className="mt-auto space-y-1.5 pt-3 text-center">
              <p className="text-[10px] font-medium tracking-[0.14em] text-neutral-200">
                Truth is proven within 24 Hours.
              </p>
              <p className="text-[9px] tracking-[0.28em] text-neutral-600">
                domakr
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[560px] space-y-2 border-t border-neutral-800 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void capture("download")}
          className="w-full border border-white bg-white py-3 text-[13px] font-bold tracking-[0.12em] text-black disabled:opacity-50"
        >
          {busy ? "저장 중…" : "카드 저장"}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void capture("copy")}
            className="border border-neutral-200 py-3 text-[12px] font-bold tracking-[0.1em] text-white disabled:opacity-50"
          >
            복사
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void capture("share")}
            className="border border-neutral-200 py-3 text-[12px] font-bold tracking-[0.1em] text-white disabled:opacity-50"
          >
            공유
          </button>
        </div>
      </div>
    </div>
  );
}
