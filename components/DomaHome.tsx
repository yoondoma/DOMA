"use client";

import { useCallback, useRef, useState } from "react";
import { ArenaBar } from "@/components/ArenaBar";
import { BottomNav, type NavTab } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { PullRefresh } from "@/components/PullRefresh";
import { SupportBar } from "@/components/SupportBar";
import { WieldBar } from "@/components/WieldBar";
import { INITIAL_ARENA, INITIAL_OPINIONS } from "@/lib/mock-data";
import type { ArenaView, Opinion, Side } from "@/lib/types";

function MockPanel({
  title,
  body,
  light,
}: {
  title: string;
  body: string;
  light?: boolean;
}) {
  return (
    <div
      className={`mx-auto flex max-w-[560px] flex-col items-center justify-center px-6 py-20 text-center ${
        light ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <p className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-wide">
        {title}
      </p>
      <p
        className={`mt-2 text-sm ${light ? "text-neutral-500" : "text-muted"}`}
      >
        {body}
      </p>
    </div>
  );
}

function bumpPercents(
  nexus: number,
): { nexus: number; aegis: number } {
  // 목: ±1~2% 흔들림
  const delta = Math.random() > 0.5 ? 1 : -1;
  const next = Math.min(72, Math.max(38, nexus + delta));
  return { nexus: next, aegis: 100 - next };
}

export function DomaHome() {
  const [nexusPercent, setNexusPercent] = useState(INITIAL_ARENA.nexusPercent);
  const [aegisPercent, setAegisPercent] = useState(INITIAL_ARENA.aegisPercent);
  const [joined, setJoined] = useState<Side | null>(null);
  const [opinions, setOpinions] = useState<Opinion[]>(INITIAL_OPINIONS);
  const [arenaView, setArenaView] = useState<ArenaView>("intro");
  const [navTab, setNavTab] = useState<NavTab>("home");
  const [composeOpen, setComposeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const refreshLock = useRef(false);

  const lightShell = navTab === "home" && arenaView === "AEGIS";

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const handleRefresh = useCallback(() => {
    if (refreshLock.current) return;
    refreshLock.current = true;
    setRefreshing(true);

    window.setTimeout(() => {
      const { nexus, aegis } = bumpPercents(nexusPercent);
      setNexusPercent(nexus);
      setAegisPercent(aegis);
      setOpinions((prev) =>
        prev.map((op) => ({
          ...op,
          likes: op.likes + (Math.random() > 0.55 ? 1 : 0),
        })),
      );
      setRefreshing(false);
      refreshLock.current = false;
      showToast("최신 상태로 업데이트했습니다");
    }, 900);
  }, [nexusPercent, showToast]);

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
      side === "NEXUS" ? "도전자 진영에 참전했습니다" : "방어자 진영에 참전했습니다",
    );
  };

  const handleSubmit = (text: string) => {
    const side: Side =
      joined ?? (arenaView === "AEGIS" ? "AEGIS" : "NEXUS");
    const next: Opinion = {
      id: `op-${Date.now()}`,
      side,
      author: "you",
      text,
      likes: 0,
    };
    setOpinions((prev) => [...prev, next]);
    setNavTab("home");
    showToast("진술이 피드에 추가되었습니다");
  };

  const handleNavChange = (tab: NavTab) => {
    if (tab === "compose") {
      setComposeOpen(true);
      return;
    }
    if (tab === "home") {
      setArenaView("intro");
    }
    setNavTab(tab);
  };

  return (
    <div
      className={`min-h-full ${lightShell ? "bg-white text-black" : "bg-black text-white"}`}
    >
      <div
        className={`mx-auto min-h-full max-w-[560px] border-x ${
          lightShell
            ? "border-black/10 bg-white"
            : "border-white/10 bg-black"
        }`}
      >
        <Header
          endsAt={INITIAL_ARENA.endsAt}
          tone={lightShell ? "light" : "dark"}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onOpenHistory={() => showToast("이전 대결 기록 (목업)")}
          onOpenSearch={() => showToast("검색 (목업)")}
        />

        {navTab === "home" ? (
          <PullRefresh
            refreshing={refreshing}
            onRefresh={handleRefresh}
            light={lightShell}
          >
            <ArenaBar
              arena={INITIAL_ARENA}
              opinions={opinions}
              view={arenaView}
              onChangeView={setArenaView}
            />
          </PullRefresh>
        ) : null}

        {navTab === "messages" ? (
          <MockPanel
            title="메시지"
            body="진영·멘션 DM이 여기에 모입니다. (목업)"
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

        <div
          className="h-[calc(84px+3.5rem+env(safe-area-inset-bottom))]"
          aria-hidden
        />
      </div>

      {toast ? (
        <div
          className="fixed inset-x-0 z-[55] flex justify-center px-4"
          style={{
            bottom: "calc(84px + 3.5rem + env(safe-area-inset-bottom) + 8px)",
          }}
          role="status"
        >
          <div
            className={`max-w-[560px] border px-3 py-2 text-center text-[12px] font-medium tracking-wide ${
              lightShell
                ? "border-black/20 bg-white text-black"
                : "border-white/30 bg-black text-white"
            }`}
          >
            {toast}
          </div>
        </div>
      ) : null}

      {navTab === "home" ? (
        <SupportBar
          nexusPercent={nexusPercent}
          aegisPercent={aegisPercent}
          nexusVotes={INITIAL_ARENA.nexusVotes}
          aegisVotes={INITIAL_ARENA.aegisVotes}
          joined={joined}
          onJoin={handleJoin}
        />
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
