"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";

const PULL_THRESHOLD = 72;
const MAX_PULL = 120;

type PullRefreshProps = {
  children: ReactNode;
  refreshing: boolean;
  onRefresh: () => void;
  light?: boolean;
};

function RefreshSpinner({ light }: { light?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      className="refresh-spin"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke={light ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)"}
        strokeWidth="2"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke={light ? "#000" : "#fff"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 아래로 당겨 새로고침 + 상단 인디케이터 */
export function PullRefresh({
  children,
  refreshing,
  onRefresh,
  light,
}: PullRefreshProps) {
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);

  const canPull = useCallback(() => {
    return typeof window !== "undefined" && window.scrollY <= 2;
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    if (refreshing) return;
    if (!canPull()) {
      startY.current = null;
      return;
    }
    startY.current = e.touches[0]?.clientY ?? null;
    pulling.current = true;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!pulling.current || startY.current == null || refreshing) return;
    if (!canPull()) {
      setPull(0);
      return;
    }
    const y = e.touches[0]?.clientY ?? startY.current;
    const delta = Math.max(0, y - startY.current);
    if (delta > 0) {
      // 저항감
      const resisted = Math.min(MAX_PULL, delta * 0.55);
      setPull(resisted);
    }
  };

  const onTouchEnd = () => {
    if (!pulling.current) return;
    pulling.current = false;
    startY.current = null;
    if (pull >= PULL_THRESHOLD && !refreshing) {
      onRefresh();
    }
    setPull(0);
  };

  useEffect(() => {
    if (!refreshing) setPull(0);
  }, [refreshing]);

  const indicatorH = refreshing ? 52 : pull;
  const ready = pull >= PULL_THRESHOLD;

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div
        className="overflow-hidden transition-[height] duration-150 ease-out"
        style={{ height: indicatorH }}
        aria-hidden={!refreshing && pull === 0}
      >
        <div
          className={`flex h-full items-center justify-center gap-2 text-[11px] tracking-[0.14em] ${
            light ? "text-neutral-500" : "text-muted"
          }`}
        >
          {(refreshing || pull > 8) && (
            <>
              <RefreshSpinner light={light} />
              <span>
                {refreshing
                  ? "업데이트 중"
                  : ready
                    ? "놓으면 새로고침"
                    : "아래로 당겨 새로고침"}
              </span>
            </>
          )}
        </div>
      </div>
      <div
        className={refreshing ? "refresh-bounce" : undefined}
        style={
          !refreshing && pull > 0
            ? { transform: `translateY(${Math.min(12, pull * 0.08)}px)` }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
