"use client";

import { useMemo, useState } from "react";
import { StatusBlock } from "@/components/StatusBlock";
import { SafetyMenu } from "@/components/SafetyMenu";
import {
  CHAT_BY_THREAD,
  MESSAGE_THREADS,
  type MessageThread,
  type SocialProfile,
} from "@/lib/social-mock";
import { useDomaStore } from "@/lib/store";
import { userIdFromHandle } from "@/lib/types/ids";
import type { UiDemo } from "@/lib/ui-demo";

function Avatar({ name }: { name: string }) {
  return (
    <div
      className="flex size-11 shrink-0 items-center justify-center border border-white/30 text-[12px] font-bold text-muted"
      aria-hidden
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

function ThreadList({
  onOpen,
  uiDemo,
  onRetry,
}: {
  onOpen: (t: MessageThread) => void;
  uiDemo: UiDemo;
  onRetry?: () => void;
}) {
  const snap = useDomaStore();
  const threads = useMemo(() => {
    if (uiDemo === "empty") return [];
    const sid = snap.session?.userId;
    const blocked = new Set(
      (snap.blocks ?? [])
        .filter((b) => b.blockerId === sid)
        .map((b) => b.blockedId),
    );
    return MESSAGE_THREADS.filter((t) => {
      const uid =
        snap.users.find((u) => u.handle === t.handle)?.id ??
        userIdFromHandle(t.handle);
      return !blocked.has(uid);
    });
  }, [snap, uiDemo]);

  if (uiDemo === "loading") {
    return <StatusBlock kind="loading" message="불러오는 중" />;
  }
  if (uiDemo === "error") {
    return (
      <StatusBlock
        kind="error"
        message="메시지를 불러오지 못했습니다."
        actionLabel="다시 시도"
        onAction={onRetry}
      />
    );
  }
  if (threads.length === 0) {
    return (
      <StatusBlock kind="empty" message="아직 대화가 없습니다." />
    );
  }

  return (
    <ul aria-label="메시지 목록">
      {threads.map((t) => (
        <li key={t.id}>
          <button
            type="button"
            onClick={() => onOpen(t)}
            className="flex w-full items-start gap-3 border-b border-white/10 px-4 py-3.5 text-left active:bg-white/[0.04]"
          >
            <Avatar name={t.name} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`truncate text-[14px] ${
                    t.unread ? "font-bold text-white" : "font-semibold text-white"
                  }`}
                >
                  {t.name}
                </span>
                <span className="truncate text-[12px] text-muted">
                  @{t.handle}
                </span>
                <span className="ml-auto shrink-0 text-[11px] text-muted">
                  {t.timeLabel}
                </span>
              </div>
              <p
                className={`mt-0.5 truncate text-[13px] ${
                  t.unread ? "text-white/90" : "text-muted"
                }`}
              >
                {t.preview}
              </p>
            </div>
            {t.unread ? (
              <span
                className="mt-2 size-2 shrink-0 rounded-full bg-white"
                aria-label="읽지 않음"
              />
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

function ChatView({
  thread,
  onBack,
  onOpenProfile,
}: {
  thread: MessageThread;
  onBack: () => void;
  onOpenProfile: (profile: SocialProfile) => void;
}) {
  const snap = useDomaStore();
  const peerId =
    snap.users.find((u) => u.handle === thread.handle)?.id ??
    userIdFromHandle(thread.handle);
  const blocked = (snap.blocks ?? []).some(
    (b) => b.blockerId === snap.session?.userId && b.blockedId === peerId,
  );
  const lines = CHAT_BY_THREAD[thread.id] ?? [];
  const openProfile = () =>
    onOpenProfile({
      name: thread.name,
      handle: thread.handle,
      bio: "",
      avatarChar: thread.name.slice(0, 1).toUpperCase(),
    });

  return (
    <div aria-label={`${thread.name}과의 대화`}>
      <div className="flex items-center gap-1 border-b border-white/15 px-2 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 px-2 py-1 text-[13px] text-muted"
          aria-label="목록으로"
        >
          ←
        </button>
        <button
          type="button"
          onClick={openProfile}
          className="flex min-w-0 flex-1 items-center gap-2 px-1 py-1 text-left active:bg-white/[0.06]"
          aria-label={`${thread.name} 프로필 보기`}
        >
          <Avatar name={thread.name} />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold">{thread.name}</p>
            <p className="truncate text-[12px] text-muted">@{thread.handle}</p>
          </div>
        </button>
        <SafetyMenu
          userId={peerId}
          reportKind="user"
          reportTargetId={peerId}
        />
      </div>

      {blocked ? (
        <StatusBlock
          kind="empty"
          message="차단한 이용자와의 대화입니다."
        />
      ) : lines.length === 0 ? (
        <StatusBlock kind="empty" message="대화를 시작해 보세요." />
      ) : (
        <ul className="space-y-2 px-4 py-4" aria-label="대화 내용">
          {lines.map((line) => (
            <li
              key={line.id}
              className={`flex ${line.fromMe ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`max-w-[80%] px-3 py-2 text-[14px] leading-[1.4] ${
                  line.fromMe
                    ? "border border-white bg-white text-black"
                    : "border border-white/25 text-white"
                }`}
              >
                {line.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type MessagesScreenProps = {
  onOpenProfile: (profile: SocialProfile) => void;
  uiDemo?: UiDemo;
  onRetry?: () => void;
};

export function MessagesScreen({
  onOpenProfile,
  uiDemo = "normal",
  onRetry,
}: MessagesScreenProps) {
  const [open, setOpen] = useState<MessageThread | null>(null);

  return (
    <section
      className="mx-auto max-w-[560px] bg-black text-white"
      aria-label="메시지"
    >
      {!open ? (
        <ThreadList onOpen={setOpen} uiDemo={uiDemo} onRetry={onRetry} />
      ) : (
        <ChatView
          thread={open}
          onBack={() => setOpen(null)}
          onOpenProfile={onOpenProfile}
        />
      )}
    </section>
  );
}
