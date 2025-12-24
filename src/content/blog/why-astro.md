---
title: 'Astro 的设计哲学'
description: '为什么我选择 Astro 作为我的博客框架？因为它不仅快，而且简单。'
pubDate: '2025-12-25'
heroImage: '/blog-placeholder-2.svg'
category: 'Tech'
tags: ['astro', 'web-dev']
---

Astro 是一个现代化的静态站点生成器，它引入了“群岛架构”（Island Architecture）的概念。

## 什么是群岛架构？

在传统的单页应用（SPA）中，整个页面都是由 JavaScript 驱动的。而在 Astro 中，页面默认是静态 HTML，只有需要交互的部分（如评论区、搜索框）才会加载 JavaScript。这些交互部分被称为“岛屿”。

## 为什么选择 Astro？

1. **性能优先**：默认发送 0kb JavaScript。
2. **框架无关**：你可以同时使用 React, Vue, Svelte 等框架。
3. **内容驱动**：专为内容型网站（博客、文档）设计。

```javascript
// Astro 组件示例
---
const title = "Hello Astro";
---
<h1>{title}</h1>
```

这就是为什么我选择 Astro。
