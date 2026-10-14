/** 목업 강제 상태 — `?ui=empty|loading|error` */
export type UiDemo = "normal" | "empty" | "loading" | "error";

export function readUiDemo(): UiDemo {
  if (typeof window === "undefined") return "normal";
  const v = new URLSearchParams(window.location.search).get("ui");
  if (v === "empty" || v === "loading" || v === "error") return v;
  return "normal";
}
