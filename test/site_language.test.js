"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const article = fs.readFileSync(path.join(root, "news/20260406_00.html"), "utf8");
const i18n = fs.readFileSync(path.join(root, "scripts/i18n.js"), "utf8");

for (const html of [home, article]) {
  assert.doesNotMatch(html, />\s*文字サイズ\s*</, "the header must not expose a text-size selector");
  assert.match(html, /data-language="ja"/, "Japanese language control is required");
  assert.match(html, /data-language="en"/, "English language control is required");
  assert.match(html, /scripts\/i18n\.js/, "the functional language controller must be loaded");
}

assert.doesNotMatch(home, /mobile-drawer-text-size-title/, "mobile text-size controls must also be removed");
assert.match(i18n, /localStorage\.setItem\(STORAGE_KEY, nextLanguage\)/, "language choice must persist");
assert.match(i18n, /document\.documentElement\.lang = nextLanguage/, "document language must change");
assert.match(i18n, /About StepBy/, "English content translations must be present");

console.log("StepBy HP language selector switches Japanese and English without text-size controls");
