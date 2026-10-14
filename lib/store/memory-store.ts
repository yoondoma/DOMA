"use client";

import { resolveTimelineClock } from "@/lib/kst";
import type {
  Block,
  Camp,
  DayId,
  Follow,
  Like,
  Opinion,
  Reply,
  ReplyParentKind,
  Report,
  ReportReason,
  ReportTargetKind,
  Scrap,
  ScrapTargetKind,
  Session,
  TopicCandidate,
  User,
} from "@/lib/types/domain";
import {
  makeBlockId,
  makeFollowId,
  makeLikeId,
  makeOpinionId,
  makeReplyId,
  makeReportId,
  makeScrapId,
  makeSessionId,
  makeTopicCandidateId,
} from "@/lib/types/ids";
import { buildSeedSnapshot } from "@/lib/store/seed";
import type {
  ArenaMeta,
  CreateOpinionInput,
  StoreSnapshot,
} from "@/lib/store/types";
import { emptyQuota, QUOTA_LIMITS } from "@/lib/types/quota";

const STORAGE_KEY = "doma.store.v3";

type Listener = () => void;

function clone<T>(v: T): T {
  return structuredClone(v);
}

/** 구 opinionId 전용 댓글 → parentKind/parentId */
function normalizeReply(r: Reply & { opinionId?: string }): Reply {
  if (r.parentKind && r.parentId) {
    return {
      id: r.id,
      parentKind: r.parentKind,
      parentId: r.parentId,
      authorId: r.authorId,
      body: r.body,
      likeCount: r.likeCount ?? 0,
      createdAtUtc: r.createdAtUtc,
    };
  }
  const legacyId = r.opinionId ?? r.parentId;
  return {
    id: r.id,
    parentKind: "opinion",
    parentId: legacyId,
    authorId: r.authorId,
    body: r.body,
    likeCount: r.likeCount ?? 0,
    createdAtUtc: r.createdAtUtc,
  };
}

function normalizeSnap(parsed: StoreSnapshot): StoreSnapshot {
  return {
    ...parsed,
    blocks: parsed.blocks ?? [],
    reports: parsed.reports ?? [],
    likes: parsed.likes ?? [],
    replies: (parsed.replies ?? []).map((r) =>
      normalizeReply(r as Reply & { opinionId?: string }),
    ),
    scraps: parsed.scraps ?? [],
    follows: parsed.follows ?? [],
    quota: parsed.quota ?? emptyQuota(),
  };
}

function loadPersisted(): StoreSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoreSnapshot;
    if (parsed?.version !== 1) return null;
    return normalizeSnap(parsed);
  } catch {
    return null;
  }
}

function persist(snap: StoreSnapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
  } catch {
    /* quota — ignore */
  }
}

class MemoryStore {
  private snap: StoreSnapshot;
  private listeners = new Set<Listener>();
  private ready = false;

  constructor() {
    this.snap = buildSeedSnapshot();
  }

  /** 브라우저에서 로컬 복원 후 시드 보정 · 세션 없으면 시드 유저 자동 로그인 */
  init() {
    if (this.ready) return;
    this.ready = true;
    const saved = loadPersisted();
    if (saved) {
      this.snap = saved;
      this.snap.clock = resolveTimelineClock();
    } else {
      this.snap = buildSeedSnapshot();
    }
    if (!this.snap.session) {
      this.autoLoginDefault();
    } else {
      // dayId가 바뀌었으면 세션 dayId만 맞춤 (userId 유지)
      const dayId = this.snap.clock.dayId;
      if (this.snap.session.dayId !== dayId) {
        this.snap.session = {
          ...this.snap.session,
          id: makeSessionId(dayId, this.snap.session.userId),
          dayId,
        };
      }
      persist(this.snap);
    }
    this.emit();
  }

  private defaultUserId(): string | undefined {
    return (
      this.snap.users.find((u) => u.handle === "soohan")?.id ??
      this.snap.users[0]?.id
    );
  }

  private autoLoginDefault() {
    const userId = this.defaultUserId();
    if (!userId) {
      persist(this.snap);
      return;
    }
    const dayId = this.snap.clock.dayId;
    this.snap.session = {
      id: makeSessionId(dayId, userId),
      userId,
      dayId,
      joinedCamp: null,
      createdAtUtc: new Date().toISOString(),
    };
    persist(this.snap);
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    for (const fn of this.listeners) fn();
  }

