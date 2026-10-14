"use client";

import {
  listDiscoverStrip,
  type DiscoverItem,
} from "@/lib/discover-mock";

type DiscoverStripProps = {
  light?: boolean;
  onSelect?: (item: DiscoverItem) => void;
};

/**
 * 발견 v0 — 홈 intro 한 줄. 라벨 최소 · 카드는 제목+숫자.
 */
export function DiscoverStrip({ light, onSelect }: DiscoverStripProps) {
  const items = listDiscoverStrip();
  if (items.length === 0) return null;

  const ink = light ? "text-black" : "text-white";
  const soft = light ? "text-black/45" : "text-white/45";
  const border = light ? "border-black/12" : "border-white/12";
  const chipBg = light ? "bg-black/[0.03]" : "bg-white/[0.04]";
  const chipBorder = light ? "border-black/15" : "border-white/15";

  return (
    <section
      className={`border-t ${border}`}
      aria-label="발견"
      data-discover-strip
    >
      <div
        className="flex gap-2 overflow-x-auto px-3 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            onClick={() => onSelect?.(item)}
            className={`min-w-[10.5rem] max-w-[13rem] shrink-0 border px-2.5 py-2 text-left ${chipBorder} ${chipBg}`}
            aria-label={`${item.eyebrow}: ${item.title}`}
            data-discover-kind={item.kind}
          >
            <p className={`text-[9px] font-bold tracking-[0.14em] ${soft}`}>
              {item.eyebrow}
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
