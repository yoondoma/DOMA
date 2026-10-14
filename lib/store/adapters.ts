import type { Like, Opinion as DomainOpinion, User } from "@/lib/types/domain";
import { sideFromCamp } from "@/lib/types/ids";
import type { Opinion as UiOpinion } from "@/lib/types";

/** 도메인 Opinion → 홈/ArenaBar 뷰 모델 */
export function toUiOpinion(
  op: DomainOpinion,
  usersById: Map<string, User>,
  likedOpinionIds?: Set<string>,
): UiOpinion {
  const user = usersById.get(op.authorId);
  return {
    id: op.id,
    side: sideFromCamp(op.camp),
    author: user?.handle ?? op.authorId.replace(/^usr_/, ""),
    text: op.body,
    likes: op.likeCount,
    replies: op.replyCount,
    likedByMe: likedOpinionIds?.has(op.id) ?? false,
    isTopMinority: op.isTopMinority,
  };
}

export function toUiOpinions(
  ops: DomainOpinion[],
  users: User[],
  likes: Like[] = [],
  sessionUserId?: string | null,
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
  return ops.map((op) => toUiOpinion(op, map, liked));
}
