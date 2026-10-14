"use client";

import { useState } from "react";
import {
  TierBadge,
  UserProfileCard,
  ViralShareCard,
} from "@/components/gamification";
import { ShieldMark, SideBadge, SpearMark } from "@/components/SideMarks";
import {
  PROFILE_AFFINITY,
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

function HeartMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 13.2S2.8 9.8 2.8 5.9A2.7 2.7 0 0 1 8 4.4 2.7 2.7 0 0 1 13.2 5.9C13.2 9.8 8 13.2 8 13.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AffinityBar({
  challengerPct,
  defenderPct,
}: {
  challengerPct: number;
  defenderPct: number;
}) {
  return (
    <div className="mt-3" aria-label="진영 성향">
      <div className="mb-1.5 flex items-center justify-between text-[11px] tracking-[0.06em]">
        <span className="inline-flex items-center gap-1 text-white">
          <SpearMark size={12} />
          도전자 {challengerPct}%
        </span>
        <span className="inline-flex items-center gap-1 text-white">
          방어자 {defenderPct}%
          <ShieldMark size={12} />
        </span>
      </div>
      <div className="flex h-2 w-full overflow-hidden border border-white/25">
        <div
          className="h-full bg-white"
          style={{ width: `${challengerPct}%` }}
          title="도전자 지지 성향"
        />
        <div
          className="h-full bg-neutral-700"
          style={{ width: `${defenderPct}%` }}
          title="방어자 지지 성향"
        />
      </div>
      <p className="mt-1.5 text-[10px] tracking-[0.12em] text-muted">
        흑=도전자 · 백=방어자 성향 시그널
      </p>
    </div>
  );
}

/** Threads/X형 기본 프로필 + 전투 기록·성향 */
export function ProfileScreen({ onOpenShareCard }: ProfileScreenProps) {
  const [tab, setTab] = useState<ProfileTab>("posts");
  const [viralTitle, setViralTitle] = useState<DailyTitle | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const a = PROFILE_AFFINITY;
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
      {/* Threads형 헤더 블록 */}
      <div className="px-4 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-[family-name:var(--font-syne)] text-[22px] font-bold leading-none tracking-tight">
              {u.name}
            </h2>
            <p className="mt-1.5 text-[14px] text-muted">@{u.handle}</p>
          </div>
          <div
            className="flex size-16 shrink-0 items-center justify-center border border-white text-[20px] font-bold tracking-wide"
            aria-hidden
          >
            {u.name.slice(0, 1)}
          </div>
        </div>

        <p className="mt-4 text-[14px] leading-[1.55] text-white/90">{u.bio}</p>
        <p className="mt-2 text-[12px] text-muted">{u.joinedLabel}</p>

        <UserProfileCard
          user={PROFILE_GAMER}
          className="mt-4"
          onPropagateTitle={setViralTitle}
        />

        <div className="mt-3 flex gap-4 text-[13px]">
          <span>
            <span className="font-semibold tabular-nums text-white">
              {u.following}
            </span>{" "}
            <span className="text-muted">팔로잉</span>
          </span>
          <span>
            <span className="font-semibold tabular-nums text-white">
              {u.followers}
            </span>{" "}
            <span className="text-muted">팔로워</span>
          </span>
        </div>

        {/* 성향 시그널 — 흑/백 참여·승패·지지 */}
        <div className="mt-5 border border-white/20 px-3 py-3">
          <p className="text-[10px] font-bold tracking-[0.18em] text-muted">
            전투 성향
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
            <div className="border border-white/15 bg-black px-2.5 py-2">
              <div className="flex items-center gap-1.5 text-white">
                <SpearMark size={14} />
                <span className="font-semibold tracking-[0.08em]">도전자</span>
              </div>
              <p className="mt-1.5 tabular-nums text-muted">
                참전 {a.challengerJoined} · 승 {a.challengerWins}
              </p>
            </div>
            <div className="border border-white/30 bg-white px-2.5 py-2 text-black">
              <div className="flex items-center gap-1.5">
                <ShieldMark size={14} />
                <span className="font-semibold tracking-[0.08em]">방어자</span>
              </div>
              <p className="mt-1.5 tabular-nums text-neutral-500">
                참전 {a.defenderJoined} · 승 {a.defenderWins}
              </p>
            </div>
          </div>
          <AffinityBar
            challengerPct={a.challengerSupportPct}
            defenderPct={a.defenderSupportPct}
          />
        </div>
      </div>

      {/* 탭: 글 | 전투 기록 */}
      <div
        className="grid grid-cols-2 border-y border-white/15"
        role="tablist"
        aria-label="프로필 탭"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "posts"}
          onClick={() => setTab("posts")}
          className={`py-2.5 text-[13px] font-semibold tracking-[0.08em] ${
            tab === "posts"
              ? "border-b-2 border-white text-white"
              : "text-muted"
          }`}
        >
          글
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "battles"}
          onClick={() => setTab("battles")}
          className={`py-2.5 text-[13px] font-semibold tracking-[0.08em] ${
            tab === "battles"
              ? "border-b-2 border-white text-white"
              : "text-muted"
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
              className="border-b border-white/10 px-4 py-3.5"
            >
              <div className="flex gap-3">
                <div
                  className="flex size-9 shrink-0 items-center justify-center border border-white/30 text-[11px] font-bold text-muted"
                  aria-hidden
                >
                  {u.name.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-semibold">{u.name}</span>
                    <TierBadge
                      tier={PROFILE_GAMER.currentTier.code}
                      subTier={PROFILE_GAMER.currentTier.subtier}
                    />
                    <span className="text-[12px] text-muted">@{u.handle}</span>
                    <span className="text-[12px] text-muted">· {p.timeLabel}</span>
                    <SideBadge side={p.side} />
                  </div>
                  <p className="mt-1 text-[14px] leading-[1.45] text-white/95">
                    {p.text}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[12px] tabular-nums text-muted">
                    <HeartMark />
                    {p.likes}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul aria-label="최근 전투 기록" className="pb-4">
          <li className="border-b border-white/10 px-4 py-2.5">
            <p className="text-[11px] tracking-[0.12em] text-muted">
              최근 참전 · 흑=도전자 / 백=방어자
            </p>
          </li>
          {PROFILE_RECENT_BATTLES.map((b) => {
            const asChallenger = b.joinedAs === "NEXUS";
            const won = b.result === "win";
            return (
              <li key={b.date} className="border-b border-white/10 px-4 py-3">
                <div className="flex items-start gap-2">
                  <div
                    className={`mt-0.5 flex size-8 shrink-0 items-center justify-center ${
                      asChallenger
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                    aria-hidden
                  >
                    {asChallenger ? (
                      <SpearMark size={14} />
                    ) : (
                      <ShieldMark size={14} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <span>
                        {b.date.slice(5).replace("-", "/")} · 제 {b.round} 도마
                      </span>
                      <span
                        className={`ml-auto font-semibold tracking-[0.08em] ${
                          won ? "text-white" : "text-muted"
                        }`}
                      >
                        {won ? "승" : "패"}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] font-medium leading-snug">
                      {b.topic}
                    </p>
                    <p className="mt-1 text-[11px] tabular-nums text-muted">
                      {asChallenger ? "도전자" : "방어자"}로 참전 · 결과{" "}
                      {b.winnerPercent}%
                    </p>
                    {onOpenShareCard && b.round === 411 ? (
                      <button
                        type="button"
                        onClick={onOpenShareCard}
                        className="mt-2 border border-white/30 px-2.5 py-1 text-[11px] font-bold tracking-[0.1em] text-white"
                      >
                        증명 카드
                      </button>
                    ) : null}
                  </div>
                </div>
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
