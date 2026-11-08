# 🧰 Open Toolkit · 开源工具收藏夹

个人开源工具收藏夹：**数据与展示分离的纯静态站点**，零构建、零依赖、无需后端。

数据由智能体代理维护——只需丢给它一个项目地址，读 README、归类、打标签、写入数据、提交 Git 全部自动完成。star 等动态统计由 GitHub Actions 每日自动刷新，人工数据与统计数据完全分离。

## 架构

```
data/tools.js                 ← 人工/代理维护：只在添加、改备注时更新
        │  每日 05:00 (北京时间)
        ▼
GitHub Actions (sync.yml)     ← 读取仓库列表 → 调 GitHub API
        │
        ▼
data/gh-meta.js               ← 自动生成：star / 最近推送 / 归档状态，勿手动编辑
        │  commit 触发 Pages 重新发布
        ▼
index.html                    ← 合并两个数据源渲染；托管时零 API 调用
```

## 使用方式

**本地使用**：直接双击 `index.html`（数据以脚本形式加载，不受 `file://` 的 CORS 限制）。本地打开时会默认静默直连 GitHub API 刷新最新数据，⚡ 按钮可强制实时。

**发布上线**：推送到 GitHub 后，Settings → Pages → Source 选 `main` / `(root)` 开启 GitHub Pages。托管访问完全基于发布数据，不消耗任何访客的 API 限额。

## 功能

- 🔍 搜索：名称 / 描述 / 标签 / 备注，多关键词
- 🗂 分类侧栏 + 标签多选组合筛选（由数据动态统计生成）
- 🏷 状态标记：在用 / 试用 / 备选 / 弃用，📌 置顶
- ⭐ 动态统计自动更新：Actions 每日生成（star / 语言 / License / 最近推送 / 归档），本地打开另有直连实时兜底
- 🕐 卡片正面显示「更新于 x 天前」相对时间，展开看精确推送时间
- ↔ 默认按最近更新倒序，可切换 Star / 添加时间 / 名称排序
- 🌙 暗色模式（跟随系统 + 手动切换）

## 让代理添加一个工具

在本仓库目录下对任意编码智能体（OpenCode 等）说：

> 添加收藏：https://github.com/BurntSushi/ripgrep

代理会按 `AGENTS.md` 中的规范自动读 README、生成中文描述、归类打标、追加数据并提交。统计信息会在下个定时周期自动出现，也可在 Actions 页面手动 Run `sync-gh-meta` 立即刷新。

## 目录结构

```
open-toolkit/
├── AGENTS.md                     # 代理维护手册（数据规范 + 新增流程）
├── README.md
├── index.html                    # 唯一页面，样式与逻辑全部内嵌
├── data/
│   ├── tools.js                  # 收藏数据（人工维护，唯一数据源）
│   └── gh-meta.js                # 动态统计（Actions 自动生成，勿手改）
├── scripts/
│   └── sync-gh-meta.mjs          # 元数据同步脚本（Actions 调用，本地也可跑）
└── .github/workflows/
    └── sync.yml                  # 每日定时同步（UTC 21:00）+ 手动触发
```

## 日常维护

- **新增**：把地址丢给代理即可。
- **手动改数据**：编辑 `data/tools.js`，字段说明见文件头注释与 `AGENTS.md`。
- **立即刷新统计**：Actions 页面手动 Run workflow，或本地 `node scripts/sync-gh-meta.mjs` 后提交。
- **star 历史**：gh-meta.js 的每日 commit 天然沉淀了数据轨迹，可在 Git 历史中回看。
