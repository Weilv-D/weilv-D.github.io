---
slug: autonomous-exploration-development-environment_part_1
title: 自主探索——Autonomous Exploration Development Environment笔记（一）
description: 深入了解 CMU Autonomous Exploration Development Environment 的代码结构和实现细节
image: ../attachments/method.png 
date: 2024-10-23T21:30:47+08:00
lastmod: 2024-10-23T21:30:47+08:00
hidden: false 
tags:
  - code
  - CMU
  - 自主探索
  - ROS
hide: 
  - lastmod
  - tags
  - toc
  - comments
---
[官方文档](https://www.cmu-exploration.com/)
[官方github](https://github.com/HongbiaoZ/autonomous_exploration_development_environment)

## 简介
CMU机器人研究所于2021年7月开源了一套完整的移动机器人自主导航和探索框架,旨在为地面自主导航和探索提供系统开发和机器人部署支持。  
包含各种仿真环境、自主导航模块（如避障、地形可通行性分析、路径跟随等）以及一套可视化工具，用户可以开发自主导航系统，并将这些系统移植到真实机器人上进行部署。

## Qick Start
###  1. 安装依赖
该库已在 Ubuntu 18.04（ROS Melodic）和 Ubuntu 20.04（ROS Noetic）上测试。
> ```bash
> sudo apt update
> sudo apt install libusb-dev  
> ```  

###  2. 克隆开源库
> ```bash
> git clone https://github.com/HongbiaoZ/autonomous_exploration_development_environment.git  
> ```  

###  3. 切换到与计算机设置匹配的分支并编译
> ```bash
> cd autonomous_exploration_development_environment
> git checkout distribution  # 将 'distribution' 替换为 'melodic' 或 'noetic'
> catkin_make  
> ```  

###  4. 下载仿真环境
如果脚本未能启动下载，用户可以手动下载[仿真环境](https://drive.google.com/file/d/1GMT8tptb3nAb87F8eFfmIgjma6Bu0reV/view)并将文件解压到 src/vehicle_simulator/meshes 目录中。
> ```bash
> ./src/vehicle_simulator/mesh/download_environments.sh  
> ```  

###  5. 运行仿真环境
该库包含多种类型和规模的仿真环境。要启动特定环境，
将 'environment' 替换为环境名称，如 'campus'、'indoor'、'garage'、'tunnel' 和 'forest'。  
> ```bash
> source devel/setup.sh
> roslaunch vehicle_simulator system_environment.launch  
> ```  

现在可以通过点击 RVIZ 中的 'Waypoint' 按钮并选择一个点来发送航点。车辆将导航到该航点，避开沿途的障碍物。Waypoint应在车辆附近且可到达。  
