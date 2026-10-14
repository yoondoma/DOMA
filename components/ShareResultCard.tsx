"use client";

import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import type { ShareResult } from "@/lib/share-result-mock";

type CardRatio = "square" | "story";

type ShareResultCardProps = {
  open: boolean;
  result: ShareResult;
  onClose: () => void;
  onToast?: (message: string) => void;
};

/**
 * 바이럴 결과 증명 카드 — 진영 승패·내 글·좋아요·채택을 캡처용으로.
 * Strict B&W + 빨간 액센트 최소(승 표시만).
 */
export function ShareResultCard({
  open,
  result,
  onClose,
  onToast,
}: ShareResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<CardRatio>("square");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const sideLabel = result.mySide === "NEXUS" ? "도전자" : "방어자";
  const sideTone = result.mySide === "NEXUS" ? "black" : "white";
  const outcomeLabel = result.outcome === "win" ? "승" : "패";
  const isWin = result.outcome === "win";

  const capture = async (mode: "download" | "share") => {
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

      const file = new File(
        [blob],
        `doma-r${result.round}-${ratio}.png`,
        { type: "image/png" },
      );

      if (mode === "share" && typeof navigator.share === "function") {
        try {
          await navigator.share({
            files: [file],
            title: `DOMA #${result.round}`,
            text: `${result.topic} · ${sideLabel} ${outcomeLabel}`,
          });
          onToast?.("공유 시트를 열었습니다");
          return;
        } catch {
          /* fall through to download */
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      onToast?.(
        mode === "share"
          ? "이미지로 저장했습니다 (공유 대용)"
          : "증명 카드를 PNG로 저장했습니다",
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
      aria-label="결과 증명 카드"
    >
      <div className="mx-auto flex w-full max-w-[560px] items-center justify-between px-3 py-3">
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-1 text-[13px] text-white/70"
        >
          닫기
        </button>
        <p className="text-[11px] font-bold tracking-[0.18em] text-white/70">
          결과 증명
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
              : "border-white/30 text-white/70"
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
              : "border-white/30 text-white/70"
          }`}
        >
          스토리 9:16
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto px-4 pb-4">
        <div
          ref={cardRef}
          className={`relative w-full max-w-[340px] overflow-hidden border border-white/25 ${
            ratio === "square" ? "aspect-square" : "aspect-[9/16] max-h-[72dvh]"
          } ${
            sideTone === "black"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          {/* 캡처 본체 */}
          <div
            className={`flex h-full flex-col px-5 ${
              ratio === "square" ? "py-5" : "py-7"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <p className="leading-none">
                <span
                  className={`relative inline-block font-[family-name:var(--font-brand)] text-[13px] font-semibold tracking-[0.28em] ${
                    sideTone === "black" ? "text-white/80" : "text-black/70"
                  }`}
                >
                  DOMA
                  <span
                    className={`absolute left-full top-0 ml-[0.06em] text-[7px] font-semibold tracking-[0.06em] leading-none ${
                      sideTone === "black" ? "text-white/50" : "text-black/40"
                    }`}
                  >
                    KR
                  </span>
                </span>
              </p>
              <p
                className={`font-mono text-[11px] tabular-nums tracking-[0.08em] ${
                  sideTone === "black" ? "text-white/50" : "text-black/45"
                }`}
              >
                #{result.round}
              </p>
            </div>

            <p
              className={`mt-4 font-[family-name:var(--font-syne)] font-bold leading-[1.3] ${
                ratio === "square" ? "text-[17px]" : "text-[19px]"
              }`}
            >
              {result.topic}
            </p>

            <div className="mt-5 flex items-end gap-3">
              <div>
                <p
                  className={`text-[10px] tracking-[0.16em] ${
                    sideTone === "black" ? "text-white/45" : "text-black/45"
                  }`}
                >
                  내 진영
                </p>
                <p className="mt-1 text-[15px] font-bold tracking-[0.06em]">
                  {sideLabel}
                  <span
                    className={`ml-2 text-[11px] font-medium ${
                      sideTone === "black" ? "text-white/50" : "text-black/45"
                    }`}
                  >
                    {sideTone === "black" ? "흑" : "백"}
                  </span>
                </p>
              </div>
              <div className="ml-auto text-right">
                <p
                  className={`text-[10px] tracking-[0.16em] ${
                    sideTone === "black" ? "text-white/45" : "text-black/45"
                  }`}
                >
                  결과
                </p>
                <p
                  className={`mt-0.5 font-[family-name:var(--font-syne)] text-[36px] font-bold leading-none ${
                    isWin ? "text-timer" : ""
                  }`}
                >
                  {outcomeLabel}
                </p>
              </div>
            </div>

            <p
              className={`mt-2 text-[12px] tabular-nums ${
                sideTone === "black" ? "text-white/55" : "text-black/50"
              }`}
            >
              내 진영 {result.mySidePercent}% · {result.settledAtLabel}
            </p>

            <div
              className={`mt-4 flex-1 border-t pt-4 ${
                sideTone === "black" ? "border-white/20" : "border-black/15"
              }`}
            >
              <div className="flex items-center gap-2">
                <p
                  className={`text-[10px] font-bold tracking-[0.16em] ${
                    sideTone === "black" ? "text-white/45" : "text-black/45"
                  }`}
                >
                  내 진술
                </p>
                {result.adopted && result.adoptedLabel ? (
                  <span
                    className={`border px-1.5 py-0.5 text-[10px] font-bold tracking-[0.1em] ${
                      sideTone === "black"
                        ? "border-white bg-white text-black"
                        : "border-black bg-black text-white"
                    }`}
                  >
                    {result.adoptedLabel}
                  </span>
                ) : null}
              </div>
              <p
                className={`mt-2 leading-[1.55] ${
                  ratio === "square" ? "text-[13px]" : "text-[14px]"
                } ${
                  sideTone === "black" ? "text-white/88" : "text-black/85"
                }`}
              >
                “{result.myOpinion}”
              </p>
              <p
                className={`mt-3 text-[12px] tabular-nums ${
                  sideTone === "black" ? "text-white/55" : "text-black/50"
                }`}
              >
                좋아요 {result.likes}
                {result.adopted ? " · 채택됨" : ""}
              </p>
            </div>

            <p
              className={`mt-auto pt-3 text-center text-[10px] tracking-[0.2em] ${
                sideTone === "black" ? "text-white/35" : "text-black/35"
              }`}
            >
              PROOF · DOMA KR
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[560px] space-y-2 border-t border-white/15 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void capture("download")}
          className="w-full border border-white bg-white py-3 text-[13px] font-bold tracking-[0.12em] text-black disabled:opacity-50"
        >
          {busy ? "저장 중…" : "카드 저장"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void capture("share")}
          className="w-full border border-white/40 py-3 text-[13px] font-bold tracking-[0.12em] text-white disabled:opacity-50"
        >
          이미지로 공유
        </button>
      </div>
    </div>
  );
}
