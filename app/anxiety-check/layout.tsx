import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "不動産投資の不安度チェック | リメイド式不動産投資",
  description:
    "10の質問から、不動産投資に対する不安度とカテゴリ別の解決策を可視化する診断ツールです。"
};

export default function AnxietyCheckLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
