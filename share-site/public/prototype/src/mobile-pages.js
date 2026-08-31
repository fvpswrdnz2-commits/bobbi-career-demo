import { icon } from './icons.js';
import { profiles } from './data.js';
import { rankProfiles } from './search.js';

let selectedProfileId = '344';
let searchQuery = '';

export function selectProfile(id) {
  if (profiles.some(profile => profile.id === String(id))) selectedProfileId = String(id);
}

export function setSearchQuery(value) { searchQuery = String(value || '').trim(); }

const selectedProfile = () => profiles.find(profile => profile.id === selectedProfileId) || profiles[0] || fallbackProfile;
export const getSelectedProfile = selectedProfile;
const fallbackProfile = { id: '344', nickname: '公募机销', headline: '金融本硕上岸头部公募机构销售', education: '211 本科 + 两财一贸硕士｜金融', educationTags: ['211', '两财一贸'], facts: ['26届'], summary: '', internships: [], recruitment: [], offers: [], insights: [], consultTags: [], price: 120, duration: 30, availability: { times: ['19:30'] } };
const tag = text => `<span class="tag">${text}</span>`;
const status = (text, tone = 'neutral') => `<span class="status status-${tone}">${text}</span>`;
const sectionTitle = (text, side = '') => `<div class="section-title"><h3>${text}</h3>${side ? `<span>${side}</span>` : ''}</div>`;
const row = (title, meta, iconName = 'chevron', nav = '') => `<button class="list-row" ${nav ? `data-nav="${nav}"` : 'data-action="toast"'}><span class="row-icon">${icon(iconName, 19)}</span><span class="row-copy"><strong>${title}</strong><small>${meta}</small></span>${icon('chevron', 18)}</button>`;

function topBar(title, { back = false, subtitle = '', trailing = '' } = {}) {
  return `<div class="phone-status"><span>9:41</span><span>●●●</span></div><header class="mobile-header ${subtitle ? 'has-subtitle' : ''}">${back ? `<button class="icon-button" data-action="back" aria-label="返回">${icon('back', 22)}</button>` : '<span class="header-spacer"></span>'}<div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div>${trailing || '<span class="wechat-menu">•••　◉</span>'}</header>`;
}

function bottomNav(active, role = 'book') {
  const items = role === 'consult'
    ? [['senior-workbench', 'briefcase', '工作台'], ['senior-consults', 'message', '咨询'], ['student-profile', 'user', '我的']]
    : [['student-home', 'home', '首页'], ['student-orders', 'calendar', '预约'], ['student-profile', 'user', '我的']];
  return `<nav class="mobile-bottom-nav">${items.map(([id, iconName, label]) => `<button data-nav="${id}" class="${active === id ? 'active' : ''}">${icon(iconName, 21)}<span>${label}</span></button>`).join('')}</nav>`;
}

function profileRow(profile, reasons = [], compact = false) {
  const visibleTags = [...(profile.educationTags || []), ...(profile.careerTags || [])].slice(0, 3);
  return `<div class="profile-result"><button class="senior-row ${compact ? 'compact' : ''}" data-nav="student-detail" data-profile-id="${profile.id}"><span class="avatar">${profile.nickname.slice(0, 1)}</span><span class="senior-main"><strong><em>#${profile.id}</em>${profile.nickname}</strong><small>${profile.headline}</small><span class="mini-tags">${visibleTags.map(tag).join('')}</span></span><span class="senior-price"><b>¥${profile.price}</b><small>/ ${profile.duration}分钟</small></span>${icon('chevron', 18)}</button>${reasons.length ? `<div class="match-box"><strong>为什么推荐</strong>${reasons.map(text => `<span>${icon('check', 16)}${text}</span>`).join('')}</div>` : ''}</div>`;
}

function studentHome() {
  return `${topBar('熬夜波比')}<div class="mobile-scroll home-screen"><section class="home-hero"><h1>求职有点绕，<br>找个学长学姐聊聊</h1><span class="hand-underline"></span><button class="search-box" data-nav="student-search">${icon('search', 20)}<span>搜索投稿编号或求职方向</span></button></section><section>${sectionTitle('快速方向')}<div class="direction-grid">${[['银行','landmark'],['券商','chart'],['互联网','globe'],['央国企','building']].map(([label, iconName]) => `<button data-nav="student-search" data-search-value="${label}">${icon(iconName,25)}<span>${label}</span></button>`).join('')}</div></section><section>${sectionTitle('学长学姐')}<div class="profile-list">${rankProfiles('').map(item => profileRow(item.profile, [], true)).join('')}</div></section></div>${bottomNav('student-home')}`;
}

