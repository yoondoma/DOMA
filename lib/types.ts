export type Side = "NEXUS" | "AEGIS";

export type Opinion = {
  id: string;
  side: Side;
  author: string;
  text: string;
  likes: number;
  isTopMinority?: boolean;
};

export type Representative = {
  side: Side;
  name: string;
  role: string;
  quote: string;
  monogram: string;
};

export type ArenaState = {
  round: number;
  topic: string;
  endsAt: string;
  nexusPercent: number;
  aegisPercent: number;
  nexusVotes: number;
  aegisVotes: number;
  representatives: Record<Side, Representative>;
};
