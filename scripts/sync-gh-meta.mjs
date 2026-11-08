// ============================================================
// GitHub 元数据同步脚本
// 由 .github/workflows/sync.yml 每日定时调用；本地也可手动运行：
//   node scripts/sync-gh-meta.mjs                    （未认证，60 次/小时）
//   GITHUB_TOKEN=xxx node scripts/sync-gh-meta.mjs   （认证，限额更高）
// 流程：从 data/tools.js 提取 owner/repo → 逐个调 GitHub API
//       → 与旧 data/gh-meta.js 合并（失败的仓库保留旧值）→ 写出新文件
// ============================================================

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const toolsPath = join(root, "data", "tools.js");
const metaPath = join(root, "data", "gh-meta.js");

// 1. 提取仓库列表（tools.js 由代理按固定格式维护，正则足够可靠）
const toolsSrc = readFileSync(toolsPath, "utf8");
const repos = [...new Set(
  [...toolsSrc.matchAll(/github\.com\/([^\/"'\s)\\]+)\/([^\/"'\s)\\?#]+)/gi)]
    .map(m => `${m[1]}/${m[2]}`.replace(/\.git$/i, ""))
)];
if (!repos.length) {
  console.error("错误：data/tools.js 中未找到任何 GitHub 仓库地址");
  process.exit(1);
}
console.log(`待同步 ${repos.length} 个仓库`);

// 2. 读取旧数据（本次请求失败的仓库保留旧值，避免数据清空）
let prev = {};
if (existsSync(metaPath)) {
  const m = readFileSync(metaPath, "utf8").match(/window\.GH_META\s*=\s*(\{[\s\S]*\});/);
  if (m) { try { prev = JSON.parse(m[1]); } catch { /* 旧文件损坏则忽略 */ } }
}

// 3. 逐个抓取
const token = process.env.GITHUB_TOKEN || "";
const headers = {
  "Accept": "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(token ? { "Authorization": `Bearer ${token}` } : {})
};

let ok = 0, fail = 0;
const next = { ...prev };
for (const repo of repos) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (res.status === 403 || res.status === 429) throw new Error("API 限流");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    next[repo] = {
      stars: j.stargazers_count,
      language: j.language || "",
      license: (j.license && j.license.spdx_id) || "",
      topics: (j.topics || []).slice(0, 6),
      lastPush: j.pushed_at || "",
      archived: !!j.archived,
      fetchedAt: new Date().toISOString()
    };
    ok++;
    console.log(`ok    ${repo}  ★${j.stargazers_count}`);
  } catch (e) {
    if (next[repo]) console.warn(`keep  ${repo}（${e.message}，保留旧值）`);
    else { console.warn(`fail  ${repo}（${e.message}）`); fail++; }
  }
}

// 4. 写出（对象为严格 JSON，便于下次运行时解析合并）
const banner = `// ============================================================
// 本文件由 GitHub Actions 自动生成（scripts/sync-gh-meta.mjs），勿手动编辑
// 键为 owner/repo；fetchedAt 为该条数据的抓取时间
// ============================================================

`;
writeFileSync(metaPath, banner + `window.GH_META = ${JSON.stringify(next, null, 2)};\n`);
console.log(`\n完成：成功 ${ok}，失败 ${fail}，共 ${Object.keys(next).length} 条 → data/gh-meta.js`);
