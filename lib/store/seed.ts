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
  CampSwitch,
  Follow,
  Opinion,
  Reply,
  Scrap,
  Session,
  TopicCandidate,
  User,
} from "@/lib/types/domain";
import {
  campFromSide,
  makeCampSwitchId,
  makeFollowId,
  makeReplyId,
  makeScrapId,
  makeSessionId,
  userIdFromHandle,
} from "@/lib/types/ids";
import type { StoreSnapshot } from "@/lib/store/types";
import { defaultPrivacy } from "@/lib/types/privacy";
import type { SessionQuota } from "@/lib/types/quota";

const SEED_HANDLES = [
  { handle: "soohan", displayName: "수한", bio: "판결을 겨루는 사람. 증거 없으면 말하지 않는다." },
  { handle: "you", displayName: "you", bio: "" },
  { handle: "mira.k", displayName: "mira.k", bio: "" },
  { handle: "zero.nexus", displayName: "zero.nexus", bio: "" },
  { handle: "han.aegis", displayName: "han.aegis", bio: "" },
  { handle: "pulse", displayName: "pulse", bio: "" },
  { handle: "nova", displayName: "nova", bio: "" },
  { handle: "reed", displayName: "reed", bio: "" },
  { handle: "kiln", displayName: "kiln", bio: "" },
  { handle: "slate", displayName: "slate", bio: "" },
  { handle: "orbit", displayName: "orbit", bio: "" },
  { handle: "loom", displayName: "loom", bio: "" },
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

/** 기존 목 배열 → 도메인 시드 스냅샷 */
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

  const me = byHandle.get("soohan")!;
  const session: Session = {
    id: makeSessionId(dayId, me.id),
    userId: me.id,
    dayId,
    joinedCamp: null,
    createdAtUtc: clock.serverNowUtc,
  };

  /** 지지 ≠ 좋아요 증명 — TOP은 supportCount (op-4), 좋아요 최다는 op-2 */
  const supportById: Record<string, number> = {
    "op-you-1": 12,
    "op-1": 96,
    "op-2": 48,
    "op-3": 70,
    "op-4": 210,
    "op-5": 22,
    "op-6": 55,
    "op-7": 18,
    "op-8": 40,
    "op-9": 15,
    "op-10": 33,
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
      supportCount: supportById[op.id] ?? Math.max(1, Math.floor(op.likes / 4)),
      replyCount: 0,
      createdAtUtc: new Date(
        new Date(clock.serverNowUtc).getTime() - (INITIAL_OPINIONS.length - i) * 60_000,
      ).toISOString(),
      isTopMinority: op.isTopMinority,
    };
  });

  /** 프로필 목마 데모 — 수한 글 + 타 진영 전환 */
  opinions.unshift({
    id: "op-soohan-1",
    dayId,
    authorId: me.id,
    camp: "challenger",
    body: "증거 없는 ‘완전 대체’는 판결이 아니다. 기준을 먼저 박자.",
    likeCount: 36,
    supportCount: 88,
    replyCount: 0,
    createdAtUtc: clock.serverNowUtc,
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

  const seedOpinion = opinions.find((o) => o.id === "op-2") ?? opinions[0];
  const seedFieldPreview =
    "도심이 끝나는 게 아니라 ‘우연한 밀도의 도시’가 끝난다. 주제를 여기로 이끌자.";
  const replies: Reply[] = seedOpinion
    ? [
        {
          id: makeReplyId("opinion", seedOpinion.id),
          parentKind: "opinion",
          parentId: seedOpinion.id,
          authorId: userIdFromHandle("mira.k"),
          body: "기준을 벤치마크로만 두면 책임 문제가 비게 된다. 같이 보자.",
          likeCount: 3,
          createdAtUtc: new Date(
            new Date(clock.serverNowUtc).getTime() - 8 * 60_000,
          ).toISOString(),
        },
        {
          id: `${makeReplyId("opinion", seedOpinion.id)}_self`,
          parentKind: "opinion",
          parentId: seedOpinion.id,
          authorId: me.id,
          body: "증거 없는 단정은 전장에 올리지 말자.",
          likeCount: 1,
          createdAtUtc: new Date(
            new Date(clock.serverNowUtc).getTime() - 2 * 60_000,
          ).toISOString(),
          editedAtUtc: null,
        },
      ]
    : [];
  if (seedOpinion) {
    seedOpinion.replyCount = replies.length;
  }

  const mira = byHandle.get("mira.k")!;
  const scraps: Scrap[] = [
    {
      id: makeScrapId(me.id, "opinion", seedOpinion?.id ?? "op-2"),
      userId: me.id,
      targetKind: "opinion",
      targetId: seedOpinion?.id ?? "op-2",
      preview: seedOpinion?.body ?? "",
      authorHandle: "zero.nexus",
      createdAtUtc: clock.serverNowUtc,
    },
    {
      id: makeScrapId(me.id, "field", "fo-1"),
      userId: me.id,
      targetKind: "field",
      targetId: "fo-1",
      preview: seedFieldPreview,
      authorHandle: "mira.k",
      createdAtUtc: clock.serverNowUtc,
    },
    {
      id: makeScrapId(me.id, "topic", "tm-1"),
      userId: me.id,
      targetKind: "topic",
      targetId: "tm-1",
      preview: "원격 근무는 도시의 중심을 끝낼 것인가?",
      authorHandle: "soohan",
      createdAtUtc: clock.serverNowUtc,
    },
    {
      id: makeScrapId(mira.id, "opinion", "op-1"),
      userId: mira.id,
      targetKind: "opinion",
      targetId: "op-1",
      preview:
        "대체는 '완전'이 아니라 '재배치'다. AI는 계산과 검색을 삼키지만, 책임·맥락·가치 판단은 인간에게 남는다.",
      authorHandle: "mira.k",
      createdAtUtc: clock.serverNowUtc,
    },
  ];

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
  /** DM 데모 — mira/zero/han은 팔로워(일반 수신), pulse는 비팔로워(요청함) */
  for (const handle of ["mira.k", "zero.nexus", "han.aegis"] as const) {
    const u = byHandle.get(handle)!;
    const id = makeFollowId(u.id, me.id);
    if (!follows.some((f) => f.id === id)) {
      follows.push({
        id,
        followerId: u.id,
        followeeId: me.id,
        createdAtUtc: "2026-09-01T00:00:00.000Z",
      });
    }
    const back = makeFollowId(me.id, u.id);
    if (!follows.some((f) => f.id === back)) {
      follows.push({
        id: back,
        followerId: me.id,
        followeeId: u.id,
        createdAtUtc: "2026-09-01T00:00:00.000Z",
      });
    }
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

  /** 데모 HUD — 투표·이동만 */
  const quota: SessionQuota = {
    likesUsed: 2,
    campMovesUsed: 1,
  };

  return {
    version: 1,
    clock,
    users: [...byHandle.values()],
    session,
    opinions,
    topicCandidates,
    follows,
    likes: [],
    replies,
    scraps,
    supports: [],
    campSwitches: (() => {
      const switches: CampSwitch[] = [];
      const pulseOp = opinions.find((o) => o.id === "op-4");
      const myOp = opinions.find((o) => o.id === "op-soohan-1");
      const add = (
        opinionId: string,
        toCamp: "challenger" | "defender",
        handles: string[],
      ) => {
        for (const handle of handles) {
          switches.push({
            id: makeCampSwitchId(),
            userId: userIdFromHandle(handle),
            fromCamp: toCamp === "challenger" ? "defender" : "challenger",
            toCamp,
            opinionId,
            createdAtUtc: clock.serverNowUtc,
          });
        }
      };
      if (pulseOp) add(pulseOp.id, pulseOp.camp, ["han.aegis", "reed", "slate", "mira.k"]);
      if (myOp) add(myOp.id, myOp.camp, ["han.aegis", "reed", "loom"]);
      return switches;
    })(),
    blocks: [],
    reports: [],
    battleDays,
    quota,
    privacyByUser: {
      [me.id]: defaultPrivacy(),
      [mira.id]: { scrapsPublic: false, dmPolicy: "mutual" },
      [userIdFromHandle("pulse")]: {
        scrapsPublic: true,
        dmPolicy: "everyone",
      },
    },
    lastComposeAtByUser: {},
    /** 홈 아레나 표시용 메타 (UI ArenaState와 병행) */
    arenaMeta: {
      round: 412,
      topicTitle: "인공지능은 인간의 지성을 완전히 대체할 것인가?",
      description:
        "계산·언어·창작까지 모델이 밀어붙이는 지금, ‘지성’의 경계는 어디에 남는지 묻는다. 도전자와 방어자가 같은 질문을 두고 판결을 겨룬다.",
      challengerShare: 58,
      defenderShare: 42,
      challengerVotes: 4821,
      defenderVotes: 4519,
      proposerId: userIdFromHandle("soohan"),
    },
  };
}
