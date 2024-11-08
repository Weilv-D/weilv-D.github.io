---
slug: laplace-trans
title: 拉普拉斯变换
description: 拉普拉斯变换是一种强大的数学工具，用于将时间域信号转换为复频域信号，从而简化微分方程的求解过程。
image: ../attachments/laplas.jpg
date: 2024-10-21T11:00:00+08:00
lastmod: 2024-10-21T11:00:00+08:00
hidden: false
tags:
  - 拉普拉斯变换
  - 高等数学
  - 自动控制原理
hide:
  - tags
  - readingTime
  - toc
  - comments
  - lastmod
  - comments
---
## 拉普拉斯变换简介 
拉普拉斯变换是一种积分变换，主要用于解决微分方程和差分方程。它将一个时间域中的函数$f(t)$转换为复频域中的函数$F(s)$。
拉普拉斯变换在工程学、物理学和数学中有着广泛的应用，特别是在控制系统理论和信号处理领域。 
## 定义 
对于一个定义在$[0, +\infty)$上的函数$f(t)$，其拉普拉斯变换定义为： $F(s) = \mathcal{L}\{f(t)\} = \int_0^\infty e^{-st} f(t) \, dt$ 其中，$s$ 是复变量，通常表示为 $s = \sigma + j\omega$，其中 $\sigma$ 和 $\omega$ 分别是实部和虚部。 
## 性质 
1. **线性性质**： 如果 $\mathcal{L}\{f(t)\} = F(s)$ 和 $\mathcal{L}\{g(t)\} = G(s)$，则 $\mathcal{L}\{a f(t) + b g(t)\} = a F(s) + b G(s)$ 其中，$a$ 和 $b$ 是常数。
   - **证明**：利用拉普拉斯变换的定义：
     $$ 
     \mathcal{L}\{a f(t) + b g(t)\} = \int_0^\infty (a f(t) + b g(t)) e^{-st} \, dt 
     $$ 
     $$ 
     = a \int_0^\infty f(t) e^{-st} \, dt + b \int_0^\infty g(t) e^{-st} \, dt 
     $$  
     $$ 
     = a F(s) + b G(s) 
     $$  

2. **时移性质**： 如果 $\mathcal{L}\{f(t)\} = F(s)$，则 $\mathcal{L}\{f(t - a) u(t - a)\} = e^{-as} F(s)$ 其中，$u(t)$ 是单位阶跃函数。
   - **证明**：利用拉普拉斯变换的定义和变量替换：
     $$ 
     \mathcal{L}\{f(t - a) u(t - a)\} = \int_0^\infty f(t - a) u(t - a) e^{-st} \, dt 
     $$  
     令 $\tau = t - a$，则 $d\tau = dt$，当 $t = a$ 时，$\tau = 0$，当 $t \to \infty$ 时，$\tau \to \infty$：
     $$ 
     = \int_0^\infty f(\tau) e^{-s(\tau + a)} \, d\tau 
     $$  
     $$ 
     = e^{-as} \int_0^\infty f(\tau) e^{-s\tau} \, d\tau 
     $$  
     $$ 
     = e^{-as} F(s) 
     $$  

3. **频移性质**： 如果 $\mathcal{L}\{f(t)\} = F(s)$，则 $\mathcal{L}\{e^{at} f(t)\} = F(s - a)$ 
   - **证明**：利用拉普拉斯变换的定义和变量替换：
     $$ 
     \mathcal{L}\{e^{at} f(t)\} = \int_0^\infty e^{at} f(t) e^{-st} \, dt 
     $$  
     $$ 
     = \int_0^\infty f(t) e^{-(s - a)t} \, dt 
     $$  
     $$ 
     = F(s - a) 
     $$  

