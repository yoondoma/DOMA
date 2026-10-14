"use client";

import { useEffect, useState } from "react";

export type EditableProfile = {
  name: string;
  handle: string;
  bio: string;
  avatarChar: string;
};

type SettingsSheetProps = {
  open: boolean;
  profile: EditableProfile;
  onClose: () => void;
  onSave: (next: EditableProfile) => void;
  onToast?: (message: string) => void;
};

const ROWS: { id: string; label: string; hint?: string }[] = [
  { id: "account", label: "계정", hint: "로그인·연동" },
  { id: "notify", label: "알림", hint: "전투·멘션" },
  { id: "privacy", label: "공개 범위", hint: "프로필·글" },
  { id: "blocked", label: "차단 목록" },
  { id: "about", label: "DOMA 정보" },
];

/**
 * 본인 프로필 설정 — 풀스크린 전환 (시트 아님)
 * Pure B&W · 넓은 입력 · 스크롤
 */
export function SettingsSheet({
  open,
  profile,
  onClose,
  onSave,
  onToast,
}: SettingsSheetProps) {
  const [draft, setDraft] = useState<EditableProfile>(profile);

  useEffect(() => {
    if (open) setDraft(profile);
  }, [open, profile]);

  if (!open) return null;

  const save = () => {
    const next: EditableProfile = {
      name: draft.name.trim() || profile.name,
      handle: draft.handle.trim().replace(/^@/, "") || profile.handle,
      bio: draft.bio.trim(),
      avatarChar: (draft.avatarChar.trim() || draft.name || profile.name).slice(
        0,
        1,
      ),
    };
    onSave(next);
    onToast?.("설정을 저장했습니다");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-center bg-black text-white"
      role="dialog"
      aria-modal
      aria-label="설정"
    >
      <div className="flex h-dvh w-full max-w-[560px] flex-col border-x border-neutral-800">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-800 bg-black px-3 py-3">
          <button
            type="button"
            onClick={onClose}
            className="px-1 py-1 text-[14px] text-neutral-200"
            aria-label="뒤로"
          >
            ← 뒤로
          </button>
          <p className="flex-1 text-center text-[12px] font-bold tracking-[0.18em]">
            설정
          </p>
          <button
            type="button"
            onClick={save}
            className="px-1 py-1 text-[14px] text-white underline underline-offset-4"
          >
            저장
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6">
          <p className="text-[11px] font-bold tracking-[0.16em] text-neutral-200">
            프로필
          </p>

          <div className="mt-5 flex flex-col items-center">
            <div
              className="flex size-20 items-center justify-center border border-neutral-200 text-[28px] font-bold"
              aria-hidden
            >
              {(draft.avatarChar || draft.name || "?").slice(0, 1)}
            </div>
            <label className="mt-3 w-full max-w-[12rem] text-center">
              <span className="text-[11px] tracking-[0.1em] text-neutral-200">
                아바타 이니셜
              </span>
              <input
                value={draft.avatarChar}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    avatarChar: e.target.value.slice(0, 1),
                  }))
                }
                className="mt-1 w-full border-b border-neutral-200 bg-transparent py-2 text-center text-[20px] font-bold text-white outline-none"
                maxLength={1}
              />
            </label>
          </div>

          <label className="mt-8 block">
            <span className="text-[11px] tracking-[0.1em] text-neutral-200">
              이름
            </span>
            <input
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
              className="mt-2 w-full border-b border-neutral-200 bg-transparent py-3 text-[18px] text-white outline-none"
              maxLength={24}
              autoComplete="nickname"
            />
          </label>

          <label className="mt-6 block">
            <span className="text-[11px] tracking-[0.1em] text-neutral-200">
              핸들
            </span>
            <div className="mt-2 flex items-center border-b border-neutral-200">
              <span className="text-[16px] text-neutral-200">@</span>
              <input
                value={draft.handle}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, handle: e.target.value }))
                }
                className="w-full bg-transparent py-3 pl-1 text-[16px] text-white outline-none"
                maxLength={24}
                autoComplete="username"
              />
            </div>
          </label>

          <label className="mt-6 block">
            <span className="text-[11px] tracking-[0.1em] text-neutral-200">
              바이오
            </span>
            <textarea
              value={draft.bio}
              onChange={(e) =>
                setDraft((d) => ({ ...d, bio: e.target.value }))
              }
              rows={5}
              className="mt-2 w-full resize-none border border-neutral-800 bg-transparent px-3 py-3 text-[15px] leading-[1.55] text-white outline-none focus:border-neutral-200"
              maxLength={160}
            />
            <span className="mt-1 block text-right text-[11px] tabular-nums text-neutral-200">
              {draft.bio.length}/160
            </span>
          </label>

          <div className="mt-10 border-t border-neutral-800 pt-2">
            <p className="py-3 text-[11px] font-bold tracking-[0.16em] text-neutral-200">
              일반
            </p>
            <ul>
              {ROWS.map((row) => (
                <li key={row.id} className="border-b border-neutral-800">
                  <button
                    type="button"
                    className="flex w-full items-baseline justify-between gap-3 py-3.5 text-left"
                    onClick={() => onToast?.(`${row.label} — 곧 연결`)}
                  >
                    <span className="text-[14px] text-white">{row.label}</span>
                    {row.hint ? (
                      <span className="text-[12px] text-neutral-200">
                        {row.hint}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
              <li className="border-b border-neutral-800">
                <button
                  type="button"
                  className="w-full py-3.5 text-left text-[14px] text-neutral-200"
                  onClick={() => onToast?.("로그아웃은 목업입니다")}
                >
                  로그아웃
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