  private commit(next: StoreSnapshot) {
    this.snap = next;
    persist(this.snap);
    this.emit();
  }

  getSnapshot(): StoreSnapshot {
    return this.snap;
  }

  // ── reads ──────────────────────────────────────────

  getClock() {
    return this.snap.clock;
  }

  getDayId(): DayId {
    return this.snap.clock.dayId;
  }

  getUsers(): User[] {
    return this.snap.users;
  }

  getUser(id: string): User | undefined {
    return this.snap.users.find((u) => u.id === id);
  }

  getUserByHandle(handle: string): User | undefined {
    const h = handle.replace(/^@/, "").toLowerCase();
    return this.snap.users.find((u) => u.handle === h);
  }

  getSession(): Session | null {
    return this.snap.session;
  }

  /** 세션이 가리키는 현재 유저 (로그아웃 시 null) */
  getCurrentUser(): User | null {
    const sid = this.snap.session?.userId;
    if (!sid) return null;
    return this.snap.users.find((u) => u.id === sid) ?? null;
  }

  requireSession(): Session {
    const s = this.snap.session;
    if (!s) throw new Error("SESSION_REQUIRED");
    return s;
  }

  getArenaMeta(): ArenaMeta {
    return this.snap.arenaMeta;
  }

  /** 목 로그인 — handle 또는 userId */
  login(userIdOrHandle: string): Session {
    const next = clone(this.snap);
    const key = userIdOrHandle.replace(/^@/, "");
    const user =
      next.users.find((u) => u.id === key) ??
      next.users.find((u) => u.handle === key.toLowerCase());
    if (!user) throw new Error("USER_NOT_FOUND");
    const dayId = next.clock.dayId;
    const prevCamp =
      next.session?.userId === user.id ? next.session.joinedCamp : null;
    next.session = {
      id: makeSessionId(dayId, user.id),
      userId: user.id,
      dayId,
      joinedCamp: prevCamp,
      createdAtUtc: new Date().toISOString(),
    };
    this.commit(next);
    return next.session;
  }

  logout() {
    const next = clone(this.snap);
    next.session = null;
    this.commit(next);
  }

  /** 다른 시드 유저로 전환 (목) */
  switchUser(userIdOrHandle: string): Session {
    return this.login(userIdOrHandle);
  }

  listOpinions(dayId?: DayId): Opinion[] {
    const d = dayId ?? this.snap.clock.dayId;
    return this.snap.opinions.filter((o) => o.dayId === d);
  }

  listTopicCandidates(targetDayId?: DayId): TopicCandidate[] {
    if (!targetDayId) return this.snap.topicCandidates;
    return this.snap.topicCandidates.filter((t) => t.targetDayId === targetDayId);
  }

  listFollows(): Follow[] {
    return this.snap.follows;
  }

  listLikes(): Like[] {
    return this.snap.likes;
  }

  listReplies(parentKind?: ReplyParentKind, parentId?: string): Reply[] {
    if (!parentKind || !parentId) return this.snap.replies;
    return this.snap.replies.filter(
      (r) => r.parentKind === parentKind && r.parentId === parentId,
    );
  }

  listScraps(userId?: string): Scrap[] {
    const uid = userId ?? this.snap.session?.userId;
    if (!uid) return [];
    return this.snap.scraps
      .filter((s) => s.userId === uid)
      .sort((a, b) => b.createdAtUtc.localeCompare(a.createdAtUtc));
  }

  hasScraped(targetKind: ScrapTargetKind, targetId: string): boolean {
    const sid = this.snap.session?.userId;
    if (!sid) return false;
    const id = makeScrapId(sid, targetKind, targetId);
    return this.snap.scraps.some((s) => s.id === id);
  }

  listBattleDays() {
    return this.snap.battleDays;
  }

  // ── writes ─────────────────────────────────────────

  refreshClock(now: Date = new Date()) {
    const next = clone(this.snap);
    next.clock = resolveTimelineClock(now);
    this.commit(next);
  }

  getQuota() {
    return this.snap.quota;
  }

