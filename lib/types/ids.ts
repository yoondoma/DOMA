import type { Camp, DayId, LikeTargetKind } from "@/lib/types/domain";

/** id 접두 — API 이관 시에도 유지 */
export const ID = {
  user: "usr",
  session: "ses",
  opinion: "op",
  topic: "tc",
  follow: "fol",
  like: "lk",
  reply: "rp",
  block: "blk",
  report: "rpt",
} as const;

function stamp(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function userIdFromHandle(handle: string): string {
  const h = handle.replace(/^@/, "").toLowerCase();
  return `${ID.user}_${h}`;
}

export function makeSessionId(dayId: DayId, userId: string): string {
  return `${ID.session}_${dayId}_${userId.replace(/^usr_/, "")}`;
}

export function makeOpinionId(dayId?: DayId): string {
  return dayId
    ? `${ID.opinion}_${dayId}_${stamp()}`
    : `${ID.opinion}_${stamp()}`;
}

export function makeTopicCandidateId(targetDayId: DayId): string {
  return `${ID.topic}_${targetDayId}_${stamp()}`;
}

export function makeFollowId(followerId: string, followeeId: string): string {
  return `${ID.follow}_${followerId}_${followeeId}`;
}

export function makeLikeId(
  userId: string,
  targetKind: LikeTargetKind,
  targetId: string,
): string {
  return `${ID.like}_${targetKind}_${targetId}_${userId}`;
}

export function makeReplyId(opinionId: string): string {
  return `${ID.reply}_${opinionId}_${stamp()}`;
}

export function makeBlockId(blockerId: string, blockedId: string): string {
  return `${ID.block}_${blockerId}_${blockedId}`;
}

export function makeReportId(): string {
  return `${ID.report}_${stamp()}`;
}

/** UI Side ↔ Camp */
export function campFromSide(side: "NEXUS" | "AEGIS"): Camp {
  return side === "NEXUS" ? "challenger" : "defender";
}

export function sideFromCamp(camp: Camp): "NEXUS" | "AEGIS" {
  return camp === "challenger" ? "NEXUS" : "AEGIS";
}
