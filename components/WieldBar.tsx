"use client";

import { useState } from "react";
import type { Side } from "@/lib/types";

const MAX_CHARS = 280;

type WieldBarProps = {
  side: Side | null;
  onSubmit: (text: string) => void;
  toast: string | null;
};

export function WieldBar({ side, onSubmit, toast }: WieldBarProps) {
  const [text, setText] = useState("");
  const remaining = MAX_CHARS - text.length;
  const canSubmit = text.trim().length > 0 && text.length <= MAX_CHARS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/30 bg-black/98 backdrop-blur-sm">
      {toast ? (
        <div
          className="mx-auto max-w-3xl border-b border-white/20 px-3 py-1.5 text-center text-[11px] font-medium tracking-wide text-white sm:px-4"
          role="status"
        >
          {toast}
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-[10px] tracking-wide text-muted">
            <span>
              {side
                ? `${side}로 진술`
                : "참전 후 진술 · 미참전 시 NEXUS로 제출"}
            </span>
            <span
              className={`tabular-nums ${
                remaining < 20 ? "text-white" : "text-dim"
              }`}
            >
              {text.length}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            rows={2}
            maxLength={MAX_CHARS}
            placeholder="280자 이내로 진술을 입력하세요"
            className="w-full resize-none border border-white/40 bg-black px-2.5 py-2 text-sm text-white placeholder:text-dim focus:border-white focus:outline-none"
            aria-label="진술 입력"
          />
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-[4.25rem] shrink-0 border border-white bg-white px-3 text-[11px] font-bold tracking-[0.12em] text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-35 sm:h-[4.5rem] sm:px-4 sm:text-xs"
        >
          진술
          <br />
          제출
        </button>
      </form>
    </div>
  );
}
