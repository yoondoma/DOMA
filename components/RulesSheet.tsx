"use client";

type RulesSheetProps = {
  open: boolean;
  onClose: () => void;
};

const ROWS: { act: string; limit: string }[] = [
  { act: "오늘 의견", limit: "하루 1개" },
  { act: "내일 주제 제안", limit: "하루 1개" },
  { act: "진영 지지", limit: "한쪽에 1개" },
  { act: "진영 이동", limit: "판결 전 최대 3회" },
  { act: "좋아요", limit: "하루 5개" },
];

/**
 * 전투 규칙 — 짧은 B&W 시트. 의지 있는 사람만 열람.
 * 첫 진입 광고형 팝업 아님.
 */
export function RulesSheet({ open, onClose }: RulesSheetProps) {
  if (!open) return null;

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
        aria-label="전투 규칙"
        className="sheet-up relative z-10 w-full max-w-[560px] border border-white/20 border-b-0 bg-black px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 text-white sm:border-b sm:pb-5"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/30 sm:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 px-1 text-sm text-muted"
          >
            닫기
          </button>
          <p className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em]">
            전투 규칙
          </p>
          <span className="min-w-10" aria-hidden />
        </div>

        <p className="text-[13px] leading-[1.55] text-white/70">
          판결은 좋아요가 아니라{" "}
          <span className="text-white">지지 추천(진영)</span>으로만 정해집니다.
        </p>

        <ul className="mt-4 border-t border-white/15" aria-label="일일 한도">
          {ROWS.map((r) => (
            <li
              key={r.act}
              className="flex items-baseline justify-between gap-3 border-b border-white/10 py-2.5 text-[13px]"
            >
              <span className="text-white/85">{r.act}</span>
              <span className="tabular-nums tracking-[0.04em] text-white">
                {r.limit}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[11px] leading-[1.5] tracking-[0.04em] text-white/45">
          좋아요가 많은 의견이 있어도, 지지가 더 많은 진영이 이길 수 있습니다.
        </p>
      </div>
    </div>
  );
}
