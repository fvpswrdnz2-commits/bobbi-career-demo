import { icon } from './icons.js';
import { profiles } from './data.js';
import { getSelectedProfile } from './mobile-pages.js';

const status = (text, tone = 'neutral') => `<span class="status status-${tone}">${text}</span>`;
const adminItems = [
  ['admin-dashboard','dashboard','仪表盘'],['admin-seniors','users','前辈管理'],['admin-availability','calendarRange','档期管理'],
  ['admin-orders','receipt','订单管理'],['admin-meetings','clipboard','会议待办'],['admin-refunds','support','退款与异常'],
  ['admin-settlements','money','结算管理'],['admin-users','chart','用户数据']
];

function sidebar(active) {
  return `<aside class="admin-sidebar">
    <div class="admin-brand"><span class="brand-mark">B</span><b>熬夜波比</b></div>
    <nav>${adminItems.map(([id, iconName, label]) => `<button data-nav="${id}" class="${active===id?'active':''}">${icon(iconName,20)}<span>${label}</span></button>`).join('')}</nav>
    <div class="admin-sidebar-foot">${icon('shield',18)}<span>仅超级管理员</span></div>
  </aside>`;
}

function top(title, subtitle = '') {
  return `<header class="admin-top"><button class="admin-menu">${icon('menu',20)}</button><div><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div><div class="admin-user">${icon('bell',20)}<span class="avatar small-avatar">波</span><b>波比</b></div></header>`;
}

function shell(active, title, content, subtitle = '') {
  return `<div class="admin-app">${sidebar(active)}<main class="admin-main">${top(title, subtitle)}<div class="admin-content">${content}</div></main></div>`;
}

const task = (iconName, label, count, tone='', nav='') => `<button class="task-tile ${tone}" ${nav?`data-nav="${nav}"`:''}><span>${icon(iconName,22)}</span><div><small>${label}</small><strong>${count}</strong></div>${tone==='urgent'?'<em>紧急</em>':''}</button>`;

function dashboard() {
  const content = `<section class="admin-heading"><h2>今天需要处理的事</h2><span>2026年8月27日 · 周四</span></section>
    <div class="task-rail">
      ${task('clipboard','待录入会议',6,'','admin-meetings')}${task('users','待审核前辈',3,'','admin-seniors')}${task('calendarClock','改期待确认',2,'')}${task('wallet','待结算',12,'','admin-settlements')}${task('alert','2小时内缺会议',1,'urgent','admin-meetings')}
    </div>
    <div class="dashboard-grid"><section class="table-section"><div class="table-toolbar"><div><h3>今日咨询安排</h3><span>共 8 场</span></div><div class="admin-filters"><button>全部状态 ${icon('chevron',14)}</button><button>全部前辈 ${icon('chevron',14)}</button><label>${icon('search',16)}<input placeholder="搜索学生 / 前辈 / 订单号"></label></div></div>
      ${scheduleTable()}
    </section>${activityRail()}</div>`;
  return shell('admin-dashboard','仪表盘',content,'把今天必须完成的任务放在最前面');
}

function scheduleTable() {
  const rows = [
    ['09:00','张晓','李同学','60分钟','已支付','已录入','—'],
    ['10:30','王思思','陈同学','60分钟','已支付','待录入','录入会议'],
    ['13:30','刘子墨','赵同学','60分钟','已支付','已录入','—'],
    ['15:00','林小雨','周同学','60分钟','待支付','—','催付'],
    ['16:30','陈一航','吴同学','60分钟','已支付','已录入','—'],
    ['18:00','董思琪','孙同学','60分钟','已支付','已录入','—']
  ];
  return `<div class="admin-table"><div class="table-head"><span>时间</span><span>前辈</span><span>学生</span><span>时长</span><span>订单状态</span><span>会议信息</span><span>操作</span></div>${rows.map((r,i)=>`<button class="table-row ${i===1?'highlight':''}" data-nav="admin-order-detail"><span>${r[0]}</span><span><b>${r[1]}</b><small>#${340+i}</small></span><span>${r[2]}</span><span>${r[3]}</span><span>${status(r[4],r[4]==='已支付'?'success':'warning')}</span><span>${r[5]}</span><span class="table-action">${r[6]}</span></button>`).join('')}</div>`;
}

