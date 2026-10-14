"use client";

import { useMemo, useState } from "react";
import { sharePost } from "@/lib/share-post";
import { playDomaSound } from "@/lib/sound/doma-sound";
import { domaStore, useDomaStore } from "@/lib/store";
import type { LikeTargetKind, ReplyParentKind, ScrapTargetKind } from "@/lib/types/domain";

function HeartMark({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      className={`shrink-0 ${className ?? ""}`}
      aria-hidden
    >
      <path
        d="M8 13.2S2.8 9.8 2.8 5.9A2.7 2.7 0 0 1 8 4.4 2.7 2.7 0 0 1 13.2 5.9C13.2 9.8 8 13.2 8 13.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReplyMark({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className ?? ""}`}
      aria-hidden
    >
      <path
        d="M4 12h12M12 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ShareMark({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className ?? ""}`}
      aria-hidden
    >
      <path
        d="M12 4v10M8.5 7.5 12 4l3.5 3.5M5 14v4.5h14V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function ScrapMark({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      className={`shrink-0 ${className ?? ""}`}
      aria-hidden
    >
      <path
        d="M7 4.5h10v15l-5-3.2L7 19.5V4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type OpinionSocialProps = {
  /** @deprecated parentKind=opinion + targetId 사용 */
  opinionId?: string;
  parentKind?: ReplyParentKind;
  targetId?: string;
  likes: number;
  /** 판결 지지 (opinion만) */
  supports?: number;
  replies: number;
  likedByMe?: boolean;
  supportedByMe?: boolean;
  /** 공유·스크랩 미리보기 */
  previewText?: string;
  authorHandle?: string;
  light?: boolean;
  /** 피드 행 아바타 정렬용 왼쪽 패딩 */
  indent?: boolean;
  onNeedLogin?: () => void;
  onToast?: (message: string) => void;
  /** 지지 후 진영 동기화 */
  onCampMoved?: () => void;
};

/** Threads/X 톤 · 좋아요(호응) · 지지(판결) · 댓글 · 공유 · 스크랩 */
export function OpinionSocial({
  opinionId,
  parentKind: parentKindProp,
  targetId: targetIdProp,
  likes,
  supports = 0,
  replies,
  likedByMe,
  supportedByMe,
  previewText = "",
  authorHandle,
  light,
  indent = true,
  onNeedLogin,
  onToast,
  onCampMoved,
}: OpinionSocialProps) {
  const parentKind: ReplyParentKind = parentKindProp ?? "opinion";
  const targetId = targetIdProp ?? opinionId ?? "";
  const likeKind = parentKind as LikeTargetKind;
  const scrapKind = parentKind as ScrapTargetKind;

  const snap = useDomaStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const scraped = useMemo(
    () => (targetId ? domaStore.hasScraped(scrapKind, targetId) : false),
    [snap.scraps, scrapKind, targetId],
  );

  const thread = useMemo(() => {
    if (!targetId) return [];
    const users = new Map(snap.users.map((u) => [u.id, u]));
    const sid = snap.session?.userId;
    const blocked = new Set(
      (snap.blocks ?? [])
        .filter((b) => b.blockerId === sid)
        .map((b) => b.blockedId),
    );
    return snap.replies
      .filter(
        (r) =>
          r.parentKind === parentKind &&
          r.parentId === targetId &&
          !blocked.has(r.authorId),
      )
      .map((r) => ({
        ...r,
        handle: users.get(r.authorId)?.handle ?? "user",
        likedByMe: sid
          ? snap.likes.some(
              (l) =>
                l.userId === sid &&
                l.targetKind === "reply" &&
                l.targetId === r.id,
            )
          : false,
      }));
  }, [snap, parentKind, targetId]);

  const replyCount = Math.max(replies, thread.length);
  const muted = light ? "text-neutral-500" : "text-muted";
  const active = light ? "text-black" : "text-white";

  const onLike = () => {
    if (!targetId) return;
    try {
      domaStore.toggleLike(likeKind, targetId);
    } catch (e) {
      if (e instanceof Error && e.message === "ARENA_SHUTDOWN") {
        onToast?.("전장 셧다운 (23:00–08:00)");
        return;
      }
      if (e instanceof Error && e.message === "QUOTA_LIKES") {
        onToast?.("오늘의 좋아요를 모두 썼습니다 (5/5)");
        return;
      }
      onNeedLogin?.();
    }
  };

  const onSupport = () => {
    if (!targetId || parentKind !== "opinion") return;
    try {
      const { supported, campMoved } = domaStore.toggleSupport(targetId);
      if (supported) playDomaSound("support");
      if (campMoved) {
        playDomaSound("campSwitch");
        onToast?.("지지 · 진영이 이동했습니다");
        onCampMoved?.();
      } else {
        onToast?.(supported ? "이 의견을 지지합니다" : "지지를 해제했습니다");
      }
    } catch (e) {
      if (e instanceof Error && e.message === "ARENA_SHUTDOWN") {
        onToast?.("전장 셧다운 (23:00–08:00)");
        return;
      }
      if (e instanceof Error && e.message === "QUOTA_CAMP_MOVES") {
        onToast?.("진영 이동 한도를 모두 썼습니다 (3회)");
        return;
      }
      onNeedLogin?.();
    }
  };

  const onScrap = () => {
    if (!targetId) return;
    try {
      const { scraped: next } = domaStore.toggleScrap(scrapKind, targetId, {
        preview: previewText || "스크랩한 글",
        authorHandle,
      });
      onToast?.(next ? "스크랩했습니다" : "스크랩을 해제했습니다");
    } catch {
      onNeedLogin?.();
    }
  };

  const onShare = async () => {
    const result = await sharePost({
      text: previewText || "DOMA",
      authorHandle,
      title: "DOMA",
    });
    if (result === "shared") onToast?.("공유 시트를 열었습니다");
    else if (result === "copied") onToast?.("글을 복사했습니다");
    else onToast?.("공유에 실패했습니다");
  };

  const onSubmitReply = () => {
    if (!targetId) return;
    try {
      domaStore.addReply(parentKind, targetId, draft);
      setDraft("");
      onToast?.("댓글을 남겼습니다");
    } catch (e) {
      if (e instanceof Error && e.message === "ARENA_SHUTDOWN") {
        onToast?.("전장 셧다운 (23:00–08:00)");
        return;
      }
      if (e instanceof Error && e.message === "SESSION_REQUIRED") {
        onNeedLogin?.();
      }
    }
  };

  const onLikeReply = (replyId: string) => {
    try {
      domaStore.toggleLike("reply", replyId);
    } catch {
      onNeedLogin?.();
    }
  };

  const onScrapReply = (replyId: string, body: string, handle: string) => {
    try {
      const { scraped: next } = domaStore.toggleScrap("reply", replyId, {
        preview: body,
        authorHandle: handle,
      });
      onToast?.(next ? "스크랩했습니다" : "스크랩을 해제했습니다");
    } catch {
      onNeedLogin?.();
    }
  };

  const onShareReply = async (body: string, handle: string) => {
    const result = await sharePost({ text: body, authorHandle: handle });
    if (result === "shared") onToast?.("공유 시트를 열었습니다");
    else if (result === "copied") onToast?.("댓글을 복사했습니다");
  };

  return (
    <div className={`mt-2 ${indent ? "pl-10" : ""}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={onLike}
          className={`inline-flex items-center gap-1 text-[12px] tabular-nums ${
            likedByMe ? active : muted
          }`}
          aria-pressed={Boolean(likedByMe)}
          aria-label={likedByMe ? "좋아요 취소" : "좋아요"}
          title="호응 · 승패 무관"
        >
          <HeartMark filled={likedByMe} className={likedByMe ? active : muted} />
          <span className="tracking-[0.02em]">좋아요</span>
          {likes}
        </button>
        {parentKind === "opinion" ? (
          <button
            type="button"
            onClick={onSupport}
            className={`inline-flex items-center gap-1 text-[12px] font-semibold tabular-nums ${
              supportedByMe ? active : muted
            }`}
            aria-pressed={Boolean(supportedByMe)}
            aria-label={supportedByMe ? "지지 해제" : "지지"}
            title="판결 지지 · 이 진영으로 이동"
          >
            <span className="tracking-[0.04em]">지지</span>
            {supports}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center gap-1 text-[12px] tabular-nums ${
            open ? active : muted
          }`}
          aria-expanded={open}
          aria-label={
            open
              ? `댓글 접기 ${replyCount}`
              : `댓글 ${replyCount} · 탭하여 펼치기`
          }
          title={open ? "댓글 접기" : "탭하여 댓글 펼치기"}
          data-comment-toggle
        >
          <ReplyMark className={open ? active : muted} />
          <span className="tracking-[0.02em]">댓글</span>
          {replyCount}
        </button>
        <button
          type="button"
          onClick={onShare}
          className={`inline-flex items-center gap-1 text-[12px] ${muted}`}
          aria-label="공유"
        >
          <ShareMark className={muted} />
          공유
        </button>
        <button
          type="button"
          onClick={onScrap}
          className={`inline-flex items-center gap-1 text-[12px] ${
            scraped ? active : muted
          }`}
          aria-pressed={scraped}
          aria-label={scraped ? "스크랩 해제" : "스크랩"}
        >
          <ScrapMark filled={scraped} className={scraped ? active : muted} />
          스크랩
        </button>
      </div>

      {open ? (
        <div
          className={`mt-2 border-t pt-2 ${
            light ? "border-black/10" : "border-white/10"
          }`}
          aria-label="댓글 스레드"
        >
          {thread.length === 0 ? (
            <p className={`text-[12px] ${muted}`}>아직 댓글이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {thread.map((r) => {
                const replyScraped = domaStore.hasScraped("reply", r.id);
                return (
                  <li key={r.id} className="text-[12px] leading-snug">
                    <p>
                      <span className={`font-semibold ${active}`}>
                        @{r.handle}
                      </span>
                      <span
                        className={`ml-1.5 ${
                          light ? "text-black/80" : "text-white/80"
                        }`}
                      >
                        {r.body}
                      </span>
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onLikeReply(r.id)}
                        className={`inline-flex items-center gap-1 tabular-nums ${
                          r.likedByMe ? active : muted
                        }`}
                        aria-label="댓글 좋아요"
                      >
                        <HeartMark filled={r.likedByMe} />
                        {r.likeCount}
                      </button>
                      <button
                        type="button"
                        onClick={() => onShareReply(r.body, r.handle)}
                        className={muted}
                        aria-label="댓글 공유"
                      >
                        공유
                      </button>
                      <button
                        type="button"
                        onClick={() => onScrapReply(r.id, r.body, r.handle)}
                        className={replyScraped ? active : muted}
                        aria-label="댓글 스크랩"
                      >
                        스크랩
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="댓글 쓰기"
              maxLength={280}
              className={`min-w-0 flex-1 border bg-transparent px-2 py-1.5 text-[12px] outline-none ${
                light
                  ? "border-black/25 text-black placeholder:text-neutral-400"
                  : "border-white/25 text-white placeholder:text-neutral-500"
              }`}
              aria-label="댓글 입력"
            />
            <button
              type="button"
              onClick={onSubmitReply}
              disabled={!draft.trim()}
              className={`shrink-0 border px-2.5 py-1.5 text-[11px] tracking-[0.08em] disabled:opacity-40 ${
                light
                  ? "border-black bg-black text-white"
                  : "border-white bg-white text-black"
              }`}
            >
              게시
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
