"use client";

import { useEffect, useMemo, useState } from "react";
import { DomaWordmark } from "@/components/DomaWordmark";
import {
  checkRejoin,
  isAge14Plus,
  normalizeHandle,
  socialIdForHandle,
} from "@/lib/account";
import { domaStore } from "@/lib/store";

type Step = "login" | "age" | "handle" | "blocked" | "underage";

type AuthSheetProps = {
  open: boolean;
  onClose?: () => void;
  onComplete: (profile: {
    name: string;
    handle: string;
    bio: string;
    avatarChar: string;
  }) => void;
  onToast?: (message: string) => void;
  /** 탈퇴 직후 재시도용 socialId */
  preferSocialId?: string | null;
};

const YEAR_NOW = new Date().getFullYear();
/** 최근 100년 — 만 14 미만도 선택 가능(목업 차단 확인용) */
const YEARS = Array.from({ length: 100 }, (_, i) => YEAR_NOW - i);

/**
 * 가입 루트 — 오픈 · 카카오 목 · 만 14+ · 핸들.
 * 스펙: account-trust.md
 */
export function AuthSheet({
  open,
  onComplete,
  onToast,
  preferSocialId,
}: AuthSheetProps) {
  const [step, setStep] = useState<Step>("login");
  const [birthYear, setBirthYear] = useState(YEAR_NOW - 20);
  const [handle, setHandle] = useState("");
  const [blockMessage, setBlockMessage] = useState("일주일 후 재가입 가능");
  const [pendingSocialId, setPendingSocialId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStep("login");
      setHandle("");
      setBirthYear(YEAR_NOW - 20);
      setPendingSocialId(preferSocialId ?? null);
      setBlockMessage("일주일 후 재가입 가능");
    }
  }, [open, preferSocialId]);

  const previewHandle = useMemo(
    () => normalizeHandle(handle) || "handle",
    [handle],
  );

  if (!open) return null;

  const startKakao = () => {
    /** 탈퇴 직후 같은 소셜로 들어오면 즉시 차단 */
    const sid =
      pendingSocialId ??
      preferSocialId ??
      null;
    if (sid) {
      const rejoin = checkRejoin(sid);
      if (!rejoin.ok) {
        setBlockMessage(rejoin.message);
        setStep("blocked");
        return;
      }
    }
    setStep("age");
  };

  const confirmAge = () => {
    if (!isAge14Plus(birthYear)) {
      setStep("underage");
      return;
    }
    setStep("handle");
  };

  const finish = () => {
    const h = normalizeHandle(handle);
    if (h.length < 2) {
      onToast?.("핸들은 2자 이상");
      return;
    }
    const socialId =
      pendingSocialId ?? preferSocialId ?? socialIdForHandle(h);
    try {
      domaStore.signupKakaoMock({
        handle: h,
        birthYear,
        displayName: h,
        socialId,
      });
      const u = domaStore.getCurrentUser();
      onComplete({
        name: u?.displayName ?? h,
        handle: u?.handle ?? h,
        bio: u?.bio ?? "",
        avatarChar: (u?.displayName ?? h).slice(0, 1),
      });
      onToast?.(`@${u?.handle ?? h}로 입장`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "REJOIN_COOLDOWN") {
        setBlockMessage(
          (e as Error & { messageKo?: string }).messageKo ??
            "일주일 후 재가입 가능",
        );
        setStep("blocked");
        return;
      }
      if (msg === "AGE_GATE") {
        setStep("underage");
        return;
      }
      if (msg === "HANDLE_TAKEN") {
        onToast?.("이미 쓰는 핸들입니다");
        return;
      }
      onToast?.("가입에 실패했습니다");
    }
  };

  const loginSeed = (seedHandle: string) => {
    try {
      domaStore.login(seedHandle);
      const u = domaStore.getCurrentUser();
      if (!u) return;
      onComplete({
        name: u.displayName,
        handle: u.handle,
        bio: u.bio,
        avatarChar: u.displayName.slice(0, 1),
      });
      onToast?.(`@${u.handle}로 로그인`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "REJOIN_COOLDOWN") {
        setPendingSocialId(socialIdForHandle(seedHandle));
        setBlockMessage(
          (e as Error & { messageKo?: string }).messageKo ??
            "일주일 후 재가입 가능",
        );
        setStep("blocked");
        return;
      }
      onToast?.("로그인에 실패했습니다");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-center bg-black text-white"
      role="dialog"
      aria-modal
      aria-label="가입"
      data-auth-sheet
    >
      <div className="flex h-dvh w-full max-w-[560px] flex-col border-x border-neutral-800">
        <header className="flex items-center justify-center border-b border-neutral-800 px-4 py-4">
          <DomaWordmark size="sm" />
        </header>

        <div className="flex flex-1 flex-col px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-10">
          {step === "login" ? (
            <>
              <h2 className="font-[family-name:var(--font-syne)] text-[22px] font-bold tracking-tight">
                입장
              </h2>
              <p className="mt-2 text-[13px] text-neutral-200">
                오늘 질문에 겨루려면 · 만 14+
              </p>
              <button
                type="button"
                onClick={startKakao}
                className="mt-10 w-full border border-white bg-white py-3.5 text-[14px] font-bold tracking-[0.08em] text-black"
                data-auth-kakao
              >
                카카오로 계속하기
              </button>
              <p className="mt-2 text-center text-[11px] text-neutral-200">
                목업 · 실제 카카오 연동 아님
              </p>
              <div className="mt-10 border-t border-neutral-800 pt-6">
                <p className="text-[11px] tracking-[0.14em] text-neutral-200">
                  목 계정 (개발)
                </p>
                <button
                  type="button"
                  onClick={() => loginSeed("doma.guest")}
                  className="mt-3 w-full border border-neutral-700 py-3 text-[13px] text-white"
                >
                  @doma.guest로 로그인
                </button>
              </div>
            </>
          ) : null}

          {step === "age" ? (
            <>
              <h2 className="font-[family-name:var(--font-syne)] text-[22px] font-bold tracking-tight">
                연령 확인
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-200">
                DOMA는 만 14세 이상만 이용할 수 있습니다.
              </p>
              <label className="mt-8 block">
                <span className="text-[11px] tracking-[0.1em] text-neutral-200">
                  출생 연도
                </span>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="mt-2 w-full border border-neutral-700 bg-black px-3 py-3 text-[16px] text-white outline-none"
                  aria-label="출생 연도"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}년
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={confirmAge}
                className="mt-10 w-full border border-white bg-white py-3.5 text-[14px] font-bold tracking-[0.08em] text-black"
              >
                다음
              </button>
              <button
                type="button"
                onClick={() => setStep("login")}
                className="mt-3 py-2 text-[13px] text-neutral-200"
              >
                ← 뒤로
              </button>
            </>
          ) : null}

          {step === "handle" ? (
            <>
              <h2 className="font-[family-name:var(--font-syne)] text-[22px] font-bold tracking-tight">
                핸들 설정
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-200">
                전장에서 쓸 @닉네임입니다. 실명은 공개되지 않습니다.
              </p>
              <label className="mt-8 block">
                <span className="text-[11px] tracking-[0.1em] text-neutral-200">
                  핸들
                </span>
                <div className="mt-2 flex items-center border-b border-neutral-200">
                  <span className="text-[16px] text-neutral-200">@</span>
                  <input
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-transparent py-3 pl-1 text-[16px] text-white outline-none"
                    maxLength={24}
                    autoComplete="username"
                    placeholder="your.handle"
                    aria-label="핸들"
                  />
                </div>
              </label>
              <p className="mt-2 text-[12px] text-neutral-200">
                미리보기 · @{previewHandle}
              </p>
              <button
                type="button"
                onClick={finish}
                className="mt-10 w-full border border-white bg-white py-3.5 text-[14px] font-bold tracking-[0.08em] text-black"
              >
                전장 입장
              </button>
              <button
                type="button"
                onClick={() => setStep("age")}
                className="mt-3 py-2 text-[13px] text-neutral-200"
              >
                ← 뒤로
              </button>
            </>
          ) : null}

          {step === "underage" ? (
            <>
              <h2 className="font-[family-name:var(--font-syne)] text-[22px] font-bold tracking-tight">
                가입할 수 없습니다
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-neutral-200">
                DOMA는 만 14세 이상만 이용할 수 있습니다.
              </p>
              <button
                type="button"
                onClick={() => setStep("login")}
                className="mt-10 w-full border border-neutral-600 py-3 text-[13px] text-white"
              >
                처음으로
              </button>
            </>
          ) : null}

          {step === "blocked" ? (
            <>
              <h2 className="font-[family-name:var(--font-syne)] text-[22px] font-bold tracking-tight">
                재가입 불가
              </h2>
              <p
                className="mt-3 text-[15px] leading-relaxed text-white"
                data-rejoin-block
              >
                {blockMessage}
              </p>
              <p className="mt-2 text-[13px] text-neutral-200">
                탈퇴 후 7일이 지나야 같은 계정으로 다시 들어올 수 있습니다.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPendingSocialId(null);
                  setStep("login");
                }}
                className="mt-10 w-full border border-neutral-600 py-3 text-[13px] text-white"
              >
                처음으로
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
