"use client";

import type { CSSProperties, ReactNode } from "react";

type PostCardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "li" | "div";
  focused?: boolean;
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
  style,
  ...data
}: PostCardProps) {
  return (
    <Tag
      className={`post-card ${focused ? "ring-1 ring-inset ring-white/15" : ""} ${className}`}
      style={style}
      data-post-card
      {...data}
    >
      {children}
    </Tag>
  );
}
