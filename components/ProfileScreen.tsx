"use client";

import { useMemo, useState } from "react";
import { FollowListScreen } from "@/components/FollowListScreen";
import { StatusBlock } from "@/components/StatusBlock";
import {
  TierBadge,
  UserProfileCard,
  ViralShareCard,
} from "@/components/gamification";
import { RecordDetailScreen } from "@/components/RecordDetailScreen";
import type { EditableProfile } from "@/components/SettingsSheet";
import { TierDetailScreen } from "@/components/TierDetailScreen";
import {
  PROFILE_FOLLOWERS,
  PROFILE_FOLLOWING,
  PROFILE_GAMER,
  PROFILE_POSTS,
  PROFILE_RECENT_BATTLES,
  PROFILE_SCORE_HISTORY,
  PROFILE_TITLE_DETAILS,
  PROFILE_USER,
  type TitleDetail,
} from "@/lib/profile-mock";
import { domaStore, useDomaStore, useSession } from "@/lib/store";
import type { UiDemo } from "@/lib/ui-demo";
import type { DailyTitle, ScoreEvent } from "@/lib/types/gamification";

type ProfileTab = "posts" | "battles";
type FollowMode = "following" | "followers";

type ProfileScreenProps = {
  onOpenShareCard?: () => void;
  isSelf?: boolean;
  profile?: EditableProfile;
  onOpenSettings?: () => void;
  /** 타인 프로필에서 뒤로 (DM·알림 등) */
  onBack?: () => void;
  uiDemo?: UiDemo;
  onRetry?: () => void;
  onCompose?: () => void;
};

