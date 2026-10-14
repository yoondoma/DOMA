import type {
  BattleDay,
  Block,
  Camp,
  Follow,
  Like,
  Opinion,
  Reply,
  Report,
  Scrap,
  Session,
  TimelineClock,
  TopicCandidate,
  User,
} from "@/lib/types/domain";
import type { SessionQuota } from "@/lib/types/quota";

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
  scraps: Scrap[];
  battleDays: BattleDay[];
  arenaMeta: ArenaMeta;
  /** 세션 유저 일일 한도 (좋아요·진영이동·글) */
  quota: SessionQuota;
};

export type CreateOpinionInput = {
  body: string;
  camp: Camp;
};
