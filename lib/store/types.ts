import type {
  BattleDay,
  Camp,
  Follow,
  Like,
  Opinion,
  Reply,
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
  battleDays: BattleDay[];
  arenaMeta: ArenaMeta;
};

export type CreateOpinionInput = {
  body: string;
  camp: Camp;
  authorId?: string;
};
