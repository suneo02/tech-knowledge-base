# report-preview-ui 架构说明

## 目录职责
本模块是专门为 `report-preview` 应用提供 UI 组件的库，包含了报告预览页面的布局、组件和样式。

## 目录结构
```
├── src/                      # 组件库源代码
│   ├── components/           # 报告预览相关的 UI 组件
│   ├── layout/               # 报告布局组件
│   └── index.ts              # 模块主入口，统一导出
├── dist/                     # Vite 打包后的产物
├── .storybook/               # Storybook 组件文档配置
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/components/**: 存放构成报告内容的原子级 UI 组件。
- **src/layout/**: 存放用于组织报告整体结构的布局组件。
- **.storybook/**: 用于隔离开发和展示报告预览组件。

## 模块依赖
- **report-util**: 依赖报告相关的工具函数。
- **detail-page-config**: 依赖详情页的配置信息。
- **gel-ui**: 依赖通用的基础 UI 组件。
- **gel-api**: 依赖 API 层获取报告数据。
- 主要被 `apps/report-preview` 应用所依赖。
