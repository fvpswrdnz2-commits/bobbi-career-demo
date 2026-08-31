# 熬夜波比｜求职咨询预约产品 Demo

这是一个面向求职咨询业务的高保真产品 Demo，目标是把“寻找合适的咨询者、确认档期、提交简历和问题、查看会议与订单”等重复沟通集中到一个清晰的线上流程中。

项目目前用于产品沟通与方案验证，不提供真实支付、文件上传、会议创建、短信通知或退款能力。

## 在线体验

- [完整产品原型](https://bobbi-career-demo.vercel.app/prototype/index.html#/student-home)
- [给 Bobby 的产品说明](https://bobbi-demo-portal.vercel.app)

完整原型包含三个入口：

- 预约咨询：搜索资料、查看详情、选择时间、提交咨询信息和管理预约。
- 提供咨询：查看咨询安排、资料状态和填写个人资料。
- 波比后台：管理资料、档期、订单、会议、退款记录和运营数据。

## 当前实现

- 27 个高保真业务页面
- 10 份结构化求职投稿资料
- 支持投稿编号、教育背景、行业和岗位方向搜索
- 基于标签匹配、关键词命中和可约时间的可解释排序
- 桌面端原型工作台与手机页面预览
- 独立的 HTML 产品说明页面
- GitHub `main` 分支推送后由 Vercel 自动发布

## 项目结构

```text
prototype/              当前产品原型源文件
bobbi-portal/           独立 HTML 产品说明
share-site/public/      产品原型的 Vercel 发布快照
demo/                   早期演示实现及结构化资料
memory-bank/            产品、架构、技术栈与实施文档
```

其中 `prototype/` 是当前原型的设计与交互基准。修改原型后，需要同步更新 `share-site/public/prototype/` 中的发布快照。

## 本地查看

产品原型和产品说明均为静态页面，可以直接打开对应的 `index.html`；也可以启动任意静态文件服务器后访问。

修改后建议运行以下检查：

```bash
node prototype/tests/render-check.mjs
node bobbi-portal/tests/check.mjs
node demo/tests/check.mjs
node share-site/tests/public-entry.test.mjs
```

## 两套方案

项目同时保留两个不同目标的方案：

- 高保真沟通版：当前仓库中可以直接体验的 Demo，用于与 Bobby 对齐业务流程和产品方向。
- 正式生产版：保存在 `memory-bank/` 中的产品与实施方案，需要在主体、微信小程序、微信支付、域名及相关外部账号准备完成后再实施。

Demo 的页面完成度不代表生产能力已经实现。

## 数据与使用说明

演示资料整理自项目方提供的公开投稿内容，仅用于本项目的产品验证和作品展示。仓库未包含用户简历、证明材料、支付信息或真实订单数据。

本仓库暂未提供开源许可证。未经许可，请勿将其中的投稿资料、产品文档或视觉资产用于其他商业项目。
