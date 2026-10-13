export type Side = "NEXUS" | "AEGIS";

export type Opinion = {
  id: string;
  side: Side;
  author: string;
  text: string;
  likes: number;
  isTopMinority?: boolean;
};

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
