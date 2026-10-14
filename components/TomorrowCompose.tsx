"use client";

import { useEffect, useRef, useState } from "react";
import { ImageAttach } from "@/components/ImageAttach";

const MAX_CHARS = 80;

type TomorrowComposeProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, imageName?: string) => void;
};

/** 내일의 주제 제안 — 이미지 첨부만 */
export function TomorrowCompose({
  open,
  onClose,
  onSubmit,
}: TomorrowComposeProps) {
  const [text, setText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | undefined>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const remaining = MAX_CHARS - text.length;
  const canSubmit = text.trim().length >= 8 && text.length <= MAX_CHARS;

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setText("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageName(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(text.trim(), imageName);
    setText("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageName(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="작성 시트 닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="내일의 주제 제안"
        className="sheet-up relative z-10 w-full max-w-[560px] border border-white/20 border-b-0 bg-black px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:border-b sm:pb-4"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/30 sm:hidden" />
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 px-1 text-sm text-muted hover:text-white"
          >
            취소
          </button>
          <p className="font-[family-name:var(--font-syne)] text-sm font-bold tracking-wide">
            내일의 주제
          </p>
          <span className="min-w-10" />
        </div>

        <form onSubmit={handleSubmit}>
          <p
            className="mb-2 border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[11px] leading-snug tracking-[0.02em] text-white/70"
            role="note"
            aria-label="작성 규칙 팁"
          >
            제안 여러 번 가능 · 창/방패로 나뉠 주제 · 지지 1위 자동 확정
          </p>
          <p className="mb-2 text-[11px] text-muted">
            내일 아레나 후보로 올릴 질문형 주제
          </p>
          <div className="mb-2 flex justify-end text-[11px] tabular-nums text-dim">
            <span className={remaining < 12 ? "text-white" : undefined}>
              {text.length}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            rows={3}
            maxLength={MAX_CHARS}
            placeholder="예: ○○는 △△를 끝낼 것인가?"
            className="w-full resize-none border border-white/25 bg-black px-3 py-3 text-[15px] leading-relaxed text-white placeholder:text-dim focus:border-white focus:outline-none"
            aria-label="내일 주제 입력"
          />
          <ImageAttach
            previewUrl={previewUrl}
            onPick={(file, url) => {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(url);
              setImageName(file.name);
            }}
            onClear={() => {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
              setImageName(undefined);
            }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-3 flex h-11 w-full items-center justify-center border border-white bg-white text-sm font-bold tracking-[0.08em] text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
          >
            주제 제안
          </button>
        </form>
      </div>
    </div>
  );
}
