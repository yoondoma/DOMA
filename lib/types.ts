/**
 * UI 뷰 모델 (화면 컴포넌트용).
 * 도메인 엔티티·Camp/dayId → `lib/types/domain.ts`
 * 스토어 → `lib/store`
 */

export type Side = "NEXUS" | "AEGIS";

/** @deprecated 도메인은 `lib/types/domain`.Opinion — 화면 호환용 뷰 */
export type Opinion = {
  id: string;
  side: Side;
  author: string;
  text: string;
  likes: number;
  replies?: number;
  likedByMe?: boolean;
  isTopMinority?: boolean;
};

export type { Camp, DayId, TimeState } from "@/lib/types/domain";

export type ArenaState = {
  round: number;
  topic: string;
  /** 주제 한줄·짧은 설명 */
  description: string;
  endsAt: string;
  nexusPercent: number;
  aegisPercent: number;
  nexusVotes: number;
  aegisVotes: number;
};

/** 홈 인트로 / 도전자 / 방어자 */
export type ArenaView = "intro" | "NEXUS" | "AEGIS";

/** 하루 전투 기록 (달력) */
export type BattleDay = {
  /** YYYY-MM-DD */
  date: string;
  round: number;
  topic: string;
  winner: Side;
  winnerPercent: number;
  loserPercent: number;
  winnerAuthor: string;
  winnerOpinion: string;
  opponentAuthor: string;
  opponentOpinion: string;
};
