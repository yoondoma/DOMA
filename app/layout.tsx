import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

/** 큰 주제·디스플레이 · 워드마크 조화 (OFL) */
const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DOMA KR — 토론 아레나",
  description:
    "오늘의 논제에 참전하고, 280자 진술로 여론을 움직이는 토론 시스템.",
  applicationName: "DOMA KR",
  appleWebApp: {
    title: "DOMA KR",
    capable: true,
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "1024x1024" }],
    apple: [{ url: "/apple-icon.png", sizes: "1024x1024", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerifKr.variable} h-full`}>
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
