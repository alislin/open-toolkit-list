// ============================================================
// open-toolkit 收藏数据（唯一人工维护的数据源）
// 维护规则见仓库根目录 AGENTS.md，要点：
//   - 新增工具：追加到 TOOLS 数组末尾，不要重排已有条目
//   - status 取值: in-use | trial | backup | deprecated
//   - star / 最近推送等动态统计不在此文件：由 GitHub Actions
//     每日生成到 data/gh-meta.js（勿手动编辑）
//   - tags 用小写英文，优先复用已有标签；description 用中文一句话
// ============================================================

const TOOLS = [
  {
    name: "ripgrep",
    url: "https://github.com/BurntSushi/ripgrep",
    homepage: "",
    category: "CLI 检索",
    tags: ["cli", "rust", "search", "grep"],
    status: "in-use",
    pinned: true,
    description: "极速的递归正则搜索工具，自动遵循 .gitignore，grep 的现代替代品。",
    notes: "日常代码检索主力。常用：rg \"pattern\" -l；与 fzf 组合可做交互式搜索。",
    addedAt: "2026-11-08"
  },
  {
    name: "fzf",
    url: "https://github.com/junegunn/fzf",
    homepage: "https://junegunn.github.io/fzf/",
    category: "CLI 效率",
    tags: ["cli", "go", "fuzzy-finder", "shell"],
    status: "in-use",
    pinned: true,
    description: "命令行模糊搜索器，可为任意列表提供交互式筛选，支持 vim / tmux 集成。",
    notes: "Ctrl-R 搜历史命令、Ctrl-T 选文件，装上 shell 集成后就回不去了。",
    addedAt: "2026-11-08"
  },
  {
    name: "lazygit",
    url: "https://github.com/jesseduffield/lazygit",
    homepage: "",
    category: "CLI 效率",
    tags: ["cli", "go", "git", "tui"],
    status: "in-use",
    pinned: false,
    description: "终端里的 Git 图形界面，用键盘完成暂存、变基、冲突解决等操作。",
    notes: "交互式 rebase 和 cherry-pick 特别好用；界面内按 ? 查看全部快捷键。",
    addedAt: "2026-11-08"
  },
  {
    name: "HTTPie",
    url: "https://github.com/httpie/cli",
    homepage: "https://httpie.io",
    category: "网络调试",
    tags: ["cli", "python", "http", "curl"],
    status: "backup",
    pinned: false,
    description: "人性化的命令行 HTTP 客户端，JSON 支持与语法高亮出色，curl 的易用替代品。",
    notes: "2024 年底后上游更新放缓，作为 curl 的备选保留。",
    addedAt: "2026-11-08"
  },
  {
    name: "excalidraw",
    url: "https://github.com/excalidraw/excalidraw",
    homepage: "https://excalidraw.com",
    category: "绘图白板",
    tags: ["typescript", "web", "whiteboard", "diagram"],
    status: "in-use",
    pinned: false,
    description: "手绘风格虚拟白板，随手画架构图与流程图，支持协作与端到端加密。",
    notes: "画架构草图首选，可导出 PNG/SVG；VS Code 插件支持本地编辑 .excalidraw 文件。",
    addedAt: "2026-11-08"
  },
  {
    name: "WuPage Translator",
    url: "https://github.com/mr-wuliu/wupage",
    homepage: "https://wupage.mrwuliu.top/",
    category: "浏览器扩展",
    tags: ["browser-extension", "translation", "typescript"],
    status: "in-use",
    pinned: false,
    description: "浏览器翻译扩展：网页全文、视频字幕、图片与 PDF 翻译，支持双语对照与本地离线翻译。",
    notes: "支持划词查词、段落翻译、OCR 图片翻译；内置多家免费翻译服务，也可接 DeepL / OpenAI 兼容接口或本地模型。Edge / Firefox 商店可直接安装，Chrome 需从 Releases 解压加载。",
    addedAt: "2026-11-08"
  },
  {
    name: "Oink",
    url: "https://github.com/oinkvm/oink",
    homepage: "",
    category: "跨设备协作",
    tags: ["rust", "kvm", "cross-platform", "clipboard-sync"],
    status: "in-use",
    pinned: false,
    description: "软件 KVM：一套键鼠控制多台 Mac/Windows 电脑，并同步剪贴板、拖放与音频。",
    notes: "P2P 架构，无需指定主控设备，自动发现局域网设备，流量默认加密。macOS 仅支持 Apple Silicon（14.2+），Windows 需 10 22H2+/11（x64）。从 GitHub Releases 下载安装，SmartScreen 可能提示未知发布者。",
    addedAt: "2026-11-08"
  }
];
