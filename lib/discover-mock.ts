/**
 * 발견 스트립 v0 — 규칙 목업만 (ML 없음).
 * 스펙: social-rules.md F20 · 홈 한 줄 · 하단 탭 금지
 */

import { BATTLE_HISTORY } from "@/lib/battle-history";
import { INITIAL_ARENA } from "@/lib/mock-data";
import { INITIAL_TOMORROW_TOPICS } from "@/lib/tomorrow-topics";

export type DiscoverKind = "hot" | "proposal" | "verdict";

export type DiscoverItem = {
  id: string;
  kind: DiscoverKind;
  /** 칩 왼쪽 짧은 라벨 */
  eyebrow: string;
  title: string;
  meta?: string;
};

function yesterdayVerdict(): DiscoverItem | null {
  const last = BATTLE_HISTORY[BATTLE_HISTORY.length - 1];
  if (!last) return null;
  const win =
    last.winner === "JOINT"
      ? "공동"
      : last.winner === "NEXUS"
        ? "도전자"
        : "방어자";
  return {
    id: `discover-verdict-${last.date}`,
    kind: "verdict",
    eyebrow: "어제 판결",
    title: last.topic,
    meta: `${win} ${last.winnerPercent}%`,
  };
}

function hotBattle(): DiscoverItem {
  return {
    id: "discover-hot-today",
    kind: "hot",
    eyebrow: "지금 뜨거운",
    title: INITIAL_ARENA.topic,
    meta: `제 ${INITIAL_ARENA.round}회 · 지지 ${INITIAL_ARENA.nexusVotes + INITIAL_ARENA.aegisVotes}`,
  };
}

function topProposal(): DiscoverItem | null {
  const top = [...INITIAL_TOMORROW_TOPICS].sort((a, b) => b.votes - a.votes)[0];
  if (!top) return null;
  return {
    id: `discover-proposal-${top.id}`,
    kind: "proposal",
    eyebrow: "지지 많은 제안",
    title: top.title,
    meta: `지지 ${top.votes.toLocaleString("ko-KR")}`,
  };
}

/** 홈 한 줄용 2~3항목 */
export function listDiscoverStrip(): DiscoverItem[] {
  const items: DiscoverItem[] = [hotBattle()];
  const proposal = topProposal();
  if (proposal) items.push(proposal);
  const verdict = yesterdayVerdict();
  if (verdict) items.push(verdict);
  return items.slice(0, 3);
}
