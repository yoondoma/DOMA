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

/** 알림 필터 탭용 */
export type NotificationCategory =
  | "follow"
  | "conversation"
  | "mention"
  | "system";

export type AppNotification = {
  id: string;
  kind: "like" | "reply" | "mention" | "battle" | "follow";
  /** 헤더 카테고리 필터 */
  category: NotificationCategory;
  actor: string;
  text: string;
  timeLabel: string;
  unread?: boolean;
  target: NotificationTarget;
};

export const MESSAGE_THREADS: MessageThread[] = [
  {
    id: "dm-1",
    name: "mira.k",
    handle: "mira.k",
    preview: "그 TOP 의견, 반박 포인트 하나만 더 볼게요.",
    timeLabel: "12분",
    unread: true,
  },
  {
    id: "dm-2",
    name: "zero.nexus",
    handle: "zero.nexus",
    preview: "벤치마크 링크 보냈어요.",
    timeLabel: "1시간",
  },
  {
    id: "dm-3",
    name: "han.aegis",
    handle: "han.aegis",
    preview: "내일 주제 후보 같이 볼래요?",
    timeLabel: "어제",
  },
  {
    id: "dm-4",
    name: "pulse",
    handle: "pulse",
    preview: "읽음",
    timeLabel: "3일",
  },
];

export const CHAT_BY_THREAD: Record<string, ChatLine[]> = {
  "dm-1": [
    { id: "c1", fromMe: false, text: "그 TOP 의견, 반박 포인트 하나만 더 볼게요." },
    { id: "c2", fromMe: true, text: "좋아요. 책임·맥락 쪽이 약하더라고요." },
    { id: "c3", fromMe: false, text: "그 부분 짧게 정리해서 올리겠습니다." },
  ],
  "dm-2": [
    { id: "c4", fromMe: false, text: "벤치마크 링크 보냈어요." },
    { id: "c5", fromMe: true, text: "확인했습니다." },
  ],
};

/** DM·알림에서 연 상대 프로필 목 */
export const SOCIAL_PROFILES: Record<string, SocialProfile> = {
  "mira.k": {
    name: "mira.k",
    handle: "mira.k",
    bio: "방어 쪽 근거를 모은다. 책임과 맥락이 없으면 말이 아니다.",
    avatarChar: "M",
  },
  "zero.nexus": {
    name: "zero.nexus",
    handle: "zero.nexus",
    bio: "벤치마크로 말한다. 감정으로 ‘완전히’를 낮추지 말 것.",
    avatarChar: "Z",
  },
  "han.aegis": {
    name: "han.aegis",
    handle: "han.aegis",
    bio: "질문을 발명하는 쪽이 인간이다. 그 자리를 지킨다.",
    avatarChar: "H",
  },
  pulse: {
    name: "pulse",
    handle: "pulse",
    bio: "위임의 곡선을 지켜본다. 대체는 한 번에 오지 않는다.",
    avatarChar: "P",
  },
};

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

export const APP_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    kind: "like",
    category: "conversation",
    actor: "mira.k",
    text: "님이 회원님의 진술을 좋아합니다.",
    timeLabel: "5분",
    unread: true,
    target: { type: "opinion", opinionId: "op-you-1", side: "NEXUS" },
  },
  {
    id: "n2",
    kind: "reply",
    category: "conversation",
    actor: "pulse",
    text: "님이 회원님의 글에 답했습니다.",
    timeLabel: "42분",
    unread: true,
    target: { type: "opinion", opinionId: "op-you-1", side: "NEXUS" },
  },
  {
    id: "n3",
    kind: "mention",
    category: "mention",
    actor: "zero.nexus",
    text: "님이 회원님을 멘션했습니다.",
    timeLabel: "2시간",
    target: { type: "opinion", opinionId: "op-2", side: "NEXUS" },
  },
  {
    id: "n6",
    kind: "follow",
    category: "follow",
    actor: "han.aegis",
    text: "님이 회원님을 팔로우하기 시작했습니다.",
    timeLabel: "1시간",
    unread: true,
    target: { type: "profile", handle: "han.aegis" },
  },
  {
    id: "n7",
    kind: "follow",
    category: "follow",
    actor: "reed",
    text: "님이 회원님을 팔로우하기 시작했습니다.",
    timeLabel: "5시간",
    target: { type: "profile", handle: "reed" },
  },
  {
    id: "n4",
    kind: "battle",
    category: "system",
    actor: "DOMA",
    text: "제 412 도마 · 도전자 진영 지지가 58%로 갱신되었습니다.",
    timeLabel: "3시간",
    target: { type: "arena" },
  },
  {
    id: "n5",
    kind: "battle",
    category: "system",
    actor: "DOMA",
    text: "결과 확정 · 제 411 도마 증명 카드를 확인하세요",
    timeLabel: "어제",
    target: { type: "share" },
  },
];
