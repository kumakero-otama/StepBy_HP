# StepBy 公式ホームページ

視覚障害者向け地図情報共有アプリ「StepBy」を紹介する静的Webサイトです。GitHub Pagesで配信し、ビルド工程やサーバー側コードを必要としません。

## 主な内容

- StepByの目的と使い方
- お知らせ
- 記録距離、投稿数、利用者数などの統計
- よくある質問と問い合わせ案内
- 日本語・英語の切替

## 技術構成

- `index.html`: トップページ
- `styles.css`: 共通レイアウトとレスポンシブ表示
- `scripts/main.js`: メニュー、統計取得、カルーセルなどの画面処理
- `scripts/i18n.js`: 日本語・英語表示
- `scripts/site-config.js`: APIとStepByアプリの公開URL
- `news/`: お知らせページ
- `assets/`: 画像、アイコン、動画
- `test/`: 外部サービスへ接続しない静的テスト

## ローカルで確認する

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080/` を開きます。統計値は`site-config.js`に設定されたStepBy APIから取得するため、APIへ接続できない場合もページ本体は表示され、統計欄だけがエラー表示になります。

## テスト

Node.js以外の追加ライブラリは不要です。

```bash
npm test
```

テストは、必要なHTML・JavaScriptの存在、言語切替、公開リンク、アクセシビリティ用属性を確認します。

## 公開前の確認

1. `scripts/site-config.js`のアプリURLとAPI URLが公開先に合っていることを確認する。
2. `npm test`を実行する。
3. ローカルHTTPサーバーでPC・スマートフォン幅、日本語・英語を目視確認する。
4. 機密情報を含まないことを確認してGitHub Pagesへ反映する。

関連リポジトリ:

- フロントエンド: <https://github.com/kumakero-otama/StepBy>
- バックエンド: <https://github.com/kumakero-otama/barrierfree-map>