function activityRail() {
  return `<aside class="activity-rail"><div><h3>系统动态</h3><button>查看更多</button></div><ol>
    <li class="urgent"><time>09:12</time><b>2小时内将缺少会议</b><small>#340 · 11:30</small><button data-nav="admin-meetings">立即处理</button></li>
    <li><time>08:47</time><b>新增改期待确认</b><small>学生：刘同学</small></li>
    <li class="green"><time>08:35</time><b>新支付订单</b><small>#DD25052309001</small></li>
    <li><time>08:22</time><b>前辈审核通过</b><small>投稿编号 #518</small></li>
  </ol></aside>`;
}

function seniors() {
  const content = `<div class="admin-actions"><div class="admin-tabs"><button class="active">全部 ${profiles.length}</button><button>待审核 0</button><button>已发布 ${profiles.length}</button><button>暂停接单 0</button></div><div><button class="secondary-button">生成邀请链接</button><button class="primary-button" data-nav="admin-senior-detail">${icon('plus',16)} 导入历史资料</button></div></div>
    <div class="table-toolbar simple"><div class="admin-filters"><label>${icon('search',16)}<input placeholder="搜索投稿编号、昵称或标签"></label><button>${icon('filter',15)} 学历</button><button>求职方向</button><button>发布状态</button></div></div>
    <div class="management-table"><div class="mgmt-head"><span>投稿编号 / 前辈</span><span>核心背景</span><span>价格</span><span>未来7天档期</span><span>状态</span><span>最近更新</span><span>操作</span></div>
      ${profiles.map(profile => `<button class="mgmt-row" data-nav="admin-senior-detail" data-profile-id="${profile.id}"><span><i class="avatar small-avatar">${profile.nickname.slice(0,1)}</i><b>#${profile.id} · ${profile.nickname}</b></span><span>${profile.educationTags.slice(0,2).join(' · ')} · ${profile.careerTags[0]}</span><span>¥${profile.price}</span><span>${profile.availability.times.length}个</span><span>${status('已发布','success')}</span><span>今天 09:20</span><span class="table-action">查看 ${icon('chevron',14)}</span></button>`).join('')}
    </div>`;
  return shell('admin-seniors','资料管理',content,'历史资料导入、邀请填写、审核和发布状态统一管理');
}

function seniorDetail() {
  const profile = getSelectedProfile();
  const content = `<div class="detail-toolbar"><button class="back-link" data-nav="admin-seniors">${icon('back',17)} 返回前辈列表</button><div><button class="secondary-button" data-action="toast">保存草稿</button><button class="danger-outline" data-action="toast">驳回</button><button class="primary-button" data-action="toast">审核通过</button></div></div>
    <div class="admin-detail-grid"><section class="editor-panel">
      <div class="profile-editor-head"><span class="avatar avatar-lg">${profile.nickname.slice(0,1)}</span><div><h2>#${profile.id} · ${profile.nickname}</h2><p>历史公开投稿导入 · 已发布</p></div>${status('已发布','success')}</div>
      ${editorSection('基本信息','昵称、头像和公开背景已填写',true)}
      ${editorSection('教育经历',profile.education,true)}
      ${editorSection('实习经历',profile.internships.join('、'),true)}
      ${editorSection('秋招情况',`${profile.recruitment.length} 类求职流程已录入`,true)}
      ${editorSection('最终去向',profile.offers.join('、'),true)}
      ${editorSection('秋招心得',`已填写 ${profile.insights.join('').length} 字`,true)}
      ${editorSection('擅长方向',profile.consultTags.join('、'),true)}
    </section><aside class="review-panel">
      <section><h3>发布设置</h3><label>投稿编号<input value="${profile.id}"></label><label>30分钟价格<input value="${profile.price}"></label><label>发布状态<select><option>已发布</option><option>暂停接单</option></select></label></section>
      <section><h3>证明材料</h3><button class="proof-file" data-action="toast">${icon('fileCheck',21)}<span><b>历史公开投稿免补材料</b><small>新增邀请资料需上传，且仅超级管理员可见</small></span>${icon('eye',17)}</button><p class="privacy-line">${icon('shield',15)} 不强制逐项核验，不向预约方展示</p></section>
      <section><h3>审核备注</h3><textarea rows="5" placeholder="记录需要前辈修改的内容"></textarea></section>
    </aside></div>`;
  return shell('admin-seniors','审核与编辑',content,'在同一份档案中控制公开字段和私密材料');
}

function editorSection(title, value, visible) {
  return `<div class="editor-section"><div><h3>${title}</h3><p>${value}</p></div><label class="visibility-toggle"><input type="checkbox" ${visible?'checked':''}><span></span>公开</label><button>${icon('pencil',17)} 编辑</button></div>`;
}

function availability() {
  const days = ['周一 8/31','周二 9/1','周三 9/2','周四 9/3','周五 9/4','周六 9/5','周日 9/6'];
  const times = ['10:00','14:00','15:00','19:00','20:00','21:00','22:00'];
  const content = `<div class="admin-actions"><div class="profile-picker"><span class="avatar small-avatar">Z</span><b>#340 · Z同学</b>${icon('chevron',15)}</div><div><button class="secondary-button">例外日期</button><button class="primary-button">${icon('plus',16)} 新增周期规则</button></div></div>
    <div class="availability-layout"><aside class="rule-list"><h3>周期档期规则</h3><button class="active"><b>工作日晚间</b><span>周一至周五 19:00–22:00</span></button><button><b>周末下午</b><span>周六、周日 15:00–20:00</span></button><div class="rule-note">${icon('calendarClock',18)}<p>学生只会看到未来7天、距开始至少6小时的档期。</p></div></aside>
    <section class="week-calendar"><div class="week-head">${days.map(d=>`<span>${d}</span>`).join('')}</div><div class="week-body">${days.map((_,di)=>`<div>${times.map((t,ti)=>{const active=(di>3&&ti>1)||(di<5&&ti>3);return `<button class="slot ${active?'open':''}" data-select="slot">${t}${active?'<small>开放</small>':''}</button>`}).join('')}</div>`).join('')}</div></section></div>`;
  return shell('admin-availability','档期管理',content,'周期规则、例外日期和具体时间段');
}

function orders() {
  const content = `<div class="admin-actions"><div class="admin-tabs"><button class="active">全部订单</button><button>待录入会议 6</button><button>改期中 2</button><button>退款中 1</button><button>待结算 12</button></div><button class="secondary-button">导出当前结果</button></div>
    <div class="table-toolbar simple"><div class="admin-filters"><label>${icon('search',16)}<input placeholder="订单号、投稿编号、前辈或学生"></label><button>日期范围</button><button>订单状态</button><button>前辈</button></div></div>
    <div class="orders-table"><div class="orders-head"><span>订单号</span><span>咨询时间</span><span>前辈 / 学生</span><span>时长 / 金额</span><span>订单状态</span><span>会议状态</span><span>操作</span></div>
      ${[
        ['DD25052309001','8/27 10:30','#340 Z同学 / 陈同学','60分钟 / ¥240','待咨询','待录入'],
        ['DD25052313001','8/27 13:30','#215 L同学 / 赵同学','60分钟 / ¥240','待咨询','已录入'],
        ['DD25052415001','8/28 15:00','#512 W同学 / 周同学','30分钟 / ¥150','改期中','待更新'],
        ['DD25052218001','8/26 18:00','#344 公募机销 / 孙同学','60分钟 / ¥240','已完成','已结束']
      ].map((r,i)=>`<button class="orders-row" data-nav="admin-order-detail">${r.map((v,j)=>`<span>${j===4?status(v,i===2?'warning':'success'):j===5?status(v,v==='已录入'?'success':'warning'):v}</span>`).join('')}<span class="table-action">查看 ${icon('chevron',14)}</span></button>`).join('')}
    </div>`;
  return shell('admin-orders','订单管理',content,'从支付、会议到完成和结算的完整订单时间线');
}

function orderDetail() {
  const content = `<div class="detail-toolbar"><button class="back-link" data-nav="admin-orders">${icon('back',17)} 返回订单列表</button><div>${status('待录入会议','warning')}<button class="secondary-button" data-action="toast">更多操作</button></div></div>
    <div class="order-detail-layout"><section class="order-primary">
      <div class="order-title"><div><small>订单 DD25052309001</small><h2>8月27日 周四 10:30 · 60分钟</h2><p>#340 Z同学　→　陈同学</p></div><strong>¥240</strong></div>
      <div class="order-facts"><span><small>支付状态</small><b>已支付</b></span><span><small>改期次数</small><b>双方均为 0</b></span><span><small>前辈应结</small><b>¥192</b></span><span><small>订单完成</small><b>8/27 11:30</b></span></div>
      <section class="admin-section"><h3>学生资料</h3><button class="proof-file" data-action="toast">${icon('file',20)}<span><b>陈同学_简历.pdf</b><small>共4个咨询问题 · 前辈已查看</small></span>${icon('eye',17)}</button></section>
      <section class="admin-section"><h3>订单时间线</h3><ol class="admin-timeline"><li><time>8/26 20:14</time><b>支付成功，订单自动接单</b></li><li><time>8/26 20:14</time><b>生成待录入会议任务</b></li><li class="pending"><time>现在</time><b>等待波比录入腾讯会议</b></li></ol></section>
    </section><aside class="meeting-editor"><h3>录入腾讯会议</h3><label>咨询时间<input value="2026-08-27 10:30–11:30" readonly></label><label>会议号<input placeholder="输入腾讯会议号"></label><label>入会密码<input placeholder="选填"></label><label>入会链接<input placeholder="https://meeting.tencent.com/..."></label><button class="primary-button block" data-action="meeting-save">保存并通知双方</button><p>${icon('bell',15)} 保存后学生和前辈会收到站内及订阅消息。</p><hr><button class="secondary-button block" data-action="toast">代处理改期</button><button class="danger-outline block" data-action="toast">取消并退款</button></aside></div>`;
  return shell('admin-orders','订单与会议',content,'录入会议信息并保留完整操作时间线');
}

function meetings() {
  const content = `<div class="meeting-summary"><button class="urgent active">${icon('alert',21)}<span><b>2小时内缺会议</b><strong>1</strong></span></button><button>${icon('clipboard',21)}<span><b>待录入</b><strong>6</strong></span></button><button>${icon('rotate',21)}<span><b>待更新</b><strong>2</strong></span></button><button>${icon('close',21)}<span><b>待取消</b><strong>1</strong></span></button></div>
    <div class="meeting-board"><section><h3>紧急处理</h3>${meetingTask('11:30','还有 1小时42分','#340 Z同学','陈同学','urgent')}</section><section><h3>今天待录入</h3>${meetingTask('13:30','还有 3小时42分','#215 L同学','赵同学','')}${meetingTask('16:30','还有 6小时42分','#512 W同学','吴同学','')}</section><section><h3>改期后待更新</h3>${meetingTask('明天 15:00','已确认新时间','#340 Z同学','刘同学','purple')}</section></div>`;
  return shell('admin-meetings','会议待办',content,'按紧急程度处理待录入、待更新和待取消会议');
}

function meetingTask(time, meta, senior, student, tone) {
  return `<button class="meeting-task ${tone}" data-nav="admin-order-detail"><div><time>${time}</time><small>${meta}</small></div><span><b>${senior}</b><small>${student} · 60分钟</small></span><em>录入会议 ${icon('chevron',14)}</em></button>`;
}

function refunds() {
  const content = `<div class="admin-actions"><div class="admin-tabs"><button class="active">全部</button><button>退款处理中 1</button><button>异常待处理 1</button><button>处理完成 18</button></div></div>
    <div class="refund-layout"><section class="refund-list"><button class="refund-row active"><span>${status('退款处理中','purple')}<b>DD25052110002</b><small>预约方取消，扣除10%</small></span><span><b>周同学</b><small>预计退款 ¥216</small></span></button><button class="refund-row"><span>${status('异常待处理','warning')}<b>DD25052218001</b><small>会议链接缺失</small></span><span><b>孙同学</b><small>开始前 1小时</small></span></button></section>
    <aside class="case-panel"><h3>退款详情</h3><div class="case-meta"><span>订单<b>DD25052110002</b></span><span>咨询对象<b>#344 公募机销</b></span><span>预约人<b>周同学</b></span><span>金额<b>¥240</b></span></div><h4>系统计算</h4><p>取消费用 ¥24，预计原路退款 ¥216；退款状态以微信支付结果为准。</p><h4>处理记录</h4><textarea rows="5" placeholder="记录退款结果或异常处理过程"></textarea><div class="case-actions"><button class="secondary-button" data-action="toast">标记异常</button><button class="primary-button" data-action="toast">确认退款结果</button></div></aside></div>`;
  return shell('admin-refunds','退款与异常',content,'跟踪取消退款和履约异常，不设置独立售后申请流程');
}

