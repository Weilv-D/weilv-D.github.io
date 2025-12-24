# 未来回忆录 (WeilvBlog)

一个基于 [Astro](https://astro.build) 构建的极简主义数字花园博客。旨在记录技术探索的足迹与生活中的吉光片羽。

![License](https://img.shields.io/github/license/Weilv-D/WeilvBlog)
![Astro](https://img.shields.io/badge/Built%20with-Astro-orange)

## ✨ 特性

- **⚡️ 极致性能**：基于 Astro 的群岛架构，默认发送 0kb JavaScript 到客户端。
- **🎨 极简设计**：使用 Tailwind CSS 打造的黑白灰极简风格，专注于内容阅读。
- **🌗 暗色模式**：完美支持系统级和手动切换明暗主题。
- **🔍 全文搜索**：内置客户端即时搜索功能，支持按标题和描述检索。
- **🏷️ 标签系统**：完整的标签索引与筛选功能。
- **📄 自动分页**：博客列表页支持自动分页。
- **📱 响应式布局**：完美适配移动端、平板和桌面端。
- **🕸️ SEO 优化**：自动生成 Sitemap、RSS 订阅源，配置 Open Graph 社交分享卡片。

## 🚀 快速开始

### 环境要求

- Node.js v18.14.1 或更高版本
- npm / yarn / pnpm

### 安装

```bash
# 克隆仓库
git clone https://github.com/Weilv-D/WeilvBlog.git

# 进入目录
cd WeilvBlog

# 安装依赖
npm install
```

### 本地开发

启动本地开发服务器：

```bash
npm run dev
```

访问 `http://localhost:4321/WeilvBlog/` 查看效果。

### 构建

构建生产环境静态文件：

```bash
npm run build
```

构建产物将生成在 `dist/` 目录下。

## 📝 写作指南

所有博客文章位于 `src/content/blog/` 目录下。支持 Markdown (`.md`) 和 MDX (`.mdx`) 格式。

### 新建文章

创建一个新的 `.md` 文件，例如 `src/content/blog/my-new-post.md`：

```markdown
---
title: '我的新文章标题'
description: '这是文章的简短描述，将显示在列表页和 SEO 元数据中。'
pubDate: '2025-12-25'
updatedDate: '2025-12-26' # 可选
heroImage: '/blog-placeholder-1.jpg' # 可选，封面图
category: 'Tech' # 类别：'Tech' 或 'Life'
tags: ['astro', 'learning'] # 标签列表
---

这里是文章的正文内容...
```

### 静态资源

图片等静态资源请放在 `public/` 目录下。在文章中引用时，请使用绝对路径（例如 `/blog-placeholder-1.jpg`）。系统会自动处理部署时的子路径前缀。

## 🛠️ 配置指南

### 站点信息

在 `src/consts.ts` 中修改全局站点信息：

```typescript
export const SITE_TITLE = '未来回忆录';
export const SITE_DESCRIPTION = 'weilv的时空褶皱 - 技术与生活的数字花园';
```

### 部署配置

在 `astro.config.mjs` 中配置部署域名和子路径：

```javascript
export default defineConfig({
  site: 'https://weilv-d.github.io',
  base: '/WeilvBlog/', // 如果部署在子路径，请设置此项
  // ...
});
```

## 📂 项目结构

```text
/
├── public/             # 静态资源 (favicon, robots.txt, images)
├── src/
│   ├── components/     # UI 组件 (Header, Footer, Search...)
│   ├── content/        # 博客内容集合
│   │   └── blog/       # Markdown/MDX 文章文件
│   ├── layouts/        # 页面布局 (BaseLayout, BlogPost)
│   ├── pages/          # 路由页面
│   │   ├── blog/       # 博客列表与详情页
│   │   ├── tags/       # 标签索引页
│   │   └── ...
│   └── styles/         # 全局样式
├── astro.config.mjs    # Astro 配置文件
└── tailwind.config.mjs # Tailwind CSS 配置文件
```

## 📄 许可证

本项目采用 MIT 许可证。
