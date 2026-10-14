"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  loadAdPreviewPrefs,
  saveAdPreviewPrefs,
  type AdPreviewPrefs,
} from "@/lib/ad-preview";
import {
  loadOfflineSim,
  saveOfflineSim,
} from "@/lib/offline-verdicts";
import {
  loadSoundPrefs,
  saveSoundPrefs,
  type SoundPrefs,
} from "@/lib/sound/doma-sound";
import { domaStore, useDomaStore, useSession } from "@/lib/store";
import {
  DM_POLICY_LABEL,
  type DmPolicy,
  type PrivacyPrefs,
} from "@/lib/types/privacy";
import type { EditableProfile } from "@/components/ProfileEditSheet";

export type { EditableProfile };

type SettingsSheetProps = {
  open: boolean;
  /** 계정 전환 시 프로필 표시 동기화 */
  onProfileSync?: (next: EditableProfile) => void;
  /** 탈퇴 완료 — 가입 루트로 */
  onLeftAccount?: (socialId: string | null) => void;
  onClose: () => void;
  onToast?: (message: string) => void;
};

type Panel =
  | "menu"
  | "account"
  | "notify"
  | "privacy"
  | "sound"
  | "help"
  | "monetize"
  | "leave"
  | "offline";

const SWITCHABLE = ["soohan", "mira.k", "zero.nexus", "han.aegis"] as const;
const DM_OPTIONS: DmPolicy[] = ["everyone", "mutual", "off"];

const NOTIFY_KEY = "doma.notifyPrefs.v1";

type NotifyPrefs = {
  judgment: boolean;
  mine: boolean;
  message: boolean;
  mention: boolean;
};

function defaultNotifyPrefs(): NotifyPrefs {
  return { judgment: true, mine: true, message: true, mention: true };
}

function loadNotifyPrefs(): NotifyPrefs {
  if (typeof window === "undefined") return defaultNotifyPrefs();
  try {
    const raw = window.localStorage.getItem(NOTIFY_KEY);
    if (!raw) return defaultNotifyPrefs();
    return { ...defaultNotifyPrefs(), ...(JSON.parse(raw) as Partial<NotifyPrefs>) };
  } catch {
    return defaultNotifyPrefs();
  }
}

