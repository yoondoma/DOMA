import type {
  BattleDay,
  Block,
  Camp,
  Follow,
  Like,
  Opinion,
  Reply,
  Report,
  Session,
  TimelineClock,
  TopicCandidate,
  User,
} from "@/lib/types/domain";

export type ArenaMeta = {
  round: number;
  topicTitle: string;
  description: string;
  challengerShare: number;
  defenderShare: number;
  challengerVotes: number;
  defenderVotes: number;
  /** 그날 주제를 제시한 유저 (제안자 칭호) */
  proposerId: string;
};

export type StoreSnapshot = {
  version: 1;
  clock: TimelineClock;
  users: User[];
  session: Session | null;
  opinions: Opinion[];
  topicCandidates: TopicCandidate[];
  follows: Follow[];
  likes: Like[];
  replies: Reply[];
  blocks: Block[];
  reports: Report[];
  battleDays: BattleDay[];
  arenaMeta: ArenaMeta;
};

export type CreateOpinionInput = {
  body: string;
  camp: Camp;
};
