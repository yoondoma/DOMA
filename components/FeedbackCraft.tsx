"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "doma.beta.feedback.v1";
const MAX_LEN = 120;

type FeedbackInviteProps = {
  /** gate = 입장 · arena = 전장 intro · settings = 목록용 */
  tone?: "gate" | "arena" | "settings";
  onToast?: (message: string) => void;
  className?: string;
};

type StoredFeedback = {
  text: string;
  at: string;
};

function PenDuelMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      {/* 맞선 펜 — 결투/의견 초대 */}
      <path
        d="M5.2 18.8 9.6 6.2l2 .7-4.4 12.6-2.2-.7Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path
        d="M18.8 18.8 14.4 6.2l-2 .7 4.4 12.6 2.2-.7Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.2" r="1.35" fill="currentColor" />
    </svg>
  );
}

function loadLatest(): StoredFeedback | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const list = JSON.parse(raw) as StoredFeedback[];
    return list[list.length - 1] ?? null;
  } catch {
    return null;
  }
}

function saveFeedback(text: string) {
  const entry: StoredFeedback = {
    text,
    at: new Date().toISOString(),
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: StoredFeedback[] = raw ? JSON.parse(raw) : [];
    list.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-40)));
  } catch {
    /* ignore */
  }
}

type SheetProps = {
  open: boolean;
  onClose: () => void;
  onToast?: (message: string) => void;
};

/** 한 줄 의견 시트 — 보내기=로컬 저장+토스트. 메일 보조 */
export function FeedbackSheet({ open, onClose, onToast }: SheetProps) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!open) return;
    setDraft("");
  }, [open]);

  if (!open) return null;

  const send = () => {
    const text = draft.trim();
    if (!text) {
      onToast?.("한 줄을 남겨 주세요");
      return;
    }
    saveFeedback(text);
    onToast?.("증명됨");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/75"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="베타 의견"
        data-feedback-sheet
        className="sheet-up r-sheet relative z-10 w-full max-w-[560px] border border-edge border-b-0 bg-ink px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 text-paper sm:border-b sm:pb-5"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/25 sm:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 px-1 text-sm text-meta"
          >
            닫기
          </button>
          <div className="flex items-center gap-1.5 text-paper/80">
            <PenDuelMark size={18} />
            <span className="font-[family-name:var(--font-display)] text-[14px] font-bold tracking-[-0.02em]">
              한 줄
            </span>
          </div>
          <span className="min-w-10" />
        </div>

        <p className="mb-3 text-center font-[family-name:var(--font-display)] text-[15px] tracking-[-0.02em] text-paper/75">
          현재 대한민국의 의견은?
        </p>

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, MAX_LEN))}
          maxLength={MAX_LEN}
          placeholder="터치하여 증명"
          className="r-md w-full border border-edge bg-card px-3 py-3 text-[15px] leading-[1.6] tracking-[-0.02em] text-paper outline-none placeholder:text-meta focus:border-white/25"
          aria-label="베타 의견 한 줄"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <p className="mt-1.5 text-right text-[11px] tabular-nums text-meta">
          {draft.length}/{MAX_LEN}
        </p>

        <button
          type="button"
          onClick={send}
          className="thumb-press r-md mt-4 flex h-11 w-full items-center justify-center gap-2 border border-edge bg-card text-[13px] font-semibold tracking-[0.1em] text-paper"
          data-feedback-send
        >
          <PenDuelMark size={16} />
          보내기
        </button>

        <p className="mt-3 text-center text-[11px] text-meta">
          <a
            href="mailto:feedback@doma.kr?subject=DOMA%20beta"
            className="underline-offset-2 hover:text-paper/70 hover:underline"
          >
            feedback@doma.kr
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * 전장 톤 피드백 초대 — 탭 → 시트.
 * 기계적 mailto 한 줄 대신 결투/의견 초대.
 */
export function FeedbackInvite({
  tone = "arena",
  onToast,
  className = "",
}: FeedbackInviteProps) {
  const [open, setOpen] = useState(false);

  const label =
    tone === "gate"
      ? "터치하여 증명"
      : tone === "settings"
        ? "의견"
        : "터치하여 증명";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`thumb-press group inline-flex items-center justify-center gap-2 ${
          tone === "gate"
            ? "mt-10 flex-col text-paper/55"
            : tone === "settings"
              ? "w-full justify-start gap-3 py-3.5 text-left"
              : "mx-auto my-3 r-md border border-edge bg-card/80 px-3.5 py-2.5 text-paper/70"
        } ${className}`}
        aria-label="베타 의견 남기기"
        data-beta-feedback
        data-feedback-invite
      >
        <PenDuelMark size={tone === "gate" ? 26 : 18} />
        <span
          className={
            tone === "gate"
              ? "mt-2 text-[11px] tracking-[0.16em]"
              : tone === "settings"
                ? "text-[15px] text-white"
                : "font-[family-name:var(--font-display)] text-[12px] tracking-[-0.01em]"
          }
        >
          {label}
        </span>
        {tone === "settings" ? (
          <span className="ml-auto text-[12px] text-neutral-200">한 줄</span>
        ) : null}
      </button>
      <FeedbackSheet
        open={open}
        onClose={() => setOpen(false)}
        onToast={onToast}
      />
    </>
  );
}

/** 설정 등에서 시트만 열 때 */
export function useFeedbackLatest(): StoredFeedback | null {
  const [v, setV] = useState<StoredFeedback | null>(null);
  useEffect(() => {
    setV(loadLatest());
  }, []);
  return v;
}
