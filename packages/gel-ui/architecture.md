# gel-ui 架构说明

## 目录职责
本模块是项目通用的 UI 组件库，提供了跨应用共享的 React 组件、Hooks 和样式（Less 变量和 mixin）。

## 目录结构
```
├── src/                      # 组件库源代码
│   ├── biz/                  # 业务相关的通用组件
│   ├── common/               # 基础通用组件
│   ├── hooks/                # 通用 React Hooks
│   ├── styles/               # 共享样式文件
│   └── index.ts              # 模块主入口，统一导出
├── dist/                     # Vite 打包后的产物
├── .storybook/               # Storybook 组件文档配置
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/biz/**: 存放与特定业务领域相关的、但可在多个应用中复用的组件。
- **src/common/**: 存放与业务无关的基础组件，如按钮、表格、布局等。
- **src/styles/**: 存放共享的 Less 变量、mixin 等样式资源。
- **package.json**: `exports` 字段定义了多个入口点，允许按需导入组件和样式文件。

## 模块依赖
- **gel-api**: 依赖 API 请求层进行数据交互。
- **gel-util**: 依赖共享工具函数。
- **gel-types**: 依赖共享的 TypeScript 类型。
- **antd, @wind/wind-ui**: 作为基础 UI 组件库。
- 被几乎所有应用所依赖。
