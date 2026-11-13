import {
  arenaDayId,
  lockAtUtcForDay,
  resolveTimelineClock,
} from "@/lib/kst";
import type { ArenaState, Opinion } from "./types";

/** 전장 마감 — KST 23:00(lock). 쿨다운이면 다음 OPEN까지 */
function arenaEndsAtIso(): string {
  const clock = resolveTimelineClock();
  if (clock.state === "COOLDOWN") return clock.nextOpenAtUtc;
  return lockAtUtcForDay(arenaDayId());
}

export const INITIAL_ARENA: ArenaState = {
  /** 실공유 — KST 오늘 전투 = 제 1회 */
  round: 1,
  topic: "의대 정원 확대는 필요하다",
  description: "",
  endsAt: arenaEndsAtIso(),
  nexusPercent: 50,
  aegisPercent: 50,
  nexusVotes: 0,
  aegisVotes: 0,
  /** 오늘 주제 제안자 — 성 토마스의 허리띠 · 「제안자」 */
  proposerId: "usr_doma_guest",
  proposerHandle: "doma.guest",
};

/** 실공유 — 예시 글 없음. 피드 Empty 「터치하여 증명」 */
export const INITIAL_OPINIONS: Opinion[] = [];
