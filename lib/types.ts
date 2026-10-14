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
  authorId?: string;
  text: string;
  /** 호응 (승패 무관) */
  likes: number;
  /** 판결·TOP 지지 */
  supports?: number;
  /** 트로이 목마 — 타 진영에서 넘어온 지지 수 */
  trojanCount?: number;
  replies?: number;
  likedByMe?: boolean;
  supportedByMe?: boolean;
  isTopMinority?: boolean;
  /** 올린 시각 (UTC ISO) — 표시는 KST 포맷 */
  createdAtUtc?: string;
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
  /** 그날 주제 제안자 */
  proposerId?: string;
  proposerHandle?: string;
};

/** 홈 인트로 / 도전자 / 방어자 */
export type ArenaView = "intro" | "NEXUS" | "AEGIS";

/** 하루 전투 기록 (달력) */
export type BattleDay = {
  /** YYYY-MM-DD */
  date: string;
  round: number;
  topic: string;
  /** JOINT = 지지·좋아요 모두 동점 공동 승리 */
  winner: Side | "JOINT";
  winnerPercent: number;
  loserPercent: number;
  winnerAuthor: string;
  winnerOpinion: string;
  opponentAuthor: string;
  opponentOpinion: string;
  /** 확정 주제 원글 제안자 — 허리띠 영구 기록 */
  proposerHandle?: string;
  hasGirdle?: boolean;
};
