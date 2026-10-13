"use client";

import { useCallback, useState } from "react";
import { ArenaBar } from "@/components/ArenaBar";
import { BottomNav, type NavTab } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { OpinionFeed, type FeedTab } from "@/components/OpinionFeed";
import { WieldBar } from "@/components/WieldBar";
import { INITIAL_ARENA, INITIAL_OPINIONS } from "@/lib/mock-data";
import type { Opinion, Side } from "@/lib/types";

function MockPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-wide">
        {title}
      </p>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}

export function DomaHome() {
  const [nexusPercent, setNexusPercent] = useState(INITIAL_ARENA.nexusPercent);
  const [aegisPercent, setAegisPercent] = useState(INITIAL_ARENA.aegisPercent);
  const [joined, setJoined] = useState<Side | null>(null);
  const [opinions, setOpinions] = useState<Opinion[]>(INITIAL_OPINIONS);
  const [feedTab, setFeedTab] = useState<FeedTab>("ALL");
  const [navTab, setNavTab] = useState<NavTab>("home");
  const [composeOpen, setComposeOpen] = useState(false);
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
    showToast(
      side === "NEXUS" ? "검은 진영(검사)에 참전했습니다" : "하얀 진영(변호)에 참전했습니다",
    );
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
    setNavTab("home");
    showToast("진술이 피드에 추가되었습니다");
  };

  const handleNavChange = (tab: NavTab) => {
    if (tab === "compose") {
      setComposeOpen(true);
      return;
    }
    setNavTab(tab);
  };

  return (
    <div className="min-h-full bg-black text-white">
      <div className="mx-auto min-h-full max-w-[560px] border-x border-white/10 bg-black">
        <Header endsAt={INITIAL_ARENA.endsAt} />

        {navTab === "home" ? (
          <>
            <ArenaBar
              arena={INITIAL_ARENA}
              nexusPercent={nexusPercent}
              aegisPercent={aegisPercent}
              onJoin={handleJoin}
              joined={joined}
              compact
            />
            <OpinionFeed
              opinions={opinions}
              activeTab={feedTab}
              onTabChange={setFeedTab}
            />
          </>
        ) : null}

        {navTab === "arena" ? (
          <ArenaBar
            arena={INITIAL_ARENA}
            nexusPercent={nexusPercent}
            aegisPercent={aegisPercent}
            onJoin={handleJoin}
            joined={joined}
          />
        ) : null}

        {navTab === "alerts" ? (
          <MockPanel
            title="알림"
            body="곧 참전·멘션·소수의견 알림이 여기에 모입니다. (목업)"
          />
        ) : null}

        {navTab === "profile" ? (
          <MockPanel
            title="프로필"
            body="로그인·진영 기록은 이후 단계에서 붙입니다. (목업)"
          />
        ) : null}

        <div className="h-16" aria-hidden />
      </div>

      {toast ? (
        <div
          className="fixed inset-x-0 bottom-20 z-[55] flex justify-center px-4"
          role="status"
        >
          <div className="max-w-[560px] border border-white/30 bg-black px-3 py-2 text-center text-[12px] font-medium tracking-wide text-white">
            {toast}
          </div>
        </div>
      ) : null}

      <WieldBar
        open={composeOpen}
        side={joined}
        onClose={() => setComposeOpen(false)}
        onSubmit={handleSubmit}
      />
      <BottomNav active={navTab} onChange={handleNavChange} />
    </div>
  );
}
