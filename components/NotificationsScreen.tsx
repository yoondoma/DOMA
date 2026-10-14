"use client";

import {
  APP_NOTIFICATIONS,
  type AppNotification,
  type NotificationTarget,
} from "@/lib/social-mock";

function kindLabel(kind: AppNotification["kind"]): string {
  switch (kind) {
    case "like":
      return "좋아요";
    case "reply":
      return "답글";
    case "mention":
      return "멘션";
    case "battle":
      return "전투";
  }
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
};

/** Threads/X형 알림 — 본문 탭=대상 화면, 아바타·핸들=프로필 */
export function NotificationsScreen({
  onNavigate,
  onOpenProfile,
}: NotificationsScreenProps) {
  return (
    <section
      className="mx-auto max-w-[560px] bg-black text-white"
      aria-label="알림"
    >
      <div className="border-b border-white/15 px-4 py-3">
        <h2 className="font-[family-name:var(--font-syne)] text-[17px] font-bold tracking-tight">
          알림
        </h2>
      </div>

      {APP_NOTIFICATIONS.length === 0 ? (
        <p className="px-6 py-16 text-center text-sm text-muted">
          새 알림이 없습니다.
        </p>
      ) : (
        <ul aria-label="알림 목록">
          {APP_NOTIFICATIONS.map((n) => {
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
                  className={`flex w-full items-start gap-3 border-b border-white/10 px-4 py-3.5 ${
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
                        {kindLabel(n.kind)}
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
