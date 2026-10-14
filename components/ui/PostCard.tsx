"use client";

import type { CSSProperties, ReactNode } from "react";

type PostCardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "li" | "div";
  focused?: boolean;
  /** 방어(백) 포인트 셸 #F4F4F0 */
  defend?: boolean;
  /** data-opinion-id 등 */
  "data-opinion-id"?: string;
  style?: CSSProperties;
};

/** 글 단위 카드 — #111 · 유리 보더 · 호버 미세 밝기 */
export function PostCard({
  children,
  className = "",
  as: Tag = "article",
  focused = false,
  defend = false,
  style,
  ...data
}: PostCardProps) {
  return (
    <Tag
      className={`post-card ${defend ? "post-card-defend" : ""} ${
        focused
          ? defend
            ? "ring-1 ring-inset ring-black/20"
            : "ring-1 ring-inset ring-white/15"
          : ""
      } ${className}`}
      style={style}
      data-post-card
      data-shell={defend ? "defend" : "dark"}
      {...data}
    >
      {children}
    </Tag>
  );
}
