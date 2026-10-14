"use client";

import { useEffect, useRef, useState } from "react";
import { ImageAttach, type ImagePreview } from "@/components/ImageAttach";
import { LinkAttach } from "@/components/LinkAttach";
import {
  CONTENT_LIMITS,
  type ComposeMedia,
} from "@/lib/types/content";
import type { Side } from "@/lib/types";

const MAX_CHARS = CONTENT_LIMITS.opinion;

type WieldBarProps = {
  open: boolean;
  side: Side | null;
  onClose: () => void;
  onSubmit: (text: string, media?: ComposeMedia) => void;
};

/** 오늘의 글(진술) 작성 — 잠정 500자 · 이미지≤3 · 링크 스텁 */
export function WieldBar({ open, side, onClose, onSubmit }: WieldBarProps) {
  const [text, setText] = useState("");
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [link, setLink] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const remaining = MAX_CHARS - text.length;
  const canSubmit = text.trim().length > 0 && text.length <= MAX_CHARS;

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => textareaRef.current?.focus(), 80);
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
    for (const p of previews) URL.revokeObjectURL(p.url);
    setPreviews([]);
    setLink("");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clear only when closing
  }, [open]);

  if (!open) return null;

  const clearMedia = () => {
    for (const p of previews) URL.revokeObjectURL(p.url);
    setPreviews([]);
    setLink("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const media: ComposeMedia = {
      imageNames: previews.map((p) => p.name),
      link: link.trim() || undefined,
    };
    onSubmit(
      text.trim(),
      media.imageNames?.length || media.link ? media : undefined,
    );
    setText("");
    clearMedia();
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
        aria-label="오늘의 글 작성"
        className="sheet-up relative z-10 max-h-[92dvh] w-full max-w-[560px] overflow-y-auto border border-white/20 border-b-0 bg-black px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:border-b sm:pb-4"
        data-compose="opinion"
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
            오늘의 글
          </p>
          <span className="min-w-10" />
        </div>

        <form onSubmit={handleSubmit}>
          <p
            className="mb-2 border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[11px] leading-snug tracking-[0.02em] text-white/70"
            role="note"
            aria-label="작성 규칙 팁"
          >
            글은 여러 번 가능 · 하루 한 진영에서만 · 연속 작성 3분 쿨다운
          </p>
          <div className="mb-2 flex items-center justify-between text-[11px] text-muted">
            <span>
              {side ? `${side}로 진술` : "미참전 시 NEXUS로 제출"}
            </span>
            <span
              className={`tabular-nums ${
                remaining < 40 ? "text-white" : "text-dim"
              }`}
              data-char-counter
              aria-label={`글자 수 ${text.length} / ${MAX_CHARS}`}
            >
              {text.length}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            rows={5}
            maxLength={MAX_CHARS}
            placeholder="오늘 아레나에 남길 의견을 입력하세요"
            className="w-full resize-none border border-white/25 bg-black px-3 py-3 text-[15px] leading-relaxed text-white placeholder:text-dim focus:border-white focus:outline-none"
            aria-label="오늘의 글 입력"
          />
          <ImageAttach
            previews={previews}
            onAdd={(file, url) =>
              setPreviews((prev) =>
                prev.length >= CONTENT_LIMITS.images
                  ? prev
                  : [...prev, { url, name: file.name }],
              )
            }
            onRemove={(index) =>
              setPreviews((prev) => {
                const next = [...prev];
                const [gone] = next.splice(index, 1);
                if (gone) URL.revokeObjectURL(gone.url);
                return next;
              })
            }
          />
          <LinkAttach value={link} onChange={setLink} />
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-3 flex h-11 w-full items-center justify-center border border-white bg-white text-sm font-bold tracking-[0.08em] text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
          >
            진술 제출
          </button>
        </form>
      </div>
    </div>
  );
}
