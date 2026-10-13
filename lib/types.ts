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
  endsAt: string;
  nexusPercent: number;
  aegisPercent: number;
  nexusVotes: number;
  aegisVotes: number;
};
