"use client";

import { resolveTimelineClock } from "@/lib/kst";
import type {
  Camp,
  DayId,
  Follow,
  Like,
  Opinion,
  Reply,
  Session,
  TopicCandidate,
  User,
} from "@/lib/types/domain";
import {
  makeFollowId,
  makeLikeId,
  makeOpinionId,
  makeReplyId,
  makeSessionId,
  makeTopicCandidateId,
} from "@/lib/types/ids";
import { buildSeedSnapshot } from "@/lib/store/seed";
import type {
  ArenaMeta,
  CreateOpinionInput,
  StoreSnapshot,
} from "@/lib/store/types";

const STORAGE_KEY = "doma.store.v1";

type Listener = () => void;

function clone<T>(v: T): T {
  return structuredClone(v);
}

function loadPersisted(): StoreSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoreSnapshot;
    if (parsed?.version !== 1) return null;
    return parsed;
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

  /** 브라우저에서 로컬 복원 후 시드 보정 */
  init() {
    if (this.ready) return;
    this.ready = true;
    const saved = loadPersisted();
    if (saved) {
      this.snap = saved;
      this.snap.clock = resolveTimelineClock();
    } else {
      this.snap = buildSeedSnapshot();
      persist(this.snap);
    }
    this.emit();
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

  getArenaMeta(): ArenaMeta {
    return this.snap.arenaMeta;
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

  listReplies(opinionId?: string): Reply[] {
    if (!opinionId) return this.snap.replies;
    return this.snap.replies.filter((r) => r.opinionId === opinionId);
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

  setJoinedCamp(camp: Camp | null) {
    const next = clone(this.snap);
    if (!next.session) return;
    next.session.joinedCamp = camp;
    this.commit(next);
  }

  createOpinion(input: CreateOpinionInput): Opinion {
    const next = clone(this.snap);
    const dayId = next.clock.dayId;
    const authorId =
      input.authorId ??
      next.session?.userId ??
      next.users.find((u) => u.handle === "soohan")?.id ??
      next.users[0]?.id;
    if (!authorId) throw new Error("no author");

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
    this.commit(next);
    return op;
  }

  createTopicCandidate(input: {
    title: string;
    body?: string;
    targetDayId: DayId;
    proposerId?: string;
  }): TopicCandidate {
    const next = clone(this.snap);
    const proposerId =
      input.proposerId ??
      next.session?.userId ??
      next.users.find((u) => u.handle === "soohan")?.id!;
    const tc: TopicCandidate = {
      id: makeTopicCandidateId(input.targetDayId),
      targetDayId: input.targetDayId,
      title: input.title,
      body: input.body ?? "",
      supportCount: 1,
      stewardCount: 1,
      proposerId,
      createdAtUtc: new Date().toISOString(),
    };
    next.topicCandidates = [tc, ...next.topicCandidates];
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

  addFollow(followerId: string, followeeId: string): Follow {
    const next = clone(this.snap);
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

  addLike(
    userId: string,
    targetKind: Like["targetKind"],
    targetId: string,
  ): Like {
    const next = clone(this.snap);
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
    if (targetKind === "opinion") {
      next.opinions = next.opinions.map((o) =>
        o.id === targetId ? { ...o, likeCount: o.likeCount + 1 } : o,
      );
    }
    this.commit(next);
    return row;
  }

  addReply(opinionId: string, authorId: string, body: string): Reply {
    const next = clone(this.snap);
    const row: Reply = {
      id: makeReplyId(opinionId),
      opinionId,
      authorId,
      body: body.slice(0, 280),
      likeCount: 0,
      createdAtUtc: new Date().toISOString(),
    };
    next.replies = [...next.replies, row];
    next.opinions = next.opinions.map((o) =>
      o.id === opinionId ? { ...o, replyCount: o.replyCount + 1 } : o,
    );
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
