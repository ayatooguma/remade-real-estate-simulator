import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "物件タイプ診断ツール | リメイド式不動産投資",
  description:
    "7つの質問から、リメイド式不動産投資でおすすめの物件タイプと投資スタイルを診断します。"
};

export default function PropertyDiagnosisLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
