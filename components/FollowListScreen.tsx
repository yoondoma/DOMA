"use client";

import type { FollowUser } from "@/lib/profile-mock";

type FollowListScreenProps = {
  open: boolean;
  mode: "following" | "followers";
  users: FollowUser[];
  onClose: () => void;
};

/** Threads형 팔로잉/팔로워 목록 · Pure B&W */
export function FollowListScreen({
  open,
  mode,
  users,
  onClose,
}: FollowListScreenProps) {
  if (!open) return null;
  const title = mode === "following" ? "팔로잉" : "팔로워";

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

        <ul className="flex-1 overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {users.map((u) => (
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
      </div>
    </div>
  );
}
