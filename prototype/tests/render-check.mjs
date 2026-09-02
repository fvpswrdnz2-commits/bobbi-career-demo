import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

class SvgElement {
  constructor(tag) { this.tag = tag; this.attributes = {}; this.children = []; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  appendChild(child) { this.children.push(child); }
  get outerHTML() {
    const attributes = Object.entries(this.attributes).map(([name, value]) => ` ${name}="${value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`).join('');
    return `<${this.tag}${attributes}>${this.children.map(child => child.outerHTML).join('')}</${this.tag}>`;
  }
}

globalThis.window = globalThis;
globalThis.document = { createElementNS: (_namespace, tag) => new SvgElement(tag) };

await import('../../demo/data/profiles.js');
await import('../../demo/data/search-dictionary.js');

const [{ pageGroups, pages, profiles }, { renderMobilePage }, { renderAdminPage }, { rankProfiles }] = await Promise.all([
  import('../src/data.js'),
  import('../src/mobile-pages.js'),
  import('../src/admin-pages.js'),
  import('../src/search.js')
]);

const allPages = pageGroups.flatMap(group => group.pages);
assert.equal(allPages.length, 27, '页面导航总数应为 27');
assert.equal(new Set(allPages.map(page => page.id)).size, 27, '页面 id 不应重复');
assert.deepEqual(pageGroups.map(group => group.label), ['预约咨询', '提供咨询', '波比后台'], '原型只应保留三个业务菜单');
assert.ok(!pages.map, '原型不应再包含页面地图');
assert.equal(profiles.length, 10, '应导入 10 位投稿资料');

const rendered = [];
for (const page of allPages) {
  const html = pages[page.id].group === 'admin' ? renderAdminPage(page.id) : renderMobilePage(page.id);
  assert.ok(html.length > 300, `${page.id} 页面内容异常短`);
  assert.ok(!html.includes('undefined'), `${page.id} 出现 undefined`);
  assert.ok(!html.includes('[object Object]'), `${page.id} 出现对象字符串`);
  rendered.push([page.id, html]);
}

const studentHtml = allPages.filter(page => pages[page.id].group === 'student').map(page => renderMobilePage(page.id)).join('\n');
const consultHtml = allPages.filter(page => pages[page.id].group === 'senior').map(page => renderMobilePage(page.id)).join('\n');
for (const forbidden of ['波比精选', '最近上新', '售后反馈', '售后期', '我已阅读并同意', '学生取消规则', '第二次由学生', '会议已录入', '银行总行前辈']) {
  assert.ok(!studentHtml.includes(forbidden), `预约咨询页面不应出现：${forbidden}`);
}
for (const forbidden of ['结算中心', '待结算金额', '预计结算金额', '学生信息', '学生资料', '前辈工作台']) {
  assert.ok(!consultHtml.includes(forbidden), `提供咨询页面不应出现：${forbidden}`);
}
for (const required of ['求职有点绕', '最终去向', '会议链接稍后更新', '会议信息已更新', '可预约时间', '证明材料']) {
  assert.ok(`${studentHtml}\n${consultHtml}`.includes(required), `应呈现已确认文案或字段：${required}`);
}

assert.equal(rankProfiles('#347')[0].profile.id, '347', '投稿编号应精确直达');
assert.equal(rankProfiles('公募机销')[0].profile.id, '344', '术语别名应匹配公募机构销售');
assert.equal(rankProfiles('PMO')[0].profile.id, '353', '岗位词应匹配 PMO 资料');
const searchBeforeAvailabilityChange = rankProfiles('银行总行 Offer选择').map(item => item.profile.id);
const homeBeforeAvailabilityChange = rankProfiles('').map(item => item.profile.id);
const originalAvailability = profiles.map(profile => profile.availability);
profiles.forEach((profile, index) => { profile.availability = { dayOffset: 7 - (index % 7), times: index % 2 ? [] : ['23:30'] }; });
assert.deepEqual(rankProfiles('银行总行 Offer选择').map(item => item.profile.id), searchBeforeAvailabilityChange, '档期变化不应改变搜索排序');
assert.deepEqual(rankProfiles('').map(item => item.profile.id), homeBeforeAvailabilityChange, '档期变化不应改变首页排序');
profiles.forEach((profile, index) => { profile.availability = originalAvailability[index]; });
for (const item of rankProfiles('211 银行总行 Offer选择')) {
  assert.ok(item.score >= 0 && item.score <= 100, '动态权重得分应归一为百分制');
  assert.ok(!item.reasons.join(' ').match(/可约|档期|时间/), '搜索理由不得包含档期或时间');
}
assert.ok(!renderMobilePage('student-search').includes('<button>可约时间</button>'), '搜索排序入口不得包含可约时间');

const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
assert.ok(!appSource.includes('stage-heading'), '中间舞台不应重复展示页面名称和操作提示');
assert.ok(styles.includes('height: min(790px, calc(100vh - 152px)); min-height: 500px'), '普通原型舞台应在拉长手机后完整露出底端');
assert.ok(styles.includes('.presentation-mode .stage-canvas { min-height: 100vh; padding: 28px 36px 64px; }'), '专注预览应为手机模型保留桌面端底部空间');
assert.ok(styles.includes('.presentation-mode .stage-canvas { padding: 18px 8px 56px; }'), '窄视口专注预览应完整露出手机圆角底端');

for (const [pageId, html] of rendered) {
  for (const match of html.matchAll(/data-nav="([^"]+)"/g)) {
    assert.ok(pages[match[1]], `${pageId} 跳转到了不存在的页面 ${match[1]}`);
  }
  const buttonStarts = (html.match(/<button\b/g) || []).length;
  const buttonEnds = (html.match(/<\/button>/g) || []).length;
  assert.equal(buttonStarts, buttonEnds, `${pageId} 的按钮标签未闭合`);
  const sectionStarts = (html.match(/<section\b/g) || []).length;
  const sectionEnds = (html.match(/<\/section>/g) || []).length;
  assert.equal(sectionStarts, sectionEnds, `${pageId} 的 section 标签未闭合`);
}

console.log(`Render checks passed: ${rendered.length} pages, ${allPages.length} navigation entries.`);
