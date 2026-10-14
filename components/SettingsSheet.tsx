"use client";

type SettingsSheetProps = {
  open: boolean;
  onClose: () => void;
  onToast?: (message: string) => void;
};

const ROWS: { id: string; label: string; hint?: string }[] = [
  { id: "account", label: "계정", hint: "로그인·연동" },
  { id: "notify", label: "알림", hint: "전투·멘션" },
  { id: "privacy", label: "공개 범위", hint: "프로필·글" },
  { id: "blocked", label: "차단 목록" },
  { id: "about", label: "DOMA 정보" },
];

/** 본인 프로필 헤더 톱니 → 설정 시트 · Pure B&W 텍스트 */
export function SettingsSheet({
  open,
  onClose,
  onToast,
}: SettingsSheetProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 sm:items-center"
      role="dialog"
      aria-modal
      aria-label="설정"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="sheet-up relative z-10 flex max-h-[88dvh] w-full max-w-[560px] flex-col overflow-hidden border-t border-neutral-200 bg-black text-white sm:border">
        <div className="flex items-center px-4 py-3">
          <p className="text-[12px] font-bold tracking-[0.18em]">설정</p>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-[13px] text-neutral-200"
            aria-label="닫기"
          >
            닫기
          </button>
        </div>

        <ul className="overflow-y-auto border-t border-neutral-800 pb-6">
          {ROWS.map((row) => (
            <li key={row.id} className="border-b border-neutral-800">
              <button
                type="button"
                className="flex w-full items-baseline justify-between gap-3 px-4 py-3.5 text-left"
                onClick={() => {
                  onToast?.(`${row.label} — 곧 연결`);
                  onClose();
                }}
              >
                <span className="text-[14px] text-white">{row.label}</span>
                {row.hint ? (
                  <span className="text-[12px] text-neutral-200">{row.hint}</span>
                ) : null}
              </button>
            </li>
          ))}
          <li className="border-b border-neutral-800">
            <button
              type="button"
              className="w-full px-4 py-3.5 text-left text-[14px] text-neutral-200"
              onClick={() => {
                onToast?.("로그아웃은 목업입니다");
                onClose();
              }}
            >
              로그아웃
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
