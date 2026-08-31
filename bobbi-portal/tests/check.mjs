import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const html = readFileSync(resolve(root, "index.html"), "utf8");

const entries = [
  ["预约咨询", "#/student-home"],
  ["提供咨询", "#/senior-workbench"],
  ["波比后台", "#/admin-dashboard"],
];

for (const [label, route] of entries) {
  assert.ok(html.includes(label), `缺少入口：${label}`);
  assert.ok(html.includes(route), `${label} 的跳转地址不正确`);
}

assert.equal((html.match(/<section class="slide/g) || []).length, 7, "产品说明应保持为 7 页短演示");
assert.ok(html.includes('width: 1920px'), "Frontend Slides 必须使用 1920×1080 固定舞台");
assert.ok(html.includes('class SlidePresentation'), "必须包含演示控制器");
assert.ok(html.includes('touchstart'), "必须支持手机触控翻页");
assert.ok(html.includes('prefers-reduced-motion'), "必须照顾减少动态效果的系统设置");
assert.ok(html.includes('--ink: #08183d'), "产品说明应复用原型的墨水蓝");
assert.ok(html.includes('--orange: #ff6b00'), "产品说明应复用原型的暖橙色");
assert.equal((html.match(/class="chapter"/g) || []).length, 7, "每页右上说明必须统一使用橙色竖线组件");
assert.equal((html.match(/实际产品演示/g) || []).length, 2, "预约侧与运营侧应分成两页实际产品演示");

for (const asset of ["student-home.png", "student-search.png", "student-booking.png", "senior-workbench.png", "admin-dashboard.png"]) {
  assert.ok(existsSync(resolve(root, "assets", asset)), `缺少真实产品截图：${asset}`);
  assert.ok(html.includes(`assets/${asset}`), `产品说明未使用真实产品截图：${asset}`);
}

for (const forbidden of ["页面地图", "Zara", "style preview", "template.html", "不是……而是", "90 秒演示"]) {
  assert.ok(!html.includes(forbidden), `独立产品说明不应出现“${forbidden}”`);
}

console.log("PASS slides: 7 fixed-stage slides, prototype-matched theme, 5 real screenshots, 3 entry links, keyboard/touch navigation");
