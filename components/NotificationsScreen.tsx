"use client";

import { useMemo } from "react";
import type { AlertCategory } from "@/components/Header";
import { StatusBlock } from "@/components/StatusBlock";
import {
  APP_NOTIFICATIONS,
  type AppNotification,
  type NotificationTarget,
} from "@/lib/social-mock";
import type { UiDemo } from "@/lib/ui-demo";

/** 알림 타입 라벨 — 판결 / 내 글 / 메시지 · 멘션(내글·내답글 답 포함) */
function kindLabel(n: AppNotification): string {
  if (n.kind === "battle") return "판결";
  if (n.kind === "message") return "메시지";
  if (n.kind === "mention" || n.category === "mention") return "멘션";
  if (n.kind === "like" || n.kind === "reply" || n.category === "mine") {
    return "내 글";
  }
  if (n.kind === "follow") return "팔로우";
  return "알림";
}

function KindMark({ kind }: { kind: AppNotification["kind"] }) {
  const stroke = "#a3a3a3";
  if (kind === "like") {
    return (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 13.2S2.8 9.8 2.8 5.9A2.7 2.7 0 0 1 8 4.4 2.7 2.7 0 0 1 13.2 5.9C13.2 9.8 8 13.2 8 13.2Z"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "reply") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4.5 12h11.5M12 7.5 16.5 12 12 16.5"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </svg>
    );
  }
  if (kind === "mention") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="7.25" stroke={stroke} strokeWidth="1.6" />
        <path
          d="M16 12a4 4 0 1 1-1.2-2.9V14.5"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </svg>
    );
  }
  if (kind === "follow") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="10" cy="9" r="3.25" stroke={stroke} strokeWidth="1.6" />
        <path
          d="M4.5 18.5c.6-2.6 2.7-4 5.5-4s4.9 1.4 5.5 4"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="square"
        />
        <path
          d="M17.5 8v5M15 10.5h5"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </svg>
    );
  }
  if (kind === "message") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4.5 6.5h15v9.5H9.2L5.5 19.2V6.5Z"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="7.25" stroke={stroke} strokeWidth="1.6" />
      <path d="M12 4.8v14.4" stroke={stroke} strokeWidth="1.6" />
    </svg>
  );
}

function targetHint(target: NotificationTarget): string | null {
  if (target.type === "share") return "탭하여 증명 카드 · 캡처";
  if (target.type === "arena") return "탭하여 아레나로";
  if (target.type === "opinion") return "탭하여 해당 글로";
  if (target.type === "profile") return "탭하여 프로필로";
  return null;
}

type NotificationsScreenProps = {
  onNavigate: (target: NotificationTarget) => void;
  onOpenProfile?: (handle: string) => void;
  uiDemo?: UiDemo;
  onRetry?: () => void;
  category?: AlertCategory;
};

export function NotificationsScreen({
  onNavigate,
  onOpenProfile,
  uiDemo = "normal",
  onRetry,
  category = "all",
}: NotificationsScreenProps) {
  const list = useMemo(() => {
    if (uiDemo === "empty") return [];
    if (category === "all") return APP_NOTIFICATIONS;
    return APP_NOTIFICATIONS.filter((n) => {
      if (n.category === category) return true;
      /** 구 카테고리 호환 */
      if (category === "judgment" && n.category === "system") return true;
      if (category === "mine" && n.category === "conversation") return true;
      return false;
    });
  }, [uiDemo, category]);

  return (
    <section
      className="mx-auto max-w-[560px] bg-black text-white"
      aria-label="알림"
    >
      {uiDemo === "loading" ? (
        <StatusBlock kind="loading" message="불러오는 중" />
      ) : uiDemo === "error" ? (
        <StatusBlock
          kind="error"
          message="알림을 불러오지 못했습니다."
          actionLabel="다시 시도"
          onAction={onRetry}
        />
      ) : list.length === 0 ? (
        <StatusBlock kind="empty" message="이 분류의 알림이 없습니다." />
      ) : (
        <ul aria-label="알림 목록">
          {list.map((n) => {
            const hint = targetHint(n.target);
            const label =
              n.target.type === "share"
                ? "결과 증명 카드 열기"
                : n.target.type === "arena"
                  ? "아레나로 이동"
                  : n.target.type === "opinion"
                    ? "해당 글로 이동"
                    : "프로필로 이동";
            const canOpenActor =
              Boolean(onOpenProfile) && n.actor !== "DOMA";
            return (
              <li key={n.id}>
                <div
                  className={`flex w-full items-start gap-3 border-b border-white/10 px-4 py-3 ${
                    n.unread ? "bg-white/[0.03]" : ""
                  }`}
                >
                  {canOpenActor ? (
                    <button
                      type="button"
                      onClick={() => onOpenProfile?.(n.actor)}
                      className="mt-0.5 flex size-9 shrink-0 items-center justify-center border border-white/20 text-[12px] font-bold text-muted active:bg-white/10"
                      aria-label={`@${n.actor} 프로필`}
                    >
                      {n.actor.slice(0, 1).toUpperCase()}
                    </button>
                  ) : (
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center border border-white/20">
                      <KindMark kind={n.kind} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-[0.14em] text-muted">
                        {kindLabel(n)}
                      </span>
                      <span className="ml-auto text-[11px] text-muted">
                        {n.timeLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-[14px] leading-[1.45] text-white/95">
                      {canOpenActor ? (
                        <button
                          type="button"
                          onClick={() => onOpenProfile?.(n.actor)}
                          className="font-semibold text-white"
                          aria-label={`@${n.actor} 프로필`}
                        >
                          @{n.actor}
                        </button>
                      ) : n.actor !== "DOMA" ? (
                        <span className="font-semibold">@{n.actor}</span>
                      ) : null}
                      {n.actor !== "DOMA" ? " " : null}
                      <button
                        type="button"
                        onClick={() => onNavigate(n.target)}
                        className="text-left text-white/95"
                        aria-label={label}
                      >
                        {n.text}
                      </button>
                    </p>
                    {hint ? (
                      <button
                        type="button"
                        onClick={() => onNavigate(n.target)}
                        className="mt-1.5 block text-[11px] tracking-[0.08em] text-muted"
                      >
                        {hint}
                      </button>
                    ) : null}
                  </div>
                  {n.unread ? (
                    <span
                      className="mt-2 size-2 shrink-0 rounded-full bg-white"
                      aria-label="읽지 않음"
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
