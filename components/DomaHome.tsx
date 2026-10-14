"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArenaBar } from "@/components/ArenaBar";
import { BattleCalendar } from "@/components/BattleCalendar";
import { BottomNav, type NavTab } from "@/components/BottomNav";
import { ComposeChoice } from "@/components/ComposeChoice";
import {
  Header,
  type AlertCategory,
  type HomeSurface,
} from "@/components/Header";
import { MessagesScreen } from "@/components/MessagesScreen";
import { NotificationsScreen } from "@/components/NotificationsScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { PullRefresh } from "@/components/PullRefresh";
import { RulesSheet } from "@/components/RulesSheet";
import { SearchSheet } from "@/components/SearchSheet";
import { AdSlot } from "@/components/AdSlot";
import { AuthSheet } from "@/components/AuthSheet";
import {
  ProfileEditSheet,
  type EditableProfile,
} from "@/components/ProfileEditSheet";
import { SettingsSheet } from "@/components/SettingsSheet";
import { PROFILE_USER } from "@/lib/profile-mock";
import { ContextualShareCard } from "@/components/ContextualShareCard";
import { ShareResultCard } from "@/components/ShareResultCard";
import { SupportBar } from "@/components/SupportBar";
import { TomorrowCompose } from "@/components/TomorrowCompose";
import { TomorrowField } from "@/components/TomorrowField";
import { TouchGate } from "@/components/TouchGate";
import { WieldBar } from "@/components/WieldBar";
import type { ContextualSharePayload } from "@/lib/contextual-share";
import type { DiscoverItem } from "@/lib/discover-mock";
import { INITIAL_ARENA } from "@/lib/mock-data";
import { MOCK_SHARE_RESULT } from "@/lib/share-result-mock";
import {
  profileForHandle,
  type NotificationTarget,
  type SocialProfile,
} from "@/lib/social-mock";
import { playDomaSting } from "@/lib/sound/doma-sound";
import {
  formatComposeMediaSuffix,
  formatCooldownToast,
  type ComposeMedia,
} from "@/lib/types/content";
import { campFromSide, sideFromCamp } from "@/lib/types/ids";
import {
  INITIAL_TOMORROW_TOPICS,
  type TomorrowCandidate,
} from "@/lib/tomorrow-topics";
import type { ArenaView, Side } from "@/lib/types";
import { useUiDemo } from "@/lib/use-ui-demo";
import { domaStore, useDomaStore, useSession, useUiOpinions } from "@/lib/store";
import { nextDayId } from "@/lib/kst";

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
  const { session, user: currentUser } = useSession();
  const storeSnap = useDomaStore();
  const storeOpinions = useUiOpinions();
  const judgmentPlayed = useRef<string | null>(null);
  const [nexusPercent, setNexusPercent] = useState(INITIAL_ARENA.nexusPercent);
  const [aegisPercent, setAegisPercent] = useState(INITIAL_ARENA.aegisPercent);
  const [joined, setJoined] = useState<Side | null>(null);
  const [arenaView, setArenaView] = useState<ArenaView>("intro");
  const [navTab, setNavTab] = useState<NavTab>("home");
  const [profileTab, setProfileTab] = useState<"posts" | "scraps" | "battles">(
    "posts",
  );
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
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [leftSocialId, setLeftSocialId] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [contextualShare, setContextualShare] =
    useState<ContextualSharePayload | null>(null);
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
  const [alertCategory, setAlertCategory] = useState<AlertCategory>("all");
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const refreshLock = useRef(false);

  const feedOpinions = uiDemo === "empty" ? [] : storeOpinions;
  /**
   * 베이스 셸은 항상 다크 `#050505`.
   * 방어 `#F4F4F0`는 카드/탭 포인트만 (전체 라이트 금지).
   */
  const lightShell = false;

  /** 세션 → 참전 진영·프로필 표시 동기화 */
  useEffect(() => {
    if (!session) {
      setJoined(null);
      return;
    }
    setJoined(session.joinedCamp ? sideFromCamp(session.joinedCamp) : null);
  }, [session?.userId, session?.joinedCamp]);

  useEffect(() => {
    if (!currentUser) return;
    setEditableProfile({
      name: currentUser.displayName,
      handle: currentUser.handle,
      bio: currentUser.bio,
      avatarChar: currentUser.displayName.slice(0, 1),
    });
  }, [currentUser]);

  useEffect(() => {
    if (navTab !== "messages") setNewMessageOpen(false);
  }, [navTab]);

  /** 미로그인 → 가입/로그인 루트 */
  useEffect(() => {
    if (!entered) return;
    if (!session) setAuthOpen(true);
    else setAuthOpen(false);
  }, [entered, session]);

  /** 목업 `?shutdown=1` → LOCKED 강제 */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("shutdown");
    if (q === "1" || q === "locked") {
      domaStore.forceClockState("LOCKED");
    } else if (q === "cooldown") {
      domaStore.forceClockState("COOLDOWN");
    }
    return () => {
      /* 쿼리 없을 때 강제 유지하지 않음 — 새로고침·다른 진입에서 해제 */
    };
  }, []);

  /** 판결 훅 — LOCKED 진입 시 시그니처 스팅 1회 (입장과 동일) */
  useEffect(() => {
    if (!entered) return;
    const { state, dayId } = storeSnap.clock;
    if (state !== "LOCKED") return;
    const key = `j:${dayId}`;
    if (judgmentPlayed.current === key) return;
    judgmentPlayed.current = key;
    playDomaSting();
  }, [entered, storeSnap.clock.state, storeSnap.clock.dayId]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const openCompose = useCallback(() => {
    if (!domaStore.getSession()) {
      showToast("로그인이 필요합니다");
      return;
    }
    setChoiceOpen(true);
  }, [showToast]);

  const handleRefresh = useCallback(() => {
    if (refreshLock.current) return;
    refreshLock.current = true;
    setRefreshing(true);

    window.setTimeout(() => {
      const { nexus, aegis } = bumpPercents(nexusPercent);
      setNexusPercent(nexus);
      setAegisPercent(aegis);
      domaStore.bumpArenaShares();
      setRefreshing(false);
      refreshLock.current = false;
      showToast("최신 상태로 업데이트했습니다");
    }, 900);
  }, [nexusPercent, showToast]);

  /** intro + 진영 피드 — 네비 바로 위 sticky 흑/백 지지 */
  const campSupportOpen =
    navTab === "home" && homeSurface === "today";

  const handleJoin = (side: Side) => {
    if (!domaStore.getSession()) {
      showToast("로그인이 필요합니다");
      return;
    }
    if (joined === side) return;

    try {
      domaStore.setJoinedCamp(campFromSide(side));
    } catch (e) {
      if (e instanceof Error && e.message === "ARENA_SHUTDOWN") {
        showToast("전장 셧다운 (23:00–08:00)");
        return;
      }
      if (e instanceof Error && e.message === "QUOTA_CAMP_MOVES") {
        showToast("진영 이동 한도를 모두 썼습니다 (3회)");
        return;
      }
      showToast("로그인이 필요합니다");
      return;
    }
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
      side === "NEXUS" ? "도전자 진영 지지" : "방어자 진영 지지",
    );
  };

  const handleSubmitToday = (text: string, media?: ComposeMedia) => {
    if (!domaStore.getSession()) {
      showToast("로그인이 필요합니다");
      return;
    }
    const side: Side =
      joined ?? (arenaView === "AEGIS" ? "AEGIS" : "NEXUS");
    const body = `${text}${formatComposeMediaSuffix(media)}`;
    try {
      domaStore.createOpinion({
        body,
        camp: campFromSide(side),
      });
    } catch (e) {
      if (e instanceof Error && e.message === "ARENA_SHUTDOWN") {
        showToast("전장 셧다운 (23:00–08:00)");
        return;
      }
      if (e instanceof Error && e.message === "COMPOSE_COOLDOWN") {
        const left =
          (e as Error & { remainingMs?: number }).remainingMs ??
          domaStore.composeCooldownRemainingMs();
        showToast(formatCooldownToast(left));
        return;
      }
      if (e instanceof Error && e.message === "CAMP_DAY_LOCKED") {
        showToast("오늘은 한 진영에서만 글을 쓸 수 있습니다");
        return;
      }
      showToast("로그인이 필요합니다");
      return;
    }
    setNavTab("home");
    setArenaView("intro");
    showToast(
      media?.imageNames?.length || media?.link
        ? "진술·첨부가 피드에 추가되었습니다"
        : "진술이 피드에 추가되었습니다",
    );
  };

  const handleSubmitTomorrow = (title: string, media?: ComposeMedia) => {
    try {
      const dayId =
        domaStore.getSnapshot().clock.dayId ?? new Date().toISOString().slice(0, 10);
      domaStore.createTopicCandidate({
        title,
        body: formatComposeMediaSuffix(media).replace(/^ · /, ""),
        targetDayId: nextDayId(dayId),
      });
    } catch (e) {
      if (e instanceof Error && e.message === "ARENA_SHUTDOWN") {
        showToast("전장 셧다운 (23:00–08:00)");
        return;
      }
      if (e instanceof Error && e.message === "COMPOSE_COOLDOWN") {
        const left =
          (e as Error & { remainingMs?: number }).remainingMs ??
          domaStore.composeCooldownRemainingMs();
        showToast(formatCooldownToast(left));
        return;
      }
      if (e instanceof Error && e.message === "SESSION_REQUIRED") {
        showToast("로그인이 필요합니다");
        return;
      }
    }
    const item: TomorrowCandidate = {
      id: `tm-you-${Date.now()}`,
      title,
      votes: 1,
      stewards: 1,
      note:
        media?.imageNames?.length || media?.link
          ? "필드에 새로 제안된 후보입니다. (첨부 있음 · 수정 불가)"
          : "필드에 새로 제안된 후보입니다. (수정 불가)",
    };
    setTomorrowCandidates((prev) => [item, ...prev]);
    setNavTab("home");
    setHomeSurface("tomorrow");
    showToast("내일 필드에 주제가 올라갔습니다 · 수정할 수 없습니다");
  };

  const handleSupportTomorrow = (id: string) => {
    if (supportedTomorrowId === id) return;
    try {
      if (
        domaStore.getSnapshot().clock.state === "LOCKED" ||
        domaStore.getSnapshot().clock.state === "COOLDOWN"
      ) {
        showToast("전장 셧다운 (23:00–08:00)");
        return;
      }
      domaStore.supportTopic(id);
    } catch (e) {
      if (e instanceof Error && e.message === "ARENA_SHUTDOWN") {
        showToast("전장 셧다운 (23:00–08:00)");
        return;
      }
    }
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
    showToast(`「${short}」를 지지합니다`);
  };

  const handleNavChange = (tab: NavTab) => {
    if (tab === "compose") {
      if (!domaStore.getSession()) {
        showToast("로그인이 필요합니다");
        return;
      }
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
    if (tab === "profile") setProfileTab("posts");
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
      className={`shell-tone relative flex h-dvh max-h-dvh flex-col overflow-hidden ${
        lightShell ? "bg-paper text-ink" : "bg-ink text-paper"
      }`}
      data-shell={lightShell ? "light" : "dark"}
    >
      {/* 본문만 스크롤 — SupportBar는 진영 피드에서만(intro 제외) */}
      <div
        className={`shell-tone arena-enter mx-auto min-h-0 w-full max-w-[560px] flex-1 overflow-y-auto overscroll-y-contain border-x ${
          lightShell
            ? "border-ink/12 bg-paper"
            : "border-paper/15 bg-ink"
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
          onNewMessage={
            navTab === "messages" ? () => setNewMessageOpen(true) : undefined
          }
          tab={
            navTab === "compose"
              ? "home"
              : (navTab as "home" | "messages" | "alerts" | "profile")
          }
          profileLabel={
            navTab === "profile"
              ? editableProfile.handle || editableProfile.name
              : undefined
          }
          surface={homeSurface}
          onSurfaceChange={
            navTab === "home"
              ? (s) => {
                  setHomeSurface(s);
                  if (s === "today") setArenaView("intro");
                }
              : undefined
          }
          alertCategory={alertCategory}
          onAlertCategoryChange={
            navTab === "alerts" ? setAlertCategory : undefined
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
              shellLight={lightShell}
              campSupportDock={campSupportOpen}
              onChangeView={(v) => {
                setArenaView(v);
                if (v === "intro") setFocusOpinionId(null);
              }}
              focusOpinionId={focusOpinionId}
              uiDemo={uiDemo}
              onRetry={onRetry}
              onCompose={openCompose}
              onOpenRules={() => setRulesOpen(true)}
              onToast={showToast}
              onOpenShareCard={setContextualShare}
              onOpenVerdictShare={() => setShareOpen(true)}
              onOpenAuthor={(handle) => {
                openGuestProfile(profileForHandle(handle), "home");
              }}
              onDiscoverSelect={(item: DiscoverItem) => {
                if (item.kind === "proposal") {
                  setHomeSurface("tomorrow");
                  showToast("지지 많은 제안 · 내일의 주제");
                  return;
                }
                if (item.kind === "verdict") {
                  setCalendarOpen(true);
                  showToast("어제 판결 · 전투 기록");
                  return;
                }
                setHomeSurface("today");
                setArenaView("intro");
                showToast("지금 뜨거운 전장");
              }}
            />
            <AdSlot id="today_below" light={lightShell} />
          </PullRefresh>
        ) : null}

        {!guestProfile && navTab === "home" && homeSurface === "tomorrow" ? (
          <>
            <TomorrowField
              candidates={tomorrowCandidates}
              supportedId={supportedTomorrowId}
              onSupport={handleSupportTomorrow}
              onPropose={() => setTomorrowComposeOpen(true)}
              uiDemo={uiDemo}
              onRetry={onRetry}
              onToast={showToast}
              onNeedLogin={() => showToast("로그인이 필요합니다")}
            />
            <AdSlot id="tomorrow_below" light={lightShell} />
          </>
        ) : null}

        {!guestProfile && navTab === "messages" ? (
          <MessagesScreen
            onOpenProfile={(p) => openGuestProfile(p, "messages")}
            uiDemo={uiDemo}
            onRetry={onRetry}
            composeOpen={newMessageOpen}
            onComposeClose={() => setNewMessageOpen(false)}
            onToast={showToast}
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
            category={alertCategory}
          />
        ) : null}

        {!guestProfile && navTab === "profile" ? (
          <ProfileScreen
            isSelf
            profile={editableProfile}
            initialTab={profileTab}
            onTabChange={setProfileTab}
            onOpenProfileEdit={() => setProfileEditOpen(true)}
            onOpenShareCard={() => setShareOpen(true)}
            uiDemo={uiDemo}
            onRetry={onRetry}
            onCompose={openCompose}
            onOpenArenaOpinion={(opinionId, side) => {
              setGuestProfile(null);
              setHomeSurface("today");
              setArenaView(side);
              setFocusOpinionId(opinionId);
              setNavTab("home");
              showToast("해당 글로 이동했습니다");
            }}
          />
        ) : null}
      </div>

      {toast ? (
        <div
          className="pointer-events-none absolute inset-x-0 z-[55] flex justify-center px-4"
          style={{
            bottom: campSupportOpen
              ? "calc(44px + 3.5rem + env(safe-area-inset-bottom) + 8px)"
              : "calc(3.5rem + env(safe-area-inset-bottom) + 8px)",
          }}
          role="status"
        >
          <div
            className={`r-md max-w-[560px] border px-3 py-2 text-center text-[12px] font-medium tracking-wide ${
              lightShell
                ? "border-ink/20 bg-paper text-ink"
                : "border-paper/30 bg-ink text-paper"
            }`}
          >
            {toast}
          </div>
        </div>
      ) : null}

      {campSupportOpen ? (
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
        onToast={showToast}
        onOpenProfile={(handle) => {
          openGuestProfile(profileForHandle(handle), "home");
        }}
      />
      <SearchSheet
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        uiDemo={uiDemo}
        onRetry={onRetry}
        onSelect={(item) => {
          setSearchOpen(false);
          const nav = item.nav;
          if (!nav) {
            showToast("이동할 수 없는 항목입니다");
            return;
          }
          if (nav.surface === "calendar") {
            setCalendarOpen(true);
            showToast("전투 기록으로 이동했습니다");
            return;
          }
          if (nav.surface === "tomorrow") {
            setGuestProfile(null);
            setHomeSurface("tomorrow");
            setNavTab("home");
            showToast("내일의 주제로 이동했습니다");
            return;
          }
          setGuestProfile(null);
          setHomeSurface("today");
          setArenaView(nav.side ?? "intro");
          setFocusOpinionId(nav.opinionId ?? null);
          setNavTab("home");
          showToast(
            nav.opinionId
              ? "해당 글로 이동했습니다"
              : "오늘 전장으로 이동했습니다",
          );
        }}
      />
      <SettingsSheet
        open={settingsOpen}
        onProfileSync={setEditableProfile}
        onLeftAccount={(socialId) => {
          setLeftSocialId(socialId);
          setAuthOpen(true);
        }}
        onOpenScraps={() => {
          setGuestProfile(null);
          setProfileTab("scraps");
          setNavTab("profile");
          showToast("스크랩 탭");
        }}
        onOpenRules={() => setRulesOpen(true)}
        onClose={() => setSettingsOpen(false)}
        onToast={showToast}
      />
      <ProfileEditSheet
        open={profileEditOpen}
        profile={editableProfile}
        onSave={setEditableProfile}
        onClose={() => setProfileEditOpen(false)}
        onToast={showToast}
      />
      <AuthSheet
        open={authOpen && !session}
        preferSocialId={leftSocialId}
        onComplete={(p) => {
          setEditableProfile(p);
          setLeftSocialId(null);
          setAuthOpen(false);
        }}
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
      <ContextualShareCard
        open={Boolean(contextualShare)}
        payload={contextualShare}
        onClose={() => setContextualShare(null)}
        onToast={showToast}
      />
      <RulesSheet open={rulesOpen} onClose={() => setRulesOpen(false)} />
      <BottomNav
        active={navTab}
        onChange={handleNavChange}
        light={lightShell}
      />
    </div>
  );
}