  setJoinedCamp(camp: Camp | null) {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    const prev = next.session.joinedCamp;
    if (prev && camp && prev !== camp) {
      if (next.quota.campMovesUsed >= QUOTA_LIMITS.campMoves) {
        throw new Error("QUOTA_CAMP_MOVES");
      }
      next.quota = {
        ...next.quota,
        campMovesUsed: next.quota.campMovesUsed + 1,
      };
    }
    next.session.joinedCamp = camp;
    this.commit(next);
  }

  createOpinion(input: CreateOpinionInput): Opinion {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    if (next.quota.postsUsed >= QUOTA_LIMITS.posts) {
      throw new Error("QUOTA_POSTS");
    }
    const dayId = next.clock.dayId;
    const authorId = next.session.userId;

    const op: Opinion = {
      id: makeOpinionId(dayId),
      dayId,
      authorId,
      camp: input.camp,
      body: input.body.slice(0, 280),
      likeCount: 0,
      replyCount: 0,
      createdAtUtc: new Date().toISOString(),
    };
    next.opinions = [...next.opinions, op];
    next.quota = { ...next.quota, postsUsed: next.quota.postsUsed + 1 };
    this.commit(next);
    return op;
  }

  createTopicCandidate(input: {
    title: string;
    body?: string;
    targetDayId: DayId;
  }): TopicCandidate {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    if (next.quota.proposalsUsed >= QUOTA_LIMITS.proposals) {
      throw new Error("QUOTA_PROPOSALS");
    }
    const tc: TopicCandidate = {
      id: makeTopicCandidateId(input.targetDayId),
      targetDayId: input.targetDayId,
      title: input.title,
      body: input.body ?? "",
      supportCount: 1,
      stewardCount: 1,
      proposerId: next.session.userId,
      createdAtUtc: new Date().toISOString(),
    };
    next.topicCandidates = [tc, ...next.topicCandidates];
    next.quota = {
      ...next.quota,
      proposalsUsed: next.quota.proposalsUsed + 1,
    };
    this.commit(next);
    return tc;
  }

  supportTopic(id: string) {
    const next = clone(this.snap);
    next.topicCandidates = next.topicCandidates.map((t) =>
      t.id === id
        ? {
            ...t,
            supportCount: t.supportCount + 1,
            stewardCount: t.stewardCount + 1,
          }
        : t,
    );
    this.commit(next);
  }

  ensureSession(userId: string, dayId?: DayId) {
    const next = clone(this.snap);
    const d = dayId ?? next.clock.dayId;
    next.session = {
      id: makeSessionId(d, userId),
      userId,
      dayId: d,
      joinedCamp: next.session?.userId === userId ? next.session.joinedCamp : null,
      createdAtUtc: new Date().toISOString(),
    };
    this.commit(next);
    return next.session;
  }

  isFollowing(followeeId: string): boolean {
    const sid = this.snap.session?.userId;
    if (!sid) return false;
    const id = makeFollowId(sid, followeeId);
    return this.snap.follows.some((f) => f.id === id);
  }

  addFollow(followeeId: string): Follow {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    const followerId = next.session.userId;
    if (followerId === followeeId) throw new Error("CANNOT_FOLLOW_SELF");
    const id = makeFollowId(followerId, followeeId);
    if (next.follows.some((f) => f.id === id)) {
      return next.follows.find((f) => f.id === id)!;
    }
    const row: Follow = {
      id,
      followerId,
      followeeId,
      createdAtUtc: new Date().toISOString(),
    };
    next.follows = [...next.follows, row];
    this.commit(next);
    return row;
  }

  removeFollow(followeeId: string): boolean {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    const id = makeFollowId(next.session.userId, followeeId);
    const before = next.follows.length;
    next.follows = next.follows.filter((f) => f.id !== id);
    if (next.follows.length === before) return false;
    this.commit(next);
    return true;
  }

  /** 팔로우 토글 → following 여부 */
  toggleFollow(followeeId: string): { following: boolean } {
    if (this.isFollowing(followeeId)) {
      this.removeFollow(followeeId);
      return { following: false };
    }
    this.addFollow(followeeId);
    return { following: true };
  }

