/**
 * 광고 슬롯 미리보기 — SDK/네트워크 없음.
 * 기본 ON · 빈 Sponsored「광고 자리」플레이스홀더.
 * 설정 토글·`?ads=0` / NEXT_PUBLIC_AD_PREVIEW=0 으로 끌 수 있음.
 */

export type AdSlotId =
  | "gate_splash"
  | "arena_rail"
  | "feed_native"
  | "verdict_card_footer"
  | "discover_row"
  | "calendar_banner"
  | "shutdown_idle";

export const AD_SLOT_IDS: readonly AdSlotId[] = [
  "gate_splash",
  "arena_rail",
  "feed_native",
  "verdict_card_footer",
  "discover_row",
  "calendar_banner",
  "shutdown_idle",
] as const;

const STORAGE_KEY = "doma.adPreview.v1";
export const AD_PREVIEW_EVENT = "doma:ad-preview";

export type AdPreviewPrefs = {
  /** true면 Sponsored 플레이스홀더 표시 */
  enabled: boolean;
};

export function defaultAdPreviewPrefs(): AdPreviewPrefs {
  return { enabled: true };
}

function envPreviewForce(): boolean | null {
  if (typeof process !== "undefined") {
    const v = process.env.NEXT_PUBLIC_AD_PREVIEW;
    if (v === "1" || v === "true") return true;
    if (v === "0" || v === "false") return false;
  }
  return null;
}

function queryPreviewForce(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const q = new URLSearchParams(window.location.search).get("ads");
    if (q === "1" || q === "true" || q === "preview") return true;
    if (q === "0" || q === "false" || q === "off") return false;
  } catch {
    /* ignore */
  }
  return null;
}

export function loadAdPreviewPrefs(): AdPreviewPrefs {
  const env = envPreviewForce();
  if (env !== null) return { enabled: env };

  if (typeof window === "undefined") {
    return defaultAdPreviewPrefs();
  }

  const query = queryPreviewForce();
  if (query !== null) return { enabled: query };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAdPreviewPrefs();
    const parsed = JSON.parse(raw) as Partial<AdPreviewPrefs>;
    if (typeof parsed.enabled === "boolean") {
      return { enabled: parsed.enabled };
    }
    return defaultAdPreviewPrefs();
  } catch {
    return defaultAdPreviewPrefs();
  }
}

export function saveAdPreviewPrefs(
  patch: Partial<AdPreviewPrefs>,
): AdPreviewPrefs {
  const next: AdPreviewPrefs = {
    ...loadAdPreviewPrefs(),
    ...patch,
  };
  /** 쿼리/env로 켠 경우에도 스토리지에 저장해 설정 UI와 동기 */
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(
        new CustomEvent(AD_PREVIEW_EVENT, { detail: next }),
      );
    } catch {
      /* ignore */
    }
  }
  return next;
}

export function isAdPreviewEnabled(): boolean {
  return loadAdPreviewPrefs().enabled;
}
