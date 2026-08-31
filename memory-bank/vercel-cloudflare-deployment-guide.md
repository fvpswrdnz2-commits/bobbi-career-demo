# Vercel 与 Cloudflare 部署操作指南

更新日期：2026-08-28

## 使用边界

本项目已经有一个中国大陆首选链接：

`https://onhzes97tk.feishuapp.com/app/app_17cyv0x8ae6`

Vercel 和普通 Cloudflare Pages 更适合作为全球备用链接、作品集链接和后续自动部署练习，不能承诺中国大陆稳定访问。Cloudflare 官方说明 Pages 当前不在其中国网络中；Vercel 官方说明没有中国大陆服务器或 CDN 节点。

部署时使用项目根目录下的 `Bobby-Product-Demo.zip`。压缩包根部已经包含 `index.html`，无需构建。

## 方案一：Vercel Drop

这是 Vercel 当前最简单的无 Git、无命令行方式。

1. 打开 <https://vercel.com/drop>。
2. 注册或登录 Vercel；可使用 GitHub、GitLab 或邮箱登录。
3. 将 `Bobby-Product-Demo.zip` 拖入上传区域。
4. 选择自己的个人 Team。
5. 项目名称填写 `bobbi-career-demo`；若重名，使用 `bobbi-career-demo-01`。
6. 确认入口文件为压缩包根部的 `index.html`。
7. 点击 **Deploy**。
8. 等待状态变成 Ready，打开生成的 `*.vercel.app` 地址。
9. 检查是否自动进入“给 Bobby 的产品说明”，再依次点击预约流程、咨询工作台和波比后台。

Vercel Drop 每次拖入会创建项目。若后续需要持续更新，建议再连接 Git 仓库，或改用 Vercel CLI。

### Vercel 绑定域名

1. 进入对应 Project。
2. 打开 **Settings → Domains**。
3. 点击 **Add Domain**，推荐先添加 `demo.example.com`。
4. 在域名注册商的 DNS 控制台复制 Vercel 给出的记录：子域名通常使用 CNAME，根域名通常使用 A 记录。
5. 回到 Vercel 等待验证通过；HTTPS 证书会在 DNS 验证后自动签发。

必须复制项目页面实际给出的 DNS 值，不要凭记忆填写固定 IP 或 CNAME。

## 方案二：Cloudflare Pages Direct Upload

这是 Cloudflare 当前最简单的拖拽发布方式。

1. 打开 <https://dash.cloudflare.com/> 并注册或登录。
2. 左侧进入 **Workers & Pages**。
3. 点击 **Create application**。
4. 选择 **Get started → Drag and drop your files**。
5. 项目名称填写 `bobbi-career-demo`；若重名，增加数字后缀。
6. 将 `Bobby-Product-Demo.zip` 拖入上传框。
7. 点击 **Deploy site** 或 **Save and Deploy**。
8. 等待发布完成，打开生成的 `*.pages.dev` 地址。
9. 检查根页面、预约流程、咨询工作台和后台是否正常。

以后更新时进入该 Pages 项目，选择 **Create a new deployment**，选择 Production，再上传新版压缩包。Direct Upload 项目不能直接切换成 Git 自动部署；若以后需要 Git 集成，应新建一个 Git-integrated Pages 项目。

### Cloudflare Pages 绑定域名

1. 进入 Pages 项目。
2. 打开 **Custom domains**。
3. 点击 **Set up a domain**。
4. 推荐先填 `demo.example.com`。
5. 如果域名 DNS 已由 Cloudflare 管理，系统会自动创建记录。
6. 如果 DNS 在其他注册商，先在 Pages 页面关联域名，再按提示添加 CNAME：`demo` 指向你的 `<project>.pages.dev`。
7. 等待域名状态 Active 和 HTTPS 生效。

不要只在 DNS 控制台手动添加 CNAME 而跳过 Pages 的 **Set up a domain**，否则可能出现 522。

## 推荐用途

- 发给 Bobby 或国内体验者：继续使用飞书妙搭链接。
- 海外访问、作品集展示：可增加 Vercel 或 Cloudflare Pages 链接。
- 正式中国大陆生产环境：使用完成 ICP 备案的自有域名和中国大陆托管资源，不以 Vercel 或普通 Pages 作为唯一入口。

## 官方参考

- Vercel Drop：<https://vercel.com/changelog/vercel-drop>
- Vercel 大陆访问说明：<https://vercel.com/kb/guide/accessing-vercel-hosted-sites-from-mainland-china>
- Vercel 自定义域名：<https://vercel.com/docs/domains/set-up-custom-domain>
- Cloudflare Pages Direct Upload：<https://developers.cloudflare.com/pages/get-started/direct-upload/>
- Cloudflare Pages 自定义域名：<https://developers.cloudflare.com/pages/configuration/custom-domains/>
- Cloudflare 中国网络说明：<https://developers.cloudflare.com/china-network/>