  hasLiked(targetKind: Like["targetKind"], targetId: string): boolean {
    const sid = this.snap.session?.userId;
    if (!sid) return false;
    const id = makeLikeId(sid, targetKind, targetId);
    return this.snap.likes.some((l) => l.id === id);
  }

  addLike(targetKind: Like["targetKind"], targetId: string): Like {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    if (next.quota.likesUsed >= QUOTA_LIMITS.likes) {
      throw new Error("QUOTA_LIKES");
    }
    const userId = next.session.userId;
    const id = makeLikeId(userId, targetKind, targetId);
    const existing = next.likes.find((l) => l.id === id);
    if (existing) return existing;
    const row: Like = {
      id,
      userId,
      targetKind,
      targetId,
      createdAtUtc: new Date().toISOString(),
    };
    next.likes = [...next.likes, row];
    next.quota = { ...next.quota, likesUsed: next.quota.likesUsed + 1 };
    if (targetKind === "opinion") {
      next.opinions = next.opinions.map((o) =>
        o.id === targetId ? { ...o, likeCount: o.likeCount + 1 } : o,
      );
    } else if (targetKind === "reply") {
      next.replies = next.replies.map((r) =>
        r.id === targetId ? { ...r, likeCount: r.likeCount + 1 } : r,
      );
    }
    this.commit(next);
    return row;
  }

  removeLike(targetKind: Like["targetKind"], targetId: string): boolean {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    const id = makeLikeId(next.session.userId, targetKind, targetId);
    const before = next.likes.length;
    next.likes = next.likes.filter((l) => l.id !== id);
    if (next.likes.length === before) return false;
    next.quota = {
      ...next.quota,
      likesUsed: Math.max(0, next.quota.likesUsed - 1),
    };
    if (targetKind === "opinion") {
      next.opinions = next.opinions.map((o) =>
        o.id === targetId
          ? { ...o, likeCount: Math.max(0, o.likeCount - 1) }
          : o,
      );
    } else if (targetKind === "reply") {
      next.replies = next.replies.map((r) =>
        r.id === targetId
          ? { ...r, likeCount: Math.max(0, r.likeCount - 1) }
          : r,
      );
    }
    this.commit(next);
    return true;
  }

  /** 좋아요 토글 → liked 여부 */
  toggleLike(
    targetKind: Like["targetKind"],
    targetId: string,
  ): { liked: boolean } {
    if (this.hasLiked(targetKind, targetId)) {
      this.removeLike(targetKind, targetId);
      return { liked: false };
    }
    this.addLike(targetKind, targetId);
    return { liked: true };
  }

  addReply(
    parentKind: ReplyParentKind,
    parentId: string,
    body: string,
  ): Reply {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    const trimmed = body.trim();
    if (!trimmed) throw new Error("EMPTY_REPLY");
    const row: Reply = {
      id: makeReplyId(parentKind, parentId),
      parentKind,
      parentId,
      authorId: next.session.userId,
      body: trimmed.slice(0, 280),
      likeCount: 0,
      createdAtUtc: new Date().toISOString(),
    };
    next.replies = [...next.replies, row];
    if (parentKind === "opinion") {
      next.opinions = next.opinions.map((o) =>
        o.id === parentId ? { ...o, replyCount: o.replyCount + 1 } : o,
      );
    }
    this.commit(next);
    return row;
  }

  toggleScrap(
    targetKind: ScrapTargetKind,
    targetId: string,
    meta: { preview: string; authorHandle?: string },
  ): { scraped: boolean } {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    const userId = next.session.userId;
    const id = makeScrapId(userId, targetKind, targetId);
    const existing = next.scraps.find((s) => s.id === id);
    if (existing) {
      next.scraps = next.scraps.filter((s) => s.id !== id);
      this.commit(next);
      return { scraped: false };
    }
    const row: Scrap = {
      id,
      userId,
      targetKind,
      targetId,
      preview: meta.preview.slice(0, 200),
      authorHandle: meta.authorHandle,
      createdAtUtc: new Date().toISOString(),
    };
    next.scraps = [...next.scraps, row];
    this.commit(next);
    return { scraped: true };
  }

