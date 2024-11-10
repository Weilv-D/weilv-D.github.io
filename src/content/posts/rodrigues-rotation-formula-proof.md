---
slug: rodrigues-rotation-formula-proof
title: 罗德里格斯旋转公式的详细证明
description: 个人对证明罗德里格斯旋转公式的一点理解
date: 2024-11-10
lastmod: 2024-11-10
hidden: false
tags:
  - 数学
  - 线性代数
  - 机器人学
hide:
  - lastmod
  - tags
  - toc
  - comments
---
罗德里格斯旋转公式在计算机图形学、机器人学和航空航天等领域有着广泛的应用。它提供了一种在三维空间中绕任意轴进行旋转的方式。本文将详细推导罗德里格斯旋转公式，并提供几何上的直观解释。

## 1. 引言

对于一个三维向量 $\mathbf{v}$，我们希望将其绕单位旋转轴 $\mathbf{k}$ 旋转角度 $\theta$，得到新的向量 $\mathbf{v'}$。罗德里格斯旋转公式给出了这个旋转的显式表达：

$$
\mathbf{v'} = \mathbf{v}\cos\theta + (\mathbf{k} \times \mathbf{v})\sin\theta + \mathbf{k}(\mathbf{k} \cdot \mathbf{v})(1 - \cos\theta)
$$

## 2. 前期准备

在推导之前，我们需要了解以下向量运算：

- **向量点积（内积）**：$\mathbf{a} \cdot \mathbf{b}$
- **向量叉积（外积）**：$\mathbf{a} \times \mathbf{b}$
- **向量的分解**：任意向量可分解为平行于某单位向量 $\mathbf{k}$ 和垂直于 $\mathbf{k}$ 的分量。

## 3. 向量的分解

给定单位向量 $\mathbf{k}$，将向量 $\mathbf{v}$ 分解为：

$$
\mathbf{v} = \mathbf{v}_{\parallel} + \mathbf{v}_{\perp}
$$

其中：

- 平行分量：$\mathbf{v}_{\parallel} = (\mathbf{v} \cdot \mathbf{k})\mathbf{k}$
- 垂直分量：$\mathbf{v}_{\perp} = \mathbf{v} - \mathbf{v}_{\parallel}$

## 4. 旋转垂直分量

由于 $\mathbf{v}_{\parallel}$ 与旋转轴方向相同，在旋转过程中保持不变。我们只需处理 $\mathbf{v}_{\perp}$ 的旋转。

在垂直于 $\mathbf{k}$ 的平面内，$\mathbf{v}_{\perp}$ 绕 $\mathbf{k}$ 旋转角度 $\theta$ 后得到：

$$
\mathbf{v'}_{\perp} = \mathbf{v}_{\perp}\cos\theta + (\mathbf{k} \times \mathbf{v}_{\perp})\sin\theta
$$

## 5. 合成新的向量

旋转后的向量为：

$$
\mathbf{v'} = \mathbf{v}_{\parallel} + \mathbf{v'}_{\perp}
$$

展开并替换 $\mathbf{v}_{\perp}$：

$$
\begin{align*}
\mathbf{v'} &= \mathbf{v}_{\parallel} + \mathbf{v}_{\perp}\cos\theta + (\mathbf{k} \times \mathbf{v}_{\perp})\sin\theta \\
&= \mathbf{v}_{\parallel} + (\mathbf{v} - \mathbf{v}_{\parallel})\cos\theta + (\mathbf{k} \times (\mathbf{v} - \mathbf{v}_{\parallel}))\sin\theta
\end{align*}
$$

由于 $\mathbf{k} \times \mathbf{v}_{\parallel} = \mathbf{0}$，简化后得：

$$
\mathbf{v'} = \mathbf{v}\cos\theta + (\mathbf{k} \times \mathbf{v})\sin\theta + \mathbf{v}_{\parallel}(1 - \cos\theta)
$$

替换 $\mathbf{v}_{\parallel}$：

$$
\mathbf{v'} = \mathbf{v}\cos\theta + (\mathbf{k} \times \mathbf{v})\sin\theta + \mathbf{k}(\mathbf{k} \cdot \mathbf{v})(1 - \cos\theta)
$$

## 6. 几何直观

- **平行分量保持不变**：$\mathbf{v}_{\parallel}$ 沿旋转轴方向，不受旋转影响。
- **垂直分量旋转**：$\mathbf{v}_{\perp}$ 在垂直于 $\mathbf{k}$ 的平面内旋转角度 $\theta$。
- **叉积的作用**：$\mathbf{k} \times \mathbf{v}$ 给出了 $\mathbf{v}_{\perp}$ 旋转 90 度的方向，结合 $\sin\theta$ 达到旋转 $\theta$ 的效果。

## 7. 结论

通过以上推导，我们得到了罗德里格斯旋转公式的详细表达，并理解了其几何意义。该公式在实际应用中提供了高效的旋转计算方法。
