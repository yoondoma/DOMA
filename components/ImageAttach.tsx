"use client";

import { useRef } from "react";
import { CONTENT_LIMITS } from "@/lib/types/content";

export type ImagePreview = {
  url: string;
  name: string;
};

type ImageAttachProps = {
  previews: ImagePreview[];
  onAdd: (file: File, previewUrl: string) => void;
  onRemove: (index: number) => void;
  max?: number;
};

/** 이미지 최대 3장 · 영상 불가 */
export function ImageAttach({
  previews,
  onAdd,
  onRemove,
  max = CONTENT_LIMITS.images,
}: ImageAttachProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const full = previews.length >= max;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    let room = max - previews.length;
    for (const file of files) {
      if (room <= 0) break;
      if (!file.type.startsWith("image/")) continue;
      onAdd(file, URL.createObjectURL(file));
      room -= 1;
    }
  };

  return (
    <div className="mt-3" data-image-attach>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-label="이미지 첨부"
        onChange={handleChange}
      />
      {previews.length > 0 ? (
        <ul className="grid grid-cols-3 gap-1.5" aria-label="첨부 이미지">
          {previews.map((p, i) => (
            <li key={`${p.url}-${i}`} className="relative border border-white/20">
              <img
                src={p.url}
                alt={`첨부 ${i + 1}`}
                className="aspect-square w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute right-1 top-1 border border-white/40 bg-black/80 px-1.5 py-0.5 text-[10px] text-white"
                aria-label={`첨부 ${i + 1} 제거`}
              >
                제거
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        disabled={full}
        onClick={() => inputRef.current?.click()}
        className="mt-1.5 flex h-11 w-full items-center justify-center gap-2 border border-dashed border-white/30 text-[13px] text-muted disabled:opacity-40"
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
        {full
          ? `이미지 최대 ${max}장`
          : `이미지 첨부 ${previews.length}/${max} · 영상 불가`}
      </button>
    </div>
  );
}
