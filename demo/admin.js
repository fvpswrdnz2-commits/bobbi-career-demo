(function () {
  'use strict';

  const app = document.querySelector('#admin-app');
  const profiles = window.BOBBI_PROFILES || [];
  const state = { profileTab: 'all', orderTab: 'all', meetingTab: 'urgent', refundTab: 'all', settlementTab: 'pending', meetingSaved: false, reviewStatus: '已发布', modal: '' };
  const navItems = [
    ['dashboard', 'grid', '仪表盘'], ['seniors', 'users', '资料管理'], ['availability/344', 'calendar', '档期管理'],
    ['orders', 'receipt', '订单管理'], ['meetings', 'video', '会议待办'], ['refunds', 'refund', '退款与异常'],
    ['settlements', 'wallet', '结算管理'], ['analytics', 'chart', '经营数据'],
  ];
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    receipt: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h3"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>',
    refund: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v10M9 10h6M9 14h6"/>',
    wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M16 11h5v5h-5a2.5 2.5 0 0 1 0-5zM3 9h14"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="m15 18-6-6 6-6"/>', check: '<path d="m5 12 4 4L19 6"/>',
    alert: '<path d="M10.3 2.7 1.8 17.2A2 2 0 0 0 3.5 20h17a2 2 0 0 0 1.7-2.8L13.7 2.7a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    file: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/>',
    copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  };
  const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.chevron}</svg>`;
  const escapeHtml = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const route = () => location.hash.replace(/^#\/?/, '') || 'dashboard';
  const rootRoute = () => route().split('/')[0];
  const navigate = (path) => { location.hash = `#/${path}`; };
  const profileById = (id = '344') => profiles.find((item) => item.id === String(id)) || profiles[profiles.length - 1] || {};
  const status = (text, tone = 'neutral') => `<span class="status ${tone}">${escapeHtml(text)}</span>`;

  function sidebar() {
    const current = rootRoute();
    return `<aside class="sidebar"><div class="admin-brand"><span>B</span><b>熬夜波比</b></div><nav>${navItems.map(([path, iconName, label]) => `<button class="${current === path.split('/')[0] ? 'active' : ''}" data-nav="${path}">${icon(iconName)}<span>${label}</span></button>`).join('')}</nav><div class="sidebar-foot">超级管理员 · 波比</div></aside>`;
  }
  function header(title, subtitle) { return `<header class="topbar"><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><button class="top-bell" data-action="notice">${icon('bell')}<i></i></button><span class="admin-avatar">波</span><b>波比</b></header>`; }
  function shell(title, subtitle, content) { return `<div class="admin-shell">${sidebar()}<main class="main">${header(title, subtitle)}<div class="content">${content}</div></main><div class="toast" role="status"></div>${modal()}</div>`; }
  const pageHeading = (title, side = '') => `<div class="page-heading"><h2>${escapeHtml(title)}</h2>${side}</div>`;
  const task = (label, count, tone, path, iconName) => `<button class="task ${tone}" data-nav="${path}"><span>${icon(iconName)}</span><small>${escapeHtml(label)}</small><strong>${count}</strong>${tone === 'urgent' ? '<em>紧急</em>' : ''}</button>`;

  const demoOrders = [
    { id: 'DD260827103001', time: '8/27 10:30', profile: '#344 公募机销', user: '陈同学', duration: 60, amount: 240, order: '待咨询', meeting: state.meetingSaved ? '已录入' : '待录入' },
    { id: 'DD260827153001', time: '8/27 15:30', profile: '#347 AI产品', user: '周同学', duration: 30, amount: 120, order: '待咨询', meeting: '已录入' },
    { id: 'DD260828200001', time: '8/28 20:00', profile: '#349 复合泛体制', user: '林同学', duration: 60, amount: 240, order: '改期中', meeting: '待更新' },
    { id: 'DD260826190001', time: '8/26 19:00', profile: '#348 金租上岸', user: '许同学', duration: 30, amount: 120, order: '已完成', meeting: '已结束' },
  ];

  function dashboardPage() {
    const rows = demoOrders.slice(0, 3).map((order) => `<button class="table-row schedule-row" data-nav="order/${order.id}"><span>${order.time.split(' ')[1]}</span><span><b>${escapeHtml(order.profile)}</b><small>${escapeHtml(order.user)}</small></span><span>${order.duration}分钟</span><span>${status(order.order, order.order === '改期中' ? 'warning' : 'success')}</span><span>${status(order.meeting, order.meeting.includes('待') ? 'warning' : 'success')}</span><span class="link">查看 ${icon('chevron')}</span></button>`).join('');
    return shell('仪表盘', '把今天必须完成的运营任务放在最前面', `${pageHeading('今天需要处理的事', '<span>2026年8月27日 · 周四</span>')}<div class="task-grid">${task('待创建会议', 3, '', 'meetings', 'video')}${task('待审核资料', 1, '', 'seniors', 'users')}${task('改期待确认', 2, '', 'orders', 'calendar')}${task('待退款', 1, '', 'refunds', 'refund')}${task('2小时内缺会议', 1, 'urgent', 'meetings', 'alert')}</div><div class="dashboard-grid"><section class="panel"><div class="panel-head"><span><h3>今日咨询安排</h3><small>今天 3 场 · 未来 7 天 18 场</small></span><button data-nav="orders">查看全部</button></div><div class="table-head schedule-row"><span>时间</span><span>资料 / 预约人</span><span>时长</span><span>订单</span><span>会议</span><span>操作</span></div>${rows}</section><aside class="panel activity"><div class="panel-head"><h3>系统动态</h3></div><ol><li class="red"><time>09:12</time><b>2小时内仍缺会议信息</b><small>DD260827103001 · 10:30</small></li><li class="orange"><time>08:47</time><b>收到新的改期申请</b><small>等待对方确认候选时间</small></li><li class="green"><time>08:35</time><b>新订单支付成功</b><small>#347 AI产品 · 30分钟</small></li><li><time>08:22</time><b>资料更新已提交</b><small>投稿编号 #354</small></li></ol></aside></div>`);
  }

  function profileTableRows() {
    const visible = profiles.filter((profile, index) => state.profileTab === 'all' || (state.profileTab === 'published' && index !== 1) || (state.profileTab === 'paused' && index === 1));
    return visible.map((profile, index) => `<button class="table-row profile-admin-row" data-nav="senior/${profile.id}"><span><i class="mini-avatar">${escapeHtml(profile.nickname.slice(0, 1))}</i><b>#${profile.id} · ${escapeHtml(profile.nickname)}</b></span><span><b>${escapeHtml(profile.educationTags.slice(0, 3).join(' · '))}</b><small>${escapeHtml(profile.careerTags.slice(0, 2).join(' · '))}</small></span><span>¥${profile.price} / ${profile.duration}分钟</span><span>${profile.availability.times.length} 个</span><span>${status(index === 1 ? '暂停接单' : '已发布', index === 1 ? 'neutral' : 'success')}</span><span class="link">查看 ${icon('chevron')}</span></button>`).join('');
  }
  function seniorsPage() {
    const tabs = [['all', '全部 10'], ['review', '待审核 1'], ['published', '已发布 9'], ['paused', '暂停接单 1']];
    const review = `<button class="table-row profile-admin-row" data-nav="senior/355"><span><i class="mini-avatar">新</i><b>#355 · 待定昵称</b></span><span><b>硕士 · 国内985</b><small>银行总行 · 公司金融</small></span><span>待定价</span><span>待配置</span><span>${status('待审核', 'warning')}</span><span class="link">审核 ${icon('chevron')}</span></button>`;
    return shell('资料管理', '旧资料导入、新邀请审核和发布状态统一管理', `<div class="toolbar"><div class="tabs">${tabs.map(([key, label]) => `<button class="${state.profileTab === key ? 'active' : ''}" data-admin-tab="profile" data-value="${key}">${label}</button>`).join('')}</div><div><button class="secondary" data-action="invite">生成邀请链接</button><button class="primary" data-action="import">${icon('plus')} 导入旧资料</button></div></div><div class="filterbar"><label>${icon('search')}<input placeholder="搜索投稿编号、昵称或标签" /></label><button data-action="filter">学历</button><button data-action="filter">求职方向</button><button data-action="filter">发布状态</button></div><section class="panel table-panel"><div class="table-head profile-admin-row"><span>投稿编号 / 昵称</span><span>核心背景</span><span>价格</span><span>未来7天档期</span><span>状态</span><span>操作</span></div>${state.profileTab === 'review' ? review : profileTableRows()}</section>`);
  }

  function seniorPage(id) {
    const profile = profileById(id); const isNew = String(id) === '355'; const nickname = isNew ? '待定昵称' : profile.nickname; const sections = isNew ? [['基本信息', '昵称、头像和公开简介已填写'], ['教育背景', '国内985 · 硕士 · 金融学'], ['实习经历', '银行总行公司金融部、券商研究所'], ['求职情况', '银行、券商、央国企多方向投递'], ['最终 Offer', '银行总行 · 公司金融岗'], ['求职心得', '已填写 126 字'], ['擅长方向', '银行总行、公司金融、群面']] : [['基本信息', profile.headline], ['教育背景', profile.education], ['实习经历', profile.internships.join('、')], ['求职情况', profile.recruitment.map((item) => `${item.title}：${item.text}`).join('；')], ['最终 Offer', profile.offers.join('、')], ['求职心得', `已填写 ${profile.insights.join('').length} 字`], ['擅长方向', profile.consultTags.join('、')]];
    return shell('审核与编辑', '在同一份档案中控制公开字段和私密材料', `<div class="detail-toolbar"><button class="back" data-nav="seniors">${icon('arrow')} 返回资料列表</button><div><button class="secondary" data-action="save">保存修改</button>${isNew ? '<button class="danger" data-action="reject">退回修改</button><button class="primary" data-action="approve">审核通过并发布</button>' : '<button class="danger" data-action="pause">暂停接单</button><button class="primary" data-action="publish">更新发布</button>'}</div></div><div class="editor-grid"><section class="panel editor"><div class="profile-editor-head"><i class="large-avatar">${escapeHtml(nickname.slice(0, 1))}</i><span><h2>#${escapeHtml(id)} · ${escapeHtml(nickname)}</h2><p>${isNew ? '新增邀请提交' : '小红书旧资料导入'}</p></span>${status(isNew ? state.reviewStatus : '已发布', isNew && state.reviewStatus !== '已发布' ? 'warning' : 'success')}</div>${sections.map(([title, value]) => `<div class="editor-row"><span><b>${escapeHtml(title)}</b><small>${escapeHtml(value)}</small></span><label><input type="checkbox" checked /><i></i>公开</label><button data-action="edit">编辑</button></div>`).join('')}</section><aside class="panel review"><h3>发布设置</h3><label>投稿编号<input value="${escapeHtml(id)}" /></label><label>30分钟价格<input value="${isNew ? '120' : profile.price || 120}" /></label><label>发布状态<select><option>${isNew ? '待审核' : '已发布'}</option><option>暂停接单</option><option>下架</option></select></label><hr/><h3>证明材料</h3>${isNew ? `<button class="proof" data-action="preview">${icon('file')}<span><b>学历与Offer材料.pdf</b><small>仅超级管理员可见</small></span></button>` : '<p class="muted">旧资料按历史导入规则处理，无需补充证明材料。</p>'}<hr/><h3>审核备注</h3><textarea rows="5" placeholder="记录需要修改的内容"></textarea><button class="secondary block" data-nav="availability/${escapeHtml(id)}">管理可预约时间</button></aside></div>`);
  }

  function availabilityPage(id) {
    const profile = profileById(id); const days = ['周五 8/28', '周六 8/29', '周日 8/30', '周一 8/31', '周二 9/1', '周三 9/2', '周四 9/3']; const times = ['10:00', '14:00', '15:00', '19:00', '20:00', '21:00'];
    return shell('档期管理', '周期规则、例外日期和具体时间段统一维护', `<div class="toolbar"><button class="profile-picker" data-action="choose-profile"><i class="mini-avatar">${escapeHtml(profile.nickname?.slice(0, 1) || '公')}</i><b>#${escapeHtml(id)} · ${escapeHtml(profile.nickname || '公募机销')}</b>${icon('chevron')}</button><div><button class="secondary" data-action="exception">例外日期</button><button class="primary" data-action="new-rule">${icon('plus')} 新增周期规则</button></div></div><div class="availability-grid"><aside class="panel rules"><h3>周期档期规则</h3><button class="active"><b>工作日晚间</b><small>周一至周五 20:00—22:00</small></button><button><b>周末下午</b><small>周六、周日 15:00—20:00</small></button><div class="rule-note">预约页面只展示未来 7 天、距开始至少 6 小时的可售时间。</div></aside><section class="panel calendar-board"><div class="calendar-head">${days.map((day) => `<span>${day}</span>`).join('')}</div><div class="calendar-body">${days.map((_, dayIndex) => `<div>${times.map((time, timeIndex) => { const open = (dayIndex < 5 && timeIndex > 3) || (dayIndex > 0 && dayIndex < 3 && timeIndex > 1); return `<button class="slot ${open ? 'open' : ''}" data-slot-admin><b>${time}</b><small>${open ? '开放' : '关闭'}</small></button>`; }).join('')}</div>`).join('')}</div></section></div>`);
  }

  function ordersPage() {
    const tabs = [['all', '全部订单'], ['meeting', '待创建会议 3'], ['reschedule', '改期中 2'], ['refund', '退款中 1'], ['complete', '已完成 16']];
    return shell('订单管理', '查看支付、会议、改期、取消、退款和完成状态', `<div class="toolbar"><div class="tabs">${tabs.map(([key, label]) => `<button class="${state.orderTab === key ? 'active' : ''}" data-admin-tab="order" data-value="${key}">${label}</button>`).join('')}</div><button class="secondary" data-action="export">导出当前结果</button></div><div class="filterbar"><label>${icon('search')}<input placeholder="订单号、投稿编号、昵称或预约人" /></label><button data-action="filter">日期范围</button><button data-action="filter">订单状态</button><button data-action="filter">资料</button></div><section class="panel table-panel"><div class="table-head order-admin-row"><span>订单号</span><span>咨询时间</span><span>资料 / 预约人</span><span>时长 / 金额</span><span>订单状态</span><span>会议状态</span><span>操作</span></div>${demoOrders.map((order) => `<button class="table-row order-admin-row" data-nav="order/${order.id}"><span><b>${order.id}</b></span><span>${order.time}</span><span><b>${escapeHtml(order.profile)}</b><small>${escapeHtml(order.user)}</small></span><span>${order.duration}分钟 / ¥${order.amount}</span><span>${status(order.order, order.order === '改期中' ? 'warning' : 'success')}</span><span>${status(order.meeting, order.meeting.includes('待') ? 'warning' : 'neutral')}</span><span class="link">查看 ${icon('chevron')}</span></button>`).join('')}</section>`);
  }

  function orderPage(id) {
    const order = demoOrders.find((item) => item.id === id) || demoOrders[0]; const meetingReady = state.meetingSaved || order.meeting === '已录入';
    return shell('订单与会议', '处理会议信息、改期、取消、退款并保留操作记录', `<div class="detail-toolbar"><button class="back" data-nav="orders">${icon('arrow')} 返回订单列表</button><div>${status(meetingReady ? '会议信息已更新' : '待创建会议', meetingReady ? 'success' : 'warning')}<button class="secondary" data-action="more">更多操作</button></div></div><div class="order-detail-grid"><section class="panel order-main"><div class="order-title"><span><small>订单 ${order.id}</small><h2>${order.time} · ${order.duration}分钟</h2><p>${escapeHtml(order.profile)} → ${escapeHtml(order.user)}</p></span><strong>¥${order.amount}</strong></div><div class="facts"><span><small>支付状态</small><b>已支付</b></span><span><small>改期次数</small><b>预约方 0 / 对方 0</b></span><span><small>订单完成</small><b>约定结束时间</b></span><span><small>结算计算</small><b>80% · ¥${Math.round(order.amount * .8)}</b></span></div><section class="admin-section"><h3>已提交资料</h3><button class="proof" data-action="preview">${icon('file')}<span><b>${escapeHtml(order.user)}_求职简历.pdf</b><small>共 3 个咨询问题 · 付款后可查看</small></span></button></section><section class="admin-section"><h3>订单时间线</h3><ol class="timeline"><li><time>8/26 20:14</time><b>支付成功，预约已确认</b></li><li><time>8/26 20:14</time><b>生成待创建会议任务</b></li><li class="${meetingReady ? '' : 'pending'}"><time>${meetingReady ? '8/27 09:32' : '现在'}</time><b>${meetingReady ? '会议信息已更新并通知双方' : '等待波比创建腾讯会议'}</b></li></ol></section></section><aside class="panel meeting-editor"><h3>${meetingReady ? '会议信息' : '创建腾讯会议后录入'}</h3><button class="copy-time" data-action="copy-time">${icon('copy')} 复制订单时间</button><label>咨询时间<input value="2026-08-27 10:30—11:30" readonly /></label><label>会议号<input id="meeting-no" value="${meetingReady ? '789 456 123' : ''}" placeholder="输入腾讯会议号" /></label><label>入会密码<input value="${meetingReady ? '0827' : ''}" placeholder="选填" /></label><label>入会链接<input id="meeting-link" value="${meetingReady ? 'https://meeting.tencent.com/dm/example' : ''}" placeholder="粘贴腾讯会议链接" /></label><button class="primary block" data-action="meeting-save">保存并通知双方</button><p class="muted">保存后自动发送站内及订阅消息；临近开始的紧急变化同时发送短信。</p><hr/><button class="secondary block" data-action="reschedule">代处理改期</button><button class="danger block" data-action="cancel-refund">取消并发起退款</button></aside></div>`);
  }

  const meetingTask = (time, deadline, profile, user, tone = '') => `<button class="meeting-task ${tone}" data-nav="order/DD260827103001"><span><b>${time}</b><small>${deadline}</small></span><span><b>${profile}</b><small>${user} · 60分钟</small></span><em>处理 ${icon('chevron')}</em></button>`;
  function meetingsPage() {
    const tabs = [['urgent', '2小时内缺会议', 1], ['create', '待创建', 3], ['update', '待更新', 2], ['cancel', '待取消', 1]];
    return shell('会议待办', '按紧急程度处理待创建、待更新和待取消的会议信息', `<div class="meeting-tabs">${tabs.map(([key, label, count]) => `<button class="${state.meetingTab === key ? 'active' : ''} ${key === 'urgent' ? 'urgent' : ''}" data-admin-tab="meeting" data-value="${key}">${icon(key === 'urgent' ? 'alert' : 'video')}<span><small>${label}</small><strong>${count}</strong></span></button>`).join('')}</div><div class="meeting-board"><section class="panel"><h3>紧急处理</h3>${meetingTask('今天 10:30', '还有 1小时18分', '#344 公募机销', '陈同学', 'urgent')}</section><section class="panel"><h3>今天待创建</h3>${meetingTask('今天 15:30', '还有 6小时18分', '#347 AI产品', '周同学')}${meetingTask('今天 20:00', '还有 10小时48分', '#353 PMO转行', '郑同学')}</section><section class="panel"><h3>改期后待更新</h3>${meetingTask('明天 20:00', '新时间已确认', '#349 复合泛体制', '林同学', 'purple')}</section></div>`);
  }

  function refundsPage() {
    const tabs = [['all', '全部'], ['processing', '退款处理中 1'], ['abnormal', '异常待处理 1'], ['done', '处理完成 8']];
    return shell('退款与异常', '跟踪取消退款、支付退款和异常订单，不设置咨询反馈流程', `<div class="toolbar"><div class="tabs">${tabs.map(([key, label]) => `<button class="${state.refundTab === key ? 'active' : ''}" data-admin-tab="refund" data-value="${key}">${label}</button>`).join('')}</div></div><div class="case-grid"><section class="panel case-list"><button class="active"><span>${status('退款处理中', 'warning')}<b>DD260827103002</b><small>预约方取消 · 应退 ¥108</small></span><em>09:12</em></button><button><span>${status('异常待处理', 'danger')}<b>DD260826190002</b><small>微信退款回调超时</small></span><em>昨天</em></button></section><aside class="panel case-detail"><h3>退款详情</h3><div class="case-facts"><span><small>订单</small><b>DD260827103002</b></span><span><small>订单实付</small><b>¥120</b></span><span><small>取消费用</small><b>¥12</b></span><span><small>应退金额</small><b>¥108</b></span></div><h4>处理进度</h4><ol class="timeline"><li><time>09:10</time><b>预约取消，档期已释放</b></li><li><time>09:11</time><b>已向微信支付发起退款</b></li><li class="pending"><time>现在</time><b>等待微信支付返回最终结果</b></li></ol><div class="case-actions"><button class="secondary" data-action="refund-query">查询退款状态</button><button class="primary" data-action="refund-retry">重新发起退款</button></div></aside></div>`);
  }

  function settlementsPage() {
    const tabs = [['pending', '待结算'], ['paying', '结算中'], ['done', '已结算'], ['error', '结算异常']];
    const rows = [['344', '公募机销', 4, 960], ['347', 'AI产品', 3, 720], ['349', '复合泛体制', 2, 480]].map(([id, name, count, income]) => `<div class="table-row settlement-row"><span><input type="checkbox" /></span><span><i class="mini-avatar">${name.slice(0, 1)}</i><b>#${id} · ${name}</b></span><span>${count} 笔</span><span>¥${income}</span><span><b>¥${income * .8}</b></span><span>8/26 20:00</span><span><button class="link" data-action="settlement-detail">查看明细</button></span></div>`).join('');
    return shell('结算管理', '系统自动算账，波比线下付款后在这里登记结果', `<div class="finance-grid"><span><small>待结算订单</small><strong>9</strong></span><span><small>前辈应结金额</small><strong>¥1,920</strong></span><span><small>本月已登记</small><strong>¥5,760</strong></span></div><div class="toolbar"><div class="tabs">${tabs.map(([key, label]) => `<button class="${state.settlementTab === key ? 'active' : ''}" data-admin-tab="settlement" data-value="${key}">${label}</button>`).join('')}</div><div><button class="secondary" data-action="export">导出明细</button><button class="primary" data-action="settlement-create">生成结算批次</button></div></div><section class="panel table-panel"><div class="table-head settlement-row"><span></span><span>资料</span><span>合格订单</span><span>订单实付</span><span>前辈应结 80%</span><span>最近完成</span><span>操作</span></div>${rows}</section>`);
  }

  function analyticsPage() {
    const metrics = [['注册用户', '3,286', '本周 +126'], ['搜索用户', '1,842', '56.1%'], ['支付用户', '218', '11.8%'], ['复购用户', '46', '21.1%']];
    const funnel = [['搜索', 1842, 100], ['查看资料详情', 926, 50], ['进入预约', 386, 21], ['支付成功', 218, 12], ['完成咨询', 193, 10]];
    return shell('经营数据', '第一版聚焦真实经营链路，不做渠道归因', `<div class="metric-grid">${metrics.map(([label, value, note]) => `<span><small>${label}</small><strong>${value}</strong><em>${note}</em></span>`).join('')}</div><div class="analytics-grid"><section class="panel analytics-panel"><div class="panel-head"><h3>搜索到预约转化</h3><button data-action="range">近 7 天</button></div>${funnel.map(([label, value, width]) => `<div class="funnel"><span><b>${label}</b><em>${value}</em></span><i><b style="width:${width}%"></b></i></div>`).join('')}</section><section class="panel analytics-panel"><div class="panel-head"><h3>智能搜索模式</h3><small>搜索 → 详情点击率</small></div><div class="mode-row"><b>投稿编号直达</b><span>42%</span><em>68%</em></div><div class="mode-row"><b>标签组合搜索</b><span>36%</span><em>49%</em></div><div class="mode-row"><b>一句话需求搜索</b><span>22%</span><em>44%</em></div><div class="zero"><span>零结果率</span><b>4.8%</b><small>目标保持在 5% 以下</small></div></section></div><section class="panel keyword-panel"><div class="panel-head"><h3>近期高频需求</h3><button data-action="export">导出</button></div><div><span>银行总行 · 秋招规划</span><b>126 次</b><em>预约转化 18.3%</em></div><div><span>公募基金 · 机构销售</span><b>89 次</b><em>预约转化 14.6%</em></div><div><span>互联网产品 · AI产品</span><b>76 次</b><em>预约转化 12.9%</em></div></section>`);
  }

  function modal() {
    if (!state.modal) return '';
    if (state.modal === 'invite') return `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-label="邀请填写资料"><button class="modal-close" data-action="close-modal">×</button><h2>邀请填写资料</h2><p>链接仅用于受邀填写，提交后进入波比审核。</p><label>邀请链接<input value="https://bobbi.example.cn/invite/8F4K2" readonly /></label><button class="primary block" data-action="copy-invite">${icon('copy')} 复制邀请链接</button></section></div>`;
    if (state.modal === 'import') return `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-label="导入旧资料"><button class="modal-close" data-action="close-modal">×</button><h2>导入旧资料</h2><p>旧资料不要求补充证明材料，保存后可继续完善并发布。</p><label>投稿编号<input placeholder="例如 356" /></label><label>公开昵称<input placeholder="输入昵称" /></label><label>原帖内容<textarea rows="5" placeholder="粘贴小红书投稿内容"></textarea></label><button class="primary block" data-action="import-save">保存并继续编辑</button></section></div>`;
    if (state.modal === 'settlement') return `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-label="生成结算批次"><button class="modal-close" data-action="close-modal">×</button><h2>生成结算批次</h2><p>已选择 3 份资料，共 9 笔订单，前辈应结金额 ¥1,920。</p><label>结算周期<input value="2026-08-20 至 2026-08-26" /></label><label>备注<textarea rows="4" placeholder="选填"></textarea></label><button class="primary block" data-action="settlement-confirm">确认生成</button></section></div>`;
    return '';
  }

  function render() {
    const [page, id] = route().split('/');
    if (page === 'dashboard') app.innerHTML = dashboardPage(); else if (page === 'seniors') app.innerHTML = seniorsPage(); else if (page === 'senior') app.innerHTML = seniorPage(id); else if (page === 'availability') app.innerHTML = availabilityPage(id); else if (page === 'orders') app.innerHTML = ordersPage(); else if (page === 'order') app.innerHTML = orderPage(id); else if (page === 'meetings') app.innerHTML = meetingsPage(); else if (page === 'refunds') app.innerHTML = refundsPage(); else if (page === 'settlements') app.innerHTML = settlementsPage(); else if (page === 'analytics') app.innerHTML = analyticsPage(); else navigate('dashboard');
    document.title = `${app.querySelector('.topbar h1')?.textContent || '运营后台'} · 熬夜波比`;
  }
  function showToast(message) { const toast = app.querySelector('.toast'); if (!toast) return; toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800); }

  document.addEventListener('click', async (event) => {
    const nav = event.target.closest('[data-nav]'); if (nav) { navigate(nav.dataset.nav); return; }
    const tab = event.target.closest('[data-admin-tab]'); if (tab) { const map = { profile: 'profileTab', order: 'orderTab', meeting: 'meetingTab', refund: 'refundTab', settlement: 'settlementTab' }; state[map[tab.dataset.adminTab]] = tab.dataset.value; render(); return; }
    const slot = event.target.closest('[data-slot-admin]'); if (slot) { slot.classList.toggle('open'); slot.querySelector('small').textContent = slot.classList.contains('open') ? '开放' : '关闭'; return; }
    const action = event.target.closest('[data-action]'); if (!action) return; const name = action.dataset.action;
    if (name === 'close-modal' && event.target.closest('.modal') && !event.target.closest('.modal-close')) return;
    if (name === 'close-modal') { state.modal = ''; render(); return; }
    if (name === 'invite' || name === 'import') { state.modal = name; render(); return; }
    if (name === 'settlement-create') { state.modal = 'settlement'; render(); return; }
    if (name === 'meeting-save') { const number = app.querySelector('#meeting-no')?.value.trim(); const link = app.querySelector('#meeting-link')?.value.trim(); if (!number || !link) { showToast('请填写会议号和入会链接'); return; } state.meetingSaved = true; render(); showToast('会议信息已更新，双方已收到通知'); return; }
    if (name === 'approve') { state.reviewStatus = '已发布'; render(); showToast('审核通过，资料已发布'); return; }
    if (name === 'copy-invite') { try { await navigator.clipboard?.writeText('https://bobbi.example.cn/invite/8F4K2'); } catch (_) {} state.modal = ''; render(); showToast('邀请链接已复制'); return; }
    if (name === 'import-save') { state.modal = ''; render(); showToast('旧资料已保存'); return; }
    if (name === 'settlement-confirm') { state.modal = ''; state.settlementTab = 'paying'; render(); showToast('结算批次已生成'); return; }
    const messages = { notice: '暂无新的未读通知', filter: '筛选条件已打开', export: '文件已生成', save: '修改已保存', reject: '已退回修改', pause: '已暂停接单', publish: '资料已更新发布', edit: '字段编辑已打开', preview: '材料预览已打开', 'choose-profile': '资料选择已打开', exception: '例外日期设置已打开', 'new-rule': '周期规则已新增', more: '订单操作已展开', 'copy-time': '订单时间已复制', reschedule: '改期处理已打开', 'cancel-refund': '取消与退款处理已打开', 'refund-query': '已查询最新退款状态', 'refund-retry': '已重新发起退款', 'settlement-detail': '结算明细已打开', range: '时间范围已切换' };
    showToast(messages[name] || '操作已完成');
  });

  window.BOBBI_ADMIN_TEST = { pages: { dashboardPage, seniorsPage, seniorPage, availabilityPage, ordersPage, orderPage, meetingsPage, refundsPage, settlementsPage, analyticsPage }, setState(next) { Object.assign(state, next); }, routes: ['dashboard', 'seniors', 'senior/344', 'availability/344', 'orders', 'order/DD260827103001', 'meetings', 'refunds', 'settlements', 'analytics'] };
  window.addEventListener('hashchange', render);
  render();
})();
