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

export type AppNotification = {
  id: string;
  kind: "like" | "reply" | "mention" | "battle";
  actor: string;
  text: string;
  timeLabel: string;
  unread?: boolean;
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

export const APP_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    kind: "like",
    actor: "mira.k",
    text: "님이 회원님의 진술을 좋아합니다.",
    timeLabel: "5분",
    unread: true,
  },
  {
    id: "n2",
    kind: "reply",
    actor: "pulse",
    text: "님이 회원님의 글에 답했습니다.",
    timeLabel: "42분",
    unread: true,
  },
  {
    id: "n3",
    kind: "mention",
    actor: "zero.nexus",
    text: "님이 회원님을 멘션했습니다.",
    timeLabel: "2시간",
  },
  {
    id: "n4",
    kind: "battle",
    actor: "DOMA",
    text: "제 412 도마 · 도전자 진영 지지가 58%로 갱신되었습니다.",
    timeLabel: "3시간",
  },
  {
    id: "n5",
    kind: "battle",
    actor: "DOMA",
    text: "제 411 도마 결과가 확정되었습니다. (방어자 승)",
    timeLabel: "어제",
  },
];
