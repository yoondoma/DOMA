/**
 * 광고 슬롯 미리보기 — SDK/네트워크 없음.
 * 기본 OFF · 설정 토글 또는 `?ads=1` / NEXT_PUBLIC_AD_PREVIEW=1
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
  return { enabled: false };
}

function envPreviewOn(): boolean {
  if (typeof process !== "undefined") {
    const v = process.env.NEXT_PUBLIC_AD_PREVIEW;
    if (v === "1" || v === "true") return true;
  }
  return false;
}

function queryPreviewOn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search).get("ads");
    return q === "1" || q === "true" || q === "preview";
  } catch {
    return false;
  }
}

export function loadAdPreviewPrefs(): AdPreviewPrefs {
  if (typeof window === "undefined") {
    return { enabled: envPreviewOn() };
  }
  if (envPreviewOn() || queryPreviewOn()) {
    return { enabled: true };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAdPreviewPrefs();
    const parsed = JSON.parse(raw) as Partial<AdPreviewPrefs>;
    return { enabled: parsed.enabled === true };
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
