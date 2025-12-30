---
title: 'ROS2 基本命令速查'
description: 'ROS2 Jazzy 核心命令快速上手，从节点管理到话题通信，一文掌握机器人开发必备技能。'
pubDate: '2025-12-30T12:00:00'
category: 'Tech'
tags: ['ROS2', '机器人', '开发']
---

ROS2 早已成为机器人领域的标准框架，其命令行工具是日常开发的核心武器。本文以 Jazzy 版本为例，梳理最常用的命令，助你快速上手。

## 环境准备

使用 ROS2 前，必须先加载环境变量：

```bash
source /opt/ros/jazzy/setup.bash
```

为避免每次手动执行，可将此命令加入 `~/.bashrc` 或 `~/.zshrc`。

## 节点管理

节点是 ROS2 的基本执行单元。

**运行节点：**

```bash
ros2 run <package_name> <executable_name>
```

例如启动小乌龟仿真：

```bash
ros2 run turtlesim turtlesim_node
ros2 run turtlesim turtle_teleop_key
```

**查看运行中的节点：**

```bash
ros2 node list
```

**查看节点详细信息：**

```bash
ros2 node info <node_name>
```

这会显示节点的订阅者、发布者、服务和动作服务器。

## 话题通信

话题是节点间异步通信的主要方式。

**列出所有话题：**

```bash
ros2 topic list
```

**查看话题消息类型：**

```bash
ros2 topic info <topic_name>
```

**查看话题实时数据：**

```bash
ros2 topic echo <topic_name>
```

**向话题发布消息：**

```bash
ros2 topic pub <topic_name> <message_type> "<message_content>"
```

例如控制小乌龟移动：

```bash
ros2 topic pub /turtle1/cmd_vel geometry_msgs/msg/Twist "{linear: {x: 1.0}, angular: {z: 0.5}}"
```

**查看话题频率：**

```bash
ros2 topic hz <topic_name>
```

## 服务调用

服务用于同步的请求-响应通信。

**列出所有服务：**

```bash
ros2 service list
```

**查看服务类型：**

```bash
ros2 service type <service_name>
```

**调用服务：**

```bash
ros2 service call <service_name> <service_type> "<request>"
```

例如重置小乌龟位置：

```bash
ros2 service call /reset std_srvs/srv/Empty
```

## 包管理

**列出已安装的包：**

```bash
ros2 pkg list
```

**查看包信息：**

```bash
ros2 pkg xml <package_name>
```

**创建新包：**

```bash
ros2 pkg create --build-type ament_cmake <package_name>
ros2 pkg create --build-type ament_python <package_name>
```

## 接口查看

**列出所有消息类型：**

```bash
ros2 interface list
```

**查看消息结构：**

```bash
ros2 interface show <message_type>
```

例如查看 Twist 消息结构：

```bash
ros2 interface show geometry_msgs/msg/Twist
```

## 参数系统

**列出节点参数：**

```bash
ros2 param list <node_name>
```

**获取参数值：**

```bash
ros2 param get <node_name> <parameter_name>
```

**设置参数值：**

```bash
ros2 param set <node_name> <parameter_name> <value>
```

## 守护进程

ROS2 守护进程负责管理节点间的通信。

**启动守护进程：**

```bash
ros2 daemon start
```

**停止守护进程：**

```bash
ros2 daemon stop
```

**查看守护进程状态：**

```bash
ros2 daemon status
```

## 实战示例

完整的开发流程通常是这样的：

```bash
# 1. 加载环境
source /opt/ros/jazzy/setup.bash

# 2. 启动节点
ros2 run turtlesim turtlesim_node &

# 3. 查看话题
ros2 topic list

# 4. 查看话题数据
ros2 topic echo /turtle1/cmd_vel

# 5. 发布控制命令
ros2 topic pub /turtle1/cmd_vel geometry_msgs/msg/Twist "{linear: {x: 1.0}, angular: {z: 0.5}}" --once

# 6. 调用服务
ros2 service call /reset std_srvs/srv/Empty
```

## 进阶技巧

**使用 Tab 补全：** 所有命令都支持 Tab 补全，善用可大幅提升效率。

**查看帮助：**

```bash
ros2 --help
ros2 <command> --help
```

**组合使用：** 可以将多个命令组合，例如：

```bash
ros2 topic list | grep /turtle
```

ROS2 的命令体系设计简洁而强大，掌握这些基础命令，便足以应对日常开发需求。深入理解每个命令背后的通信机制，才是成为高阶开发者的关键。
