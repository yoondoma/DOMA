import type {
  BattleDay,
  Block,
  Camp,
  CampSwitch,
  Follow,
  Like,
  Opinion,
  Reply,
  Report,
  Scrap,
  Session,
  Support,
  TimelineClock,
  TopicCandidate,
  User,
} from "@/lib/types/domain";
import type { PrivacyPrefs } from "@/lib/types/privacy";
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
  /** 글 지지 (판결·TOP) */
  supports: Support[];
  /** 진영 전환 — 트로이 목마 */
  campSwitches: CampSwitch[];
  battleDays: BattleDay[];
  arenaMeta: ArenaMeta;
  /** 세션 유저 일일 한도 (좋아요·진영이동) */
  quota: SessionQuota;
  /** userId → 프라이버시 (스크랩 공개 · DM) */
  privacyByUser: Record<string, PrivacyPrefs>;
  /** userId → 마지막 작성 시각 (의견·제안·댓글 공통 쿨다운) */
  lastComposeAtByUser: Record<string, string>;
};

export type CreateOpinionInput = {
  body: string;
  camp: Camp;
};
