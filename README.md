# Rolan Growth OS

面向孩子的本地优先成长复盘网站。React、TypeScript、Vite、Tailwind CSS、Dexie 和 React Router。无账号、广告、追踪和付费 API。

“成长领域 → 兴趣与创造 → 兴趣探索图鉴”内置 420 个具体兴趣点，内容来自 `src/data/interests.json`。目录本身是只读内容；孩子可从任一项目新建自己的体验记录，记录仍保存在本地 IndexedDB，并包含在 JSON 备份中。

## 本地运行

使用 Node.js 22：

```sh
npm ci
npm run dev
npm test
npm run build
```

## Cloudflare Pages

正式网址：[rolan-growth-os.pages.dev](https://rolan-growth-os.pages.dev/)。Cloudflare Pages 项目 `rolan-growth-os`，生产分支 `main`，构建命令 `npm run build`，输出目录 `dist`，Node.js 22（`.node-version`）。`public/_redirects` 为 React Router 提供刷新 fallback。

当前 Pages 项目使用与 Lumi English 相同的 Wrangler 直接上传方式。手动更新时，先运行 `npm test`、`npm run build`，再运行 `npx wrangler pages deploy dist --project-name rolan-growth-os --branch main`。GitHub 仓库与自动部署需单独接入；直接上传项目不能转换成 Pages 原生 Git 集成，可通过 GitHub Actions 调用 Wrangler 实现自动发布。

## 数据

所有成长记录默认只保存在当前浏览器的 IndexedDB。电脑与手机不会自动同步；清除浏览器数据或换域名都可能无法读取旧记录。进入“我的 → 数据管理”导出 JSON；导入时可选择合并或覆盖，覆盖前会再次提示备份。请妥善保管下载的 JSON 文件，不要上传到公开 GitHub 仓库。

备份格式目前为版本 1。导入会校验字段、ID 和关联关系；未知版本会被拒绝，避免静默损坏数据。
