"use client";

import { useCallback, useRef, useState } from "react";
import { ArenaBar } from "@/components/ArenaBar";
import { BattleCalendar } from "@/components/BattleCalendar";
import type { CalendarPanel } from "@/components/BattleCalendar";
import { BottomNav, type NavTab } from "@/components/BottomNav";
import { ComposeChoice } from "@/components/ComposeChoice";
import { Header } from "@/components/Header";
import { MessagesScreen } from "@/components/MessagesScreen";
import { NotificationsScreen } from "@/components/NotificationsScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { PullRefresh } from "@/components/PullRefresh";
import { SearchSheet } from "@/components/SearchSheet";
import { SupportBar } from "@/components/SupportBar";
import { TomorrowCompose } from "@/components/TomorrowCompose";
import { TouchGate } from "@/components/TouchGate";
import { WieldBar } from "@/components/WieldBar";
import { INITIAL_ARENA, INITIAL_OPINIONS } from "@/lib/mock-data";
import type { TomorrowCandidate } from "@/lib/tomorrow-topics";
import type { ArenaView, Opinion, Side } from "@/lib/types";

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
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [todayComposeOpen, setTodayComposeOpen] = useState(false);
  const [tomorrowComposeOpen, setTomorrowComposeOpen] = useState(false);
  const [tomorrowExtras, setTomorrowExtras] = useState<TomorrowCandidate[]>(
    [],
  );
  const [toast, setToast] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [entered, setEntered] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarPanel, setCalendarPanel] =
    useState<CalendarPanel>("history");
  const [searchOpen, setSearchOpen] = useState(false);
  const refreshLock = useRef(false);

  const openCalendar = (panel: CalendarPanel = "history") => {
    setCalendarPanel(panel);
    setCalendarOpen(true);
  };

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

  const handleSubmitToday = (text: string, imageName?: string) => {
    const side: Side =
      joined ?? (arenaView === "AEGIS" ? "AEGIS" : "NEXUS");
    const next: Opinion = {
      id: `op-${Date.now()}`,
      side,
      author: "you",
      text: imageName ? `${text} · [이미지]` : text,
      likes: 0,
    };
    setOpinions((prev) => [...prev, next]);
    setNavTab("home");
    setArenaView("intro");
    showToast(
      imageName
        ? "진술·이미지가 피드에 추가되었습니다"
        : "진술이 피드에 추가되었습니다",
    );
  };

  const handleSubmitTomorrow = (title: string, imageName?: string) => {
    const item: TomorrowCandidate = {
      id: `tm-you-${Date.now()}`,
      title,
      votes: 1,
    };
    setTomorrowExtras((prev) => [item, ...prev]);
    setNavTab("home");
    showToast(
      imageName
        ? "내일 주제·이미지가 제안되었습니다"
        : "내일 주제가 제안되었습니다",
    );
  };

  const handleNavChange = (tab: NavTab) => {
    if (tab === "compose") {
      setChoiceOpen(true);
      return;
    }
    if (tab === "home") {
      setArenaView("intro");
    }
    setNavTab(tab);
  };

  if (!entered) {
    return <TouchGate onEnter={() => setEntered(true)} />;
  }

  return (
    <div
      className={`min-h-full ${lightShell ? "bg-white text-black" : "bg-black text-white"}`}
    >
      {/* 스크롤 본문만 페이드 — fixed 하단바/시트는 밖에 둬 containing block 유지 */}
      <div
        className={`arena-enter mx-auto min-h-full max-w-[560px] border-x ${
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
          onOpenHistory={() => openCalendar("history")}
          onOpenSearch={() => setSearchOpen(true)}
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
            {/* 초기=주제만. 피드·의견은 진영 펼침 후에 */}
          </PullRefresh>
        ) : null}

        {navTab === "messages" ? <MessagesScreen /> : null}

        {navTab === "alerts" ? <NotificationsScreen /> : null}

        {navTab === "profile" ? <ProfileScreen /> : null}

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

      <BattleCalendar
        open={calendarOpen}
        initialPanel={calendarPanel}
        tomorrowExtras={tomorrowExtras}
        onClose={() => setCalendarOpen(false)}
        onVotedTomorrow={(title) => {
          const short = title.length > 20 ? `${title.slice(0, 20)}…` : title;
          showToast(`「${short}」에 투표했습니다`);
        }}
      />
      <SearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />

      <ComposeChoice
        open={choiceOpen}
        onClose={() => setChoiceOpen(false)}
        onPick={(kind) => {
          setChoiceOpen(false);
          if (kind === "today") setTodayComposeOpen(true);
          else setTomorrowComposeOpen(true);
        }}
      />
      <WieldBar
        open={todayComposeOpen}
        side={joined}
        onClose={() => setTodayComposeOpen(false)}
        onSubmit={handleSubmitToday}
      />
      <TomorrowCompose
        open={tomorrowComposeOpen}
        onClose={() => setTomorrowComposeOpen(false)}
        onSubmit={handleSubmitTomorrow}
      />
      <BottomNav active={navTab} onChange={handleNavChange} />
    </div>
  );
}
