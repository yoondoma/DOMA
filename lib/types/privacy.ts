/** 소셜 프라이버시 — 스펙: social-rules */

export type DmPolicy = "everyone" | "mutual" | "off";

export type PrivacyPrefs = {
  /**
   * @deprecated 수한 확정: 스크랩은 본인만. 토글 제거 · 항상 false.
   * 필드만 호환 유지.
   */
  scrapsPublic: boolean;
  /** DM 수신 — 기본 everyone (비팔로워는 요청) */
  dmPolicy: DmPolicy;
};

export function defaultPrivacy(): PrivacyPrefs {
  return {
    scrapsPublic: false,
    dmPolicy: "everyone",
  };
}

export const DM_POLICY_LABEL: Record<DmPolicy, string> = {
  everyone: "모두 (비팔로워는 요청)",
  mutual: "맞팔만",
  off: "끄기",
};
