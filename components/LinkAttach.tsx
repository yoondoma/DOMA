"use client";

type LinkAttachProps = {
  value: string;
  onChange: (value: string) => void;
};

function hostnameOf(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    return new URL(withProto).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** 링크 입력 스텁 · 간단 호스트 미리보기 */
export function LinkAttach({ value, onChange }: LinkAttachProps) {
  const host = hostnameOf(value);

  return (
    <div className="mt-3" data-link-attach>
      <label className="block">
        <span className="text-[11px] tracking-[0.08em] text-muted">링크 (선택)</span>
        <input
          type="url"
          inputMode="url"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 500))}
          placeholder="https://…"
          className="mt-1 w-full border border-white/25 bg-black px-3 py-2.5 text-[13px] text-white outline-none placeholder:text-dim focus:border-white"
          aria-label="링크 입력"
        />
      </label>
      {host ? (
        <p
          className="mt-1.5 truncate border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[12px] text-white/75"
          aria-label="링크 미리보기"
        >
          ↗ {host}
        </p>
      ) : null}
    </div>
  );
}
