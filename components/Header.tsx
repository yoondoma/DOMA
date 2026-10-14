"use client";

import type { ReactNode } from "react";
import { DomaWordmark } from "@/components/DomaWordmark";

export type HomeSurface = "today" | "tomorrow";

/** 하단 탭에 대응하는 헤더 슬롯 모드 (+ 제외) */
export type HeaderTab = "home" | "messages" | "alerts" | "profile";

type HeaderProps = {
  /** @deprecated 헤더 타이머 제거 — 호환용 유지 */
  endsAt?: string;
  /** 방어자 탭일 때 흰 톤 (홈만) */
  tone?: "dark" | "light";
  refreshing?: boolean;
  onRefresh?: () => void;
  onOpenHistory?: () => void;
  onOpenSearch?: () => void;
  onOpenSettings?: () => void;
  /** @deprecated tab으로 대체 */
  trailing?: "search" | "settings";
  surface?: HomeSurface;
  onSurfaceChange?: (surface: HomeSurface) => void;
  /** 하단 탭 — 슬롯 내용만 교체 */
  tab?: HeaderTab;
  /** 프로필 탭 중앙 라벨 (핸들 우선) */
  profileLabel?: string;
};

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

/** 좌·우 슬롯 폭 고정 (비어 있어도 size-10) */
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
 * 홈: 달력 · DOMA KR · 검색 (+ 오늘|내일)
 * 메시지/알림: — · 타이틀 · —
 * 프로필: — · 핸들 · 설정
 */
export function Header({
  tone = "dark",
  refreshing,
  onRefresh,
  onOpenHistory,
  onOpenSearch,
  onOpenSettings,
  surface = "today",
  onSurfaceChange,
  tab = "home",
  profileLabel,
}: HeaderProps) {
  const home = tab === "home";
  const light = home && tone === "light";
  const ink = light ? "text-black" : "text-white";
  const muted = light ? "text-neutral-500" : "text-muted";

  const centerKey =
    tab === "home"
      ? "logo"
      : tab === "profile"
        ? `profile:${profileLabel ?? ""}`
        : tab;

  const centerTitle =
    tab === "messages"
      ? "메시지"
      : tab === "alerts"
        ? "알림"
        : tab === "profile"
          ? profileLabel
            ? profileLabel.startsWith("@")
              ? profileLabel
              : `@${profileLabel}`
            : "프로필"
          : null;

  const showSurface = home && Boolean(onSurfaceChange);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        light
          ? "border-black/10 bg-white/95"
          : "border-white/12 bg-black/92"
      }`}
    >
      <div className="relative mx-auto flex h-14 max-w-[560px] items-center px-3">
        {/* LEFT */}
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

        {/* CENTER */}
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <div key={centerKey} className="header-slot-fade">
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
                {centerTitle}
              </h1>
            )}
          </div>
          {home && refreshing ? (
            <span className={`mt-0.5 text-[10px] tracking-[0.14em] ${muted}`}>
              업데이트 중
            </span>
          ) : null}
        </div>

        {/* RIGHT */}
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
      </div>

      {/* 오늘|내일 — 홈 전용 */}
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
                : "text-muted"
            }`}
          >
            내일
          </button>
        </div>
      ) : null}
    </header>
  );
}
