"use client";

import { useRef } from "react";

type ImageAttachProps = {
  previewUrl: string | null;
  onPick: (file: File, previewUrl: string) => void;
  onClear: () => void;
};

/** 이미지 첨부만 (영상 불가) */
export function ImageAttach({ previewUrl, onPick, onClear }: ImageAttachProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return;
    }
    const url = URL.createObjectURL(file);
    onPick(file, url);
  };

  return (
    <div className="mt-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="이미지 첨부"
        onChange={handleChange}
      />
      {previewUrl ? (
        <div className="relative border border-white/20">
          <img
            src={previewUrl}
            alt="첨부 이미지 미리보기"
            className="max-h-48 w-full object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-2 border border-white/40 bg-black/80 px-2 py-1 text-[11px] text-white"
            aria-label="첨부 이미지 제거"
          >
            제거
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-11 w-full items-center justify-center gap-2 border border-dashed border-white/30 text-[13px] text-muted"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect
              x="3.75"
              y="5.5"
              width="16.5"
              height="13"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="9" cy="10" r="1.6" fill="currentColor" />
            <path
              d="M4.5 16.5 9 12.5l3 2.5 3.5-4 4 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          이미지 첨부 · 영상 불가
        </button>
      )}
    </div>
  );
}
