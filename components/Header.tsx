"use client";

import type { ReactNode } from "react";
import { DomaWordmark } from "@/components/DomaWordmark";

export type HomeSurface = "today" | "tomorrow";

/** 하단 탭에 대응하는 헤더 슬롯 모드 (+ 제외) */
export type HeaderTab = "home" | "messages" | "alerts" | "profile";

/** 알림함 탭 — 판결 / 내 글 / 메시지 · 멘션(내글·내답글 답 포함) */
export type AlertCategory =
  | "all"
  | "judgment"
  | "mine"
  | "message"
  | "mention"
  | "follow";

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
  { id: "judgment", label: "판결" },
  { id: "mine", label: "내 글" },
  { id: "message", label: "메시지" },
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

/** 정사각 24×24 · 대칭 톱니 스트로크 (찌그러짐 금지) */
function SettingsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="box-content size-[22px] shrink-0"
      style={{ aspectRatio: "1 / 1" }}
    >
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
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
