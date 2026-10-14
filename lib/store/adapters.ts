import type { Opinion as DomainOpinion } from "@/lib/types/domain";
import { sideFromCamp } from "@/lib/types/ids";
import type { Opinion as UiOpinion } from "@/lib/types";
import type { User } from "@/lib/types/domain";

/** 도메인 Opinion → 홈/ArenaBar 뷰 모델 */
export function toUiOpinion(
  op: DomainOpinion,
  usersById: Map<string, User>,
): UiOpinion {
  const user = usersById.get(op.authorId);
  return {
    id: op.id,
    side: sideFromCamp(op.camp),
    author: user?.handle ?? op.authorId.replace(/^usr_/, ""),
    text: op.body,
    likes: op.likeCount,
    isTopMinority: op.isTopMinority,
  };
}

export function toUiOpinions(
  ops: DomainOpinion[],
  users: User[],
): UiOpinion[] {
  const map = new Map(users.map((u) => [u.id, u]));
  return ops.map((op) => toUiOpinion(op, map));
}
