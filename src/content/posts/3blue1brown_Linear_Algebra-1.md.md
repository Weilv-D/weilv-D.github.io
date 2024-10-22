---
slug: 3blue1brown-chapter-1
title: 3Blue1brown学习笔记：Chapter 1 Vectors, what even are they?
description: Vectors, what even are they?
image: ../attachments/2dAnd3DVectors.png
date: 2024-10-21T21:55:00+08:00
lastmod: 2024-10-21T21:55:00+08:00
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


> The introduction of numbers as coordinates is an act of violence.
> -Hermann Weyl

## 三种不同的向量视角

### 物理学家视角
- **定义**：向量是具有大小和方向的箭头。
- **特性**：长度和方向确定一个向量。
- **维度**：二维 $(x, y)$，三维 $(x, y, z)$。

### 计算机科学家视角
- **定义**：向量是有序数字列表。
- **应用**：例如，房屋可以用面积和价格表示 $\begin{bmatrix} \text{面积} \\ \text{价格} \end{bmatrix}$。
- **维度**：列表中元素的数量决定维度。

### 数学家视角
- **定义**：向量是可以进行加法和标量乘法的对象。
- **抽象性**：概括前两种视角，强调代数性质。
- **操作**：向量加法和标量乘法。

## 坐标系统

- **定义**：帮助确定向量位置，原点为 $(0, 0)$，x 轴水平，y 轴垂直。
- **单位长度**：选择一个单位长度后，在轴上做出刻度标记。
- **网格线**：扩展刻度标记成网格线，表示二维空间。

### 向量的坐标
- **定义**：指示如何从原点到达向量末端。
- **示例**：$\begin{bmatrix} x \\ y \end{bmatrix}$ 表示先沿 x 轴走 $x$ 单位，再沿 y 轴走 $y$ 单位。

## 向量运算

### 加法
- **定义**：两个向量 $\mathbf{a} = \begin{bmatrix} a_1 \\ a_2 \end{bmatrix}$ 和 $\mathbf{b} = \begin{bmatrix} b_1 \\ b_2 \end{bmatrix}$ 的和：
  $$\mathbf{a} + \mathbf{b} = \begin{bmatrix} a_1 + b_1 \\ a_2 + b_2 \end{bmatrix}$$
- **几何解释**：将第二个向量的尾部移到第一个向量的头部，画出新的向量。

### 标量乘法
- **定义**：向量 $\mathbf{v} = \begin{bmatrix} x \\ y \end{bmatrix}$ 乘以标量 $c$：
  $$c \mathbf{v} = \begin{bmatrix} cx \\ cy \end{bmatrix}$$
- **几何解释**：
  - 正数可以看成拉伸或压缩向量。
  - 负数翻转向量方向并缩放。
  - $\frac{1}{c}$ 缩放到原来的 $\frac{1}{c}$ 倍。

### 点积
- **定义**：两个向量 $\mathbf{a} = \begin{bmatrix} a_1 \\ a_2 \end{bmatrix}$ 和 $\mathbf{b} = \begin{bmatrix} b_1 \\ b_2 \end{bmatrix}$ 的点积：
  $$\mathbf{a} \cdot \mathbf{b} = a_1 b_1 + a_2 b_2$$
- **几何解释**：
  $$\mathbf{a} \cdot \mathbf{b} = |\mathbf{a}| |\mathbf{b}| \cos{\theta}$$
  其中 $\theta$ 是两向量之间的夹角。  
    
    