4. **微分性质**： 如果 $\mathcal{L}\{f(t)\} = F(s)$，则 $\mathcal{L}\{f'(t)\} = sF(s) - f(0)$ $\mathcal{L}\{f''(t)\} = s^2 F(s) - sf(0) - f'(0)$ 
   - **证明**：利用分部积分法：
     $$ 
     \mathcal{L}\{f'(t)\} = \int_0^\infty f'(t) e^{-st} \, dt 
     $$  
     令 $u = e^{-st}$，$dv = f'(t) dt$，则 $du = -se^{-st} dt$，$v = f(t)$：
     $$ 
     = \left[ f(t) e^{-st} \right]_0^\infty + s \int_0^\infty f(t) e^{-st} \, dt 
     $$  
     $$ 
     = -f(0) + sF(s) 
     $$  
     对于 $\mathcal{L}\{f''(t)\}$，同理可得：
     $$ 
     \mathcal{L}\{f''(t)\} = s \mathcal{L}\{f'(t)\} - f'(0) 
     $$  
     $$ 
     = s(sF(s) - f(0)) - f'(0) 
     $$  
     $$ 
     = s^2 F(s) - sf(0) - f'(0) 
     $$  

5. **积分性质**： 如果 $\mathcal{L}\{f(t)\} = F(s)$，则 $\mathcal{L}\left\{\int_0^t f(\tau) \, d\tau\right\} = \frac{1}{s} F(s)$ 
   - **证明**：利用拉普拉斯变换的定义和分部积分法：
     $$ 
     \mathcal{L}\left\{\int_0^t f(\tau) \, d\tau\right\} = \int_0^\infty \left( \int_0^t f(\tau) \, d\tau \right) e^{-st} \, dt 
     $$  
     令 $F(t) = \int_0^t f(\tau) \, d\tau$，则 $F'(t) = f(t)$：
     $$ 
     = \int_0^\infty F(t) e^{-st} \, dt 
     $$  
     利用分部积分法，令 $u = F(t)$，$dv = e^{-st} dt$，则 $du = f(t) dt$，$v = -\frac{1}{s} e^{-st}$：
     $$ 
     = \left[ F(t) \left( -\frac{1}{s} e^{-st} \right) \right]_0^\infty + \frac{1}{s} \int_0^\infty f(t) e^{-st} \, dt 
     $$  
     $$ 
     = 0 + \frac{1}{s} F(s) 
     $$  
     $$ 
     = \frac{1}{s} F(s) 
     $$  

6. **卷积定理**： 如果 $\mathcal{L}\{f(t)\} = F(s)$ 和 $\mathcal{L}\{g(t)\} = G(s)$，则 $\mathcal{L}\{(f * g)(t)\} = F(s) G(s)$ 其中，$(f * g)(t) = \int_0^t f(\tau) g(t - \tau) \, d\tau$ 是 $f(t)$ 和 $g(t)$ 的卷积。
   - **证明**：利用拉普拉斯变换的定义和变量替换：
     $$ 
     \mathcal{L}\{(f * g)(t)\} = \int_0^\infty \left( \int_0^t f(\tau) g(t - \tau) \, d\tau \right) e^{-st} \, dt 
     $$  
     交换积分次序：
     $$ 
     = \int_0^\infty \int_0^t f(\tau) g(t - \tau) e^{-st} \, d\tau \, dt 
     $$  
     令 $u = t - \tau$，则 $du = dt$，当 $t = \tau$ 时，$u = 0$，当 $t \to \infty$ 时，$u \to \infty$：
     $$ 
     = \int_0^\infty f(\tau) \left( \int_0^\infty g(u) e^{-s(\tau + u)} \, du \right) \, d\tau 
     $$  
     $$ 
     = \int_0^\infty f(\tau) e^{-s\tau} \left( \int_0^\infty g(u) e^{-su} \, du \right) \, d\tau 
     $$  
     $$ 
     = F(s) G(s) 
     $$  

7. **初值定理**：如果 $f(t)$ 在 $t=0$ 处连续，则有： 
     $$ 
     \lim_{t \to 0^+} f(t) = \lim_{s \to \infty} sF(s) 
     $$  
   - **证明**：利用拉普拉斯变换的定义：
     $$ 
     \mathcal{L}\{f(t)\} = \int_0^\infty f(t) e^{-st} \, dt 
     $$  
     当 $s \to \infty$ 时，$e^{-st} \to 0$，则：
     $$ 
     sF(s) = s \int_0^\infty f(t) e^{-st} \, dt 
     $$  
     $$ 
     = \int_0^\infty f(t) s e^{-st} \, dt 
     $$  
     当 $t \to 0^+$ 时，$s e^{-st} \to 1$，则：
     $$ 
     \lim_{s \to \infty} sF(s) = f(0) 
     $$  

8. **终值定理**：如果 $\lim_{t \to \infty} f(t)$ 存在且有限，则有： 
     $$ 
     \lim_{t \to \infty} f(t) = \lim_{s \to 0} sF(s) 
     $$  
   注：极限必须存在
   - **证明**：利用拉普拉斯变换的定义：
     $$ 
     \mathcal{L}\{f(t)\} = \int_0^\infty f(t) e^{-st} \, dt 
     $$  
     当 $s \to 0$ 时，$e^{-st} \to 1$，则：
     $$ 
     sF(s) = s \int_0^\infty f(t) e^{-st} \, dt 
     $$  
     $$ 
     = \int_0^\infty f(t) s e^{-st} \, dt 
     $$  
     当 $t \to \infty$ 时，$s e^{-st} \to 0$，则：
     $$ 
     \lim_{s \to 0} sF(s) = \lim_{t \to \infty} f(t) 
     $$  
## 常见函数的拉普拉斯变换

| 函数 $f(t)$ | 拉普拉斯变换 $\mathcal{L}\{f(t)\}$ |
|-------------|------------------------------------|
| 单位阶跃函数 $u(t)$ | $\frac{1}{s}$ |
| 指数函数 $e^{-at}$ | $\frac{1}{s + a}$ |
| 正弦函数 $\sin(bt)$ | $\frac{b}{s^2 + b^2}$ |
| 余弦函数 $\cos(bt)$ | $\frac{s}{s^2 + b^2}$ |
| 幂函数 $t^n$ | $\frac{n!}{s^{n+1}}$ |
| $\delta$ 函数 | $1$ |
| $n$ 阶导数 $f^{(n)}(t)$ | $s^n F(s) - s^{n-1}f(0) - s^{n-2}f'(0) - \cdots - sf^{(n-2)}(0) - f^{(n-1)}(0)$ |
| 多次积分 $\int_0^t \int_0^{t_1} \cdots \int_0^{t_{n-1}} f(t_n) dt_n \cdots dt_1$ | $\frac{1}{s^n}F(s)$ |  


#### 1. 单位阶跃函数 $u(t)$ 
单位阶跃函数定义为： $u(t) = \begin{cases} 0 & t < 0 \\ 1 & t \geq 0 \end{cases}$ 其拉普拉斯变换为: $$\mathcal{L}\{u(t)\} = \int_0^\infty e^{-st} \cdot 1 \, dt = \left[ -\frac{1}{s} e^{-st} \right]_0^\infty = \frac{1}{s}$$
#### 2. 指数函数 $e^{-at}$ 
对于指数衰减函数 $e^{-at}$，其拉普拉斯变换为： $$\mathcal{L}\{e^{-at}\} = \int_0^\infty e^{-st} e^{-at} \, dt = \int_0^\infty e^{-(s+a)t} \, dt = \left[ -\frac{1}{s+a} e^{-(s+a)t} \right]_0^\infty = \frac{1}{s + a}$$
#### 3. 正弦函数 $\sin(bt)$ 
正弦函数的拉普拉斯变换可以通过欧拉公式 $e^{ix} = \cos(x) + i\sin(x)$ 获得： $$\mathcal{L}\{\sin(bt)\} = \mathcal{L}\left\{\frac{e^{ibt} - e^{-ibt}}{2i}\right\} = \frac{1}{2i} \left( \frac{1}{s-ib} - \frac{1}{s+ib} \right) = \frac{b}{s^2 + b^2} $$ 
#### 4. 余弦函数 $\cos(bt)$
类似地，余弦函数的拉普拉斯变换为： $$\mathcal{L}\{\cos(bt)\} = \mathcal{L}\left\{\frac{e^{ibt} + e^{-ibt}}{2}\right\} = \frac{1}{2} \left( \frac{1}{s-ib} + \frac{1}{s+ib} \right) = \frac{s}{s^2 + b^2}$$ 
#### 5. 幂函数 $t^n$
幂函数的拉普拉斯变换可以使用分部积分法得到： $\mathcal{L}\{t^n\} = \int_0^\infty t^n e^{-st} \, dt$ 通过分部积分，我们有： $$\mathcal{L}\{t^n\} = \left[ -\frac{t^n}{s} e^{-st} \right]_0^\infty + \frac{n}{s} \int_0^\infty t^{n-1} e^{-st} \, dt = \frac{n}{s} \mathcal{L}\{t^{n-1}\}$$ 递归应用此结果直到 $n=0$，最终得到： $\mathcal{L}\{t^n\} = \frac{n!}{s^{n+1}}$ 
#### 6. $\delta$ 函数 
$\delta$ 函数（狄拉克δ函数）是一个广义函数，表示一个在所有点上都为零，但在原点处无限高的脉冲。它的拉普拉斯变换为： $$\mathcal{L}\{\delta(t)\} = \int_{-\infty}^{\infty} \delta(t) e^{-st} \, dt = 1$$ 这是因为 $\delta(t)$ 在 $t=0$ 时的积分等于$1$。 
#### 7. $n$ 阶导数
$n$ 阶导数的拉普拉斯变换考虑了初始条件，表达式如下： $$\mathcal{L}\{f^{(n)}(t)\} = s^n F(s) - s^{n-1}f(0) - s^{n-2}f'(0) - \cdots - sf^{(n-2)}(0) - f^{(n-1)}(0)$$ 这里，$F(s)$ 是 $f(t)$ 的拉普拉斯变换，$f(0), f'(0), \ldots, f^{(n-1)}(0)$ 是 $f(t)$ 及其各阶导数在 $t=0$ 时的值。 
#### 8.多次积分
对于多次积分，其拉普拉斯变换可以表示为： $$\mathcal{L}\left\{\int_0^t \int_0^{t_1} \cdots \int_0^{t_{n-1}} f(t_n) dt_n \cdots dt_1\right\} = \frac{1}{s^n}F(s)$$ 这里 $F(s)$ 是 $f(t)$ 的拉普拉斯变换。这个结果可以通过重复应用拉普拉斯变换的一阶积分性质来证明。一阶积分的拉普拉斯变换是 $\mathcal{L}\left\{\int_0^t f(\tau)d\tau\right\} = \frac{1}{s}F(s)$，因此对于 $n$ 次积分，就是将这个过程重复 $n$ 次，从而得到上述结果。  
  
  