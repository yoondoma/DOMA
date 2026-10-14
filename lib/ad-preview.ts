/**
 * 광고 슬롯 미리보기 — SDK/네트워크 없음.
 * 확정: today_below · tomorrow_below 만 (product-ops).
 * 기본 ON · `?ads=0` / 설정으로 끌 수 있음.
 */

export type AdSlotId = "today_below" | "tomorrow_below";

export const AD_SLOT_IDS: readonly AdSlotId[] = [
  "today_below",
  "tomorrow_below",
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
