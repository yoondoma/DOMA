"use client";

import { StatusBlock } from "@/components/StatusBlock";
import type { FollowUser } from "@/lib/profile-mock";
import type { UiDemo } from "@/lib/ui-demo";

type FollowListScreenProps = {
  open: boolean;
  mode: "following" | "followers";
  users: FollowUser[];
  onClose: () => void;
  uiDemo?: UiDemo;
  onRetry?: () => void;
};

/** Threads형 팔로잉/팔로워 목록 · Pure B&W */
export function FollowListScreen({
  open,
  mode,
  users,
  onClose,
  uiDemo = "normal",
  onRetry,
}: FollowListScreenProps) {
  if (!open) return null;
  const title = mode === "following" ? "팔로잉" : "팔로워";
  const list = uiDemo === "empty" ? [] : users;
  const emptyMessage =
    mode === "following"
      ? "아직 팔로잉이 없습니다."
      : "아직 팔로워가 없습니다.";

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-center bg-black text-white"
      role="dialog"
      aria-modal
      aria-label={title}
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
            {title}
          </p>
          <span className="w-12" aria-hidden />
        </header>

        {uiDemo === "loading" ? (
          <StatusBlock kind="loading" message="불러오는 중" />
        ) : uiDemo === "error" ? (
          <StatusBlock
            kind="error"
            message="목록을 불러오지 못했습니다."
            actionLabel="다시 시도"
            onAction={onRetry}
          />
        ) : list.length === 0 ? (
          <StatusBlock kind="empty" message={emptyMessage} />
        ) : (
          <ul className="flex-1 overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            {list.map((u) => (
              <li
                key={u.id}
                className="flex items-start gap-3 border-b border-neutral-800 px-4 py-3.5"
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center border border-neutral-200 text-[13px] font-bold"
                  aria-hidden
                >
                  {u.name.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold">{u.name}</p>
                  <p className="text-[12px] text-neutral-200">@{u.handle}</p>
                  <p className="mt-1 text-[13px] leading-snug text-neutral-200">
                    {u.bio}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
