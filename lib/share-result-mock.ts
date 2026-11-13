import type { Side } from "./types";

/** 결과 확정 목 — 증명 카드용 */
export type ShareResult = {
  round: number;
  topic: string;
  mySide: Side;
  outcome: "win" | "loss";
  mySidePercent: number;
  myOpinion: string;
  likes: number;
  adopted: boolean;
  adoptedLabel: "TOP" | "채택" | null;
  settledAtLabel: string;
};

export const MOCK_SHARE_RESULT: ShareResult = {
  round: 1,
  topic: "투표 연령을 16세로 낮춰야 하는가?",
  mySide: "NEXUS",
  outcome: "win",
  mySidePercent: 53,
  myOpinion:
    "미래에 가장 오래 살 사람이 결정에서 배제되어 있다.",
  likes: 42,
  adopted: true,
  adoptedLabel: "TOP",
  settledAtLabel: "2026.10.11 확정",
};
