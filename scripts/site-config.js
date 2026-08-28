// 公開先を変更するときは、画面ロジックではなくこの設定だけを更新する。
// OAuthシークレットや管理者キーなどの秘密情報は絶対に置かない。
window.StepBySiteConfig = {
  version: "HP: v1.8.5",
  api: {
    stats: "https://barrierfree-map.tail5de5e1.ts.net/api/stats",
    tactileRanking: "https://barrierfree-map.tail5de5e1.ts.net/api/tactile-ranking",
    records: "https://barrierfree-map.tail5de5e1.ts.net/api/records",
    tactileSessionInfo: "https://barrierfree-map.tail5de5e1.ts.net/api/tactile-session-info"
  },
  links: {
    mapApp: "https://kumakero-otama.github.io/StepBy/UI0/map/Index.html"
  }
};
