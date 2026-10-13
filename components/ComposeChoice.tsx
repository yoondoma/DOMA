"use client";

export type ComposeKind = "today" | "tomorrow";

type ComposeChoiceProps = {
  open: boolean;
  onClose: () => void;
  onPick: (kind: ComposeKind) => void;
};

/** (+) → 오늘 글 / 내일 주제 선택 */
export function ComposeChoice({ open, onClose, onPick }: ComposeChoiceProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="선택 시트 닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="작성 선택"
        className="sheet-up relative z-10 w-full max-w-[560px] border border-white/20 border-b-0 bg-black px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:border-b sm:pb-4"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/30 sm:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 px-1 text-sm text-muted hover:text-white"
          >
            취소
          </button>
          <p className="font-[family-name:var(--font-syne)] text-sm font-bold tracking-wide">
            무엇을 쓸까요
          </p>
          <span className="min-w-10" />
        </div>

        <div className="space-y-2" role="list">
          <button
            type="button"
            onClick={() => onPick("today")}
            className="flex w-full flex-col items-start border border-white/25 px-4 py-4 text-left active:bg-white/5"
          >
            <span className="text-[14px] font-bold tracking-[0.06em]">
              오늘의 글
            </span>
            <span className="mt-1 text-[12px] leading-snug text-muted">
              지금 아레나에 의견·진술을 남깁니다
            </span>
          </button>
          <button
            type="button"
            onClick={() => onPick("tomorrow")}
            className="flex w-full flex-col items-start border border-white/25 px-4 py-4 text-left active:bg-white/5"
          >
            <span className="text-[14px] font-bold tracking-[0.06em]">
              내일의 주제
            </span>
            <span className="mt-1 text-[12px] leading-snug text-muted">
              내일 토론 후보 주제를 제안합니다
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
