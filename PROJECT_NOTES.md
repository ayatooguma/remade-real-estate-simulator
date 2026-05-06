# Project Notes

## 特典1: リメイド式不動産投資シミュレーター

- 目的: リメイド式不動産投資の魅力を体験できるインタラクティブなシミュレーター。
- 入力: 手元資金、希望月収、興味のある用途。
- 出力: おすすめ物件タイプ、投資回収シミュレーション、近い条件の成功事例。
- 技術: Next.js, Tailwind CSS, Framer Motion, Recharts。
- デプロイ: GitHub `ayatooguma/remade-real-estate-simulator` からNetlifyへデプロイ。
- 運用: 修正時はローカルで編集し、GitHubへpushするとNetlify側で再デプロイされる。

## 特典2: 物件タイプ診断ツール

- 目的: 7つの質問から、ユーザーに合う物件タイプ・投資スタイルを診断する。
- URL: `/property-diagnosis`
- フロー: スタート画面、質問7問、診断中ローディング、結果画面。
- 診断結果: 格安倉庫・物置、駐車場、築古戸建て賃貸、アクティブ民泊、ゼロ円物件、バランス型。
- CTA: `https://utage-system.com/p/YrSFgC8KLNX1`
- データ保存: なし。すべてフロントエンド内のハードコードデータで完結。
