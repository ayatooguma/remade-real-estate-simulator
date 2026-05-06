import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "リメイド式不動産投資シミュレーター",
  description:
    "手元資金と希望月収から、投資回収イメージとおすすめ物件タイプを試算するインタラクティブシミュレーターです。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