function studentSearch() {
  const ranked = rankProfiles(searchQuery);
  return `${topBar('', { back: true, trailing: '<button class="text-button" data-action="search">搜索</button>' })}<div class="search-sticky"><div class="search-input">${icon('search',18)}<input id="prototype-search" value="${searchQuery}" placeholder="例如：公募机销、PMO、#347" aria-label="搜索需求"></div><div class="filter-row">${['银行总行','公募基金','互联网产品','央国企'].map(value => `<button data-action="quick-search" data-search-value="${value}">${value}</button>`).join('')}</div><div class="sort-row"><button class="active">综合匹配</button><button>可约时间</button><button>价格</button></div></div><div class="mobile-scroll search-results"><p class="result-count">为你找到 <b>${ranked.length}</b> 位学长学姐</p>${ranked.length ? ranked.map(item => profileRow(item.profile, item.reasons)).join('') : '<div class="nearby-note"><strong>暂时没有完全匹配</strong><p>可以换一个方向或直接搜索投稿编号。</p></div>'}</div>${bottomNav('student-home')}`;
}

function studentDetail() {
  const profile = selectedProfile();
  const tags = [...(profile.educationTags || []), ...(profile.facts || [])];
  return `${topBar('', { back: true })}<div class="mobile-scroll detail-screen"><div class="profile-lead"><span class="avatar avatar-lg">${profile.nickname.slice(0,1)}</span><div><b>#${profile.id}</b><h1>${profile.nickname}</h1><p>${profile.headline}</p><strong>¥${profile.price} <small>/ ${profile.duration}分钟</small></strong></div></div><div class="rule"></div><section>${sectionTitle('教育背景')}<p>${profile.education}</p><div class="tags">${tags.map(tag).join('')}</div></section><section>${sectionTitle('实习经历')}<div class="tags">${(profile.internships || []).map(tag).join('')}</div></section><section>${sectionTitle('求职情况')}${(profile.recruitment || []).map(item => `<div class="recruitment-item"><b>${item.title === '最终结果' ? '最终去向' : item.title}</b><p>${item.text}</p></div>`).join('')}</section><section>${sectionTitle('最终去向')}<div class="tags">${(profile.offers || []).map(tag).join('')}</div></section><section>${sectionTitle('秋招心得')}${(profile.insights || []).map(text => `<p class="long-copy">${text}</p>`).join('')}</section><section>${sectionTitle('未来 7 天可约时间', '北京时间')}<div class="date-strip">${['今天\n—','明天\n—','周日\n19:30','周一\n20:00','周二\n21:00','周三\n—','周四\n20:30'].map((value, index) => `<button data-select="time" class="${index === 2 ? 'selected' : ''}">${value.replace('\n','<small>')}</small></button>`).join('')}</div></section></div><div class="mobile-action"><button class="primary" data-nav="student-booking">选择时间并预约</button></div>`;
}

function booking() {
  const profile = selectedProfile();
  return `${topBar('确认预约', { back: true, subtitle: `#${profile.id} · ${profile.nickname}` })}<div class="mobile-scroll form-screen"><div class="summary-line"><span class="avatar">${profile.nickname.slice(0,1)}</span><div><strong>8月30日 周日 19:30</strong><small>未来7天档期 · 北京时间</small></div>${status('可预约','success')}</div><section>${sectionTitle('咨询时长')}<div class="segment-control">${[30,60,90].map((minutes,index) => `<button data-select="duration" class="${index===1?'selected':''}">${minutes}分钟<small>¥${minutes / profile.duration * profile.price}</small></button>`).join('')}</div></section><section>${sectionTitle('简历', '<b class="required-mark">*</b> 必填')}<button class="upload-area" data-action="upload">${icon('upload',25)}<strong>上传简历</strong><span>PDF / 图片，仅本次咨询可查看</span></button></section><section>${sectionTitle('想咨询的问题', '<b class="required-mark">*</b> 必填')}<textarea rows="5" placeholder="请把想问的、想交流的内容一次写清楚">1. 这个岗位最看重哪些经历？\n2. 我的简历应该怎样调整重点？</textarea></section><div class="price-breakdown"><span>咨询费（60分钟）</span><strong>¥${profile.price * 2}</strong><small>已包含波比服务费</small></div></div><div class="mobile-action dual"><span><small>应付</small><b>¥${profile.price * 2}</b></span><button class="primary" data-nav="student-paid">确认并支付</button></div>`;
}

