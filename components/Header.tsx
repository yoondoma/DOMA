"use client";

import type { ReactNode } from "react";
import { DomaWordmark } from "@/components/DomaWordmark";

export type HomeSurface = "today" | "tomorrow";

/** 하단 탭에 대응하는 헤더 슬롯 모드 (+ 제외) */
export type HeaderTab = "home" | "messages" | "alerts" | "profile";

export type AlertCategory = "all" | "follow" | "conversation" | "mention";

type HeaderProps = {
  /** @deprecated 헤더 타이머 제거 — 호환용 유지 */
  endsAt?: string;
  tone?: "dark" | "light";
  refreshing?: boolean;
  onRefresh?: () => void;
  onOpenHistory?: () => void;
  onOpenSearch?: () => void;
  onOpenSettings?: () => void;
  /** 메시지 탭 — 새 메시지 */
  onNewMessage?: () => void;
  trailing?: "search" | "settings";
  surface?: HomeSurface;
  onSurfaceChange?: (surface: HomeSurface) => void;
  tab?: HeaderTab;
  profileLabel?: string;
  /** 알림 카테고리 */
  alertCategory?: AlertCategory;
  onAlertCategoryChange?: (c: AlertCategory) => void;
};

const ALERT_TABS: { id: AlertCategory; label: string }[] = [
  { id: "all", label: "모든 알림" },
  { id: "follow", label: "팔로우" },
  { id: "conversation", label: "대화" },
  { id: "mention", label: "멘션" },
];

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.75"
        y="5.5"
        width="16.5"
        height="14.75"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.75 9.75h16.5M8 3.75v3.5M16 3.75v3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
      <path
        d="M8.2 13.2h2.2M13.6 13.2h2.2M8.2 16.4h2.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M15.8 15.8 20 20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10.2 2.8h3.6l.45 2.05a6.9 6.9 0 0 1 1.7.7l1.9-1.1 2.55 2.55-1.1 1.9c.3.53.54 1.1.7 1.7L21.2 10.2v3.6l-2.05.45a6.9 6.9 0 0 1-.7 1.7l1.1 1.9-2.55 2.55-1.9-1.1a6.9 6.9 0 0 1-1.7.7l-.45 2.05h-3.6l-.45-2.05a6.9 6.9 0 0 1-1.7-.7l-1.9 1.1-2.55-2.55 1.1-1.9a6.9 6.9 0 0 1-.7-1.7L2.8 13.8v-3.6l2.05-.45a6.9 6.9 0 0 1 .7-1.7l-1.1-1.9L6.95 3.6l1.9 1.1a6.9 6.9 0 0 1 1.7-.7L10.2 2.8Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="miter"
      />
      <circle
        cx="12"
        cy="12"
        r="3.15"
        stroke="currentColor"
        strokeWidth="1.55"
      />
    </svg>
  );
}

/** 연필 · 새 메시지 (B&W, DOMA 스트로크) */
function ComposePenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 19.5 5.2 15.8 16.4 4.6a1.8 1.8 0 0 1 2.55 0l.45.45a1.8 1.8 0 0 1 0 2.55L8.2 18.8 4.5 19.5Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="miter"
      />
      <path
        d="M14.8 6.2 17.8 9.2"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="square"
      />
    </svg>
  );
}

