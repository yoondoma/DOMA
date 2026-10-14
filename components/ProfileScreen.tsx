"use client";

import { useState } from "react";
import {
  TierBadge,
  UserProfileCard,
  ViralShareCard,
} from "@/components/gamification";
import {
  PROFILE_GAMER,
  PROFILE_POSTS,
  PROFILE_RECENT_BATTLES,
  PROFILE_USER,
} from "@/lib/profile-mock";
import type { DailyTitle } from "@/lib/types/gamification";

type ProfileTab = "posts" | "battles";

type ProfileScreenProps = {
  onOpenShareCard?: () => void;
  /** 하단 탭 = 본인 프로필. 남 프로필 조회 시 false */
  isSelf?: boolean;
};

type DraftProfile = {
  name: string;
  handle: string;
  bio: string;
  avatarChar: string;
};

/** Threads형 · 본인=개인설정 · 칭호 위 · 글 아래 */
export function ProfileScreen({
  onOpenShareCard,
  isSelf = true,
}: ProfileScreenProps) {
  const [tab, setTab] = useState<ProfileTab>("posts");
  const [viralTitle, setViralTitle] = useState<DailyTitle | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DraftProfile>({
    name: PROFILE_USER.name,
    handle: PROFILE_USER.handle,
    bio: PROFILE_USER.bio,
    avatarChar: PROFILE_USER.name.slice(0, 1),
  });
  const [saved, setSaved] = useState<DraftProfile>(draft);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const display = isSelf ? saved : {
    name: PROFILE_USER.name,
    handle: PROFILE_USER.handle,
    bio: PROFILE_USER.bio,
    avatarChar: PROFILE_USER.name.slice(0, 1),
  };

  const savePersonal = () => {
    const next = {
      ...draft,
      name: draft.name.trim() || saved.name,
      handle: draft.handle.trim().replace(/^@/, "") || saved.handle,
      bio: draft.bio.trim(),
      avatarChar: (draft.avatarChar.trim() || draft.name).slice(0, 1),
    };
    setSaved(next);
    setDraft(next);
    setEditing(false);
    showToast("개인설정을 저장했습니다");
  };

  return (
    <>
      <section
        className="mx-auto max-w-[560px] bg-black text-white"
        aria-label="프로필"
      >
        <div className="px-4 pb-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-[family-name:var(--font-syne)] text-[22px] font-bold leading-none tracking-tight">
                {display.name}
              </h2>
              <p className="mt-1.5 text-[14px] text-neutral-200">
                @{display.handle}
              </p>
            </div>
            <div
              className="flex size-14 shrink-0 items-center justify-center border border-neutral-200 text-[18px] font-bold tracking-wide"
              aria-hidden
            >
              {display.avatarChar}
            </div>
          </div>

          <p className="mt-4 text-[14px] leading-[1.55] text-white">
            {display.bio}
          </p>

          <p className="mt-3 text-[13px] text-neutral-200">
            <span className="font-semibold tabular-nums text-white">
              {PROFILE_USER.following}
            </span>{" "}
            팔로잉
            <span className="mx-2 text-neutral-800">·</span>
            <span className="font-semibold tabular-nums text-white">
              {PROFILE_USER.followers}
            </span>{" "}
            팔로워
          </p>

          {/* 위 = 칭호 */}
          <div className="mt-5 border-t border-neutral-800 pt-4">
            <UserProfileCard
              user={{
                ...PROFILE_GAMER,
                username: display.name,
              }}
              onPropagateTitle={isSelf ? setViralTitle : undefined}
            />
          </div>

          {/* 본인만 — 칭호와 글 탭 사이 개인설정 */}
          {isSelf ? (
            <div
              className="mt-5 border-t border-neutral-800 pt-4"
              aria-label="개인설정"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[11px] font-bold tracking-[0.16em] text-neutral-200">
                  개인설정
                </p>
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(saved);
                      setEditing(true);
                    }}
                    className="text-[11px] tracking-[0.12em] text-neutral-200 underline underline-offset-4"
                  >
                    편집
                  </button>
                ) : (
                  <div className="flex gap-3 text-[11px] tracking-[0.12em]">
                    <button
                      type="button"
                      onClick={() => {
                        setDraft(saved);
                        setEditing(false);
                      }}
                      className="text-neutral-200"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={savePersonal}
                      className="text-white underline underline-offset-4"
                    >
                      저장
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <div className="mt-3 space-y-3">
                  <label className="block">
                    <span className="text-[11px] tracking-[0.1em] text-neutral-200">
                      이름
                    </span>
                    <input
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, name: e.target.value }))
                      }
                      className="mt-1 w-full border-b border-neutral-200 bg-transparent py-1.5 text-[14px] text-white outline-none"
                      maxLength={24}
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] tracking-[0.1em] text-neutral-200">
                      핸들
                    </span>
                    <input
                      value={draft.handle}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, handle: e.target.value }))
                      }
                      className="mt-1 w-full border-b border-neutral-200 bg-transparent py-1.5 text-[14px] text-white outline-none"
                      maxLength={24}
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] tracking-[0.1em] text-neutral-200">
                      바이오
                    </span>
                    <textarea
                      value={draft.bio}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, bio: e.target.value }))
                      }
                      rows={2}
                      className="mt-1 w-full resize-none border-b border-neutral-200 bg-transparent py-1.5 text-[14px] leading-[1.45] text-white outline-none"
                      maxLength={120}
                    />
                  </label>
                  <label className="block">
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
                      className="mt-1 w-12 border-b border-neutral-200 bg-transparent py-1.5 text-center text-[16px] font-bold text-white outline-none"
                      maxLength={1}
                    />
                  </label>
                </div>
              ) : (
                <p className="mt-2 text-[13px] leading-[1.5] text-neutral-200">
                  이름 · 바이오 · 아바타를 고칠 수 있습니다.
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* 아래 = 글 / 전투 기록 */}
        <div
          className="grid grid-cols-2 border-y border-neutral-800"
          role="tablist"
          aria-label="프로필 탭"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "posts"}
            onClick={() => setTab("posts")}
            className={`py-2.5 text-[13px] tracking-[0.06em] ${
              tab === "posts"
                ? "border-b border-white text-white"
                : "text-neutral-200"
            }`}
          >
            글
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "battles"}
            onClick={() => setTab("battles")}
            className={`py-2.5 text-[13px] tracking-[0.06em] ${
              tab === "battles"
                ? "border-b border-white text-white"
                : "text-neutral-200"
            }`}
          >
            전투 기록
          </button>
        </div>

        {tab === "posts" ? (
          <ul aria-label="내 글" className="pb-4">
            {PROFILE_POSTS.map((p) => (
              <li
                key={p.id}
                className="border-b border-neutral-800 px-4 py-3.5"
              >
                <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-neutral-200">
                  <span className="text-[13px] font-semibold text-white">
                    {display.name}
                  </span>
                  <TierBadge
                    tier={PROFILE_GAMER.currentTier.code}
                    subTier={PROFILE_GAMER.currentTier.subtier}
                  />
                  <span>· {p.timeLabel}</span>
                </div>
                <p className="mt-1.5 text-[14px] leading-[1.5] text-white">
                  {p.text}
                </p>
                <p className="mt-2 text-[12px] tabular-nums text-neutral-200">
                  ♥ {p.likes}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <ul aria-label="최근 전투 기록" className="pb-4">
            {PROFILE_RECENT_BATTLES.map((b) => {
              const asChallenger = b.joinedAs === "NEXUS";
              const won = b.result === "win";
              return (
                <li
                  key={b.date}
                  className="border-b border-neutral-800 px-4 py-3.5"
                >
                  <div className="flex items-baseline justify-between gap-3 text-[12px] text-neutral-200">
                    <span>
                      {b.date.slice(5).replace("-", "/")} · 제 {b.round} 도마
                    </span>
                    <span className={won ? "text-white" : "text-neutral-200"}>
                      {won ? "승" : "패"} · {asChallenger ? "도전자" : "방어자"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[14px] leading-snug text-white">
                    {b.topic}
                  </p>
                  {onOpenShareCard && b.round === 411 ? (
                    <button
                      type="button"
                      onClick={onOpenShareCard}
                      className="mt-2 text-[11px] tracking-[0.12em] text-neutral-200 underline underline-offset-4"
                    >
                      증명 카드
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {viralTitle ? (
        <ViralShareCard
          open
          payload={{
            username: display.name,
            totalWins: PROFILE_GAMER.totalWins,
            tier: PROFILE_GAMER.currentTier,
            title: viralTitle,
          }}
          onClose={() => setViralTitle(null)}
          onToast={showToast}
        />
      ) : null}

      {toast ? (
        <div
          className="fixed inset-x-0 bottom-20 z-[80] flex justify-center px-4"
          role="status"
        >
          <p className="border border-neutral-200 bg-black px-3 py-2 text-[12px] text-white">
            {toast}
          </p>
        </div>
      ) : null}
    </>
  );
}
