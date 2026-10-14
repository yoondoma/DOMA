/** 글·댓글 텍스트 공유 — navigator.share 또는 클립보드 */

export type SharePostInput = {
  text: string;
  authorHandle?: string;
  title?: string;
};

export async function sharePost(
  input: SharePostInput,
): Promise<"shared" | "copied" | "failed"> {
  const handle = input.authorHandle ? `@${input.authorHandle.replace(/^@/, "")}` : "";
  const body = [handle, input.text].filter(Boolean).join("\n");
  const title = input.title ?? "DOMA";

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text: body });
      return "shared";
    } catch {
      /* fall through */
    }
  }

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(body);
      return "copied";
    }
  } catch {
    return "failed";
  }
  return "failed";
}
