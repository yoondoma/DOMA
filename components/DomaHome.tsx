"use client";

import { useCallback, useRef, useState } from "react";
import { ArenaBar } from "@/components/ArenaBar";
import { BattleCalendar } from "@/components/BattleCalendar";
import { BottomNav, type NavTab } from "@/components/BottomNav";
import { ComposeChoice } from "@/components/ComposeChoice";
import { Header, type HomeSurface } from "@/components/Header";
import { MessagesScreen } from "@/components/MessagesScreen";
import { NotificationsScreen } from "@/components/NotificationsScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { PullRefresh } from "@/components/PullRefresh";
import { SearchSheet } from "@/components/SearchSheet";
import {
  SettingsSheet,
  type EditableProfile,
} from "@/components/SettingsSheet";
import { PROFILE_USER } from "@/lib/profile-mock";
import { ShareResultCard } from "@/components/ShareResultCard";
import { SupportBar } from "@/components/SupportBar";
import { TomorrowCompose } from "@/components/TomorrowCompose";
import { TomorrowField } from "@/components/TomorrowField";
import { TouchGate } from "@/components/TouchGate";
import { WieldBar } from "@/components/WieldBar";
import { INITIAL_ARENA, INITIAL_OPINIONS } from "@/lib/mock-data";
import { MOCK_SHARE_RESULT } from "@/lib/share-result-mock";
import {
  profileForHandle,
  type NotificationTarget,
  type SocialProfile,
} from "@/lib/social-mock";
import {
  INITIAL_TOMORROW_TOPICS,
  type TomorrowCandidate,
} from "@/lib/tomorrow-topics";
import type { ArenaView, Opinion, Side } from "@/lib/types";
import { useUiDemo } from "@/lib/use-ui-demo";

function bumpPercents(
  nexus: number,
): { nexus: number; aegis: number } {
  // 목: ±1~2% 흔들림
  const delta = Math.random() > 0.5 ? 1 : -1;
  const next = Math.min(72, Math.max(38, nexus + delta));
  return { nexus: next, aegis: 100 - next };
}