  /** 본인 글만 삭제 (선택) */
  deleteOpinion(opinionId: string): boolean {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    const op = next.opinions.find((o) => o.id === opinionId);
    if (!op || op.authorId !== next.session.userId) return false;
    next.opinions = next.opinions.filter((o) => o.id !== opinionId);
    next.replies = next.replies.filter(
      (r) => !(r.parentKind === "opinion" && r.parentId === opinionId),
    );
    next.likes = next.likes.filter(
      (l) => !(l.targetKind === "opinion" && l.targetId === opinionId),
    );
    next.scraps = next.scraps.filter(
      (s) => !(s.targetKind === "opinion" && s.targetId === opinionId),
    );
    this.commit(next);
    return true;
  }

  listFollowingUsers(userId?: string): User[] {
    const uid = userId ?? this.snap.session?.userId;
    if (!uid) return [];
    const ids = new Set(
      this.snap.follows.filter((f) => f.followerId === uid).map((f) => f.followeeId),
    );
    return this.snap.users.filter((u) => ids.has(u.id));
  }

  listFollowerUsers(userId?: string): User[] {
    const uid = userId ?? this.snap.session?.userId;
    if (!uid) return [];
    const ids = new Set(
      this.snap.follows.filter((f) => f.followeeId === uid).map((f) => f.followerId),
    );
    return this.snap.users.filter((u) => ids.has(u.id));
  }

  /** 세션이 차단한 userId 집합 */
  blockedUserIds(): Set<string> {
    const sid = this.snap.session?.userId;
    if (!sid) return new Set();
    return new Set(
      this.snap.blocks
        .filter((b) => b.blockerId === sid)
        .map((b) => b.blockedId),
    );
  }

  isBlocked(userId: string): boolean {
    return this.blockedUserIds().has(userId);
  }

  blockUser(blockedId: string): Block {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    const blockerId = next.session.userId;
    if (blockerId === blockedId) throw new Error("CANNOT_BLOCK_SELF");
    const id = makeBlockId(blockerId, blockedId);
    const existing = next.blocks.find((b) => b.id === id);
    if (existing) return existing;
    const row: Block = {
      id,
      blockerId,
      blockedId,
      createdAtUtc: new Date().toISOString(),
    };
    next.blocks = [...next.blocks, row];
    // 맞팔 정리
    next.follows = next.follows.filter(
      (f) =>
        !(
          (f.followerId === blockerId && f.followeeId === blockedId) ||
          (f.followerId === blockedId && f.followeeId === blockerId)
        ),
    );
    this.commit(next);
    return row;
  }

  unblockUser(blockedId: string): boolean {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    const id = makeBlockId(next.session.userId, blockedId);
    const before = next.blocks.length;
    next.blocks = next.blocks.filter((b) => b.id !== id);
    if (next.blocks.length === before) return false;
    this.commit(next);
    return true;
  }

  reportTarget(input: {
    targetKind: ReportTargetKind;
    targetId: string;
    reason: ReportReason;
    note?: string;
  }): Report {
    const next = clone(this.snap);
    if (!next.session) throw new Error("SESSION_REQUIRED");
    const row: Report = {
      id: makeReportId(),
      reporterId: next.session.userId,
      targetKind: input.targetKind,
      targetId: input.targetId,
      reason: input.reason,
      note: input.note,
      createdAtUtc: new Date().toISOString(),
    };
    next.reports = [...next.reports, row];
    this.commit(next);
    return row;
  }

  /** 목: 지지율 소폭 흔들림 */
  bumpArenaShares() {
    const next = clone(this.snap);
    const delta = Math.random() > 0.5 ? 1 : -1;
    const c = Math.min(
      72,
      Math.max(38, next.arenaMeta.challengerShare + delta),
    );
    next.arenaMeta = {
      ...next.arenaMeta,
      challengerShare: c,
      defenderShare: 100 - c,
    };
    this.commit(next);
  }

  /** 테스트·목업 강제 empty */
  clearOpinionsForDay(dayId?: DayId) {
    const d = dayId ?? this.snap.clock.dayId;
    const next = clone(this.snap);
    next.opinions = next.opinions.filter((o) => o.dayId !== d);
    this.commit(next);
  }

  resetToSeed() {
    this.snap = buildSeedSnapshot();
    persist(this.snap);
    this.emit();
  }
}

/** 싱글톤 목 스토어 */
export const domaStore = new MemoryStore();
