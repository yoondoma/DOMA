/**
 * 코스메틱 예약 필드 — 티어·승패와 무관.
 * 기본값(미설정) = 현재 DOMA B&W. 상점 UI/결제 없음.
 * 스펙: product-ops.md
 */

export type Cosmetics = {
  /** 프로필 프레임/링 id — null/omit = 기본 사각 B&W */
  frame?: string | null;
  /** 판결·공유 카드 테마 id */
  verdictTheme?: string | null;
  /** 진영 지지 이펙트 id */
  campEffect?: string | null;
  /** 핸들 색·그레인 (가독성 최소선) */
  handleEffect?: string | null;
  /** 입장 pierce 사운드/비주얼 */
  pierceSkin?: string | null;
  /** 캘린더 도장 스킨 */
  calendarStamp?: string | null;
};

/** 현재 제품 기본 — B&W · 필드만 예약 */
export const DEFAULT_COSMETICS: Cosmetics = {
  frame: null,
  verdictTheme: null,
  campEffect: null,
  handleEffect: null,
  pierceSkin: null,
  calendarStamp: null,
};

export function resolveCosmetics(
  partial?: Cosmetics | null,
): Cosmetics {
  return {
    ...DEFAULT_COSMETICS,
    ...partial,
  };
}