function paid() {
  const profile = selectedProfile();
  return `${topBar('支付结果', { back: true })}<div class="mobile-scroll success-screen"><div class="success-icon">${icon('check',46)}</div><h1>预约成功</h1><p>会议链接稍后更新，请在咨询开始前查看。</p><div class="success-summary"><span>咨询对象<strong>#${profile.id} · ${profile.nickname}</strong></span><span>咨询时间<strong>8月30日 周日 19:30</strong></span><span>咨询时长<strong>60分钟</strong></span><span>当前状态${status('稍后查看会议链接','warning')}</span></div><div class="info-note">会议信息更新后，双方都会收到通知。</div><button class="primary block" data-nav="student-order">查看订单</button><button class="ghost block" data-nav="student-home">返回首页</button></div>`;
}

function studentOrders() {
  const first = selectedProfile();
  const second = profiles.find(profile => profile.id === '347') || first;
  return `${topBar('我的预约')}<div class="tab-bar"><button class="active">待进行</button><button>已完成</button><button>已取消</button></div><div class="mobile-scroll order-list">${[[first,'8月30日 周日 19:30','稍后查看会议链接','warning'],[second,'9月1日 周二 20:00','会议信息已更新','success']].map(([profile,time,state,tone]) => `<button class="order-card" data-nav="student-order" data-profile-id="${profile.id}"><div><b>${time}</b>${status(state,tone)}</div><h3>#${profile.id} · ${profile.nickname}</h3><p>${profile.consultTags.slice(0,3).join(' · ')}</p><span>查看订单详情 ${icon('chevron',16)}</span></button>`).join('')}</div>${bottomNav('student-orders')}`;
}

function orderDetail() {
  const profile = selectedProfile();
  return `${topBar('订单详情', { back: true })}<div class="mobile-scroll detail-screen"><div class="order-hero"><span>${status('待咨询','success')}</span><h1>8月30日 周日 19:30</h1><p>#${profile.id} · ${profile.nickname} · 60分钟</p></div><section>${sectionTitle('腾讯会议')}<div class="meeting-box"><span>${icon('video',24)}</span><div><strong>会议号 123 456 789</strong><small>入会密码 0622</small></div><button data-action="copy">复制</button></div><button class="primary block" data-action="toast">进入腾讯会议</button></section><section>${sectionTitle('我的材料')}<div class="file-row">${icon('file',22)}<span><strong>求职简历.pdf</strong><small>付款成功后已开放查看</small></span>${icon('chevron',16)}</div><div class="question-preview">共 2 个咨询问题，已查看</div></section><section>${sectionTitle('改期与取消')}<div class="quota-row"><span>免费改期额度</span><strong>剩余 1 次</strong></div><div class="inline-actions"><button class="ghost" data-nav="student-reschedule">申请改期</button><button class="text-danger" data-nav="student-cancel">取消预约</button></div></section><section>${sectionTitle('订单进度')}<ol class="timeline"><li class="done"><b>支付成功，订单自动确认</b><small>8月27日 14:30</small></li><li class="done"><b>会议信息已更新</b><small>8月27日 15:10</small></li><li><b>等待咨询开始</b><small>8月30日 19:30</small></li></ol></section></div>`;
}

function reschedule() {
  return `${topBar('申请改期', { back: true, subtitle: '需在原咨询开始前2小时完成确认' })}<div class="mobile-scroll form-screen"><div class="rule-panel"><strong>本次改期免费</strong><p>原时间在确认新时间前继续有效。请选择 1 至 3 个未来 7 天的候选时间。</p></div><section>${sectionTitle('原咨询时间')}<div class="simple-value">8月30日 周日 19:30 · 60分钟</div></section><section>${sectionTitle('候选时间', '已选择 2/3')}<div class="candidate-list">${['8月31日 周一 19:00','9月1日 周二 20:00','9月2日 周三 21:00','9月3日 周四 20:30'].map((time,index) => `<button data-select="candidate" class="${index<2?'selected':''}">${icon('calendarClock',18)}<span>${time}</span>${index<2?icon('check',18):icon('plus',18)}</button>`).join('')}</div></section><div class="info-note">第二次发起改期时，按原订单金额的 10% 处理；最多只可改期 2 次。</div></div><div class="mobile-action"><button class="primary" data-action="toast">提交候选时间</button></div>`;
}