function settlements() {
  const content = `<div class="finance-summary"><span><small>待结算订单</small><strong>12</strong></span><span><small>待结算金额</small><strong>¥2,304</strong></span><span><small>本周已结算</small><strong>¥5,760</strong></span></div>
    <div class="admin-actions"><div class="admin-tabs"><button class="active">待结算</button><button>结算中</button><button>已结算</button><button>结算异常</button></div><div><button class="secondary-button">导出明细</button><button class="primary-button" data-action="toast">生成结算批次</button></div></div>
    <div class="settlement-admin-table"><div class="settle-head"><span></span><span>前辈</span><span>合格订单</span><span>咨询净收入</span><span>前辈应结80%</span><span>最近完成</span><span>操作</span></div>${[['Z','Z同学','4','¥960','¥768','8/26 18:00'],['L','L同学','3','¥720','¥576','8/26 15:00'],['W','W同学','2','¥600','¥480','8/25 20:00']].map(r=>`<div class="settle-row"><span><input type="checkbox"></span><span><i class="avatar small-avatar">${r[0]}</i><b>${r[1]}</b></span>${r.slice(2).map(v=>`<span>${v}</span>`).join('')}<span><button class="table-action" data-action="toast">查看明细</button></span></div>`).join('')}</div>`;
  return shell('admin-settlements','结算管理',content,'系统按最终净收入计算，波比线下付款后登记');
}

