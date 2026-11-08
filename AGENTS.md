# AGENTS.md — open-toolkit 代理维护手册

本仓库是**个人开源工具收藏夹**：数据与展示分离的纯静态站点。

- **展示层** `index.html`：搜索 / 分类 / 标签 / 状态筛选 / 排序 / 暗色模式，全部客户端实现。除非用户明确要求改界面，**不要修改此文件**。
- **数据层** `data/tools.js`：唯一数据源，智能体的全部日常工作都发生在这里。

用户的使用方式：丢给你一个项目地址，你负责完成剩下的一切（抓取信息 → 归类 → 写入 → 提交）。

---

## 核心规则（必须遵守）

1. 数据只存于 `data/tools.js`，不新建其他数据文件。
2. **只追加或修改对应条目**：不要重排已有条目、不要重新格式化整个文件、不要顺手"优化"无关内容。新增条目固定追加到 `TOOLS` 数组末尾。
3. 保持 2 空格缩进、双引号、字段顺序与现有条目一致。
4. 每完成一次数据变更即 git commit，message 规范：
   - 新增：`add: <name>`
   - 修改（状态/备注/分类等）：`update: <name>`
   - 批量刷新元数据：`refresh: <n> tools`
5. `description` 用中文一句话（建议 ≤ 40 字），基于 README/官方说明，不臆造功能。
6. `tags` 用小写英文（kebab-case），**优先复用已有标签**；确实没有合适的才新建。
7. `category` 尽量复用现有分类；只有当一个工具确实不属于任何现有分类时才新建分类（分类是中文短词，如「CLI 效率」）。

## 数据结构

```js
{
  name: "WuPage Translator",        // 项目常用名（非仓库名时用官方名）
  url: "https://github.com/...",    // 仓库地址（必填）
  homepage: "https://...",          // 官网 / 在线服务，没有则 ""
  category: "浏览器扩展",            // 单一主分类（中文）
  tags: ["browser-extension", ...], // 小写英文标签，3~4 个为宜
  status: "in-use",                 // 见下方状态表
  pinned: false,                    // 是否置顶展示
  description: "中文一句话描述",
  notes: "个人使用心得 / 安装方式 / 注意事项",   // 无内容可填 ""
  github: {                         // 由 GitHub API 自动填充；非 GitHub 工具设为 null
    stars: 576,                     // stargazers_count，整数
    language: "TypeScript",         // language
    license: "GPL-3.0",             // license.spdx_id
    topics: ["..."],                // topics（截取 ≤ 6 个；API 为空则留 []）
    lastPush: "2026-11-08",         // pushed_at 的前 10 个字符
    archived: false,                // archived
    syncedAt: "2026-11-08"          // 本次同步日期（YYYY-MM-DD）
  },
  addedAt: "2026-11-08"             // 收录日期
}
```

### status 取值

| 值 | 含义 |
|---|---|
| `in-use` | 在用 |
| `trial` | 试用中 |
| `backup` | 备选（暂不常用或作为替代方案保留） |
| `deprecated` | 已弃用（留档备忘） |

## 新增工具流程

1. 解析用户给的地址，识别 `owner/repo`。
2. 抓取元数据：

   ```
   curl -s https://api.github.com/repos/{owner}/{repo}
   ```

   字段映射：`stargazers_count → stars`、`language → language`、`license.spdx_id → license`、`topics → topics`（≤6 个）、`pushed_at → lastPush`（取日期）、`archived → archived`、`homepage → homepage`。
3. 阅读 README（`https://raw.githubusercontent.com/{owner}/{repo}/{默认分支}/README.md`），写中文 `description` 与 `notes`（安装方式、亮点、注意事项）。
4. 归类：分类尽量复用，标签尽量复用；`status` 默认 `in-use`（用户另有说明除外）。
5. 追加条目到 `TOOLS` 数组末尾，`addedAt` / `syncedAt` 填当天日期。
6. `git commit -m "add: <name>"`。

**限流提示**：未认证 GitHub API 为 60 次/小时。单次新增足够；批量刷新若遇 403/429，分批进行或提示用户配置 `GITHUB_TOKEN` 后改用带认证请求：

```
curl -s -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/repos/{owner}/{repo}
```

## 刷新流程

用户说「刷新数据 / 同步信息」时：

1. 找出所有 `github !== null` 的条目，逐个请求 API。
2. 更新 `github.*` 各字段，`syncedAt` 改为当天；条目其他内容不动。
3. 若 `archived` 变为 `true`，提示用户考虑将 `status` 调整为 `backup` 或 `deprecated`。
4. 一次 commit：`refresh: <n> tools`。

## 非 GitHub 工具

`github` 字段填 `null`；`description` / `homepage` / `notes` 根据官网或用户说明填写；状态徽章与 star 等信息在页面上会自动省略，无需特殊处理。

## 部署（GitHub Pages）

1. 在 GitHub 创建空仓库并推送本仓库：

   ```
   git remote add origin https://github.com/<你>/open-toolkit.git
   git push -u origin main
   ```

2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **Deploy from a branch**，分支选 `main` / `(root)`，保存即可。
3. 纯静态、无构建，推送 `main` 后约一分钟自动发布。

## 修改界面

仅当用户明确要求调整界面/功能时才修改 `index.html`。修改后提醒用户本地打开 `index.html` 验证（直接双击即可，无需本地服务器）。
