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
};

/** Threads형 골격 · 칭호 위 · 글 아래 · 텍스트·얇은 선만 */
export function ProfileScreen({ onOpenShareCard }: ProfileScreenProps) {
  const [tab, setTab] = useState<ProfileTab>("posts");
  const [viralTitle, setViralTitle] = useState<DailyTitle | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const u = PROFILE_USER;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
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
                {u.name}
              </h2>
              <p className="mt-1.5 text-[14px] text-neutral-200">@{u.handle}</p>
            </div>
            <div
              className="flex size-14 shrink-0 items-center justify-center border border-neutral-200 text-[18px] font-bold tracking-wide"
              aria-hidden
            >
              {u.name.slice(0, 1)}
            </div>
          </div>

          <p className="mt-4 text-[14px] leading-[1.55] text-white">{u.bio}</p>

          <p className="mt-3 text-[13px] text-neutral-200">
            <span className="font-semibold tabular-nums text-white">
              {u.following}
            </span>{" "}
            팔로잉
            <span className="mx-2 text-neutral-800">·</span>
            <span className="font-semibold tabular-nums text-white">
              {u.followers}
            </span>{" "}
            팔로워
          </p>

          {/* 위 = 칭호 */}
          <div className="mt-5 border-t border-neutral-800 pt-4">
            <UserProfileCard
              user={PROFILE_GAMER}
              onPropagateTitle={setViralTitle}
            />
          </div>
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
                    {u.name}
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
            username: PROFILE_GAMER.username,
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
