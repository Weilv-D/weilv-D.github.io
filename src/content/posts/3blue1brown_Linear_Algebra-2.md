---
slug: 3blue1brown_Linear_Algebra-chapter-2
title: 3Blue1brown学习笔记：Chapter 2 Linear combinations, span, and basis vectors
description: Linear combinations, span, and basis vectors
image: ../attachments/arrow.png
date: 2024-10-22T20:11:00+08:00
lastmod: 2024-10-22T20:11:00+08:00
hidden: false
tags:
  - 3Blue1Brown
  - 数学
  - 线性代数
hide:
  - lastmod
  - tags
  - readingTime
  - toc
  - comments
---

# 3Blue1brown学习笔记：Chapter 1 Vectors, what even are they?  

>Mathematics requires a small dose, not of genius, but of an imaginative freedom which, in a larger dose, would be insanity.
>
>-Angus K. Rodgers  

## 线性组合
线性组合是指通过缩放两个向量并将它们相加来生成新的向量。例如，标准基向量 $\( \hat{i} \)$ 和 $\( \hat{j} \)$ 可以通过缩放和相加来描述任何二维向量。

## 基向量
基向量是坐标系统的基础。通过选择不同的基向量，可以得到不同的坐标系统。

## 张成
两个向量的张成是通过线性组合可以到达的所有向量的集合。大多数情况下，两个二维向量的张成是整个二维空间，但如果它们在同一条线上，则跨度仅限于该线。

## 三维空间中的跨张成
在三维空间中，两个不共线的向量的跨度是一个平面。添加第三个向量可以扩展到整个三维空间，除非第三个向量在前两个向量的跨度内。

## 线性相关和线性无关
如果一个向量可以表示为其他向量的线性组合，则这些向量是线性相关的。否则，它们是线性无关的。

## 结论
理解线性组合、跨度和基向量是掌握线性代数的关键。在下一章中，我们将探讨矩阵和空间变换。
