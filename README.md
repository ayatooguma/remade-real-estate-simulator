# リメイド式不動産投資 特典ツール

リメイド式不動産投資の特典用WebツールをまとめたNext.jsプロジェクトです。

## ページ

- `/` - 投資回収シミュレーター
- `/property-diagnosis` - 物件タイプ診断ツール

## セットアップ

```bash
npm install
npm run dev
```

ローカル確認:

```text
http://127.0.0.1:3000
```

## 検証

```bash
npm run lint
npm run build
```

## デプロイ

GitHubリポジトリ:

```text
https://github.com/ayatooguma/remade-real-estate-simulator
```

Netlifyでは以下の設定でデプロイできます。

- Build command: `npm run build`
- Publish directory: `.next`
- Next.js plugin: `@netlify/plugin-nextjs`

`main` ブランチへpushすると、Netlify側で自動デプロイされます。

