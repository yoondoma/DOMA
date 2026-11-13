import { battleByDate } from "@/lib/battle-history";
import type { BattleDay, Side } from "@/lib/types";

/** 아카이브 댓글 */
export type ArchiveComment = {
  id: string;
  author: string;
  body: string;
  timeLabel?: string;
  likes?: number;
};

/** 아카이브 의견 뷰 — 달력 하루·챔피언 스레드 */
export type ArchiveOpinion = {
  id: string;
  side: Side;
  author: string;
  body: string;
  likes: number;
  supports: number;
  adoptedLabel?: string;
  comments: ArchiveComment[];
  mood?: string;
};

export type DayArchive = {
  date: string;
  round: number;
  topic: string;
  winner: Side | "JOINT";
  champion: ArchiveOpinion;
  rival: ArchiveOpinion;
  challenger: ArchiveOpinion;
  defender: ArchiveOpinion;
  proposerHandle?: string;
  proposerNote?: string;
  hasGirdle?: boolean;
};

function opinionFromBattle(
  battle: BattleDay,
  role: "winner" | "opponent",
): ArchiveOpinion {
  const win = role === "winner";
  const side: Side =
    battle.winner === "JOINT"
      ? win
        ? "NEXUS"
        : "AEGIS"
      : win
        ? battle.winner
        : battle.winner === "NEXUS"
          ? "AEGIS"
          : "NEXUS";
  return {
    id: `${battle.date}-${role}`,
    side,
    author: win ? battle.winnerAuthor : battle.opponentAuthor,
    body: win ? battle.winnerOpinion : battle.opponentOpinion,
    likes: win ? 120 : 80,
    supports: win ? battle.winnerPercent : battle.loserPercent,
    adoptedLabel: win && battle.hasGirdle ? "채택" : undefined,
    comments: [],
    mood: win ? "판결 측" : "패배 측",
  };
}

function sideOpinion(battle: BattleDay, side: Side): ArchiveOpinion {
  const winnerSide =
    battle.winner === "JOINT" ? "NEXUS" : (battle.winner as Side);
  if (side === winnerSide || battle.winner === "JOINT") {
    const base = opinionFromBattle(battle, "winner");
    return { ...base, side, mood: side === "NEXUS" ? "돌격" : "방어" };
  }
  const base = opinionFromBattle(battle, "opponent");
  return { ...base, side, mood: side === "NEXUS" ? "돌격" : "방어" };
}

/** 날짜 → 하루 아카이브 (목 히스토리 기반) */
export function dayArchive(date: string, _now?: Date): DayArchive | null {
  const battle = battleByDate(date);
  if (!battle) return null;
  const champion = opinionFromBattle(battle, "winner");
  const rival = opinionFromBattle(battle, "opponent");
  return {
    date: battle.date,
    round: battle.round,
    topic: battle.topic,
    winner: battle.winner,
    champion,
    rival,
    challenger: sideOpinion(battle, "NEXUS"),
    defender: sideOpinion(battle, "AEGIS"),
    proposerHandle: battle.proposerHandle,
    proposerNote: battle.proposerHandle
      ? `@${battle.proposerHandle} 제안`
      : undefined,
    hasGirdle: battle.hasGirdle,
  };
}
