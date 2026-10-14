"use client";

import { useEffect, useState } from "react";
import { domaStore } from "@/lib/store";
import type { ReportReason, ReportTargetKind } from "@/lib/types/domain";

const REPORT_REASONS: { id: ReportReason; label: string }[] = [
  { id: "spam", label: "스팸 · 도배" },
  { id: "harassment", label: "괴롭힘 · 혐오" },
  { id: "misinfo", label: "허위 · 조작" },
];

type SafetyMenuProps = {
  /** 차단 대상 유저 id */
  userId: string;
  /** 신고 대상 — 기본 user */
  reportKind?: ReportTargetKind;
  reportTargetId?: string;
  light?: boolean;
  onToast?: (message: string) => void;
  /** 메뉴를 오른쪽 정렬 */
  align?: "start" | "end";
};

type Panel = "menu" | "block" | "report" | null;

/** B&W · 차단/신고 최소 메뉴 (확인 1단계) */
export function SafetyMenu({
  userId,
  reportKind = "user",
  reportTargetId,
  light,
  onToast,
  align = "end",
}: SafetyMenuProps) {
  const [panel, setPanel] = useState<Panel>(null);
  const [reason, setReason] = useState<ReportReason>("spam");

  useEffect(() => {
    if (panel == null) setReason("spam");
  }, [panel]);

  const me = domaStore.getCurrentUser();
  if (!me || me.id === userId) return null;

  const muted = light ? "text-neutral-500" : "text-muted";
  const fg = light ? "text-black" : "text-white";
  const border = light ? "border-black/25" : "border-white/25";
  const bg = light ? "bg-white" : "bg-black";

  const close = () => setPanel(null);

  const confirmBlock = () => {
    try {
      domaStore.blockUser(userId);
      onToast?.("차단했습니다");
      close();
    } catch {
      onToast?.("로그인이 필요합니다");
    }
  };

  const submitReport = () => {
    try {
      domaStore.reportTarget({
        targetKind: reportKind,
        targetId: reportTargetId ?? userId,
        reason,
      });
      onToast?.("신고가 접수되었습니다");
      close();
    } catch {
      onToast?.("로그인이 필요합니다");
    }
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setPanel(panel ? null : "menu")}
        className={`px-1.5 py-0.5 text-[14px] leading-none tracking-widest ${muted}`}
        aria-label="더보기"
        aria-expanded={panel != null}
      >
        ···
      </button>

      {panel === "menu" ? (
        <div
          className={`absolute top-full z-30 mt-1 min-w-[7.5rem] border ${border} ${bg} ${
            align === "end" ? "right-0" : "left-0"
          }`}
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className={`block w-full px-3 py-2.5 text-left text-[13px] ${fg}`}
            onClick={() => setPanel("block")}
          >
            차단
          </button>
          <button
            type="button"
            role="menuitem"
            className={`block w-full border-t px-3 py-2.5 text-left text-[13px] ${border} ${fg}`}
            onClick={() => setPanel("report")}
          >
            신고
          </button>
        </div>
      ) : null}

      {panel === "block" || panel === "report" ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal
          aria-label={panel === "block" ? "차단 확인" : "신고"}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="닫기"
            onClick={close}
          />
          <div className="relative z-10 w-full max-w-[560px] border border-white/20 bg-black px-4 py-5 text-white">
            {panel === "block" ? (
              <>
                <p className="text-[14px] font-semibold">이 이용자를 차단할까요?</p>
                <p className="mt-2 text-[13px] leading-snug text-neutral-200">
                  글·메시지·팔로 목록에서 보이지 않습니다.
                </p>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={close}
                    className="flex-1 border border-white/30 py-2.5 text-[12px] tracking-[0.08em]"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={confirmBlock}
                    className="flex-1 border border-white bg-white py-2.5 text-[12px] tracking-[0.08em] text-black"
                  >
                    차단
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-[14px] font-semibold">신고 사유</p>
                <ul className="mt-3 space-y-1" role="radiogroup" aria-label="신고 사유">
                  {REPORT_REASONS.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={reason === r.id}
                        onClick={() => setReason(r.id)}
                        className={`flex w-full items-center justify-between border px-3 py-2.5 text-left text-[13px] ${
                          reason === r.id
                            ? "border-white bg-white text-black"
                            : "border-white/25 text-white"
                        }`}
                      >
                        {r.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={close}
                    className="flex-1 border border-white/30 py-2.5 text-[12px] tracking-[0.08em]"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={submitReport}
                    className="flex-1 border border-white bg-white py-2.5 text-[12px] tracking-[0.08em] text-black"
                  >
                    제출
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
