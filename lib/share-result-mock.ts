import type { Side } from "./types";

/** 결과 확정 목 — 증명 카드용 (판결 전 플레이스홀더) */
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
  topic: "의대 정원 확대는 필요하다",
  mySide: "NEXUS",
  outcome: "win",
  mySidePercent: 50,
  myOpinion: "",
  likes: 0,
  adopted: false,
  adoptedLabel: null,
  settledAtLabel: "판결 전",
};
