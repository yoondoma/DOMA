"use client";

export type NavTab = "home" | "messages" | "compose" | "alerts" | "profile";

type BottomNavProps = {
  active: NavTab;
  onChange: (tab: NavTab) => void;
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

function NavIcon({ id, active }: { id: NavTab; active: boolean }) {
  const stroke = active ? "#fff" : "#737373";

  switch (id) {
    case "home": {
      /**
       * 아레나 = 바른 정육각형 세로 이등분
       * 왼: 채움(흑) / 오른: 비움(백·외곽) — 빗금·왜곡 없음
       */
      // 중심(12,12) 반지름 8.2 — 메시지·알림·프로필(22)과 시각 크기 맞춤
      const hex =
        "M12 3.8 19.1 7.9v8.2L12 20.2 4.9 16.1V7.9Z";
      const leftHalf = "M12 3.8 4.9 7.9v8.2L12 20.2Z";
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d={leftHalf} fill={stroke} />
          <path
            d={hex}
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="miter"
          />
        </svg>
      );
    }
    case "messages":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4.5 6.5h15v9.5H9.2L5.5 19.2V6.5Z"
            fill={active ? "rgba(255,255,255,0.12)" : "none"}
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
        <span className="flex size-9 items-center justify-center rounded-full border border-white bg-white text-black">
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
            fill={active ? "rgba(255,255,255,0.15)" : "none"}
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
            fill={active ? "rgba(255,255,255,0.2)" : "none"}
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

/** 심볼만 — 화면 라벨 없음 · aria-label로 접근성 유지 */
export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-black/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="하단 내비게이션"
    >
      <div className="mx-auto grid h-14 max-w-[560px] grid-cols-5">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="flex min-h-14 items-center justify-center"
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
            >
              <NavIcon id={tab.id} active={isActive || Boolean(tab.compose)} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
