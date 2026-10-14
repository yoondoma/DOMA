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
import { domaStore, useDomaStore } from "@/lib/store";
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

type ThreadRow = MessageThread & {
  peerId: string;
  isRequest: boolean;
};

function ThreadList({
  onOpen,
  uiDemo,
  onRetry,
}: {
  onOpen: (t: ThreadRow) => void;
  uiDemo: UiDemo;
  onRetry?: () => void;
}) {
  const snap = useDomaStore();
  const myPrivacy = useMemo(
    () => domaStore.getPrivacy(snap.session?.userId),
    [snap.privacyByUser, snap.session?.userId],
  );

  const threads = useMemo(() => {
    if (uiDemo === "empty") return [] as ThreadRow[];
    const sid = snap.session?.userId;
    if (!sid) return [] as ThreadRow[];

    if (myPrivacy.dmPolicy === "off") return [] as ThreadRow[];

    const blocked = new Set(
      (snap.blocks ?? [])
        .filter((b) => b.blockerId === sid)
        .map((b) => b.blockedId),
    );

    const rows: ThreadRow[] = [];
    for (const t of MESSAGE_THREADS) {
      const peerId =
        snap.users.find((u) => u.handle === t.handle)?.id ??
        userIdFromHandle(t.handle);
      if (blocked.has(peerId)) continue;

      const peerFollowsMe = snap.follows.some(
        (f) => f.followerId === peerId && f.followeeId === sid,
      );
      const iFollow = snap.follows.some(
        (f) => f.followerId === sid && f.followeeId === peerId,
      );
      const mutual = peerFollowsMe && iFollow;
      const isRequest = !peerFollowsMe;

      if (myPrivacy.dmPolicy === "mutual" && !mutual) continue;

      rows.push({ ...t, peerId, isRequest });
    }
    return rows;
  }, [snap, uiDemo, myPrivacy.dmPolicy]);

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
  if (myPrivacy.dmPolicy === "off") {
    return (
      <StatusBlock
        kind="empty"
        message="DM 수신이 꺼져 있습니다. 설정에서 켤 수 있습니다."
      />
    );
  }
  if (threads.length === 0) {
    return (
      <StatusBlock
        kind="empty"
        message={
          myPrivacy.dmPolicy === "mutual"
            ? "맞팔 상대의 메시지가 없습니다."
            : "아직 대화가 없습니다."
        }
      />
    );
  }

  const requests = threads.filter((t) => t.isRequest);
  const inbox = threads.filter((t) => !t.isRequest);

  return (
    <div>
      {requests.length > 0 ? (
        <div className="border-b border-white/10 px-4 py-2">
          <p className="text-[11px] font-bold tracking-[0.14em] text-muted">
            요청함 · {requests.length}
          </p>
        </div>
      ) : null}
      <ul aria-label="메시지 목록">
        {[...requests, ...inbox].map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onOpen(t)}
              className="flex w-full items-start gap-3 border-b border-white/10 px-4 py-3 text-left active:bg-white/[0.04]"
            >
              <Avatar name={t.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`truncate text-[14px] leading-tight ${
                      t.unread
                        ? "font-bold text-white"
                        : "font-semibold text-white"
                    }`}
                  >
                    {t.name}
                  </span>
                  <span className="truncate text-[12px] text-muted">
                    @{t.handle}
                  </span>
                  {t.isRequest ? (
                    <span className="shrink-0 text-[10px] tracking-[0.08em] text-white/70">
                      요청함
                    </span>
                  ) : null}
                  <span className="ml-auto shrink-0 text-[11px] tabular-nums text-muted">
                    {t.timeLabel}
                  </span>
                </div>
                <p
                  className={`mt-0.5 truncate text-[13px] leading-snug ${
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
    </div>
  );
}

function ChatView({
  thread,
  onBack,
  onOpenProfile,
}: {
  thread: ThreadRow;
  onBack: () => void;
  onOpenProfile: (profile: SocialProfile) => void;
}) {
  const snap = useDomaStore();
  const peerId = thread.peerId;
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
            <p className="truncate text-[14px] font-semibold">
              {thread.name}
              {thread.isRequest ? (
                <span className="ml-1.5 text-[10px] font-normal tracking-[0.08em] text-muted">
                  요청함
                </span>
              ) : null}
            </p>
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
  /** 헤더 새 메시지 시트 */
  composeOpen?: boolean;
  onComposeClose?: () => void;
  onToast?: (message: string) => void;
};

export function MessagesScreen({
  onOpenProfile,
  uiDemo = "normal",
  onRetry,
  composeOpen = false,
  onComposeClose,
  onToast,
}: MessagesScreenProps) {
  const snap = useDomaStore();
  const [open, setOpen] = useState<ThreadRow | null>(null);

  const startWith = (t: MessageThread) => {
    const peerId =
      snap.users.find((u) => u.handle === t.handle)?.id ??
      userIdFromHandle(t.handle);
    const gate = domaStore.canSendDm(peerId);
    if (!gate.ok) {
      onToast?.(
        gate.reason === "off"
          ? "상대가 DM을 받지 않습니다"
          : gate.reason === "mutual_required"
            ? "맞팔만 메시지를 받을 수 있습니다"
            : "로그인이 필요합니다",
      );
      return;
    }
    onComposeClose?.();
    setOpen({
      ...t,
      peerId,
      isRequest: gate.asRequest,
    });
    if (gate.asRequest) onToast?.("메시지 요청으로 보냅니다");
  };

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

      {composeOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70"
          role="dialog"
          aria-modal
          aria-label="새 메시지"
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="닫기"
            onClick={onComposeClose}
          />
          <div className="relative z-10 w-full max-w-[560px] border-t border-white/20 bg-black px-4 pb-8 pt-4">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="font-[family-name:var(--font-syne)] text-[15px] font-bold tracking-tight">
                새 메시지
              </p>
              <button
                type="button"
                onClick={onComposeClose}
                className="text-[12px] text-muted"
              >
                닫기
              </button>
            </div>
            <ul aria-label="대화 상대">
              {MESSAGE_THREADS.map((t) => {
                const peerId =
                  snap.users.find((u) => u.handle === t.handle)?.id ??
                  userIdFromHandle(t.handle);
                const gate = domaStore.canSendDm(peerId);
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => startWith(t)}
                      className="flex w-full items-center gap-3 border-b border-white/10 py-3 text-left active:bg-white/[0.04]"
                    >
                      <Avatar name={t.name} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold">
                          {t.name}
                        </span>
                        <span className="block truncate text-[12px] text-muted">
                          @{t.handle}
                          {!gate.ok
                            ? gate.reason === "off"
                              ? " · DM 꺼짐"
                              : " · 맞팔 필요"
                            : gate.asRequest
                              ? " · 요청"
                              : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
