"use client";

import { useCallback, useState } from "react";
import { ArenaBar } from "@/components/ArenaBar";
import { Header } from "@/components/Header";
import { OpinionFeed, type FeedTab } from "@/components/OpinionFeed";
import { WieldBar } from "@/components/WieldBar";
import { INITIAL_ARENA, INITIAL_OPINIONS } from "@/lib/mock-data";
import type { Opinion, Side } from "@/lib/types";

export function DomaHome() {
  const [nexusPercent, setNexusPercent] = useState(INITIAL_ARENA.nexusPercent);
  const [aegisPercent, setAegisPercent] = useState(INITIAL_ARENA.aegisPercent);
  const [joined, setJoined] = useState<Side | null>(null);
  const [opinions, setOpinions] = useState<Opinion[]>(INITIAL_OPINIONS);
  const [activeTab, setActiveTab] = useState<FeedTab>("ALL");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const handleJoin = (side: Side) => {
    if (joined === side) return;

    setJoined(side);
    setNexusPercent((prev) => {
      const next =
        side === "NEXUS"
          ? Math.min(95, prev + (joined === "AEGIS" ? 2 : 1))
          : Math.max(5, prev - (joined === "NEXUS" ? 2 : 1));
      setAegisPercent(100 - next);
      return next;
    });
    showToast(`${side} 진영에 참전했습니다`);
  };

  const handleSubmit = (text: string) => {
    const side: Side = joined ?? "NEXUS";
    const next: Opinion = {
      id: `op-${Date.now()}`,
      side,
      author: "you",
      text,
      likes: 0,
    };
    setOpinions((prev) => {
      const top = prev.filter((o) => o.isTopMinority);
      const rest = prev.filter((o) => !o.isTopMinority);
      return [...top, next, ...rest];
    });
    showToast("진술이 피드에 추가되었습니다");
  };

  return (
    <div className="min-h-full bg-black text-white">
      <Header endsAt={INITIAL_ARENA.endsAt} />
      <ArenaBar
        topic={INITIAL_ARENA.topic}
        nexusPercent={nexusPercent}
        aegisPercent={aegisPercent}
        onJoin={handleJoin}
        joined={joined}
      />
      <OpinionFeed
        opinions={opinions}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <WieldBar side={joined} onSubmit={handleSubmit} toast={toast} />
    </div>
  );
}
