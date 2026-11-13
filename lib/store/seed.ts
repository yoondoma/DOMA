import { BATTLE_HISTORY } from "@/lib/battle-history";
import { INITIAL_OPINIONS } from "@/lib/mock-data";
import { PROFILE_FOLLOWERS, PROFILE_FOLLOWING } from "@/lib/profile-mock";
import { INITIAL_TOMORROW_TOPICS } from "@/lib/tomorrow-topics";
import {
  arenaDayId,
  nextDayId,
  resolveTimelineClock,
} from "@/lib/kst";
import type {
  BattleDay,
  Follow,
  Opinion,
  Session,
  TopicCandidate,
  User,
} from "@/lib/types/domain";
import {
  campFromSide,
  makeFollowId,
  makeSessionId,
  userIdFromHandle,
} from "@/lib/types/ids";
import type { StoreSnapshot } from "@/lib/store/types";
import { defaultPrivacy } from "@/lib/types/privacy";
import { emptyQuota, type SessionQuota } from "@/lib/types/quota";

const SEED_HANDLES = [
  {
    handle: "doma.guest",
    displayName: "게스트",
    bio: "판결을 겨루는 사람. 증거 없으면 말하지 않는다.",
  },
] as const;

function ensureUser(
  byHandle: Map<string, User>,
  handle: string,
  displayName?: string,
  bio = "",
): User {
  const key = handle.replace(/^@/, "").toLowerCase();
  const existing = byHandle.get(key);
  if (existing) return existing;
  const user: User = {
    id: userIdFromHandle(key),
    handle: key,
    displayName: displayName ?? key,
    bio,
    createdAtUtc: "2026-03-01T00:00:00.000Z",
    /** 기본 B&W — 필드만 예약 */
    cosmetics: {},
    socialId: `kakao:${key}`,
    leftAtUtc: null,
  };
  byHandle.set(key, user);
  return user;
}

/** 실공유 시드 — 제 1회 주제만, 예시 글·댓글·채터 없음 */
export function buildSeedSnapshot(now: Date = new Date()): StoreSnapshot {
  const clock = resolveTimelineClock(now);
  const dayId = clock.dayId || arenaDayId(now);
  const targetDayId = nextDayId(dayId);
  const byHandle = new Map<string, User>();

  for (const u of SEED_HANDLES) {
    ensureUser(byHandle, u.handle, u.displayName, u.bio);
  }
  for (const f of [...PROFILE_FOLLOWING, ...PROFILE_FOLLOWERS]) {
    ensureUser(byHandle, f.handle, f.name, f.bio);
  }
  for (const b of BATTLE_HISTORY) {
    ensureUser(byHandle, b.winnerAuthor);
    ensureUser(byHandle, b.opponentAuthor);
  }

  const me = byHandle.get("doma.guest")!;
  const session: Session = {
    id: makeSessionId(dayId, me.id),
    userId: me.id,
    dayId,
    joinedCamp: null,
    createdAtUtc: clock.serverNowUtc,
  };

  const opinions: Opinion[] = INITIAL_OPINIONS.map((op, i) => {
    const author = ensureUser(byHandle, op.author);
    return {
      id: op.id.startsWith("op-") ? op.id : `op_${dayId}_${i}`,
      dayId,
      authorId: author.id,
      camp: campFromSide(op.side),
      body: op.text,
      likeCount: op.likes,
      supportCount: Math.max(0, Math.floor(op.likes / 4)),
      replyCount: 0,
      createdAtUtc: new Date(
        new Date(clock.serverNowUtc).getTime() -
          (INITIAL_OPINIONS.length - i) * 60_000,
      ).toISOString(),
      isTopMinority: op.isTopMinority,
    };
  });

  const topicCandidates: TopicCandidate[] = INITIAL_TOMORROW_TOPICS.map(
    (t, i) => ({
      id: t.id,
      targetDayId,
      title: t.title,
      body: t.note,
      supportCount: t.votes,
      stewardCount: t.stewards,
      proposerId: me.id,
      createdAtUtc: new Date(
        new Date(clock.serverNowUtc).getTime() - i * 120_000,
      ).toISOString(),
    }),
  );

  const follows: Follow[] = [];
  for (const f of PROFILE_FOLLOWING) {
    const followee = ensureUser(byHandle, f.handle, f.name, f.bio);
    follows.push({
      id: makeFollowId(me.id, followee.id),
      followerId: me.id,
      followeeId: followee.id,
      createdAtUtc: "2026-09-01T00:00:00.000Z",
    });
  }
  for (const f of PROFILE_FOLLOWERS.slice(0, 8)) {
    const follower = ensureUser(byHandle, f.handle, f.name, f.bio);
    follows.push({
      id: makeFollowId(follower.id, me.id),
      followerId: follower.id,
      followeeId: me.id,
      createdAtUtc: "2026-09-01T00:00:00.000Z",
    });
  }

  const battleDays: BattleDay[] = BATTLE_HISTORY.map((b) => ({
    dayId: b.date,
    round: b.round,
    topicTitle: b.topic,
    winnerCamp:
      b.winner === "JOINT" ? "challenger" : campFromSide(b.winner),
    winnerShare: b.winner === "JOINT" ? 50 : b.winnerPercent,
    loserShare: b.winner === "JOINT" ? 50 : b.loserPercent,
    winnerAuthorId: ensureUser(byHandle, b.winnerAuthor).id,
    winnerOpinionBody: b.winnerOpinion,
    opponentAuthorId: ensureUser(byHandle, b.opponentAuthor).id,
    opponentOpinionBody: b.opponentOpinion,
    resolvedAtUtc: `${b.date}T14:00:00.000Z`,
  }));

  const quota: SessionQuota = emptyQuota();

  return {
    version: 1,
    clock,
    users: [...byHandle.values()],
    session,
    opinions,
    topicCandidates,
    follows,
    likes: [],
    replies: [],
    scraps: [],
    supports: [],
    campSwitches: [],
    blocks: [],
    reports: [],
    battleDays,
    quota,
    privacyByUser: {
      [me.id]: defaultPrivacy(),
    },
    lastComposeAtByUser: {},
    arenaMeta: {
      round: 1,
      topicTitle: "의대 정원 확대는 필요하다",
      description: "",
      challengerShare: 50,
      defenderShare: 50,
      challengerVotes: 0,
      defenderVotes: 0,
      proposerId: userIdFromHandle("doma.guest"),
    },
  };
}
