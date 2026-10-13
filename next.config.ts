import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 개발용 주황 N 배지(Next.js Dev Tools) 숨김 — UI에 섞이지 않게
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