function saveNotifyPrefs(patch: Partial<NotifyPrefs>): NotifyPrefs {
  const next = { ...loadNotifyPrefs(), ...patch };
  try {
    window.localStorage.setItem(NOTIFY_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-1 pb-1 pt-5 text-center text-[10px] font-bold tracking-[0.18em] text-neutral-200 first:pt-2">
      {children}
    </p>
  );
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

/**
 * 앱 설정 메뉴 — Threads식 목록.
 * 프로필 편집 폼은 넣지 않음 (ProfileEditSheet). 스펙: sense-brand
 */
export function SettingsSheet({
  open,
  onProfileSync,
  onLeftAccount,
  onClose,
  onToast,
}: SettingsSheetProps) {
  const { user: sessionUser } = useSession();
  const snap = useDomaStore();
  const [panel, setPanel] = useState<Panel>("menu");
  const [privacy, setPrivacyLocal] = useState<PrivacyPrefs>(() =>
    domaStore.getPrivacy(),
  );
  const [sound, setSoundLocal] = useState<SoundPrefs>(() => loadSoundPrefs());
  const [adPreview, setAdPreview] = useState<AdPreviewPrefs>(() =>
    loadAdPreviewPrefs(),
  );
  const [offlineSim, setOfflineSim] = useState(false);
  const [notify, setNotify] = useState<NotifyPrefs>(() => loadNotifyPrefs());

  useEffect(() => {
    if (open) {
      setPanel("menu");
      setPrivacyLocal(domaStore.getPrivacy());
      setSoundLocal(loadSoundPrefs());
      setAdPreview(loadAdPreviewPrefs());
      setNotify(loadNotifyPrefs());
      setOfflineSim(loadOfflineSim());
    }
  }, [open, snap.privacyByUser, snap.session?.userId]);

  if (!open) return null;

  const patchPrivacy = (patch: Partial<PrivacyPrefs>) => {
    try {
      const next = domaStore.setPrivacy(patch);
      setPrivacyLocal(next);
      onToast?.(
        patch.dmPolicy != null
          ? `DM · ${DM_POLICY_LABEL[next.dmPolicy]}`
          : "프라이버시를 업데이트했습니다",
      );
    } catch {
      onToast?.("로그인이 필요합니다");
    }
  };

  const syncUser = () => {
    const u = domaStore.getCurrentUser();
    if (u) {
      onProfileSync?.({
        name: u.displayName,
        handle: u.handle,
        bio: u.bio,
        avatarChar: u.displayName.slice(0, 1),
      });
    }
  };

  const switchTo = (handle: string) => {
    try {
      domaStore.switchUser(handle);
      syncUser();
      onToast?.(`@${handle}로 전환`);
    } catch {
      onToast?.("전환할 수 없는 유저입니다");
    }
  };

  const logout = () => {
    domaStore.logout();
    onToast?.("로그아웃했습니다");
    onClose();
  };

  const loginDefault = () => {
    try {
      domaStore.login("soohan");
      syncUser();
      onToast?.("수한으로 로그인했습니다");
    } catch {
      onToast?.("로그인에 실패했습니다");
    }
  };

  const title =
    panel === "menu"
      ? "설정"
      : panel === "account"
        ? "계정"
        : panel === "notify"
          ? "알림"
          : panel === "privacy"
            ? "프라이버시·차단"
            : panel === "sound"
              ? "앱 사운드"
              : panel === "monetize"
                ? "광고·꾸미기"
                : panel === "offline"
                  ? "오프라인·보관"
                  : panel === "leave"
                    ? "탈퇴"
                    : "도움말";

  const confirmLeave = () => {
    try {
      const u = domaStore.getCurrentUser();
      const socialId = u?.socialId ?? null;
      domaStore.leaveAccount();
      onToast?.("탈퇴했습니다");
      onClose();
      onLeftAccount?.(socialId);
    } catch {
      onToast?.("탈퇴에 실패했습니다");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-center bg-black text-white"
      role="dialog"
      aria-modal
      aria-label="설정"
      data-settings-menu
    >
      <div className="flex h-dvh w-full max-w-[560px] flex-col border-x border-neutral-800">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-800 bg-black px-3 py-3">
          <button
            type="button"
            onClick={() => {
              if (panel === "menu") onClose();
              else setPanel("menu");
            }}
            className="px-1 py-1 text-[14px] text-neutral-200"
            aria-label="뒤로"
          >
            ← 뒤로
          </button>
          <p className="flex-1 text-center text-[12px] font-bold tracking-[0.18em]">
            {title}
          </p>
          <span className="min-w-10" aria-hidden />
        </header>

        <div className="flex-1 overflow-y-auto px-2 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-2">
          {panel === "menu" ? (
            <div aria-label="설정 목록" className="px-2">
              {(
                [
                  {
                    group: "계정",
                    rows: [
                      {
                        id: "account",
                        label: "계정",
                        hint: sessionUser
                          ? `@${sessionUser.handle} · 만 14+`
                          : "로그인 · 만 14+",
                        onClick: () => setPanel("account"),
                      },
                      {
                        id: "scrap",
                        label: "스크랩",
                        hint: "본인만 봄 · 프로필 스크랩 탭",
                        onClick: () =>
                          onToast?.("프로필 → 스크랩 탭에서 확인하세요"),
                      },
                    ],
                  },
                  {
                    group: "알림·사운드",
                    rows: [
                      {
                        id: "notify",
                        label: "알림",
                        hint: "판결 · 내 글 · 메시지 · 멘션",
                        onClick: () => setPanel("notify"),
                      },
                      {
                        id: "sound",
                        label: "앱 사운드",
                        hint: sound.enabled
                          ? "켜짐 · 입장+판결 스팅만"
                          : "꺼짐 · 입장+판결 스팅",
                        onClick: () => setPanel("sound"),
                      },
                    ],
                  },
                  {
                    group: "프라이버시·안전",
                    rows: [
                      {
                        id: "privacy",
                        label: "프라이버시·차단",
                        hint: "DM 수신 · 차단 · 신고 안내",
                        onClick: () => setPanel("privacy"),
                      },
                      {
                        id: "content",
                        label: "콘텐츠 한도",
                        hint: "제안·의견 500 · 댓글 280 · 쿨다운 3분",
                        onClick: () =>
                          onToast?.(
                            "제안 500 · 의견 500 · 댓글 280 · 작성 쿨다운 3분",
                          ),
                      },
                    ],
                  },
                  {
                    group: "데이터·광고",
                    rows: [
                      {
                        id: "offline",
                        label: "오프라인·보관",
                        hint: offlineSim
                          ? "시뮬레이션 켜짐"
                          : "판결 저장 · 로드된 화면",
                        onClick: () => setPanel("offline"),
                      },
                      {
                        id: "monetize",
                        label: "광고·꾸미기",
                        hint: adPreview.enabled
                          ? "오늘·내일 아래 미리보기 켜짐"
                          : "슬롯 미리보기 · 코스메틱 훅",
                        onClick: () => setPanel("monetize"),
                      },
                    ],
                  },
                  {
                    group: "도움말",
                    rows: [
                      {
                        id: "help",
                        label: "도움말·규칙",
                        hint: "전장 규칙 · DOMA",
                        onClick: () => setPanel("help"),
                      },
                    ],
                  },
                ] as const
              ).map((section) => (
                <div key={section.group}>
                  <SectionLabel>{section.group}</SectionLabel>
                  <ul>
                    {section.rows.map((row) => (
                      <li key={row.id} className="border-b border-neutral-800">
                        <button
                          type="button"
                          onClick={row.onClick}
                          className="flex w-full items-center gap-3 py-3.5 text-left active:opacity-70"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] text-white">
                              {row.label}
                            </span>
                            <span className="mt-0.5 block text-[12px] leading-snug text-neutral-200">
                              {row.hint}
                            </span>
                          </span>
                          <span className="text-neutral-200">
                            <Chevron />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <ul className="mt-2">
                <li className="border-b border-neutral-800">
                  <button
                    type="button"
                    onClick={sessionUser ? logout : loginDefault}
                    className="flex w-full items-center gap-3 py-3.5 text-left active:opacity-70"
                  >
                    <span className="text-[15px] text-white">
                      {sessionUser ? "로그아웃" : "수한으로 로그인 (목업)"}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          ) : null}

          {panel === "account" ? (
            <div className="px-2" data-account-settings>
              <p className="px-1 py-3 text-center text-[13px] leading-relaxed text-neutral-200">
                {sessionUser
                  ? `로그인 · @${sessionUser.handle}`
                  : "로그아웃 상태"}
              </p>
              <p className="px-1 pb-3 text-center text-[12px] leading-relaxed text-neutral-200">
                가입은 만 14세 이상. 카카오 연동은 준비 중 · 지금은 목업
                계정 전환만 됩니다.
              </p>
              <SectionLabel>계정 전환 (목업)</SectionLabel>
              <ul aria-label="계정 전환">
                {SWITCHABLE.map((handle) => {
                  const active = sessionUser?.handle === handle;
                  return (
                    <li key={handle} className="border-b border-neutral-800">
                      <button
                        type="button"
                        disabled={active}
                        onClick={() => switchTo(handle)}
                        className="flex w-full items-baseline justify-between gap-3 py-3.5 text-left disabled:opacity-40"
                      >
                        <span className="text-[14px] text-white">@{handle}</span>
                        <span className="text-[12px] text-neutral-200">
                          {active ? "현재" : "전환"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {sessionUser ? (
                <>
                  <SectionLabel>탈퇴</SectionLabel>
                  <p className="px-1 pb-3 text-[12px] leading-relaxed text-neutral-200">
                    탈퇴 후 글은 「탈퇴한 사용자」로 남습니다. 같은 계정
                    재가입은 7일 뒤부터.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPanel("leave")}
                    className="w-full border border-neutral-700 py-3.5 text-[14px] text-neutral-200"
                    data-leave-entry
                  >
                    탈퇴하기
                  </button>
                </>
              ) : null}
            </div>
          ) : null}

          {panel === "notify" ? (
            <div className="px-2" data-notify-settings>
              <p className="px-1 py-3 text-center text-[12px] leading-relaxed text-neutral-200">
                푸시·인앱 알림 분류 (로컬 저장 · 실서버 없음)
              </p>
              {(
                [
                  {
                    key: "judgment" as const,
                    label: "판결",
                    hint: "전투 종료 · 승패 확정",
                  },
                  {
                    key: "mine" as const,
                    label: "내 글",
                    hint: "좋아요 · 답글",
                  },
                  {
                    key: "message" as const,
                    label: "메시지",
                    hint: "DM · 요청함",
                  },
                  {
                    key: "mention" as const,
                    label: "멘션",
                    hint: "@언급 · 내 답글에 달린 답",
                  },
                ] as const
              ).map((row) => (
                <div
                  key={row.key}
                  className="flex items-center justify-between gap-3 border-b border-neutral-800 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] text-white">{row.label}</p>
                    <p className="mt-0.5 text-[12px] text-neutral-200">
                      {row.hint}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notify[row.key]}
                    aria-label={`${row.label} 알림`}
                    onClick={() => {
                      const next = saveNotifyPrefs({
                        [row.key]: !notify[row.key],
                      });
                      setNotify(next);
                      onToast?.(
                        next[row.key]
                          ? `${row.label} 알림을 켰습니다`
                          : `${row.label} 알림을 껐습니다`,
                      );
                    }}
                    className={`relative h-7 w-12 shrink-0 border transition-colors ${
                      notify[row.key]
                        ? "border-white bg-white"
                        : "border-neutral-600 bg-neutral-900"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-5 border border-neutral-800 bg-black transition-[left] ${
                        notify[row.key] ? "left-[1.35rem]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {panel === "leave" ? (
            <div className="px-2" data-leave-confirm>
              <p className="px-1 py-3 text-[14px] leading-relaxed text-white">
                정말 탈퇴할까요?
              </p>
              <p className="px-1 text-[13px] leading-relaxed text-neutral-200">
                탈퇴하면 세션이 끝나고, 같은 계정으로는 7일 뒤 다시 가입할 수
                있습니다.
              </p>
              <button
                type="button"
                onClick={confirmLeave}
                className="mt-8 w-full border border-white bg-white py-3.5 text-[14px] font-bold tracking-[0.08em] text-black"
                data-leave-confirm-btn
              >
                탈퇴
              </button>
              <button
                type="button"
                onClick={() => setPanel("account")}
                className="mt-3 w-full py-3 text-[13px] text-neutral-200"
              >
                취소
              </button>
            </div>
          ) : null}

          {panel === "privacy" ? (
            <div className="px-2" data-privacy-settings>
              <div className="border-b border-neutral-800 py-3.5">
                <p className="text-[14px] text-white">DM 수신</p>
                <p className="mt-0.5 text-[12px] text-neutral-200">
                  기본은 모두 · 비팔로워는 요청함
                </p>
                <ul className="mt-3 space-y-2" aria-label="DM 수신 정책">
                  {DM_OPTIONS.map((opt) => {
                    const active = privacy.dmPolicy === opt;
                    return (
                      <li key={opt}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => patchPrivacy({ dmPolicy: opt })}
                          className={`flex w-full items-center gap-2 border px-3 py-2.5 text-left text-[13px] ${
                            active
                              ? "border-white bg-white text-black"
                              : "border-neutral-700 text-neutral-200"
                          }`}
                        >
                          <span
                            className={`size-2 shrink-0 ${
                              active ? "bg-black" : "border border-neutral-500"
                            }`}
                            aria-hidden
                          />
                          {DM_POLICY_LABEL[opt]}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-neutral-800 py-3.5 text-left"
                onClick={() =>
                  onToast?.(
                    `차단 ${snap.blocks?.length ?? 0}명 · 목록 UI는 목업`,
                  )
                }
              >
                <div className="min-w-0">
                  <p className="text-[14px] text-white">차단 목록</p>
                  <p className="mt-0.5 text-[12px] text-neutral-200">
                    DM·알림·검색 숨김 · 전투·제안은 보임
                  </p>
                </div>
                <span className="text-neutral-200">
                  <Chevron />
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-neutral-800 py-3.5 text-left"
                onClick={() =>
                  onToast?.(
                    "신고는 글·프로필 ··· 메뉴에서 · 정지 1→3→7→30→90→영구",
                  )
                }
              >
                <div className="min-w-0">
                  <p className="text-[14px] text-white">신고·제재 안내</p>
                  <p className="mt-0.5 text-[12px] text-neutral-200">
                    피드·프로필 Safety 메뉴로 진입
                  </p>
                </div>
                <span className="text-neutral-200">
                  <Chevron />
                </span>
              </button>
              <p className="mt-3 px-1 text-[12px] leading-relaxed text-neutral-200">
                스크랩은 나만 봅니다. 타인 프로필에는 안 보입니다.
              </p>
            </div>
          ) : null}

          {panel === "sound" ? (
            <div className="px-2" data-sound-settings>
              <div className="flex items-center justify-between gap-3 border-b border-neutral-800 py-3.5">
                <div className="min-w-0">
                  <p className="text-[14px] text-white">DOMA 소리</p>
                  <p className="mt-0.5 text-[12px] text-neutral-200">
                    입장·판결 스팅만 · 브금 없음 · 기기 볼륨은 OS
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={sound.enabled}
                  aria-label="DOMA 소리"
                  onClick={() => {
                    const next = saveSoundPrefs({ enabled: !sound.enabled });
                    setSoundLocal(next);
                    onToast?.(
                      next.enabled
                        ? "DOMA 소리를 켰습니다"
                        : "DOMA 소리를 껐습니다",
                    );
                  }}
                  className={`relative h-7 w-12 shrink-0 border transition-colors ${
                    sound.enabled
                      ? "border-white bg-white"
                      : "border-neutral-600 bg-neutral-900"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-5 border border-neutral-800 bg-black transition-[left] ${
                      sound.enabled ? "left-[1.35rem]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : null}

          {panel === "monetize" ? (
            <div className="px-2" data-monetize-settings>
              <p className="px-1 py-3 text-[13px] leading-relaxed text-neutral-200">
                광고는 오늘·내일 전장 아래 칸 하나씩만. 입장 게이트·피드
                남발 없음. 지지·%·타이머·TOP 본문·티어 부스트는 없습니다.
                꾸미기는 코스메틱만 · 승패 무관.
              </p>
              <div className="flex items-center justify-between gap-3 border-b border-neutral-800 py-3.5">
                <div className="min-w-0">
                  <p className="text-[14px] text-white">광고 슬롯 미리보기</p>
                  <p className="mt-0.5 text-[12px] text-neutral-200">
                    오늘·내일 아래 · 빈「Sponsored」· SDK 없음
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={adPreview.enabled}
                  aria-label="광고 슬롯 미리보기"
                  onClick={() => {
                    const next = saveAdPreviewPrefs({
                      enabled: !adPreview.enabled,
                    });
                    setAdPreview(next);
                    onToast?.(
                      next.enabled
                        ? "광고 슬롯 미리보기를 켰습니다"
                        : "광고 슬롯 미리보기를 껐습니다",
                    );
                  }}
                  className={`relative h-7 w-12 shrink-0 border transition-colors ${
                    adPreview.enabled
                      ? "border-white bg-white"
                      : "border-neutral-600 bg-neutral-900"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-5 border border-neutral-800 bg-black transition-[left] ${
                      adPreview.enabled ? "left-[1.35rem]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <p className="mt-4 px-1 text-[12px] leading-relaxed text-neutral-200">
                스킨·상점 UI는 준비 중. 프로필·공유 카드는{" "}
                <span className="text-white">cosmetics</span> 필드만
                읽습니다 (기본 B&W).
              </p>
            </div>
          ) : null}

          {panel === "offline" ? (
            <div className="px-2" data-offline-settings>
              <p className="px-1 py-3 text-[13px] leading-relaxed text-neutral-200">
                이미 연 화면은 브라우저 메모리·캐시로 잠깐 유지됩니다.
                지난 판결은 달력 상세에서 「오프라인 저장」할 수 있습니다.
              </p>
              <div className="flex items-center justify-between gap-3 border-b border-neutral-800 py-3.5">
                <div className="min-w-0">
                  <p className="text-[14px] text-white">오프라인 시뮬레이션</p>
                  <p className="mt-0.5 text-[12px] text-neutral-200">
                    켜면 저장한 판결만 상세 열림
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={offlineSim}
                  aria-label="오프라인 시뮬레이션"
                  onClick={() => {
                    const next = saveOfflineSim(!offlineSim);
                    setOfflineSim(next);
                    onToast?.(
                      next
                        ? "오프라인 시뮬레이션을 켰습니다"
                        : "오프라인 시뮬레이션을 껐습니다",
                    );
                  }}
                  className={`relative h-7 w-12 shrink-0 border transition-colors ${
                    offlineSim
                      ? "border-white bg-white"
                      : "border-neutral-600 bg-neutral-900"
                  }`}
                  data-offline-sim-toggle
                >
                  <span
                    className={`absolute top-0.5 size-5 border border-neutral-800 bg-black transition-[left] ${
                      offlineSim ? "left-[1.35rem]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <p className="mt-4 px-1 text-[12px] leading-relaxed text-neutral-200">
                PWA는 웹 우선 · 홈화면 추가용 manifest만. 스토어 앱 코드는
                없습니다.
              </p>
            </div>
          ) : null}

          {panel === "help" ? (
            <div className="space-y-4 px-3 py-3 text-[13px] leading-relaxed text-neutral-200">
              <p>
                <span className="text-white">DOMA</span> — 24시간 의견 증명
                전장. KST 시계 · 지지가 판결의 권위입니다.
              </p>
              <p>
                글 좋아요는 하루 5회(오늘 의견만). 댓글♥·공유·스크랩은
                무제한. 작성 쿨다운 3분.
              </p>
              <button
                type="button"
                className="text-white underline underline-offset-4"
                onClick={() => onToast?.("전투 규칙은 아레나 ? 에서")}
              >
                전투 규칙 안내
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
