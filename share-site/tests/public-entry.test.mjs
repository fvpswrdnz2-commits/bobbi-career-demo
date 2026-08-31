import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("公开入口直接进入预约咨询首页", async () => {
  const [page, staticEntry] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("public/index.html", root), "utf8"),
  ]);
  assert.match(page, /prototype\/index\.html#\/student-home/);
  assert.match(page, /熬夜波比产品原型/);
  assert.match(staticEntry, /prototype\/index\.html#\/student-home/);
  assert.match(staticEntry, /熬夜波比产品原型/);
});

test("发布包保留完整原型和十位资料", async () => {
  await Promise.all([
    access(new URL("public/prototype/index.html", root)),
    access(new URL("public/prototype/src/app.js", root)),
    access(new URL("public/prototype/styles.css", root)),
    access(new URL("public/demo/data/profiles.js", root)),
    access(new URL("public/demo/data/search-dictionary.js", root)),
  ]);

  const profiles = await readFile(
    new URL("public/demo/data/profiles.js", root),
    "utf8",
  );
  assert.match(profiles, /id: '354'/);
  assert.match(profiles, /id: '344'/);
  assert.equal((profiles.match(/nickname:/g) ?? []).length, 10);
});
