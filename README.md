# 未来回忆录

这是 [Weilv](https://github.com/Weilv-D) 的个人博客源码仓库。

访问地址：[https://weilv.space/](https://weilv.space/)

## 关于

记录技术探索的足迹与生活中的吉光片羽。

### 设计理念

- **杂志式编辑排版**：大留白、衬线优先的字体层级，营造纸质刊物的阅读节奏。
- **宣纸设色（Xuanzhi）**：以传统宣纸白 `#F7F3EB` 为底色，搭配群青、冷金、烟栗等中式传统色，支持明/暗双模式切换。
- **素纸卡片**：使用 `paper-panel` 替代玻璃质感，以微妙阴影与纯色表面呈现内容层级。

### 技术栈

- **框架**：Astro 5 + React 19（仅搜索、回到顶部、阅读进度三处岛屿）
- **样式**：TailwindCSS v4（CSS-first 配置）
- **字体**：Playfair Display / Source Serif 4 / Noto Serif SC / DM Sans
- **代码高亮**：Shiki（日间 `github-light` / 夜间 `dracula` 双主题）
- **数学排版**：remark-math + rehype-katex（构建期预渲染）
- **动效**：纯 CSS 字符与段落入场，无客户端文本测量
- **搜索**：构建期生成 `search.json`，客户端关键词匹配
- **部署**：GitHub Pages（GitHub Actions 自动构建）

## 开发

```bash
npm install
npm run dev
```

## 部署

推送到 `main` 分支自动触发 GitHub Actions 部署。