function Slot({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex size-10 shrink-0 items-center justify-center ${className}`}
    >
      {children ?? <span className="size-10" aria-hidden />}
    </div>
  );
}

/**
 * 탭별 상단 헤더 슬롯
 * 홈: 달력 · DOMA KR · 검색
 * 메시지: 메시지(좌) · — · 새 메시지
 * 알림: 알림(좌) · — · — (+ 카테고리)
 * 프로필: — · @handle · 설정
 */
export function Header({
  tone = "dark",
  refreshing,
  onRefresh,
  onOpenHistory,
  onOpenSearch,
  onOpenSettings,
  onNewMessage,
  surface = "today",
  onSurfaceChange,
  tab = "home",
  profileLabel,
  alertCategory = "all",
  onAlertCategoryChange,
}: HeaderProps) {
  const home = tab === "home";
  const light = home && tone === "light";
  const ink = light ? "text-black" : "text-white";
  const muted = light ? "text-neutral-500" : "text-muted";
  const showSurface = home && Boolean(onSurfaceChange);
  const showAlertCats = tab === "alerts" && Boolean(onAlertCategoryChange);

  return (
    <header
      className={`shell-tone sticky top-0 z-40 border-b backdrop-blur-md ${
        light
          ? "border-black/10 bg-white/95"
          : "border-white/12 bg-black/92"
      }`}
    >
      <div className="relative mx-auto flex h-14 max-w-[560px] items-center px-3">
        {tab === "messages" ? (
          <>
            <h1
              className={`header-slot-fade min-w-0 flex-1 truncate font-[family-name:var(--font-syne)] text-[17px] font-bold tracking-tight ${ink}`}
            >
              메시지
            </h1>
            <Slot>
              <button
                type="button"
                onClick={onNewMessage}
                className={`flex size-10 items-center justify-center ${ink}`}
                aria-label="새 메시지"
              >
                <ComposePenIcon />
              </button>
            </Slot>
          </>
        ) : tab === "alerts" ? (
          <>
            <h1
              className={`header-slot-fade min-w-0 flex-1 truncate font-[family-name:var(--font-syne)] text-[17px] font-bold tracking-tight ${ink}`}
            >
              알림
            </h1>
            <Slot />
          </>
        ) : (
          <>
            <Slot>
              {home ? (
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className={`flex size-10 items-center justify-center ${ink}`}
                  aria-label="전투 기록"
                >
                  <CalendarIcon />
                </button>
              ) : null}
            </Slot>

            <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
              <div
                key={
                  tab === "profile"
                    ? `profile:${profileLabel ?? ""}`
                    : "logo"
                }
                className="header-slot-fade"
              >
                {home ? (
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    aria-label="새로고침"
                    aria-busy={refreshing || undefined}
                    className={refreshing ? "logo-refresh" : undefined}
                  >
                    <h1 className="leading-none">
                      <DomaWordmark size="md" light={light} />
                    </h1>
                  </button>
                ) : (
                  <h1
                    className={`truncate px-2 font-[family-name:var(--font-syne)] text-[17px] font-bold tracking-tight ${ink}`}
                  >
                    {profileLabel
                      ? profileLabel.startsWith("@")
                        ? profileLabel
                        : `@${profileLabel}`
                      : "프로필"}
                  </h1>
                )}
              </div>
              {home && refreshing ? (
                <span className={`mt-0.5 text-[10px] tracking-[0.14em] ${muted}`}>
                  업데이트 중
                </span>
              ) : null}
            </div>

            <Slot>
              {home ? (
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className={`flex size-10 items-center justify-center ${ink}`}
                  aria-label="검색"
                >
                  <SearchIcon />
                </button>
              ) : tab === "profile" ? (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className={`flex size-10 items-center justify-center ${ink}`}
                  aria-label="설정"
                >
                  <SettingsIcon />
                </button>
              ) : null}
            </Slot>
          </>
        )}
      </div>

      {showSurface ? (
        <div
          className={`mx-auto grid h-10 max-w-[560px] grid-cols-2 border-t ${
            light ? "border-black/10" : "border-white/10"
          }`}
          role="tablist"
          aria-label="오늘과 내일"
        >
          <button
            type="button"
            role="tab"
            aria-selected={surface === "today"}
            onClick={() => onSurfaceChange?.("today")}
            className={`text-[12px] font-bold tracking-[0.14em] ${
              surface === "today"
                ? light
                  ? "border-b-2 border-black text-black"
                  : "border-b-2 border-white text-white"
                : light
                  ? "text-neutral-500"
                  : "text-muted"
            }`}
          >
            오늘
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={surface === "tomorrow"}
            onClick={() => onSurfaceChange?.("tomorrow")}
            className={`text-[12px] font-bold tracking-[0.14em] ${
              surface === "tomorrow"
                ? light
                  ? "border-b-2 border-black text-black"
                  : "border-b-2 border-white text-white"
                : light
                  ? "text-neutral-500"
                  : "text-muted"
            }`}
          >
            내일
          </button>
        </div>
      ) : null}

      {showAlertCats ? (
        <div
          className="mx-auto flex max-w-[560px] gap-0 overflow-x-auto border-t border-white/10"
          role="tablist"
          aria-label="알림 카테고리"
        >
          {ALERT_TABS.map((t) => {
            const active = alertCategory === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onAlertCategoryChange?.(t.id)}
                className={`shrink-0 px-3 py-2.5 text-[12px] font-bold tracking-[0.08em] ${
                  active
                    ? "border-b-2 border-white text-white"
                    : "text-muted"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </header>
  );
}
