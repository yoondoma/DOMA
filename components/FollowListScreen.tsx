"use client";

import { useMemo } from "react";
import { StatusBlock } from "@/components/StatusBlock";
import { domaStore, useDomaStore, useSession } from "@/lib/store";
import type { FollowUser } from "@/lib/profile-mock";
import type { UiDemo } from "@/lib/ui-demo";
import { userIdFromHandle } from "@/lib/types/ids";

type FollowListScreenProps = {
  open: boolean;
  mode: "following" | "followers";
  /** 레거시 prop — 스토어 목록 우선, empty 시 폴백 */
  users?: FollowUser[];
  /** 목록 기준 유저 핸들 (기본: 세션) */
  profileHandle?: string;
  onClose: () => void;
  uiDemo?: UiDemo;
  onRetry?: () => void;
};

/** Threads형 팔로잉/팔로워 목록 · Pure B&W · 스토어 토글 */
export function FollowListScreen({
  open,
  mode,
  users: legacyUsers,
  profileHandle,
  onClose,
  uiDemo = "normal",
  onRetry,
}: FollowListScreenProps) {
  const snap = useDomaStore();
  const { user: me } = useSession();

  const profileUserId = useMemo(() => {
    if (profileHandle) {
      return (
        snap.users.find((u) => u.handle === profileHandle.replace(/^@/, ""))
          ?.id ?? userIdFromHandle(profileHandle)
      );
    }
    return me?.id ?? null;
  }, [profileHandle, snap.users, me?.id]);

  const list = useMemo(() => {
    if (uiDemo === "empty") return [];
    if (!profileUserId) {
      return (legacyUsers ?? []).map((u) => ({
        id: u.id,
        handle: u.handle,
        displayName: u.name,
        bio: u.bio,
      }));
    }
    const blocked = new Set(
      (snap.blocks ?? [])
        .filter((b) => b.blockerId === me?.id)
        .map((b) => b.blockedId),
    );
    const ids = new Set(
      snap.follows
        .filter((f) =>
          mode === "following"
            ? f.followerId === profileUserId
            : f.followeeId === profileUserId,
        )
        .map((f) => (mode === "following" ? f.followeeId : f.followerId))
        .filter((id) => !blocked.has(id)),
    );
    const rows = snap.users.filter((u) => ids.has(u.id));
    if (rows.length > 0) {
      return rows.map((u) => ({
        id: u.id,
        handle: u.handle,
        displayName: u.displayName,
        bio: u.bio,
      }));
    }
    return (legacyUsers ?? []).map((u) => ({
      id: snap.users.find((x) => x.handle === u.handle)?.id ?? u.id,
      handle: u.handle,
      displayName: u.name,
      bio: u.bio,
    }));
  }, [
    uiDemo,
    profileUserId,
    mode,
    legacyUsers,
    snap.follows,
    snap.users,
    snap.blocks,
    me?.id,
  ]);

  if (!open) return null;
  const title = mode === "following" ? "팔로잉" : "팔로워";
  const emptyMessage =
    mode === "following"
      ? "아직 팔로잉이 없습니다."
      : "아직 팔로워가 없습니다.";

  const toggle = (userId: string, handle: string) => {
    if (!me) return;
    // legacy id면 handle로 해석
    const followeeId = userId.startsWith("usr_")
      ? userId
      : (snap.users.find((u) => u.handle === handle)?.id ??
        userIdFromHandle(handle));
    try {
      // 스토어에 유저가 없으면 시드에 추가하지 않고 handle 기반 id 사용
      if (!snap.users.some((u) => u.id === followeeId)) {
        // ensure user exists via login list — skip if missing
        const ensured = snap.users.find((u) => u.handle === handle);
        if (!ensured) return;
        domaStore.toggleFollow(ensured.id);
        return;
      }
      domaStore.toggleFollow(followeeId);
    } catch {
      /* session */
    }
  };

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
            {list.map((u) => {
              const followeeId = u.id.startsWith("usr_")
                ? u.id
                : (snap.users.find((x) => x.handle === u.handle)?.id ?? u.id);
              const following =
                me != null &&
                followeeId.startsWith("usr_") &&
                domaStore.isFollowing(followeeId);
              const isSelf = me?.id === followeeId;
              return (
                <li
                  key={u.id + u.handle}
                  className="flex items-start gap-3 border-b border-neutral-800 px-4 py-3.5"
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center border border-neutral-200 text-[13px] font-bold"
                    aria-hidden
                  >
                    {u.displayName.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold">{u.displayName}</p>
                    <p className="text-[12px] text-neutral-200">@{u.handle}</p>
                    <p className="mt-1 text-[13px] leading-snug text-neutral-200">
                      {u.bio}
                    </p>
                  </div>
                  {!isSelf && me ? (
                    <button
                      type="button"
                      onClick={() => toggle(followeeId, u.handle)}
                      className={`mt-1 shrink-0 border px-3 py-1.5 text-[11px] tracking-[0.08em] ${
                        following
                          ? "border-neutral-600 text-neutral-200"
                          : "border-white bg-white text-black"
                      }`}
                      aria-pressed={following}
                      aria-label={following ? "언팔로우" : "팔로우"}
                    >
                      {following ? "팔로잉" : "팔로우"}
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
