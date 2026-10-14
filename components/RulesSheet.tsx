"use client";

type RulesSheetProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * 규칙 — 하고 싶게. 스펙 나열 금지.
 * 코어 한 장: docs/rules-copy.md
 */
export function RulesSheet({ open, onClose }: RulesSheetProps) {
  if (!open) return null;

  const lines = [
    "오늘 하나에 도전·방어로 겨룬다.",
    "지지가 판결이다. 좋아요와 다르다.",
    "시간이 끝나면 의견이 갈린다.",
    "글·팔로우·공유는 평소처럼.",
    "이기면 티어·칭호가 남는다.",
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="규칙 시트 닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="규칙"
        data-rules-sheet
        className="sheet-up relative z-10 w-full max-w-[560px] border border-white/20 border-b-0 bg-black px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 text-white sm:border-b sm:pb-6"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/30 sm:hidden" />
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 px-1 text-sm text-muted"
          >
            닫기
          </button>
          <p className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.14em]">
            DOMA
          </p>
          <span className="min-w-10" aria-hidden />
        </div>

        <p className="text-center font-[family-name:var(--font-display)] text-[15px] font-bold tracking-[-0.01em] text-white">
          현재 대한민국의 의견은?
        </p>
        <p className="mt-2 text-center text-[12px] tracking-[0.04em] text-white/45">
          펜은 칼보다 강하다
        </p>

        <ul className="mt-6 space-y-3" aria-label="규칙">
          {lines.map((line) => (
            <li
              key={line}
              className="text-center font-[family-name:var(--font-syne)] text-[15px] font-bold leading-snug tracking-[-0.01em] text-white"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