function cancelPage(role = 'book') {
  const providing = role === 'consult';
  return `${topBar(providing ? '取消咨询' : '取消预约', { back: true })}<div class="mobile-scroll form-screen"><div class="danger-illustration">${icon('close',44)}</div><h1 class="center-title">确认取消这次咨询？</h1><div class="cancel-money"><span>订单实付<strong>¥240</strong></span>${providing ? '<span class="total">预计退款<strong>全额退款</strong></span>' : '<span>取消费用（10%）<strong>− ¥24</strong></span><span class="total">预计退款<strong>¥216</strong></span>'}</div><div class="rule-panel"><strong>取消规则</strong><p>${providing ? '取消后对方将获得全额退款，原档期立即释放。' : '取消后原档期立即释放，此前已支付的额外改期费默认不退。'}</p></div></div><div class="mobile-action"><button class="danger-button" data-action="toast">确认取消${providing ? '咨询' : '并申请退款'}</button></div>`;
}

function studentProfile() {
  return `${topBar('我的')}<div class="mobile-scroll profile-screen"><div class="account-lead"><span class="avatar avatar-lg">W</span><div><h1>王同学</h1><p>已绑定微信</p></div></div><button class="role-switch" data-nav="senior-workbench"><span>${icon('briefcase',22)}<b>切换到提供咨询</b></span>${icon('chevron',18)}</button><section class="plain-list">${row('我的预约','查看全部咨询订单','calendar','student-orders')}${row('通知设置','订阅消息与站内消息','bell')}${row('隐私与规则','隐私政策、用户协议和咨询规则','shield')}${row('联系波比','微信号 b1025493856','message')}</section><button class="copy-wechat" data-action="copy-wechat">${icon('copy',18)} 复制波比微信号</button></div>${bottomNav('student-profile')}`;
}

function workbench() {
  const profile = profiles.find(item => item.id === '344') || selectedProfile();
  return `${topBar('咨询工作台', { subtitle: '今天也有人需要你的经验' })}<div class="mobile-scroll workbench-screen"><div class="senior-card"><div><span class="avatar avatar-lg inverse">${profile.nickname.slice(0,1)}</span><h3>${profile.nickname}</h3>${status('已发布','warning')}</div><button data-nav="senior-order"><small>下一次咨询</small><strong>周六 15:00 · 60分钟</strong>${icon('chevron',18)}</button></div><section>${sectionTitle('待办事项')}<div class="task-list"><button data-nav="senior-order">${icon('fileCheck',22)}<span>待查看咨询材料</span><b>2</b>${icon('chevron',16)}</button><button data-nav="senior-reschedule">${icon('calendarClock',22)}<span>改期待确认</span><b>1</b>${icon('chevron',16)}</button></div></section><section>${sectionTitle('资料状态')}<button class="profile-progress" data-nav="senior-profile-status"><span>${icon('badgeCheck',22)}<b>资料已发布</b><small>可预约时间已设置</small></span>${icon('chevron',18)}</button></section></div>${bottomNav('senior-workbench','consult')}`;
}

function consultList() {
  return `${topBar('我的咨询')}<div class="tab-bar"><button class="active">即将进行</button><button>已完成</button><button>已取消</button></div><div class="mobile-scroll order-list"><button class="order-card" data-nav="senior-order"><div><b>周六 15:00 · 60分钟</b>${status('已确认','purple')}</div><h3>王同学</h3><p>简历已提交 · 共 4 个问题</p><span>查看咨询材料 ${icon('chevron',16)}</span></button><button class="order-card" data-nav="senior-order"><div><b>周日 10:00 · 30分钟</b>${status('会议信息待更新','warning')}</div><h3>赵同学</h3><p>改期已确认</p><span>查看订单 ${icon('chevron',16)}</span></button></div>${bottomNav('senior-consults','consult')}`;
}

