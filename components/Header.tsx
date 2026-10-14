"use client";

import { DomaWordmark } from "@/components/DomaWordmark";

export type HomeSurface = "today" | "tomorrow";

type HeaderProps = {
  /** @deprecated 헤더 타이머 제거 — 전장 카운트다운만 사용. 호환용 유지 */
  endsAt?: string;
  /** 방어자 탭일 때 흰 톤 */
  tone?: "dark" | "light";
  refreshing?: boolean;
  onRefresh?: () => void;
  onOpenHistory?: () => void;
  onOpenSearch?: () => void;
  /** 본인 프로필 탭 — 검색 대신 설정 */
  onOpenSettings?: () => void;
  /** 우측 액션: 기본 검색 · 프로필=설정 */
  trailing?: "search" | "settings";
  /** 오늘 아레나 | 내일 필드 — 1급 전환 */
  surface?: HomeSurface;
  onSurfaceChange?: (surface: HomeSurface) => void;
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

/**
 * 왼쪽 달력 · 중앙 DOMA 워드마크 · 오른쪽 검색
 * 마크 심볼·헤더 타이머 없음 (판결 카운트다운은 전장 본문만)
 */
export function Header({
  tone = "dark",
  refreshing,
  onRefresh,
  onOpenHistory,
  onOpenSearch,
  onOpenSettings,
  trailing = "search",
  surface = "today",
  onSurfaceChange,
}: HeaderProps) {
  const light = tone === "light";

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        light
          ? "border-black/10 bg-white/95"
          : "border-white/12 bg-black/92"
      }`}
    >
      <div className="relative mx-auto flex max-w-[560px] items-center px-3 py-2.5">
        <button
          type="button"
          onClick={onOpenHistory}
          className={`flex size-10 shrink-0 items-center justify-center ${
            light ? "text-black" : "text-white"
          }`}
          aria-label="전투 기록"
        >
          <CalendarIcon />
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
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
          {refreshing ? (
            <span
              className={`mt-1 text-[10px] tracking-[0.14em] ${
                light ? "text-neutral-500" : "text-muted"
              }`}
            >
              업데이트 중
            </span>
          ) : null}
        </div>

        {trailing === "settings" ? (
          <button
            type="button"
            onClick={onOpenSettings}
            className={`flex size-10 shrink-0 items-center justify-center ${
              light ? "text-black" : "text-white"
            }`}
            aria-label="설정"
          >
            <SettingsIcon />
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenSearch}
            className={`flex size-10 shrink-0 items-center justify-center ${
              light ? "text-black" : "text-white"
            }`}
            aria-label="검색"
          >
            <SearchIcon />
          </button>
        )}
      </div>

      {onSurfaceChange ? (
        <div
          className={`mx-auto grid max-w-[560px] grid-cols-2 border-t ${
            light ? "border-black/10" : "border-white/10"
          }`}
          role="tablist"
          aria-label="오늘과 내일"
        >
          <button
            type="button"
            role="tab"
            aria-selected={surface === "today"}
            onClick={() => onSurfaceChange("today")}
            className={`py-2 text-[12px] font-bold tracking-[0.14em] ${
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
            onClick={() => onSurfaceChange("tomorrow")}
            className={`py-2 text-[12px] font-bold tracking-[0.14em] ${
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
