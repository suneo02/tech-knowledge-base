# 🖼️ `report-preview-ui` - 配置驱动的报告预览React组件库

## 📋 简介

独立的 React 组件库，将 JSON 配置和业务数据转换为功能丰富的报告预览界面。采用配置驱动和分层解耦的设计理念，支持信用报告和尽调报告等多种报告类型。

## 🚀 快速开始

```bash
# 安装
pnpm add report-preview-ui

# 使用
import { CreditRPPreviewComp } from 'report-preview-ui';
import 'report-preview-ui/dist/style.css';
```

## 📚 文档

| 文档 | 描述 |
|------|------|
| [概述](./docs/overview.md) | 项目定位、核心理念、设计目的 |
| [架构设计](./docs/architecture.md) | 三层架构、数据流、设计模式 |
| [使用指南](./docs/usage.md) | API 参考、开发配置、注意事项 |

## 🏗️ 核心特性

- **配置驱动**: 通过 JSON 配置控制 UI 结构和内容
- **分层解耦**: 三层架构（入口层、布局层、渲染层）
- **高可复用**: 支持多平台集成和组件复用
- **独立开发**: 基于 Storybook 的组件开发环境

## 🔗 核心依赖

- `@wind/wind-ui` - UI 基础组件
- `detail-page-config` - 页面配置数据源
- `gel-api` - API 通信层
- `report-util` - 通用工具函数

## 📦 主要组件

- `CreditRPPreviewComp` - 信用报告预览
- `DDRPPreviewComp` - 尽调报告预览
- `RPPreviewComp` - 通用预览容器

> **注意**: 内部包，依赖公司内部 NPM 包，需正确配置依赖环境。
