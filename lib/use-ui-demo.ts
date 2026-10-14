"use client";

import { useCallback, useEffect, useState } from "react";
import { readUiDemo, type UiDemo } from "@/lib/ui-demo";

/** `?ui=` 목업 상태. retry 시 normal로 되돌림(쿼리 제거). */
export function useUiDemo() {
  const [demo, setDemo] = useState<UiDemo>("normal");

  useEffect(() => {
    setDemo(readUiDemo());
  }, []);

  const retry = useCallback(() => {
    setDemo("normal");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("ui");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return { demo, retry, setDemo };
}
