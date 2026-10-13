"use client";

import { APP_NOTIFICATIONS, type AppNotification } from "@/lib/social-mock";

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

/** Threads/X형 알림 리스트 — 가볍게 */
export function NotificationsScreen() {
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
          {APP_NOTIFICATIONS.map((n) => (
            <li
              key={n.id}
              className={`flex gap-3 border-b border-white/10 px-4 py-3.5 ${
                n.unread ? "bg-white/[0.03]" : ""
              }`}
            >
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center border border-white/20">
                <KindMark kind={n.kind} />
              </div>
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
                  {n.actor !== "DOMA" ? (
                    <span className="font-semibold">@{n.actor}</span>
                  ) : null}
                  {n.actor !== "DOMA" ? " " : null}
                  {n.text}
                </p>
              </div>
              {n.unread ? (
                <span
                  className="mt-2 size-2 shrink-0 rounded-full bg-white"
                  aria-label="읽지 않음"
                />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
