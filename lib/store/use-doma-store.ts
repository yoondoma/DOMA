"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { toUiOpinions } from "@/lib/store/adapters";
import { domaStore } from "@/lib/store/memory-store";
import type { StoreSnapshot } from "@/lib/store/types";
import type { Session, User } from "@/lib/types/domain";
import type { Opinion as UiOpinion } from "@/lib/types";

function subscribe(onChange: () => void) {
  return domaStore.subscribe(onChange);
}

function getSnapshot(): StoreSnapshot {
  return domaStore.getSnapshot();
}

function getServerSnapshot(): StoreSnapshot {
  return domaStore.getSnapshot();
}

/** 스토어 스냅샷 구독 */
export function useDomaStore(): StoreSnapshot {
  useEffect(() => {
    domaStore.init();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** 현재 세션 · 유저 (권위) */
export function useSession(): {
  session: Session | null;
  user: User | null;
} {
  const snap = useDomaStore();
  return useMemo(() => {
    const session = snap.session;
    const user = session
      ? snap.users.find((u) => u.id === session.userId) ?? null
      : null;
    return { session, user };
  }, [snap]);
}

/** 홈/피드용 UI Opinion[] — 차단 유저 글 제외 */
export function useUiOpinions(dayId?: string): UiOpinion[] {
  const snap = useDomaStore();
  return useMemo(() => {
    const sid = snap.session?.userId;
    const blocked = new Set(
      (snap.blocks ?? [])
        .filter((b) => b.blockerId === sid)
        .map((b) => b.blockedId),
    );
    const ops = (dayId
      ? snap.opinions.filter((o) => o.dayId === dayId)
      : snap.opinions.filter((o) => o.dayId === snap.clock.dayId)
    ).filter((o) => !blocked.has(o.authorId));
    return toUiOpinions(
      ops,
      snap.users,
      snap.likes,
      sid ?? null,
      snap.supports ?? [],
      snap.campSwitches ?? [],
    );
  }, [snap, dayId]);
}
