# `report-preview` - 报告浏览器预览应用

## 📋 简介

基于 React 的单页应用，专门用于报告的浏览器端高保真预览。提供交互式目录、内容联动、动态标题等功能，支持所见即所得的实时预览体验。

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务
pnpm run dev:serve
```

访问 `http://localhost:3000?corpCode=xxx` 开始预览。

## 📚 文档

| 文档 | 描述 |
|------|------|
| [概述](./docs/overview.md) | 项目定位、核心功能介绍 |
| [架构设计](./docs/architecture.md) | 技术架构、分层设计、数据流 |
| [开发指南](./docs/development.md) | 本地开发、调试指南 |

## 🔗 相关项目

- `report-preview-ui` - UI 组件库
- `report-print` - PDF 生成应用
- `detail-page-config` - 报告配置数据源
- `report-util` - 通用工具函数

## 📍 定位

专门用于**浏览器预览**，与 PDF 生成分离，可充分利用现代 Web 技术。
