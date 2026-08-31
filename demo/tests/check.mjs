import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const appRoot = { innerHTML: '', querySelector() { return null; } };
const memory = new Map();
const context = vm.createContext({
  window: { addEventListener() {} },
  document: {
    querySelector(selector) { return selector === '#app' ? appRoot : null; },
    addEventListener() {},
  },
  location: { hash: '' },
  history: { length: 1, back() {} },
  localStorage: {
    getItem(key) { return memory.get(key) ?? null; },
    setItem(key, value) { memory.set(key, value); },
    removeItem(key) { memory.delete(key); },
  },
  setTimeout,
  clearTimeout,
  console,
});

for (const relative of ['data/profiles.js', 'data/search-dictionary.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, relative), 'utf8'), context, { filename: relative });
}

const profiles = context.window.BOBBI_PROFILES;
const dictionary = context.window.BOBBI_TAG_DICTIONARY;
const expectedIds = ['354', '353', '352', '351', '350', '349', '348', '347', '345', '344'];

assert.equal(profiles.length, 10, '应恰好导入 10 条资料');
assert.deepEqual([...profiles.map((item) => item.id)], expectedIds, '投稿编号集合或顺序不正确');
assert.equal(new Set(profiles.map((item) => item.id)).size, 10, '投稿编号必须唯一');
assert.ok(!profiles.some((item) => item.id === '343'), '投稿人 343 应留作候补');

for (const profile of profiles) {
  for (const key of ['nickname', 'headline', 'education', 'summary', 'internships', 'recruitment', 'offers', 'insights', 'consultTags', 'careerTags', 'rawTerms', 'availability', 'import']) {
    assert.ok(profile[key], `投稿 ${profile.id} 缺少字段 ${key}`);
  }
  assert.equal(profile.import.mode, 'LEGACY_POST_IMPORT');
  assert.equal(profile.import.proofRequired, false);
  assert.equal(profile.import.proofVerified, false);
  assert.ok(profile.availability.dayOffset >= 1 && profile.availability.dayOffset <= 7);
  assert.ok(profile.availability.times.length >= 1);
  assert.ok(!profile.nickname.includes('选手'), `投稿 ${profile.id} 的公开昵称不应包含“选手”`);
  assert.ok(!profile.headline.includes('选手'), `投稿 ${profile.id} 的公开标题不应包含“选手”`);
  assert.ok(!profile.recruitment.some((item) => item.title === '最终结果'), `投稿 ${profile.id} 应使用“最终去向”`);
}

const serialized = JSON.stringify(profiles);
assert.ok(!serialized.includes('非京'), '户籍类信息不应进入资料');
assert.ok(profiles.find((item) => item.id === '348').careerTags.includes('金融租赁'), '金租必须归一为金融租赁');
assert.ok(!profiles.find((item) => item.id === '348').careerTags.some((item) => /前端开发|软件前端/.test(item)), '金租前台不得误标为软件前端');
assert.ok(profiles.find((item) => item.id === '344').careerTags.includes('公募基金机构销售'), '公募机销必须归一为公募基金机构销售');
assert.ok(profiles.find((item) => item.id === '353').careerTags.includes('项目管理PMO'), 'PMO 必须归一为项目管理 PMO');
assert.ok(profiles.find((item) => item.id === '353').rawTerms.includes('PIM'), '有歧义的 PIM 必须保留原词');
assert.ok(!profiles.find((item) => item.id === '353').careerTags.some((item) => item.startsWith('PIM')), 'PIM 未确认含义前不得成为推断后的标准标签');

for (const alias of ['金租', '公募机销', 'pmo', '产运', '政策行', '券商ib']) {
  assert.ok(dictionary.some((item) => item.aliases.includes(alias)), `标签词典缺少别名 ${alias}`);
}

const indexSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
assert.ok(appSource.includes('求职有点绕'));
assert.ok(appSource.includes('会议链接稍后更新，请在咨询开始前查看。'));
assert.ok(!/波比精选|最近上新|周末可约/.test(appSource));
assert.ok(!/学生端|学生取消|前辈工作台|结算中心|售后反馈|待结算|预计结算/.test(appSource));
assert.ok(!/我已阅读并同意|同意《咨询服务规则》/.test(appSource));
assert.ok(!/搜投稿编号、岗位简介|直接说说你现在卡在哪里/.test(appSource));
assert.ok(!/方案 B|BOBBI DEMO|沟通演示版/.test(indexSource));

vm.runInContext(appSource, context, { filename: 'app.js' });
const search = context.window.BOBBI_APP_TEST;
assert.ok(search, '搜索引擎测试入口必须存在');

const expectedFirstResult = new Map([
  ['投稿354号', '354'],
  ['PMO', '353'],
  ['AI 产品', '347'],
  ['金租', '348'],
  ['公募机销', '344'],
  ['选调', '349'],
]);
for (const [query, id] of expectedFirstResult) {
  const results = search.rankProfiles(query);
  assert.ok(results.length > 0, `${query} 不应得到空结果`);
  assert.equal(results[0].profile.id, id, `${query} 的首位结果应为投稿 ${id}`);
  assert.ok(results[0].reasons.length >= 1, `${query} 必须返回可解释的匹配理由`);
}
assert.ok(search.rankProfiles('政策行').slice(0, 3).some((result) => result.profile.id === '349'), '政策行搜索的前三位应包含投稿 349');

assert.ok(appRoot.innerHTML.includes('学长学姐'), '首页应渲染统一算法推荐列表');
assert.ok(appRoot.innerHTML.includes('快速方向'), '首页应提供快捷方向');

const financeLeaseDetail = search.pages.profilePage('348');
assert.ok(financeLeaseDetail.includes('金融租赁'));
assert.ok(!financeLeaseDetail.includes('前端开发'));
for (const profile of profiles) {
  const detail = search.pages.profilePage(profile.id);
  const bookingView = search.pages.bookingPage(profile.id);
  assert.ok(detail.includes(`#${profile.id}`), `投稿 ${profile.id} 详情页缺少编号`);
  assert.ok(detail.includes(profile.headline), `投稿 ${profile.id} 详情页缺少标题`);
  assert.ok(bookingView.includes('确认并支付'), `投稿 ${profile.id} 预约页未生成`);
}

search.setState({
  selectedSlot: '348-1-20:00',
  selectedSlotLabel: '8月28日 周五 20:00',
  duration: 60,
  resumeFileName: '求职简历.pdf',
  questions: '想了解金融租赁业务岗位如何准备面试和梳理经历。',
  agreement: true,
});
const booking = search.pages.bookingPage('348');
assert.ok(booking.includes('求职简历.pdf'));
assert.ok(booking.includes('确认并支付'));
assert.ok(booking.includes('上传简历 <em class="required-star">*</em>'));
assert.ok(booking.includes('咨询问题 <em class="required-star">*</em>'));
assert.ok(!booking.includes('我已阅读并同意'));
const payment = search.pages.paymentPage('348');
assert.ok(payment.includes('微信支付'));
assert.ok(payment.includes('确认支付 ¥240'));
search.saveOrder(search.profileById('348'));
const success = search.pages.successPage('348');
assert.ok(success.includes('支付成功'));
assert.ok(success.includes('会议链接稍后更新，请在咨询开始前查看。'));
assert.ok(search.pages.ordersPage().includes('金租上岸'));

const orderDetail = search.pages.orderDetailPage();
assert.ok(orderDetail.includes('申请改期'));
assert.ok(orderDetail.includes('取消预约'));
assert.ok(orderDetail.includes('会议信息'));
assert.ok(search.pages.reschedulePage('public').includes('第二次发起改期'));
assert.ok(search.pages.cancelPage('public').includes('取消规则'));
assert.ok(!search.pages.cancelPage('public').includes('学生取消规则'));

const workbench = search.pages.workbenchPage();
const consultDetail = search.pages.consultDetailPage();
const profileForm = search.pages.profileFormPage();
assert.ok(workbench.includes('咨询工作台'));
assert.ok(workbench.includes('填写 / 更新个人资料'));
assert.ok(consultDetail.includes('申请改期'));
assert.ok(consultDetail.includes('取消预约'));
assert.ok(profileForm.includes('可预约时间偏好'));
assert.ok(profileForm.includes('上传证明材料'));
assert.ok(profileForm.includes('保存草稿'));
assert.ok(profileForm.includes('提交审核'));

const renderedPages = [
  search.pages.homePage(),
  search.pages.searchPage(),
  financeLeaseDetail,
  booking,
  payment,
  success,
  search.pages.ordersPage(),
  orderDetail,
  search.pages.reschedulePage('public'),
  search.pages.cancelPage('public'),
  search.pages.minePage(),
  workbench,
  search.pages.consultsPage(),
  consultDetail,
  search.pages.profileStatusPage(),
  profileForm,
  search.pages.notificationsPage(),
  search.pages.rulesPage(),
].join('\n');
for (const forbidden of ['演示', '模拟', '方案 B', '已使用演示简历', '演示昵称', '选手', '最终结果', '我已阅读并同意', '学生取消规则', '结算中心', '售后反馈']) {
  assert.ok(!renderedPages.includes(forbidden), `用户界面不得出现“${forbidden}”`);
}
const mobileRoutePrefixes = new Set(['home', 'search', 'profile', 'book', 'pay', 'success', 'orders', 'order', 'reschedule', 'cancel', 'mine', 'workbench', 'provider-mine', 'consults', 'consult', 'provider-reschedule', 'provider-cancel', 'profile-status', 'profile-form', 'contact', 'notifications', 'rules']);
for (const [, target] of renderedPages.matchAll(/data-nav="([^"]+)"/g)) {
  assert.ok(mobileRoutePrefixes.has(target.split('/')[0]), `移动端存在未知路由 ${target}`);
}

