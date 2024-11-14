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
  - comments
---
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

### 4.1 旋转向量推导

在垂直于 $\mathbf{k}$ 的平面内，向量 $\mathbf{v}_{\perp}$ 绕 $\mathbf{k}$ 旋转角度 $\theta$。为了理解旋转后的向量表达式，我们可以借助旋转矩阵和叉积的性质。

#### **步骤 1：定义平面内的正交基**

在平面内，选择两个正交单位向量：

- **$\mathbf{e}_1$**：方向与 $\mathbf{v}_{\perp}$ 相同，$\mathbf{e}_1 = \dfrac{\mathbf{v}_{\perp}}{|\mathbf{v}_{\perp}|}$
- **$\mathbf{e}_2$**：由 $\mathbf{k}$ 和 $\mathbf{v}_{\perp}$ 的叉积得到，$\mathbf{e}_2 = \dfrac{\mathbf{k} \times \mathbf{v}_{\perp}}{|\mathbf{v}_{\perp}|}$

这两个单位向量在平面内且正交。

#### **步骤 2：表示旋转操作**

在这个基底下，$\mathbf{v}_{\perp}$ 可以表示为：

$$
\mathbf{v}_{\perp} = |\mathbf{v}_{\perp}| \mathbf{e}_1
$$

旋转 $\theta$ 后的向量为：

