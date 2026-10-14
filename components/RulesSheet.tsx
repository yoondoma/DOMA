"use client";

type RulesSheetProps = {
  open: boolean;
  onClose: () => void;
};

const ROWS: { act: string; limit: string }[] = [
  { act: "글·제안·댓글", limit: "여러 번 가능" },
  { act: "의견 지지", limit: "1개 · 그 진영으로 이동" },
  { act: "진영 이동", limit: "타 진영 지지 시 · 최대 3회" },
  { act: "좋아요", limit: "하루 5개 · 승패 무관" },
  { act: "글 진영", limit: "하루 한 진영만" },
];

/**
 * 전투 규칙 — 짧은 B&W 시트. 의지 있는 사람만 열람.
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
          지지 동점은 좋아요로 가리고, 둘 다 동점이면 공동 승리. 판결
          후엔 스크랩·공유만. 타이머는 3h→1m 압박. 판결·TOP·내일 확정은{" "}
          <span className="text-white">지지</span>만. 좋아요는 호응일 뿐
          승패와 무관합니다.
        </p>

        <ul className="mt-4 border-t border-white/15" aria-label="일일 한도">
          {ROWS.map((r) => (
            <li
              key={r.act}
              className="flex items-baseline justify-between gap-3 border-b border-white/10 py-2.5 text-[13px]"
            >
              <span className="text-white/85">{r.act}</span>
              <span className="max-w-[14em] text-right tabular-nums tracking-[0.04em] text-white">
                {r.limit}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[12px] leading-[1.55] text-white/70">
          <span className="text-white">제안자</span>(허리띠·영구)는 확정 주제
          원글만. 후보 TOP5는{" "}
          <span className="text-white">안건자</span>. 일일 칭호와 동시 가능.
        </p>

        <p className="mt-3 text-[12px] leading-[1.55] text-white/70">
          내일 주제는{" "}
          <span className="text-white">지지 1위 자동 확정</span> ·{" "}
          <span className="text-white">창/방패로 나뉠 수 있는 주제</span>
          만 제안하세요.
        </p>

        <p className="mt-3 text-[11px] leading-[1.5] tracking-[0.04em] text-white/45">
          23:00–08:00 셧다운 · DM·공유·스크랩만 가능
        </p>
      </div>
    </div>
  );
}