assert.ok(search.pages.minePage().includes('消息提醒'), '“我的”应包含消息提醒入口');
assert.ok(search.pages.minePage().includes('服务规则与隐私'), '“我的”应包含规则与隐私入口');
assert.ok(search.pages.notificationsPage().includes('紧急短信提醒'), '消息提醒页应覆盖紧急短信');
assert.ok(search.pages.rulesPage().includes('距咨询开始至少 6 小时'), '规则页应写明预约时间门槛');
search.setState({ orderTab: 'completed', consultTab: 'completed' });
assert.ok(search.pages.ordersPage().includes('订单已按约定结束时间自动完成'), '已完成预约应说明自动完成');
assert.ok(search.pages.consultsPage().includes('已完成'), '咨询列表应支持已完成状态');

const adminRoot = { innerHTML: '', querySelector() { return null; } };
const adminContext = vm.createContext({
  window: { BOBBI_PROFILES: profiles, addEventListener() {} },
  document: {
    title: '',
    querySelector(selector) { return selector === '#admin-app' ? adminRoot : null; },
    addEventListener() {},
  },
  location: { hash: '' },
  navigator: {},
  setTimeout,
  clearTimeout,
  console,
});
const adminSource = fs.readFileSync(path.join(root, 'admin.js'), 'utf8');
const adminHtml = fs.readFileSync(path.join(root, 'admin.html'), 'utf8');
const adminCss = fs.readFileSync(path.join(root, 'admin.css'), 'utf8');
vm.runInContext(adminSource, adminContext, { filename: 'admin.js' });
const admin = adminContext.window.BOBBI_ADMIN_TEST;
assert.ok(admin, '后台页面测试入口必须存在');
assert.equal(admin.routes.length, 10, '后台必须覆盖旧原型中仍有效的 10 个页面');
assert.ok(adminHtml.includes('运营后台'));
assert.ok(adminCss.includes('.admin-shell'));

