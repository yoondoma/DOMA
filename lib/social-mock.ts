export type SocialProfile = {
  name: string;
  handle: string;
  bio: string;
  avatarChar: string;
};

export type MessageThread = {
  id: string;
  name: string;
  handle: string;
  preview: string;
  timeLabel: string;
  unread?: boolean;
};

export type ChatLine = {
  id: string;
  fromMe: boolean;
  text: string;
};

/** 알림 탭 시 이동 대상 */
export type NotificationTarget =
  | { type: "opinion"; opinionId: string; side: "NEXUS" | "AEGIS" }
  | { type: "arena" }
  | { type: "share" }
  | { type: "profile"; handle: string };

/**
 * 알림 필터 — 스펙: social-rules
 * 푸시 필수 3종: 판결 · 내 글 · 메시지
 * 멘션 = @언급 + 내 글·내 답글에 달린 답
 */
export type NotificationCategory =
  | "follow"
  | "judgment"
  | "mine"
  | "message"
  | "mention"
  /** @deprecated → judgment */
  | "system"
  /** @deprecated → mine */
  | "conversation";

export type AppNotification = {
  id: string;
  kind: "like" | "reply" | "mention" | "battle" | "follow" | "message";
  /** 헤더 카테고리 필터 */
  category: NotificationCategory;
  actor: string;
  text: string;
  timeLabel: string;
  unread?: boolean;
  target: NotificationTarget;
};

/** 실공유 — DM 데모 채터 없음 */
export const MESSAGE_THREADS: MessageThread[] = [];

export const CHAT_BY_THREAD: Record<string, ChatLine[]> = {};

/** DM·알림에서 연 상대 프로필 목 — 최소 폴백만 */
export const SOCIAL_PROFILES: Record<string, SocialProfile> = {};

export function profileForHandle(handle: string): SocialProfile {
  const key = handle.replace(/^@/, "");
  return (
    SOCIAL_PROFILES[key] ?? {
      name: key,
      handle: key,
      bio: "도마에서 만난 상대입니다.",
      avatarChar: key.slice(0, 1).toUpperCase(),
    }
  );
}

/** 실공유 — 알림 데모·과거 회차 잔상 없음 */
export const APP_NOTIFICATIONS: AppNotification[] = [];
