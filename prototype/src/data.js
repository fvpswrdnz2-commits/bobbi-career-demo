export const profiles = globalThis.window?.BOBBI_PROFILES || [];

export const pageGroups = [
  { id: 'student', label: '预约咨询', icon: 'smartphone', pages: [
    { id: 'student-home', label: '首页', goal: '按编号、方向或一句话需求找到合适的学长学姐。', actions: ['搜索编号或需求', '浏览统一排序结果', '进入我的预约'], next: '搜索结果或个人详情' },
    { id: 'student-search', label: '智能搜索', goal: '展示匹配结果，并解释为什么推荐。', actions: ['输入自然语言需求', '使用快捷方向', '查看匹配理由'], next: '个人详情' },
    { id: 'student-detail', label: '个人详情', goal: '在预约前了解公开背景、经历、心得与未来档期。', actions: ['查看投稿信息', '选择未来7天档期'], next: '确认预约' },
    { id: 'student-booking', label: '确认预约', goal: '一次提交时间、时长、简历和咨询问题。', actions: ['选择固定时长套餐', '上传必填简历', '填写必填问题'], next: '支付结果' },
    { id: 'student-paid', label: '支付结果', goal: '明确预约成功，以及接下来等待会议信息更新。', actions: ['查看订单', '返回首页'], next: '订单详情' },
    { id: 'student-orders', label: '我的预约', goal: '按待进行、已完成和已取消管理预约。', actions: ['切换状态', '进入订单详情'], next: '订单详情' },
    { id: 'student-order', label: '订单详情', goal: '集中展示时间、材料、会议、改期额度和状态时间线。', actions: ['复制会议号', '申请改期', '取消预约'], next: '改期或取消' },
    { id: 'student-reschedule', label: '申请改期', goal: '在原咨询前2小时完成确认，并选择1至3个候选时间。', actions: ['选择候选时间', '查看改期额度'], next: '返回订单详情' },
    { id: 'student-cancel', label: '取消预约', goal: '清楚说明取消扣10%及预计退款。', actions: ['查看取消规则', '确认取消'], next: '已取消订单' },
    { id: 'student-profile', label: '我的', goal: '承载身份切换、通知、规则和联系波比。', actions: ['切换咨询身份', '复制波比微信号', '查看规则'], next: '咨询工作台或帮助' }
  ] },
  { id: 'senior', label: '提供咨询', icon: 'briefcase', pages: [
    { id: 'senior-workbench', label: '咨询工作台', goal: '突出下一场咨询、待办和资料状态。', actions: ['查看已提交材料', '处理改期', '维护资料'], next: '咨询详情或资料状态' },
    { id: 'senior-consults', label: '咨询列表', goal: '按即将进行、已完成和已取消管理咨询。', actions: ['切换状态', '进入咨询详情'], next: '咨询详情' },
    { id: 'senior-order', label: '咨询详情', goal: '付款成功后查看对应材料、问题和会议。', actions: ['查看简历', '复制会议号', '申请改期或取消'], next: '改期、取消或联系波比' },
    { id: 'senior-reschedule', label: '申请改期', goal: '按独立免费额度发起候选时间。', actions: ['选择1至3个候选时间', '查看第二次改期规则'], next: '等待对方确认' },
    { id: 'senior-cancel', label: '取消咨询', goal: '说明取消后全额退款及档期释放。', actions: ['查看取消影响', '确认取消'], next: '已取消咨询' },
    { id: 'senior-profile-status', label: '资料状态', goal: '展示资料审核、发布和修改入口。', actions: ['查看公开资料', '修改并重新提交'], next: '资料填写' },
    { id: 'senior-profile-form', label: '资料填写', goal: '填写公开资料、可预约时间和管理员可见证明材料。', actions: ['保存草稿', '提交审核'], next: '资料状态' }
  ] },
  { id: 'admin', label: '波比后台', icon: 'dashboard', pages: [
    { id: 'admin-dashboard', label: '仪表盘', goal: '让波比优先处理今天必须完成的运营任务。', actions: ['进入会议待办', '查看今日咨询'], next: '会议或订单详情' },
    { id: 'admin-seniors', label: '资料管理', goal: '统一管理历史导入、邀请填写、审核和发布状态。', actions: ['导入历史资料', '生成邀请', '审核和上下架'], next: '审核与编辑' },
    { id: 'admin-senior-detail', label: '审核与编辑', goal: '在一份档案中控制公开字段并查看私密材料。', actions: ['切换字段公开性', '审核或驳回', '配置价格'], next: '发布或退回修改' },
    { id: 'admin-availability', label: '档期管理', goal: '录入周期档期、例外日期和人工占用。', actions: ['新增周期规则', '关闭或额外开放时段'], next: '未来7天档期' },
    { id: 'admin-orders', label: '订单管理', goal: '按状态、日期和双方信息定位订单。', actions: ['组合筛选', '查看完整时间线'], next: '订单详情' },
    { id: 'admin-order-detail', label: '订单与会议', goal: '处理会议录入、改期、取消、退款和审计。', actions: ['录入会议', '代处理改期', '查看资金流水'], next: '通知双方' },
    { id: 'admin-meetings', label: '会议待办', goal: '集中处理待录入、待更新、待取消和2小时内紧急会议。', actions: ['复制订单时间', '录入或替换会议'], next: '订单详情' },
    { id: 'admin-refunds', label: '退款与异常', goal: '跟踪取消退款和异常订单，不设置售后申请流程。', actions: ['发起或查询退款', '记录处理结果'], next: '订单或结算' },
    { id: 'admin-settlements', label: '结算管理', goal: '系统算账后由波比线下人工结算。', actions: ['生成结算批次', '登记付款', '导出明细'], next: '结算完成' },
    { id: 'admin-users', label: '用户数据', goal: '查看注册、搜索、预约、支付、履约和复购数据。', actions: ['切换时间范围', '查看搜索模式转化'], next: '运营复盘' }
  ] }
];

export const pages = Object.fromEntries(pageGroups.flatMap(group => group.pages.map(page => [page.id, { ...page, group: group.id, groupLabel: group.label }])));
