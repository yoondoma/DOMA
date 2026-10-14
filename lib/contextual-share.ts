/**
 * 공유/캡처용 전파 카드 — 인앱 링크 미리보기 아님.
 * 스펙: social-rules.md 「공유 카드」
 */

import type { Side } from "@/lib/types";

export type ContextualShareKind = "topic" | "opinion";

export type ContextualSharePayload = {
  kind: ContextualShareKind;
  /** opinion일 때 필수 · topic은 생략 가능 */
  side?: Side;
  round: number;
  topic: string;
  /** 주제 공유 시 짧은 설명 */
  description?: string;
  /** 의견 공유 시 본문 */
  opinionText?: string;
  authorHandle?: string;
  /** 탈퇴 표시명 등 */
  authorLeft?: boolean;
};

/** 진영/맥락에 맞춘 초대 카피 · 과한 이모지 금지 */
export function inviteCopy(payload: ContextualSharePayload): string {
  if (payload.kind === "topic") {
    return "오늘 전장에 들어와 같이 겨뤄 봐. 너도 참가해서 도와줘!";
  }
  if (payload.side === "AEGIS") {
    return "방패 편이야. 너도 참가해서 도와줘!";
  }
  return "창 편이야. 너도 참가해서 도와줘!";
}

export function shareCardTitle(payload: ContextualSharePayload): string {
  if (payload.kind === "topic") return "주제 공유";
  if (payload.side === "AEGIS") return "방패 의견 공유";
  return "창 의견 공유";
}

export function sideLabelKo(side: Side | undefined): string {
  if (side === "AEGIS") return "방어자";
  if (side === "NEXUS") return "도전자";
  return "전장";
}
