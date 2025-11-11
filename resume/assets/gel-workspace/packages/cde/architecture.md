# cde 架构说明

## 目录职责
(职责待定) 本模块的具体功能和用途需要进一步明确。从依赖关系看，它是一个供多个应用使用的共享 React 组件库。

## 目录结构
```
├── src/                      # 组件库源代码
│   ├── components/           # UI 组件
│   ├── hooks/                # React Hooks
│   └── index.ts              # 模块主入口，统一导出
├── dist/                     # Vite 打包后的产物
├── .storybook/               # Storybook 组件文档配置
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/**: 包含了该模块的 React 组件、Hooks 和其他逻辑。
- **.storybook/**: 用于隔离开发和展示 UI 组件。
- **vite.config.ts**: 将组件库打包为标准 JS 模块的配置文件。

## 模块依赖
- **gel-ui**: 依赖通用 UI 组件。
- **gel-api**: 依赖 API 请求封装。
- **gel-util**: 依赖共享工具函数。
- 被 `apps/ai-chat`, `apps/company` 等应用所依赖。
