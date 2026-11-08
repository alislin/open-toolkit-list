# AGENTS.md — open-toolkit 代理维护手册

本仓库是**个人开源工具收藏夹**：数据与展示分离的纯静态站点。

- **展示层** `index.html`：搜索 / 分类 / 标签 / 状态筛选 / 排序 / 暗色模式，全部客户端实现。除非用户明确要求改界面，**不要修改此文件**。
- **收藏数据** `data/tools.js`：唯一人工维护的数据源，智能体的日常新增/修改都在这里。
- **动态统计** `data/gh-meta.js`：GitHub Actions 每日自动生成（star、最近推送、归档状态等），**禁止手动编辑**。

用户的使用方式：丢给你一个项目地址，你负责完成剩下的一切（读 README → 归类 → 写入 → 提交）。

---

## 核心规则（必须遵守）

1. 人工数据只存于 `data/tools.js`；`data/gh-meta.js` 由自动化生成，任何情况下不要手动修改它。
2. **只追加或修改对应条目**：不要重排已有条目、不要重新格式化整个文件、不要顺手"优化"无关内容。新增条目固定追加到 `TOOLS` 数组末尾。
3. 保持 2 空格缩进、双引号、字段顺序与现有条目一致。
4. 每完成一次数据变更即 git commit，message 规范：
   - 新增：`add: <name>`
   - 修改（状态/备注/分类等）：`update: <name>`
5. `description` 用中文一句话（建议 ≤ 40 字），基于 README/官方说明，不臆造功能。
6. `tags` 用小写英文（kebab-case），**优先复用已有标签**；确实没有合适的才新建。
7. `category` 尽量复用现有分类；只有当一个工具确实不属于任何现有分类时才新建分类（分类是中文短词，如「CLI 效率」）。

## 数据结构（data/tools.js）

```js
{
  name: "WuPage Translator",        // 项目常用名（非仓库名时用官方名）
  url: "https://github.com/...",    // 仓库地址（必填）
  homepage: "https://...",          // 官网 / 在线服务，没有则 ""
  logo: "assets/logos/fzf.png",     // 工具图标：官方 icon 下载到 assets/logos/ 本地化；
                                    // 组织账号头像即产品 logo 或确实无图时留 ""
  category: "浏览器扩展",            // 单一主分类（中文）
  tags: ["browser-extension", ...], // 小写英文标签，3~4 个为宜
  status: "in-use",                 // 见下方状态表
  pinned: false,                    // 是否置顶展示
  description: "中文一句话描述",
  notes: "个人使用心得 / 安装方式 / 注意事项",   // 无内容可填 ""
  addedAt: "2026-11-08"             // 收录日期
}
```

**star、最近推送、语言、License、topics、归档状态等动态字段不在此文件**。它们由 `.github/workflows/sync.yml`（每天约北京时间 05:00）运行 `scripts/sync-gh-meta.mjs` 生成到 `data/gh-meta.js`，页面自动合并展示。

### status 取值

| 值 | 含义 |
|---|---|
| `in-use` | 在用 |
| `trial` | 试用中 |
| `backup` | 备选（暂不常用或作为替代方案保留） |
| `deprecated` | 已弃用（留档备忘） |

## 新增工具流程

1. 解析用户给的地址。
2. 阅读 README（`https://raw.githubusercontent.com/{owner}/{repo}/{默认分支}/README.md`），写中文 `description` 与 `notes`（安装方式、亮点、注意事项）。
3. 找 logo：README 中引用的方形 icon / logo 图（如 `public/icons/icon.png`、`.github/assets/logo.svg`）→ 下载到 `assets/logos/<slug>.png` 并在 `logo` 字段填相对路径（本地化提交，避免外链依赖；下载后确认图片内容确实是 logo 而非截图/横幅）。组织账号头像即产品 logo（如 excalidraw、HTTPie）或确实找不到图 → 留 `""`，页面自动用 GitHub 账号头像 / 首字母色块兜底。
4. 归类：分类尽量复用，标签尽量复用；`status` 默认 `in-use`（用户另有说明除外）。
5. 追加条目到 `TOOLS` 数组末尾，`addedAt` 填当天日期。**不需要填任何统计字段。**
6. `git commit -m "add: <name>"`（若下载了 logo，一并提交）。
7. 新工具的 star 等统计会在下一个定时周期（每天一次）自动出现。若用户希望立即更新，可触发同步：`gh workflow run sync-gh-meta`（或提示用户到仓库 Actions 页面手动 Run workflow）。

## 动态数据刷新（自动）

- **定时**：Actions 每日运行 `scripts/sync-gh-meta.mjs`，读取 tools.js 的仓库列表 → 调 GitHub API（仓库自带 `GITHUB_TOKEN`，限额充足）→ 更新 `data/gh-meta.js` → 自动 commit 并触发 Pages 重新发布。
- **手动触发**：仓库 Actions 页面选 `sync-gh-meta` → Run workflow；或命令行 `gh workflow run sync-gh-meta`。
- **本地打开时**（`file://`）：页面默认启动直连 GitHub API 自动刷新（受 1 小时 TTL 缓存与 ETag 约束），另有 ⚡ 按钮强制实时。托管在 GitHub Pages 时完全不直连，只用发布数据。
- 脚本本地也可手动运行：`node scripts/sync-gh-meta.mjs`（未认证限额 60 次/小时，量大时配 `GITHUB_TOKEN` 环境变量）。

## 非 GitHub 工具

直接按上述流程添加即可；`url` 不是 `github.com` 地址时，页面不会为其显示任何统计信息，无需特殊处理。

## 部署（GitHub Pages）

1. 在 GitHub 创建空仓库并推送本仓库：

   ```
   git remote add origin https://github.com/<你>/open-toolkit.git
   git push -u origin main
   ```

2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **Deploy from a branch**，分支选 `main` / `(root)`，保存即可。
3. 纯静态、无构建，推送 `main`（含 sync workflow 的每日自动 commit）后约一分钟自动发布。

## 修改界面

仅当用户明确要求调整界面/功能时才修改 `index.html`。修改后提醒用户本地打开 `index.html` 验证（直接双击即可，无需本地服务器）。