/** Threads형 · 팔로워/티어/전과 상세 · score 기반 */
export function ProfileScreen({
  onOpenShareCard,
  isSelf = true,
  profile,
  onOpenSettings,
  onBack,
  uiDemo = "normal",
  onRetry,
  onCompose,
}: ProfileScreenProps) {
  const snap = useDomaStore();
  const { user: me } = useSession();
  const [tab, setTab] = useState<ProfileTab>("posts");
  const [viralTitle, setViralTitle] = useState<DailyTitle | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [followMode, setFollowMode] = useState<FollowMode | null>(null);
  const [tierOpen, setTierOpen] = useState(false);
  const [titleDetail, setTitleDetail] = useState<TitleDetail | null>(null);
  const [scoreEvent, setScoreEvent] = useState<ScoreEvent | null>(null);
  const [battleDetail, setBattleDetail] = useState<
    (typeof PROFILE_RECENT_BATTLES)[number] | null
  >(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const display: EditableProfile = profile ?? {
    name: PROFILE_USER.name,
    handle: PROFILE_USER.handle,
    bio: PROFILE_USER.bio,
    avatarChar: PROFILE_USER.name.slice(0, 1),
  };

  const profileUser = useMemo(
    () => snap.users.find((u) => u.handle === display.handle) ?? null,
    [snap.users, display.handle],
  );

  const followingCount = useMemo(() => {
    if (!profileUser) return PROFILE_USER.following;
    return snap.follows.filter((f) => f.followerId === profileUser.id).length;
  }, [snap.follows, profileUser]);

  const followerCount = useMemo(() => {
    if (!profileUser) return PROFILE_USER.followers;
    return snap.follows.filter((f) => f.followeeId === profileUser.id).length;
  }, [snap.follows, profileUser]);

  const iFollow = Boolean(
    me && profileUser && !isSelf && domaStore.isFollowing(profileUser.id),
  );

  const gamer = { ...PROFILE_GAMER, username: display.name };

  const openTitle = (badge: DailyTitle) => {
    const found =
      PROFILE_TITLE_DETAILS.find(
        (t) => t.date === badge.date && t.type === badge.type,
      ) ?? null;
    setTitleDetail(found ?? { ...badge, round: 0, topic: "", note: "" });
  };

  return (
    <>
      <section
        className="mx-auto max-w-[560px] bg-black text-white"
        aria-label="프로필"
      >
        <div className="px-4 pb-5 pt-5">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="mb-3 -ml-1 px-1 py-1 text-[13px] text-neutral-200"
              aria-label="뒤로"
            >
              ← 뒤로
            </button>
          ) : null}
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
            <button
              type="button"
              onClick={() => setFollowMode("following")}
              className="tabular-nums"
              aria-label="팔로잉 목록"
            >
              <span className="font-semibold text-white">{followingCount}</span>{" "}
              팔로잉
            </button>
            <span className="mx-2 text-neutral-800">·</span>
            <button
              type="button"
              onClick={() => setFollowMode("followers")}
              className="tabular-nums"
              aria-label="팔로워 목록"
            >
              <span className="font-semibold text-white">{followerCount}</span>{" "}
              팔로워
            </button>
          </p>

          {!isSelf && me && profileUser ? (
            <button
              type="button"
              onClick={() => {
                try {
                  const r = domaStore.toggleFollow(profileUser.id);
                  showToast(r.following ? "팔로우했습니다" : "언팔로우했습니다");
                } catch {
                  showToast("로그인이 필요합니다");
                }
              }}
              className={`mt-4 border px-4 py-2 text-[12px] tracking-[0.1em] ${
                iFollow
                  ? "border-neutral-600 text-neutral-200"
                  : "border-white bg-white text-black"
              }`}
              aria-pressed={iFollow}
            >
              {iFollow ? "팔로잉" : "팔로우"}
            </button>
          ) : null}

          <div className="mt-5 border-t border-neutral-800 pt-4">
            <UserProfileCard
              user={gamer}
              onOpenTier={() => setTierOpen(true)}
              onOpenTitle={openTitle}
              onPropagateTitle={isSelf ? setViralTitle : undefined}
            />
          </div>

          {isSelf ? (
            <div
              className="mt-5 border-t border-neutral-800 pt-4"
              aria-label="개인설정"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[11px] font-bold tracking-[0.16em] text-neutral-200">
                  개인설정
                </p>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="text-[11px] tracking-[0.12em] text-neutral-200 underline underline-offset-4"
                >
                  편집
                </button>
              </div>
              <p className="mt-2 text-[13px] leading-[1.5] text-neutral-200">
                이름 · 바이오 · 아바타를 설정 화면에서 고칩니다.
              </p>
            </div>
          ) : null}
        </div>

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
          uiDemo === "loading" ? (
            <StatusBlock kind="loading" message="불러오는 중" />
          ) : uiDemo === "error" ? (
            <StatusBlock
              kind="error"
              message="글을 불러오지 못했습니다."
              actionLabel="다시 시도"
              onAction={onRetry}
            />
          ) : uiDemo === "empty" || PROFILE_POSTS.length === 0 ? (
            <StatusBlock
              kind="empty"
              message="아직 글이 없습니다."
              actionLabel={onCompose ? "글쓰기" : undefined}
              onAction={onCompose}
            />
          ) : (
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
                    <button
                      type="button"
                      onClick={() => setTierOpen(true)}
                      aria-label="티어 상세"
                    >
                      <TierBadge
                        tier={PROFILE_GAMER.currentTier.code}
                        subTier={PROFILE_GAMER.currentTier.subtier}
                      />
                    </button>
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
          )
        ) : (
          <ul aria-label="최근 전투 기록" className="pb-4">
            {PROFILE_RECENT_BATTLES.map((b) => {
              const asChallenger = b.joinedAs === "NEXUS";
              const won = b.result === "win";
              return (
                <li key={b.id} className="border-b border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setBattleDetail(b)}
                    className="w-full px-4 py-3.5 text-left"
                    aria-label={`제 ${b.round} 도마 상세`}
                  >
                    <div className="flex items-baseline justify-between gap-3 text-[12px] text-neutral-200">
                      <span>
                        {b.date.slice(5).replace("-", "/")} · 제 {b.round} 도마
                      </span>
                      <span className={won ? "text-white" : "text-neutral-200"}>
                        {won ? "승" : "패"} ·{" "}
                        {asChallenger ? "도전자" : "방어자"} ·{" "}
                        {b.delta > 0 ? "+" : ""}
                        {b.delta}pt
                      </span>
                    </div>
                    <p className="mt-1.5 text-[14px] leading-snug text-white">
                      {b.topic}
                    </p>
                  </button>
                  {onOpenShareCard && b.round === 411 ? (
                    <button
                      type="button"
                      onClick={onOpenShareCard}
                      className="mb-3 ml-4 text-[11px] tracking-[0.12em] text-neutral-200 underline underline-offset-4"
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

      <FollowListScreen
        open={followMode != null}
        mode={followMode ?? "followers"}
        profileHandle={display.handle}
        users={
          followMode === "following" ? PROFILE_FOLLOWING : PROFILE_FOLLOWERS
        }
        onClose={() => setFollowMode(null)}
        uiDemo={uiDemo}
        onRetry={onRetry}
      />

      <TierDetailScreen
        open={tierOpen}
        user={gamer}
        history={PROFILE_SCORE_HISTORY}
        onClose={() => setTierOpen(false)}
        onOpenEvent={(ev) => {
          setTierOpen(false);
          setScoreEvent(ev);
        }}
      />

      <RecordDetailScreen
        open={titleDetail != null}
        kind="title"
        title={titleDetail}
        onClose={() => setTitleDetail(null)}
      />

      <RecordDetailScreen
        open={scoreEvent != null}
        kind="score"
        event={scoreEvent}
        onClose={() => setScoreEvent(null)}
      />

      <RecordDetailScreen
        open={battleDetail != null}
        kind="battle"
        battle={battleDetail}
        onClose={() => setBattleDetail(null)}
      />

      {viralTitle ? (
        <ViralShareCard
          open
          payload={{
            username: display.name,
            score: PROFILE_GAMER.score,
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
