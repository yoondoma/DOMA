/**
 * 공공 프로토타입 — 실명·개인 식별 완전 배제.
 * 데모 본인 = 표시명 `게스트` · 핸들 `doma.guest` only.
 */

export const DEMO_HANDLE = "doma.guest";
export const DEMO_DISPLAY_NAME = "게스트";

/** 핸들·표시명·본문에 남으면 안 되는 개인 식별 토큰 */
const BANNED_EXACT = new Set(
  [
    "soohan",
    "수한",
    "수판",
    "usr_soohan",
    "user-soohan",
    "윤침묵",
    "김도마",
    "이창",
    "박방패",
    "최증거",
    "정논객",
    "한결",
    "서판결",
    "오독자",
    "유증인",
    "silent_y",
    "doma_kim",
    "spear_lee",
    "aegis_park",
    "reader_oh",
    "witness_yoo",
  ].map((s) => s.toLowerCase()),
);

/** 본문·문자열 스캔용 (윤리 등 부분일치 제외) */
const BANNED_IN_TEXT =
  /(?:^|[^가-힣a-z0-9_.])(@?soohan|수한|수판|윤침묵|김도마|오독자|유증인)(?=[^가-힣a-z0-9_.]|$)/i;

export function isBannedIdentityToken(raw: string | null | undefined): boolean {
  if (!raw) return false;
  const t = raw.replace(/^@/, "").trim().toLowerCase();
  if (!t) return false;
  if (BANNED_EXACT.has(t)) return true;
  return BANNED_IN_TEXT.test(raw);
}

export function textHasBannedIdentity(raw: string | null | undefined): boolean {
  if (!raw) return false;
  return BANNED_IN_TEXT.test(raw);
}

export type IdentityUserLike = {
  handle?: string | null;
  displayName?: string | null;
  username?: string | null;
  name?: string | null;
  id?: string | null;
};

/** 스냅샷/유저에 금지 식별이 있으면 true → 시드 재빌드 */
export function snapshotNeedsIdentityReseed(snap: {
  users?: IdentityUserLike[];
  session?: { userId?: string | null } | null;
  opinions?: { body?: string; authorHandle?: string }[];
  arenaMeta?: { description?: string; topicTitle?: string };
}): boolean {
  for (const u of snap.users ?? []) {
    if (
      isBannedIdentityToken(u.handle) ||
      isBannedIdentityToken(u.displayName) ||
      isBannedIdentityToken(u.username) ||
      isBannedIdentityToken(u.name) ||
      isBannedIdentityToken(u.id)
    ) {
      return true;
    }
  }
  for (const o of snap.opinions ?? []) {
    if (
      textHasBannedIdentity(o.body) ||
      isBannedIdentityToken(o.authorHandle)
    ) {
      return true;
    }
  }
  if (
    textHasBannedIdentity(snap.arenaMeta?.description) ||
    textHasBannedIdentity(snap.arenaMeta?.topicTitle)
  ) {
    return true;
  }
  return false;
}

/** 레거시 스토리지 키 — 로드 후 삭제 */
export const LEGACY_STORE_KEYS = [
  "doma.store.v1",
  "doma.store.v2",
  "doma.store.v3",
  "doma.store.v4",
  "doma.store.v5",
] as const;
