"use client";

import { useMemo, useState } from "react";
import { domaStore, useDomaStore } from "@/lib/store";

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

type OpinionSocialProps = {
  opinionId: string;
  likes: number;
  replies: number;
  likedByMe?: boolean;
  light?: boolean;
  /** 피드 행 아바타 정렬용 왼쪽 패딩 */
  indent?: boolean;
  onNeedLogin?: () => void;
};

/** Threads/X 톤 · 좋아요 토글 + 인라인 답글 */
export function OpinionSocial({
  opinionId,
  likes,
  replies,
  likedByMe,
  light,
  indent = true,
  onNeedLogin,
}: OpinionSocialProps) {
  const snap = useDomaStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const thread = useMemo(() => {
    const users = new Map(snap.users.map((u) => [u.id, u]));
    return snap.replies
      .filter((r) => r.opinionId === opinionId)
      .map((r) => ({
        ...r,
        handle: users.get(r.authorId)?.handle ?? "user",
      }));
  }, [snap, opinionId]);

  const muted = light ? "text-neutral-500" : "text-muted";
  const active = light ? "text-black" : "text-white";

  const onLike = () => {
    try {
      domaStore.toggleLike("opinion", opinionId);
    } catch {
      onNeedLogin?.();
    }
  };

  const onSubmitReply = () => {
    try {
      domaStore.addReply(opinionId, draft);
      setDraft("");
    } catch (e) {
      if (e instanceof Error && e.message === "SESSION_REQUIRED") {
        onNeedLogin?.();
      }
    }
  };

  return (
    <div className={`mt-2 ${indent ? "pl-10" : ""}`}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onLike}
          className={`inline-flex items-center gap-1 text-[12px] tabular-nums ${
            likedByMe ? active : muted
          }`}
          aria-pressed={Boolean(likedByMe)}
          aria-label={likedByMe ? "좋아요 취소" : "좋아요"}
        >
          <HeartMark filled={likedByMe} className={likedByMe ? active : muted} />
          {likes}
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center gap-1 text-[12px] tabular-nums ${
            open ? active : muted
          }`}
          aria-expanded={open}
          aria-label="답글"
        >
          <ReplyMark className={open ? active : muted} />
          {replies}
        </button>
      </div>

      {open ? (
        <div
          className={`mt-2 border-t pt-2 ${
            light ? "border-black/10" : "border-white/10"
          }`}
          aria-label="답글 스레드"
        >
          {thread.length === 0 ? (
            <p className={`text-[12px] ${muted}`}>아직 답글이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {thread.map((r) => (
                <li key={r.id} className="text-[12px] leading-snug">
                  <span className={`font-semibold ${active}`}>@{r.handle}</span>
                  <span className={`ml-1.5 ${light ? "text-black/80" : "text-white/80"}`}>
                    {r.body}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="답글 쓰기"
              maxLength={280}
              className={`min-w-0 flex-1 border bg-transparent px-2 py-1.5 text-[12px] outline-none ${
                light
                  ? "border-black/25 text-black placeholder:text-neutral-400"
                  : "border-white/25 text-white placeholder:text-neutral-500"
              }`}
              aria-label="답글 입력"
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