function usersData() {
  const content = `<div class="metric-strip"><span><small>注册用户</small><strong>3,286</strong><em>本周 +126</em></span><span><small>搜索用户</small><strong>1,842</strong><em>56.1%</em></span><span><small>支付用户</small><strong>218</strong><em>11.8%</em></span><span><small>复购用户</small><strong>46</strong><em>21.1%</em></span></div>
    <div class="data-grid"><section class="funnel-panel"><div class="panel-title"><h3>搜索到预约转化</h3><button>近7天 ${icon('chevron',14)}</button></div>${[['搜索',1842,100],['点击前辈详情',926,50],['进入预约',386,21],['支付成功',218,12],['完成咨询',193,10]].map(([l,v,w])=>`<div class="funnel-row"><span>${l}<b>${v}</b></span><i><em style="width:${w}%"></em></i></div>`).join('')}</section>
    <section class="search-mode-panel"><div class="panel-title"><h3>三种搜索模式</h3><span>搜索→详情点击率</span></div>${[['投稿编号直达','42%','68%'],['标签组合筛选','36%','49%'],['一句话搜索','22%','44%']].map(r=>`<div class="mode-row"><b>${r[0]}</b><span>${r[1]}</span><strong>${r[2]}</strong></div>`).join('')}<div class="zero-result"><span>零结果率</span><strong>4.8%</strong><small>目标保持在 5% 以下</small></div></section></div>
    <section class="query-table"><div class="panel-title"><h3>近期高频需求</h3><button>查看全部</button></div><div><span>银行总行 · 周末可约</span><b>126次</b><em>预约转化 18.3%</em></div><div><span>券商研究 · 群面</span><b>89次</b><em>预约转化 14.6%</em></div><div><span>互联网产品 · 暑期</span><b>76次</b><em>预约转化 12.9%</em></div></section>`;
  return shell('admin-users','用户数据',content,'第一版只看真实经营链路，不做渠道归因');
}

export function renderAdminPage(id) {
  switch (id) {
    case 'admin-dashboard': return dashboard();
    case 'admin-seniors': return seniors();
    case 'admin-senior-detail': return seniorDetail();
    case 'admin-availability': return availability();
    case 'admin-orders': return orders();
    case 'admin-order-detail': return orderDetail();
    case 'admin-meetings': return meetings();
    case 'admin-refunds': return refunds();
    case 'admin-settlements': return settlements();
    case 'admin-users': return usersData();
    default: return dashboard();
  }
}
