import type {
  CampSwitch,
  Like,
  Opinion as DomainOpinion,
  Support,
  User,
} from "@/lib/types/domain";
import { sideFromCamp } from "@/lib/types/ids";
import type { Opinion as UiOpinion } from "@/lib/types";

/** 도메인 Opinion → 홈/ArenaBar 뷰 모델 */
export function toUiOpinion(
  op: DomainOpinion,
  usersById: Map<string, User>,
  likedOpinionIds?: Set<string>,
  supportedOpinionIds?: Set<string>,
  trojanByOpinion?: Map<string, number>,
): UiOpinion {
  const user = usersById.get(op.authorId);
  return {
    id: op.id,
    side: sideFromCamp(op.camp),
    author: user?.handle ?? op.authorId.replace(/^usr_/, ""),
    authorId: op.authorId,
    text: op.body,
    likes: op.likeCount,
    supports: op.supportCount,
    trojanCount: trojanByOpinion?.get(op.id) ?? 0,
    replies: op.replyCount,
    likedByMe: likedOpinionIds?.has(op.id) ?? false,
    supportedByMe: supportedOpinionIds?.has(op.id) ?? false,
    isTopMinority: op.isTopMinority,
  };
}

export function toUiOpinions(
  ops: DomainOpinion[],
  users: User[],
  likes: Like[] = [],
  sessionUserId?: string | null,
  supports: Support[] = [],
  campSwitches: CampSwitch[] = [],
): UiOpinion[] {
  const map = new Map(users.map((u) => [u.id, u]));
  const liked = new Set(
    likes
      .filter(
        (l) =>
          l.targetKind === "opinion" &&
          (!sessionUserId || l.userId === sessionUserId),
      )
      .map((l) => l.targetId),
  );
  const supported = new Set(
    supports
      .filter((s) => !sessionUserId || s.userId === sessionUserId)
      .map((s) => s.opinionId),
  );
  const trojanByOpinion = new Map<string, number>();
  for (const sw of campSwitches) {
    trojanByOpinion.set(
      sw.opinionId,
      (trojanByOpinion.get(sw.opinionId) ?? 0) + 1,
    );
  }
  return ops.map((op) =>
    toUiOpinion(op, map, liked, supported, trojanByOpinion),
  );
}
