"use client";

import {
  listDiscoverStrip,
  type DiscoverItem,
  type DiscoverKind,
} from "@/lib/discover-mock";

type DiscoverStripProps = {
  light?: boolean;
  onSelect?: (item: DiscoverItem) => void;
};

function kindHint(kind: DiscoverKind): string {
  if (kind === "hot") return "오늘 전장";
  if (kind === "proposal") return "내일 제안";
  return "판결";
}

/**
 * 발견 v0 — 홈 intro 한 줄 가로 스크롤.
 * 하단 네비 탭 아님 · 전장을 압도하지 않는 얇은 입구.
 */
export function DiscoverStrip({ light, onSelect }: DiscoverStripProps) {
  const items = listDiscoverStrip();
  if (items.length === 0) return null;

  const ink = light ? "text-black" : "text-white";
  const soft = light ? "text-black/50" : "text-white/50";
  const border = light ? "border-black/12" : "border-white/12";
  const chipBg = light ? "bg-black/[0.03]" : "bg-white/[0.04]";
  const chipBorder = light ? "border-black/15" : "border-white/15";

  return (
    <section
      className={`border-t ${border}`}
      aria-label="발견"
      data-discover-strip
    >
      <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
        <p
          className={`shrink-0 text-[10px] font-bold tracking-[0.18em] ${soft}`}
        >
          발견
        </p>
        <p className={`truncate text-[10px] tracking-[0.06em] ${soft}`}>
          지금 볼만한 전투·제안
        </p>
      </div>
      <div
        className="flex gap-2 overflow-x-auto px-3 pb-2.5 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            onClick={() => onSelect?.(item)}
            className={`min-w-[11.5rem] max-w-[14rem] shrink-0 border px-2.5 py-2 text-left ${chipBorder} ${chipBg}`}
            aria-label={`${item.eyebrow}: ${item.title}`}
            data-discover-kind={item.kind}
          >
            <p className={`text-[9px] font-bold tracking-[0.14em] ${soft}`}>
              {item.eyebrow}
              <span className="mx-1 opacity-40" aria-hidden>
                ·
              </span>
              <span className="font-medium tracking-[0.06em]">
                {kindHint(item.kind)}
              </span>
            </p>
            <p
              className={`mt-1 line-clamp-2 text-[12px] font-medium leading-[1.35] ${ink}`}
            >
              {item.title}
            </p>
            {item.meta ? (
              <p className={`mt-1 text-[10px] tabular-nums ${soft}`}>
                {item.meta}
              </p>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}
