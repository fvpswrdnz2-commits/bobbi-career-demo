import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "熬夜波比 · 产品体验",
  description: "给 Bobby 查看的一对一求职咨询产品体验。",
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