export function DomaHome() {
  const { demo: uiDemo, retry: onRetry } = useUiDemo();
  const [nexusPercent, setNexusPercent] = useState(INITIAL_ARENA.nexusPercent);
  const [aegisPercent, setAegisPercent] = useState(INITIAL_ARENA.aegisPercent);
  const [joined, setJoined] = useState<Side | null>(null);
  const [opinions, setOpinions] = useState<Opinion[]>(INITIAL_OPINIONS);
  const [arenaView, setArenaView] = useState<ArenaView>("intro");
  const [navTab, setNavTab] = useState<NavTab>("home");
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [todayComposeOpen, setTodayComposeOpen] = useState(false);
  const [tomorrowComposeOpen, setTomorrowComposeOpen] = useState(false);
  const [tomorrowCandidates, setTomorrowCandidates] = useState<
    TomorrowCandidate[]
  >(INITIAL_TOMORROW_TOPICS);
  const [supportedTomorrowId, setSupportedTomorrowId] = useState<string | null>(
    null,
  );
  const [homeSurface, setHomeSurface] = useState<HomeSurface>("today");
  const [toast, setToast] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [entered, setEntered] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [editableProfile, setEditableProfile] = useState<EditableProfile>({
    name: PROFILE_USER.name,
    handle: PROFILE_USER.handle,
    bio: PROFILE_USER.bio,
    avatarChar: PROFILE_USER.name.slice(0, 1),
  });
  /** 알림·DM에서 연 타인 프로필 */
  const [guestProfile, setGuestProfile] = useState<SocialProfile | null>(null);
  const [returnTab, setReturnTab] = useState<NavTab | null>(null);
  /** 알림 → 해당 글 하이라이트 */
  const [focusOpinionId, setFocusOpinionId] = useState<string | null>(null);
  const refreshLock = useRef(false);

  const lightShell =
    navTab === "home" && homeSurface === "today" && arenaView === "AEGIS";

  const feedOpinions = uiDemo === "empty" ? [] : opinions;

  const openCompose = useCallback(() => {
    setChoiceOpen(true);
  }, []);

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
      stewards: 1,
      note: imageName
        ? "필드에 새로 제안된 후보입니다. (이미지 첨부)"
        : "필드에 새로 제안된 후보입니다.",
    };
    setTomorrowCandidates((prev) => [item, ...prev]);
    setNavTab("home");
    setHomeSurface("tomorrow");
    showToast(
      imageName
        ? "내일 필드에 주제·이미지가 올라갔습니다"
        : "내일 필드에 주제가 올라갔습니다",
    );
  };

  const handleSupportTomorrow = (id: string) => {
    if (supportedTomorrowId === id) return;
    setTomorrowCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, votes: c.votes + 1, stewards: c.stewards + 1 };
        }
        if (c.id === supportedTomorrowId) {
          return {
            ...c,
            votes: Math.max(0, c.votes - 1),
            stewards: Math.max(0, c.stewards - 1),
          };
        }
        return c;
      }),
    );
    setSupportedTomorrowId(id);
    const title = tomorrowCandidates.find((c) => c.id === id)?.title ?? "";
    const short = title.length > 18 ? `${title.slice(0, 18)}…` : title;
    showToast(`「${short}」를 지지·이끕니다`);
  };

  const handleNavChange = (tab: NavTab) => {
    if (tab === "compose") {
      setChoiceOpen(true);
      return;
    }
    setGuestProfile(null);
    setReturnTab(null);
    if (tab === "home") {
      setArenaView("intro");
      setHomeSurface("today");
      setFocusOpinionId(null);
    }
    setNavTab(tab);
  };

  const openGuestProfile = useCallback(
    (profile: SocialProfile, from: NavTab) => {
      const resolved = profileForHandle(profile.handle);
      setReturnTab(from);
      setGuestProfile({
        ...resolved,
        name: profile.name || resolved.name,
        handle: profile.handle || resolved.handle,
      });
    },
    [],
  );

  const handleNotificationNavigate = useCallback(
    (target: NotificationTarget) => {
      if (target.type === "share") {
        setShareOpen(true);
        return;
      }
      if (target.type === "arena") {
        setGuestProfile(null);
        setFocusOpinionId(null);
        setHomeSurface("today");
        setArenaView("intro");
        setNavTab("home");
        showToast("오늘 아레나로 이동했습니다");
        return;
      }
      if (target.type === "opinion") {
        setGuestProfile(null);
        setHomeSurface("today");
        setArenaView(target.side);
        setFocusOpinionId(target.opinionId);
        setNavTab("home");
        showToast("해당 글로 이동했습니다");
        return;
      }
      if (target.type === "profile") {
        openGuestProfile(profileForHandle(target.handle), "alerts");
        setNavTab("alerts");
      }
    },
    [openGuestProfile, showToast],
  );

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
          onOpenHistory={() => setCalendarOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          trailing={navTab === "profile" ? "settings" : "search"}
          surface={homeSurface}
          onSurfaceChange={
            navTab === "home"
              ? (s) => {
                  setHomeSurface(s);
                  if (s === "today") setArenaView("intro");
                }
              : undefined
          }
        />

        {guestProfile ? (
          <ProfileScreen
            isSelf={false}
            profile={{
              name: guestProfile.name,
              handle: guestProfile.handle,
              bio: guestProfile.bio,
              avatarChar: guestProfile.avatarChar,
            }}
            onBack={() => {
              setGuestProfile(null);
              if (returnTab) setNavTab(returnTab);
              setReturnTab(null);
            }}
            uiDemo={uiDemo}
            onRetry={onRetry}
          />
        ) : null}

        {!guestProfile && navTab === "home" && homeSurface === "today" ? (
          <PullRefresh
            refreshing={refreshing}
            onRefresh={handleRefresh}
            light={lightShell}
          >
            <ArenaBar
              arena={INITIAL_ARENA}
              opinions={feedOpinions}
              view={arenaView}
              onChangeView={(v) => {
                setArenaView(v);
                if (v === "intro") setFocusOpinionId(null);
              }}
              focusOpinionId={focusOpinionId}
              uiDemo={uiDemo}
              onRetry={onRetry}
              onCompose={openCompose}
            />
          </PullRefresh>
        ) : null}

        {!guestProfile && navTab === "home" && homeSurface === "tomorrow" ? (
          <TomorrowField
            candidates={tomorrowCandidates}
            supportedId={supportedTomorrowId}
            onSupport={handleSupportTomorrow}
            onPropose={() => setTomorrowComposeOpen(true)}
            uiDemo={uiDemo}
            onRetry={onRetry}
          />
        ) : null}

        {!guestProfile && navTab === "messages" ? (
          <MessagesScreen
            onOpenProfile={(p) => openGuestProfile(p, "messages")}
            uiDemo={uiDemo}
            onRetry={onRetry}
          />
        ) : null}

        {!guestProfile && navTab === "alerts" ? (
          <NotificationsScreen
            onNavigate={handleNotificationNavigate}
            onOpenProfile={(handle) => {
              openGuestProfile(profileForHandle(handle), "alerts");
            }}
            uiDemo={uiDemo}
            onRetry={onRetry}
          />
        ) : null}

        {!guestProfile && navTab === "profile" ? (
          <ProfileScreen
            isSelf
            profile={editableProfile}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenShareCard={() => setShareOpen(true)}
            uiDemo={uiDemo}
            onRetry={onRetry}
            onCompose={openCompose}
          />
        ) : null}

        <div
          className={
            navTab === "home" && homeSurface === "today"
              ? "h-[calc(84px+3.5rem+env(safe-area-inset-bottom))]"
              : "h-[calc(3.5rem+env(safe-area-inset-bottom))]"
          }
          aria-hidden
        />
      </div>

      {toast ? (
        <div
          className="fixed inset-x-0 z-[55] flex justify-center px-4"
          style={{
            bottom:
              navTab === "home" && homeSurface === "today"
                ? "calc(84px + 3.5rem + env(safe-area-inset-bottom) + 8px)"
                : "calc(3.5rem + env(safe-area-inset-bottom) + 8px)",
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

      {navTab === "home" && homeSurface === "today" ? (
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
        onClose={() => setCalendarOpen(false)}
      />
      <SearchSheet
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        uiDemo={uiDemo}
        onRetry={onRetry}
      />
      <SettingsSheet
        open={settingsOpen}
        profile={editableProfile}
        onSave={setEditableProfile}
        onClose={() => setSettingsOpen(false)}
        onToast={showToast}
      />

      <ComposeChoice
        open={choiceOpen}
        onClose={() => setChoiceOpen(false)}
        onPick={(kind) => {
          setChoiceOpen(false);
          if (kind === "today") setTodayComposeOpen(true);
          else {
            setHomeSurface("tomorrow");
            setTomorrowComposeOpen(true);
          }
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
      <ShareResultCard
        open={shareOpen}
        result={MOCK_SHARE_RESULT}
        onClose={() => setShareOpen(false)}
        onToast={showToast}
      />
      <BottomNav active={navTab} onChange={handleNavChange} />
    </div>
  );
}
