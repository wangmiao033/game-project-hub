import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Project Hub",
  description: "游戏项目管理后台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