$$
\mathbf{v'}_{\perp} = |\mathbf{v}_{\perp}| (\mathbf{e}_1 \cos\theta + \mathbf{e}_2 \sin\theta)
$$

#### **步骤 3：替换回原始向量形式**

替换 $\mathbf{e}_1$ 和 $\mathbf{e}_2$：

$$
\begin{align*}
\mathbf{v'}_{\perp} &= |\mathbf{v}_{\perp}| \left( \dfrac{\mathbf{v}_{\perp}}{|\mathbf{v}_{\perp}|} \cos\theta + \dfrac{\mathbf{k} \times \mathbf{v}_{\perp}}{|\mathbf{v}_{\perp}|} \sin\theta \right) \\
&= \mathbf{v}_{\perp} \cos\theta + (\mathbf{k} \times \mathbf{v}_{\perp}) \sin\theta
\end{align*}
$$

因此，旋转后的向量 $\mathbf{v'}_{\perp}$ 可以表示为上述公式。

#### **几何直观解释**

- **$\mathbf{v}_{\perp} \cos\theta$**：原始向量在旋转后新的方向上的投影。
- **$(\mathbf{k} \times \mathbf{v}_{\perp}) \sin\theta$**：原始向量在旋转过程中产生的垂直分量，方向由叉积确定。

通过这两个分量的合成，就得到了旋转后的向量 $\mathbf{v'}_{\perp}$。

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

## 6. 矩阵指数形式的推导

### 6.1 旋转操作的矩阵表示

旋转操作可以用矩阵表示。对于绕单位向量 $\mathbf{k}$ 旋转角度 $\theta$，旋转矩阵 $\mathbf{R}$ 可以通过矩阵指数形式表示：

$$
\mathbf{R} = e^{\mathbf{K}\theta}
$$

其中，$\mathbf{K}$ 是 $\mathbf{k}$ 对应的反对称矩阵（叉积矩阵）：

$$
\mathbf{K} = \begin{pmatrix}
0 & -k_z & k_y \\
k_z & 0 & -k_x \\
-k_y & k_x & 0 \\
\end{pmatrix}
$$

### 6.2 矩阵指数的泰勒展开

矩阵指数可以展开为：

$$
e^{\mathbf{K}\theta} = \mathbf{I} + \mathbf{K}\theta + \frac{1}{2!}(\mathbf{K}\theta)^2 + \frac{1}{3!}(\mathbf{K}\theta)^3 + \cdots
$$

由于 $\mathbf{K}$ 的性质（$\mathbf{K}$ 是反对称矩阵，且 $\mathbf{K}^3 = -\mathbf{K}\theta^2$），我们可以将高次项进行合并。

### 6.3 计算 $\mathbf{K}$ 的幂

利用 $\mathbf{K}$ 的性质：

- **反对称性**：$\mathbf{K}^\mathrm{T} = -\mathbf{K}$
- **平方性质**：$\mathbf{K}^2 = -(\mathbf{k} \cdot\mathbf{k})\mathbf{I} + \mathbf{k}\mathbf{k}^\mathrm{T}$，由于 $\mathbf{k}$ 是单位向量，因此 $\mathbf{k} \cdot\mathbf{k} = 1$，所以：

$$
\mathbf{K}^2 = -\mathbf{I} + \mathbf{k}\mathbf{k}^\mathrm{T}
$$

- **更高次幂**：

$$
\mathbf{K}^3 = \mathbf{K} \cdot\mathbf{K}^2 = \mathbf{K}(-\mathbf{I} + \mathbf{k}\mathbf{k}^\mathrm{T}) = -\mathbf{K} + \mathbf{K}\mathbf{k}\mathbf{k}^\mathrm{T}
$$

  由于 $\mathbf{K}\mathbf{k} = \mathbf{0}$（因为 $\mathbf{K}$ 与 $\mathbf{k}$ 平行），所以 $\mathbf{K}^3 = -\mathbf{K}$。

其中，$\mathbf{I}$ 是单位矩阵，$\mathbf{k}\mathbf{k}^\mathrm{T}$ 是 $\mathbf{k}$ 的外积矩阵。

### 6.4 合并矩阵指数

将矩阵指数展开，并利用 $\mathbf{K}$ 的幂次性质：

$$
\begin{align*}
e^{\mathbf{K}\theta} &= \mathbf{I} + \mathbf{K}\theta + \frac{1}{2!}(\mathbf{K}\theta)^2 + \frac{1}{3!}(\mathbf{K}\theta)^3 + \cdots \\
&= \mathbf{I} + \mathbf{K}\theta - \frac{1}{2!}(\mathbf{I} - \mathbf{k}\mathbf{k}^\mathrm{T})\theta^2 - \frac{1}{3!}\mathbf{K}\theta^3 + \cdots
\end{align*}
$$

将同类项合并，得到：

$$
e^{\mathbf{K}\theta} = \mathbf{I} + \sin\theta \mathbf{K} + (1 - \cos\theta)(\mathbf{k}\mathbf{k}^\mathrm{T} - \mathbf{I})
$$

### 6.5 应用于向量 $\mathbf{v}$

旋转后的向量为：

$$
\mathbf{v'} = e^{\mathbf{K}\theta} \mathbf{v}
$$

展开得：

$$
\begin{align*}
\mathbf{v'} &= \left( \mathbf{I} + \sin\theta \mathbf{K} + (1 - \cos\theta)(\mathbf{k}\mathbf{k}^\mathrm{T} - \mathbf{I}) \right) \mathbf{v} \\
&= \mathbf{v} + \sin\theta \mathbf{K}\mathbf{v} + (1 - \cos\theta)(\mathbf{k}\mathbf{k}^\mathrm{T}\mathbf{v} - \mathbf{v})
\end{align*}
$$

### 6.6 简化各项

1. **第一项**：$\mathbf{v}$
2. **第二项**：$\sin\theta \mathbf{K}\mathbf{v} = \sin\theta (\mathbf{k} \times \mathbf{v})$
3. **第三项**：

   $$
   (1 - \cos\theta)(\mathbf{k}\mathbf{k}^\mathrm{T}\mathbf{v} - \mathbf{v}) = (1 - \cos\theta)(\mathbf{k}(\mathbf{k} \cdot \mathbf{v}) - \mathbf{v})
   $$

### 6.7 合并所有项

将所有项相加：

$$
\begin{align*}
\mathbf{v'} &= \mathbf{v} + \sin\theta (\mathbf{k} \times \mathbf{v}) + (1 - \cos\theta)(\mathbf{k}(\mathbf{k} \cdot \mathbf{v}) - \mathbf{v}) \\
&= \mathbf{v} - (1 - \cos\theta)\mathbf{v} + (1 - \cos\theta)\mathbf{k}(\mathbf{k} \cdot \mathbf{v}) + \sin\theta (\mathbf{k} \times \mathbf{v}) \\
&= \mathbf{v}\cos\theta + (\mathbf{k} \times \mathbf{v})\sin\theta + \mathbf{k}(\mathbf{k} \cdot \mathbf{v})(1 - \cos\theta)
\end{align*}
$$

这就是罗德里格斯旋转公式。

## 7. 几何直观

- **平行分量保持不变**：$\mathbf{v}_{\parallel}$ 沿旋转轴方向，不受旋转影响。
- **垂直分量旋转**：$\mathbf{v}_{\perp}$ 在垂直于 $\mathbf{k}$ 的平面内旋转角度 $\theta$。
- **叉积的作用**：$\mathbf{k} \times \mathbf{v}$ 给出了 $\mathbf{v}$ 在平面内旋转的方向，结合 $\sin\theta$ 达到旋转 $\theta$ 的效果。
<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=113481625898854&bvid=BV1KHmDYmE2J&cid=26759530908&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

