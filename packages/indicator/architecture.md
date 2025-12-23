# indicator 架构说明

## 目录职责
本模块是一个用于展示各类“指标”的 UI 组件库，可能包括数据卡片、统计图表、状态灯等。

## 目录结构
```
├── src/                      # 组件库源代码
│   ├── components/           # 指标相关的 UI 组件
│   ├── hooks/                # 相关的 React Hooks
│   └── index.ts              # 模块主入口，统一导出
├── dist/                     # Vite 打包后的产物
├── .storybook/               # Storybook 组件文档配置
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/components/**: 存放用于展示各种指标数据的 React 组件。
- **src/hooks/**: 存放与指标数据获取或处理相关的 Hooks。
- **.storybook/**: 用于隔离开发和展示指标组件。

## 模块依赖
- **gel-ui**: 依赖通用 UI 组件库作为基础。
- **gel-api**: 依赖 API 层获取指标数据。
- **gel-util**: 依赖共享工具函数。
- 被 `apps/ai-chat` 等应用所依赖。
