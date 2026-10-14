/** 소셜 프라이버시 — 스펙: social-rules */

export type DmPolicy = "everyone" | "mutual" | "off";

export type PrivacyPrefs = {
  /** 프로필 스크랩 공개 — 기본 true */
  scrapsPublic: boolean;
  /** DM 수신 — 기본 everyone (비팔로워는 요청) */
  dmPolicy: DmPolicy;
};

export function defaultPrivacy(): PrivacyPrefs {
  return {
    scrapsPublic: true,
    dmPolicy: "everyone",
  };
}

export const DM_POLICY_LABEL: Record<DmPolicy, string> = {
  everyone: "모두 (비팔로워는 요청)",
  mutual: "맞팔만",
  off: "끄기",
};
