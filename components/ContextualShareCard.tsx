"use client";

import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import { DomaWordmark } from "@/components/DomaWordmark";
import { ShieldMark, SpearMark } from "@/components/SideMarks";
import { LEFT_USER_LABEL } from "@/lib/account-display";
import {
  inviteCopy,
  shareCardTitle,
  sideLabelKo,
  type ContextualSharePayload,
} from "@/lib/contextual-share";

type CardRatio = "square" | "story";

type ContextualShareCardProps = {
  open: boolean;
  payload: ContextualSharePayload | null;
  onClose: () => void;
  onToast?: (message: string) => void;
};

/**
 * 무엇을 공유했는지에 맞춘 전파 카드 (캡처·이미지 공유).
 * 인앱 URL 미리보기 카드 아님 · DOMA B&W.
 */
export function ContextualShareCard({
  open,
  payload,
  onClose,
  onToast,
}: ContextualShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<CardRatio>("square");
  const [busy, setBusy] = useState(false);

  if (!open || !payload) return null;

  const isOpinion = payload.kind === "opinion";
  const isShield = payload.side === "AEGIS";
  const light = isOpinion && isShield;
  const invite = inviteCopy(payload);
  const title = shareCardTitle(payload);
  const author =
    payload.authorLeft || payload.authorHandle === LEFT_USER_LABEL
      ? LEFT_USER_LABEL
      : payload.authorHandle
        ? `@${payload.authorHandle.replace(/^@/, "")}`
        : null;

  const capture = async (mode: "download" | "share") => {
    if (!cardRef.current || busy) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: light ? "#ffffff" : "#000000",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("blob");

      const tag =
        payload.kind === "topic"
          ? "topic"
          : isShield
            ? "shield"
            : "spear";
      const file = new File([blob], `doma-share-${tag}-${ratio}.png`, {
        type: "image/png",
      });

      if (mode === "share" && typeof navigator.share === "function") {
        try {
          await navigator.share({
            files: [file],
            title: `DOMA · ${title}`,
            text: `${payload.topic}\n${invite}`,
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
        mode === "share"
          ? "이미지로 저장했습니다 (공유 대용)"
          : "공유 카드를 PNG로 저장했습니다",
      );
    } catch {
      onToast?.("캡처에 실패했습니다. 다시 시도해 주세요");
    } finally {
      setBusy(false);
    }
  };

  const ink = light ? "text-black" : "text-white";
  const soft = light ? "text-black/55" : "text-white/55";
  const faint = light ? "text-black/40" : "text-white/40";
  const border = light ? "border-black/20" : "border-white/20";

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-black/92"
      role="dialog"
      aria-modal
      aria-label={title}
      data-contextual-share={payload.kind}
      data-share-side={payload.side ?? "topic"}
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
          {title}
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
          className={`relative w-full max-w-[340px] overflow-hidden border ${border} ${
            ratio === "square" ? "aspect-square" : "aspect-[9/16] max-h-[72dvh]"
          } ${light ? "bg-white text-black" : "bg-black text-white"}`}
        >
          <div
            className={`flex h-full flex-col px-5 ${
              ratio === "square" ? "py-5" : "py-7"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <DomaWordmark size="sm" light={light} />
              <p className={`font-mono text-[11px] tabular-nums ${faint}`}>
                #{payload.round}
              </p>
            </div>

            {isOpinion ? (
              <div className={`mt-4 inline-flex items-center gap-2 ${ink}`}>
                {isShield ? <ShieldMark size={18} /> : <SpearMark size={18} />}
                <p className="text-[12px] font-bold tracking-[0.14em]">
                  {sideLabelKo(payload.side)}
                  <span className={`ml-2 font-medium ${soft}`}>
                    {isShield ? "방패" : "창"}
                  </span>
                </p>
              </div>
            ) : (
              <p className={`mt-4 text-[10px] font-bold tracking-[0.2em] ${faint}`}>
                전장
              </p>
            )}

            <p
              className={`mt-3 font-[family-name:var(--font-display)] font-bold leading-[1.35] ${
                ratio === "square" ? "text-[17px]" : "text-[19px]"
              } ${ink}`}
            >
              {payload.topic}
            </p>

            {isOpinion && payload.opinionText ? (
              <div className={`mt-4 flex-1 border-t pt-4 ${border}`}>
                {author ? (
                  <p className={`text-[12px] font-semibold ${ink}`}>{author}</p>
                ) : null}
                <p
                  className={`mt-2 leading-[1.55] ${
                    ratio === "square" ? "text-[13px]" : "text-[14px]"
                  } ${ink}`}
                >
                  “{payload.opinionText}”
                </p>
              </div>
            ) : (
              <div className="flex-1" />
            )}

            <p
              className={`mt-auto pt-4 text-center text-[13px] font-semibold leading-[1.45] tracking-[0.02em] ${ink}`}
              data-share-invite
            >
              {invite}
            </p>
            <p
              className={`mt-2 text-center text-[10px] tracking-[0.2em] ${faint}`}
            >
              DOMA KR · 같이 겨루자
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