const adminPages = [
  admin.pages.dashboardPage(),
  admin.pages.seniorsPage(),
  admin.pages.seniorPage('344'),
  admin.pages.availabilityPage('344'),
  admin.pages.ordersPage(),
  admin.pages.orderPage('DD260827103001'),
  admin.pages.meetingsPage(),
  admin.pages.refundsPage(),
  admin.pages.settlementsPage(),
  admin.pages.analyticsPage(),
].join('\n');
for (const required of ['仪表盘', '资料管理', '档期管理', '订单管理', '会议待办', '退款与异常', '结算管理', '经营数据']) {
  assert.ok(adminPages.includes(required), `后台缺少“${required}”页面`);
}
for (const forbidden of ['演示', '模拟', '售后申请', '退款与售后', '渠道归因分析']) {
  assert.ok(!adminPages.includes(forbidden), `后台界面不得出现“${forbidden}”`);
}
const adminRoutePrefixes = new Set(['dashboard', 'seniors', 'senior', 'availability', 'orders', 'order', 'meetings', 'refunds', 'settlements', 'analytics']);
for (const [, target] of adminPages.matchAll(/data-nav="([^"]+)"/g)) {
  assert.ok(adminRoutePrefixes.has(target.split('/')[0]), `后台存在未知路由 ${target}`);
}
assert.ok(admin.pages.seniorsPage().includes('#354'), '后台资料列表应使用已导入的 10 份资料');
assert.ok(admin.pages.orderPage('DD260827103001').includes('保存并通知双方'), '订单页应支持人工录入会议信息');
assert.ok(admin.pages.settlementsPage().includes('前辈应结 80%'), '后台结算页应呈现 80% 计算口径');

console.log('PASS checks: 10 profiles, search and booking flows, user/provider states, 10 admin pages, terminology safeguards');
