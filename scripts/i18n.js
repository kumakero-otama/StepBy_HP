(function setupSiteLanguage() {
  "use strict";

  const STORAGE_KEY = "stepby-hp-language";
  const translations = {
    "StepBy : 視覚障害者向け地図情報共有アプリ": "StepBy: A Map Information Sharing App for People with Visual Impairments",
    "StepByを開く": "Open StepBy",
    "日本語": "Japanese",
    "あなたの一歩が、誰かの道になる。": "Your step can become someone else's path.",
    "視覚障害者向け地図情報投稿アプリ": "A map information contribution app for people with visual impairments",
    "StepByを開く（インストール不要）": "Open StepBy (no installation required)",
    "お知らせ": "News",
    "StepByとは": "About StepBy",
    "アプリの使い方": "How to Use the App",
    "統計": "Statistics",
    "よくある質問": "Frequently Asked Questions",
    "スポンサー募集": "Become a Sponsor",
    "StepByの公式Webサイトを開設しました！": "The Official StepBy Website Is Now Open!",
    "StepByの公式Webサイトを開設しました！ | StepBy": "The Official StepBy Website Is Now Open! | StepBy",
    "。": ".",
    "点字ブロックは視覚障害者の歩行にとても役立っています。": "Tactile paving is very useful for people with visual impairments when walking.",
    "しかし、その点字ブロックの場所を事前に知るための地図は、ほとんど公開されていません。": "However, very few maps are available that show where tactile paving is located in advance.",
    "StepByは、点字ブロックや音響信号機のような視覚障害者向けの地図情報をだれでも記録・共有し、地図上に表示させることができる、完全無料のWebアプリです。": "StepBy is a completely free web app that lets anyone record, share, and display map information for people with visual impairments, such as tactile paving and audible traffic signals.",
    "①目の見えない人を支援する身近な人が使う": "1. For people who support someone with a visual impairment",
    "目の見えない人を支援する方は、目の見えない人が外出される際にStepByを使って点字ブロックや音響信号機などが多いところを調べ、安全な道を伝えることができます。": "People who support someone with a visual impairment can use StepBy to find routes with more tactile paving and audible traffic signals, and help them choose a safer route.",
    "②人にやさしくしたい気持ちを持った、すべての人が使う": "2. For everyone who wants to help others",
    "StepByでは、ボタン一つで誰でも簡単に点字ブロックなどの地図情報を記録・共有できます。": "With StepBy, anyone can easily record and share map information such as tactile paving with a single button.",
    "毎日の通学や通勤、ちょっとした外出のついでに点字ブロックを記録して、一人でひっそり目の見えない人の役に立ってみるのはいかがですか？": "Why not record tactile paving during your daily commute, trip to school, or a short outing and quietly help someone with a visual impairment?",
    "ログイン": "Sign In",
    "初めてアプリを使う場合も、2回目以降のログインの場合でも「Googleでログイン」ボタンをタップし、画面に従ってください。（左図赤枠）ゲストアカウントで入りたい場合は、「ゲストアカウントで入る」ボタンをタップしてください。": "Whether this is your first time using the app or you are returning, tap “Sign in with Google” and follow the instructions. To use a guest account, tap “Continue as Guest.”",
    "ログインが終わると、右図のような歩きスマホ禁止のウィンドウが出ますので、「はい」をタップしてください。": "After signing in, a safety notice asking you not to use your phone while walking appears. Tap “Yes” to continue.",
    "点字ブロック記録": "Record Tactile Paving",
    "点字ブロック記録機能とは、点字ブロックのある道を実際に歩いて、その敷設位置をアプリ内に記録する機能です。": "This feature records the location of tactile paving while you walk along a route where it is installed.",
    "①点字ブロックのある道に立ち、マップ画面（ログインして一番最初に出る画面）を開きます。": "1. Stand on a route with tactile paving and open the map screen, which appears first after signing in.",
    "②地図の真下にある緑の記録ボタンを押して歩き始めます。": "2. Press the green Record button below the map and start walking.",
    "③横断歩道など一時的に点字ブロックが途切れている場所は、記録ボタン右の一時停止ボタンを押して記録を一時停止しましょう。点字ブロックがある場所に来たら再開してください。": "3. If tactile paving is temporarily interrupted, such as at a crosswalk, pause recording and resume when you reach tactile paving again.",
    "④点字ブロックのある道が終わったら、停止ボタンを押して記録を停止してください。確認ウィンドウが出るので、本当にこの記録でよければ記録を保存しましょう。": "4. At the end of the tactile paving, stop recording. Review the confirmation window and save the record if it is correct.",
    "道情報投稿": "Post Road Information",
    "道情報投稿機能とは、音の鳴る信号機や歩道橋の入り口といった、視覚障害者に役立つ、地図上に一つの点で表せる情報を共有できる機能です。": "This feature lets you share useful point-based information, such as audible traffic signals and entrances to pedestrian bridges.",
    "①投稿したい道情報を現実世界で見つけたら、StepByのマップ画面を開きます。": "1. When you find road information to share, open the StepBy map.",
    "②道情報の場所を地図で探してタップし、道情報の投稿画面に移動します。": "2. Find and tap the location on the map to open the submission screen.",
    "③道情報の特徴に合わせて、タグ、詳細の文章、写真を入力します。": "3. Add tags, a description, and photos as appropriate.",
    "④情報を入力出来たら、最後に投稿ボタンを押します。": "4. When finished, press the Post button.",
    "地図情報表示": "Show Map Information",
    "マップ画面の下に「地図情報表示」と書かれた、地球のマークのあるボタンをタップすると地図情報が表示されます。地図には、点字ブロックのある線が青や緑で、道情報のある地点が青いピンで示され、それらをタップすると詳細情報を閲覧できます。": "Tap the globe button labeled “Show Map Information” below the map. Tactile paving appears as blue or green lines and road information as blue pins; tap them to view details.",
    "また、表示する地図情報は、画面右上の設定ボタン（歯車アイコン）の「地図の表示」項目から絞り込めます。": "You can filter the displayed information under “Map Display” from the settings button in the upper-right corner.",
    "その他メニュー": "Other Menu Items",
    "①自分のプロフィール画面へ移動します。プロフィール画面では、プロフィールの編集や、PROモード切替、自分の点字ブロック記録実績の閲覧などが可能です。": "1. Open your profile to edit it, switch PRO mode, and view your tactile-paving contributions.",
    "②マップ画面へ移動します。マップ画面とは、ログイン後最初に表示される、地図情報の閲覧や記録が可能なメイン画面です。": "2. Open the map, the main screen for viewing and recording map information.",
    "③自分がPROモードであれば表示されるバッジです。PROモードとは、視覚障害者歩行支援のプロの仕事の方用に、点字ブロックの詳しい記録等ができる機能です。有料モードではありません。": "3. This badge appears in PRO mode, which provides detailed recording tools for accessibility professionals. It is not a paid mode.",
    "StepBy全体の統計": "Overall StepBy Statistics",
    "今日時点の累計": "Totals as of today",
    "総点字ブロック記録距離": "Total tactile-paving distance recorded",
    "総道情報投稿件数": "Total road-information posts",
    "総ユーザー数": "Total users",
    "読み込み中": "Loading",
    "点字ブロック記録距離ランキング": "Tactile-Paving Distance Ranking",
    "過去": "Past",
    "のランキング": " ranking",
    "ランキングを読み込み中です。": "Loading ranking…",
    "ランキングの集計期間": "Ranking period",
    "総点字ブロック記録距離推移": "Total Tactile-Paving Distance Trend",
    "推移グラフの表示期間": "Trend chart period",
    "の推移": " trend",
    "推移を読み込み中です。": "Loading trend…",
    "全体統計を読み込み中です。": "Loading overall statistics…",
    "全体統計を取得できませんでした。": "Could not load overall statistics.",
    "推移を取得できませんでした。": "Could not load trend data.",
    "ランキングを取得できませんでした。": "Could not load the ranking.",
    "表示できる推移データがありません。": "No trend data is available.",
    "不明なエラー": "Unknown error",
    "ユーザー数推移": "User Count Trend",
    "ユーザー数推移グラフの表示期間": "User count trend period",
    "1日間": "1 day",
    "7日間": "7 days",
    "1か月間": "1 month",
    "3か月間": "3 months",
    "1年間": "1 year",
    "お知らせ一覧へ戻る": "Back to News",
    "StepByの公式Webサイトを開設いたしました。": "We have launched the official StepBy website.",
    "StepByとは、視覚障害者向けに点字ブロックなどの地図情報を誰でも記録・共有できるアプリです。": "StepBy is an app that lets anyone record and share map information such as tactile paving for people with visual impairments.",
    "こちらから開けます": "Open it here",
    "このWebサイトでStepByについての情報や使い方などを発信していきます。よろしくお願いいたします。": "This website will share information about StepBy and how to use it. Thank you for your support."
  };

  const attributeTranslations = {
    "メニューを開く": "Open menu",
    "メニューを閉じる": "Close menu",
    "メニュー": "Menu",
    "ページ上部へ戻る": "Back to top",
    "前のページ": "Previous page",
    "次のページ": "Next page",
    "前の統計ページ": "Previous statistics page",
    "次の統計ページ": "Next statistics page",
    "ランキングの集計期間": "Ranking period",
    "推移グラフの表示期間": "Trend chart period",
    "ユーザー数推移グラフの表示期間": "User count trend period"
    ,"ログイン画面": "Sign-in screen"
    ,"歩きスマホ禁止の確認画面": "Safety notice against using a phone while walking"
    ,"点字ブロック記録のデモ動画": "Tactile-paving recording demo video"
    ,"道情報投稿のデモ動画": "Road-information posting demo video"
    ,"地図情報を表示したマップ画面": "Map screen showing map information"
    ,"地図の表示設定画面": "Map display settings screen"
    ,"その他設定画面": "Other settings screen"
    ,"カルーセルのページ位置": "Carousel page position"
    ,"統計カルーセルのページ位置": "Statistics carousel page position"
    ,"総点字ブロック記録距離推移": "Total tactile-paving distance trend"
    ,"全体統計へ移動": "Go to overall statistics"
    ,"ランキングへ移動": "Go to ranking"
    ,"推移グラフへ移動": "Go to trend chart"
    ,"ユーザー数推移へ移動": "Go to user count trend"
  };

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function translateValue(value) {
    if (translations[value]) return translations[value];
    let match = value.match(/^(\d+)月(\d+)日$/);
    if (match) return `${match[1]}/${match[2]}`;
    match = value.match(/^(\d[\d,]*)人$/);
    if (match) return `${match[1]} users`;
    match = value.match(/^(\d[\d,]*)件$/);
    if (match) return `${match[1]} posts`;
    match = value.match(/^過去(.+)のランキングを読み込み中です。$/);
    if (match) return `Loading the ranking for the past ${translations[match[1]] || match[1]}…`;
    match = value.match(/^過去(.+)の記録はまだありません。$/);
    if (match) return `There are no records for the past ${translations[match[1]] || match[1]} yet.`;
    match = value.match(/^過去(.+)の推移を読み込み中です。$/);
    if (match) return `Loading the trend for the past ${translations[match[1]] || match[1]}…`;
    match = value.match(/^(.+)時点の累計$/);
    if (match) return `Totals as of ${match[1]}`;
    match = value.match(/^詳細: (.+)$/);
    if (match) return `Details: ${match[1]}`;
    return null;
  }

  function translateAttributeValue(value) {
    if (attributeTranslations[value]) return attributeTranslations[value];
    if (translations[value]) return translations[value];
    let match = value.match(/^(\d+)ページ目へ移動$/);
    if (match) return `Go to page ${match[1]}`;
    match = value.match(/^(\d+)月(\d+)日\s+(.+)$/);
    if (match) return `${match[1]}/${match[2]} ${translateValue(match[3]) || match[3]}`;
    match = value.match(/^(.+)から(.+)までの(.+)です。$/);
    if (match) return `${translations[match[3]] || match[3]} from ${match[1]} to ${match[2]}.`;
    return value;
  }

  function translateTextNode(node, language) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    if (!node.parentElement || ["SCRIPT", "STYLE"].includes(node.parentElement.tagName)) return;
    if (!node.__stepByJapaneseText) node.__stepByJapaneseText = node.nodeValue;
    const original = node.__stepByJapaneseText;
    if (language === "ja") {
      node.nodeValue = original;
      return;
    }
    const key = normalize(original);
    const translated = translateValue(key);
    if (!translated) return;
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${translated}${trailing}`;
  }

  function translateAttributes(language) {
    document.querySelectorAll("[aria-label], [alt], title").forEach((element) => {
      ["aria-label", "alt"].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        const cacheKey = `stepByOriginal${attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}`;
        if (!element.dataset[cacheKey]) element.dataset[cacheKey] = element.getAttribute(attribute);
        const original = element.dataset[cacheKey];
        element.setAttribute(attribute, language === "en" ? translateAttributeValue(original) : original);
      });
    });
    if (!document.documentElement.dataset.stepByOriginalTitle) {
      document.documentElement.dataset.stepByOriginalTitle = document.title;
    }
    const originalTitle = document.documentElement.dataset.stepByOriginalTitle;
    document.title = language === "en" ? (translations[originalTitle] || originalTitle) : originalTitle;
  }

  function updateControls(language) {
    document.querySelectorAll("[data-language]").forEach((button) => {
      const selected = button.dataset.language === language;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", selected ? "true" : "false");
      if (button.classList.contains("header-dropdown__item")) {
        button.querySelectorAll("img").forEach((image) => image.remove());
      }
      if (selected && button.classList.contains("header-dropdown__item")) {
        const image = document.createElement("img");
        const isArticle = window.location.pathname.includes("/news/");
        image.src = `${isArticle ? "../" : ""}assets/icons/check_1fgray.png`;
        image.alt = "";
        image.setAttribute("aria-hidden", "true");
        image.dataset.languageCheck = "true";
        button.appendChild(image);
      }
    });
    document.querySelectorAll(".header-dropdown__trigger strong").forEach((label) => {
      label.textContent = language === "en" ? "English" : "日本語";
    });
  }

  function applyLanguage(language) {
    const nextLanguage = language === "en" ? "en" : "ja";
    document.documentElement.lang = nextLanguage;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => translateTextNode(node, nextLanguage));
    translateAttributes(nextLanguage);
    updateControls(nextLanguage);
    try { localStorage.setItem(STORAGE_KEY, nextLanguage); } catch (error) {}
  }

  let initialLanguage = "ja";
  try { initialLanguage = localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "ja"; } catch (error) {}
  applyLanguage(initialLanguage);

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-language]");
    if (!button) return;
    applyLanguage(button.dataset.language);
  });

  const observer = new MutationObserver((mutations) => {
    if (document.documentElement.lang !== "en") return;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, "en");
        if (node.nodeType === Node.ELEMENT_NODE) {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) translateTextNode(walker.currentNode, "en");
          node.querySelectorAll("[aria-label], [alt]").forEach((element) => {
            ["aria-label", "alt"].forEach((attribute) => {
              if (!element.hasAttribute(attribute)) return;
              const original = element.getAttribute(attribute);
              element.setAttribute(attribute, translateAttributeValue(original));
            });
          });
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.StepBySiteLanguage = { apply: applyLanguage, current: () => document.documentElement.lang };
})();