function seniorOrder() {
  return `${topBar('咨询详情', { back: true })}<div class="mobile-scroll detail-screen"><div class="consult-time">${icon('calendarClock',25)}<span><strong>周六 15:00 · 60分钟</strong><small>距离开始 2天 5小时</small></span>${status('已确认','purple')}</div><section>${sectionTitle('咨询对象')}<div class="student-row"><span class="avatar">W</span><div><b>王同学</b><small>本科 · 金融相关方向</small></div>${icon('chevron',18)}</div></section><section>${sectionTitle('简历材料')}<button class="file-row" data-action="toast">${icon('file',22)}<span><strong>求职简历.pdf</strong><small>上传于 8月27日 14:30</small></span>${icon('download',18)}</button></section><section>${sectionTitle('咨询问题', '共4个问题')}<ul class="question-list"><li>公募机构销售最看重哪些经历？</li><li>简历中的行研与信托经历怎样串联？</li><li>面试中的客户理解题如何准备？</li><li>银行和公募 Offer 应如何选择？</li></ul></section><section>${sectionTitle('腾讯会议')}<div class="meeting-box"><span>${icon('video',24)}</span><div><strong>123 456 789</strong><small>密码 0622</small></div><button data-action="copy">复制</button></div></section><div class="quota-row"><span>材料查看截止</span><strong>9月6日 16:00</strong></div></div><div class="mobile-action two-buttons"><button class="ghost" data-nav="senior-reschedule">申请改期</button><button class="text-danger" data-nav="senior-cancel">取消咨询</button><button class="primary" data-action="copy-wechat">联系波比</button></div>`;
}

function profileStatus() {
  return `${topBar('个人资料', { back: true })}<div class="mobile-scroll profile-status-screen"><div class="success-icon small">${icon('badgeCheck',36)}</div><h1>资料已发布</h1><p>可通过投稿编号 #344 搜索到你。</p><div class="progress-steps"><span class="done">提交资料</span><span class="done">波比审核</span><span class="done">配置档期</span><span class="done">已发布</span></div><section>${sectionTitle('公开资料预览')}<div class="preview-line"><b>教育经历</b><span>211 本科 + 两财一贸硕士</span></div><div class="preview-line"><b>最终去向</b><span>头部公募基金机构销售</span></div></section><button class="ghost block" data-nav="senior-profile-form">修改并重新提交</button></div>`;
}

function profileForm() {
  const fields = [['user','基本信息','头像、昵称和公开简介'],['graduation','教育经历','学历、国内外层次和专业'],['briefcase','实习经历','每段经历回车保存为标签'],['file','秋招情况','行业、岗位和流程'],['money','最终去向','最终获得和选择的 Offer'],['pencil','秋招心得','经验总结与建议'],['calendarClock','可预约时间','周期时段和临时例外'],['upload','证明材料','学历、实习、Offer 等，仅后台可见']];
  return `${topBar('完善个人资料', { back: true, subtitle: '提交后由波比审核，通过后发布' })}<div class="mobile-scroll profile-form-screen"><div class="form-progress"><span style="width:75%"></span><small>已完成 6 / 8</small></div><div class="profile-field-list">${fields.map((field,index) => `<button data-action="${field[0] === 'upload' ? 'upload' : 'toast'}"><span>${icon(field[0],22)}<b>${field[1]}</b><small>${field[2]}</small></span><em>${index<6?'已完善':'待完善'}</em>${icon('chevron',17)}</button>`).join('')}</div></div><div class="mobile-action two-buttons"><button class="ghost" data-action="toast">保存草稿</button><button class="primary" data-action="toast">提交审核</button></div>`;
}

export function renderMobilePage(id) {
  switch (id) {
    case 'student-home': return studentHome();
    case 'student-search': return studentSearch();
    case 'student-detail': return studentDetail();
    case 'student-booking': return booking();
    case 'student-paid': return paid();
    case 'student-orders': return studentOrders();
    case 'student-order': return orderDetail();
    case 'student-reschedule': return reschedule();
    case 'student-cancel': return cancelPage('book');
    case 'student-profile': return studentProfile();
    case 'senior-workbench': return workbench();
    case 'senior-consults': return consultList();
    case 'senior-order': return seniorOrder();
    case 'senior-reschedule': return reschedule();
    case 'senior-cancel': return cancelPage('consult');
    case 'senior-profile-status': return profileStatus();
    case 'senior-profile-form': return profileForm();
    default: return studentHome();
  }
}
