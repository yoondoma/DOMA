"use client";

export type NavTab = "home" | "messages" | "compose" | "alerts" | "profile";

type BottomNavProps = {
  active: NavTab;
  onChange: (tab: NavTab) => void;
  /** 방어(화이트) 셸 — 내비도 화이트 · 아이콘 검정 대비 */
  light?: boolean;
};

const TABS: {
  id: NavTab;
  label: string;
  compose?: boolean;
}[] = [
  { id: "home", label: "아레나" },
  { id: "messages", label: "메시지" },
  { id: "compose", label: "작성", compose: true },
  { id: "alerts", label: "알림" },
  { id: "profile", label: "프로필" },
];

function NavIcon({
  id,
  active,
  light,
}: {
  id: NavTab;
  active: boolean;
  light: boolean;
}) {
  const stroke = light
    ? active
      ? "#0a0a0a"
      : "#737373"
    : active
      ? "#fff"
      : "#737373";

  switch (id) {
    case "home": {
      /**
       * 아레나 = 바른 정육각형 · 세로 반분
       * 왼(흑 진영): 솔리드 실루엣
       * 오른(흰 진영): 외곽만
       */
      const hex =
        "M12 3.8L19.1 7.9L19.1 16.1L12 20.2L4.9 16.1L4.9 7.9Z";
      const leftHalf = "M12 3.8L4.9 7.9L4.9 16.1L12 20.2Z";
      const solid = light
        ? active
          ? "#0a0a0a"
          : "#a3a3a3"
        : active
          ? "#ffffff"
          : "#a3a3a3";
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <path d={leftHalf} fill={solid} stroke="none" />
          <path
            d={hex}
            fill="none"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="miter"
          />
          <path
            d="M12 3.8V20.2"
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      );
    }
    case "messages":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4.5 6.5h15v9.5H9.2L5.5 19.2V6.5Z"
            fill={
              active
                ? light
                  ? "rgba(0,0,0,0.08)"
                  : "rgba(255,255,255,0.12)"
                : "none"
            }
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M8 10.2h8M8 13.2h5.5"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "compose":
      return (
        <span
          className={`flex size-9 items-center justify-center rounded-full border ${
            light
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-white bg-white text-black"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
            />
          </svg>
        </span>
      );
    case "alerts":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 17h12l-1.2-2.1V10a4.8 4.8 0 1 0-9.6 0v4.9L6 17Z"
            fill={
              active
                ? light
                  ? "rgba(0,0,0,0.1)"
                  : "rgba(255,255,255,0.15)"
                : "none"
            }
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M10 19a2 2 0 0 0 4 0"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "profile":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle
            cx="12"
            cy="8"
            r="3.25"
            fill={
              active
                ? light
                  ? "rgba(0,0,0,0.12)"
                  : "rgba(255,255,255,0.2)"
                : "none"
            }
            stroke={stroke}
            strokeWidth="1.75"
          />
          <path
            d="M5.5 19.5c1.6-3 4-4.5 6.5-4.5s4.9 1.5 6.5 4.5"
            fill="none"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

/** 심볼만 — 화면 라벨 없음 · aria-label로 접근성 유지.
 *  fixed 금지 — 셸 하단 독에 두어 Try Live/모바일에서 항상 보이게. */
export function BottomNav({ active, onChange, light = false }: BottomNavProps) {
  return (
    <nav
      className={`relative z-50 w-full shrink-0 border-t backdrop-blur-md ${
        light
          ? "border-black/15 bg-white/95"
          : "border-white/15 bg-black/95"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="하단 내비게이션"
      data-nav-tone={light ? "light" : "dark"}
    >
      <div className="mx-auto grid h-14 max-w-[560px] grid-cols-5">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="flex min-h-14 items-center justify-center opacity-90 transition-opacity duration-150 ease-out active:opacity-60"
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
            >
              <NavIcon
                id={tab.id}
                active={isActive || Boolean(tab.compose)}
                light={light}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
